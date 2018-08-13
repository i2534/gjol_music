package com.wangyuan.gjol.music.io.mxl;

import com.wangyuan.gjol.music.model.v1.*;
import com.wangyuan.gjol.music.model.v1.enums.*;
import com.wangyuan.gjol.music.util.Helper;
import org.dom4j.Document;
import org.dom4j.DocumentException;
import org.dom4j.Element;
import org.dom4j.io.SAXReader;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.xml.sax.EntityResolver;
import org.xml.sax.InputSource;
import org.xml.sax.SAXException;

import java.io.File;
import java.io.IOException;
import java.io.StringReader;
import java.util.*;

public class MXLReader implements EntityResolver {

    private static Logger log = LoggerFactory.getLogger(MXLReader.class);

    private static final String ROOT_NAME = "score-partwise";

    private static class Fee extends ForEach<Element> {
        Fee(Iterator<Element> it) {
            super(it);
        }
    }

    private static List<String> NOTES = new ArrayList<String>();
    private static float[] VOLUME = new float[]{1F, 0.8F, 0.4F, 0.5F, 0.8F, 0.7F, 0.4F, 0.3F};

    static {
        NOTES.addAll(Arrays.asList("C", "D", "E", "F", "G", "A", "B"));
    }

    private Notation notation;
    private Part[] parts;
    private int lastStaff = 1;

    private int lastRepeatStart = 0;
    private boolean skipOn = false;
    private Set<Integer> repeatSkip;

    private Part newPart(boolean misc) {
        Part part = new Part();

        Group<InstrumentType> itg = new Group<InstrumentType>();
        part.setInstrumentType(itg);
        itg.addTuple(new Tuple<InstrumentType>(0, misc ? InstrumentType.Misc : InstrumentType.Piano));

        Group<Float> vg = new Group<Float>();
        part.setVolume(vg);
        vg.addTuple(new Tuple<Float>(0, 1F));

        Group<float[]> vcg = new Group<float[]>();
        part.setVolumeCurve(vcg);
        vcg.addTuple(new Tuple<float[]>(0, VOLUME));

        part.setMeasures(new ArrayList<Measure>());

        return part;
    }

    private int size(Collection<?> c) {
        return c == null ? 0 : c.size();
    }

    public Notation read(File file) throws DocumentException {
        SAXReader reader = new SAXReader();
        reader.setEntityResolver(this);
        Document document = reader.read(file);
        Element root = document.getRootElement();
        String name = root.getName();

        if (!ROOT_NAME.equals(name)) {
            throw new DocumentException("Document root must be " + ROOT_NAME);
        }

        String version = root.attributeValue("version");
        log.debug("MusicXML version is {}", version);

        this.notation = new Notation();
        Info info = new Info();
        info.setName("未知名称");
        info.setAuthor("未知作者");
        info.setCreator("未知录入");
        info.setTranslater(this.getClass().getSimpleName());
        this.notation.setInfo(info);

        this.work(root.element("work"));
        this.identification(root.element("identification"));

        List<String> list = this.partList(root.element("part-list"));
        if (list == null || list.isEmpty()) {
            throw new DocumentException("Not found any part-list ???");
        }
        Track track = new Track();
        this.notation.setTrack(track);
        track.setHigh(this.newPart(false));
        track.setBass(this.newPart(false));
        track.setMisc(this.newPart(true));

        this.parts = new Part[]{
                track.getHigh(), track.getBass(), track.getMisc()
        };

        this.repeatSkip = new LinkedHashSet<Integer>();

        for (String pid : list) {
            this.part((Element) root.selectSingleNode("part[@id='" + pid + "']"));
        }

        int size = this.size(this.parts[0].getMeasures());
        this.replenish(this.parts[1], size, false);
        this.replenish(this.parts[2], size, true);

        info.setMeasureAlignedCount(size);

        return this.notation;
    }

    private void replenish(Part part, int count, boolean misc) {
        if (part.getKeySignature() == null) {
            Group<KeySignature> ksg = new Group<KeySignature>();
            part.setKeySignature(ksg);
            ksg.addTuple(new Tuple<KeySignature>(0, KeySignature.C));
        }
        if (part.getClefType() == null) {
            Group<ClefType> ctg = new Group<ClefType>();
            part.setClefType(ctg);
            ctg.addTuple(new Tuple<ClefType>(0, misc ? ClefType.L4F : ClefType.L2G));
        }

        this.fillEmptyMeasures(part, count);
    }

    private void fillEmptyMeasures(Part part, int count) {
        List<Measure> list = part.getMeasures();
        if (list == null) {
            list = new ArrayList<Measure>();
            part.setMeasures(list);
        }
        for (int i = list.size(); i < count; i++) {
            list.add(new Measure());
        }
    }

    private void work(Element work) {
        if (work == null) return;
        String title = work.elementTextTrim("work-title");

        Info info = this.notation.getInfo();
        info.setName(title);
    }

    private void identification(Element identification) {
        if (identification == null) return;
        Info info = this.notation.getInfo();
        for (Element creator : new Fee(identification.elementIterator("creator"))) {
            String type = creator.attributeValue("type");
            String val = creator.getTextTrim();
            if ("composer".equals(type)) {//作曲
                info.setAuthor(val);
            } else if ("lyricist".equals(type)) {//作词
                info.setCreator(val);
            } else if ("arranger".equals(type)) {//编曲
                info.setCreator(val);
            }
        }
    }

    private List<String> partList(Element partList) {
        List<String> list = new ArrayList<String>();
        for (Element element : new Fee(partList.elementIterator("score-part"))) {
            String id = element.attributeValue("id");
            String name = element.elementTextTrim("part-name");
            log.debug("Part id is {}, name is {}", id, name);

            list.add(id);
        }
        return list;
    }

    private void part(Element part) {
        this.measure(new Fee(part.elementIterator("measure")));
    }

    private void measure(Fee measures) {
        for (Element me : measures) {
            String number = me.attributeValue("number");
            int count = measures.count(), index = count - 1;
            log.debug("Measure number is {}, index is {}", number, index);

            this.direction(new Fee(me.elementIterator("direction")));

            int staff = this.attributes(me.element("attributes"));
            if (staff == 0) {
                staff = this.lastStaff;
            } else {
                this.lastStaff = staff;
            }

            Measure[] column = new Measure[staff];
            for (int i = 0; i < staff; i++) {
                Measure m = new Measure();
                m.setNotes(new ArrayList<Note>());
                this.parts[i].getMeasures().add(m);
                column[i] = m;
            }

            for (Element ne : new Fee(me.elementIterator("note"))) {
                Tuple<Note> tuple = this.note(ne);

                int stf = tuple.getIndex();//staff index
                Note note = tuple.getValue();
                Measure m = column[stf - 1];
                List<Note> list = m.getNotes();

                Note last = null;
                if (list.isEmpty()) {
                    note.setStampIndex(0);
                } else {
                    last = list.get(list.size() - 1);
                    int i = last.getStampIndex();
                    DurationType type = last.getDurationType();
                    note.setStampIndex(i + 64 / type.val());
                }

                if (note.isChrod()) {
                    if (last == null) {
                        log.warn("First note is chrod ?");
                    } else {
                        List<Sign> ls = last.getPitch().getSigns();
                        ls.addAll(note.getPitch().getSigns());
                        last.setClassicPitchSignCount(this.size(ls));
                        continue;
                    }
                }

                note.setClassicPitchSignCount(this.size(note.getPitch().getSigns()));
                list.add(note);
            }
            for (Measure m : column) {
                m.setNoteCount(this.size(m.getNotes()));
            }

            String ret = this.barline(new Fee(me.elementIterator("barline")));
            if (ret.contains(">")) {
                this.lastRepeatStart = index;
            }
            if (ret.contains("+")) {
                this.skipOn = true;
            }
            if (this.skipOn) {
                this.repeatSkip.add(index);
            }
            if (ret.contains("-")) {
                this.skipOn = false;
            }

            if (ret.contains("<")) {
                int end = index, start = this.lastRepeatStart;
                log.debug("Repeat measure from {} to {}", start, end);

                for (Part part : this.parts) {
                    this.fillEmptyMeasures(part, count);

                    List<Measure> ms = part.getMeasures();
                    for (int i = start; i <= end; i++) {
                        if (this.repeatSkip.contains(i)) {
                            //log.debug(" but skip {}", i);
                            continue;
                        }
                        ms.add(ms.get(i));
                    }
                }
            }
        }
    }

    private String barline(Fee barlines) {
        StringBuilder ret = new StringBuilder();
        for (Element e : barlines) {
            Element repeat = e.element("repeat");
            if (repeat != null) {
                //String location = e.attributeValue("location");// left right middle
                String direction = repeat.attributeValue("direction");

                if ("forward".equals(direction)) {// |:
                    ret.append(">");
                } else if ("backward".equals(direction)) {// :|
                    ret.append("<");
                }
            }

            Element ending = e.element("ending");
            if (ending != null) {
                //String number = ending.attributeValue("number");
                String type = ending.attributeValue("type");//start stop discontinue
                if ("start".equals(type)) {
                    ret.append("+");
                } else if ("stop".equals(type)) {
                    ret.append("-");
                }
            }
        }
        return ret.toString();
    }

    private void direction(Fee directions) {
        for (Element direction : directions) {
            int tempo = 0;
            Element sound = direction.element("sound");
            if (sound != null) {
                String v = sound.attributeValue("tempo");
                if (v != null) {
                    tempo = Helper.intVal(v);
                }
            }
            if (tempo == 0) {
                for (Element element : new Fee(direction.elementIterator("direction-type"))) {
                    Element metronome = element.element("metronome");
                    if (metronome == null) {
                        continue;
                    }
                    String pm = metronome.elementTextTrim("per-minute");
                    if (pm != null) {
                        tempo = Helper.intVal(pm);
                        break;
                    }
                }
            }

            if (tempo > 0) {
                Info info = this.notation.getInfo();
                Group<Integer> group = info.getBeatsPerMinute();
                if (group == null) {
                    group = new Group<Integer>();
                    info.setBeatsPerMinute(group);
                }
                group.addTuple(new Tuple<Integer>(this.size(this.parts[0].getMeasures()), tempo));
                break;
            }
        }
    }

    private int attributes(Element attributes) {
        if (attributes == null) return 0;
        int staff = 0;//音部数量
        String staves = attributes.elementTextTrim("staves");
        if (staves != null) {
            staff = Helper.intVal(staves);
        }
        if (staff > 3) {
            staff = 3;
            log.warn("GJM support three parts only!");
        }

        Element key = attributes.element("key");
        if (key != null) {
            String fifths = key.elementTextTrim("fifths");
            if (fifths != null) {
                KeySignature ks = KeySignature.of(Helper.intVal(fifths));
                if (ks != null) {
                    for (int i = 0; i < staff; i++) {
                        Part part = this.parts[i];
                        Group<KeySignature> group = part.getKeySignature();
                        if (group == null) {
                            group = new Group<KeySignature>();
                            part.setKeySignature(group);
                        }
                        group.addTuple(new Tuple<KeySignature>(this.size(part.getMeasures()), ks));
                    }
                } else {
                    log.warn("Key {} is not mapping", fifths);
                }
            }
        }
        Element time = attributes.element("time");
        if (time != null) {
            String beats = time.elementTextTrim("beats");
            if (beats != null) {
                this.notation.getInfo().setBeatsPerMeasure(Helper.intVal(beats));
            }
            String beatType = time.elementTextTrim("beat-type");
            if (beatType != null) {
                int i = Helper.intVal(beatType);
                DurationType type = DurationType.of(i);
                if (type != null) {
                    this.notation.getInfo().setBeatDurationType(type);
                } else {
                    log.warn("Beat type {} is not mapping", beatType);
                }
            }
        }

        Fee clef = new Fee(attributes.elementIterator("clef"));
        for (Element element : clef) {
            String val = element.elementTextTrim("sign");
            ClefType type = ClefType.of(val);
            if (type == null) {
                log.warn("Clef type {} is not mapping", val);
            } else {
                int i = clef.count() - 1;
                Part part = this.parts[i];
                Group<ClefType> group = part.getClefType();
                if (group == null) {
                    group = new Group<ClefType>();
                    part.setClefType(group);
                }
                group.addTuple(new Tuple<ClefType>(this.size(part.getMeasures()), type));
            }
        }

        return staff;
    }

    private Tuple<Note> note(Element ne) {
        Tuple<Note> tuple = new Tuple<Note>();
        Note note = new Note();
        Pitch pitch = new Pitch();
        ArrayList<Sign> list = new ArrayList<Sign>();
        pitch.setSigns(list);
        note.setPitch(pitch);

        String type = ne.elementTextTrim("type");
        if (type != null) {
            DurationType dt = DurationType.of(MXLUtils.noteType(type));
            if (dt == null) {
                log.warn("Duration type {} is not mapping", type);
            } else {
                note.setDurationType(dt);
            }
        }

        note.setChrod(ne.element("chord") != null);//和弦, GJM支持最多4个音

        int index = 1;
        String staff = ne.elementTextTrim("staff");
        if (staff != null) {
            index = Helper.intVal(staff);
        }
        //String duration = ne.elementTextTrim("duration");
        //String beam = ne.elementTextTrim("beam"); //begin continue end

        if (ne.element("dot") != null) {//dot, GJM只支持一个 dot节点出现几次,即为几个dot
            note.setDotted(true);
        }
        Element tie = ne.element("tie");//延音标记
        if (tie != null) {
            String tt = tie.attributeValue("type");
            if ("start".equals(tt)) {
                note.setTieType(TieType.Start);
            } else if ("stop".equals(tt)) {
                note.setTieType(TieType.End);
            } else {
                log.warn("Tie type {} is not mapping", tt);
            }
        } else {
            for (Element notations : new Fee(ne.elementIterator("notations"))) {
                for (Element element : new Fee(notations.elementIterator())) {
                    String name = element.getName();
                    if ("tied".equals(name) || "slur".equals(name)) {//延音和连音在GJM为一种
                        String et = element.attributeValue("type");
                        if ("start".equals(et)) {
                            note.setTieType(TieType.Start);
                        } else if ("stop".equals(et)) {
                            note.setTieType(TieType.End);
                        }
                    }
                }
            }
        }

        if (ne.element("rest") != null) {//休止符
            note.setRest(true);

            if (type == null) {//没有类型,MusicXML默认为全休止符,但是这里不能这么做.否则在mb中会等待很长时间
                //note.setDurationType(DurationType.Whole);
            }

            //FIXME 这里在MusicXml中,只要休止,就不要音符,但是gjm中需要...随便给一个普通C
            Sign sign = new Sign();
            sign.setIndex(Sign.STANDARD_C);
            sign.setNumberedSign(1);
            sign.setPlayingPitchIndex(1);
            sign.setAlterantType(AlterantType.NoControl);
            list.add(sign);
        } else {
            Sign sign = this.pitch(ne.element("pitch"));
            if (sign != null) {
                list.add(sign);
                String accidental = ne.elementTextTrim("accidental");
                if (accidental != null) {
                    AlterantType at = MXLUtils.alterType(accidental);
                    if (at == null) {
                        log.warn("Alterant type {} is not mapping", type);
                    } else {
                        sign.setAlterantType(at);
                    }
                }
            }
        }
        tuple.setIndex(index);
        tuple.setValue(note);

        return tuple;
    }

    private Sign pitch(Element pitch) {
        String step = pitch.elementTextTrim("step");
        //String alter = pitch.elementTextTrim("alter");
        String octave = pitch.elementTextTrim("octave");

        int row = Helper.intVal(octave);
        int index = NOTES.indexOf(step);

        int v = Sign.VALUES[row][index];
        if (v <= 0) {
            log.error("Not found note {} at {}", step, octave);
            return null;
        } else {
            Sign sign = new Sign();
            sign.setIndex(v);
            sign.setNumberedSign(index + 1);
            sign.setPlayingPitchIndex(v);
            sign.setAlterantType(AlterantType.NoControl);

            //TODO volume 基本应该从VOLUME中查找位置,但是怎么换算呢 应该和 3/8 这样的分子分母一起算....

            return sign;
        }
    }

    public InputSource resolveEntity(String publicId, String systemId) throws SAXException, IOException {
        if (systemId.contains("http://www.musicxml.org/dtds/partwise.dtd")) {
            return new InputSource(new StringReader(""));
        } else {
            return null;
        }
    }
}
