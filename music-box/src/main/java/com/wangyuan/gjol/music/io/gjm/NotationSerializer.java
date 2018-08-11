package com.wangyuan.gjol.music.io.gjm;

import com.wangyuan.gjol.music.io.MusicException;
import com.wangyuan.gjol.music.model.GJM;
import com.wangyuan.gjol.music.model.v1.Group;
import com.wangyuan.gjol.music.model.v1.Notation;
import com.wangyuan.gjol.music.model.v1.Sign;
import com.wangyuan.gjol.music.model.v1.Tuple;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.Closeable;
import java.io.IOException;
import java.util.List;

public class NotationSerializer implements Closeable {

    private static Logger log = LoggerFactory.getLogger(NotationSerializer.class);

    private Notation notation;
    private GJMWriter writer;

    public NotationSerializer(Notation notation, GJMWriter writer) {
        this.notation = notation;
        this.writer = writer;
    }

    @SuppressWarnings("unchecked")
    private void writeGJM(GJM gjm, int lv) throws IOException, MusicException {
        boolean isSign = gjm instanceof Sign;
        if (isSign) {
            this.writer.disableNewLine(true);
        }

        Reflector.Reflect rr = Reflector.find(gjm.getClass());
        if (lv > 0) {
            this.writer.append("{").newLine();
        }
        for (Reflector.Item item : rr.items()) {
            Object v = item.get(gjm);
            if (item.isRepeat()) {
                if (v != null) {
                    List list = (List) v;
                    for (int i = 0, s = list.size(); i < s; i++) {
                        Object o = list.get(i);
                        this.writer.tab(lv).append("[");
                        if (item.is(Sign.class)) {
                            this.writer.append(String.valueOf(((Sign) o).getIndex()));
                        } else {
                            this.writer.append(String.valueOf(i));
                        }
                        this.writer.append("] = ");
                        this.writeGJM((GJM) o, lv + 1);
                    }
                }
            } else if (v == null) {
                //log.warn("{}#{} is NULL", gjm.getClass().getSimpleName(), item.name());
            } else {
                String name = item.name();

                if (isSign) {
                    this.writer.append(' ');
                } else {
                    this.writer.tab(lv);
                }
                this.writer.append(name).append(" = ");

                if (v instanceof String) {
                    this.writer.append((String) v);
                    if (lv > 0) {
                        this.writer.append(',');
                    }
                    this.writer.newLine();
                } else if (item.isGJM()) {
                    if (item.is(Group.class)) {
                        this.writer.append("{").newLine();
                        List<Tuple> ts = ((Group) v).getTuples();
                        if (ts != null) {
                            for (Tuple t : ts) {
                                this.writer.tab(lv + 1).append("{ ");
                                this.writer.append(String.valueOf(t.getIndex()));
                                Object val = t.getValue();
                                String ret = item.fmt().format(val);
                                this.writer.append(", ").append(ret);
                                this.writer.append(" },").newLine();
                            }
                        }
                        this.writer.tab(lv).append("},").newLine();
                    } else {
                        this.writeGJM((GJM) v, lv + 1);
                    }
                }
            }
        }
        if (isSign) {
            this.writer.disableNewLine(false);
        }

        if (lv > 0) {
            if (isSign) {
                this.writer.append(' ');
            } else {
                this.writer.tab(lv - 1);
            }
            this.writer.append("}");
            if (lv > 1) {
                this.writer.append(',');
            }
        }
        this.writer.newLine();
    }

    public void serialize() throws IOException {
        try {
            this.writeGJM(this.notation, 0);
        } catch (MusicException e) {
            throw new IOException(e);
        } finally {
            this.writer.close();
        }
    }

    public void close() throws IOException {
        this.writer.close();
    }
}
