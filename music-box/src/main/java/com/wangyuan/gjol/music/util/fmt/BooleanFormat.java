package com.wangyuan.gjol.music.util.fmt;

import com.wangyuan.gjol.music.util.Helper;
import com.wangyuan.gjol.music.util.IFormat;

public class BooleanFormat implements IFormat<Boolean> {
    public Boolean parse(String v) {
        return Helper.boolVal(StringFormat.INSTANCE.parse(v));
    }

    public String format(Boolean aBoolean) {
        if (aBoolean == null)
            return null;
        return aBoolean.toString();
    }
}
