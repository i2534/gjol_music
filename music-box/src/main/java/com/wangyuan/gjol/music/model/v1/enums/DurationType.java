package com.wangyuan.gjol.music.model.v1.enums;

/**
 * 音符类型
 */
public enum DurationType {

    Whole(1),
    /**
     * 1/2
     */
    Half(2),
    /**
     * 1/4
     */
    Quarter(4),
    /**
     * 1/8
     */
    Eighth(8),
    /**
     * 1/16
     */
    The16th(16),
    /**
     * 1/32
     */
    The32nd(32);

    private int val;

    private DurationType(int v) {
        this.val = v;
    }

    public int val() {
        return this.val;
    }

    public static DurationType of(int v) {
        for (DurationType type : DurationType.values()) {
            if (type.val == v) {
                return type;
            }
        }
        return null;
    }
}
