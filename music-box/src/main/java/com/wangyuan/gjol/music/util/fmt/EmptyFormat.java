package com.wangyuan.gjol.music.util.fmt;

import com.wangyuan.gjol.music.util.IFormat;

public class EmptyFormat implements IFormat<Void> {
    public Void parse(String v) {
        return null;
    }

    public String format(Void aVoid) {
        return null;
    }
}
