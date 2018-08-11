package com.wangyuan.gjol.music.model.v1.enums;

/**
 * 谱号
 */
public enum ClefType {

    /**
     * 高音, treble
     */
    L2G("G"),
    /**
     * 低音, bass
     */
    L4F("F"),
    /**
     * alto
     */
    L3C("C"),
    /**
     * TAB
     */
    L5TAB("TAB");

    private String val;

    private ClefType(String v) {
        this.val = v;
    }

    public static ClefType of(String v) {
        for (ClefType type : ClefType.values()) {
            if (type.val.equals(v)) {
                return type;
            }
        }
        return null;
    }
}
