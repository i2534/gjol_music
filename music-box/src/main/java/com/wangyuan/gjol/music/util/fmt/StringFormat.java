package com.wangyuan.gjol.music.util.fmt;

import com.wangyuan.gjol.music.util.Helper;
import com.wangyuan.gjol.music.util.IFormat;

public class StringFormat implements IFormat<String> {

    public static final StringFormat INSTANCE = new StringFormat();

    public String parse(String s) {
        if (s == null) {
            return null;
        }
        String v = Helper.clean(s);
        if (v.startsWith("'") && v.endsWith("'")) {
            v = v.substring(1, v.length() - 1);
        }
        return v;
    }

    public String format(String s) {
        if (s == null) {
            return null;
        }
        return "'" + s + "'";
    }
}
