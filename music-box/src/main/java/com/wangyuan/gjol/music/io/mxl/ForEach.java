package com.wangyuan.gjol.music.io.mxl;

import java.util.Iterator;

public class ForEach<T> implements Iterable<T>, Iterator<T> {

    private int count;
    private Iterator<T> iterator;

    ForEach(Iterator<T> it) {
        this.iterator = it;
    }

    public Iterator<T> iterator() {
        return this;
    }

    public boolean hasNext() {
        return this.iterator != null && this.iterator.hasNext();
    }

    public T next() {
        this.count++;
        return this.iterator.next();
    }

    public int count() {
        return this.count;
    }
}
