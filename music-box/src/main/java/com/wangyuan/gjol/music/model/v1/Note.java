package com.wangyuan.gjol.music.model.v1;

import com.wangyuan.gjol.music.model.GJM;
import com.wangyuan.gjol.music.model.v1.enums.DurationType;
import com.wangyuan.gjol.music.model.v1.enums.TieType;
import com.wangyuan.gjol.music.util.Rule;

/**
 * 音符
 */
public class Note implements GJM {
    /**
     * 是否休止符
     */
    @Rule("IsRest")
    private Boolean rest;
    /**
     * 是否附点
     */
    @Rule("IsDotted")
    private Boolean dotted;
    /**
     * 延音标记
     */
    @Rule("TieType")
    private TieType tieType;
    /**
     * 类型
     */
    @Rule("DurationType")
    private DurationType durationType = DurationType.Quarter;
    @Rule("StampIndex")
    private int stampIndex;
    @Rule("PlayingDurationTimeMs")
    private int playingDurationTimeMs;
    /**
     * 音数量
     */
    @Rule("ClassicPitchSignCount")
    private int classicPitchSignCount;
    @Rule("ClassicPitchSign")
    private Pitch pitch;

    public Boolean isRest() {
        return rest;
    }

    public void setRest(Boolean rest) {
        this.rest = rest;
    }

    public Boolean getDotted() {
        return dotted;
    }

    public void setDotted(Boolean dotted) {
        this.dotted = dotted;
    }

    public TieType getTieType() {
        return tieType;
    }

    public void setTieType(TieType tieType) {
        this.tieType = tieType;
    }

    public DurationType getDurationType() {
        return durationType;
    }

    public void setDurationType(DurationType durationType) {
        this.durationType = durationType;
    }

    public int getStampIndex() {
        return stampIndex;
    }

    public void setStampIndex(int stampIndex) {
        this.stampIndex = stampIndex;
    }

    public int getPlayingDurationTimeMs() {
        return playingDurationTimeMs;
    }

    public void setPlayingDurationTimeMs(int playingDurationTimeMs) {
        this.playingDurationTimeMs = playingDurationTimeMs;
    }

    public int getClassicPitchSignCount() {
        return classicPitchSignCount;
    }

    public void setClassicPitchSignCount(int classicPitchSignCount) {
        this.classicPitchSignCount = classicPitchSignCount;
    }

    public Pitch getPitch() {
        return pitch;
    }

    public void setPitch(Pitch pitch) {
        this.pitch = pitch;
    }
}
