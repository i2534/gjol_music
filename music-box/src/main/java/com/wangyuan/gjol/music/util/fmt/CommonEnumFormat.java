package com.wangyuan.gjol.music.util.fmt;

import com.wangyuan.gjol.music.util.IFormat;

public class CommonEnumFormat<E extends Enum<E>> implements IFormat<E> {

    private Class<E> cls;

    public CommonEnumFormat(Class<E> c) {
        this.cls = c;
    }

    public E parse(String v) {
        String r = StringFormat.INSTANCE.parse(v);
        if (r == null) {
            return null;
        }
        return Enum.valueOf(this.cls, r);
    }

    public String format(E e) {
        if (e == null) {
            return null;
        }
        return StringFormat.INSTANCE.format(e.toString());
    }

}
