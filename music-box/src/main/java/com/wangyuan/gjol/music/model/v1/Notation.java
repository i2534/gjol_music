package com.wangyuan.gjol.music.model.v1;

import com.wangyuan.gjol.music.model.GJM;
import com.wangyuan.gjol.music.util.Rule;

/**
 * 乐谱
 */
public class Notation implements GJM {

    /**
     * 版本号
     */
    @Rule("Version")
    private String version = "1.1.0.0";
    /**
     * 配置
     */
    @Rule("Notation")
    private Info info;
    /**
     * 所有域
     */
    @Rule("Notation.RegularTracks")
    private Track track;

    public String getVersion() {
        return version;
    }

    public void setVersion(String version) {
        this.version = version;
    }

    public Info getInfo() {
        return info;
    }

    public void setInfo(Info info) {
        this.info = info;
    }

    public Track getTrack() {
        return track;
    }

    public void setTrack(Track track) {
        this.track = track;
    }
}
