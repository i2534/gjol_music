package io;

import com.wangyuan.gjol.music.io.gjm.GJMWriter;
import com.wangyuan.gjol.music.io.gjm.NotationSerializer;
import com.wangyuan.gjol.music.io.mxl.MXLReader;
import com.wangyuan.gjol.music.model.v1.Notation;
import org.dom4j.DocumentException;

import java.io.File;
import java.io.IOException;

public class MXL {

    public static void main(String[] args) throws DocumentException, IOException {
        String name = "鸡妈妈和它的孩子们";

        MXLReader reader = new MXLReader();
        Notation notation = reader.read(new File("G:/notation/" + name + ".musicxml"));
        System.out.println(notation);

        NotationSerializer ns = new NotationSerializer(notation, new GJMWriter(new File("G:/notation/" + name + ".mxl.gjm")));
        ns.serialize();
        ns.close();
    }

}
