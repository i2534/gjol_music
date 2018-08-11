package com.wangyuan.gjol.music.io.mxl;

import com.wangyuan.gjol.music.model.v1.enums.AlterantType;

public class MXLUtils {


    public static int noteType(String type) {
        if (type.equals("1024th")) {
            return 1024;
        } else if (type.equals("512th")) {
            return 512;
        } else if (type.equals("256th")) {
            return 256;
        } else if (type.equals("128th")) {
            return 128;
        } else if (type.equals("64th")) {
            return 32;
        } else if (type.equals("32nd")) {
            return 32;
        } else if (type.equals("16th")) {
            return 16;
        } else if (type.equals("eighth")) {
            return 8;
        } else if (type.equals("quarter")) {
            return 4;
        } else if (type.equals("half")) {
            return 2;
        } else if (type.equals("whole")) {
            return 1;
        } else if (type.equals("breve")) {
            return -2;
        } else if (type.equals("long")) {
            return -4;
        } else if (type.equals("maxima")) {
            return -8;
        }
        return 0;
    }

    public static AlterantType alterType(String n) {
        for (AlterantType type : AlterantType.values()) {
            if (type.toString().equalsIgnoreCase(n)) {
                return type;
            }
        }
        return null;
    }


}
