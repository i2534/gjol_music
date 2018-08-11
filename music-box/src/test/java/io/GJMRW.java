package io;

import com.wangyuan.gjol.music.io.gjm.GJMReader;
import com.wangyuan.gjol.music.io.gjm.GJMWriter;
import com.wangyuan.gjol.music.io.gjm.NotationParser;
import com.wangyuan.gjol.music.io.gjm.NotationSerializer;
import com.wangyuan.gjol.music.model.v1.Notation;

import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;

public class GJMRW {

    public static void main(String[] args) throws IOException {
        NotationParser reader = new NotationParser(new GJMReader(new FileInputStream("G:/notation/剑决浮云.gjm")));
        Notation notation = reader.parse();
        System.out.println(notation);

        NotationSerializer writer = new NotationSerializer(notation, new GJMWriter(new FileOutputStream("G:/notation/剑决浮云.out.gjm")));
        writer.serialize();
    }

}
