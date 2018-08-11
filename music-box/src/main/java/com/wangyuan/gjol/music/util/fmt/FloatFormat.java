package com.wangyuan.gjol.music.util.fmt;

import com.wangyuan.gjol.music.util.Helper;
import com.wangyuan.gjol.music.util.IFormat;

public class FloatFormat implements IFormat<Float> {

    public Float parse(String v) {
        return Helper.floatVal(StringFormat.INSTANCE.parse(v));
    }

    public String format(Float aFloat) {
        if (aFloat == null)
            return null;
        return aFloat.toString();
    }
}
