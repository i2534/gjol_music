package com.wangyuan.gjol.music.io.gjm;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.*;
import java.util.Iterator;
import java.util.LinkedList;
import java.util.NoSuchElementException;

public class GJMReader implements Closeable, Iterable<String>, Iterator<String> {

    private static Logger log = LoggerFactory.getLogger(GJMReader.class);

    private static final int CACHE_LINE_COUNT = 10;

    private LineNumberReader reader;
    private LinkedList<Line> cache;

    private int number, level;

    public GJMReader(InputStream input) throws UnsupportedEncodingException {
        this(new InputStreamReader(input, "UTF-8"));
    }

    public GJMReader(Reader reader) {
        this.reader = new LineNumberReader(reader);
        this.cache = new LinkedList<Line>();
    }

    public int level() {
        return this.level;
    }

    private void prepare() {
        if (!this.cache.isEmpty()) {
            return;
        }
        for (int i = 0; i < CACHE_LINE_COUNT; i++) {
            try {
                String line = this.reader.readLine();
                if (line == null) {
                    break;
                }
                int num = this.reader.getLineNumber();
                this.cache.add(new Line(num, line));
            } catch (IOException e) {
                log.error(e.getMessage(), e);
            }
        }
    }

    public boolean hasNext() {
        this.prepare();
        return this.cache.peek() != null;
    }

    public String next() {
        this.prepare();
        Line line = this.cache.poll();
        if (line == null) {
            throw new NoSuchElementException();
        }
        this.number = line.number;
        String v = line.value;

        if (v.contains("{")) {
            this.level++;
        }
        if (v.contains("}")) {
            this.level--;
        }
        return v;
    }

    public int skipEnd(int lv) {
        int count = 0;
        while (lv < this.level() && this.hasNext()) {
            this.next();
            count++;
        }
        return count;
    }

    public void remove() {
        //do nothing
    }

    public int lineNumber() {
        return this.number;
    }

    public void close() throws IOException {
        this.cache.clear();
        this.reader.close();
    }

    public Iterator<String> iterator() {
        return this;
    }

    private class Line {
        private final int number;
        private final String value;

        Line(int number, String value) {
            this.number = number;
            this.value = value;
        }
    }

}
