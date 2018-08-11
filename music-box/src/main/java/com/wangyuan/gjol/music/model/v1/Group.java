package com.wangyuan.gjol.music.model.v1;

import com.wangyuan.gjol.music.model.GJM;

import java.util.ArrayList;
import java.util.List;

public class Group<V> implements GJM {

    private List<Tuple<V>> tuples;

    public List<Tuple<V>> getTuples() {
        return tuples;
    }

    public void setTuples(List<Tuple<V>> tuples) {
        this.tuples = tuples;
    }

    public void addTuple(Tuple<V> tuple) {
        if (this.tuples == null) {
            this.tuples = new ArrayList<Tuple<V>>();
        }
        this.tuples.add(tuple);
    }
}
