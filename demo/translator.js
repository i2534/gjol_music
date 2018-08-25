/*
 XML element wrapper
 */
function XE(ele) {
    /*
     元素类型	节点类型
     元素	    1
     属性	    2
     文本	    3
     注释	    8
     文档	    9
     */
    var isType = function (v) {
        return ele.nodeType === v;
    };
    return {
        name : function () {
            return ele.nodeName;
        },
        child : function (name) {
            var cs = ele.childNodes;
            for (var i = 0; i < cs.length; i++) {
                var e = cs[ i ];
                if (!name || name + '' === e.nodeName) {
                    return new XE(e);
                }
            }
        },
        children : function (name) {
            var cs = ele.childNodes;
            var array = [];
            for (var i = 0; i < cs.length; i++) {
                var e = cs[ i ];
                if (name) {
                    if (name + '' === e.nodeName) {
                        array.push(new XE(e));
                    }
                } else {
                    array.push(new XE(e));
                }
            }
            return array;
        },
        find : function (name) {
            var cs = ele.getElementsByTagName(name);
            if (cs.length > 0) {
                return new XE(cs[ 0 ]);
            }
        },
        list : function (name) {
            var cs = ele.getElementsByTagName(name);
            var array = [];
            for (var i = 0; i < cs.length; i++) {
                array.push(new XE(cs[ i ]));
            }
            return array;
        },
        attr : function (name) {
            return ele.getAttribute(name);
        },
        text : function () {
            if (isType(3)) {
                return ele.nodeValue;
            } else if (isType(1)) {
                var c = new XE(ele).child();
                if (c) {
                    return c.text();
                }
            }
            return null;
        },
        select : function (path) {
            var doc = ele.ownerDocument;
            var array = [];
            if (doc.selectNodes) {//IE
                var cs = doc.selectNodes(path);
                for (var i = 0; i < cs.length; i++) {
                    array.push(new XE(cs[ i ]));
                }
            } else {
                var ret = doc.evaluate(path, doc.documentElement, null, XPathResult.ANY_TYPE, null);
                for (; ;) {
                    var next = ret.iterateNext();
                    if (!next) {
                        break;
                    }
                    array.push(new XE(next));
                }
            }
            return array;
        }
    };
}

function Translator(musicXML) {

    var parse = function (xml) {
        var dom;
        if (window.DOMParser) {
            var parser = new DOMParser();
            dom = parser.parseFromString(xml, 'application/xml');
        } else {// IE
            dom = new ActiveXObject('Microsoft.XMLDOM');
            dom.async = false;
            dom.loadXML(xml);
        }
        return new XE(dom.documentElement);
    };

    var isText = function (v) {
        return (typeof v) === 'string' || v instanceof String;
    };

    var isLowerCase = function (c) {
        return c >= 'a' && c <= 'z';
    };

    var tab = function (n) {
        if (!n || n <= 0) {
            return '';
        }
        var array = new Array(n);
        array.fill('\t');
        return array.join('');
    };

    var object = function (o, lv) {
        var i = lv ? lv : 0;

        var ls = [];

        var isList = o instanceof List;
        if (!isList) {
            ls.push('{');
        }

        if (o.unite) {
            ls.push(o.unite(i + 1));
        } else {
            for (var n in o) {
                if (o.hasOwnProperty(n)) {
                    var v = o[ n ];
                    if (isLowerCase(n)) {
                        if (v instanceof List) {
                            ls.push(object(v, i));
                        }
                    } else {
                        var u = unite(n, v, i + 1);
                        if (u) {
                            ls.push(u + ',');
                        }
                    }
                }
            }
        }
        if (!isList) {
            ls.push(tab(lv) + '}');
        }
        return ls.join('\n');
    };

    var unite = function (key, val, lv) {
        if (val === null || val === undefined || val === false) {
            return;
        }
        var line = tab(lv);
        line += key + ' = ';
        if (isText(val)) {
            line += '\'' + val.replace('\'', '\\\'') + '\'';
        } else if (typeof val === 'object') {
            line += object(val, lv);
        } else {
            line += val;
        }
        return line;
    };

    var childText = function (xe, name) {
        if (xe) {
            var e = xe.child(name);
            if (e) {
                return e.text();
            }
        }
    };

    var get = function (o, n) {
        if (o && (n in o)) {
            return o[ n ];
        }
    };
    var set = function (o, n, v) {
        if (o && n) {
            if (v === undefined || v === null || isNaN(v)) {
                return;
            }
            o[ n ] = v;
        }
    };

    var key = function (o, val) {
        for (var n in o) {
            if (o.hasOwnProperty(n)) {
                if (o[ n ] === val) {
                    return n;
                }
            }
        }
    };

    var ClefType = { 'G' : 'L2G', 'F' : 'L4F', 'C' : 'L3C', 'TAB' : 'L5TAB' };
    var KeySignature = {
        '-7' : 'bC', '-6' : 'bG', '-5' : 'bD', '-4' : 'bA', '-3' : 'bE', '-2' : 'bB', '-1' : 'F',
        '0' : 'C', '1' : 'G', '2' : 'D', '3' : 'A', '4' : 'E', '5' : 'B', '6' : 'hF', '7' : 'hC'
    };
    var DurationType = {
        '1' : 'Whole', '2' : 'Half', '4' : 'Quarter', '8' : 'Eighth', '16' : 'The16th', '32' : 'The32nd'
    };
    var NoteType = {
        'maxima' : -8, 'long' : -4, 'breve' : -2, 'whole' : 1, 'half' : 2, 'quarter' : 4, 'eighth' : 8,
        '16th' : 16, '32nd' : 32, '64th' : 64, '128th' : 128, '256th' : 256, '512th' : 512, '1024th' : 1024
    };
    var AlterantType = [ 'NoControl', 'Natural', 'Sharp', 'Flat' ];

    var VALUES = [
        [ 0, 0, 0, 0, 0, 0, 0 ],
        [ 4, 6, 8, 9, 11, 13, 15 ],
        [ 16, 18, 20, 22, 23, 25, 27 ],
        [ 28, 30, 32, 34, 35, 37, 39 ],
        /*小字一组*/[ 40, 42, 44, 45, 47, 49, 51 ],
        [ 52, 54, 56, 57, 59, 61, 63 ],
        [ 64, 66, 68, 69, 71, 73, 75 ],
        [ 76, 78, 80, 81, 83, 85, 87 ],
        [ 0, 0, 0, 0, 0, 0, 0 ],
        [ 0, 0, 0, 0, 0, 0, 0 ]
    ];
    var STANDARD_C = VALUES[ 4 ][ 0 ];
    var NOTES = [ 'C', 'D', 'E', 'F', 'G', 'A', 'B' ];

    var Tuple = function (index, val) {
        var uv = function () {
            if (Array.isArray(val)) {
                return '{ ' + val.join(', ') + ' }';
            }
            return isText(val) ? '\'' + val + '\'' : val.toString();
        };
        this.unite = function () {
            return '{ ' + index + ', ' + uv(val) + ' },';
        };
    };

    var Group = function () {
        var ts = [];
        this.add = function (tuple) {
            ts.push(tuple);
            return this;
        };
        this.unite = function (lv) {
            var ls = [];
            ts.each(function (t) {
                ls.push(tab(lv) + t.unite(lv + 1));
            });
            return ls.join('\n');
        };
    };

    var List = function () {
        var vs = [];
        this.add = function (v) {
            if (Array.isArray(v)) {
                vs = vs.concat(v);
            } else {
                vs.push(v);
            }
            return this;
        };
        this.get = function (index) {
            return vs[ index ];
        };
        this.size = function () {
            return vs.length;
        };
        this.unite = function (lv) {
            var ls = [];
            vs.each(function (v, i) {
                ls.push(tab(lv) + '[' + i + '] = ' + object(v, lv) + ',');
            });
            return ls.join('\n');
        };
    };

    var Information = function (root) {
        var info = {
            Version : '1.1.0.0',
            NotationName : '未知名称',
            NotationAuthor : '未知作者',
            NotationTranslater : 'MXLTranslator',
            NotationCreator : '凤仪(百草谷)',
            Volume : 1,
            BeatsPerMeasure : 0,
            BeatDurationType : '',
            NumberedKeySignature : 'C',
            MeasureBeatsPerMinuteMap : new Group(),
            MeasureAlignedCount : 0
        };

        (function work(xe) {
            var v = childText(xe, 'work-title');
            if (!v) return;
            info.NotationName = v;
        })(root.find('work'));

        (function identification(xe) {
            if (!xe) return;
            xe.children('creator').each(function (c) {
                var type = c.attr('type'), v = c.text();
                if ('composer' === type) {
                    info.NotationAuthor = v;
                }
            });
        })(root.find('identification'));

        return info;
    };

    var Track = function (root) {
        var Part = function () {
            return {
                MeasureKeySignatureMap : new Group(),
                MeasureClefTypeMap : new Group(),
                MeasureInstrumentTypeMap : new Group().add(new Tuple(0, 'Piano')),
                MeasureVolumeCurveMap : new Group().add(new Tuple(0, [ 1.0, 0.8, 0.4, 0.5, 0.8, 0.7, 0.4, 0.3 ])),
                MeasureVolumeMap : new Group().add(new Tuple(0, 1.0)),
                measures : new List()
            };
        };

        parts = [ new Part(), new Part(), new Part() ];
        var track = {};
        parts.each(function (p, i) {
            track[ '[' + i + ']' ] = p;
        });

        (function partList(pl) {
            var ids = [];
            pl && pl.children('score-part').each(function (sp) {
                var id = sp.attr('id'), name = childText(sp, 'part-name');
                console.log('Part id is ' + id + ', name is ' + name);
                ids.push(id);
            });
            return ids;
        })(root.find('part-list')).each(function (id) {
            var part = root.select('part[@id=\'' + id + '\']')[ 0 ];
            part.children('measure').each(Measure);
        });

        parts.each(function (part) {
            for (var i = part.measures.size(); i < measureCount; i++) {
                part.measures.add({ DurationStampMax : 0, NotePackCount : 0 });
            }
        });

        return track;
    };

    var Measure = function (me, index) {
        var number = me.attr('number');
        console.log('Measure number is ' + number + ', index is ' + index);

        var info = notation.info;

        var bpm = (function direction(ds) {
            var tempo = 0;
            ds.each(function (d) {
                var sound = d.child('sound');
                if (sound) {
                    tempo = parseInt(sound.attr('tempo'));
                }
                if (!tempo) {
                    d.children('direction-type').each(function (e) {
                        var metronome = childText(e.child('metronome'), 'per-minute');
                        if (metronome) {
                            tempo = parseInt(metronome);
                            return false;
                        }
                    });
                }
                if (tempo) {
                    info.MeasureBeatsPerMinuteMap.add(new Tuple(measureCount, tempo));
                    return false;
                }
            });
            return tempo;
        })(me.children('direction'));

        if (!bpm && measureCount === 0) {
            info.MeasureBeatsPerMinuteMap.add(new Tuple(0, 120));
        }

        var sti = (function attributes(as) {
            var staff = 0;
            if (!as) {
                return staff;
            }

            var staves = childText(as, 'staves');
            if (staves) {
                staff = parseInt(staves);
            }
            if (staff > 3) {
                staff = 3;
            }

            var dis = parseInt(childText(as, 'divisions'));
            if (dis) {
                divisions = dis;
            }

            as.children('clef').each(function (clef, i) {
                if (i >= parts.length) {
                    return false;
                }

                var sign = childText(clef, 'sign');
                var type = get(ClefType, sign);
                if (!type) {
                    console.log('Clef type ' + sign + ' is not mapping');
                } else {
                    var part = parts[ i ];
                    part.MeasureClefTypeMap.add(new Tuple(measureCount, type));
                }
            });

            var fifths = parseInt(childText(as.child('key'), 'fifths'));//get(KeySignature, fifths);
            if (!isNaN(fifths)) {
                parts.each(function (p) {
                    p.MeasureKeySignatureMap.add(new Tuple(measureCount, fifths));
                });
            }

            var time = as.child('time');
            if (time) {
                var beats = childText(time, 'beats');
                if (beats) {
                    info.BeatsPerMeasure = parseInt(beats);
                }
                var beatType = childText(time, 'beat-type');
                if (beatType) {
                    var type = get(DurationType, beatType);
                    if (type) {
                        info.BeatDurationType = type;
                    } else {
                        console.log('Beat type ' + beatType + 'is not mapping');
                    }
                }
            }
            return staff;
        })(me.child('attributes'));
        if (sti === 0) sti = lastStaff;
        else lastStaff = sti;

        var cache = [];
        for (var i = 0; i < sti; i++) {
            var measure = {
                DurationStampMax : 0,
                NotePackCount : 0,
                notes : new List()
            };
            cache.push(measure);
            parts[ i ].measures.add(measure);
        }

        (function note(notes) {
            notes.each(function (n, i) {
                var na = Note(n, i);

                var staff = na[ 0 ];
                var note = na[ 1 ], last;

                var m = cache[ staff - 1 ];
                var size = m.notes.size();
                if (size === 0) {
                    note.StampIndex = 0;
                } else {
                    last = m.notes.get(size - 1);
                    var v = parseInt(key(DurationType, last.DurationType));
                    note.StampIndex = last.StampIndex + 64 / v;
                }

                if (note.isChrod) {
                    var ss = note.ClassicPitchSign;
                    for (var k in ss) {
                        if (ss.hasOwnProperty(k)) {
                            last.ClassicPitchSign[ k ] = ss[ k ];
                            last.ClassicPitchSignCount++;
                        }
                    }
                } else {
                    m.notes.add(note);
                }
            });
        })(me.children('note'));

        var result = (function barline(bes) {
            var ret = [];
            bes.each(function (e) {
                var repeat = e.child('repeat');
                if (repeat) {
                    var direction = repeat.attr('direction');
                    if ('forward' === direction) {// |:
                        ret.push('>');
                    } else if ('backward' === direction) {// :|
                        ret.push('<');
                    }
                }
                var ending = e.child('ending');
                if (ending) {
                    var type = ending.attr('type');//start stop discontinue
                    if ('start' === type) {
                        ret.push('+');
                    } else if ('stop' === type) {
                        ret.push('-');
                    }
                }
            });
            return ret.join('');
        })(me.children('barline'));
        (function repeat(baseline) {
            if (baseline.includes('>')) {
                lastRepeatStart = index;
            }
            if (baseline.includes('+')) {
                skipOn = true;
            }
            if (skipOn) {
                repeatSkip.push(index);
            }
            if (baseline.includes('-')) {
                skipOn = false;
            }
            if (baseline.includes('<')) {
                var end = index, start = lastRepeatStart;
                console.log('Repeat measure from ' + start + ' to ' + end);

                parts.each(function (part) {
                    var pms = part.measures;
                    for (var j = pms.size(); j <= index; j++) {
                        pms.add({ DurationStampMax : 0, NotePackCount : 0 });
                    }
                    for (var k = start; k <= end; k++) {
                        if (repeatSkip.indexOf(k) !== -1) {
                            continue;
                        }
                        pms.add(pms.get(k));
                    }
                });
            }
        })(result);

        cache.each(function (m) {
            m.NotePackCount = m.notes.size();
        });

        measureCount = parts[ 0 ].measures.size();
    };

    var Note = function (ne) {
        var note = {
            IsRest : false,
            IsDotted : false,
            TieType : null, /*Start End*/
            DurationType : 'Quarter',
            ArpeggioMode : null, /*Downward Upward*/
            Triplet : false,
            StampIndex : 0,
            PlayingDurationTimeMs : 0,
            ClassicPitchSignCount : 0,
            ClassicPitchSign : {},
            isChrod : false
        };

        var Sign = function () {
            return {
                index : 0,
                NumberedSign : 0,
                PlayingPitchIndex : 0,
                AlterantType : 'NoControl',
                Volume : 0.0
            };
        };

        var addSign = function (index, sign) {
            note.ClassicPitchSign[ '[' + index + ']' ] = sign;
            note.ClassicPitchSignCount++;

            var accidental = childText(ne, 'accidental');
            if (accidental) {
                AlterantType.each(function (at) {
                    if (at.toLowerCase() === accidental.toLowerCase()) {
                        sign.AlterantType = at;
                        return false;
                    }
                });
            }
        };

        var type = get(NoteType, childText(ne, 'type'));
        if (type) {
            var dt = get(DurationType, type + '');
            if (dt) {
                note.DurationType = dt;
            }
        }
        note.isChrod = !!ne.child('chord');
        var dotCount = ne.children('dot').length;
        note.IsDotted = dotCount > 0;

        var index = parseInt(childText(ne, 'staff')) || 1;

        (function tie(te) {
            if (!te) return;
            var tt = te.attr('type');
            if ('start' === tt) {
                note.TieType = 'Start';
            } else if ('stop' === tt) {
                note.TieType = 'End';
            }
        })(ne.child('tie'));

        (function notations(nos) {
            nos.each(function (noe) {
                noe.children().each(function (e) {
                    var name = e.name();
                    if ('tied' === name || 'slur' === name) {//延音和连音在GJM为一种
                        var et = e.attr('type');
                        if ('start' === et) {
                            note.TieType = 'Start';
                        } else if ('stop' === et) {
                            note.TieType = 'End';
                        }
                    } else if ('tuplet' === name) {// 需要判断是几连音
                        var tt = e.attr('type');
                        if ('start' === tt) {
                            note.Triplet = true;
                        } else if ('stop' === tt) {
                            //
                        }
                    } else if ('arpeggiate' === name) {// 琶音
                        var stem = childText(e, 'stem');
                        if (stem === 'up') {
                            note.ArpeggioMode = 'Upward';
                        } else {
                            note.ArpeggioMode = 'Downward';
                        }
                    }
                });
            });
        })(ne.children('notations'));

        if (ne.child('rest')) {
            note.IsRest = true;

            var duration = parseInt(childText(ne, 'duration'));
            if (duration) {
                var v = divisions * 4;
                if (dotCount === 1) {
                    v *= 3 / 2;
                } else if (dotCount === 2) {
                    v *= 7 / 4;
                }
                v /= duration;
                var dt = get(DurationType, v + '');
                if (dt) {
                    note.DurationType = dt;
                }
            }

            var sign = new Sign();
            sign.NumberedSign = 1;
            sign.PlayingPitchIndex = 1;
            addSign(STANDARD_C, sign);
        } else {
            (function pitch(pe) {
                var step = childText(pe, 'step');
                var octave = childText(pe, 'octave');

                var row = parseInt(octave);
                var index = NOTES.indexOf(step);

                var v = VALUES[ row ][ index ];
                if (v) {
                    var sign = new Sign();
                    sign.NumberedSign = index + 1;
                    sign.PlayingPitchIndex = v;

                    addSign(v, sign);
                }
            })(ne.child('pitch'));
        }

        return [ index, note ];
    };

    var notation = {
        Version : '1.1.0.0'
    };
    var measureCount = 0;
    var parts = [];
    var lastStaff = 1;

    var divisions = 1;

    var lastRepeatStart = 0;
    var skipOn = false;
    var repeatSkip = [];

    return {
        translate : function () {
            var root = parse(musicXML);
            var name = root.name();
            if (name === 'html') {
                var pe = root.find('parsererror');
                if (pe) {
                    alert(pe.find('div').text());
                } else {
                    alert(root.text());
                }
            } else if (name === 'score-partwise') {
                var version = root.attr('version');
                console.log('MusicXML version is ' + version);

                notation.info = Information(root);
                notation.track = Track(root);

                notation.info.MeasureAlignedCount = measureCount;

                var ls = [];
                ls.push(unite('Version', notation.Version));
                ls.push(unite('Notation', notation.info));
                ls.push(unite('Notation.RegularTracks', notation.track));
                return ls.join('\n');
            } else {
                alert('It is not MusicXML');
            }

            return false;
        }
    };
}

// From https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach
if (!Array.prototype.each) {
    Array.prototype.each = function (callback/*, thisArg*/) {
        var T, k;
        if (this === null) {
            throw new TypeError('this is null or not defined');
        }
        var O = Object(this);
        var len = O.length >>> 0;
        if (typeof callback !== 'function') {
            throw new TypeError(callback + ' is not a function');
        }
        if (arguments.length > 1) {
            T = arguments[ 1 ];
        }
        k = 0;
        while (k < len) {
            var kValue;
            if (k in O) {
                kValue = O[ k ];
                if (callback.call(T, kValue, k, O) === false) {
                    break;
                }
            }
            k++;
        }
    };
}

// From https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/includes
if (!String.prototype.includes) {
    String.prototype.includes = function (search, start) {
        'use strict';
        if (typeof start !== 'number') {
            start = 0;
        }
        if (start + search.length > this.length) {
            return false;
        } else {
            return this.indexOf(search, start) !== -1;
        }
    };
}

if (!window.console) window.console = {};

if (!window.console.log) window.console.log = function () {
};
