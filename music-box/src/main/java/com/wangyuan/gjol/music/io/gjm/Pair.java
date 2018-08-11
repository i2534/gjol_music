package com.wangyuan.gjol.music.io.gjm;

import com.wangyuan.gjol.music.io.MusicException;
import com.wangyuan.gjol.music.util.Helper;

class Pair {

    private String key, val;

    Pair(String line) throws MusicException {
        String text = line.trim();
        int index = text.indexOf("=");
        if (index == -1) {
            throw new MusicException("Line not contains '='");
        }
        this.key = Helper.trim(text.substring(0, index));
        this.val = Helper.trim(text.substring(index + 1));
    }

    String key() {
        return key;
    }

    String val() {
        return val;
    }

}
