package com.wangyuan.gjol.music.util.fmt;

import com.wangyuan.gjol.music.util.Helper;
import com.wangyuan.gjol.music.util.IFormat;

public class IntegerFormat implements IFormat<Integer> {
    public Integer parse(String v) {
        return Helper.intVal(StringFormat.INSTANCE.parse(v));
    }

    public String format(Integer integer) {
        if (integer == null) {
            return null;
        }
        return integer.toString();
    }
}
