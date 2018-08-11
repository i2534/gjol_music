package com.wangyuan.gjol.music.model.v1.fmt;

import com.wangyuan.gjol.music.model.v1.enums.KeySignature;
import com.wangyuan.gjol.music.util.Helper;
import com.wangyuan.gjol.music.util.IFormat;
import com.wangyuan.gjol.music.util.fmt.StringFormat;

public class KeySignatureFormat implements IFormat<KeySignature> {
    public KeySignature parse(String v) {
        Integer i = Helper.intVal(StringFormat.INSTANCE.parse(v));
        if (i == null)
            return null;
        return KeySignature.of(i);
    }

    public String format(KeySignature keySignature) {
        if (keySignature == null)
            return null;
        return String.valueOf(keySignature.value());
    }
}
