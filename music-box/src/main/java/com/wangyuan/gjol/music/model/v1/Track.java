package com.wangyuan.gjol.music.model.v1;

import com.wangyuan.gjol.music.model.GJM;
import com.wangyuan.gjol.music.util.Rule;

/**
 * 域封装
 */
public class Track implements GJM {

    /**
     * 高音
     */
    @Rule("[0]")
    private Part high;
    /**
     * 低音
     */
    @Rule("[1]")
    private Part bass;
    /**
     * 混音
     */
    @Rule("[2]")
    private Part misc;

    public Part getHigh() {
        return high;
    }

    public void setHigh(Part high) {
        this.high = high;
    }

    public Part getBass() {
        return bass;
    }

    public void setBass(Part bass) {
        this.bass = bass;
    }

    public Part getMisc() {
        return misc;
    }

    public void setMisc(Part misc) {
        this.misc = misc;
    }
}
