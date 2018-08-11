package com.wangyuan.gjol.music.model.v1.enums;

/**
 * 调号
 */
public enum KeySignature {

    bC(-7),
    bG(-6),
    bD(-5),
    bA(-4),
    bE(-3),
    bB(-2),
    F(-1),
    C(0),
    G(1),
    D(2),
    A(3),
    E(4),
    B(5),
    /**
     * #F
     */
    hF(6),
    /**
     * #C
     */
    hC(7);

    private int value;

    private KeySignature(int v) {
        this.value = v;
    }

    public int value() {
        return this.value;
    }

    public static KeySignature of(int v) {
        for (KeySignature ks : KeySignature.values()) {
            if (ks.value == v) {
                return ks;
            }
        }
        return null;
    }

}
