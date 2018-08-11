package com.wangyuan.gjol.music.model.v1;

public class Tuple<V> {

    private int index;
    private V value;

    public Tuple() {
    }

    public Tuple(int index, V value) {
        this.index = index;
        this.value = value;
    }

    public int getIndex() {
        return index;
    }

    public void setIndex(int index) {
        this.index = index;
    }

    public V getValue() {
        return value;
    }

    public void setValue(V value) {
        this.value = value;
    }

}
