package io;

import com.wangyuan.gjol.music.util.IFormat;
import com.wangyuan.gjol.music.util.fmt.BooleanFormat;

/**
 * Created by lan on 2018/08/05.
 */
public class Fmt {

    public static void main(String[] args) {
        IFormat fmt = IFormat.class.cast(new BooleanFormat());

        System.out.println(fmt.format(true));
    }

}
