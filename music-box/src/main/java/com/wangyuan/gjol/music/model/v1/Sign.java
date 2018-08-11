package com.wangyuan.gjol.music.model.v1;

import com.wangyuan.gjol.music.model.GJM;
import com.wangyuan.gjol.music.model.v1.enums.AlterantType;
import com.wangyuan.gjol.music.util.Rule;

/**
 * 音
 */
public class Sign implements GJM {

    public static int[][] VALUES = new int[][]
            {
                    new int[]{0, 0, 0, 0, 0, 0, 0},
                    new int[]{4, 6, 8, 9, 11, 13, 15},
                    new int[]{16, 18, 20, 22, 23, 25, 27},
                    new int[]{28, 30, 32, 34, 35, 37, 39},
                    /*小字一组*/new int[]{40, 42, 44, 45, 47, 49, 51},
                    new int[]{52, 54, 56, 57, 59, 61, 63},
                    new int[]{64, 66, 68, 69, 71, 73, 75},
                    new int[]{76, 78, 80, 81, 83, 85, 87},
                    new int[]{0, 0, 0, 0, 0, 0, 0},
                    new int[]{0, 0, 0, 0, 0, 0, 0}
            };

    public static int STANDARD_C = VALUES[4][0];

    /**
     * 原始值
     * <p>
     * 演奏音符;
     * * = 标准音, 小字一组
     * + = 高八度
     * - = 低八度
     * <p>
     * +++: [76, 78, 80, 81, 83, 85, 87]
     * ++ : [64, 66, 68, 69, 71, 73, 75]
     * +  : [52, 54, 56, 57, 59, 61, 63]
     * *  : [40, 42, 44, 45, 47, 49, 51]
     * -  : [28, 30, 32, 34, 35, 37, 39]
     * -- : [16, 18, 20, 22, 23, 25, 27]
     * ---: [4,  6,  8,  9,  11, 13, 15]
     */
    private int index;
    /**
     * 数字音符 [1, 2, 3, 4, 5, 6, 7]
     * 字母音符 [C, D, E, F, G, A, B]
     * 唱名 do re mi fa so la si
     */
    @Rule("NumberedSign")
    private int numberedSign;
    /**
     * 变调结果
     */
    @Rule("PlayingPitchIndex")
    private int playingPitchIndex;
    @Rule("AlterantType")
    private AlterantType alterantType = AlterantType.NoControl;
    @Rule("Volume")
    private float volume;

    public int getIndex() {
        return index;
    }

    public void setIndex(int index) {
        this.index = index;
    }

    public int getNumberedSign() {
        return numberedSign;
    }

    public void setNumberedSign(int numberedSign) {
        this.numberedSign = numberedSign;
    }

    public int getPlayingPitchIndex() {
        return playingPitchIndex;
    }

    public void setPlayingPitchIndex(int playingPitchIndex) {
        this.playingPitchIndex = playingPitchIndex;
    }

    public AlterantType getAlterantType() {
        return alterantType;
    }

    public void setAlterantType(AlterantType alterantType) {
        this.alterantType = alterantType;
    }

    public float getVolume() {
        return volume;
    }

    public void setVolume(float volume) {
        this.volume = volume;
    }
}
