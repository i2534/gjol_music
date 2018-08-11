package com.wangyuan.gjol.music.model.v1;

import com.wangyuan.gjol.music.model.GJM;
import com.wangyuan.gjol.music.model.v1.enums.ClefType;
import com.wangyuan.gjol.music.model.v1.enums.InstrumentType;
import com.wangyuan.gjol.music.model.v1.enums.KeySignature;
import com.wangyuan.gjol.music.model.v1.fmt.KeySignatureFormat;
import com.wangyuan.gjol.music.util.Rule;
import com.wangyuan.gjol.music.util.fmt.CommonEnumFormat;
import com.wangyuan.gjol.music.util.fmt.FloatArrayFormat;
import com.wangyuan.gjol.music.util.fmt.FloatFormat;

import java.util.List;

/**
 * 音部
 */
public class Part implements GJM {

    /**
     * 调号
     */
    @Rule(value = "MeasureKeySignatureMap", fmt = KeySignatureFormat.class)
    private Group<KeySignature> keySignature;
    /**
     * 谱号
     */
    @Rule(value = "MeasureClefTypeMap", fmt = CommonEnumFormat.class, realType = ClefType.class)
    private Group<ClefType> clefType;
    /**
     * 乐器
     */
    @Rule(value = "MeasureInstrumentTypeMap", fmt = CommonEnumFormat.class, realType = InstrumentType.class)
    private Group<InstrumentType> instrumentType;

    /**
     * 音量曲线, 从下标0开始,分别对应1/8到8/8,共8个值,范围: [0, 1]
     */
    @Rule(value = "MeasureVolumeCurveMap", fmt = FloatArrayFormat.class)
    private Group<float[]> volumeCurve;

    /**
     * 音量 [0, 1]
     */
    @Rule(value = "MeasureVolumeMap", fmt = FloatFormat.class)
    private Group<Float> volume;

    /**
     * 节拍
     */
    @Rule(value = REPEAT_NAME, realType = Measure.class)
    private List<Measure> measures;

    public Group<KeySignature> getKeySignature() {
        return keySignature;
    }

    public void setKeySignature(Group<KeySignature> keySignature) {
        this.keySignature = keySignature;
    }

    public Group<ClefType> getClefType() {
        return clefType;
    }

    public void setClefType(Group<ClefType> clefType) {
        this.clefType = clefType;
    }

    public Group<InstrumentType> getInstrumentType() {
        return instrumentType;
    }

    public void setInstrumentType(Group<InstrumentType> instrumentType) {
        this.instrumentType = instrumentType;
    }

    public Group<float[]> getVolumeCurve() {
        return volumeCurve;
    }

    public void setVolumeCurve(Group<float[]> volumeCurve) {
        this.volumeCurve = volumeCurve;
    }

    public Group<Float> getVolume() {
        return volume;
    }

    public void setVolume(Group<Float> volume) {
        this.volume = volume;
    }

    public List<Measure> getMeasures() {
        return measures;
    }

    public void setMeasures(List<Measure> measures) {
        this.measures = measures;
    }
}
