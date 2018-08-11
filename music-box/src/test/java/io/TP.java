package io;

import com.wangyuan.gjol.music.util.fmt.BooleanFormat;

import java.lang.reflect.ParameterizedType;

/**
 * Created by lan on 2018/08/04.
 */
public class TP {

    public static void main(String[] args) {
        Class<?> c = BooleanFormat.class;
        c = (Class<?>) ((ParameterizedType) c.getClass().getGenericInterfaces()[0]).getActualTypeArguments()[0];
        System.out.println(c);
    }

}
