package com.wangyuan.gjol.music.io.gjm;

import com.wangyuan.gjol.music.io.MusicException;
import com.wangyuan.gjol.music.model.GJM;
import com.wangyuan.gjol.music.util.IFormat;
import com.wangyuan.gjol.music.util.Rule;
import com.wangyuan.gjol.music.util.fmt.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.lang.reflect.Field;
import java.util.*;

class Reflector {

    private static Logger log = LoggerFactory.getLogger(Reflector.class);

    @SuppressWarnings("unchecked")
    static class Item {
        private String name;
        private String[] alias;
        private Field field;
        private Class<?> type;
        private Rule rule;
        private IFormat fmt;
        private boolean repeat;

        Item(Field f, Rule r) throws Exception {
            this.field = f;
            this.rule = r;

            this.type = f.getType();

            this.name = r.value();
            this.alias = rule.alias();

            this.initFmt();

            this.field.setAccessible(true);
        }

        private void initFmt() throws IllegalAccessException, InstantiationException {
            Class<? extends IFormat> c = this.rule.fmt();
            if (c == EmptyFormat.class) {
                if (this.type == List.class) {
                    this.type = this.rule.realType();
                    this.repeat = true;
                } else if (this.type == String.class) {
                    this.fmt = StringFormat.INSTANCE;
                } else if (this.type == int.class || this.type == Integer.class) {
                    this.fmt = new IntegerFormat();
                } else if (this.type == float.class || this.type == Float.class) {
                    this.fmt = new FloatFormat();
                } else if (this.type == boolean.class || this.type == Boolean.class) {
                    this.fmt = new BooleanFormat();
                } else if (Enum.class.isAssignableFrom(this.type)) {
                    this.fmt = new CommonEnumFormat(this.type);
                }
            } else if (c == CommonEnumFormat.class) {
                this.fmt = new CommonEnumFormat(this.rule.realType());
            } else {
                this.fmt = c.newInstance();
            }
        }

        String name() {
            return this.name;
        }

        boolean isGJM() {
            return this.is(GJM.class);
        }

        boolean is(Class<?> c) {
            return c.isAssignableFrom(this.type);
        }

        boolean isRepeat() {
            return this.repeat;
        }

        GJM create() {
            if (this.isGJM()) {
                try {
                    return (GJM) this.type.newInstance();
                } catch (Exception e) {
                    log.error(e.getMessage(), e);
                }
            }
            return null;
        }

        void set(GJM gjm, Object v) throws MusicException {
            if (!this.isGJM()) {
                if (v instanceof String) {
                    v = this.fmt.parse((String) v);
                }
            }
            try {
                Object o = v;
                if (this.repeat) {
                    List<Object> list = (List<Object>) this.field.get(gjm);
                    if (list == null) {
                        list = new ArrayList<Object>();
                    }
                    list.add(o);
                    o = list;
                }
                this.field.set(gjm, o);
            } catch (IllegalAccessException e) {
                throw new MusicException(e.getMessage(), e);
            }
        }

        Object get(GJM gjm) throws MusicException {
            try {
                Object o = this.field.get(gjm);
                if (this.isGJM()) {
                    return o;
                }
                return this.fmt.format(o);
            } catch (IllegalAccessException e) {
                throw new MusicException(e.getMessage(), e);
            }
        }

        IFormat fmt() {
            return this.fmt;
        }
    }

    static class Reflect {

        private Class<? extends GJM> owner;
        private Map<String, Item> items = new LinkedHashMap<String, Item>();

        void add(Item item) {
            String name = item.name;
            this.items.put(name, item);
            for (String n : item.alias) {
                this.items.put(n, item);
            }
        }

        Item item(String name) {
            Item item = this.items.get(name);
            if (item == null) {
                if (name.matches("\\[\\d+]")) {
                    item = this.items.get(GJM.REPEAT_NAME);
                }
            }
            return item;
        }

        Collection<Item> items() {
            return this.items.values();
        }
    }

    private static Map<Class<? extends GJM>, Reflect> cache = new HashMap<Class<? extends GJM>, Reflect>();

    static Reflect find(Class<? extends GJM> c) {
        Reflect r = cache.get(c);
        if (r == null) {
            r = new Reflect();
            r.owner = c;

            Field[] fs = c.getDeclaredFields();
            for (Field f : fs) {
                Rule rule = f.getAnnotation(Rule.class);
                if (rule == null) {
                    continue;
                }
                if (rule.ignore()) {
                    log.info("Ignore {}", f);
                    continue;
                }

                try {
                    r.add(new Item(f, rule));
                } catch (Exception e) {
                    log.error(e.getMessage(), e);
                }
            }
            cache.put(c, r);
        }
        return r;
    }

}
