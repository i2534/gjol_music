/*
 *
 * Project Name: gjm-translator
 * Author: i2534
 * Author URI: https://github.com/i2534/gjol_music
 * Description: MusicXML/MXL/MIDI(future) -> GJM
 * License: Apache-2.0
 *
 */

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

// From https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map
if (!Array.prototype.map) {

    Array.prototype.map = function (callback/*, thisArg*/) {

        var T, A, k;

        if (this == null) {
            throw new TypeError('this is null or not defined');
        }

        // 1. Let O be the result of calling ToObject passing the |this|
        //    value as the argument.
        var O = Object(this);

        // 2. Let lenValue be the result of calling the Get internal
        //    method of O with the argument "length".
        // 3. Let len be ToUint32(lenValue).
        var len = O.length >>> 0;

        // 4. If IsCallable(callback) is false, throw a TypeError exception.
        // See: http://es5.github.com/#x9.11
        if (typeof callback !== 'function') {
            throw new TypeError(callback + ' is not a function');
        }

        // 5. If thisArg was supplied, let T be thisArg; else let T be undefined.
        if (arguments.length > 1) {
            T = arguments[ 1 ];
        }

        // 6. Let A be a new array created as if by the expression new Array(len)
        //    where Array is the standard built-in constructor with that name and
        //    len is the value of len.
        A = new Array(len);

        // 7. Let k be 0
        k = 0;

        // 8. Repeat, while k < len
        while (k < len) {

            var kValue, mappedValue;

            // a. Let Pk be ToString(k).
            //   This is implicit for LHS operands of the in operator
            // b. Let kPresent be the result of calling the HasProperty internal
            //    method of O with argument Pk.
            //   This step can be combined with c
            // c. If kPresent is true, then
            if (k in O) {

                // i. Let kValue be the result of calling the Get internal
                //    method of O with argument Pk.
                kValue = O[ k ];

                // ii. Let mappedValue be the result of calling the Call internal
                //     method of callback with T as the this value and argument
                //     list containing kValue, k, and O.
                mappedValue = callback.call(T, kValue, k, O);

                // iii. Call the DefineOwnProperty internal method of A with arguments
                // Pk, Property Descriptor
                // { Value: mappedValue,
                //   Writable: true,
                //   Enumerable: true,
                //   Configurable: true },
                // and false.

                // In browsers that support Object.defineProperty, use the following:
                // Object.defineProperty(A, k, {
                //   value: mappedValue,
                //   writable: true,
                //   enumerable: true,
                //   configurable: true
                // });

                // For best browser support, use the following:
                A[ k ] = mappedValue;
            }
            // d. Increase k by 1.
            k++;
        }

        // 9. return A
        return A;
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

// From https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/endsWith
if (!String.prototype.endsWith) {
    String.prototype.endsWith = function (search, this_len) {
        if (this_len === undefined || this_len > this.length) {
            this_len = this.length;
        }
        return this.substring(this_len - search.length, this_len) === search;
    };
}

var _Tool = new function () {
    var self = this;

    this.log = function (message, lv) {
        if (window._message) {
            window._message(message, lv);
        } else if (window.console) {
            var c = window.console;
            if (c.log) {
                c.log(message);
            }
        }
    };
    this.info = function (message) {
        this.log(message);
    };
    this.warn = function (m) {
        this.log(m, 1);
    };
    this.error = function (m) {
        this.log(m, 2);
    };

    this.isText = function (v) {
        return (typeof v) === 'string' || v instanceof String;
    };

    this.isLowerCase = function (c) {
        return c >= 'a' && c <= 'z';
    };

    this.isObject = function (o) {
        return (o !== null && typeof o === 'object');
    };

    this.tab = function (n) {
        if (!n || n <= 0) {
            return '';
        }
        var array = new Array(n);
        array.fill('\t');
        return array.join('');
    };

    this.object = function (o, lv) {
        var i = lv ? lv : 0;

        var ls = [];

        var isList = o instanceof this.List;
        if (!isList) {
            ls.push('{');
        }
        if (o.unite) {
            ls.push(o.unite(i + 1));
        } else {
            for (var n in o) {
                if (o.hasOwnProperty(n)) {
                    var v = o[ n ];
                    if (this.isLowerCase(n)) {
                        if (v instanceof this.List) {
                            ls.push(this.object(v, i));
                        }
                    } else {
                        var u = this.unite(n, v, i + 1);
                        if (u) {
                            ls.push(u + ',');
                        }
                    }
                }
            }
        }
        if (!isList) {
            ls.push(this.tab(lv) + '}');
        }
        return ls.join('\n');
    };

    this.unite = function (key, val, lv) {
        if (val === null || val === undefined || val === false) {
            return;
        }
        var line = this.tab(lv);
        line += key + ' = ';
        if (this.isText(val)) {
            line += '\'' + val.replace('\'', '\\\'') + '\'';
        } else if (typeof val === 'object') {
            line += this.object(val, lv);
        } else {
            line += val;
        }
        return line;
    };

    this.get = function (o, n) {
        if (o && (n in o)) {
            return o[ n ];
        }
    };
    this.set = function (o, n, v) {
        if (o && n) {
            if (v === undefined || v === null || isNaN(v)) {
                return;
            }
            o[ n ] = v;
        }
    };

    this.names = function (o) {
        var array = [];
        for (var n in o) {
            if (o.hasOwnProperty(n)) {
                array.push(n);
            }
        }
        return array;
    };

    this.key = function (o, val) {
        for (var n in o) {
            if (o.hasOwnProperty(n)) {
                if (o[ n ] === val) {
                    return n;
                }
            }
        }
    };

    this.isEqual = function (o1, o2) {
        if (o1 == o2) {
            return true;
        }
        if (this.isObject(o1)) {
            if (!this.isObject(o2)) {
                return false;
            }
            var as = function (a, b) {
                return a > b ? 1 : a < b ? -1 : 0;
            };
            var n1 = this.names(o1).sort(as), n2 = this.names(o2).sort(as);
            if (n1.length !== n2.length) {
                return false;
            }
            for (var i = 0, l = n1.length; i < l; i++) {
                var k = n1[ i ];
                if (k !== n2[ i ]) {
                    return false;
                }
                var v1 = o1[ k ], v2 = o2[ k ];
                if (!this.isEqual(v1, v2)) {
                    return false;
                }
            }
        } else if (Array.isArray(o1)) {
            if (!Array.isArray(o2)) {
                return false;
            }
            if (o1.length !== o2.length) {
                return false;
            }
            for (var j = 0, len = o1.length; j < len; j++) {
                if (!this.isEqual(o1[ j ], o2[ j ])) {
                    return false;
                }
            }
        } else {
            if (o1 != o2) {
                return false;
            }
        }
        return true;
    };

    this.PartLength = 3;
    this.ClefType = { 'G' : 'L2G', 'F' : 'L4F', 'C' : 'L3C', 'TAB' : 'L5TAB' };
    this.KeySignature = {
        '-7' : 'bC', '-6' : 'bG', '-5' : 'bD', '-4' : 'bA', '-3' : 'bE', '-2' : 'bB', '-1' : 'F',
        '0' : 'C', '1' : 'G', '2' : 'D', '3' : 'A', '4' : 'E', '5' : 'B', '6' : 'hF', '7' : 'hC'
    };
    this.DurationType = {
        '1' : 'Whole', '2' : 'Half', '4' : 'Quarter', '8' : 'Eighth', '16' : 'The16th', '32' : 'The32nd'
    };
    this.DurationKey = this.names(this.DurationType).map(function (v) {
        return parseInt(v);
    });
    this.NoteType = {
        'maxima' : -8, 'long' : -4, 'breve' : -2, 'whole' : 1, 'half' : 2, 'quarter' : 4, 'eighth' : 8,
        '16th' : 16, '32nd' : 32, '64th' : 64, '128th' : 128, '256th' : 256, '512th' : 512, '1024th' : 1024
    };
    this.AlterantType = [ 'NoControl', 'Natural', 'Sharp', 'Flat' ];

    this.VALUES = [
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
    this.STANDARD_C = this.VALUES[ 4 ][ 0 ];//Middle C

    this.NOTES = [ 'C', 'D', 'E', 'F', 'G', 'A', 'B' ];

    this.Tuple = function (index, val) {
        var uv = function () {
            if (Array.isArray(val)) {
                return '{ ' + val.join(', ') + ' }';
            }
            return self.isText(val) ? '\'' + val + '\'' : val.toString();
        };
        this.unite = function () {
            return '{ ' + index + ', ' + uv(val) + ' },';
        };
    };

    this.Group = function () {
        var ts = [];
        this.add = function (tuple) {
            ts.push(tuple);
            return this;
        };
        this.unite = function (lv) {
            var ls = [];
            ts.each(function (t) {
                ls.push(self.tab(lv) + t.unite(lv + 1));
            });
            return ls.join('\n');
        };
        this.size = function () {
            return ts.length;
        };
    };

    this.List = function () {
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
        this.insert = function (index, o) {
            if (Array.isArray(o)) {
                var i = index;
                o.each(function (item) {
                    vs.splice(i++, 0, item);
                });
            } else {
                vs.splice(index, 0, o);
            }
            return this;
        };
        this.size = function () {
            return vs.length;
        };
        this.unite = function (lv) {
            var ls = [];
            vs.each(function (v, i) {
                ls.push(self.tab(lv) + '[' + i + '] = ' + self.object(v, lv) + ',');
            });
            return ls.join('\n');
        };
        this.array = function () {
            return vs;
        };
    };
};

var MXL = (function () {
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

    function TR(musicXML, cfg) {

        var K = _Tool;

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

        var childText = function (xe, name) {
            if (xe) {
                var e = xe.child(name);
                if (e) {
                    return e.text();
                }
            }
        };

        var measureAt = function (partIndex, measureIndex) {
            var part = parts[ partIndex ];
            var ms = part.measures;
            for (var i = ms.size(); i <= measureIndex; i++) {
                ms.add({
                    DurationStampMax : 0,
                    NotePackCount : 0,
                    notes : new K.List()
                });
            }
            return ms.get(measureIndex);
        };

        var Information = function (root) {
            var info = {
                Version : '1.1.0.0',
                NotationName : null,
                NotationAuthor : null,
                NotationTranslater : 'MXLTranslator',
                NotationCreator : '凤仪(百草谷)',
                Volume : 1,
                BeatsPerMeasure : 0,
                BeatDurationType : '',
                NumberedKeySignature : 'C',
                MeasureBeatsPerMinuteMap : new K.Group(),
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

            info.NotationName = cfg.name || info.NotationName || '未知名称';
            info.NotationAuthor = cfg.author || info.NotationAuthor || '未知作者';

            return info;
        };

        var Track = function (root) {
            var Part = function (index) {
                var instrument = cfg[ 'instrument' + index ] || 'Piano';
                return {
                    MeasureKeySignatureMap : new K.Group(),
                    MeasureClefTypeMap : new K.Group(),
                    MeasureInstrumentTypeMap : new K.Group().add(new K.Tuple(0, instrument)),
                    MeasureVolumeCurveMap : new K.Group().add(new K.Tuple(0, [ 1.0, 0.8, 0.4, 0.5, 0.8, 0.7, 0.4, 0.3 ])),
                    MeasureVolumeMap : new K.Group().add(new K.Tuple(0, 1.0)),
                    measures : new K.List()
                };
            };
            for (var i = 0; i < K.PartLength; i++) {
                parts.push(new Part(i));
            }

            (function partList(pl) {
                if (!pl) return;

                var measureIndex = 0;
                if (pl.children('part-group').length > 1) {//In Group
                    var start, size = 0, mss = [];
                    pl.children().each(function (e) {
                        var name = e.name();
                        if ('part-group' === name) {
                            var type = e.attr('type'), num = e.attr('number');
                            K.log('PartGroup number is ' + num + ' ' + type);
                            if ('start' === type) {
                                start = true;
                            } else if ('stop' === type) {
                                K.log('Now only support first part group!');
                                return false;
                            }
                        } else if ('score-part' === name) {
                            if (!start) {
                                K.warn('Why part before part group? Skip it...');
                            } else if (mss.length > parts.length) {
                                K.warn('Part is too many, skip it...');
                            } else {
                                var id = e.attr('id'), pn = childText(e, 'part-name');
                                K.log('Part id is ' + id + ', name is ' + pn);
                                var part = root.select('part[@id=\'' + id + '\']')[ 0 ];
                                var ms = part.children('measure');
                                size = Math.max(size, ms.length);
                                var map = {
                                    '__size' : ms.length,
                                    '__key' : []
                                };
                                ms.each(function (m) {
                                    var number = m.attr('number');
                                    if (map.hasOwnProperty(number)) {
                                        K.warn('Measure number ' + number + ' is duplicate');
                                    }
                                    map[ number ] = m;
                                    map[ '__key' ].push(number);
                                });
                                mss.push(map);
                            }
                        }
                    });
                    var key = [];
                    mss.each(function (map) {
                        if (map[ '__size' ] === size) {//只管第一个满足的,其他的不管
                            key = map[ '__key' ];
                            return false;
                        }
                    });
                    key.each(function (k) {
                        var max = 0;
                        mss.each(function (map, n) {
                            var m = map[ k ];
                            if (m) {
                                max = Math.max(max, Measure(m, measureIndex, n));
                            }
                        });
                        measureIndex += max;
                    });
                } else {//Single
                    var sp = pl.child('score-part');
                    var id = sp.attr('id'), name = childText(sp, 'part-name');
                    K.log('Part id is ' + id + ', name is ' + name);
                    var part = root.select('part[@id=\'' + id + '\']')[ 0 ];
                    var ms = part.children('measure');
                    ms.each(function (m) {
                        measureIndex += Measure(m, measureIndex);
                    });
                }
            })(root.find('part-list'));

            notation.info.MeasureAlignedCount = parts[ 0 ].measures.size();
            var track = {};
            parts.each(function (p, i) {
                track[ '[' + i + ']' ] = p;
            });
            return track;
        };

        var Measure = function (me, index, partIndex) {
            var inGroup = partIndex !== undefined;

            var number = me.attr('number');
            K.log('Measure number is ' + number + ', real index is ' + index);

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
                        info.MeasureBeatsPerMinuteMap.add(new K.Tuple(index, Math.round(tempo * speed)));
                        return false;
                    }
                });
                return tempo;
            })(me.children('direction'));

            if (!bpm && index === 0 && partIndex === 0) {
                info.MeasureBeatsPerMinuteMap.add(new K.Tuple(0, Math.round(120 * speed)));
            }

            (function attributes(as) {
                if (!as) {
                    return;
                }
                //var staff = parseInt(childText(as, 'staves'));
                //if (isNaN(staff)) {
                //    staff = 1;
                //}

                var dis = parseInt(childText(as, 'divisions'));
                if (dis) {
                    divisions = dis;
                }

                as.children('clef').each(function (clef) {
                    var num = parseInt(clef.attr('number'));
                    if (isNaN(num)) {
                        num = inGroup ? partIndex : 0;
                    } else {
                        num -= 1;
                    }
                    if (num >= parts.length) {
                        return false;
                    }

                    var sign = childText(clef, 'sign');
                    var type = K.get(K.ClefType, sign);
                    if (!type) {
                        K.log('Clef type ' + sign + ' is not mapping');
                    } else {
                        parts[ num ].MeasureClefTypeMap.add(new K.Tuple(index, type));
                    }
                });

                var fifths = parseInt(childText(as.child('key'), 'fifths'));//get(KeySignature, fifths);
                if (!isNaN(fifths)) {
                    if (inGroup) {
                        parts[ partIndex ].MeasureKeySignatureMap.add(new K.Tuple(index, fifths));
                    } else {
                        parts.each(function (p) {
                            p.MeasureKeySignatureMap.add(new K.Tuple(index, fifths));
                        });
                    }
                }

                var time = as.child('time');
                if (time) {
                    var beats = childText(time, 'beats');
                    if (beats) {
                        info.BeatsPerMeasure = parseInt(beats);
                    }
                    var beatType = childText(time, 'beat-type');
                    if (beatType) {
                        var type = K.get(K.DurationType, beatType);
                        if (type) {
                            info.BeatDurationType = type;
                        } else {
                            K.log('Beat type ' + beatType + 'is not mapping');
                        }
                    }
                }
            })(me.child('attributes'));

            (function note(notes) {
                notes.each(function (n, i) {
                    var na = Note(n, i);

                    var staff = inGroup ? partIndex : na[ 0 ] - 1;

                    if (staff >= K.PartLength) {
                        K.warn('Ignore note of part ' + (staff + 1));
                        return;
                    }

                    var note = na[ 1 ], last;

                    var m = measureAt(staff, index);
                    var size = m.notes.size();
                    if (size === 0) {
                        note.StampIndex = 0;
                    } else {
                        last = m.notes.get(size - 1);
                        var v = parseInt(K.key(K.DurationType, last.DurationType));
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

            var repeatCount = 0;

            if (enableRepeat) {
                (function (baseline) {
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
                        K.log('Repeat measure from ' + start + ' to ' + end + ', skip [' + repeatSkip.join(',') + ']');

                        var array = [], skip = 0;
                        parts.each(function (_, i) {
                            var pms = [];
                            for (var k = start; k <= end; k++) {
                                if (repeatSkip.indexOf(k) !== -1) {
                                    if (i === 0) skip++;
                                    continue;
                                }
                                pms.push(measureAt(i, k));
                            }
                            array.push(pms);
                        });

                        parts.each(function (part, pi) {
                            part.measures.insert(end + 1, array[ pi ]);
                        });

                        repeatCount = end - start + 1 - skip;
                    }
                })((function (bes) {
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
                })(me.children('barline')));
            }

            for (var i = 0; i < K.PartLength; i++) {
                var m = measureAt(i, index);
                m.NotePackCount = m.notes.size();
            }
            return repeatCount + 1;
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
                    NumberedSign : 0, PlayingPitchIndex : 0,
                    AlterantType : 'NoControl', Volume : 0.0
                };
            };

            var addSign = function (index, sign) {
                note.ClassicPitchSign[ '[' + index + ']' ] = sign;
                note.ClassicPitchSignCount++;

                var accidental = childText(ne, 'accidental');
                if (accidental) {
                    K.AlterantType.each(function (at) {
                        if (at.toLowerCase() === accidental.toLowerCase()) {
                            sign.AlterantType = at;
                            return false;
                        }
                    });
                }
            };

            var type = K.get(K.NoteType, childText(ne, 'type'));
            if (type) {
                var dt = K.get(K.DurationType, type + '');
                if (dt) {
                    note.DurationType = dt;
                }
            }
            note.isChrod = !!ne.child('chord');
            var dotCount = ne.children('dot').length;
            note.IsDotted = dotCount > 0;

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
                    var rdt = K.get(K.DurationType, v + '');
                    if (rdt) {
                        note.DurationType = rdt;
                    }
                }

                var sign = new Sign();
                sign.NumberedSign = 1;
                sign.PlayingPitchIndex = 1;
                addSign(K.STANDARD_C, sign);
            } else {
                (function pitch(pe) {
                    var step = childText(pe, 'step');
                    var octave = childText(pe, 'octave');

                    var row = parseInt(octave);
                    var index = K.NOTES.indexOf(step);

                    var v = K.VALUES[ row ][ index ];
                    if (v) {
                        var sign = new Sign();
                        sign.NumberedSign = index + 1;
                        sign.PlayingPitchIndex = v;

                        addSign(v, sign);
                    }
                })(ne.child('pitch'));
            }
            var index = parseInt(childText(ne, 'staff'));
            return [ isNaN(index) ? 1 : index, note ];
        };

        var notation = {
            Version : '1.1.0.0'
        };
        var speed = (function (v) {
            var i = parseInt(v);
            if (isNaN(i)) {
                return 1;
            }
            return Math.max(0.5, Math.min(3, i / 100));
        })(cfg.speed);

        var parts = [];

        var divisions = 1;

        var enableRepeat = 'on' === cfg.repeat;
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
                        K.error(pe.find('div').text());
                    } else {
                        K.error(root.text());
                    }
                } else if (name === 'score-partwise') {
                    var version = root.attr('version');
                    K.log('MusicXML version is ' + version);

                    notation.info = Information(root);
                    notation.track = Track(root);

                    var ls = [];
                    ls.push(K.unite('Version', notation.Version));
                    ls.push(K.unite('Notation', notation.info));
                    ls.push(K.unite('Notation.RegularTracks', notation.track));
                    return ls.join('\n');
                } else if (name === 'museScore') {
                    K.error('It is MuseScore file, use MuseScore2 export to MusicXML!');
                } else {
                    K.error('It is not MusicXML');
                }

                return false;
            }
        };
    }

    return {
        Element : XE, Translator : TR
    };
})();

//https://github.com/colxi/midi-parser-js/wiki/MIDI-File-Format-Specifications
//http://jz.docin.com/p-772023750.html
var SMF = (function () {

    function TR(midi, cfg) {
        var K = _Tool;

        var smf = (midi !== null && typeof midi === 'object') ? midi : JSON.parse(midi);

        //https://www.recordingblogs.com/wiki/time-division-of-a-midi-file
        var division = smf.timeDivision;//PPQN "ticks per beat" (or “pulses per quarter note”)
        if (Array.isArray(division)) {
            // TODO Frames per second
        }
        var endTick = 0;
        var tempo = 1000000;
        var msPerTick = 0;
        var endTimeMS = 0;
        var bpm = 0;
        var durationCount = 0;

        var timeSignature = [];
        var usingTimeSign = {
            numerator : 4, //beat per measure
            denominator : 4 // which note per beat
        };

        var quartDuration = K.DurationKey[ 2 ], unitDuration = K.DurationKey[ K.DurationKey.length - 1 ];
        var ppun = division * quartDuration / unitDuration;// pulses per unit note

        function Information(smf) {

            var info = {
                Version : '1.1.0.0',
                NotationName : null,
                NotationAuthor : null,
                NotationTranslater : 'MXLTranslator',
                NotationCreator : '凤仪(百草谷)',
                Volume : 1,
                BeatsPerMeasure : usingTimeSign.numerator,
                BeatDurationType : K.get(K.DurationType, '' + usingTimeSign.denominator),
                NumberedKeySignature : 'C',
                MeasureBeatsPerMinuteMap : new K.Group(),
                MeasureAlignedCount : 0
            };

            //http://www.inspiredacoustics.com/en/MIDI_note_numbers_and_center_frequencies
            //https://newt.phys.unsw.edu.au/jw/notes.html
            var FULL_NOTES = [ 'C', 'C#'/*Db*/, 'D', 'D#'/*Eb*/, 'E', 'F', 'F#'/*Gb*/, 'G', 'G#'/*Ab*/, 'A', 'A#'/*Bb*/, 'B' ];
            // C1 = 24, C2 = 36, C3 = 48, C4(*) = 60, C5 = 72, C6 = 84, C7 = 96, C8 = 108, C9 = 120
            var noteMapping = function (note) {
                var row = Math.floor(note / 12), index = note % 12;
                var name = FULL_NOTES[ index ];
                var sharp = false;
                if (name.endsWith('#')) {
                    name = FULL_NOTES[ index - 1 ];
                    sharp = true;
                }
                row -= 1;
                index = K.NOTES.indexOf(name);
                var v = K.VALUES[ row ][ index ];
                return [ v, sharp, index ];
            };

            var onNotes;
            var offNote = function (event, number) {
                var v = number || event.data[ 0 ], e = onNotes[ v ];
                if (e) {
                    var period = event.tickBegin - e.tickBegin;
                    e.tickCount = period;
                    e.startAtUnit = e.tickBegin / ppun;
                    e.countAtUnit = period / ppun;
                    delete onNotes[ v ];
                    return period;
                }
                return 0;
            };

            var MetaEvent = {
                1 : //(0x01) Text Event
                    function (event) {
                        K.log('Text : ' + event.data);
                    },
                2 :// (0x02) Copyright Notice
                    function (event) {
                        K.log('Copyright : ' + event.data);
                    },
                3 ://(0x03) Sequence/Track Name
                    function (event) {
                        K.log('Track name : ' + event.data);
                    },
                47 ://(0x2F) End Of Track
                    function (event) {
                        for (var num in onNotes) {
                            if (onNotes.hasOwnProperty(num)) {
                                offNote(event, onNotes[ num ].data[ 0 ]);
                            }
                        }
                        onNotes = {};
                    },
                81 ://(0x51) Set Tempo
                    function (event) {//http://www.deluge.co/?q=midi-tempo-bpm
                        tempo = event.data;
                        //http://midi.teragonaudio.com/tech/midifile/ppqn.htm
                    },
                88 : //(0x58) Time Signature
                    function (event) {
                        if (durationCount++ > 0) {
                            K.warn('拍号已经出现过,暂时不支持临时变拍');
                        }
                        var data = event.data;
                        //var numerator = data[ 0 ];
                        //var denominator = data[ 1 ];
                        //var clocks_per_click = data[ 2 ];
                        //var notated_32nd_notes_per_beat = data[ 3 ];

                        timeSignature.push({
                            numerator : data[ 0 ],
                            denominator : Math.pow(2, data[ 1 ])
                        });
                    },
                89 : //(0x59) Key Signature
                    function (event) {//https://www.recordingblogs.com/wiki/midi-key-signature-meta-message
                        var data = event.data;
                        var key = data[ 0 ];
                        console.log('Key = ' + key);
                        //info.MeasureKeySignatureMap.add(new K.Tuple(0, key));
                    }
            };

            smf.track.each(function (track) {
                onNotes = {};
                var time = 0, noteTick = 0;
                track.event.each(function (event) {
                    time += event.deltaTime;
                    event.tickBegin = time;

                    switch (event.type) {
                        case 0xFF://(0xFF) Meta Event
                            var me = MetaEvent[ event.metaType ];
                            me && me(event);
                            break;
                        case 0x8://(0x8) Note Off
                            noteTick += offNote(event);
                            break;
                        case 0x9://(0x9) Note On
                            //https://learn.sparkfun.com/tutorials/midi-tutorial/messages
                            if (event.data[ 1 ] === 0) {//implicit note off
                                noteTick += offNote(event);
                            } else {
                                var d = event.data[ 0 ];
                                onNotes[ d ] = event;
                                event.note = noteMapping(d);
                            }
                            break;
                    }
                });
                track.tick = noteTick;
                endTick = Math.max(endTick, time);
            });

            if (timeSignature.length) {
                var ts = timeSignature[ 0 ];
                info.BeatsPerMeasure = ts.numerator;
                var type = K.get(K.DurationType, ts.denominator + '');
                if (type) {
                    info.BeatDurationType = type;
                } else {
                    K.log('Beat type ' + ts.denominator + 'is not mapping');
                }
                usingTimeSign = ts;
            }

            bpm = Math.round(60000000 / tempo);
            K.log('Tempo = ' + tempo + ', BPM = ' + bpm);

            if (info.MeasureBeatsPerMinuteMap.size() === 0) {
                info.MeasureBeatsPerMinuteMap.add(new K.Tuple(0, bpm));
            }

            var microsecondsPerTick = tempo / division;
            msPerTick = microsecondsPerTick / 1000;

            endTimeMS = endTick * microsecondsPerTick / 1000000;

            return info;
        }

        function Track(smf) {
            var Part = function (index) {
                var instrument = cfg[ 'instrument' + index ] || 'Piano';
                return {
                    MeasureKeySignatureMap : new K.Group(),
                    MeasureClefTypeMap : new K.Group(),
                    MeasureInstrumentTypeMap : new K.Group().add(new K.Tuple(0, instrument)),
                    MeasureVolumeCurveMap : new K.Group().add(new K.Tuple(0, [ 1.0, 0.8, 0.4, 0.5, 0.8, 0.7, 0.4, 0.3 ])),
                    MeasureVolumeMap : new K.Group().add(new K.Tuple(0, 1.0)),
                    measures : new K.List()
                };
            };
            for (var i = 0; i < K.PartLength; i++) {
                parts.push(new Part(i));
            }

            var measureAt = function (partIndex, measureIndex) {
                var part = parts[ partIndex ];
                var ms = part.measures;
                for (var i = ms.size(); i <= measureIndex; i++) {
                    ms.add({
                        DurationStampMax : 0,
                        NotePackCount : 0,
                        notes : new K.List()
                    });
                }
                return ms.get(measureIndex);
            };

            var noteDuration = function (beatCount) {
                var ret = new Array(K.DurationKey.length);

                var reduce = function (val, index) {
                    if (val > 2 && index > 0) {
                        var r = Math.floor(val / 2);
                        ret[ index ] = val - r * 2;
                        reduce(r, index - 1);
                    } else {
                        ret[ index ] = val;
                    }
                };

                var max = Math.round(beatCount * unitDuration / beatDuration);
                reduce(max, K.DurationKey.length - 1);
                return ret;
            };

            var partIndex = 0, beatDuration = usingTimeSign.denominator, multiple = unitDuration / beatDuration,
                beatsPerMeasure = usingTimeSign.numerator, unitPerMeasure = beatsPerMeasure * multiple;
            smf.track.each(function (track) {
                if (track.tick < 10) {
                    return;//have no note
                }
                track.event.each(function (event) {
                    if (!event.tickCount) {
                        return;//is not note
                    }
                    var cau = event.countAtUnit, sau = event.startAtUnit;
                    var measureIndex = Math.floor(sau / unitPerMeasure);
                    var relative = sau - measureIndex * unitPerMeasure;

                    var measure = measureAt(partIndex, measureIndex);
                    measure.notes.add({
                        note : event.note,
                        //startAtTick : event.tickBegin, countAtTick : event.tickCount,
                        startAtUnit : Math.round(relative), countAtUnit : Math.round(cau)
                    });
                });
                if (partIndex++ >= parts.length) {
                    K.warn('Track count is too many...');
                    return false;
                }
            });

            var Note = function () {
                return {
                    IsRest : false,
                    IsDotted : false,
                    TieType : null, /*Start End*/
                    DurationType : 'Quarter',
                    ArpeggioMode : null, /*Downward Upward*/
                    Triplet : false,
                    StampIndex : 0,
                    PlayingDurationTimeMs : 0,
                    ClassicPitchSignCount : 0,
                    ClassicPitchSign : {}
                };
            };

            var rest = function (beatCount) {
                var note = new Note();

                note.IsRest = true;

                var duration = unitDuration / beatCount;
                var rdt = K.get(K.DurationType, duration + '');
                if (rdt) {
                    note.DurationType = rdt;
                }

                note.ClassicPitchSignCount = 1;
                note.ClassicPitchSign[ '[' + K.STANDARD_C + ']' ] = {
                    NumberedSign : 1, PlayingPitchIndex : 1,
                    AlterantType : K.AlterantType[ 0 ], Volume : 0.0
                };
                return note;
            };

            var track = {}, measureSize = 0, unitDurationType = K.get(K.DurationType, unitDuration + '');
            parts.each(function (part, pi) {
                part.MeasureKeySignatureMap.add(new K.Tuple(0, 0));
                part.MeasureClefTypeMap.add(new K.Tuple(0, 'L2G'));

                var leave = [];
                part.measures.array().each(function (measure, mi) {
                    var mark = new Array(unitPerMeasure);//[][]

                    var fill = function (notes) {
                        var array = [];
                        notes.each(function (item) {
                            for (var c = 0; c < item.countAtUnit; c++) {
                                var i = item.startAtUnit + c;
                                if (i >= unitPerMeasure) {// 跨小节
                                    array.push({
                                        note : item.note,
                                        startAtUnit : mi * unitPerMeasure,
                                        countAtUnit : item.startAtUnit + item.countAtUnit - unitPerMeasure
                                    });
                                    return;
                                }
                                if (!mark[ i ]) {
                                    mark[ i ] = [];
                                }
                                mark[ i ].push(item.note);
                            }
                        });
                        leave = array;
                    };
                    fill(leave);
                    fill(measure.notes.array());

                    var cache = [];
                    for (var i = 0; i < mark.length; i++) {
                        var item = mark[ i ];
                        if (!item || !item.length) {
                            //list.add(rest(1));
                            cache.push(rest(1));
                        } else {
                            var note = new Note();
                            note.DurationType = unitDurationType;
                            note.ClassicPitchSignCount = item.length;
                            item.each(function (o) {
                                var num = o[ 0 ], sharp = o[ 1 ], nsi = o[ 2 ];
                                note.ClassicPitchSign[ '[' + num + ']' ] = {
                                    NumberedSign : nsi + 1, PlayingPitchIndex : num,
                                    AlterantType : sharp ? K.AlterantType[ 2 ] : K.AlterantType[ 0 ], Volume : 0.0
                                };
                            });
                            //list.add(note);
                            cache.push(note);
                        }
                    }

                    var reduce = function (count) {
                        var ret = new Array(K.DurationKey.length);
                        var calc = function (val, index) {
                            if (val > 1 && index > 0) {
                                var r = Math.floor(val / 2);
                                ret[ index ] = val - r * 2;
                                calc(r, index - 1);
                            } else {
                                ret[ index ] = val;
                            }
                        };
                        calc(count, K.DurationKey.length - 1);
                        return ret;
                    };

                    var merge = function (array) {
                        var list = new K.List();

                        for (var i = 0, len = array.length; i < len;) {
                            var c = i, o = array[ i ];
                            while (i++ < len) {
                                if (!K.isEqual(o, array[ i ])) {
                                    break;
                                }
                            }
                            var count = i - c;
                            if (count > 0) {
                                var ret = reduce(i - c);
                                ret.each(function (k, ki) {//忽略超过1个全音符的情况....不知道该怎么处理
                                    if (k > 0) {
                                        var n = array[ c++ ];
                                        n.DurationType = K.get(K.DurationType, K.DurationKey[ ki ] + '');
                                        list.add(n);
                                    }
                                });
                            } else {
                                list.add(c);
                            }
                        }
                        return list;
                    };
                    //merge same notes
                    var list = merge(cache);

                    measure.notes = list;
                    measure.NotePackCount = list.size();
                });
                if (leave.length) {
                    //TODO 添加多出来的遗留音符
                }

                track[ '[' + pi + ']' ] = part;

                measureSize = Math.max(measureSize, part.measures.size());
            });
            parts.each(function (part) {
                var ms = part.measures;
                for (var c = ms.size(); c < measureSize; c++) {
                    ms.add({
                        DurationStampMax : 0, NotePackCount : 0
                    });
                }
            });
            notation.info.MeasureAlignedCount = measureSize;
            return track;
        }

        var notation = {
            Version : '1.1.0.0'
        };
        var parts = [];

        return {
            translate : function () {

                notation.info = Information(smf);
                console.log(smf);
                notation.track = Track(smf);

                var ls = [];
                ls.push(K.unite('Version', notation.Version));
                ls.push(K.unite('Notation', notation.info));
                ls.push(K.unite('Notation.RegularTracks', notation.track));
                return ls.join('\n');
            }
        };
    }

    return {
        Translator : TR
    };
})();