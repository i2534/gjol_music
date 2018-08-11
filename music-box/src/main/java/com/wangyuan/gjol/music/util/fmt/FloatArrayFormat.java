package com.wangyuan.gjol.music.util.fmt;

import com.wangyuan.gjol.music.util.Helper;
import com.wangyuan.gjol.music.util.IFormat;

public class FloatArrayFormat implements IFormat<float[]> {

    public float[] parse(String v) {
        if (v == null) {
            return null;
        }
        String r = Helper.clean(v);
        String[] array = r.split(",");
        float[] vs = new float[array.length];
        for (int i = 0; i < vs.length; i++) {
            vs[i] = Helper.floatVal(array[i]);
        }
        return vs;
    }

    public String format(float[] floats) {
        if (floats == null) {
            return null;
        }
        return "{ " + Helper.join(floats) + " }";
    }
}
