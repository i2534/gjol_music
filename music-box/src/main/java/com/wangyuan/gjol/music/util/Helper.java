package com.wangyuan.gjol.music.util;

public class Helper {

    public static Integer intVal(String v) {
        if (v == null) {
            return null;
        }
        return floatVal(v).intValue();
    }

    public static Float floatVal(String v) {
        if (v == null) {
            return null;
        }
        return Float.valueOf(v.trim());
    }

    public static Boolean boolVal(String v) {
        if (v == null) {
            return null;
        }
        return Boolean.valueOf(v.trim());
    }

    public static String trim(String v) {
        if (v == null) {
            return null;
        }
        return v.trim();
    }

    public static String clean(String v) {
        if (v == null) {
            return null;
        }
        String r = v.trim();
        int b = 0, e = r.length() - 1;
        for (int i = 0; i < r.length(); i++) {
            char c = r.charAt(i);
            if (c == '{' || c == ',' || c == '}' || c == ' ' || c == '\t') {
                continue;
            }
            b = i;
            break;
        }
        for (int i = r.length() - 1; i >= 0; i--) {
            char c = r.charAt(i);
            if (c == '{' || c == ',' || c == '}' || c == ' ' || c == '\t') {
                continue;
            }
            e = i;
            break;
        }
        return r.substring(b, e + 1);
    }

    public static String join(float... os) {
        if (os == null || os.length == 0) {
            return null;
        }
        StringBuilder sb = new StringBuilder();
        for (float o : os) {
            if (sb.length() > 0) {
                sb.append(" ");
            }
            sb.append(String.valueOf(o)).append(",");
        }
        return sb.toString();
    }

}
