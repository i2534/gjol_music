package com.wangyuan.gjol.music.model.v1;

import com.wangyuan.gjol.music.model.GJM;
import com.wangyuan.gjol.music.util.Rule;

import java.util.List;

/**
 * 音
 */
public class Pitch implements GJM {

    @Rule(value = REPEAT_NAME, realType = Sign.class)
    private List<Sign> signs;

    public List<Sign> getSigns() {
        return signs;
    }

    public void setSigns(List<Sign> signs) {
        this.signs = signs;
    }
}
