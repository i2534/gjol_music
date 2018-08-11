package com.wangyuan.gjol.music.io.gjm;

import java.io.*;

public class GJMWriter implements Closeable, Appendable {

    private BufferedWriter writer;
    private int number;
    private boolean disabled;

    public GJMWriter(File out) throws IOException {
        this(new FileOutputStream(out));
    }

    public GJMWriter(OutputStream out) throws IOException {
        this(new OutputStreamWriter(out, "UTF-8"));
    }

    public GJMWriter(Writer writer) {
        this.writer = new BufferedWriter(writer);
    }

    public void close() throws IOException {
        this.writer.close();
    }

    public GJMWriter append(CharSequence csq) throws IOException {
        this.writer.append(csq);
        return this;
    }

    public GJMWriter append(CharSequence csq, int start, int end) throws IOException {
        this.writer.append(csq, start, end);
        return this;
    }

    public GJMWriter append(char c) throws IOException {
        this.writer.append(c);
        return this;
    }

    public GJMWriter newLine() throws IOException {
        if (!this.disabled) {
            this.writer.newLine();
            this.number++;
        }
        return this;
    }

    public GJMWriter tab(int count) throws IOException {
        for (int i = 0; i < count; i++) {
            this.writer.append('\t');
        }
        return this;
    }

    public void disableNewLine(boolean b) {
        this.disabled = b;
    }

    public int lineNumber() {
        return this.number;
    }
}
