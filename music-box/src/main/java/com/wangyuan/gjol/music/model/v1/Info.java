package com.wangyuan.gjol.music.model.v1;

import com.wangyuan.gjol.music.model.GJM;
import com.wangyuan.gjol.music.model.v1.enums.DurationType;
import com.wangyuan.gjol.music.model.v1.enums.NumberedKeySignature;
import com.wangyuan.gjol.music.util.Rule;
import com.wangyuan.gjol.music.util.fmt.IntegerFormat;

/**
 * 乐谱配置
 */
public class Info implements GJM {
    /**
     * 版本号
     */
    @Rule("Version")
    private String version = "1.1.0.0";
    /**
     * 名称
     */
    @Rule("NotationName")
    private String name;
    /**
     * 作者
     */
    @Rule("NotationAuthor")
    private String author;
    /**
     * 转谱
     */
    @Rule("NotationTranslater")
    private String translater;
    /**
     * 录入
     */
    @Rule("NotationCreator")
    private String creator;
    /**
     * 声道??
     */
    @Rule("Volume")
    private int volume = 1;
    /**
     * 拍/小节, [2, 8]
     */
    @Rule("BeatsPerMeasure")
    private int beatsPerMeasure;
    /**
     * 拍号
     */
    @Rule("BeatDurationType")
    private DurationType beatDurationType;
    /**
     * 调式
     */
    @Rule("NumberedKeySignature")
    private NumberedKeySignature numberedKeySignature = NumberedKeySignature.C;
    /**
     * 节拍, [20, 180], 偶数
     */
    @Rule(value = "MeasureBeatsPerMinuteMap", fmt = IntegerFormat.class)
    private Group<Integer> beatsPerMinute;
    /**
     * 节数
     */
    @Rule("MeasureAlignedCount")
    private int measureAlignedCount;


    public String getVersion() {
        return version;
    }

    public void setVersion(String version) {
        this.version = version;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getAuthor() {
        return author;
    }

    public void setAuthor(String author) {
        this.author = author;
    }

    public String getTranslater() {
        return translater;
    }

    public void setTranslater(String translater) {
        this.translater = translater;
    }

    public String getCreator() {
        return creator;
    }

    public void setCreator(String creator) {
        this.creator = creator;
    }

    public int getVolume() {
        return volume;
    }

    public void setVolume(int volume) {
        this.volume = volume;
    }

    public int getBeatsPerMeasure() {
        return beatsPerMeasure;
    }

    public void setBeatsPerMeasure(int beatsPerMeasure) {
        this.beatsPerMeasure = beatsPerMeasure;
    }

    public DurationType getBeatDurationType() {
        return beatDurationType;
    }

    public void setBeatDurationType(DurationType beatDurationType) {
        this.beatDurationType = beatDurationType;
    }

    public NumberedKeySignature getNumberedKeySignature() {
        return numberedKeySignature;
    }

    public void setNumberedKeySignature(NumberedKeySignature numberedKeySignature) {
        this.numberedKeySignature = numberedKeySignature;
    }

    public Group<Integer> getBeatsPerMinute() {
        return beatsPerMinute;
    }

    public void setBeatsPerMinute(Group<Integer> beatsPerMinute) {
        this.beatsPerMinute = beatsPerMinute;
    }

    public int getMeasureAlignedCount() {
        return measureAlignedCount;
    }

    public void setMeasureAlignedCount(int measureAlignedCount) {
        this.measureAlignedCount = measureAlignedCount;
    }
}
