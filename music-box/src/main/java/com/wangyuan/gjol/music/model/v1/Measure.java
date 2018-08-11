package com.wangyuan.gjol.music.model.v1;

import com.wangyuan.gjol.music.model.GJM;
import com.wangyuan.gjol.music.util.Rule;

import java.util.List;

/**
 * 拍
 */
public class Measure implements GJM {

    @Rule("DurationStampMax")
    private Integer durationStampMax;
    /**
     * 音符数量
     */
    @Rule("NotePackCount")
    private int noteCount;
    /**
     * 音符
     */
    @Rule(value = REPEAT_NAME, realType = Note.class)
    private List<Note> notes;//note

    public Integer getDurationStampMax() {
        return durationStampMax;
    }

    public void setDurationStampMax(Integer durationStampMax) {
        this.durationStampMax = durationStampMax;
    }

    public int getNoteCount() {
        return noteCount;
    }

    public void setNoteCount(int noteCount) {
        this.noteCount = noteCount;
    }

    public List<Note> getNotes() {
        return notes;
    }

    public void setNotes(List<Note> notes) {
        this.notes = notes;
    }
}
