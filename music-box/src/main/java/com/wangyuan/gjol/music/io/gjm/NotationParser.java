package com.wangyuan.gjol.music.io.gjm;

import com.wangyuan.gjol.music.io.MusicException;
import com.wangyuan.gjol.music.model.GJM;
import com.wangyuan.gjol.music.model.v1.Group;
import com.wangyuan.gjol.music.model.v1.Notation;
import com.wangyuan.gjol.music.model.v1.Sign;
import com.wangyuan.gjol.music.model.v1.Tuple;
import com.wangyuan.gjol.music.util.Helper;
import com.wangyuan.gjol.music.util.IFormat;
import com.wangyuan.gjol.music.util.fmt.StringFormat;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;

public class NotationParser {

    private static Logger log = LoggerFactory.getLogger(NotationParser.class);

    private GJMReader reader;

    public NotationParser(GJMReader reader) {
        this.reader = reader;
    }

    private void traversal(GJM gjm, int endLv) throws MusicException {
        while (this.reader.hasNext()) {
            int oldLv = this.reader.level();
            String line = this.reader.next();
            int newLv = this.reader.level();
            if (endLv == newLv) {
                return;
            }
            if (line.contains("=")) {
                Pair pair = new Pair(line);
                this.fill(gjm, oldLv, pair);
            } else {
                log.warn("What' wrong at {}", this.reader.lineNumber());
            }
        }
    }

    private void fill(GJM gjm, int lv, Pair pair) throws MusicException {
        Reflector.Reflect reflect = Reflector.find(gjm.getClass());
        String name = pair.key();
        Reflector.Item item = reflect.item(name);
        if (item == null) {
            int num = this.reader.lineNumber();
            int count = this.reader.skipEnd(lv);
            log.warn("Skip {}, from line {} to line {}", name, num, num + count);
        } else if (item.isGJM()) {
            if (item.is(Group.class)) {
                item.set(gjm, this.group(item.fmt()));
            } else if (item.is(Sign.class)) {
                Sign sign = this.sign(pair.val());
                String v = name.substring(1, name.length() - 1);
                sign.setIndex(Helper.intVal(v));
                item.set(gjm, sign);
            } else {
                GJM o = item.create();
                if (o == null) {
                    log.error("??????");
                } else {
                    this.traversal(o, lv);
                    item.set(gjm, o);
                }
            }
        } else {
            item.set(gjm, pair.val());
        }
    }

    @SuppressWarnings("unchecked")
    private Group group(IFormat<?> transfer) {
        Group group = new Group();
        int lv = this.reader.level() - 1;
        while (this.reader.hasNext()) {
            String line = this.reader.next();
            if (this.reader.level() == lv) {
                break;
            }
            String v = StringFormat.INSTANCE.parse(line);
            int index = v.indexOf(",");
            String b = Helper.trim(v.substring(0, index));
            String e = Helper.trim(v.substring(index + 1));
            Tuple<Object> tuple = new Tuple<Object>();
            tuple.setIndex(Helper.intVal(b));
            Object o = transfer.parse(e);
            tuple.setValue(o);
            group.addTuple(tuple);
        }
        return group;
    }

    private Sign sign(String v) throws MusicException {
        Sign sign = new Sign();
        String r = Helper.clean(v);
        String[] kvs = r.split(",");
        for (String kv : kvs) {
            Pair pair = new Pair(kv);
            this.fill(sign, 0, pair);
        }
        return sign;
    }

    public Notation parse() throws IOException {
        try {
            Notation notation = new Notation();
            this.traversal(notation, -1);
            return notation;
        } catch (MusicException e) {
            int num = this.reader.lineNumber();
            throw new IOException("LineNumber = " + num, e);
        } finally {
            this.reader.close();
        }
    }

}
