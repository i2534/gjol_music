package com.wangyuan.gjol.music.util;

import com.wangyuan.gjol.music.util.fmt.EmptyFormat;

import java.lang.annotation.*;

@Documented
@Retention(RetentionPolicy.RUNTIME)
@Target({ElementType.FIELD})
public @interface Rule {

    /**
     * 主名称,写入时使用
     */
    String value();

    /**
     * 别名,读取时用到
     */
    String[] alias() default {};

    /**
     * 是否忽略字段
     */
    boolean ignore() default false;

    /**
     * 类型转换
     */
    Class<? extends IFormat> fmt() default EmptyFormat.class;

    Class<?> realType() default Object.class;

}
