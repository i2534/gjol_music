package com.wangyuan.gjol.music.util;

public interface IFormat<V> {

    V parse(String v);

    String format(V r);

}