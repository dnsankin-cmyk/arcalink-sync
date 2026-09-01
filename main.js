/*! Copyright (C) 2026 ИП Санкин Денис Николаевич | SPDX-License-Identifier: GPL-3.0-only */
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all2) => {
  for (var name in all2)
    __defProp(target, name, { get: all2[name], enumerable: true });
};
var __copyProps = (to, from2, except, desc) => {
  if (from2 && typeof from2 === "object" || typeof from2 === "function") {
    for (let key of __getOwnPropNames(from2))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from2[key], enumerable: !(desc = __getOwnPropDesc(from2, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// node_modules/lib0/map.js
var create, copy, setIfUndefined, map, any;
var init_map = __esm({
  "node_modules/lib0/map.js"() {
    create = () => /* @__PURE__ */ new Map();
    copy = (m) => {
      const r = create();
      m.forEach((v, k) => {
        r.set(k, v);
      });
      return r;
    };
    setIfUndefined = (map2, key, createT) => {
      let set = map2.get(key);
      if (set === void 0) {
        map2.set(key, set = createT());
      }
      return set;
    };
    map = (m, f) => {
      const res = [];
      for (const [key, value] of m) {
        res.push(f(value, key));
      }
      return res;
    };
    any = (m, f) => {
      for (const [key, value] of m) {
        if (f(value, key)) {
          return true;
        }
      }
      return false;
    };
  }
});

// node_modules/lib0/set.js
var create2;
var init_set = __esm({
  "node_modules/lib0/set.js"() {
    create2 = () => /* @__PURE__ */ new Set();
  }
});

// node_modules/lib0/array.js
var last, appendTo, from, every, some, unfold, isArray;
var init_array = __esm({
  "node_modules/lib0/array.js"() {
    last = (arr) => arr[arr.length - 1];
    appendTo = (dest, src) => {
      for (let i = 0; i < src.length; i++) {
        dest.push(src[i]);
      }
    };
    from = Array.from;
    every = (arr, f) => {
      for (let i = 0; i < arr.length; i++) {
        if (!f(arr[i], i, arr)) {
          return false;
        }
      }
      return true;
    };
    some = (arr, f) => {
      for (let i = 0; i < arr.length; i++) {
        if (f(arr[i], i, arr)) {
          return true;
        }
      }
      return false;
    };
    unfold = (len, f) => {
      const array = new Array(len);
      for (let i = 0; i < len; i++) {
        array[i] = f(i, array);
      }
      return array;
    };
    isArray = Array.isArray;
  }
});

// node_modules/lib0/observable.js
var ObservableV2;
var init_observable = __esm({
  "node_modules/lib0/observable.js"() {
    init_map();
    init_set();
    init_array();
    ObservableV2 = class {
      constructor() {
        this._observers = create();
      }
      /**
       * @template {keyof EVENTS & string} NAME
       * @param {NAME} name
       * @param {EVENTS[NAME]} f
       */
      on(name, f) {
        setIfUndefined(
          this._observers,
          /** @type {string} */
          name,
          create2
        ).add(f);
        return f;
      }
      /**
       * @template {keyof EVENTS & string} NAME
       * @param {NAME} name
       * @param {EVENTS[NAME]} f
       */
      once(name, f) {
        const _f = (...args2) => {
          this.off(
            name,
            /** @type {any} */
            _f
          );
          f(...args2);
        };
        this.on(
          name,
          /** @type {any} */
          _f
        );
      }
      /**
       * @template {keyof EVENTS & string} NAME
       * @param {NAME} name
       * @param {EVENTS[NAME]} f
       */
      off(name, f) {
        const observers = this._observers.get(name);
        if (observers !== void 0) {
          observers.delete(f);
          if (observers.size === 0) {
            this._observers.delete(name);
          }
        }
      }
      /**
       * Emit a named event. All registered event listeners that listen to the
       * specified name will receive the event.
       *
       * @todo This should catch exceptions
       *
       * @template {keyof EVENTS & string} NAME
       * @param {NAME} name The event name.
       * @param {Parameters<EVENTS[NAME]>} args The arguments that are applied to the event listener.
       */
      emit(name, args2) {
        return from((this._observers.get(name) || create()).values()).forEach((f) => f(...args2));
      }
      destroy() {
        this._observers = create();
      }
    };
  }
});

// node_modules/lib0/math.js
var floor, abs, min, max, isNaN, isNegativeZero;
var init_math = __esm({
  "node_modules/lib0/math.js"() {
    floor = Math.floor;
    abs = Math.abs;
    min = (a, b) => a < b ? a : b;
    max = (a, b) => a > b ? a : b;
    isNaN = Number.isNaN;
    isNegativeZero = (n) => n !== 0 ? n < 0 : 1 / n < 0;
  }
});

// node_modules/lib0/binary.js
var BIT1, BIT2, BIT3, BIT4, BIT6, BIT7, BIT8, BIT18, BIT19, BIT20, BIT21, BIT22, BIT23, BIT24, BIT25, BIT26, BIT27, BIT28, BIT29, BIT30, BIT31, BIT32, BITS5, BITS6, BITS7, BITS17, BITS18, BITS19, BITS20, BITS21, BITS22, BITS23, BITS24, BITS25, BITS26, BITS27, BITS28, BITS29, BITS30, BITS31;
var init_binary = __esm({
  "node_modules/lib0/binary.js"() {
    BIT1 = 1;
    BIT2 = 2;
    BIT3 = 4;
    BIT4 = 8;
    BIT6 = 32;
    BIT7 = 64;
    BIT8 = 128;
    BIT18 = 1 << 17;
    BIT19 = 1 << 18;
    BIT20 = 1 << 19;
    BIT21 = 1 << 20;
    BIT22 = 1 << 21;
    BIT23 = 1 << 22;
    BIT24 = 1 << 23;
    BIT25 = 1 << 24;
    BIT26 = 1 << 25;
    BIT27 = 1 << 26;
    BIT28 = 1 << 27;
    BIT29 = 1 << 28;
    BIT30 = 1 << 29;
    BIT31 = 1 << 30;
    BIT32 = 1 << 31;
    BITS5 = 31;
    BITS6 = 63;
    BITS7 = 127;
    BITS17 = BIT18 - 1;
    BITS18 = BIT19 - 1;
    BITS19 = BIT20 - 1;
    BITS20 = BIT21 - 1;
    BITS21 = BIT22 - 1;
    BITS22 = BIT23 - 1;
    BITS23 = BIT24 - 1;
    BITS24 = BIT25 - 1;
    BITS25 = BIT26 - 1;
    BITS26 = BIT27 - 1;
    BITS27 = BIT28 - 1;
    BITS28 = BIT29 - 1;
    BITS29 = BIT30 - 1;
    BITS30 = BIT31 - 1;
    BITS31 = 2147483647;
  }
});

// node_modules/lib0/number.js
var MAX_SAFE_INTEGER, MIN_SAFE_INTEGER, LOWEST_INT32, isInteger, isNaN2, parseInt;
var init_number = __esm({
  "node_modules/lib0/number.js"() {
    init_math();
    MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER;
    MIN_SAFE_INTEGER = Number.MIN_SAFE_INTEGER;
    LOWEST_INT32 = 1 << 31;
    isInteger = Number.isInteger || ((num) => typeof num === "number" && isFinite(num) && floor(num) === num);
    isNaN2 = Number.isNaN;
    parseInt = Number.parseInt;
  }
});

// node_modules/lib0/string.js
var fromCharCode, fromCodePoint, MAX_UTF16_CHARACTER, toLowerCase, trimLeftRegex, trimLeft, fromCamelCaseRegex, fromCamelCase, _encodeUtf8Polyfill, utf8TextEncoder, _encodeUtf8Native, encodeUtf8, utf8TextDecoder, repeat;
var init_string = __esm({
  "node_modules/lib0/string.js"() {
    init_array();
    fromCharCode = String.fromCharCode;
    fromCodePoint = String.fromCodePoint;
    MAX_UTF16_CHARACTER = fromCharCode(65535);
    toLowerCase = (s) => s.toLowerCase();
    trimLeftRegex = /^\s*/g;
    trimLeft = (s) => s.replace(trimLeftRegex, "");
    fromCamelCaseRegex = /([A-Z])/g;
    fromCamelCase = (s, separator) => trimLeft(s.replace(fromCamelCaseRegex, (match2) => `${separator}${toLowerCase(match2)}`));
    _encodeUtf8Polyfill = (str) => {
      const encodedString = unescape(encodeURIComponent(str));
      const len = encodedString.length;
      const buf = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        buf[i] = /** @type {number} */
        encodedString.codePointAt(i);
      }
      return buf;
    };
    utf8TextEncoder = /** @type {TextEncoder} */
    typeof TextEncoder !== "undefined" ? new TextEncoder() : null;
    _encodeUtf8Native = (str) => utf8TextEncoder.encode(str);
    encodeUtf8 = utf8TextEncoder ? _encodeUtf8Native : _encodeUtf8Polyfill;
    utf8TextDecoder = typeof TextDecoder === "undefined" ? null : new TextDecoder("utf-8", { fatal: true, ignoreBOM: true });
    if (utf8TextDecoder && utf8TextDecoder.decode(new Uint8Array()).length === 1) {
      utf8TextDecoder = null;
    }
    repeat = (source, n) => unfold(n, () => source).join("");
  }
});

// node_modules/lib0/encoding.js
var Encoder, createEncoder, length, toUint8Array, verifyLen, write, writeUint8, writeVarUint, writeVarInt, _strBuffer, _maxStrBSize, _writeVarStringNative, _writeVarStringPolyfill, writeVarString, writeBinaryEncoder, writeUint8Array, writeVarUint8Array, writeOnDataView, writeFloat32, writeFloat64, writeBigInt64, floatTestBed, isFloat32, writeAny, RleEncoder, flushUintOptRleEncoder, UintOptRleEncoder, flushIntDiffOptRleEncoder, IntDiffOptRleEncoder, StringEncoder;
var init_encoding = __esm({
  "node_modules/lib0/encoding.js"() {
    init_math();
    init_number();
    init_binary();
    init_string();
    init_array();
    Encoder = class {
      constructor() {
        this.cpos = 0;
        this.cbuf = new Uint8Array(100);
        this.bufs = [];
      }
    };
    createEncoder = () => new Encoder();
    length = (encoder) => {
      let len = encoder.cpos;
      for (let i = 0; i < encoder.bufs.length; i++) {
        len += encoder.bufs[i].length;
      }
      return len;
    };
    toUint8Array = (encoder) => {
      const uint8arr = new Uint8Array(length(encoder));
      let curPos = 0;
      for (let i = 0; i < encoder.bufs.length; i++) {
        const d = encoder.bufs[i];
        uint8arr.set(d, curPos);
        curPos += d.length;
      }
      uint8arr.set(new Uint8Array(encoder.cbuf.buffer, 0, encoder.cpos), curPos);
      return uint8arr;
    };
    verifyLen = (encoder, len) => {
      const bufferLen = encoder.cbuf.length;
      if (bufferLen - encoder.cpos < len) {
        encoder.bufs.push(new Uint8Array(encoder.cbuf.buffer, 0, encoder.cpos));
        encoder.cbuf = new Uint8Array(max(bufferLen, len) * 2);
        encoder.cpos = 0;
      }
    };
    write = (encoder, num) => {
      const bufferLen = encoder.cbuf.length;
      if (encoder.cpos === bufferLen) {
        encoder.bufs.push(encoder.cbuf);
        encoder.cbuf = new Uint8Array(bufferLen * 2);
        encoder.cpos = 0;
      }
      encoder.cbuf[encoder.cpos++] = num;
    };
    writeUint8 = write;
    writeVarUint = (encoder, num) => {
      while (num > BITS7) {
        write(encoder, BIT8 | BITS7 & num);
        num = floor(num / 128);
      }
      write(encoder, BITS7 & num);
    };
    writeVarInt = (encoder, num) => {
      const isNegative = isNegativeZero(num);
      if (isNegative) {
        num = -num;
      }
      write(encoder, (num > BITS6 ? BIT8 : 0) | (isNegative ? BIT7 : 0) | BITS6 & num);
      num = floor(num / 64);
      while (num > 0) {
        write(encoder, (num > BITS7 ? BIT8 : 0) | BITS7 & num);
        num = floor(num / 128);
      }
    };
    _strBuffer = new Uint8Array(3e4);
    _maxStrBSize = _strBuffer.length / 3;
    _writeVarStringNative = (encoder, str) => {
      if (str.length < _maxStrBSize) {
        const written = utf8TextEncoder.encodeInto(str, _strBuffer).written || 0;
        writeVarUint(encoder, written);
        for (let i = 0; i < written; i++) {
          write(encoder, _strBuffer[i]);
        }
      } else {
        writeVarUint8Array(encoder, encodeUtf8(str));
      }
    };
    _writeVarStringPolyfill = (encoder, str) => {
      const encodedString = unescape(encodeURIComponent(str));
      const len = encodedString.length;
      writeVarUint(encoder, len);
      for (let i = 0; i < len; i++) {
        write(
          encoder,
          /** @type {number} */
          encodedString.codePointAt(i)
        );
      }
    };
    writeVarString = utf8TextEncoder && /** @type {any} */
    utf8TextEncoder.encodeInto ? _writeVarStringNative : _writeVarStringPolyfill;
    writeBinaryEncoder = (encoder, append2) => writeUint8Array(encoder, toUint8Array(append2));
    writeUint8Array = (encoder, uint8Array) => {
      const bufferLen = encoder.cbuf.length;
      const cpos = encoder.cpos;
      const leftCopyLen = min(bufferLen - cpos, uint8Array.length);
      const rightCopyLen = uint8Array.length - leftCopyLen;
      encoder.cbuf.set(uint8Array.subarray(0, leftCopyLen), cpos);
      encoder.cpos += leftCopyLen;
      if (rightCopyLen > 0) {
        encoder.bufs.push(encoder.cbuf);
        encoder.cbuf = new Uint8Array(max(bufferLen * 2, rightCopyLen));
        encoder.cbuf.set(uint8Array.subarray(leftCopyLen));
        encoder.cpos = rightCopyLen;
      }
    };
    writeVarUint8Array = (encoder, uint8Array) => {
      writeVarUint(encoder, uint8Array.byteLength);
      writeUint8Array(encoder, uint8Array);
    };
    writeOnDataView = (encoder, len) => {
      verifyLen(encoder, len);
      const dview = new DataView(encoder.cbuf.buffer, encoder.cpos, len);
      encoder.cpos += len;
      return dview;
    };
    writeFloat32 = (encoder, num) => writeOnDataView(encoder, 4).setFloat32(0, num, false);
    writeFloat64 = (encoder, num) => writeOnDataView(encoder, 8).setFloat64(0, num, false);
    writeBigInt64 = (encoder, num) => (
      /** @type {any} */
      writeOnDataView(encoder, 8).setBigInt64(0, num, false)
    );
    floatTestBed = new DataView(new ArrayBuffer(4));
    isFloat32 = (num) => {
      floatTestBed.setFloat32(0, num);
      return floatTestBed.getFloat32(0) === num;
    };
    writeAny = (encoder, data) => {
      switch (typeof data) {
        case "string":
          write(encoder, 119);
          writeVarString(encoder, data);
          break;
        case "number":
          if (isInteger(data) && abs(data) <= BITS31) {
            write(encoder, 125);
            writeVarInt(encoder, data);
          } else if (isFloat32(data)) {
            write(encoder, 124);
            writeFloat32(encoder, data);
          } else {
            write(encoder, 123);
            writeFloat64(encoder, data);
          }
          break;
        case "bigint":
          write(encoder, 122);
          writeBigInt64(encoder, data);
          break;
        case "object":
          if (data === null) {
            write(encoder, 126);
          } else if (isArray(data)) {
            write(encoder, 117);
            writeVarUint(encoder, data.length);
            for (let i = 0; i < data.length; i++) {
              writeAny(encoder, data[i]);
            }
          } else if (data instanceof Uint8Array) {
            write(encoder, 116);
            writeVarUint8Array(encoder, data);
          } else {
            write(encoder, 118);
            const keys2 = Object.keys(data);
            writeVarUint(encoder, keys2.length);
            for (let i = 0; i < keys2.length; i++) {
              const key = keys2[i];
              writeVarString(encoder, key);
              writeAny(encoder, data[key]);
            }
          }
          break;
        case "boolean":
          write(encoder, data ? 120 : 121);
          break;
        default:
          write(encoder, 127);
      }
    };
    RleEncoder = class extends Encoder {
      /**
       * @param {function(Encoder, T):void} writer
       */
      constructor(writer) {
        super();
        this.w = writer;
        this.s = null;
        this.count = 0;
      }
      /**
       * @param {T} v
       */
      write(v) {
        if (this.s === v) {
          this.count++;
        } else {
          if (this.count > 0) {
            writeVarUint(this, this.count - 1);
          }
          this.count = 1;
          this.w(this, v);
          this.s = v;
        }
      }
    };
    flushUintOptRleEncoder = (encoder) => {
      if (encoder.count > 0) {
        writeVarInt(encoder.encoder, encoder.count === 1 ? encoder.s : -encoder.s);
        if (encoder.count > 1) {
          writeVarUint(encoder.encoder, encoder.count - 2);
        }
      }
    };
    UintOptRleEncoder = class {
      constructor() {
        this.encoder = new Encoder();
        this.s = 0;
        this.count = 0;
      }
      /**
       * @param {number} v
       */
      write(v) {
        if (this.s === v) {
          this.count++;
        } else {
          flushUintOptRleEncoder(this);
          this.count = 1;
          this.s = v;
        }
      }
      /**
       * Flush the encoded state and transform this to a Uint8Array.
       *
       * Note that this should only be called once.
       */
      toUint8Array() {
        flushUintOptRleEncoder(this);
        return toUint8Array(this.encoder);
      }
    };
    flushIntDiffOptRleEncoder = (encoder) => {
      if (encoder.count > 0) {
        const encodedDiff = encoder.diff * 2 + (encoder.count === 1 ? 0 : 1);
        writeVarInt(encoder.encoder, encodedDiff);
        if (encoder.count > 1) {
          writeVarUint(encoder.encoder, encoder.count - 2);
        }
      }
    };
    IntDiffOptRleEncoder = class {
      constructor() {
        this.encoder = new Encoder();
        this.s = 0;
        this.count = 0;
        this.diff = 0;
      }
      /**
       * @param {number} v
       */
      write(v) {
        if (this.diff === v - this.s) {
          this.s = v;
          this.count++;
        } else {
          flushIntDiffOptRleEncoder(this);
          this.count = 1;
          this.diff = v - this.s;
          this.s = v;
        }
      }
      /**
       * Flush the encoded state and transform this to a Uint8Array.
       *
       * Note that this should only be called once.
       */
      toUint8Array() {
        flushIntDiffOptRleEncoder(this);
        return toUint8Array(this.encoder);
      }
    };
    StringEncoder = class {
      constructor() {
        this.sarr = [];
        this.s = "";
        this.lensE = new UintOptRleEncoder();
      }
      /**
       * @param {string} string
       */
      write(string) {
        this.s += string;
        if (this.s.length > 19) {
          this.sarr.push(this.s);
          this.s = "";
        }
        this.lensE.write(string.length);
      }
      toUint8Array() {
        const encoder = new Encoder();
        this.sarr.push(this.s);
        this.s = "";
        writeVarString(encoder, this.sarr.join(""));
        writeUint8Array(encoder, this.lensE.toUint8Array());
        return toUint8Array(encoder);
      }
    };
  }
});

// node_modules/lib0/error.js
var create3, methodUnimplemented, unexpectedCase;
var init_error = __esm({
  "node_modules/lib0/error.js"() {
    create3 = (s) => new Error(s);
    methodUnimplemented = () => {
      throw create3("Method unimplemented");
    };
    unexpectedCase = () => {
      throw create3("Unexpected case");
    };
  }
});

// node_modules/lib0/decoding.js
var errorUnexpectedEndOfArray, errorIntegerOutOfRange, Decoder, createDecoder, hasContent, readUint8Array, readVarUint8Array, readUint8, readVarUint, readVarInt, _readVarStringPolyfill, _readVarStringNative, readVarString, readFromDataView, readFloat32, readFloat64, readBigInt64, readAnyLookupTable, readAny, RleDecoder, UintOptRleDecoder, IntDiffOptRleDecoder, StringDecoder;
var init_decoding = __esm({
  "node_modules/lib0/decoding.js"() {
    init_binary();
    init_math();
    init_number();
    init_string();
    init_error();
    errorUnexpectedEndOfArray = create3("Unexpected end of array");
    errorIntegerOutOfRange = create3("Integer out of Range");
    Decoder = class {
      /**
       * @param {Uint8Array<Buf>} uint8Array Binary data to decode
       */
      constructor(uint8Array) {
        this.arr = uint8Array;
        this.pos = 0;
      }
    };
    createDecoder = (uint8Array) => new Decoder(uint8Array);
    hasContent = (decoder) => decoder.pos !== decoder.arr.length;
    readUint8Array = (decoder, len) => {
      const view = new Uint8Array(decoder.arr.buffer, decoder.pos + decoder.arr.byteOffset, len);
      decoder.pos += len;
      return view;
    };
    readVarUint8Array = (decoder) => readUint8Array(decoder, readVarUint(decoder));
    readUint8 = (decoder) => decoder.arr[decoder.pos++];
    readVarUint = (decoder) => {
      let num = 0;
      let mult = 1;
      const len = decoder.arr.length;
      while (decoder.pos < len) {
        const r = decoder.arr[decoder.pos++];
        num = num + (r & BITS7) * mult;
        mult *= 128;
        if (r < BIT8) {
          return num;
        }
        if (num > MAX_SAFE_INTEGER) {
          throw errorIntegerOutOfRange;
        }
      }
      throw errorUnexpectedEndOfArray;
    };
    readVarInt = (decoder) => {
      let r = decoder.arr[decoder.pos++];
      let num = r & BITS6;
      let mult = 64;
      const sign = (r & BIT7) > 0 ? -1 : 1;
      if ((r & BIT8) === 0) {
        return sign * num;
      }
      const len = decoder.arr.length;
      while (decoder.pos < len) {
        r = decoder.arr[decoder.pos++];
        num = num + (r & BITS7) * mult;
        mult *= 128;
        if (r < BIT8) {
          return sign * num;
        }
        if (num > MAX_SAFE_INTEGER) {
          throw errorIntegerOutOfRange;
        }
      }
      throw errorUnexpectedEndOfArray;
    };
    _readVarStringPolyfill = (decoder) => {
      let remainingLen = readVarUint(decoder);
      if (remainingLen === 0) {
        return "";
      } else {
        let encodedString = String.fromCodePoint(readUint8(decoder));
        if (--remainingLen < 100) {
          while (remainingLen--) {
            encodedString += String.fromCodePoint(readUint8(decoder));
          }
        } else {
          while (remainingLen > 0) {
            const nextLen = remainingLen < 1e4 ? remainingLen : 1e4;
            const bytes = decoder.arr.subarray(decoder.pos, decoder.pos + nextLen);
            decoder.pos += nextLen;
            encodedString += String.fromCodePoint.apply(
              null,
              /** @type {any} */
              bytes
            );
            remainingLen -= nextLen;
          }
        }
        return decodeURIComponent(escape(encodedString));
      }
    };
    _readVarStringNative = (decoder) => (
      /** @type any */
      utf8TextDecoder.decode(readVarUint8Array(decoder))
    );
    readVarString = utf8TextDecoder ? _readVarStringNative : _readVarStringPolyfill;
    readFromDataView = (decoder, len) => {
      const dv = new DataView(decoder.arr.buffer, decoder.arr.byteOffset + decoder.pos, len);
      decoder.pos += len;
      return dv;
    };
    readFloat32 = (decoder) => readFromDataView(decoder, 4).getFloat32(0, false);
    readFloat64 = (decoder) => readFromDataView(decoder, 8).getFloat64(0, false);
    readBigInt64 = (decoder) => (
      /** @type {any} */
      readFromDataView(decoder, 8).getBigInt64(0, false)
    );
    readAnyLookupTable = [
      (decoder) => void 0,
      // CASE 127: undefined
      (decoder) => null,
      // CASE 126: null
      readVarInt,
      // CASE 125: integer
      readFloat32,
      // CASE 124: float32
      readFloat64,
      // CASE 123: float64
      readBigInt64,
      // CASE 122: bigint
      (decoder) => false,
      // CASE 121: boolean (false)
      (decoder) => true,
      // CASE 120: boolean (true)
      readVarString,
      // CASE 119: string
      (decoder) => {
        const len = readVarUint(decoder);
        const obj = {};
        for (let i = 0; i < len; i++) {
          const key = readVarString(decoder);
          obj[key] = readAny(decoder);
        }
        return obj;
      },
      (decoder) => {
        const len = readVarUint(decoder);
        const arr = [];
        for (let i = 0; i < len; i++) {
          arr.push(readAny(decoder));
        }
        return arr;
      },
      readVarUint8Array
      // CASE 116: Uint8Array
    ];
    readAny = (decoder) => readAnyLookupTable[127 - readUint8(decoder)](decoder);
    RleDecoder = class extends Decoder {
      /**
       * @param {Uint8Array} uint8Array
       * @param {function(Decoder):T} reader
       */
      constructor(uint8Array, reader) {
        super(uint8Array);
        this.reader = reader;
        this.s = null;
        this.count = 0;
      }
      read() {
        if (this.count === 0) {
          this.s = this.reader(this);
          if (hasContent(this)) {
            this.count = readVarUint(this) + 1;
          } else {
            this.count = -1;
          }
        }
        this.count--;
        return (
          /** @type {T} */
          this.s
        );
      }
    };
    UintOptRleDecoder = class extends Decoder {
      /**
       * @param {Uint8Array} uint8Array
       */
      constructor(uint8Array) {
        super(uint8Array);
        this.s = 0;
        this.count = 0;
      }
      read() {
        if (this.count === 0) {
          this.s = readVarInt(this);
          const isNegative = isNegativeZero(this.s);
          this.count = 1;
          if (isNegative) {
            this.s = -this.s;
            this.count = readVarUint(this) + 2;
          }
        }
        this.count--;
        return (
          /** @type {number} */
          this.s
        );
      }
    };
    IntDiffOptRleDecoder = class extends Decoder {
      /**
       * @param {Uint8Array} uint8Array
       */
      constructor(uint8Array) {
        super(uint8Array);
        this.s = 0;
        this.count = 0;
        this.diff = 0;
      }
      /**
       * @return {number}
       */
      read() {
        if (this.count === 0) {
          const diff = readVarInt(this);
          const hasCount = diff & 1;
          this.diff = floor(diff / 2);
          this.count = 1;
          if (hasCount) {
            this.count = readVarUint(this) + 2;
          }
        }
        this.s += this.diff;
        this.count--;
        return this.s;
      }
    };
    StringDecoder = class {
      /**
       * @param {Uint8Array} uint8Array
       */
      constructor(uint8Array) {
        this.decoder = new UintOptRleDecoder(uint8Array);
        this.str = readVarString(this.decoder);
        this.spos = 0;
      }
      /**
       * @return {string}
       */
      read() {
        const end = this.spos + this.decoder.read();
        const res = this.str.slice(this.spos, end);
        this.spos = end;
        return res;
      }
    };
  }
});

// node_modules/lib0/webcrypto.js
var subtle, getRandomValues;
var init_webcrypto = __esm({
  "node_modules/lib0/webcrypto.js"() {
    subtle = crypto.subtle;
    getRandomValues = crypto.getRandomValues.bind(crypto);
  }
});

// node_modules/lib0/random.js
var uint32, uuidv4Template, uuidv4;
var init_random = __esm({
  "node_modules/lib0/random.js"() {
    init_webcrypto();
    uint32 = () => getRandomValues(new Uint32Array(1))[0];
    uuidv4Template = "10000000-1000-4000-8000" + -1e11;
    uuidv4 = () => uuidv4Template.replace(
      /[018]/g,
      /** @param {number} c */
      (c) => (c ^ uint32() & 15 >> c / 4).toString(16)
    );
  }
});

// node_modules/lib0/time.js
var getUnixTime;
var init_time = __esm({
  "node_modules/lib0/time.js"() {
    getUnixTime = Date.now;
  }
});

// node_modules/lib0/promise.js
var create4, all;
var init_promise = __esm({
  "node_modules/lib0/promise.js"() {
    create4 = (f) => (
      /** @type {Promise<T>} */
      new Promise(f)
    );
    all = Promise.all.bind(Promise);
  }
});

// node_modules/lib0/conditions.js
var undefinedToNull;
var init_conditions = __esm({
  "node_modules/lib0/conditions.js"() {
    undefinedToNull = (v) => v === void 0 ? null : v;
  }
});

// node_modules/lib0/storage.js
var VarStoragePolyfill, _localStorage, usePolyfill, varStorage;
var init_storage = __esm({
  "node_modules/lib0/storage.js"() {
    VarStoragePolyfill = class {
      constructor() {
        this.map = /* @__PURE__ */ new Map();
      }
      /**
       * @param {string} key
       * @param {any} newValue
       */
      setItem(key, newValue) {
        this.map.set(key, newValue);
      }
      /**
       * @param {string} key
       */
      getItem(key) {
        return this.map.get(key);
      }
    };
    _localStorage = new VarStoragePolyfill();
    usePolyfill = true;
    try {
      if (typeof localStorage !== "undefined" && localStorage) {
        _localStorage = localStorage;
        usePolyfill = false;
      }
    } catch (e) {
    }
    varStorage = _localStorage;
  }
});

// node_modules/lib0/trait/equality.js
var EqualityTraitSymbol, equals;
var init_equality = __esm({
  "node_modules/lib0/trait/equality.js"() {
    EqualityTraitSymbol = Symbol("Equality");
    equals = (a, b) => a === b || !!a?.[EqualityTraitSymbol]?.(b) || false;
  }
});

// node_modules/lib0/object.js
var isObject, assign, keys, forEach, size, isEmpty, every2, hasProperty, equalFlat, freeze, deepFreeze;
var init_object = __esm({
  "node_modules/lib0/object.js"() {
    init_equality();
    isObject = (o) => typeof o === "object";
    assign = Object.assign;
    keys = Object.keys;
    forEach = (obj, f) => {
      for (const key in obj) {
        f(obj[key], key);
      }
    };
    size = (obj) => keys(obj).length;
    isEmpty = (obj) => {
      for (const _k in obj) {
        return false;
      }
      return true;
    };
    every2 = (obj, f) => {
      for (const key in obj) {
        if (!f(obj[key], key)) {
          return false;
        }
      }
      return true;
    };
    hasProperty = (obj, key) => Object.prototype.hasOwnProperty.call(obj, key);
    equalFlat = (a, b) => a === b || size(a) === size(b) && every2(a, (val, key) => (val !== void 0 || hasProperty(b, key)) && equals(b[key], val));
    freeze = Object.freeze;
    deepFreeze = (o) => {
      for (const key in o) {
        const c = o[key];
        if (typeof c === "object" || typeof c === "function") {
          deepFreeze(o[key]);
        }
      }
      return freeze(o);
    };
  }
});

// node_modules/lib0/function.js
var callAll, id, equalityDeep, isOneOf;
var init_function = __esm({
  "node_modules/lib0/function.js"() {
    init_object();
    init_equality();
    callAll = (fs, args2, i = 0) => {
      try {
        for (; i < fs.length; i++) {
          fs[i](...args2);
        }
      } finally {
        if (i < fs.length) {
          callAll(fs, args2, i + 1);
        }
      }
    };
    id = (a) => a;
    equalityDeep = (a, b) => {
      if (a === b) {
        return true;
      }
      if (a == null || b == null || a.constructor !== b.constructor && (a.constructor || Object) !== (b.constructor || Object)) {
        return false;
      }
      if (a[EqualityTraitSymbol] != null) {
        return a[EqualityTraitSymbol](b);
      }
      switch (a.constructor) {
        case ArrayBuffer:
          a = new Uint8Array(a);
          b = new Uint8Array(b);
        // eslint-disable-next-line no-fallthrough
        case Uint8Array: {
          if (a.byteLength !== b.byteLength) {
            return false;
          }
          for (let i = 0; i < a.length; i++) {
            if (a[i] !== b[i]) {
              return false;
            }
          }
          break;
        }
        case Set: {
          if (a.size !== b.size) {
            return false;
          }
          for (const value of a) {
            if (!b.has(value)) {
              return false;
            }
          }
          break;
        }
        case Map: {
          if (a.size !== b.size) {
            return false;
          }
          for (const key of a.keys()) {
            if (!b.has(key) || !equalityDeep(a.get(key), b.get(key))) {
              return false;
            }
          }
          break;
        }
        case void 0:
        case Object:
          if (size(a) !== size(b)) {
            return false;
          }
          for (const key in a) {
            if (!hasProperty(a, key) || !equalityDeep(a[key], b[key])) {
              return false;
            }
          }
          break;
        case Array:
          if (a.length !== b.length) {
            return false;
          }
          for (let i = 0; i < a.length; i++) {
            if (!equalityDeep(a[i], b[i])) {
              return false;
            }
          }
          break;
        default:
          return false;
      }
      return true;
    };
    isOneOf = (value, options) => options.includes(value);
  }
});

// node_modules/lib0/environment.js
var isNode, isMac, params, args, computeParams, hasParam, getVariable, hasConf, production, forceColor, supportsColor;
var init_environment = __esm({
  "node_modules/lib0/environment.js"() {
    init_map();
    init_string();
    init_conditions();
    init_storage();
    init_function();
    isNode = typeof process !== "undefined" && process.release && /node|io\.js/.test(process.release.name) && Object.prototype.toString.call(typeof process !== "undefined" ? process : 0) === "[object process]";
    isMac = typeof navigator !== "undefined" ? /Mac/.test(navigator.platform) : false;
    args = [];
    computeParams = () => {
      if (params === void 0) {
        if (isNode) {
          params = create();
          const pargs = process.argv;
          let currParamName = null;
          for (let i = 0; i < pargs.length; i++) {
            const parg = pargs[i];
            if (parg[0] === "-") {
              if (currParamName !== null) {
                params.set(currParamName, "");
              }
              currParamName = parg;
            } else {
              if (currParamName !== null) {
                params.set(currParamName, parg);
                currParamName = null;
              } else {
                args.push(parg);
              }
            }
          }
          if (currParamName !== null) {
            params.set(currParamName, "");
          }
        } else if (typeof location === "object") {
          params = create();
          (location.search || "?").slice(1).split("&").forEach((kv) => {
            if (kv.length !== 0) {
              const [key, value] = kv.split("=");
              params.set(`--${fromCamelCase(key, "-")}`, value);
              params.set(`-${fromCamelCase(key, "-")}`, value);
            }
          });
        } else {
          params = create();
        }
      }
      return params;
    };
    hasParam = (name) => computeParams().has(name);
    getVariable = (name) => isNode ? undefinedToNull(process.env[name.toUpperCase().replaceAll("-", "_")]) : undefinedToNull(varStorage.getItem(name));
    hasConf = (name) => hasParam("--" + name) || getVariable(name) !== null;
    production = hasConf("production");
    forceColor = isNode && isOneOf(process.env.FORCE_COLOR, ["true", "1", "2"]);
    supportsColor = forceColor || !hasParam("--no-colors") && // @todo deprecate --no-colors
    !hasConf("no-color") && (!isNode || process.stdout.isTTY) && (!isNode || hasParam("--color") || getVariable("COLORTERM") !== null || (getVariable("TERM") || "").includes("color"));
  }
});

// node_modules/lib0/buffer.js
var createUint8ArrayFromLen, copyUint8Array;
var init_buffer = __esm({
  "node_modules/lib0/buffer.js"() {
    createUint8ArrayFromLen = (len) => new Uint8Array(len);
    copyUint8Array = (uint8Array) => {
      const newBuf = createUint8ArrayFromLen(uint8Array.byteLength);
      newBuf.set(uint8Array);
      return newBuf;
    };
  }
});

// node_modules/lib0/pair.js
var Pair, create5;
var init_pair = __esm({
  "node_modules/lib0/pair.js"() {
    Pair = class {
      /**
       * @param {L} left
       * @param {R} right
       */
      constructor(left, right) {
        this.left = left;
        this.right = right;
      }
    };
    create5 = (left, right) => new Pair(left, right);
  }
});

// node_modules/lib0/prng.js
var bool, int53, int32, int31, letter, word, oneOf;
var init_prng = __esm({
  "node_modules/lib0/prng.js"() {
    init_string();
    init_math();
    bool = (gen) => gen.next() >= 0.5;
    int53 = (gen, min2, max2) => floor(gen.next() * (max2 + 1 - min2) + min2);
    int32 = (gen, min2, max2) => floor(gen.next() * (max2 + 1 - min2) + min2);
    int31 = (gen, min2, max2) => int32(gen, min2, max2);
    letter = (gen) => fromCharCode(int31(gen, 97, 122));
    word = (gen, minLen = 0, maxLen = 20) => {
      const len = int31(gen, minLen, maxLen);
      let str = "";
      for (let i = 0; i < len; i++) {
        str += letter(gen);
      }
      return str;
    };
    oneOf = (gen, array) => array[int31(gen, 0, array.length - 1)];
  }
});

// node_modules/lib0/schema.js
var schemaSymbol, ValidationError, shapeExtends, Schema, $ConstructedBy, $constructedBy, $$constructedBy, $Custom, $custom, $$custom, $Literal, $literal, $$literal, _regexEscape, _schemaStringTemplateToRegex, $StringTemplate, $$stringTemplate, isOptionalSymbol, $Optional, $$optional, $Never, $never, $$never, $Object, $object, $$object, $objectAny, $Record, $record, $$record, $Tuple, $tuple, $$tuple, $Array, $array, $$array, $arrayAny, $InstanceOf, $instanceOf, $$instanceOf, $$schema, $Lambda, $$lambda, $function, $Intersection, $$intersect, $Union, $union, $$union, _t, $any, $$any, $bigint, $$bigint, $symbol, $$symbol, $number, $$number, $string, $$string, $boolean, $$boolean, $undefined, $$undefined, $void, $null, $$null, $uint8Array, $$uint8Array, $primitive, $json, $, assert, PatternMatcher, match, _random, random;
var init_schema = __esm({
  "node_modules/lib0/schema.js"() {
    init_object();
    init_array();
    init_error();
    init_environment();
    init_equality();
    init_function();
    init_string();
    init_prng();
    init_number();
    schemaSymbol = Symbol("0schema");
    ValidationError = class {
      constructor() {
        this._rerrs = [];
      }
      /**
       * @param {string?} path
       * @param {string} expected
       * @param {string} has
       * @param {string?} message
       */
      extend(path, expected, has, message = null) {
        this._rerrs.push({ path, expected, has, message });
      }
      toString() {
        const s = [];
        for (let i = this._rerrs.length - 1; i > 0; i--) {
          const r = this._rerrs[i];
          s.push(repeat(" ", (this._rerrs.length - i) * 2) + `${r.path != null ? `[${r.path}] ` : ""}${r.has} doesn't match ${r.expected}. ${r.message}`);
        }
        return s.join("\n");
      }
    };
    shapeExtends = (a, b) => {
      if (a === b) return true;
      if (a == null || b == null || a.constructor !== b.constructor) return false;
      if (a[EqualityTraitSymbol]) return equals(a, b);
      if (isArray(a)) {
        return every(
          a,
          (aitem) => some(b, (bitem) => shapeExtends(aitem, bitem))
        );
      } else if (isObject(a)) {
        return every2(
          a,
          (aitem, akey) => shapeExtends(aitem, b[akey])
        );
      }
      return false;
    };
    Schema = class {
      // this.shape must not be defined on Schema. Otherwise typecheck on metatypes (e.g. $$object) won't work as expected anymore
      /**
       * If true, the more things are added to the shape the more objects this schema will accept (e.g.
       * union). By default, the more objects are added, the the fewer objects this schema will accept.
       * @protected
       */
      static _dilutes = false;
      /**
       * @param {Schema<any>} other
       */
      extends(other) {
        let [a, b] = [
          /** @type {any} */
          this.shape,
          /** @type {any} */
          other.shape
        ];
        if (
          /** @type {typeof Schema<any>} */
          this.constructor._dilutes
        ) [b, a] = [a, b];
        return shapeExtends(a, b);
      }
      /**
       * Overwrite this when necessary. By default, we only check the `shape` property which every shape
       * should have.
       * @param {Schema<any>} other
       */
      equals(other) {
        return this.constructor === other.constructor && equalityDeep(this.shape, other.shape);
      }
      [schemaSymbol]() {
        return true;
      }
      /**
       * @param {object} other
       */
      [EqualityTraitSymbol](other) {
        return this.equals(
          /** @type {any} */
          other
        );
      }
      /**
       * Use `schema.validate(obj)` with a typed parameter that is already of typed to be an instance of
       * Schema. Validate will check the structure of the parameter and return true iff the instance
       * really is an instance of Schema.
       *
       * @param {T} o
       * @return {boolean}
       */
      validate(o) {
        return this.check(o);
      }
      /* c8 ignore start */
      /**
       * Similar to validate, but this method accepts untyped parameters.
       *
       * @param {any} _o
       * @param {ValidationError} [_err]
       * @return {_o is T}
       */
      check(_o, _err) {
        methodUnimplemented();
      }
      /* c8 ignore stop */
      /**
       * @type {Schema<T?>}
       */
      get nullable() {
        return $union(this, $null);
      }
      /**
       * @type {$Optional<Schema<T>>}
       */
      get optional() {
        return new $Optional(
          /** @type {Schema<T>} */
          this
        );
      }
      /**
       * Cast a variable to a specific type. Returns the casted value, or throws an exception otherwise.
       * Use this if you know that the type is of a specific type and you just want to convince the type
       * system.
       *
       * **Do not rely on these error messages!**
       * Performs an assertion check only if not in a production environment.
       *
       * @template OO
       * @param {OO} o
       * @return {Extract<OO, T> extends never ? T : (OO extends Array<never> ? T : Extract<OO,T>)}
       */
      cast(o) {
        assert(o, this);
        return (
          /** @type {any} */
          o
        );
      }
      /**
       * EXPECTO PATRONUM!! 🪄
       * This function protects against type errors. Though it may not work in the real world.
       *
       * "After all this time?"
       * "Always." - Snape, talking about type safety
       *
       * Ensures that a variable is a a specific type. Returns the value, or throws an exception if the assertion check failed.
       * Use this if you know that the type is of a specific type and you just want to convince the type
       * system.
       *
       * Can be useful when defining lambdas: `s.lambda(s.$number, s.$void).expect((n) => n + 1)`
       *
       * **Do not rely on these error messages!**
       * Performs an assertion check if not in a production environment.
       *
       * @param {T} o
       * @return {o extends T ? T : never}
       */
      expect(o) {
        assert(o, this);
        return o;
      }
    };
    $ConstructedBy = class extends Schema {
      /**
       * @param {C} c
       * @param {((o:Instance<C>)=>boolean)|null} check
       */
      constructor(c, check) {
        super();
        this.shape = c;
        this._c = check;
      }
      /**
       * @param {any} o
       * @param {ValidationError} [err]
       * @return {o is C extends ((...args:any[]) => infer T) ? T : (C extends (new (...args:any[]) => any) ? InstanceType<C> : never)} o
       */
      check(o, err = void 0) {
        const c = o?.constructor === this.shape && (this._c == null || this._c(o));
        !c && err?.extend(null, this.shape.name, o?.constructor.name, o?.constructor !== this.shape ? "Constructor match failed" : "Check failed");
        return c;
      }
    };
    $constructedBy = (c, check = null) => new $ConstructedBy(c, check);
    $$constructedBy = $constructedBy($ConstructedBy);
    $Custom = class extends Schema {
      /**
       * @param {(o:any) => boolean} check
       */
      constructor(check) {
        super();
        this.shape = check;
      }
      /**
       * @param {any} o
       * @param {ValidationError} err
       * @return {o is any}
       */
      check(o, err) {
        const c = this.shape(o);
        !c && err?.extend(null, "custom prop", o?.constructor.name, "failed to check custom prop");
        return c;
      }
    };
    $custom = (check) => new $Custom(check);
    $$custom = $constructedBy($Custom);
    $Literal = class extends Schema {
      /**
       * @param {Array<T>} literals
       */
      constructor(literals) {
        super();
        this.shape = literals;
      }
      /**
       *
       * @param {any} o
       * @param {ValidationError} [err]
       * @return {o is T}
       */
      check(o, err) {
        const c = this.shape.some((a) => a === o);
        !c && err?.extend(null, this.shape.join(" | "), o.toString());
        return c;
      }
    };
    $literal = (...literals) => new $Literal(literals);
    $$literal = $constructedBy($Literal);
    _regexEscape = /** @type {any} */
    RegExp.escape || /** @type {(str:string) => string} */
    ((str) => str.replace(/[().|&,$^[\]]/g, (s) => "\\" + s));
    _schemaStringTemplateToRegex = (s) => {
      if ($string.check(s)) {
        return [_regexEscape(s)];
      }
      if ($$literal.check(s)) {
        return (
          /** @type {Array<string|number>} */
          s.shape.map((v) => v + "")
        );
      }
      if ($$number.check(s)) {
        return ["[+-]?\\d+.?\\d*"];
      }
      if ($$string.check(s)) {
        return [".*"];
      }
      if ($$union.check(s)) {
        return s.shape.map(_schemaStringTemplateToRegex).flat(1);
      }
      unexpectedCase();
    };
    $StringTemplate = class extends Schema {
      /**
       * @param {T} shape
       */
      constructor(shape) {
        super();
        this.shape = shape;
        this._r = new RegExp("^" + shape.map(_schemaStringTemplateToRegex).map((opts) => `(${opts.join("|")})`).join("") + "$");
      }
      /**
       * @param {any} o
       * @param {ValidationError} [err]
       * @return {o is CastStringTemplateArgsToTemplate<T>}
       */
      check(o, err) {
        const c = this._r.exec(o) != null;
        !c && err?.extend(null, this._r.toString(), o.toString(), "String doesn't match string template.");
        return c;
      }
    };
    $$stringTemplate = $constructedBy($StringTemplate);
    isOptionalSymbol = Symbol("optional");
    $Optional = class extends Schema {
      /**
       * @param {S} shape
       */
      constructor(shape) {
        super();
        this.shape = shape;
      }
      /**
       * @param {any} o
       * @param {ValidationError} [err]
       * @return {o is (Unwrap<S>|undefined)}
       */
      check(o, err) {
        const c = o === void 0 || this.shape.check(o);
        !c && err?.extend(null, "undefined (optional)", "()");
        return c;
      }
      get [isOptionalSymbol]() {
        return true;
      }
    };
    $$optional = $constructedBy($Optional);
    $Never = class extends Schema {
      /**
       * @param {any} _o
       * @param {ValidationError} [err]
       * @return {_o is never}
       */
      check(_o, err) {
        err?.extend(null, "never", typeof _o);
        return false;
      }
    };
    $never = new $Never();
    $$never = $constructedBy($Never);
    $Object = class _$Object extends Schema {
      /**
       * @param {S} shape
       * @param {boolean} partial
       */
      constructor(shape, partial = false) {
        super();
        this.shape = shape;
        this._isPartial = partial;
      }
      static _dilutes = true;
      /**
       * @type {Schema<Partial<$ObjectToType<S>>>}
       */
      get partial() {
        return new _$Object(this.shape, true);
      }
      /**
       * @param {any} o
       * @param {ValidationError} err
       * @return {o is $ObjectToType<S>}
       */
      check(o, err) {
        if (o == null) {
          err?.extend(null, "object", "null");
          return false;
        }
        return every2(this.shape, (vv, vk) => {
          const c = this._isPartial && !hasProperty(o, vk) || vv.check(o[vk], err);
          !c && err?.extend(vk.toString(), vv.toString(), typeof o[vk], "Object property does not match");
          return c;
        });
      }
    };
    $object = (def) => (
      /** @type {any} */
      new $Object(def)
    );
    $$object = $constructedBy($Object);
    $objectAny = $custom((o) => o != null && (o.constructor === Object || o.constructor == null));
    $Record = class extends Schema {
      /**
       * @param {Keys} keys
       * @param {Values} values
       */
      constructor(keys2, values) {
        super();
        this.shape = {
          keys: keys2,
          values
        };
      }
      /**
       * @param {any} o
       * @param {ValidationError} err
       * @return {o is { [key in Unwrap<Keys>]: Unwrap<Values> }}
       */
      check(o, err) {
        return o != null && every2(o, (vv, vk) => {
          const ck = this.shape.keys.check(vk, err);
          !ck && err?.extend(vk + "", "Record", typeof o, ck ? "Key doesn't match schema" : "Value doesn't match value");
          return ck && this.shape.values.check(vv, err);
        });
      }
    };
    $record = (keys2, values) => new $Record(keys2, values);
    $$record = $constructedBy($Record);
    $Tuple = class extends Schema {
      /**
       * @param {S} shape
       */
      constructor(shape) {
        super();
        this.shape = shape;
      }
      /**
       * @param {any} o
       * @param {ValidationError} err
       * @return {o is { [K in keyof S]: S[K] extends Schema<infer Type> ? Type : never }}
       */
      check(o, err) {
        return o != null && every2(this.shape, (vv, vk) => {
          const c = (
            /** @type {Schema<any>} */
            vv.check(o[vk], err)
          );
          !c && err?.extend(vk.toString(), "Tuple", typeof vv);
          return c;
        });
      }
    };
    $tuple = (...def) => new $Tuple(def);
    $$tuple = $constructedBy($Tuple);
    $Array = class extends Schema {
      /**
       * @param {Array<S>} v
       */
      constructor(v) {
        super();
        this.shape = v.length === 1 ? v[0] : new $Union(v);
      }
      /**
       * @param {any} o
       * @param {ValidationError} [err]
       * @return {o is Array<S extends Schema<infer T> ? T : never>} o
       */
      check(o, err) {
        const c = isArray(o) && every(o, (oi) => this.shape.check(oi));
        !c && err?.extend(null, "Array", "");
        return c;
      }
    };
    $array = (...def) => new $Array(def);
    $$array = $constructedBy($Array);
    $arrayAny = $custom((o) => isArray(o));
    $InstanceOf = class extends Schema {
      /**
       * @param {new (...args:any) => T} constructor
       * @param {((o:T) => boolean)|null} check
       */
      constructor(constructor, check) {
        super();
        this.shape = constructor;
        this._c = check;
      }
      /**
       * @param {any} o
       * @param {ValidationError} err
       * @return {o is T}
       */
      check(o, err) {
        const c = o instanceof this.shape && (this._c == null || this._c(o));
        !c && err?.extend(null, this.shape.name, o?.constructor.name);
        return c;
      }
    };
    $instanceOf = (c, check = null) => new $InstanceOf(c, check);
    $$instanceOf = $constructedBy($InstanceOf);
    $$schema = $instanceOf(Schema);
    $Lambda = class extends Schema {
      /**
       * @param {Args} args
       */
      constructor(args2) {
        super();
        this.len = args2.length - 1;
        this.args = $tuple(...args2.slice(-1));
        this.res = args2[this.len];
      }
      /**
       * @param {any} f
       * @param {ValidationError} err
       * @return {f is _LArgsToLambdaDef<Args>}
       */
      check(f, err) {
        const c = f.constructor === Function && f.length <= this.len;
        !c && err?.extend(null, "function", typeof f);
        return c;
      }
    };
    $$lambda = $constructedBy($Lambda);
    $function = $custom((o) => typeof o === "function");
    $Intersection = class extends Schema {
      /**
       * @param {T} v
       */
      constructor(v) {
        super();
        this.shape = v;
      }
      /**
       * @param {any} o
       * @param {ValidationError} [err]
       * @return {o is Intersect<UnwrapArray<T>>}
       */
      check(o, err) {
        const c = every(this.shape, (check) => check.check(o, err));
        !c && err?.extend(null, "Intersectinon", typeof o);
        return c;
      }
    };
    $$intersect = $constructedBy($Intersection, (o) => o.shape.length > 0);
    $Union = class extends Schema {
      static _dilutes = true;
      /**
       * @param {Array<Schema<S>>} v
       */
      constructor(v) {
        super();
        this.shape = v;
      }
      /**
       * @param {any} o
       * @param {ValidationError} [err]
       * @return {o is S}
       */
      check(o, err) {
        const c = some(this.shape, (vv) => vv.check(o, err));
        err?.extend(null, "Union", typeof o);
        return c;
      }
    };
    $union = (...schemas) => schemas.findIndex(($s) => $$union.check($s)) >= 0 ? $union(...schemas.map(($s) => $($s)).map(($s) => $$union.check($s) ? $s.shape : [$s]).flat(1)) : schemas.length === 1 ? schemas[0] : new $Union(schemas);
    $$union = /** @type {Schema<$Union<any>>} */
    $constructedBy($Union);
    _t = () => true;
    $any = $custom(_t);
    $$any = /** @type {Schema<Schema<any>>} */
    $constructedBy($Custom, (o) => o.shape === _t);
    $bigint = $custom((o) => typeof o === "bigint");
    $$bigint = /** @type {Schema<Schema<BigInt>>} */
    $custom((o) => o === $bigint);
    $symbol = $custom((o) => typeof o === "symbol");
    $$symbol = /** @type {Schema<Schema<Symbol>>} */
    $custom((o) => o === $symbol);
    $number = $custom((o) => typeof o === "number");
    $$number = /** @type {Schema<Schema<number>>} */
    $custom((o) => o === $number);
    $string = $custom((o) => typeof o === "string");
    $$string = /** @type {Schema<Schema<string>>} */
    $custom((o) => o === $string);
    $boolean = $custom((o) => typeof o === "boolean");
    $$boolean = /** @type {Schema<Schema<Boolean>>} */
    $custom((o) => o === $boolean);
    $undefined = $literal(void 0);
    $$undefined = /** @type {Schema<Schema<undefined>>} */
    $constructedBy($Literal, (o) => o.shape.length === 1 && o.shape[0] === void 0);
    $void = $literal(void 0);
    $null = $literal(null);
    $$null = /** @type {Schema<Schema<null>>} */
    $constructedBy($Literal, (o) => o.shape.length === 1 && o.shape[0] === null);
    $uint8Array = $constructedBy(Uint8Array);
    $$uint8Array = /** @type {Schema<Schema<Uint8Array>>} */
    $constructedBy($ConstructedBy, (o) => o.shape === Uint8Array);
    $primitive = $union($number, $string, $null, $undefined, $bigint, $boolean, $symbol);
    $json = (() => {
      const $jsonArr = (
        /** @type {$Array<$any>} */
        $array($any)
      );
      const $jsonRecord = (
        /** @type {$Record<$string,$any>} */
        $record($string, $any)
      );
      const $json2 = $union($number, $string, $null, $boolean, $jsonArr, $jsonRecord);
      $jsonArr.shape = $json2;
      $jsonRecord.shape.values = $json2;
      return $json2;
    })();
    $ = (o) => {
      if ($$schema.check(o)) {
        return (
          /** @type {any} */
          o
        );
      } else if ($objectAny.check(o)) {
        const o2 = {};
        for (const k in o) {
          o2[k] = $(o[k]);
        }
        return (
          /** @type {any} */
          $object(o2)
        );
      } else if ($arrayAny.check(o)) {
        return (
          /** @type {any} */
          $union(...o.map($))
        );
      } else if ($primitive.check(o)) {
        return (
          /** @type {any} */
          $literal(o)
        );
      } else if ($function.check(o)) {
        return (
          /** @type {any} */
          $constructedBy(
            /** @type {any} */
            o
          )
        );
      }
      unexpectedCase();
    };
    assert = production ? () => {
    } : (o, schema) => {
      const err = new ValidationError();
      if (!schema.check(o, err)) {
        throw create3(`Expected value to be of type ${schema.constructor.name}.
${err.toString()}`);
      }
    };
    PatternMatcher = class {
      /**
       * @param {Schema<State>} [$state]
       */
      constructor($state) {
        this.patterns = [];
        this.$state = $state;
      }
      /**
       * @template P
       * @template R
       * @param {P} pattern
       * @param {(o:NoInfer<Unwrap<ReadSchema<P>>>,s:State)=>R} handler
       * @return {PatternMatcher<State,Patterns|Pattern<Unwrap<ReadSchema<P>>,R>>}
       */
      if(pattern, handler) {
        this.patterns.push({ if: $(pattern), h: handler });
        return this;
      }
      /**
       * @template R
       * @param {(o:any,s:State)=>R} h
       */
      else(h) {
        return this.if($any, h);
      }
      /**
       * @return {State extends undefined
       *   ? <In extends Unwrap<Patterns['if']>>(o:In,state?:undefined)=>PatternMatchResult<Patterns,In>
       *   : <In extends Unwrap<Patterns['if']>>(o:In,state:State)=>PatternMatchResult<Patterns,In>}
       */
      done() {
        return (
          /** @type {any} */
          (o, s) => {
            for (let i = 0; i < this.patterns.length; i++) {
              const p = this.patterns[i];
              if (p.if.check(o)) {
                return p.h(o, s);
              }
            }
            throw create3("Unhandled pattern");
          }
        );
      }
    };
    match = (state) => new PatternMatcher(
      /** @type {any} */
      state
    );
    _random = /** @type {any} */
    match(
      /** @type {Schema<prng.PRNG>} */
      $any
    ).if($$number, (_o, gen) => int53(gen, MIN_SAFE_INTEGER, MAX_SAFE_INTEGER)).if($$string, (_o, gen) => word(gen)).if($$boolean, (_o, gen) => bool(gen)).if($$bigint, (_o, gen) => BigInt(int53(gen, MIN_SAFE_INTEGER, MAX_SAFE_INTEGER))).if($$union, (o, gen) => random(gen, oneOf(gen, o.shape))).if($$object, (o, gen) => {
      const res = {};
      for (const k in o.shape) {
        let prop = o.shape[k];
        if ($$optional.check(prop)) {
          if (bool(gen)) {
            continue;
          }
          prop = prop.shape;
        }
        res[k] = _random(prop, gen);
      }
      return res;
    }).if($$array, (o, gen) => {
      const arr = [];
      const n = int32(gen, 0, 42);
      for (let i = 0; i < n; i++) {
        arr.push(random(gen, o.shape));
      }
      return arr;
    }).if($$literal, (o, gen) => {
      return oneOf(gen, o.shape);
    }).if($$null, (o, gen) => {
      return null;
    }).if($$lambda, (o, gen) => {
      const res = random(gen, o.res);
      return () => res;
    }).if($$any, (o, gen) => random(gen, oneOf(gen, [
      $number,
      $string,
      $null,
      $undefined,
      $bigint,
      $boolean,
      $array($number),
      $record($union("a", "b", "c"), $number)
    ]))).if($$record, (o, gen) => {
      const res = {};
      const keysN = int53(gen, 0, 3);
      for (let i = 0; i < keysN; i++) {
        const key = random(gen, o.shape.keys);
        const val = random(gen, o.shape.values);
        res[key] = val;
      }
      return res;
    }).done();
    random = (gen, schema) => (
      /** @type {any} */
      _random($(schema), gen)
    );
  }
});

// node_modules/lib0/dom.js
var doc, $fragment, domParser, $element, $text, mapToStyleString, ELEMENT_NODE, TEXT_NODE, CDATA_SECTION_NODE, COMMENT_NODE, DOCUMENT_NODE, DOCUMENT_TYPE_NODE, DOCUMENT_FRAGMENT_NODE, $node;
var init_dom = __esm({
  "node_modules/lib0/dom.js"() {
    init_map();
    init_schema();
    doc = /** @type {Document} */
    typeof document !== "undefined" ? document : {};
    $fragment = $custom((el) => el.nodeType === DOCUMENT_FRAGMENT_NODE);
    domParser = /** @type {DOMParser} */
    typeof DOMParser !== "undefined" ? new DOMParser() : null;
    $element = $custom((el) => el.nodeType === ELEMENT_NODE);
    $text = $custom((el) => el.nodeType === TEXT_NODE);
    mapToStyleString = (m) => map(m, (value, key) => `${key}:${value};`).join("");
    ELEMENT_NODE = doc.ELEMENT_NODE;
    TEXT_NODE = doc.TEXT_NODE;
    CDATA_SECTION_NODE = doc.CDATA_SECTION_NODE;
    COMMENT_NODE = doc.COMMENT_NODE;
    DOCUMENT_NODE = doc.DOCUMENT_NODE;
    DOCUMENT_TYPE_NODE = doc.DOCUMENT_TYPE_NODE;
    DOCUMENT_FRAGMENT_NODE = doc.DOCUMENT_FRAGMENT_NODE;
    $node = $custom((el) => el.nodeType === DOCUMENT_NODE);
  }
});

// node_modules/lib0/symbol.js
var create6;
var init_symbol = __esm({
  "node_modules/lib0/symbol.js"() {
    create6 = Symbol;
  }
});

// node_modules/lib0/logging.common.js
var BOLD, UNBOLD, BLUE, GREY, GREEN, RED, PURPLE, ORANGE, UNCOLOR, computeNoColorLoggingArgs, lastLoggingTime;
var init_logging_common = __esm({
  "node_modules/lib0/logging.common.js"() {
    init_symbol();
    init_time();
    BOLD = create6();
    UNBOLD = create6();
    BLUE = create6();
    GREY = create6();
    GREEN = create6();
    RED = create6();
    PURPLE = create6();
    ORANGE = create6();
    UNCOLOR = create6();
    computeNoColorLoggingArgs = (args2) => {
      if (args2.length === 1 && args2[0]?.constructor === Function) {
        args2 = /** @type {Array<string|Symbol|Object|number>} */
        /** @type {[function]} */
        args2[0]();
      }
      const strBuilder = [];
      const logArgs = [];
      let i = 0;
      for (; i < args2.length; i++) {
        const arg = args2[i];
        if (arg === void 0) {
          break;
        } else if (arg.constructor === String || arg.constructor === Number) {
          strBuilder.push(arg);
        } else if (arg.constructor === Object) {
          break;
        }
      }
      if (i > 0) {
        logArgs.push(strBuilder.join(""));
      }
      for (; i < args2.length; i++) {
        const arg = args2[i];
        if (!(arg instanceof Symbol)) {
          logArgs.push(arg);
        }
      }
      return logArgs;
    };
    lastLoggingTime = getUnixTime();
  }
});

// node_modules/lib0/logging.js
var _browserStyleMap, computeBrowserLoggingArgs, computeLoggingArgs, print, warn, vconsoles;
var init_logging = __esm({
  "node_modules/lib0/logging.js"() {
    init_environment();
    init_set();
    init_pair();
    init_dom();
    init_map();
    init_logging_common();
    init_logging_common();
    _browserStyleMap = {
      [BOLD]: create5("font-weight", "bold"),
      [UNBOLD]: create5("font-weight", "normal"),
      [BLUE]: create5("color", "blue"),
      [GREEN]: create5("color", "green"),
      [GREY]: create5("color", "grey"),
      [RED]: create5("color", "red"),
      [PURPLE]: create5("color", "purple"),
      [ORANGE]: create5("color", "orange"),
      // not well supported in chrome when debugging node with inspector - TODO: deprecate
      [UNCOLOR]: create5("color", "black")
    };
    computeBrowserLoggingArgs = (args2) => {
      if (args2.length === 1 && args2[0]?.constructor === Function) {
        args2 = /** @type {Array<string|Symbol|Object|number>} */
        /** @type {[function]} */
        args2[0]();
      }
      const strBuilder = [];
      const styles = [];
      const currentStyle = create();
      let logArgs = [];
      let i = 0;
      for (; i < args2.length; i++) {
        const arg = args2[i];
        const style = _browserStyleMap[arg];
        if (style !== void 0) {
          currentStyle.set(style.left, style.right);
        } else {
          if (arg === void 0) {
            break;
          }
          if (arg.constructor === String || arg.constructor === Number) {
            const style2 = mapToStyleString(currentStyle);
            if (i > 0 || style2.length > 0) {
              strBuilder.push("%c" + arg);
              styles.push(style2);
            } else {
              strBuilder.push(arg);
            }
          } else {
            break;
          }
        }
      }
      if (i > 0) {
        logArgs = styles;
        logArgs.unshift(strBuilder.join(""));
      }
      for (; i < args2.length; i++) {
        const arg = args2[i];
        if (!(arg instanceof Symbol)) {
          logArgs.push(arg);
        }
      }
      return logArgs;
    };
    computeLoggingArgs = supportsColor ? computeBrowserLoggingArgs : computeNoColorLoggingArgs;
    print = (...args2) => {
      console.log(...computeLoggingArgs(args2));
      vconsoles.forEach((vc) => vc.print(args2));
    };
    warn = (...args2) => {
      console.warn(...computeLoggingArgs(args2));
      args2.unshift(ORANGE);
      vconsoles.forEach((vc) => vc.print(args2));
    };
    vconsoles = create2();
  }
});

// node_modules/lib0/iterator.js
var createIterator, iteratorFilter, iteratorMap;
var init_iterator = __esm({
  "node_modules/lib0/iterator.js"() {
    createIterator = (next) => ({
      /**
       * @return {IterableIterator<T>}
       */
      [Symbol.iterator]() {
        return this;
      },
      // @ts-ignore
      next
    });
    iteratorFilter = (iterator, filter) => createIterator(() => {
      let res;
      do {
        res = iterator.next();
      } while (!res.done && !filter(res.value));
      return res;
    });
    iteratorMap = (iterator, fmap) => createIterator(() => {
      const { done, value } = iterator.next();
      return { done, value: done ? void 0 : fmap(value) };
    });
  }
});

// node_modules/yjs/dist/yjs.mjs
var yjs_exports = {};
__export(yjs_exports, {
  AbsolutePosition: () => AbsolutePosition,
  AbstractConnector: () => AbstractConnector,
  AbstractStruct: () => AbstractStruct,
  AbstractType: () => AbstractType,
  Array: () => YArray,
  ContentAny: () => ContentAny,
  ContentBinary: () => ContentBinary,
  ContentDeleted: () => ContentDeleted,
  ContentDoc: () => ContentDoc,
  ContentEmbed: () => ContentEmbed,
  ContentFormat: () => ContentFormat,
  ContentJSON: () => ContentJSON,
  ContentString: () => ContentString,
  ContentType: () => ContentType,
  Doc: () => Doc,
  GC: () => GC,
  ID: () => ID,
  Item: () => Item,
  Map: () => YMap,
  PermanentUserData: () => PermanentUserData,
  RelativePosition: () => RelativePosition,
  Skip: () => Skip,
  Snapshot: () => Snapshot,
  Text: () => YText,
  Transaction: () => Transaction,
  UndoManager: () => UndoManager,
  UpdateDecoderV1: () => UpdateDecoderV1,
  UpdateDecoderV2: () => UpdateDecoderV2,
  UpdateEncoderV1: () => UpdateEncoderV1,
  UpdateEncoderV2: () => UpdateEncoderV2,
  XmlElement: () => YXmlElement,
  XmlFragment: () => YXmlFragment,
  XmlHook: () => YXmlHook,
  XmlText: () => YXmlText,
  YArrayEvent: () => YArrayEvent,
  YEvent: () => YEvent,
  YMapEvent: () => YMapEvent,
  YTextEvent: () => YTextEvent,
  YXmlEvent: () => YXmlEvent,
  applyUpdate: () => applyUpdate,
  applyUpdateV2: () => applyUpdateV2,
  cleanupYTextFormatting: () => cleanupYTextFormatting,
  compareIDs: () => compareIDs,
  compareRelativePositions: () => compareRelativePositions,
  convertUpdateFormatV1ToV2: () => convertUpdateFormatV1ToV2,
  convertUpdateFormatV2ToV1: () => convertUpdateFormatV2ToV1,
  createAbsolutePositionFromRelativePosition: () => createAbsolutePositionFromRelativePosition,
  createDeleteSet: () => createDeleteSet,
  createDeleteSetFromStructStore: () => createDeleteSetFromStructStore,
  createDocFromSnapshot: () => createDocFromSnapshot,
  createID: () => createID,
  createRelativePositionFromJSON: () => createRelativePositionFromJSON,
  createRelativePositionFromTypeIndex: () => createRelativePositionFromTypeIndex,
  createSnapshot: () => createSnapshot,
  decodeRelativePosition: () => decodeRelativePosition,
  decodeSnapshot: () => decodeSnapshot,
  decodeSnapshotV2: () => decodeSnapshotV2,
  decodeStateVector: () => decodeStateVector,
  decodeUpdate: () => decodeUpdate,
  decodeUpdateV2: () => decodeUpdateV2,
  diffUpdate: () => diffUpdate,
  diffUpdateV2: () => diffUpdateV2,
  emptySnapshot: () => emptySnapshot,
  encodeRelativePosition: () => encodeRelativePosition,
  encodeSnapshot: () => encodeSnapshot,
  encodeSnapshotV2: () => encodeSnapshotV2,
  encodeStateAsUpdate: () => encodeStateAsUpdate,
  encodeStateAsUpdateV2: () => encodeStateAsUpdateV2,
  encodeStateVector: () => encodeStateVector,
  encodeStateVectorFromUpdate: () => encodeStateVectorFromUpdate,
  encodeStateVectorFromUpdateV2: () => encodeStateVectorFromUpdateV2,
  equalDeleteSets: () => equalDeleteSets,
  equalSnapshots: () => equalSnapshots,
  findIndexSS: () => findIndexSS,
  findRootTypeKey: () => findRootTypeKey,
  getItem: () => getItem,
  getItemCleanEnd: () => getItemCleanEnd,
  getItemCleanStart: () => getItemCleanStart,
  getState: () => getState,
  getTypeChildren: () => getTypeChildren,
  isDeleted: () => isDeleted,
  isParentOf: () => isParentOf,
  iterateDeletedStructs: () => iterateDeletedStructs,
  logType: () => logType,
  logUpdate: () => logUpdate,
  logUpdateV2: () => logUpdateV2,
  mergeDeleteSets: () => mergeDeleteSets,
  mergeUpdates: () => mergeUpdates,
  mergeUpdatesV2: () => mergeUpdatesV2,
  obfuscateUpdate: () => obfuscateUpdate,
  obfuscateUpdateV2: () => obfuscateUpdateV2,
  parseUpdateMeta: () => parseUpdateMeta,
  parseUpdateMetaV2: () => parseUpdateMetaV2,
  readUpdate: () => readUpdate,
  readUpdateV2: () => readUpdateV2,
  relativePositionToJSON: () => relativePositionToJSON,
  snapshot: () => snapshot,
  snapshotContainsUpdate: () => snapshotContainsUpdate,
  transact: () => transact,
  tryGc: () => tryGc,
  typeListToArraySnapshot: () => typeListToArraySnapshot,
  typeMapGetAllSnapshot: () => typeMapGetAllSnapshot,
  typeMapGetSnapshot: () => typeMapGetSnapshot
});
function* lazyStructReaderGenerator(decoder) {
  const numOfStateUpdates = readVarUint(decoder.restDecoder);
  for (let i = 0; i < numOfStateUpdates; i++) {
    const numberOfStructs = readVarUint(decoder.restDecoder);
    const client = decoder.readClient();
    let clock = readVarUint(decoder.restDecoder);
    for (let i2 = 0; i2 < numberOfStructs; i2++) {
      const info = decoder.readInfo();
      if (info === 10) {
        const len = readVarUint(decoder.restDecoder);
        yield new Skip(createID(client, clock), len);
        clock += len;
      } else if ((BITS5 & info) !== 0) {
        const cantCopyParentInfo = (info & (BIT7 | BIT8)) === 0;
        const struct = new Item(
          createID(client, clock),
          null,
          // left
          (info & BIT8) === BIT8 ? decoder.readLeftID() : null,
          // origin
          null,
          // right
          (info & BIT7) === BIT7 ? decoder.readRightID() : null,
          // right origin
          // @ts-ignore Force writing a string here.
          cantCopyParentInfo ? decoder.readParentInfo() ? decoder.readString() : decoder.readLeftID() : null,
          // parent
          cantCopyParentInfo && (info & BIT6) === BIT6 ? decoder.readString() : null,
          // parentSub
          readItemContent(decoder, info)
          // item content
        );
        yield struct;
        clock += struct.length;
      } else {
        const len = decoder.readLen();
        yield new GC(createID(client, clock), len);
        clock += len;
      }
    }
  }
}
var AbstractConnector, DeleteItem, DeleteSet, iterateDeletedStructs, findIndexDS, isDeleted, sortAndMergeDeleteSet, mergeDeleteSets, addToDeleteSet, createDeleteSet, createDeleteSetFromStructStore, writeDeleteSet, readDeleteSet, readAndApplyDeleteSet, equalDeleteSets, generateNewClientId, Doc, DSDecoderV1, UpdateDecoderV1, DSDecoderV2, UpdateDecoderV2, DSEncoderV1, UpdateEncoderV1, DSEncoderV2, UpdateEncoderV2, writeStructs, writeClientsStructs, readClientsStructRefs, integrateStructs, writeStructsFromTransaction, readUpdateV2, readUpdate, applyUpdateV2, applyUpdate, writeStateAsUpdate, encodeStateAsUpdateV2, encodeStateAsUpdate, readStateVector, decodeStateVector, writeStateVector, writeDocumentStateVector, encodeStateVectorV2, encodeStateVector, EventHandler, createEventHandler, addEventHandlerListener, removeEventHandlerListener, callEventHandlerListeners, ID, compareIDs, createID, writeID, readID, findRootTypeKey, isParentOf, logType, PermanentUserData, RelativePosition, relativePositionToJSON, createRelativePositionFromJSON, AbsolutePosition, createAbsolutePosition, createRelativePosition, createRelativePositionFromTypeIndex, writeRelativePosition, encodeRelativePosition, readRelativePosition, decodeRelativePosition, getItemWithOffset, createAbsolutePositionFromRelativePosition, compareRelativePositions, Snapshot, equalSnapshots, encodeSnapshotV2, encodeSnapshot, decodeSnapshotV2, decodeSnapshot, createSnapshot, emptySnapshot, snapshot, isVisible, splitSnapshotAffectedStructs, createDocFromSnapshot, snapshotContainsUpdateV2, snapshotContainsUpdate, StructStore, getStateVector, getState, addStruct, findIndexSS, find, getItem, findIndexCleanStart, getItemCleanStart, getItemCleanEnd, replaceStruct, iterateStructs, Transaction, writeUpdateMessageFromTransaction, addChangedTypeToTransaction, tryToMergeWithLefts, tryGcDeleteSet, tryMergeDeleteSet, tryGc, cleanupTransactions, transact, StackItem, clearUndoManagerStackItem, popStackItem, UndoManager, LazyStructReader, logUpdate, logUpdateV2, decodeUpdate, decodeUpdateV2, LazyStructWriter, mergeUpdates, encodeStateVectorFromUpdateV2, encodeStateVectorFromUpdate, parseUpdateMetaV2, parseUpdateMeta, sliceStruct, mergeUpdatesV2, diffUpdateV2, diffUpdate, flushLazyStructWriter, writeStructToLazyStructWriter, finishLazyStructWriting, convertUpdateFormat, createObfuscator, obfuscateUpdate, obfuscateUpdateV2, convertUpdateFormatV1ToV2, convertUpdateFormatV2ToV1, errorComputeChanges, YEvent, getPathTo, warnPrematureAccess, maxSearchMarker, globalSearchMarkerTimestamp, ArraySearchMarker, refreshMarkerTimestamp, overwriteMarker, markPosition, findMarker, updateMarkerChanges, getTypeChildren, callTypeObservers, AbstractType, typeListSlice, typeListToArray, typeListToArraySnapshot, typeListForEach, typeListMap, typeListCreateIterator, typeListGet, typeListInsertGenericsAfter, lengthExceeded, typeListInsertGenerics, typeListPushGenerics, typeListDelete, typeMapDelete, typeMapSet, typeMapGet, typeMapGetAll, typeMapHas, typeMapGetSnapshot, typeMapGetAllSnapshot, createMapIterator, YArrayEvent, YArray, readYArray, YMapEvent, YMap, readYMap, equalAttrs, ItemTextListPosition, findNextPosition, findPosition, insertNegatedAttributes, updateCurrentAttributes, minimizeAttributeChanges, insertAttributes, insertText, formatText, cleanupFormattingGap, cleanupContextlessFormattingGap, cleanupYTextFormatting, cleanupYTextAfterTransaction, deleteText, YTextEvent, YText, readYText, YXmlTreeWalker, YXmlFragment, readYXmlFragment, YXmlElement, readYXmlElement, YXmlEvent, YXmlHook, readYXmlHook, YXmlText, readYXmlText, AbstractStruct, structGCRefNumber, GC, ContentBinary, readContentBinary, ContentDeleted, readContentDeleted, createDocFromOpts, ContentDoc, readContentDoc, ContentEmbed, readContentEmbed, ContentFormat, readContentFormat, ContentJSON, readContentJSON, isDevMode, ContentAny, readContentAny, ContentString, readContentString, typeRefs, YArrayRefID, YMapRefID, YTextRefID, YXmlElementRefID, YXmlFragmentRefID, YXmlHookRefID, YXmlTextRefID, ContentType, readContentType, followRedone, keepItem, splitItem, isDeletedByUndoStack, redoItem, Item, readItemContent, contentRefs, structSkipRefNumber, Skip, glo, importIdentifier;
var init_yjs = __esm({
  "node_modules/yjs/dist/yjs.mjs"() {
    init_observable();
    init_array();
    init_math();
    init_map();
    init_encoding();
    init_decoding();
    init_random();
    init_promise();
    init_buffer();
    init_error();
    init_binary();
    init_function();
    init_function();
    init_set();
    init_logging();
    init_time();
    init_string();
    init_iterator();
    init_object();
    init_environment();
    AbstractConnector = class extends ObservableV2 {
      /**
       * @param {Doc} ydoc
       * @param {any} awareness
       */
      constructor(ydoc, awareness) {
        super();
        this.doc = ydoc;
        this.awareness = awareness;
      }
    };
    DeleteItem = class {
      /**
       * @param {number} clock
       * @param {number} len
       */
      constructor(clock, len) {
        this.clock = clock;
        this.len = len;
      }
    };
    DeleteSet = class {
      constructor() {
        this.clients = /* @__PURE__ */ new Map();
      }
    };
    iterateDeletedStructs = (transaction, ds, f) => ds.clients.forEach((deletes, clientid) => {
      const structs = (
        /** @type {Array<GC|Item>} */
        transaction.doc.store.clients.get(clientid)
      );
      if (structs != null) {
        const lastStruct = structs[structs.length - 1];
        const clockState = lastStruct.id.clock + lastStruct.length;
        for (let i = 0, del = deletes[i]; i < deletes.length && del.clock < clockState; del = deletes[++i]) {
          iterateStructs(transaction, structs, del.clock, del.len, f);
        }
      }
    });
    findIndexDS = (dis, clock) => {
      let left = 0;
      let right = dis.length - 1;
      while (left <= right) {
        const midindex = floor((left + right) / 2);
        const mid = dis[midindex];
        const midclock = mid.clock;
        if (midclock <= clock) {
          if (clock < midclock + mid.len) {
            return midindex;
          }
          left = midindex + 1;
        } else {
          right = midindex - 1;
        }
      }
      return null;
    };
    isDeleted = (ds, id2) => {
      const dis = ds.clients.get(id2.client);
      return dis !== void 0 && findIndexDS(dis, id2.clock) !== null;
    };
    sortAndMergeDeleteSet = (ds) => {
      ds.clients.forEach((dels) => {
        dels.sort((a, b) => a.clock - b.clock);
        let i, j;
        for (i = 1, j = 1; i < dels.length; i++) {
          const left = dels[j - 1];
          const right = dels[i];
          if (left.clock + left.len >= right.clock) {
            dels[j - 1] = new DeleteItem(left.clock, max(left.len, right.clock + right.len - left.clock));
          } else {
            if (j < i) {
              dels[j] = right;
            }
            j++;
          }
        }
        dels.length = j;
      });
    };
    mergeDeleteSets = (dss) => {
      const merged = new DeleteSet();
      for (let dssI = 0; dssI < dss.length; dssI++) {
        dss[dssI].clients.forEach((delsLeft, client) => {
          if (!merged.clients.has(client)) {
            const dels = delsLeft.slice();
            for (let i = dssI + 1; i < dss.length; i++) {
              appendTo(dels, dss[i].clients.get(client) || []);
            }
            merged.clients.set(client, dels);
          }
        });
      }
      sortAndMergeDeleteSet(merged);
      return merged;
    };
    addToDeleteSet = (ds, client, clock, length2) => {
      setIfUndefined(ds.clients, client, () => (
        /** @type {Array<DeleteItem>} */
        []
      )).push(new DeleteItem(clock, length2));
    };
    createDeleteSet = () => new DeleteSet();
    createDeleteSetFromStructStore = (ss) => {
      const ds = createDeleteSet();
      ss.clients.forEach((structs, client) => {
        const dsitems = [];
        for (let i = 0; i < structs.length; i++) {
          const struct = structs[i];
          if (struct.deleted) {
            const clock = struct.id.clock;
            let len = struct.length;
            if (i + 1 < structs.length) {
              for (let next = structs[i + 1]; i + 1 < structs.length && next.deleted; next = structs[++i + 1]) {
                len += next.length;
              }
            }
            dsitems.push(new DeleteItem(clock, len));
          }
        }
        if (dsitems.length > 0) {
          ds.clients.set(client, dsitems);
        }
      });
      return ds;
    };
    writeDeleteSet = (encoder, ds) => {
      writeVarUint(encoder.restEncoder, ds.clients.size);
      from(ds.clients.entries()).sort((a, b) => b[0] - a[0]).forEach(([client, dsitems]) => {
        encoder.resetDsCurVal();
        writeVarUint(encoder.restEncoder, client);
        const len = dsitems.length;
        writeVarUint(encoder.restEncoder, len);
        for (let i = 0; i < len; i++) {
          const item = dsitems[i];
          encoder.writeDsClock(item.clock);
          encoder.writeDsLen(item.len);
        }
      });
    };
    readDeleteSet = (decoder) => {
      const ds = new DeleteSet();
      const numClients = readVarUint(decoder.restDecoder);
      for (let i = 0; i < numClients; i++) {
        decoder.resetDsCurVal();
        const client = readVarUint(decoder.restDecoder);
        const numberOfDeletes = readVarUint(decoder.restDecoder);
        if (numberOfDeletes > 0) {
          const dsField = setIfUndefined(ds.clients, client, () => (
            /** @type {Array<DeleteItem>} */
            []
          ));
          for (let i2 = 0; i2 < numberOfDeletes; i2++) {
            dsField.push(new DeleteItem(decoder.readDsClock(), decoder.readDsLen()));
          }
        }
      }
      return ds;
    };
    readAndApplyDeleteSet = (decoder, transaction, store) => {
      const unappliedDS = new DeleteSet();
      const numClients = readVarUint(decoder.restDecoder);
      for (let i = 0; i < numClients; i++) {
        decoder.resetDsCurVal();
        const client = readVarUint(decoder.restDecoder);
        const numberOfDeletes = readVarUint(decoder.restDecoder);
        const structs = store.clients.get(client) || [];
        const state = getState(store, client);
        for (let i2 = 0; i2 < numberOfDeletes; i2++) {
          const clock = decoder.readDsClock();
          const clockEnd = clock + decoder.readDsLen();
          if (clock < state) {
            if (state < clockEnd) {
              addToDeleteSet(unappliedDS, client, state, clockEnd - state);
            }
            let index = findIndexSS(structs, clock);
            let struct = structs[index];
            if (!struct.deleted && struct.id.clock < clock) {
              structs.splice(index + 1, 0, splitItem(transaction, struct, clock - struct.id.clock));
              index++;
            }
            while (index < structs.length) {
              struct = structs[index++];
              if (struct.id.clock < clockEnd) {
                if (!struct.deleted) {
                  if (clockEnd < struct.id.clock + struct.length) {
                    structs.splice(index, 0, splitItem(transaction, struct, clockEnd - struct.id.clock));
                  }
                  struct.delete(transaction);
                }
              } else {
                break;
              }
            }
          } else {
            addToDeleteSet(unappliedDS, client, clock, clockEnd - clock);
          }
        }
      }
      if (unappliedDS.clients.size > 0) {
        const ds = new UpdateEncoderV2();
        writeVarUint(ds.restEncoder, 0);
        writeDeleteSet(ds, unappliedDS);
        return ds.toUint8Array();
      }
      return null;
    };
    equalDeleteSets = (ds1, ds2) => {
      if (ds1.clients.size !== ds2.clients.size) return false;
      for (const [client, deleteItems1] of ds1.clients.entries()) {
        const deleteItems2 = (
          /** @type {Array<import('../internals.js').DeleteItem>} */
          ds2.clients.get(client)
        );
        if (deleteItems2 === void 0 || deleteItems1.length !== deleteItems2.length) return false;
        for (let i = 0; i < deleteItems1.length; i++) {
          const di1 = deleteItems1[i];
          const di2 = deleteItems2[i];
          if (di1.clock !== di2.clock || di1.len !== di2.len) {
            return false;
          }
        }
      }
      return true;
    };
    generateNewClientId = uint32;
    Doc = class _Doc extends ObservableV2 {
      /**
       * @param {DocOpts} opts configuration
       */
      constructor({ guid = uuidv4(), collectionid = null, gc = true, gcFilter = () => true, meta = null, autoLoad = false, shouldLoad = true } = {}) {
        super();
        this.gc = gc;
        this.gcFilter = gcFilter;
        this.clientID = generateNewClientId();
        this.guid = guid;
        this.collectionid = collectionid;
        this.share = /* @__PURE__ */ new Map();
        this.store = new StructStore();
        this._transaction = null;
        this._transactionCleanups = [];
        this.subdocs = /* @__PURE__ */ new Set();
        this._item = null;
        this.shouldLoad = shouldLoad;
        this.autoLoad = autoLoad;
        this.meta = meta;
        this.isLoaded = false;
        this.isSynced = false;
        this.isDestroyed = false;
        this.whenLoaded = create4((resolve) => {
          this.on("load", () => {
            this.isLoaded = true;
            resolve(this);
          });
        });
        const provideSyncedPromise = () => create4((resolve) => {
          const eventHandler = (isSynced) => {
            if (isSynced === void 0 || isSynced === true) {
              this.off("sync", eventHandler);
              resolve();
            }
          };
          this.on("sync", eventHandler);
        });
        this.on("sync", (isSynced) => {
          if (isSynced === false && this.isSynced) {
            this.whenSynced = provideSyncedPromise();
          }
          this.isSynced = isSynced === void 0 || isSynced === true;
          if (this.isSynced && !this.isLoaded) {
            this.emit("load", [this]);
          }
        });
        this.whenSynced = provideSyncedPromise();
      }
      /**
       * Notify the parent document that you request to load data into this subdocument (if it is a subdocument).
       *
       * `load()` might be used in the future to request any provider to load the most current data.
       *
       * It is safe to call `load()` multiple times.
       */
      load() {
        const item = this._item;
        if (item !== null && !this.shouldLoad) {
          transact(
            /** @type {any} */
            item.parent.doc,
            (transaction) => {
              transaction.subdocsLoaded.add(this);
            },
            null,
            true
          );
        }
        this.shouldLoad = true;
      }
      getSubdocs() {
        return this.subdocs;
      }
      getSubdocGuids() {
        return new Set(from(this.subdocs).map((doc2) => doc2.guid));
      }
      /**
       * Changes that happen inside of a transaction are bundled. This means that
       * the observer fires _after_ the transaction is finished and that all changes
       * that happened inside of the transaction are sent as one message to the
       * other peers.
       *
       * @template T
       * @param {function(Transaction):T} f The function that should be executed as a transaction
       * @param {any} [origin] Origin of who started the transaction. Will be stored on transaction.origin
       * @return T
       *
       * @public
       */
      transact(f, origin = null) {
        return transact(this, f, origin);
      }
      /**
       * Define a shared data type.
       *
       * Multiple calls of `ydoc.get(name, TypeConstructor)` yield the same result
       * and do not overwrite each other. I.e.
       * `ydoc.get(name, Y.Array) === ydoc.get(name, Y.Array)`
       *
       * After this method is called, the type is also available on `ydoc.share.get(name)`.
       *
       * *Best Practices:*
       * Define all types right after the Y.Doc instance is created and store them in a separate object.
       * Also use the typed methods `getText(name)`, `getArray(name)`, ..
       *
       * @template {typeof AbstractType<any>} Type
       * @example
       *   const ydoc = new Y.Doc(..)
       *   const appState = {
       *     document: ydoc.getText('document')
       *     comments: ydoc.getArray('comments')
       *   }
       *
       * @param {string} name
       * @param {Type} TypeConstructor The constructor of the type definition. E.g. Y.Text, Y.Array, Y.Map, ...
       * @return {InstanceType<Type>} The created type. Constructed with TypeConstructor
       *
       * @public
       */
      get(name, TypeConstructor = (
        /** @type {any} */
        AbstractType
      )) {
        const type = setIfUndefined(this.share, name, () => {
          const t = new TypeConstructor();
          t._integrate(this, null);
          return t;
        });
        const Constr = type.constructor;
        if (TypeConstructor !== AbstractType && Constr !== TypeConstructor) {
          if (Constr === AbstractType) {
            const t = new TypeConstructor();
            t._map = type._map;
            type._map.forEach(
              /** @param {Item?} n */
              (n) => {
                for (; n !== null; n = n.left) {
                  n.parent = t;
                }
              }
            );
            t._start = type._start;
            for (let n = t._start; n !== null; n = n.right) {
              n.parent = t;
            }
            t._length = type._length;
            this.share.set(name, t);
            t._integrate(this, null);
            return (
              /** @type {InstanceType<Type>} */
              t
            );
          } else {
            throw new Error(`Type with the name ${name} has already been defined with a different constructor`);
          }
        }
        return (
          /** @type {InstanceType<Type>} */
          type
        );
      }
      /**
       * @template T
       * @param {string} [name]
       * @return {YArray<T>}
       *
       * @public
       */
      getArray(name = "") {
        return (
          /** @type {YArray<T>} */
          this.get(name, YArray)
        );
      }
      /**
       * @param {string} [name]
       * @return {YText}
       *
       * @public
       */
      getText(name = "") {
        return this.get(name, YText);
      }
      /**
       * @template T
       * @param {string} [name]
       * @return {YMap<T>}
       *
       * @public
       */
      getMap(name = "") {
        return (
          /** @type {YMap<T>} */
          this.get(name, YMap)
        );
      }
      /**
       * @param {string} [name]
       * @return {YXmlElement}
       *
       * @public
       */
      getXmlElement(name = "") {
        return (
          /** @type {YXmlElement<{[key:string]:string}>} */
          this.get(name, YXmlElement)
        );
      }
      /**
       * @param {string} [name]
       * @return {YXmlFragment}
       *
       * @public
       */
      getXmlFragment(name = "") {
        return this.get(name, YXmlFragment);
      }
      /**
       * Converts the entire document into a js object, recursively traversing each yjs type
       * Doesn't log types that have not been defined (using ydoc.getType(..)).
       *
       * @deprecated Do not use this method and rather call toJSON directly on the shared types.
       *
       * @return {Object<string, any>}
       */
      toJSON() {
        const doc2 = {};
        this.share.forEach((value, key) => {
          doc2[key] = value.toJSON();
        });
        return doc2;
      }
      /**
       * Emit `destroy` event and unregister all event handlers.
       */
      destroy() {
        this.isDestroyed = true;
        from(this.subdocs).forEach((subdoc) => subdoc.destroy());
        const item = this._item;
        if (item !== null) {
          this._item = null;
          const content = (
            /** @type {ContentDoc} */
            item.content
          );
          content.doc = new _Doc({ guid: this.guid, ...content.opts, shouldLoad: false });
          content.doc._item = item;
          transact(
            /** @type {any} */
            item.parent.doc,
            (transaction) => {
              const doc2 = content.doc;
              if (!item.deleted) {
                transaction.subdocsAdded.add(doc2);
              }
              transaction.subdocsRemoved.add(this);
            },
            null,
            true
          );
        }
        this.emit("destroyed", [true]);
        this.emit("destroy", [this]);
        super.destroy();
      }
    };
    DSDecoderV1 = class {
      /**
       * @param {decoding.Decoder} decoder
       */
      constructor(decoder) {
        this.restDecoder = decoder;
      }
      resetDsCurVal() {
      }
      /**
       * @return {number}
       */
      readDsClock() {
        return readVarUint(this.restDecoder);
      }
      /**
       * @return {number}
       */
      readDsLen() {
        return readVarUint(this.restDecoder);
      }
    };
    UpdateDecoderV1 = class extends DSDecoderV1 {
      /**
       * @return {ID}
       */
      readLeftID() {
        return createID(readVarUint(this.restDecoder), readVarUint(this.restDecoder));
      }
      /**
       * @return {ID}
       */
      readRightID() {
        return createID(readVarUint(this.restDecoder), readVarUint(this.restDecoder));
      }
      /**
       * Read the next client id.
       * Use this in favor of readID whenever possible to reduce the number of objects created.
       */
      readClient() {
        return readVarUint(this.restDecoder);
      }
      /**
       * @return {number} info An unsigned 8-bit integer
       */
      readInfo() {
        return readUint8(this.restDecoder);
      }
      /**
       * @return {string}
       */
      readString() {
        return readVarString(this.restDecoder);
      }
      /**
       * @return {boolean} isKey
       */
      readParentInfo() {
        return readVarUint(this.restDecoder) === 1;
      }
      /**
       * @return {number} info An unsigned 8-bit integer
       */
      readTypeRef() {
        return readVarUint(this.restDecoder);
      }
      /**
       * Write len of a struct - well suited for Opt RLE encoder.
       *
       * @return {number} len
       */
      readLen() {
        return readVarUint(this.restDecoder);
      }
      /**
       * @return {any}
       */
      readAny() {
        return readAny(this.restDecoder);
      }
      /**
       * @return {Uint8Array}
       */
      readBuf() {
        return copyUint8Array(readVarUint8Array(this.restDecoder));
      }
      /**
       * Legacy implementation uses JSON parse. We use any-decoding in v2.
       *
       * @return {any}
       */
      readJSON() {
        return JSON.parse(readVarString(this.restDecoder));
      }
      /**
       * @return {string}
       */
      readKey() {
        return readVarString(this.restDecoder);
      }
    };
    DSDecoderV2 = class {
      /**
       * @param {decoding.Decoder} decoder
       */
      constructor(decoder) {
        this.dsCurrVal = 0;
        this.restDecoder = decoder;
      }
      resetDsCurVal() {
        this.dsCurrVal = 0;
      }
      /**
       * @return {number}
       */
      readDsClock() {
        this.dsCurrVal += readVarUint(this.restDecoder);
        return this.dsCurrVal;
      }
      /**
       * @return {number}
       */
      readDsLen() {
        const diff = readVarUint(this.restDecoder) + 1;
        this.dsCurrVal += diff;
        return diff;
      }
    };
    UpdateDecoderV2 = class extends DSDecoderV2 {
      /**
       * @param {decoding.Decoder} decoder
       */
      constructor(decoder) {
        super(decoder);
        this.keys = [];
        readVarUint(decoder);
        this.keyClockDecoder = new IntDiffOptRleDecoder(readVarUint8Array(decoder));
        this.clientDecoder = new UintOptRleDecoder(readVarUint8Array(decoder));
        this.leftClockDecoder = new IntDiffOptRleDecoder(readVarUint8Array(decoder));
        this.rightClockDecoder = new IntDiffOptRleDecoder(readVarUint8Array(decoder));
        this.infoDecoder = new RleDecoder(readVarUint8Array(decoder), readUint8);
        this.stringDecoder = new StringDecoder(readVarUint8Array(decoder));
        this.parentInfoDecoder = new RleDecoder(readVarUint8Array(decoder), readUint8);
        this.typeRefDecoder = new UintOptRleDecoder(readVarUint8Array(decoder));
        this.lenDecoder = new UintOptRleDecoder(readVarUint8Array(decoder));
      }
      /**
       * @return {ID}
       */
      readLeftID() {
        return new ID(this.clientDecoder.read(), this.leftClockDecoder.read());
      }
      /**
       * @return {ID}
       */
      readRightID() {
        return new ID(this.clientDecoder.read(), this.rightClockDecoder.read());
      }
      /**
       * Read the next client id.
       * Use this in favor of readID whenever possible to reduce the number of objects created.
       */
      readClient() {
        return this.clientDecoder.read();
      }
      /**
       * @return {number} info An unsigned 8-bit integer
       */
      readInfo() {
        return (
          /** @type {number} */
          this.infoDecoder.read()
        );
      }
      /**
       * @return {string}
       */
      readString() {
        return this.stringDecoder.read();
      }
      /**
       * @return {boolean}
       */
      readParentInfo() {
        return this.parentInfoDecoder.read() === 1;
      }
      /**
       * @return {number} An unsigned 8-bit integer
       */
      readTypeRef() {
        return this.typeRefDecoder.read();
      }
      /**
       * Write len of a struct - well suited for Opt RLE encoder.
       *
       * @return {number}
       */
      readLen() {
        return this.lenDecoder.read();
      }
      /**
       * @return {any}
       */
      readAny() {
        return readAny(this.restDecoder);
      }
      /**
       * @return {Uint8Array}
       */
      readBuf() {
        return readVarUint8Array(this.restDecoder);
      }
      /**
       * This is mainly here for legacy purposes.
       *
       * Initial we incoded objects using JSON. Now we use the much faster lib0/any-encoder. This method mainly exists for legacy purposes for the v1 encoder.
       *
       * @return {any}
       */
      readJSON() {
        return readAny(this.restDecoder);
      }
      /**
       * @return {string}
       */
      readKey() {
        const keyClock = this.keyClockDecoder.read();
        if (keyClock < this.keys.length) {
          return this.keys[keyClock];
        } else {
          const key = this.stringDecoder.read();
          this.keys.push(key);
          return key;
        }
      }
    };
    DSEncoderV1 = class {
      constructor() {
        this.restEncoder = createEncoder();
      }
      toUint8Array() {
        return toUint8Array(this.restEncoder);
      }
      resetDsCurVal() {
      }
      /**
       * @param {number} clock
       */
      writeDsClock(clock) {
        writeVarUint(this.restEncoder, clock);
      }
      /**
       * @param {number} len
       */
      writeDsLen(len) {
        writeVarUint(this.restEncoder, len);
      }
    };
    UpdateEncoderV1 = class extends DSEncoderV1 {
      /**
       * @param {ID} id
       */
      writeLeftID(id2) {
        writeVarUint(this.restEncoder, id2.client);
        writeVarUint(this.restEncoder, id2.clock);
      }
      /**
       * @param {ID} id
       */
      writeRightID(id2) {
        writeVarUint(this.restEncoder, id2.client);
        writeVarUint(this.restEncoder, id2.clock);
      }
      /**
       * Use writeClient and writeClock instead of writeID if possible.
       * @param {number} client
       */
      writeClient(client) {
        writeVarUint(this.restEncoder, client);
      }
      /**
       * @param {number} info An unsigned 8-bit integer
       */
      writeInfo(info) {
        writeUint8(this.restEncoder, info);
      }
      /**
       * @param {string} s
       */
      writeString(s) {
        writeVarString(this.restEncoder, s);
      }
      /**
       * @param {boolean} isYKey
       */
      writeParentInfo(isYKey) {
        writeVarUint(this.restEncoder, isYKey ? 1 : 0);
      }
      /**
       * @param {number} info An unsigned 8-bit integer
       */
      writeTypeRef(info) {
        writeVarUint(this.restEncoder, info);
      }
      /**
       * Write len of a struct - well suited for Opt RLE encoder.
       *
       * @param {number} len
       */
      writeLen(len) {
        writeVarUint(this.restEncoder, len);
      }
      /**
       * @param {any} any
       */
      writeAny(any2) {
        writeAny(this.restEncoder, any2);
      }
      /**
       * @param {Uint8Array} buf
       */
      writeBuf(buf) {
        writeVarUint8Array(this.restEncoder, buf);
      }
      /**
       * @param {any} embed
       */
      writeJSON(embed) {
        writeVarString(this.restEncoder, JSON.stringify(embed));
      }
      /**
       * @param {string} key
       */
      writeKey(key) {
        writeVarString(this.restEncoder, key);
      }
    };
    DSEncoderV2 = class {
      constructor() {
        this.restEncoder = createEncoder();
        this.dsCurrVal = 0;
      }
      toUint8Array() {
        return toUint8Array(this.restEncoder);
      }
      resetDsCurVal() {
        this.dsCurrVal = 0;
      }
      /**
       * @param {number} clock
       */
      writeDsClock(clock) {
        const diff = clock - this.dsCurrVal;
        this.dsCurrVal = clock;
        writeVarUint(this.restEncoder, diff);
      }
      /**
       * @param {number} len
       */
      writeDsLen(len) {
        if (len === 0) {
          unexpectedCase();
        }
        writeVarUint(this.restEncoder, len - 1);
        this.dsCurrVal += len;
      }
    };
    UpdateEncoderV2 = class extends DSEncoderV2 {
      constructor() {
        super();
        this.keyMap = /* @__PURE__ */ new Map();
        this.keyClock = 0;
        this.keyClockEncoder = new IntDiffOptRleEncoder();
        this.clientEncoder = new UintOptRleEncoder();
        this.leftClockEncoder = new IntDiffOptRleEncoder();
        this.rightClockEncoder = new IntDiffOptRleEncoder();
        this.infoEncoder = new RleEncoder(writeUint8);
        this.stringEncoder = new StringEncoder();
        this.parentInfoEncoder = new RleEncoder(writeUint8);
        this.typeRefEncoder = new UintOptRleEncoder();
        this.lenEncoder = new UintOptRleEncoder();
      }
      toUint8Array() {
        const encoder = createEncoder();
        writeVarUint(encoder, 0);
        writeVarUint8Array(encoder, this.keyClockEncoder.toUint8Array());
        writeVarUint8Array(encoder, this.clientEncoder.toUint8Array());
        writeVarUint8Array(encoder, this.leftClockEncoder.toUint8Array());
        writeVarUint8Array(encoder, this.rightClockEncoder.toUint8Array());
        writeVarUint8Array(encoder, toUint8Array(this.infoEncoder));
        writeVarUint8Array(encoder, this.stringEncoder.toUint8Array());
        writeVarUint8Array(encoder, toUint8Array(this.parentInfoEncoder));
        writeVarUint8Array(encoder, this.typeRefEncoder.toUint8Array());
        writeVarUint8Array(encoder, this.lenEncoder.toUint8Array());
        writeUint8Array(encoder, toUint8Array(this.restEncoder));
        return toUint8Array(encoder);
      }
      /**
       * @param {ID} id
       */
      writeLeftID(id2) {
        this.clientEncoder.write(id2.client);
        this.leftClockEncoder.write(id2.clock);
      }
      /**
       * @param {ID} id
       */
      writeRightID(id2) {
        this.clientEncoder.write(id2.client);
        this.rightClockEncoder.write(id2.clock);
      }
      /**
       * @param {number} client
       */
      writeClient(client) {
        this.clientEncoder.write(client);
      }
      /**
       * @param {number} info An unsigned 8-bit integer
       */
      writeInfo(info) {
        this.infoEncoder.write(info);
      }
      /**
       * @param {string} s
       */
      writeString(s) {
        this.stringEncoder.write(s);
      }
      /**
       * @param {boolean} isYKey
       */
      writeParentInfo(isYKey) {
        this.parentInfoEncoder.write(isYKey ? 1 : 0);
      }
      /**
       * @param {number} info An unsigned 8-bit integer
       */
      writeTypeRef(info) {
        this.typeRefEncoder.write(info);
      }
      /**
       * Write len of a struct - well suited for Opt RLE encoder.
       *
       * @param {number} len
       */
      writeLen(len) {
        this.lenEncoder.write(len);
      }
      /**
       * @param {any} any
       */
      writeAny(any2) {
        writeAny(this.restEncoder, any2);
      }
      /**
       * @param {Uint8Array} buf
       */
      writeBuf(buf) {
        writeVarUint8Array(this.restEncoder, buf);
      }
      /**
       * This is mainly here for legacy purposes.
       *
       * Initial we incoded objects using JSON. Now we use the much faster lib0/any-encoder. This method mainly exists for legacy purposes for the v1 encoder.
       *
       * @param {any} embed
       */
      writeJSON(embed) {
        writeAny(this.restEncoder, embed);
      }
      /**
       * Property keys are often reused. For example, in y-prosemirror the key `bold` might
       * occur very often. For a 3d application, the key `position` might occur very often.
       *
       * We cache these keys in a Map and refer to them via a unique number.
       *
       * @param {string} key
       */
      writeKey(key) {
        const clock = this.keyMap.get(key);
        if (clock === void 0) {
          this.keyClockEncoder.write(this.keyClock++);
          this.stringEncoder.write(key);
        } else {
          this.keyClockEncoder.write(clock);
        }
      }
    };
    writeStructs = (encoder, structs, client, clock) => {
      clock = max(clock, structs[0].id.clock);
      const startNewStructs = findIndexSS(structs, clock);
      writeVarUint(encoder.restEncoder, structs.length - startNewStructs);
      encoder.writeClient(client);
      writeVarUint(encoder.restEncoder, clock);
      const firstStruct = structs[startNewStructs];
      firstStruct.write(encoder, clock - firstStruct.id.clock);
      for (let i = startNewStructs + 1; i < structs.length; i++) {
        structs[i].write(encoder, 0);
      }
    };
    writeClientsStructs = (encoder, store, _sm) => {
      const sm = /* @__PURE__ */ new Map();
      _sm.forEach((clock, client) => {
        if (getState(store, client) > clock) {
          sm.set(client, clock);
        }
      });
      getStateVector(store).forEach((_clock, client) => {
        if (!_sm.has(client)) {
          sm.set(client, 0);
        }
      });
      writeVarUint(encoder.restEncoder, sm.size);
      from(sm.entries()).sort((a, b) => b[0] - a[0]).forEach(([client, clock]) => {
        writeStructs(
          encoder,
          /** @type {Array<GC|Item>} */
          store.clients.get(client),
          client,
          clock
        );
      });
    };
    readClientsStructRefs = (decoder, doc2) => {
      const clientRefs = create();
      const numOfStateUpdates = readVarUint(decoder.restDecoder);
      for (let i = 0; i < numOfStateUpdates; i++) {
        const numberOfStructs = readVarUint(decoder.restDecoder);
        const refs = new Array(numberOfStructs);
        const client = decoder.readClient();
        let clock = readVarUint(decoder.restDecoder);
        clientRefs.set(client, { i: 0, refs });
        for (let i2 = 0; i2 < numberOfStructs; i2++) {
          const info = decoder.readInfo();
          switch (BITS5 & info) {
            case 0: {
              const len = decoder.readLen();
              refs[i2] = new GC(createID(client, clock), len);
              clock += len;
              break;
            }
            case 10: {
              const len = readVarUint(decoder.restDecoder);
              refs[i2] = new Skip(createID(client, clock), len);
              clock += len;
              break;
            }
            default: {
              const cantCopyParentInfo = (info & (BIT7 | BIT8)) === 0;
              const struct = new Item(
                createID(client, clock),
                null,
                // left
                (info & BIT8) === BIT8 ? decoder.readLeftID() : null,
                // origin
                null,
                // right
                (info & BIT7) === BIT7 ? decoder.readRightID() : null,
                // right origin
                cantCopyParentInfo ? decoder.readParentInfo() ? doc2.get(decoder.readString()) : decoder.readLeftID() : null,
                // parent
                cantCopyParentInfo && (info & BIT6) === BIT6 ? decoder.readString() : null,
                // parentSub
                readItemContent(decoder, info)
                // item content
              );
              refs[i2] = struct;
              clock += struct.length;
            }
          }
        }
      }
      return clientRefs;
    };
    integrateStructs = (transaction, store, clientsStructRefs) => {
      const stack = [];
      let clientsStructRefsIds = from(clientsStructRefs.keys()).sort((a, b) => a - b);
      if (clientsStructRefsIds.length === 0) {
        return null;
      }
      const getNextStructTarget = () => {
        if (clientsStructRefsIds.length === 0) {
          return null;
        }
        let nextStructsTarget = (
          /** @type {{i:number,refs:Array<GC|Item>}} */
          clientsStructRefs.get(clientsStructRefsIds[clientsStructRefsIds.length - 1])
        );
        while (nextStructsTarget.refs.length === nextStructsTarget.i) {
          clientsStructRefsIds.pop();
          if (clientsStructRefsIds.length > 0) {
            nextStructsTarget = /** @type {{i:number,refs:Array<GC|Item>}} */
            clientsStructRefs.get(clientsStructRefsIds[clientsStructRefsIds.length - 1]);
          } else {
            return null;
          }
        }
        return nextStructsTarget;
      };
      let curStructsTarget = getNextStructTarget();
      if (curStructsTarget === null) {
        return null;
      }
      const restStructs = new StructStore();
      const missingSV = /* @__PURE__ */ new Map();
      const updateMissingSv = (client, clock) => {
        const mclock = missingSV.get(client);
        if (mclock == null || mclock > clock) {
          missingSV.set(client, clock);
        }
      };
      let stackHead = (
        /** @type {any} */
        curStructsTarget.refs[
          /** @type {any} */
          curStructsTarget.i++
        ]
      );
      const state = /* @__PURE__ */ new Map();
      const addStackToRestSS = () => {
        for (const item of stack) {
          const client = item.id.client;
          const inapplicableItems = clientsStructRefs.get(client);
          if (inapplicableItems) {
            inapplicableItems.i--;
            restStructs.clients.set(client, inapplicableItems.refs.slice(inapplicableItems.i));
            clientsStructRefs.delete(client);
            inapplicableItems.i = 0;
            inapplicableItems.refs = [];
          } else {
            restStructs.clients.set(client, [item]);
          }
          clientsStructRefsIds = clientsStructRefsIds.filter((c) => c !== client);
        }
        stack.length = 0;
      };
      while (true) {
        if (stackHead.constructor !== Skip) {
          const localClock = setIfUndefined(state, stackHead.id.client, () => getState(store, stackHead.id.client));
          const offset = localClock - stackHead.id.clock;
          if (offset < 0) {
            stack.push(stackHead);
            updateMissingSv(stackHead.id.client, stackHead.id.clock - 1);
            addStackToRestSS();
          } else {
            const missing = stackHead.getMissing(transaction, store);
            if (missing !== null) {
              stack.push(stackHead);
              const structRefs = clientsStructRefs.get(
                /** @type {number} */
                missing
              ) || { refs: [], i: 0 };
              if (structRefs.refs.length === structRefs.i) {
                updateMissingSv(
                  /** @type {number} */
                  missing,
                  getState(store, missing)
                );
                addStackToRestSS();
              } else {
                stackHead = structRefs.refs[structRefs.i++];
                continue;
              }
            } else if (offset === 0 || offset < stackHead.length) {
              stackHead.integrate(transaction, offset);
              state.set(stackHead.id.client, stackHead.id.clock + stackHead.length);
            }
          }
        }
        if (stack.length > 0) {
          stackHead = /** @type {GC|Item} */
          stack.pop();
        } else if (curStructsTarget !== null && curStructsTarget.i < curStructsTarget.refs.length) {
          stackHead = /** @type {GC|Item} */
          curStructsTarget.refs[curStructsTarget.i++];
        } else {
          curStructsTarget = getNextStructTarget();
          if (curStructsTarget === null) {
            break;
          } else {
            stackHead = /** @type {GC|Item} */
            curStructsTarget.refs[curStructsTarget.i++];
          }
        }
      }
      if (restStructs.clients.size > 0) {
        const encoder = new UpdateEncoderV2();
        writeClientsStructs(encoder, restStructs, /* @__PURE__ */ new Map());
        writeVarUint(encoder.restEncoder, 0);
        return { missing: missingSV, update: encoder.toUint8Array() };
      }
      return null;
    };
    writeStructsFromTransaction = (encoder, transaction) => writeClientsStructs(encoder, transaction.doc.store, transaction.beforeState);
    readUpdateV2 = (decoder, ydoc, transactionOrigin, structDecoder = new UpdateDecoderV2(decoder)) => transact(ydoc, (transaction) => {
      transaction.local = false;
      let retry = false;
      const doc2 = transaction.doc;
      const store = doc2.store;
      const ss = readClientsStructRefs(structDecoder, doc2);
      const restStructs = integrateStructs(transaction, store, ss);
      const pending = store.pendingStructs;
      if (pending) {
        for (const [client, clock] of pending.missing) {
          if (clock < getState(store, client)) {
            retry = true;
            break;
          }
        }
        if (restStructs) {
          for (const [client, clock] of restStructs.missing) {
            const mclock = pending.missing.get(client);
            if (mclock == null || mclock > clock) {
              pending.missing.set(client, clock);
            }
          }
          pending.update = mergeUpdatesV2([pending.update, restStructs.update]);
        }
      } else {
        store.pendingStructs = restStructs;
      }
      const dsRest = readAndApplyDeleteSet(structDecoder, transaction, store);
      if (store.pendingDs) {
        const pendingDSUpdate = new UpdateDecoderV2(createDecoder(store.pendingDs));
        readVarUint(pendingDSUpdate.restDecoder);
        const dsRest2 = readAndApplyDeleteSet(pendingDSUpdate, transaction, store);
        if (dsRest && dsRest2) {
          store.pendingDs = mergeUpdatesV2([dsRest, dsRest2]);
        } else {
          store.pendingDs = dsRest || dsRest2;
        }
      } else {
        store.pendingDs = dsRest;
      }
      if (retry) {
        const update = (
          /** @type {{update: Uint8Array}} */
          store.pendingStructs.update
        );
        store.pendingStructs = null;
        applyUpdateV2(transaction.doc, update);
      }
    }, transactionOrigin, false);
    readUpdate = (decoder, ydoc, transactionOrigin) => readUpdateV2(decoder, ydoc, transactionOrigin, new UpdateDecoderV1(decoder));
    applyUpdateV2 = (ydoc, update, transactionOrigin, YDecoder = UpdateDecoderV2) => {
      const decoder = createDecoder(update);
      readUpdateV2(decoder, ydoc, transactionOrigin, new YDecoder(decoder));
    };
    applyUpdate = (ydoc, update, transactionOrigin) => applyUpdateV2(ydoc, update, transactionOrigin, UpdateDecoderV1);
    writeStateAsUpdate = (encoder, doc2, targetStateVector = /* @__PURE__ */ new Map()) => {
      writeClientsStructs(encoder, doc2.store, targetStateVector);
      writeDeleteSet(encoder, createDeleteSetFromStructStore(doc2.store));
    };
    encodeStateAsUpdateV2 = (doc2, encodedTargetStateVector = new Uint8Array([0]), encoder = new UpdateEncoderV2()) => {
      const targetStateVector = decodeStateVector(encodedTargetStateVector);
      writeStateAsUpdate(encoder, doc2, targetStateVector);
      const updates = [encoder.toUint8Array()];
      if (doc2.store.pendingDs) {
        updates.push(doc2.store.pendingDs);
      }
      if (doc2.store.pendingStructs) {
        updates.push(diffUpdateV2(doc2.store.pendingStructs.update, encodedTargetStateVector));
      }
      if (updates.length > 1) {
        if (encoder.constructor === UpdateEncoderV1) {
          return mergeUpdates(updates.map((update, i) => i === 0 ? update : convertUpdateFormatV2ToV1(update)));
        } else if (encoder.constructor === UpdateEncoderV2) {
          return mergeUpdatesV2(updates);
        }
      }
      return updates[0];
    };
    encodeStateAsUpdate = (doc2, encodedTargetStateVector) => encodeStateAsUpdateV2(doc2, encodedTargetStateVector, new UpdateEncoderV1());
    readStateVector = (decoder) => {
      const ss = /* @__PURE__ */ new Map();
      const ssLength = readVarUint(decoder.restDecoder);
      for (let i = 0; i < ssLength; i++) {
        const client = readVarUint(decoder.restDecoder);
        const clock = readVarUint(decoder.restDecoder);
        ss.set(client, clock);
      }
      return ss;
    };
    decodeStateVector = (decodedState) => readStateVector(new DSDecoderV1(createDecoder(decodedState)));
    writeStateVector = (encoder, sv) => {
      writeVarUint(encoder.restEncoder, sv.size);
      from(sv.entries()).sort((a, b) => b[0] - a[0]).forEach(([client, clock]) => {
        writeVarUint(encoder.restEncoder, client);
        writeVarUint(encoder.restEncoder, clock);
      });
      return encoder;
    };
    writeDocumentStateVector = (encoder, doc2) => writeStateVector(encoder, getStateVector(doc2.store));
    encodeStateVectorV2 = (doc2, encoder = new DSEncoderV2()) => {
      if (doc2 instanceof Map) {
        writeStateVector(encoder, doc2);
      } else {
        writeDocumentStateVector(encoder, doc2);
      }
      return encoder.toUint8Array();
    };
    encodeStateVector = (doc2) => encodeStateVectorV2(doc2, new DSEncoderV1());
    EventHandler = class {
      constructor() {
        this.l = [];
      }
    };
    createEventHandler = () => new EventHandler();
    addEventHandlerListener = (eventHandler, f) => eventHandler.l.push(f);
    removeEventHandlerListener = (eventHandler, f) => {
      const l = eventHandler.l;
      const len = l.length;
      eventHandler.l = l.filter((g) => f !== g);
      if (len === eventHandler.l.length) {
        console.error("[yjs] Tried to remove event handler that doesn't exist.");
      }
    };
    callEventHandlerListeners = (eventHandler, arg0, arg1) => callAll(eventHandler.l, [arg0, arg1]);
    ID = class {
      /**
       * @param {number} client client id
       * @param {number} clock unique per client id, continuous number
       */
      constructor(client, clock) {
        this.client = client;
        this.clock = clock;
      }
    };
    compareIDs = (a, b) => a === b || a !== null && b !== null && a.client === b.client && a.clock === b.clock;
    createID = (client, clock) => new ID(client, clock);
    writeID = (encoder, id2) => {
      writeVarUint(encoder, id2.client);
      writeVarUint(encoder, id2.clock);
    };
    readID = (decoder) => createID(readVarUint(decoder), readVarUint(decoder));
    findRootTypeKey = (type) => {
      for (const [key, value] of type.doc.share.entries()) {
        if (value === type) {
          return key;
        }
      }
      throw unexpectedCase();
    };
    isParentOf = (parent, child) => {
      while (child !== null) {
        if (child.parent === parent) {
          return true;
        }
        child = /** @type {AbstractType<any>} */
        child.parent._item;
      }
      return false;
    };
    logType = (type) => {
      const res = [];
      let n = type._start;
      while (n) {
        res.push(n);
        n = n.right;
      }
      console.log("Children: ", res);
      console.log("Children content: ", res.filter((m) => !m.deleted).map((m) => m.content));
    };
    PermanentUserData = class {
      /**
       * @param {Doc} doc
       * @param {YMap<any>} [storeType]
       */
      constructor(doc2, storeType = doc2.getMap("users")) {
        const dss = /* @__PURE__ */ new Map();
        this.yusers = storeType;
        this.doc = doc2;
        this.clients = /* @__PURE__ */ new Map();
        this.dss = dss;
        const initUser = (user, userDescription) => {
          const ds = user.get("ds");
          const ids = user.get("ids");
          const addClientId = (
            /** @param {number} clientid */
            (clientid) => this.clients.set(clientid, userDescription)
          );
          ds.observe(
            /** @param {YArrayEvent<any>} event */
            (event) => {
              event.changes.added.forEach((item) => {
                item.content.getContent().forEach((encodedDs) => {
                  if (encodedDs instanceof Uint8Array) {
                    this.dss.set(userDescription, mergeDeleteSets([this.dss.get(userDescription) || createDeleteSet(), readDeleteSet(new DSDecoderV1(createDecoder(encodedDs)))]));
                  }
                });
              });
            }
          );
          this.dss.set(userDescription, mergeDeleteSets(ds.map((encodedDs) => readDeleteSet(new DSDecoderV1(createDecoder(encodedDs))))));
          ids.observe(
            /** @param {YArrayEvent<any>} event */
            (event) => event.changes.added.forEach((item) => item.content.getContent().forEach(addClientId))
          );
          ids.forEach(addClientId);
        };
        storeType.observe((event) => {
          event.keysChanged.forEach(
            (userDescription) => initUser(storeType.get(userDescription), userDescription)
          );
        });
        storeType.forEach(initUser);
      }
      /**
       * @param {Doc} doc
       * @param {number} clientid
       * @param {string} userDescription
       * @param {Object} conf
       * @param {function(Transaction, DeleteSet):boolean} [conf.filter]
       */
      setUserMapping(doc2, clientid, userDescription, { filter = () => true } = {}) {
        const users = this.yusers;
        let user = users.get(userDescription);
        if (!user) {
          user = new YMap();
          user.set("ids", new YArray());
          user.set("ds", new YArray());
          users.set(userDescription, user);
        }
        user.get("ids").push([clientid]);
        users.observe((_event) => {
          setTimeout(() => {
            const userOverwrite = users.get(userDescription);
            if (userOverwrite !== user) {
              user = userOverwrite;
              this.clients.forEach((_userDescription, clientid2) => {
                if (userDescription === _userDescription) {
                  user.get("ids").push([clientid2]);
                }
              });
              const encoder = new DSEncoderV1();
              const ds = this.dss.get(userDescription);
              if (ds) {
                writeDeleteSet(encoder, ds);
                user.get("ds").push([encoder.toUint8Array()]);
              }
            }
          }, 0);
        });
        doc2.on(
          "afterTransaction",
          /** @param {Transaction} transaction */
          (transaction) => {
            setTimeout(() => {
              const yds = user.get("ds");
              const ds = transaction.deleteSet;
              if (transaction.local && ds.clients.size > 0 && filter(transaction, ds)) {
                const encoder = new DSEncoderV1();
                writeDeleteSet(encoder, ds);
                yds.push([encoder.toUint8Array()]);
              }
            });
          }
        );
      }
      /**
       * @param {number} clientid
       * @return {any}
       */
      getUserByClientId(clientid) {
        return this.clients.get(clientid) || null;
      }
      /**
       * @param {ID} id
       * @return {string | null}
       */
      getUserByDeletedId(id2) {
        for (const [userDescription, ds] of this.dss.entries()) {
          if (isDeleted(ds, id2)) {
            return userDescription;
          }
        }
        return null;
      }
    };
    RelativePosition = class {
      /**
       * @param {ID|null} type
       * @param {string|null} tname
       * @param {ID|null} item
       * @param {number} assoc
       */
      constructor(type, tname, item, assoc = 0) {
        this.type = type;
        this.tname = tname;
        this.item = item;
        this.assoc = assoc;
      }
    };
    relativePositionToJSON = (rpos) => {
      const json = {};
      if (rpos.type) {
        json.type = rpos.type;
      }
      if (rpos.tname) {
        json.tname = rpos.tname;
      }
      if (rpos.item) {
        json.item = rpos.item;
      }
      if (rpos.assoc != null) {
        json.assoc = rpos.assoc;
      }
      return json;
    };
    createRelativePositionFromJSON = (json) => new RelativePosition(json.type == null ? null : createID(json.type.client, json.type.clock), json.tname ?? null, json.item == null ? null : createID(json.item.client, json.item.clock), json.assoc == null ? 0 : json.assoc);
    AbsolutePosition = class {
      /**
       * @param {AbstractType<any>} type
       * @param {number} index
       * @param {number} [assoc]
       */
      constructor(type, index, assoc = 0) {
        this.type = type;
        this.index = index;
        this.assoc = assoc;
      }
    };
    createAbsolutePosition = (type, index, assoc = 0) => new AbsolutePosition(type, index, assoc);
    createRelativePosition = (type, item, assoc) => {
      let typeid = null;
      let tname = null;
      if (type._item === null) {
        tname = findRootTypeKey(type);
      } else {
        typeid = createID(type._item.id.client, type._item.id.clock);
      }
      return new RelativePosition(typeid, tname, item, assoc);
    };
    createRelativePositionFromTypeIndex = (type, index, assoc = 0) => {
      let t = type._start;
      if (assoc < 0) {
        if (index === 0) {
          return createRelativePosition(type, null, assoc);
        }
        index--;
      }
      while (t !== null) {
        if (!t.deleted && t.countable) {
          if (t.length > index) {
            return createRelativePosition(type, createID(t.id.client, t.id.clock + index), assoc);
          }
          index -= t.length;
        }
        if (t.right === null && assoc < 0) {
          return createRelativePosition(type, t.lastId, assoc);
        }
        t = t.right;
      }
      return createRelativePosition(type, null, assoc);
    };
    writeRelativePosition = (encoder, rpos) => {
      const { type, tname, item, assoc } = rpos;
      if (item !== null) {
        writeVarUint(encoder, 0);
        writeID(encoder, item);
      } else if (tname !== null) {
        writeUint8(encoder, 1);
        writeVarString(encoder, tname);
      } else if (type !== null) {
        writeUint8(encoder, 2);
        writeID(encoder, type);
      } else {
        throw unexpectedCase();
      }
      writeVarInt(encoder, assoc);
      return encoder;
    };
    encodeRelativePosition = (rpos) => {
      const encoder = createEncoder();
      writeRelativePosition(encoder, rpos);
      return toUint8Array(encoder);
    };
    readRelativePosition = (decoder) => {
      let type = null;
      let tname = null;
      let itemID = null;
      switch (readVarUint(decoder)) {
        case 0:
          itemID = readID(decoder);
          break;
        case 1:
          tname = readVarString(decoder);
          break;
        case 2: {
          type = readID(decoder);
        }
      }
      const assoc = hasContent(decoder) ? readVarInt(decoder) : 0;
      return new RelativePosition(type, tname, itemID, assoc);
    };
    decodeRelativePosition = (uint8Array) => readRelativePosition(createDecoder(uint8Array));
    getItemWithOffset = (store, id2) => {
      const item = getItem(store, id2);
      const diff = id2.clock - item.id.clock;
      return {
        item,
        diff
      };
    };
    createAbsolutePositionFromRelativePosition = (rpos, doc2, followUndoneDeletions = true) => {
      const store = doc2.store;
      const rightID = rpos.item;
      const typeID = rpos.type;
      const tname = rpos.tname;
      const assoc = rpos.assoc;
      let type = null;
      let index = 0;
      if (rightID !== null) {
        if (getState(store, rightID.client) <= rightID.clock) {
          return null;
        }
        const res = followUndoneDeletions ? followRedone(store, rightID) : getItemWithOffset(store, rightID);
        const right = res.item;
        if (!(right instanceof Item)) {
          return null;
        }
        type = /** @type {AbstractType<any>} */
        right.parent;
        if (type._item === null || !type._item.deleted) {
          index = right.deleted || !right.countable ? 0 : res.diff + (assoc >= 0 ? 0 : 1);
          let n = right.left;
          while (n !== null) {
            if (!n.deleted && n.countable) {
              index += n.length;
            }
            n = n.left;
          }
        }
      } else {
        if (tname !== null) {
          type = doc2.get(tname);
        } else if (typeID !== null) {
          if (getState(store, typeID.client) <= typeID.clock) {
            return null;
          }
          const { item } = followUndoneDeletions ? followRedone(store, typeID) : { item: getItem(store, typeID) };
          if (item instanceof Item && item.content instanceof ContentType) {
            type = item.content.type;
          } else {
            return null;
          }
        } else {
          throw unexpectedCase();
        }
        if (assoc >= 0) {
          index = type._length;
        } else {
          index = 0;
        }
      }
      return createAbsolutePosition(type, index, rpos.assoc);
    };
    compareRelativePositions = (a, b) => a === b || a !== null && b !== null && a.tname === b.tname && compareIDs(a.item, b.item) && compareIDs(a.type, b.type) && a.assoc === b.assoc;
    Snapshot = class {
      /**
       * @param {DeleteSet} ds
       * @param {Map<number,number>} sv state map
       */
      constructor(ds, sv) {
        this.ds = ds;
        this.sv = sv;
      }
    };
    equalSnapshots = (snap1, snap2) => {
      const ds1 = snap1.ds.clients;
      const ds2 = snap2.ds.clients;
      const sv1 = snap1.sv;
      const sv2 = snap2.sv;
      if (sv1.size !== sv2.size || ds1.size !== ds2.size) {
        return false;
      }
      for (const [key, value] of sv1.entries()) {
        if (sv2.get(key) !== value) {
          return false;
        }
      }
      for (const [client, dsitems1] of ds1.entries()) {
        const dsitems2 = ds2.get(client) || [];
        if (dsitems1.length !== dsitems2.length) {
          return false;
        }
        for (let i = 0; i < dsitems1.length; i++) {
          const dsitem1 = dsitems1[i];
          const dsitem2 = dsitems2[i];
          if (dsitem1.clock !== dsitem2.clock || dsitem1.len !== dsitem2.len) {
            return false;
          }
        }
      }
      return true;
    };
    encodeSnapshotV2 = (snapshot2, encoder = new DSEncoderV2()) => {
      writeDeleteSet(encoder, snapshot2.ds);
      writeStateVector(encoder, snapshot2.sv);
      return encoder.toUint8Array();
    };
    encodeSnapshot = (snapshot2) => encodeSnapshotV2(snapshot2, new DSEncoderV1());
    decodeSnapshotV2 = (buf, decoder = new DSDecoderV2(createDecoder(buf))) => {
      return new Snapshot(readDeleteSet(decoder), readStateVector(decoder));
    };
    decodeSnapshot = (buf) => decodeSnapshotV2(buf, new DSDecoderV1(createDecoder(buf)));
    createSnapshot = (ds, sm) => new Snapshot(ds, sm);
    emptySnapshot = createSnapshot(createDeleteSet(), /* @__PURE__ */ new Map());
    snapshot = (doc2) => createSnapshot(createDeleteSetFromStructStore(doc2.store), getStateVector(doc2.store));
    isVisible = (item, snapshot2) => snapshot2 === void 0 ? !item.deleted : snapshot2.sv.has(item.id.client) && (snapshot2.sv.get(item.id.client) || 0) > item.id.clock && !isDeleted(snapshot2.ds, item.id);
    splitSnapshotAffectedStructs = (transaction, snapshot2) => {
      const meta = setIfUndefined(transaction.meta, splitSnapshotAffectedStructs, create2);
      const store = transaction.doc.store;
      if (!meta.has(snapshot2)) {
        snapshot2.sv.forEach((clock, client) => {
          if (clock < getState(store, client)) {
            getItemCleanStart(transaction, createID(client, clock));
          }
        });
        iterateDeletedStructs(transaction, snapshot2.ds, (_item) => {
        });
        meta.add(snapshot2);
      }
    };
    createDocFromSnapshot = (originDoc, snapshot2, newDoc = new Doc()) => {
      if (originDoc.gc) {
        throw new Error("Garbage-collection must be disabled in `originDoc`!");
      }
      const { sv, ds } = snapshot2;
      const encoder = new UpdateEncoderV2();
      originDoc.transact((transaction) => {
        let size2 = 0;
        sv.forEach((clock) => {
          if (clock > 0) {
            size2++;
          }
        });
        writeVarUint(encoder.restEncoder, size2);
        for (const [client, clock] of sv) {
          if (clock === 0) {
            continue;
          }
          if (clock < getState(originDoc.store, client)) {
            getItemCleanStart(transaction, createID(client, clock));
          }
          const structs = originDoc.store.clients.get(client) || [];
          const lastStructIndex = findIndexSS(structs, clock - 1);
          writeVarUint(encoder.restEncoder, lastStructIndex + 1);
          encoder.writeClient(client);
          writeVarUint(encoder.restEncoder, 0);
          for (let i = 0; i <= lastStructIndex; i++) {
            structs[i].write(encoder, 0);
          }
        }
        writeDeleteSet(encoder, ds);
      });
      applyUpdateV2(newDoc, encoder.toUint8Array(), "snapshot");
      return newDoc;
    };
    snapshotContainsUpdateV2 = (snapshot2, update, YDecoder = UpdateDecoderV2) => {
      const updateDecoder = new YDecoder(createDecoder(update));
      const lazyDecoder = new LazyStructReader(updateDecoder, false);
      for (let curr = lazyDecoder.curr; curr !== null; curr = lazyDecoder.next()) {
        if ((snapshot2.sv.get(curr.id.client) || 0) < curr.id.clock + curr.length) {
          return false;
        }
      }
      const mergedDS = mergeDeleteSets([snapshot2.ds, readDeleteSet(updateDecoder)]);
      return equalDeleteSets(snapshot2.ds, mergedDS);
    };
    snapshotContainsUpdate = (snapshot2, update) => snapshotContainsUpdateV2(snapshot2, update, UpdateDecoderV1);
    StructStore = class {
      constructor() {
        this.clients = /* @__PURE__ */ new Map();
        this.pendingStructs = null;
        this.pendingDs = null;
      }
    };
    getStateVector = (store) => {
      const sm = /* @__PURE__ */ new Map();
      store.clients.forEach((structs, client) => {
        const struct = structs[structs.length - 1];
        sm.set(client, struct.id.clock + struct.length);
      });
      return sm;
    };
    getState = (store, client) => {
      const structs = store.clients.get(client);
      if (structs === void 0) {
        return 0;
      }
      const lastStruct = structs[structs.length - 1];
      return lastStruct.id.clock + lastStruct.length;
    };
    addStruct = (store, struct) => {
      let structs = store.clients.get(struct.id.client);
      if (structs === void 0) {
        structs = [];
        store.clients.set(struct.id.client, structs);
      } else {
        const lastStruct = structs[structs.length - 1];
        if (lastStruct.id.clock + lastStruct.length !== struct.id.clock) {
          throw unexpectedCase();
        }
      }
      structs.push(struct);
    };
    findIndexSS = (structs, clock) => {
      let left = 0;
      let right = structs.length - 1;
      let mid = structs[right];
      let midclock = mid.id.clock;
      if (midclock === clock) {
        return right;
      }
      let midindex = floor(clock / (midclock + mid.length - 1) * right);
      while (left <= right) {
        mid = structs[midindex];
        midclock = mid.id.clock;
        if (midclock <= clock) {
          if (clock < midclock + mid.length) {
            return midindex;
          }
          left = midindex + 1;
        } else {
          right = midindex - 1;
        }
        midindex = floor((left + right) / 2);
      }
      throw unexpectedCase();
    };
    find = (store, id2) => {
      const structs = store.clients.get(id2.client);
      return structs[findIndexSS(structs, id2.clock)];
    };
    getItem = /** @type {function(StructStore,ID):Item} */
    find;
    findIndexCleanStart = (transaction, structs, clock) => {
      const index = findIndexSS(structs, clock);
      const struct = structs[index];
      if (struct.id.clock < clock && struct instanceof Item) {
        structs.splice(index + 1, 0, splitItem(transaction, struct, clock - struct.id.clock));
        return index + 1;
      }
      return index;
    };
    getItemCleanStart = (transaction, id2) => {
      const structs = (
        /** @type {Array<Item>} */
        transaction.doc.store.clients.get(id2.client)
      );
      return structs[findIndexCleanStart(transaction, structs, id2.clock)];
    };
    getItemCleanEnd = (transaction, store, id2) => {
      const structs = store.clients.get(id2.client);
      const index = findIndexSS(structs, id2.clock);
      const struct = structs[index];
      if (id2.clock !== struct.id.clock + struct.length - 1 && struct.constructor !== GC) {
        structs.splice(index + 1, 0, splitItem(transaction, struct, id2.clock - struct.id.clock + 1));
      }
      return struct;
    };
    replaceStruct = (store, struct, newStruct) => {
      const structs = (
        /** @type {Array<GC|Item>} */
        store.clients.get(struct.id.client)
      );
      structs[findIndexSS(structs, struct.id.clock)] = newStruct;
    };
    iterateStructs = (transaction, structs, clockStart, len, f) => {
      if (len === 0) {
        return;
      }
      const clockEnd = clockStart + len;
      let index = findIndexCleanStart(transaction, structs, clockStart);
      let struct;
      do {
        struct = structs[index++];
        if (clockEnd < struct.id.clock + struct.length) {
          findIndexCleanStart(transaction, structs, clockEnd);
        }
        f(struct);
      } while (index < structs.length && structs[index].id.clock < clockEnd);
    };
    Transaction = class {
      /**
       * @param {Doc} doc
       * @param {any} origin
       * @param {boolean} local
       */
      constructor(doc2, origin, local) {
        this.doc = doc2;
        this.deleteSet = new DeleteSet();
        this.beforeState = getStateVector(doc2.store);
        this.afterState = /* @__PURE__ */ new Map();
        this.changed = /* @__PURE__ */ new Map();
        this.changedParentTypes = /* @__PURE__ */ new Map();
        this._mergeStructs = [];
        this.origin = origin;
        this.meta = /* @__PURE__ */ new Map();
        this.local = local;
        this.subdocsAdded = /* @__PURE__ */ new Set();
        this.subdocsRemoved = /* @__PURE__ */ new Set();
        this.subdocsLoaded = /* @__PURE__ */ new Set();
        this._needFormattingCleanup = false;
      }
    };
    writeUpdateMessageFromTransaction = (encoder, transaction) => {
      if (transaction.deleteSet.clients.size === 0 && !any(transaction.afterState, (clock, client) => transaction.beforeState.get(client) !== clock)) {
        return false;
      }
      sortAndMergeDeleteSet(transaction.deleteSet);
      writeStructsFromTransaction(encoder, transaction);
      writeDeleteSet(encoder, transaction.deleteSet);
      return true;
    };
    addChangedTypeToTransaction = (transaction, type, parentSub) => {
      const item = type._item;
      if (item === null || item.id.clock < (transaction.beforeState.get(item.id.client) || 0) && !item.deleted) {
        setIfUndefined(transaction.changed, type, create2).add(parentSub);
      }
    };
    tryToMergeWithLefts = (structs, pos) => {
      let right = structs[pos];
      let left = structs[pos - 1];
      let i = pos;
      for (; i > 0; right = left, left = structs[--i - 1]) {
        if (left.deleted === right.deleted && left.constructor === right.constructor) {
          if (left.mergeWith(right)) {
            if (right instanceof Item && right.parentSub !== null && /** @type {AbstractType<any>} */
            right.parent._map.get(right.parentSub) === right) {
              right.parent._map.set(
                right.parentSub,
                /** @type {Item} */
                left
              );
            }
            continue;
          }
        }
        break;
      }
      const merged = pos - i;
      if (merged) {
        structs.splice(pos + 1 - merged, merged);
      }
      return merged;
    };
    tryGcDeleteSet = (ds, store, gcFilter) => {
      for (const [client, deleteItems] of ds.clients.entries()) {
        const structs = (
          /** @type {Array<GC|Item>} */
          store.clients.get(client)
        );
        for (let di = deleteItems.length - 1; di >= 0; di--) {
          const deleteItem = deleteItems[di];
          const endDeleteItemClock = deleteItem.clock + deleteItem.len;
          for (let si = findIndexSS(structs, deleteItem.clock), struct = structs[si]; si < structs.length && struct.id.clock < endDeleteItemClock; struct = structs[++si]) {
            const struct2 = structs[si];
            if (deleteItem.clock + deleteItem.len <= struct2.id.clock) {
              break;
            }
            if (struct2 instanceof Item && struct2.deleted && !struct2.keep && gcFilter(struct2)) {
              struct2.gc(store, false);
            }
          }
        }
      }
    };
    tryMergeDeleteSet = (ds, store) => {
      ds.clients.forEach((deleteItems, client) => {
        const structs = (
          /** @type {Array<GC|Item>} */
          store.clients.get(client)
        );
        for (let di = deleteItems.length - 1; di >= 0; di--) {
          const deleteItem = deleteItems[di];
          const mostRightIndexToCheck = min(structs.length - 1, 1 + findIndexSS(structs, deleteItem.clock + deleteItem.len - 1));
          for (let si = mostRightIndexToCheck, struct = structs[si]; si > 0 && struct.id.clock >= deleteItem.clock; struct = structs[si]) {
            si -= 1 + tryToMergeWithLefts(structs, si);
          }
        }
      });
    };
    tryGc = (ds, store, gcFilter) => {
      tryGcDeleteSet(ds, store, gcFilter);
      tryMergeDeleteSet(ds, store);
    };
    cleanupTransactions = (transactionCleanups, i) => {
      if (i < transactionCleanups.length) {
        const transaction = transactionCleanups[i];
        const doc2 = transaction.doc;
        const store = doc2.store;
        const ds = transaction.deleteSet;
        const mergeStructs = transaction._mergeStructs;
        try {
          sortAndMergeDeleteSet(ds);
          transaction.afterState = getStateVector(transaction.doc.store);
          doc2.emit("beforeObserverCalls", [transaction, doc2]);
          const fs = [];
          transaction.changed.forEach(
            (subs, itemtype) => fs.push(() => {
              if (itemtype._item === null || !itemtype._item.deleted) {
                itemtype._callObserver(transaction, subs);
              }
            })
          );
          fs.push(() => {
            transaction.changedParentTypes.forEach((events, type) => {
              if (type._dEH.l.length > 0 && (type._item === null || !type._item.deleted)) {
                events = events.filter(
                  (event) => event.target._item === null || !event.target._item.deleted
                );
                events.forEach((event) => {
                  event.currentTarget = type;
                  event._path = null;
                });
                events.sort((event1, event2) => event1.path.length - event2.path.length);
                fs.push(() => {
                  callEventHandlerListeners(type._dEH, events, transaction);
                });
              }
            });
            fs.push(() => doc2.emit("afterTransaction", [transaction, doc2]));
            fs.push(() => {
              if (transaction._needFormattingCleanup) {
                cleanupYTextAfterTransaction(transaction);
              }
            });
          });
          callAll(fs, []);
        } finally {
          if (doc2.gc) {
            tryGcDeleteSet(ds, store, doc2.gcFilter);
          }
          tryMergeDeleteSet(ds, store);
          transaction.afterState.forEach((clock, client) => {
            const beforeClock = transaction.beforeState.get(client) || 0;
            if (beforeClock !== clock) {
              const structs = (
                /** @type {Array<GC|Item>} */
                store.clients.get(client)
              );
              const firstChangePos = max(findIndexSS(structs, beforeClock), 1);
              for (let i2 = structs.length - 1; i2 >= firstChangePos; ) {
                i2 -= 1 + tryToMergeWithLefts(structs, i2);
              }
            }
          });
          for (let i2 = mergeStructs.length - 1; i2 >= 0; i2--) {
            const { client, clock } = mergeStructs[i2].id;
            const structs = (
              /** @type {Array<GC|Item>} */
              store.clients.get(client)
            );
            const replacedStructPos = findIndexSS(structs, clock);
            if (replacedStructPos + 1 < structs.length) {
              if (tryToMergeWithLefts(structs, replacedStructPos + 1) > 1) {
                continue;
              }
            }
            if (replacedStructPos > 0) {
              tryToMergeWithLefts(structs, replacedStructPos);
            }
          }
          if (!transaction.local && transaction.afterState.get(doc2.clientID) !== transaction.beforeState.get(doc2.clientID)) {
            print(ORANGE, BOLD, "[yjs] ", UNBOLD, RED, "Changed the client-id because another client seems to be using it.");
            doc2.clientID = generateNewClientId();
          }
          doc2.emit("afterTransactionCleanup", [transaction, doc2]);
          if (doc2._observers.has("update")) {
            const encoder = new UpdateEncoderV1();
            const hasContent2 = writeUpdateMessageFromTransaction(encoder, transaction);
            if (hasContent2) {
              doc2.emit("update", [encoder.toUint8Array(), transaction.origin, doc2, transaction]);
            }
          }
          if (doc2._observers.has("updateV2")) {
            const encoder = new UpdateEncoderV2();
            const hasContent2 = writeUpdateMessageFromTransaction(encoder, transaction);
            if (hasContent2) {
              doc2.emit("updateV2", [encoder.toUint8Array(), transaction.origin, doc2, transaction]);
            }
          }
          const { subdocsAdded, subdocsLoaded, subdocsRemoved } = transaction;
          if (subdocsAdded.size > 0 || subdocsRemoved.size > 0 || subdocsLoaded.size > 0) {
            subdocsAdded.forEach((subdoc) => {
              subdoc.clientID = doc2.clientID;
              if (subdoc.collectionid == null) {
                subdoc.collectionid = doc2.collectionid;
              }
              doc2.subdocs.add(subdoc);
            });
            subdocsRemoved.forEach((subdoc) => doc2.subdocs.delete(subdoc));
            doc2.emit("subdocs", [{ loaded: subdocsLoaded, added: subdocsAdded, removed: subdocsRemoved }, doc2, transaction]);
            subdocsRemoved.forEach((subdoc) => subdoc.destroy());
          }
          if (transactionCleanups.length <= i + 1) {
            doc2._transactionCleanups = [];
            doc2.emit("afterAllTransactions", [doc2, transactionCleanups]);
          } else {
            cleanupTransactions(transactionCleanups, i + 1);
          }
        }
      }
    };
    transact = (doc2, f, origin = null, local = true) => {
      const transactionCleanups = doc2._transactionCleanups;
      let initialCall = false;
      let result = null;
      if (doc2._transaction === null) {
        initialCall = true;
        doc2._transaction = new Transaction(doc2, origin, local);
        transactionCleanups.push(doc2._transaction);
        if (transactionCleanups.length === 1) {
          doc2.emit("beforeAllTransactions", [doc2]);
        }
        doc2.emit("beforeTransaction", [doc2._transaction, doc2]);
      }
      try {
        result = f(doc2._transaction);
      } finally {
        if (initialCall) {
          const finishCleanup = doc2._transaction === transactionCleanups[0];
          doc2._transaction = null;
          if (finishCleanup) {
            cleanupTransactions(transactionCleanups, 0);
          }
        }
      }
      return result;
    };
    StackItem = class {
      /**
       * @param {DeleteSet} deletions
       * @param {DeleteSet} insertions
       */
      constructor(deletions, insertions) {
        this.insertions = insertions;
        this.deletions = deletions;
        this.meta = /* @__PURE__ */ new Map();
      }
    };
    clearUndoManagerStackItem = (tr, um, stackItem) => {
      iterateDeletedStructs(tr, stackItem.deletions, (item) => {
        if (item instanceof Item && um.scope.some((type) => type === tr.doc || isParentOf(
          /** @type {AbstractType<any>} */
          type,
          item
        ))) {
          keepItem(item, false);
        }
      });
    };
    popStackItem = (undoManager, stack, eventType) => {
      let _tr = null;
      const doc2 = undoManager.doc;
      const scope = undoManager.scope;
      transact(doc2, (transaction) => {
        while (stack.length > 0 && undoManager.currStackItem === null) {
          const store = doc2.store;
          const stackItem = (
            /** @type {StackItem} */
            stack.pop()
          );
          const itemsToRedo = /* @__PURE__ */ new Set();
          const itemsToDelete = [];
          let performedChange = false;
          iterateDeletedStructs(transaction, stackItem.insertions, (struct) => {
            if (struct instanceof Item) {
              if (struct.redone !== null) {
                let { item, diff } = followRedone(store, struct.id);
                if (diff > 0) {
                  item = getItemCleanStart(transaction, createID(item.id.client, item.id.clock + diff));
                }
                struct = item;
              }
              if (!struct.deleted && scope.some((type) => type === transaction.doc || isParentOf(
                /** @type {AbstractType<any>} */
                type,
                /** @type {Item} */
                struct
              ))) {
                itemsToDelete.push(struct);
              }
            }
          });
          iterateDeletedStructs(transaction, stackItem.deletions, (struct) => {
            if (struct instanceof Item && scope.some((type) => type === transaction.doc || isParentOf(
              /** @type {AbstractType<any>} */
              type,
              struct
            )) && // Never redo structs in stackItem.insertions because they were created and deleted in the same capture interval.
            !isDeleted(stackItem.insertions, struct.id)) {
              itemsToRedo.add(struct);
            }
          });
          itemsToRedo.forEach((struct) => {
            performedChange = redoItem(transaction, struct, itemsToRedo, stackItem.insertions, undoManager.ignoreRemoteMapChanges, undoManager) !== null || performedChange;
          });
          for (let i = itemsToDelete.length - 1; i >= 0; i--) {
            const item = itemsToDelete[i];
            if (undoManager.deleteFilter(item)) {
              item.delete(transaction);
              performedChange = true;
            }
          }
          undoManager.currStackItem = performedChange ? stackItem : null;
        }
        transaction.changed.forEach((subProps, type) => {
          if (subProps.has(null) && type._searchMarker) {
            type._searchMarker.length = 0;
          }
        });
        _tr = transaction;
      }, undoManager);
      const res = undoManager.currStackItem;
      if (res != null) {
        const changedParentTypes = _tr.changedParentTypes;
        undoManager.emit("stack-item-popped", [{ stackItem: res, type: eventType, changedParentTypes, origin: undoManager }, undoManager]);
        undoManager.currStackItem = null;
      }
      return res;
    };
    UndoManager = class extends ObservableV2 {
      /**
       * @param {Doc|AbstractType<any>|Array<AbstractType<any>>} typeScope Limits the scope of the UndoManager. If this is set to a ydoc instance, all changes on that ydoc will be undone. If set to a specific type, only changes on that type or its children will be undone. Also accepts an array of types.
       * @param {UndoManagerOptions} options
       */
      constructor(typeScope, {
        captureTimeout = 500,
        captureTransaction = (_tr) => true,
        deleteFilter = () => true,
        trackedOrigins = /* @__PURE__ */ new Set([null]),
        ignoreRemoteMapChanges = false,
        doc: doc2 = (
          /** @type {Doc} */
          isArray(typeScope) ? typeScope[0].doc : typeScope instanceof Doc ? typeScope : typeScope.doc
        )
      } = {}) {
        super();
        this.scope = [];
        this.doc = doc2;
        this.addToScope(typeScope);
        this.deleteFilter = deleteFilter;
        trackedOrigins.add(this);
        this.trackedOrigins = trackedOrigins;
        this.captureTransaction = captureTransaction;
        this.undoStack = [];
        this.redoStack = [];
        this.undoing = false;
        this.redoing = false;
        this.currStackItem = null;
        this.lastChange = 0;
        this.ignoreRemoteMapChanges = ignoreRemoteMapChanges;
        this.captureTimeout = captureTimeout;
        this.afterTransactionHandler = (transaction) => {
          if (!this.captureTransaction(transaction) || !this.scope.some((type) => transaction.changedParentTypes.has(
            /** @type {AbstractType<any>} */
            type
          ) || type === this.doc) || !this.trackedOrigins.has(transaction.origin) && (!transaction.origin || !this.trackedOrigins.has(transaction.origin.constructor))) {
            return;
          }
          const undoing = this.undoing;
          const redoing = this.redoing;
          const stack = undoing ? this.redoStack : this.undoStack;
          if (undoing) {
            this.stopCapturing();
          } else if (!redoing) {
            this.clear(false, true);
          }
          const insertions = new DeleteSet();
          transaction.afterState.forEach((endClock, client) => {
            const startClock = transaction.beforeState.get(client) || 0;
            const len = endClock - startClock;
            if (len > 0) {
              addToDeleteSet(insertions, client, startClock, len);
            }
          });
          const now = getUnixTime();
          let didAdd = false;
          if (this.lastChange > 0 && now - this.lastChange < this.captureTimeout && stack.length > 0 && !undoing && !redoing) {
            const lastOp = stack[stack.length - 1];
            lastOp.deletions = mergeDeleteSets([lastOp.deletions, transaction.deleteSet]);
            lastOp.insertions = mergeDeleteSets([lastOp.insertions, insertions]);
          } else {
            stack.push(new StackItem(transaction.deleteSet, insertions));
            didAdd = true;
          }
          if (!undoing && !redoing) {
            this.lastChange = now;
          }
          iterateDeletedStructs(
            transaction,
            transaction.deleteSet,
            /** @param {Item|GC} item */
            (item) => {
              if (item instanceof Item && this.scope.some((type) => type === transaction.doc || isParentOf(
                /** @type {AbstractType<any>} */
                type,
                item
              ))) {
                keepItem(item, true);
              }
            }
          );
          const changeEvent = [{ stackItem: stack[stack.length - 1], origin: transaction.origin, type: undoing ? "redo" : "undo", changedParentTypes: transaction.changedParentTypes }, this];
          if (didAdd) {
            this.emit("stack-item-added", changeEvent);
          } else {
            this.emit("stack-item-updated", changeEvent);
          }
        };
        this.doc.on("afterTransaction", this.afterTransactionHandler);
        this.doc.on("destroy", () => {
          this.destroy();
        });
      }
      /**
       * Extend the scope.
       *
       * @param {Array<AbstractType<any> | Doc> | AbstractType<any> | Doc} ytypes
       */
      addToScope(ytypes) {
        const tmpSet = new Set(this.scope);
        ytypes = isArray(ytypes) ? ytypes : [ytypes];
        ytypes.forEach((ytype) => {
          if (!tmpSet.has(ytype)) {
            tmpSet.add(ytype);
            if (ytype instanceof AbstractType ? ytype.doc !== this.doc : ytype !== this.doc) warn("[yjs#509] Not same Y.Doc");
            this.scope.push(ytype);
          }
        });
      }
      /**
       * @param {any} origin
       */
      addTrackedOrigin(origin) {
        this.trackedOrigins.add(origin);
      }
      /**
       * @param {any} origin
       */
      removeTrackedOrigin(origin) {
        this.trackedOrigins.delete(origin);
      }
      clear(clearUndoStack = true, clearRedoStack = true) {
        if (clearUndoStack && this.canUndo() || clearRedoStack && this.canRedo()) {
          this.doc.transact((tr) => {
            if (clearUndoStack) {
              this.undoStack.forEach((item) => clearUndoManagerStackItem(tr, this, item));
              this.undoStack = [];
            }
            if (clearRedoStack) {
              this.redoStack.forEach((item) => clearUndoManagerStackItem(tr, this, item));
              this.redoStack = [];
            }
            this.emit("stack-cleared", [{ undoStackCleared: clearUndoStack, redoStackCleared: clearRedoStack }]);
          });
        }
      }
      /**
       * UndoManager merges Undo-StackItem if they are created within time-gap
       * smaller than `options.captureTimeout`. Call `um.stopCapturing()` so that the next
       * StackItem won't be merged.
       *
       *
       * @example
       *     // without stopCapturing
       *     ytext.insert(0, 'a')
       *     ytext.insert(1, 'b')
       *     um.undo()
       *     ytext.toString() // => '' (note that 'ab' was removed)
       *     // with stopCapturing
       *     ytext.insert(0, 'a')
       *     um.stopCapturing()
       *     ytext.insert(0, 'b')
       *     um.undo()
       *     ytext.toString() // => 'a' (note that only 'b' was removed)
       *
       */
      stopCapturing() {
        this.lastChange = 0;
      }
      /**
       * Undo last changes on type.
       *
       * @return {StackItem?} Returns StackItem if a change was applied
       */
      undo() {
        this.undoing = true;
        let res;
        try {
          res = popStackItem(this, this.undoStack, "undo");
        } finally {
          this.undoing = false;
        }
        return res;
      }
      /**
       * Redo last undo operation.
       *
       * @return {StackItem?} Returns StackItem if a change was applied
       */
      redo() {
        this.redoing = true;
        let res;
        try {
          res = popStackItem(this, this.redoStack, "redo");
        } finally {
          this.redoing = false;
        }
        return res;
      }
      /**
       * Are undo steps available?
       *
       * @return {boolean} `true` if undo is possible
       */
      canUndo() {
        return this.undoStack.length > 0;
      }
      /**
       * Are redo steps available?
       *
       * @return {boolean} `true` if redo is possible
       */
      canRedo() {
        return this.redoStack.length > 0;
      }
      destroy() {
        this.trackedOrigins.delete(this);
        this.doc.off("afterTransaction", this.afterTransactionHandler);
        super.destroy();
      }
    };
    LazyStructReader = class {
      /**
       * @param {UpdateDecoderV1 | UpdateDecoderV2} decoder
       * @param {boolean} filterSkips
       */
      constructor(decoder, filterSkips) {
        this.gen = lazyStructReaderGenerator(decoder);
        this.curr = null;
        this.done = false;
        this.filterSkips = filterSkips;
        this.next();
      }
      /**
       * @return {Item | GC | Skip |null}
       */
      next() {
        do {
          this.curr = this.gen.next().value || null;
        } while (this.filterSkips && this.curr !== null && this.curr.constructor === Skip);
        return this.curr;
      }
    };
    logUpdate = (update) => logUpdateV2(update, UpdateDecoderV1);
    logUpdateV2 = (update, YDecoder = UpdateDecoderV2) => {
      const structs = [];
      const updateDecoder = new YDecoder(createDecoder(update));
      const lazyDecoder = new LazyStructReader(updateDecoder, false);
      for (let curr = lazyDecoder.curr; curr !== null; curr = lazyDecoder.next()) {
        structs.push(curr);
      }
      print("Structs: ", structs);
      const ds = readDeleteSet(updateDecoder);
      print("DeleteSet: ", ds);
    };
    decodeUpdate = (update) => decodeUpdateV2(update, UpdateDecoderV1);
    decodeUpdateV2 = (update, YDecoder = UpdateDecoderV2) => {
      const structs = [];
      const updateDecoder = new YDecoder(createDecoder(update));
      const lazyDecoder = new LazyStructReader(updateDecoder, false);
      for (let curr = lazyDecoder.curr; curr !== null; curr = lazyDecoder.next()) {
        structs.push(curr);
      }
      return {
        structs,
        ds: readDeleteSet(updateDecoder)
      };
    };
    LazyStructWriter = class {
      /**
       * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder
       */
      constructor(encoder) {
        this.currClient = 0;
        this.startClock = 0;
        this.written = 0;
        this.encoder = encoder;
        this.clientStructs = [];
      }
    };
    mergeUpdates = (updates) => mergeUpdatesV2(updates, UpdateDecoderV1, UpdateEncoderV1);
    encodeStateVectorFromUpdateV2 = (update, YEncoder = DSEncoderV2, YDecoder = UpdateDecoderV2) => {
      const encoder = new YEncoder();
      const updateDecoder = new LazyStructReader(new YDecoder(createDecoder(update)), false);
      let curr = updateDecoder.curr;
      if (curr !== null) {
        let size2 = 0;
        let currClient = curr.id.client;
        let stopCounting = curr.id.clock !== 0;
        let currClock = stopCounting ? 0 : curr.id.clock + curr.length;
        for (; curr !== null; curr = updateDecoder.next()) {
          if (currClient !== curr.id.client) {
            if (currClock !== 0) {
              size2++;
              writeVarUint(encoder.restEncoder, currClient);
              writeVarUint(encoder.restEncoder, currClock);
            }
            currClient = curr.id.client;
            currClock = 0;
            stopCounting = curr.id.clock !== 0;
          }
          if (curr.constructor === Skip) {
            stopCounting = true;
          }
          if (!stopCounting) {
            currClock = curr.id.clock + curr.length;
          }
        }
        if (currClock !== 0) {
          size2++;
          writeVarUint(encoder.restEncoder, currClient);
          writeVarUint(encoder.restEncoder, currClock);
        }
        const enc = createEncoder();
        writeVarUint(enc, size2);
        writeBinaryEncoder(enc, encoder.restEncoder);
        encoder.restEncoder = enc;
        return encoder.toUint8Array();
      } else {
        writeVarUint(encoder.restEncoder, 0);
        return encoder.toUint8Array();
      }
    };
    encodeStateVectorFromUpdate = (update) => encodeStateVectorFromUpdateV2(update, DSEncoderV1, UpdateDecoderV1);
    parseUpdateMetaV2 = (update, YDecoder = UpdateDecoderV2) => {
      const from2 = /* @__PURE__ */ new Map();
      const to = /* @__PURE__ */ new Map();
      const updateDecoder = new LazyStructReader(new YDecoder(createDecoder(update)), false);
      let curr = updateDecoder.curr;
      if (curr !== null) {
        let currClient = curr.id.client;
        let currClock = curr.id.clock;
        from2.set(currClient, currClock);
        for (; curr !== null; curr = updateDecoder.next()) {
          if (currClient !== curr.id.client) {
            to.set(currClient, currClock);
            from2.set(curr.id.client, curr.id.clock);
            currClient = curr.id.client;
          }
          currClock = curr.id.clock + curr.length;
        }
        to.set(currClient, currClock);
      }
      return { from: from2, to };
    };
    parseUpdateMeta = (update) => parseUpdateMetaV2(update, UpdateDecoderV1);
    sliceStruct = (left, diff) => {
      if (left.constructor === GC) {
        const { client, clock } = left.id;
        return new GC(createID(client, clock + diff), left.length - diff);
      } else if (left.constructor === Skip) {
        const { client, clock } = left.id;
        return new Skip(createID(client, clock + diff), left.length - diff);
      } else {
        const leftItem = (
          /** @type {Item} */
          left
        );
        const { client, clock } = leftItem.id;
        return new Item(
          createID(client, clock + diff),
          null,
          createID(client, clock + diff - 1),
          null,
          leftItem.rightOrigin,
          leftItem.parent,
          leftItem.parentSub,
          leftItem.content.splice(diff)
        );
      }
    };
    mergeUpdatesV2 = (updates, YDecoder = UpdateDecoderV2, YEncoder = UpdateEncoderV2) => {
      if (updates.length === 1) {
        return updates[0];
      }
      const updateDecoders = updates.map((update) => new YDecoder(createDecoder(update)));
      let lazyStructDecoders = updateDecoders.map((decoder) => new LazyStructReader(decoder, true));
      let currWrite = null;
      const updateEncoder = new YEncoder();
      const lazyStructEncoder = new LazyStructWriter(updateEncoder);
      while (true) {
        lazyStructDecoders = lazyStructDecoders.filter((dec) => dec.curr !== null);
        lazyStructDecoders.sort(
          /** @type {function(any,any):number} */
          (dec1, dec2) => {
            if (dec1.curr.id.client === dec2.curr.id.client) {
              const clockDiff = dec1.curr.id.clock - dec2.curr.id.clock;
              if (clockDiff === 0) {
                return dec1.curr.constructor === dec2.curr.constructor ? 0 : dec1.curr.constructor === Skip ? 1 : -1;
              } else {
                return clockDiff;
              }
            } else {
              return dec2.curr.id.client - dec1.curr.id.client;
            }
          }
        );
        if (lazyStructDecoders.length === 0) {
          break;
        }
        const currDecoder = lazyStructDecoders[0];
        const firstClient = (
          /** @type {Item | GC} */
          currDecoder.curr.id.client
        );
        if (currWrite !== null) {
          let curr = (
            /** @type {Item | GC | null} */
            currDecoder.curr
          );
          let iterated = false;
          while (curr !== null && curr.id.clock + curr.length <= currWrite.struct.id.clock + currWrite.struct.length && curr.id.client >= currWrite.struct.id.client) {
            curr = currDecoder.next();
            iterated = true;
          }
          if (curr === null || // current decoder is empty
          curr.id.client !== firstClient || // check whether there is another decoder that has has updates from `firstClient`
          iterated && curr.id.clock > currWrite.struct.id.clock + currWrite.struct.length) {
            continue;
          }
          if (firstClient !== currWrite.struct.id.client) {
            writeStructToLazyStructWriter(lazyStructEncoder, currWrite.struct, currWrite.offset);
            currWrite = { struct: curr, offset: 0 };
            currDecoder.next();
          } else {
            if (currWrite.struct.id.clock + currWrite.struct.length < curr.id.clock) {
              if (currWrite.struct.constructor === Skip) {
                currWrite.struct.length = curr.id.clock + curr.length - currWrite.struct.id.clock;
              } else {
                writeStructToLazyStructWriter(lazyStructEncoder, currWrite.struct, currWrite.offset);
                const diff = curr.id.clock - currWrite.struct.id.clock - currWrite.struct.length;
                const struct = new Skip(createID(firstClient, currWrite.struct.id.clock + currWrite.struct.length), diff);
                currWrite = { struct, offset: 0 };
              }
            } else {
              const diff = currWrite.struct.id.clock + currWrite.struct.length - curr.id.clock;
              if (diff > 0) {
                if (currWrite.struct.constructor === Skip) {
                  currWrite.struct.length -= diff;
                } else {
                  curr = sliceStruct(curr, diff);
                }
              }
              if (!currWrite.struct.mergeWith(
                /** @type {any} */
                curr
              )) {
                writeStructToLazyStructWriter(lazyStructEncoder, currWrite.struct, currWrite.offset);
                currWrite = { struct: curr, offset: 0 };
                currDecoder.next();
              }
            }
          }
        } else {
          currWrite = { struct: (
            /** @type {Item | GC} */
            currDecoder.curr
          ), offset: 0 };
          currDecoder.next();
        }
        for (let next = currDecoder.curr; next !== null && next.id.client === firstClient && next.id.clock === currWrite.struct.id.clock + currWrite.struct.length && next.constructor !== Skip; next = currDecoder.next()) {
          writeStructToLazyStructWriter(lazyStructEncoder, currWrite.struct, currWrite.offset);
          currWrite = { struct: next, offset: 0 };
        }
      }
      if (currWrite !== null) {
        writeStructToLazyStructWriter(lazyStructEncoder, currWrite.struct, currWrite.offset);
        currWrite = null;
      }
      finishLazyStructWriting(lazyStructEncoder);
      const dss = updateDecoders.map((decoder) => readDeleteSet(decoder));
      const ds = mergeDeleteSets(dss);
      writeDeleteSet(updateEncoder, ds);
      return updateEncoder.toUint8Array();
    };
    diffUpdateV2 = (update, sv, YDecoder = UpdateDecoderV2, YEncoder = UpdateEncoderV2) => {
      const state = decodeStateVector(sv);
      const encoder = new YEncoder();
      const lazyStructWriter = new LazyStructWriter(encoder);
      const decoder = new YDecoder(createDecoder(update));
      const reader = new LazyStructReader(decoder, false);
      while (reader.curr) {
        const curr = reader.curr;
        const currClient = curr.id.client;
        const svClock = state.get(currClient) || 0;
        if (reader.curr.constructor === Skip) {
          reader.next();
          continue;
        }
        if (curr.id.clock + curr.length > svClock) {
          writeStructToLazyStructWriter(lazyStructWriter, curr, max(svClock - curr.id.clock, 0));
          reader.next();
          while (reader.curr && reader.curr.id.client === currClient) {
            writeStructToLazyStructWriter(lazyStructWriter, reader.curr, 0);
            reader.next();
          }
        } else {
          while (reader.curr && reader.curr.id.client === currClient && reader.curr.id.clock + reader.curr.length <= svClock) {
            reader.next();
          }
        }
      }
      finishLazyStructWriting(lazyStructWriter);
      const ds = readDeleteSet(decoder);
      writeDeleteSet(encoder, ds);
      return encoder.toUint8Array();
    };
    diffUpdate = (update, sv) => diffUpdateV2(update, sv, UpdateDecoderV1, UpdateEncoderV1);
    flushLazyStructWriter = (lazyWriter) => {
      if (lazyWriter.written > 0) {
        lazyWriter.clientStructs.push({ written: lazyWriter.written, restEncoder: toUint8Array(lazyWriter.encoder.restEncoder) });
        lazyWriter.encoder.restEncoder = createEncoder();
        lazyWriter.written = 0;
      }
    };
    writeStructToLazyStructWriter = (lazyWriter, struct, offset) => {
      if (lazyWriter.written > 0 && lazyWriter.currClient !== struct.id.client) {
        flushLazyStructWriter(lazyWriter);
      }
      if (lazyWriter.written === 0) {
        lazyWriter.currClient = struct.id.client;
        lazyWriter.encoder.writeClient(struct.id.client);
        writeVarUint(lazyWriter.encoder.restEncoder, struct.id.clock + offset);
      }
      struct.write(lazyWriter.encoder, offset);
      lazyWriter.written++;
    };
    finishLazyStructWriting = (lazyWriter) => {
      flushLazyStructWriter(lazyWriter);
      const restEncoder = lazyWriter.encoder.restEncoder;
      writeVarUint(restEncoder, lazyWriter.clientStructs.length);
      for (let i = 0; i < lazyWriter.clientStructs.length; i++) {
        const partStructs = lazyWriter.clientStructs[i];
        writeVarUint(restEncoder, partStructs.written);
        writeUint8Array(restEncoder, partStructs.restEncoder);
      }
    };
    convertUpdateFormat = (update, blockTransformer, YDecoder, YEncoder) => {
      const updateDecoder = new YDecoder(createDecoder(update));
      const lazyDecoder = new LazyStructReader(updateDecoder, false);
      const updateEncoder = new YEncoder();
      const lazyWriter = new LazyStructWriter(updateEncoder);
      for (let curr = lazyDecoder.curr; curr !== null; curr = lazyDecoder.next()) {
        writeStructToLazyStructWriter(lazyWriter, blockTransformer(curr), 0);
      }
      finishLazyStructWriting(lazyWriter);
      const ds = readDeleteSet(updateDecoder);
      writeDeleteSet(updateEncoder, ds);
      return updateEncoder.toUint8Array();
    };
    createObfuscator = ({ formatting = true, subdocs = true, yxml = true } = {}) => {
      let i = 0;
      const mapKeyCache = create();
      const nodeNameCache = create();
      const formattingKeyCache = create();
      const formattingValueCache = create();
      formattingValueCache.set(null, null);
      return (block) => {
        switch (block.constructor) {
          case GC:
          case Skip:
            return block;
          case Item: {
            const item = (
              /** @type {Item} */
              block
            );
            const content = item.content;
            switch (content.constructor) {
              case ContentDeleted:
                break;
              case ContentType: {
                if (yxml) {
                  const type = (
                    /** @type {ContentType} */
                    content.type
                  );
                  if (type instanceof YXmlElement) {
                    type.nodeName = setIfUndefined(nodeNameCache, type.nodeName, () => "node-" + i);
                  }
                  if (type instanceof YXmlHook) {
                    type.hookName = setIfUndefined(nodeNameCache, type.hookName, () => "hook-" + i);
                  }
                }
                break;
              }
              case ContentAny: {
                const c = (
                  /** @type {ContentAny} */
                  content
                );
                c.arr = c.arr.map(() => i);
                break;
              }
              case ContentBinary: {
                const c = (
                  /** @type {ContentBinary} */
                  content
                );
                c.content = new Uint8Array([i]);
                break;
              }
              case ContentDoc: {
                const c = (
                  /** @type {ContentDoc} */
                  content
                );
                if (subdocs) {
                  c.opts = {};
                  c.doc.guid = i + "";
                }
                break;
              }
              case ContentEmbed: {
                const c = (
                  /** @type {ContentEmbed} */
                  content
                );
                c.embed = {};
                break;
              }
              case ContentFormat: {
                const c = (
                  /** @type {ContentFormat} */
                  content
                );
                if (formatting) {
                  c.key = setIfUndefined(formattingKeyCache, c.key, () => i + "");
                  c.value = setIfUndefined(formattingValueCache, c.value, () => ({ i }));
                }
                break;
              }
              case ContentJSON: {
                const c = (
                  /** @type {ContentJSON} */
                  content
                );
                c.arr = c.arr.map(() => i);
                break;
              }
              case ContentString: {
                const c = (
                  /** @type {ContentString} */
                  content
                );
                c.str = repeat(i % 10 + "", c.str.length);
                break;
              }
              default:
                unexpectedCase();
            }
            if (item.parentSub) {
              item.parentSub = setIfUndefined(mapKeyCache, item.parentSub, () => i + "");
            }
            i++;
            return block;
          }
          default:
            unexpectedCase();
        }
      };
    };
    obfuscateUpdate = (update, opts) => convertUpdateFormat(update, createObfuscator(opts), UpdateDecoderV1, UpdateEncoderV1);
    obfuscateUpdateV2 = (update, opts) => convertUpdateFormat(update, createObfuscator(opts), UpdateDecoderV2, UpdateEncoderV2);
    convertUpdateFormatV1ToV2 = (update) => convertUpdateFormat(update, id, UpdateDecoderV1, UpdateEncoderV2);
    convertUpdateFormatV2ToV1 = (update) => convertUpdateFormat(update, id, UpdateDecoderV2, UpdateEncoderV1);
    errorComputeChanges = "You must not compute changes after the event-handler fired.";
    YEvent = class {
      /**
       * @param {T} target The changed type.
       * @param {Transaction} transaction
       */
      constructor(target, transaction) {
        this.target = target;
        this.currentTarget = target;
        this.transaction = transaction;
        this._changes = null;
        this._keys = null;
        this._delta = null;
        this._path = null;
      }
      /**
       * Computes the path from `y` to the changed type.
       *
       * @todo v14 should standardize on path: Array<{parent, index}> because that is easier to work with.
       *
       * The following property holds:
       * @example
       *   let type = y
       *   event.path.forEach(dir => {
       *     type = type.get(dir)
       *   })
       *   type === event.target // => true
       */
      get path() {
        return this._path || (this._path = getPathTo(this.currentTarget, this.target));
      }
      /**
       * Check if a struct is deleted by this event.
       *
       * In contrast to change.deleted, this method also returns true if the struct was added and then deleted.
       *
       * @param {AbstractStruct} struct
       * @return {boolean}
       */
      deletes(struct) {
        return isDeleted(this.transaction.deleteSet, struct.id);
      }
      /**
       * @type {Map<string, { action: 'add' | 'update' | 'delete', oldValue: any }>}
       */
      get keys() {
        if (this._keys === null) {
          if (this.transaction.doc._transactionCleanups.length === 0) {
            throw create3(errorComputeChanges);
          }
          const keys2 = /* @__PURE__ */ new Map();
          const target = this.target;
          const changed = (
            /** @type Set<string|null> */
            this.transaction.changed.get(target)
          );
          changed.forEach((key) => {
            if (key !== null) {
              const item = (
                /** @type {Item} */
                target._map.get(key)
              );
              let action;
              let oldValue;
              if (this.adds(item)) {
                let prev = item.left;
                while (prev !== null && this.adds(prev)) {
                  prev = prev.left;
                }
                if (this.deletes(item)) {
                  if (prev !== null && this.deletes(prev)) {
                    action = "delete";
                    oldValue = last(prev.content.getContent());
                  } else {
                    return;
                  }
                } else {
                  if (prev !== null && this.deletes(prev)) {
                    action = "update";
                    oldValue = last(prev.content.getContent());
                  } else {
                    action = "add";
                    oldValue = void 0;
                  }
                }
              } else {
                if (this.deletes(item)) {
                  action = "delete";
                  oldValue = last(
                    /** @type {Item} */
                    item.content.getContent()
                  );
                } else {
                  return;
                }
              }
              keys2.set(key, { action, oldValue });
            }
          });
          this._keys = keys2;
        }
        return this._keys;
      }
      /**
       * This is a computed property. Note that this can only be safely computed during the
       * event call. Computing this property after other changes happened might result in
       * unexpected behavior (incorrect computation of deltas). A safe way to collect changes
       * is to store the `changes` or the `delta` object. Avoid storing the `transaction` object.
       *
       * @type {Array<{insert?: string | Array<any> | object | AbstractType<any>, retain?: number, delete?: number, attributes?: Object<string, any>}>}
       */
      get delta() {
        return this.changes.delta;
      }
      /**
       * Check if a struct is added by this event.
       *
       * In contrast to change.deleted, this method also returns true if the struct was added and then deleted.
       *
       * @param {AbstractStruct} struct
       * @return {boolean}
       */
      adds(struct) {
        return struct.id.clock >= (this.transaction.beforeState.get(struct.id.client) || 0);
      }
      /**
       * This is a computed property. Note that this can only be safely computed during the
       * event call. Computing this property after other changes happened might result in
       * unexpected behavior (incorrect computation of deltas). A safe way to collect changes
       * is to store the `changes` or the `delta` object. Avoid storing the `transaction` object.
       *
       * @type {{added:Set<Item>,deleted:Set<Item>,keys:Map<string,{action:'add'|'update'|'delete',oldValue:any}>,delta:Array<{insert?:Array<any>|string, delete?:number, retain?:number}>}}
       */
      get changes() {
        let changes = this._changes;
        if (changes === null) {
          if (this.transaction.doc._transactionCleanups.length === 0) {
            throw create3(errorComputeChanges);
          }
          const target = this.target;
          const added = create2();
          const deleted = create2();
          const delta = [];
          changes = {
            added,
            deleted,
            delta,
            keys: this.keys
          };
          const changed = (
            /** @type Set<string|null> */
            this.transaction.changed.get(target)
          );
          if (changed.has(null)) {
            let lastOp = null;
            const packOp = () => {
              if (lastOp) {
                delta.push(lastOp);
              }
            };
            for (let item = target._start; item !== null; item = item.right) {
              if (item.deleted) {
                if (this.deletes(item) && !this.adds(item)) {
                  if (lastOp === null || lastOp.delete === void 0) {
                    packOp();
                    lastOp = { delete: 0 };
                  }
                  lastOp.delete += item.length;
                  deleted.add(item);
                }
              } else {
                if (this.adds(item)) {
                  if (lastOp === null || lastOp.insert === void 0) {
                    packOp();
                    lastOp = { insert: [] };
                  }
                  lastOp.insert = lastOp.insert.concat(item.content.getContent());
                  added.add(item);
                } else {
                  if (lastOp === null || lastOp.retain === void 0) {
                    packOp();
                    lastOp = { retain: 0 };
                  }
                  lastOp.retain += item.length;
                }
              }
            }
            if (lastOp !== null && lastOp.retain === void 0) {
              packOp();
            }
          }
          this._changes = changes;
        }
        return (
          /** @type {any} */
          changes
        );
      }
    };
    getPathTo = (parent, child) => {
      const path = [];
      while (child._item !== null && child !== parent) {
        if (child._item.parentSub !== null) {
          path.unshift(child._item.parentSub);
        } else {
          let i = 0;
          let c = (
            /** @type {AbstractType<any>} */
            child._item.parent._start
          );
          while (c !== child._item && c !== null) {
            if (!c.deleted && c.countable) {
              i += c.length;
            }
            c = c.right;
          }
          path.unshift(i);
        }
        child = /** @type {AbstractType<any>} */
        child._item.parent;
      }
      return path;
    };
    warnPrematureAccess = () => {
      warn("Invalid access: Add Yjs type to a document before reading data.");
    };
    maxSearchMarker = 80;
    globalSearchMarkerTimestamp = 0;
    ArraySearchMarker = class {
      /**
       * @param {Item} p
       * @param {number} index
       */
      constructor(p, index) {
        p.marker = true;
        this.p = p;
        this.index = index;
        this.timestamp = globalSearchMarkerTimestamp++;
      }
    };
    refreshMarkerTimestamp = (marker) => {
      marker.timestamp = globalSearchMarkerTimestamp++;
    };
    overwriteMarker = (marker, p, index) => {
      marker.p.marker = false;
      marker.p = p;
      p.marker = true;
      marker.index = index;
      marker.timestamp = globalSearchMarkerTimestamp++;
    };
    markPosition = (searchMarker, p, index) => {
      if (searchMarker.length >= maxSearchMarker) {
        const marker = searchMarker.reduce((a, b) => a.timestamp < b.timestamp ? a : b);
        overwriteMarker(marker, p, index);
        return marker;
      } else {
        const pm = new ArraySearchMarker(p, index);
        searchMarker.push(pm);
        return pm;
      }
    };
    findMarker = (yarray, index) => {
      if (yarray._start === null || index === 0 || yarray._searchMarker === null) {
        return null;
      }
      const marker = yarray._searchMarker.length === 0 ? null : yarray._searchMarker.reduce((a, b) => abs(index - a.index) < abs(index - b.index) ? a : b);
      let p = yarray._start;
      let pindex = 0;
      if (marker !== null) {
        p = marker.p;
        pindex = marker.index;
        refreshMarkerTimestamp(marker);
      }
      while (p.right !== null && pindex < index) {
        if (!p.deleted && p.countable) {
          if (index < pindex + p.length) {
            break;
          }
          pindex += p.length;
        }
        p = p.right;
      }
      while (p.left !== null && pindex > index) {
        p = p.left;
        if (!p.deleted && p.countable) {
          pindex -= p.length;
        }
      }
      while (p.left !== null && p.left.id.client === p.id.client && p.left.id.clock + p.left.length === p.id.clock) {
        p = p.left;
        if (!p.deleted && p.countable) {
          pindex -= p.length;
        }
      }
      if (marker !== null && abs(marker.index - pindex) < /** @type {YText|YArray<any>} */
      p.parent.length / maxSearchMarker) {
        overwriteMarker(marker, p, pindex);
        return marker;
      } else {
        return markPosition(yarray._searchMarker, p, pindex);
      }
    };
    updateMarkerChanges = (searchMarker, index, len) => {
      for (let i = searchMarker.length - 1; i >= 0; i--) {
        const m = searchMarker[i];
        if (len > 0) {
          let p = m.p;
          p.marker = false;
          while (p && (p.deleted || !p.countable)) {
            p = p.left;
            if (p && !p.deleted && p.countable) {
              m.index -= p.length;
            }
          }
          if (p === null || p.marker === true) {
            searchMarker.splice(i, 1);
            continue;
          }
          m.p = p;
          p.marker = true;
        }
        if (index < m.index || len > 0 && index === m.index) {
          m.index = max(index, m.index + len);
        }
      }
    };
    getTypeChildren = (t) => {
      t.doc ?? warnPrematureAccess();
      let s = t._start;
      const arr = [];
      while (s) {
        arr.push(s);
        s = s.right;
      }
      return arr;
    };
    callTypeObservers = (type, transaction, event) => {
      const changedType = type;
      const changedParentTypes = transaction.changedParentTypes;
      while (true) {
        setIfUndefined(changedParentTypes, type, () => []).push(event);
        if (type._item === null) {
          break;
        }
        type = /** @type {AbstractType<any>} */
        type._item.parent;
      }
      callEventHandlerListeners(changedType._eH, event, transaction);
    };
    AbstractType = class {
      constructor() {
        this._item = null;
        this._map = /* @__PURE__ */ new Map();
        this._start = null;
        this.doc = null;
        this._length = 0;
        this._eH = createEventHandler();
        this._dEH = createEventHandler();
        this._searchMarker = null;
      }
      /**
       * @return {AbstractType<any>|null}
       */
      get parent() {
        return this._item ? (
          /** @type {AbstractType<any>} */
          this._item.parent
        ) : null;
      }
      /**
       * Integrate this type into the Yjs instance.
       *
       * * Save this struct in the os
       * * This type is sent to other client
       * * Observer functions are fired
       *
       * @param {Doc} y The Yjs instance
       * @param {Item|null} item
       */
      _integrate(y, item) {
        this.doc = y;
        this._item = item;
      }
      /**
       * @return {AbstractType<EventType>}
       */
      _copy() {
        throw methodUnimplemented();
      }
      /**
       * Makes a copy of this data type that can be included somewhere else.
       *
       * Note that the content is only readable _after_ it has been included somewhere in the Ydoc.
       *
       * @return {AbstractType<EventType>}
       */
      clone() {
        throw methodUnimplemented();
      }
      /**
       * @param {UpdateEncoderV1 | UpdateEncoderV2} _encoder
       */
      _write(_encoder) {
      }
      /**
       * The first non-deleted item
       */
      get _first() {
        let n = this._start;
        while (n !== null && n.deleted) {
          n = n.right;
        }
        return n;
      }
      /**
       * Creates YEvent and calls all type observers.
       * Must be implemented by each type.
       *
       * @param {Transaction} transaction
       * @param {Set<null|string>} _parentSubs Keys changed on this type. `null` if list was modified.
       */
      _callObserver(transaction, _parentSubs) {
        if (!transaction.local && this._searchMarker) {
          this._searchMarker.length = 0;
        }
      }
      /**
       * Observe all events that are created on this type.
       *
       * @param {function(EventType, Transaction):void} f Observer function
       */
      observe(f) {
        addEventHandlerListener(this._eH, f);
      }
      /**
       * Observe all events that are created by this type and its children.
       *
       * @param {function(Array<YEvent<any>>,Transaction):void} f Observer function
       */
      observeDeep(f) {
        addEventHandlerListener(this._dEH, f);
      }
      /**
       * Unregister an observer function.
       *
       * @param {function(EventType,Transaction):void} f Observer function
       */
      unobserve(f) {
        removeEventHandlerListener(this._eH, f);
      }
      /**
       * Unregister an observer function.
       *
       * @param {function(Array<YEvent<any>>,Transaction):void} f Observer function
       */
      unobserveDeep(f) {
        removeEventHandlerListener(this._dEH, f);
      }
      /**
       * @abstract
       * @return {any}
       */
      toJSON() {
      }
    };
    typeListSlice = (type, start, end) => {
      type.doc ?? warnPrematureAccess();
      if (start < 0) {
        start = type._length + start;
      }
      if (end < 0) {
        end = type._length + end;
      }
      let len = end - start;
      const cs = [];
      let n = type._start;
      while (n !== null && len > 0) {
        if (n.countable && !n.deleted) {
          const c = n.content.getContent();
          if (c.length <= start) {
            start -= c.length;
          } else {
            for (let i = start; i < c.length && len > 0; i++) {
              cs.push(c[i]);
              len--;
            }
            start = 0;
          }
        }
        n = n.right;
      }
      return cs;
    };
    typeListToArray = (type) => {
      type.doc ?? warnPrematureAccess();
      const cs = [];
      let n = type._start;
      while (n !== null) {
        if (n.countable && !n.deleted) {
          const c = n.content.getContent();
          for (let i = 0; i < c.length; i++) {
            cs.push(c[i]);
          }
        }
        n = n.right;
      }
      return cs;
    };
    typeListToArraySnapshot = (type, snapshot2) => {
      const cs = [];
      let n = type._start;
      while (n !== null) {
        if (n.countable && isVisible(n, snapshot2)) {
          const c = n.content.getContent();
          for (let i = 0; i < c.length; i++) {
            cs.push(c[i]);
          }
        }
        n = n.right;
      }
      return cs;
    };
    typeListForEach = (type, f) => {
      let index = 0;
      let n = type._start;
      type.doc ?? warnPrematureAccess();
      while (n !== null) {
        if (n.countable && !n.deleted) {
          const c = n.content.getContent();
          for (let i = 0; i < c.length; i++) {
            f(c[i], index++, type);
          }
        }
        n = n.right;
      }
    };
    typeListMap = (type, f) => {
      const result = [];
      typeListForEach(type, (c, i) => {
        result.push(f(c, i, type));
      });
      return result;
    };
    typeListCreateIterator = (type) => {
      let n = type._start;
      let currentContent = null;
      let currentContentIndex = 0;
      return {
        [Symbol.iterator]() {
          return this;
        },
        next: () => {
          if (currentContent === null) {
            while (n !== null && n.deleted) {
              n = n.right;
            }
            if (n === null) {
              return {
                done: true,
                value: void 0
              };
            }
            currentContent = n.content.getContent();
            currentContentIndex = 0;
            n = n.right;
          }
          const value = currentContent[currentContentIndex++];
          if (currentContent.length <= currentContentIndex) {
            currentContent = null;
          }
          return {
            done: false,
            value
          };
        }
      };
    };
    typeListGet = (type, index) => {
      type.doc ?? warnPrematureAccess();
      const marker = findMarker(type, index);
      let n = type._start;
      if (marker !== null) {
        n = marker.p;
        index -= marker.index;
      }
      for (; n !== null; n = n.right) {
        if (!n.deleted && n.countable) {
          if (index < n.length) {
            return n.content.getContent()[index];
          }
          index -= n.length;
        }
      }
    };
    typeListInsertGenericsAfter = (transaction, parent, referenceItem, content) => {
      let left = referenceItem;
      const doc2 = transaction.doc;
      const ownClientId = doc2.clientID;
      const store = doc2.store;
      const right = referenceItem === null ? parent._start : referenceItem.right;
      let jsonContent = [];
      const packJsonContent = () => {
        if (jsonContent.length > 0) {
          left = new Item(createID(ownClientId, getState(store, ownClientId)), left, left && left.lastId, right, right && right.id, parent, null, new ContentAny(jsonContent));
          left.integrate(transaction, 0);
          jsonContent = [];
        }
      };
      content.forEach((c) => {
        if (c === null) {
          jsonContent.push(c);
        } else {
          switch (c.constructor) {
            case Number:
            case Object:
            case Boolean:
            case Array:
            case String:
              jsonContent.push(c);
              break;
            default:
              packJsonContent();
              switch (c.constructor) {
                case Uint8Array:
                case ArrayBuffer:
                  left = new Item(createID(ownClientId, getState(store, ownClientId)), left, left && left.lastId, right, right && right.id, parent, null, new ContentBinary(new Uint8Array(
                    /** @type {Uint8Array} */
                    c
                  )));
                  left.integrate(transaction, 0);
                  break;
                case Doc:
                  left = new Item(createID(ownClientId, getState(store, ownClientId)), left, left && left.lastId, right, right && right.id, parent, null, new ContentDoc(
                    /** @type {Doc} */
                    c
                  ));
                  left.integrate(transaction, 0);
                  break;
                default:
                  if (c instanceof AbstractType) {
                    left = new Item(createID(ownClientId, getState(store, ownClientId)), left, left && left.lastId, right, right && right.id, parent, null, new ContentType(c));
                    left.integrate(transaction, 0);
                  } else {
                    throw new Error("Unexpected content type in insert operation");
                  }
              }
          }
        }
      });
      packJsonContent();
    };
    lengthExceeded = () => create3("Length exceeded!");
    typeListInsertGenerics = (transaction, parent, index, content) => {
      if (index > parent._length) {
        throw lengthExceeded();
      }
      if (index === 0) {
        if (parent._searchMarker) {
          updateMarkerChanges(parent._searchMarker, index, content.length);
        }
        return typeListInsertGenericsAfter(transaction, parent, null, content);
      }
      const startIndex = index;
      const marker = findMarker(parent, index);
      let n = parent._start;
      if (marker !== null) {
        n = marker.p;
        index -= marker.index;
        if (index === 0) {
          n = n.prev;
          index += n && n.countable && !n.deleted ? n.length : 0;
        }
      }
      for (; n !== null; n = n.right) {
        if (!n.deleted && n.countable) {
          if (index <= n.length) {
            if (index < n.length) {
              getItemCleanStart(transaction, createID(n.id.client, n.id.clock + index));
            }
            break;
          }
          index -= n.length;
        }
      }
      if (parent._searchMarker) {
        updateMarkerChanges(parent._searchMarker, startIndex, content.length);
      }
      return typeListInsertGenericsAfter(transaction, parent, n, content);
    };
    typeListPushGenerics = (transaction, parent, content) => {
      const marker = (parent._searchMarker || []).reduce((maxMarker, currMarker) => currMarker.index > maxMarker.index ? currMarker : maxMarker, { index: 0, p: parent._start });
      let n = marker.p;
      if (n) {
        while (n.right) {
          n = n.right;
        }
      }
      return typeListInsertGenericsAfter(transaction, parent, n, content);
    };
    typeListDelete = (transaction, parent, index, length2) => {
      if (length2 === 0) {
        return;
      }
      const startIndex = index;
      const startLength = length2;
      const marker = findMarker(parent, index);
      let n = parent._start;
      if (marker !== null) {
        n = marker.p;
        index -= marker.index;
      }
      for (; n !== null && index > 0; n = n.right) {
        if (!n.deleted && n.countable) {
          if (index < n.length) {
            getItemCleanStart(transaction, createID(n.id.client, n.id.clock + index));
          }
          index -= n.length;
        }
      }
      while (length2 > 0 && n !== null) {
        if (!n.deleted) {
          if (length2 < n.length) {
            getItemCleanStart(transaction, createID(n.id.client, n.id.clock + length2));
          }
          n.delete(transaction);
          length2 -= n.length;
        }
        n = n.right;
      }
      if (length2 > 0) {
        throw lengthExceeded();
      }
      if (parent._searchMarker) {
        updateMarkerChanges(
          parent._searchMarker,
          startIndex,
          -startLength + length2
          /* in case we remove the above exception */
        );
      }
    };
    typeMapDelete = (transaction, parent, key) => {
      const c = parent._map.get(key);
      if (c !== void 0) {
        c.delete(transaction);
      }
    };
    typeMapSet = (transaction, parent, key, value) => {
      const left = parent._map.get(key) || null;
      const doc2 = transaction.doc;
      const ownClientId = doc2.clientID;
      let content;
      if (value == null) {
        content = new ContentAny([value]);
      } else {
        switch (value.constructor) {
          case Number:
          case Object:
          case Boolean:
          case Array:
          case String:
          case Date:
          case BigInt:
            content = new ContentAny([value]);
            break;
          case Uint8Array:
            content = new ContentBinary(
              /** @type {Uint8Array} */
              value
            );
            break;
          case Doc:
            content = new ContentDoc(
              /** @type {Doc} */
              value
            );
            break;
          default:
            if (value instanceof AbstractType) {
              content = new ContentType(value);
            } else {
              throw new Error("Unexpected content type");
            }
        }
      }
      new Item(createID(ownClientId, getState(doc2.store, ownClientId)), left, left && left.lastId, null, null, parent, key, content).integrate(transaction, 0);
    };
    typeMapGet = (parent, key) => {
      parent.doc ?? warnPrematureAccess();
      const val = parent._map.get(key);
      return val !== void 0 && !val.deleted ? val.content.getContent()[val.length - 1] : void 0;
    };
    typeMapGetAll = (parent) => {
      const res = {};
      parent.doc ?? warnPrematureAccess();
      parent._map.forEach((value, key) => {
        if (!value.deleted) {
          res[key] = value.content.getContent()[value.length - 1];
        }
      });
      return res;
    };
    typeMapHas = (parent, key) => {
      parent.doc ?? warnPrematureAccess();
      const val = parent._map.get(key);
      return val !== void 0 && !val.deleted;
    };
    typeMapGetSnapshot = (parent, key, snapshot2) => {
      let v = parent._map.get(key) || null;
      while (v !== null && (!snapshot2.sv.has(v.id.client) || v.id.clock >= (snapshot2.sv.get(v.id.client) || 0))) {
        v = v.left;
      }
      return v !== null && isVisible(v, snapshot2) ? v.content.getContent()[v.length - 1] : void 0;
    };
    typeMapGetAllSnapshot = (parent, snapshot2) => {
      const res = {};
      parent._map.forEach((value, key) => {
        let v = value;
        while (v !== null && (!snapshot2.sv.has(v.id.client) || v.id.clock >= (snapshot2.sv.get(v.id.client) || 0))) {
          v = v.left;
        }
        if (v !== null && isVisible(v, snapshot2)) {
          res[key] = v.content.getContent()[v.length - 1];
        }
      });
      return res;
    };
    createMapIterator = (type) => {
      type.doc ?? warnPrematureAccess();
      return iteratorFilter(
        type._map.entries(),
        /** @param {any} entry */
        (entry) => !entry[1].deleted
      );
    };
    YArrayEvent = class extends YEvent {
    };
    YArray = class _YArray extends AbstractType {
      constructor() {
        super();
        this._prelimContent = [];
        this._searchMarker = [];
      }
      /**
       * Construct a new YArray containing the specified items.
       * @template {Object<string,any>|Array<any>|number|null|string|Uint8Array} T
       * @param {Array<T>} items
       * @return {YArray<T>}
       */
      static from(items) {
        const a = new _YArray();
        a.push(items);
        return a;
      }
      /**
       * Integrate this type into the Yjs instance.
       *
       * * Save this struct in the os
       * * This type is sent to other client
       * * Observer functions are fired
       *
       * @param {Doc} y The Yjs instance
       * @param {Item} item
       */
      _integrate(y, item) {
        super._integrate(y, item);
        this.insert(
          0,
          /** @type {Array<any>} */
          this._prelimContent
        );
        this._prelimContent = null;
      }
      /**
       * @return {YArray<T>}
       */
      _copy() {
        return new _YArray();
      }
      /**
       * Makes a copy of this data type that can be included somewhere else.
       *
       * Note that the content is only readable _after_ it has been included somewhere in the Ydoc.
       *
       * @return {YArray<T>}
       */
      clone() {
        const arr = new _YArray();
        arr.insert(0, this.toArray().map(
          (el) => el instanceof AbstractType ? (
            /** @type {typeof el} */
            el.clone()
          ) : el
        ));
        return arr;
      }
      get length() {
        this.doc ?? warnPrematureAccess();
        return this._length;
      }
      /**
       * Creates YArrayEvent and calls observers.
       *
       * @param {Transaction} transaction
       * @param {Set<null|string>} parentSubs Keys changed on this type. `null` if list was modified.
       */
      _callObserver(transaction, parentSubs) {
        super._callObserver(transaction, parentSubs);
        callTypeObservers(this, transaction, new YArrayEvent(this, transaction));
      }
      /**
       * Inserts new content at an index.
       *
       * Important: This function expects an array of content. Not just a content
       * object. The reason for this "weirdness" is that inserting several elements
       * is very efficient when it is done as a single operation.
       *
       * @example
       *  // Insert character 'a' at position 0
       *  yarray.insert(0, ['a'])
       *  // Insert numbers 1, 2 at position 1
       *  yarray.insert(1, [1, 2])
       *
       * @param {number} index The index to insert content at.
       * @param {Array<T>} content The array of content
       */
      insert(index, content) {
        if (this.doc !== null) {
          transact(this.doc, (transaction) => {
            typeListInsertGenerics(
              transaction,
              this,
              index,
              /** @type {any} */
              content
            );
          });
        } else {
          this._prelimContent.splice(index, 0, ...content);
        }
      }
      /**
       * Appends content to this YArray.
       *
       * @param {Array<T>} content Array of content to append.
       *
       * @todo Use the following implementation in all types.
       */
      push(content) {
        if (this.doc !== null) {
          transact(this.doc, (transaction) => {
            typeListPushGenerics(
              transaction,
              this,
              /** @type {any} */
              content
            );
          });
        } else {
          this._prelimContent.push(...content);
        }
      }
      /**
       * Prepends content to this YArray.
       *
       * @param {Array<T>} content Array of content to prepend.
       */
      unshift(content) {
        this.insert(0, content);
      }
      /**
       * Deletes elements starting from an index.
       *
       * @param {number} index Index at which to start deleting elements
       * @param {number} length The number of elements to remove. Defaults to 1.
       */
      delete(index, length2 = 1) {
        if (this.doc !== null) {
          transact(this.doc, (transaction) => {
            typeListDelete(transaction, this, index, length2);
          });
        } else {
          this._prelimContent.splice(index, length2);
        }
      }
      /**
       * Returns the i-th element from a YArray.
       *
       * @param {number} index The index of the element to return from the YArray
       * @return {T}
       */
      get(index) {
        return typeListGet(this, index);
      }
      /**
       * Transforms this YArray to a JavaScript Array.
       *
       * @return {Array<T>}
       */
      toArray() {
        return typeListToArray(this);
      }
      /**
       * Returns a portion of this YArray into a JavaScript Array selected
       * from start to end (end not included).
       *
       * @param {number} [start]
       * @param {number} [end]
       * @return {Array<T>}
       */
      slice(start = 0, end = this.length) {
        return typeListSlice(this, start, end);
      }
      /**
       * Transforms this Shared Type to a JSON object.
       *
       * @return {Array<any>}
       */
      toJSON() {
        return this.map((c) => c instanceof AbstractType ? c.toJSON() : c);
      }
      /**
       * Returns an Array with the result of calling a provided function on every
       * element of this YArray.
       *
       * @template M
       * @param {function(T,number,YArray<T>):M} f Function that produces an element of the new Array
       * @return {Array<M>} A new array with each element being the result of the
       *                 callback function
       */
      map(f) {
        return typeListMap(
          this,
          /** @type {any} */
          f
        );
      }
      /**
       * Executes a provided function once on every element of this YArray.
       *
       * @param {function(T,number,YArray<T>):void} f A function to execute on every element of this YArray.
       */
      forEach(f) {
        typeListForEach(this, f);
      }
      /**
       * @return {IterableIterator<T>}
       */
      [Symbol.iterator]() {
        return typeListCreateIterator(this);
      }
      /**
       * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder
       */
      _write(encoder) {
        encoder.writeTypeRef(YArrayRefID);
      }
    };
    readYArray = (_decoder) => new YArray();
    YMapEvent = class extends YEvent {
      /**
       * @param {YMap<T>} ymap The YArray that changed.
       * @param {Transaction} transaction
       * @param {Set<any>} subs The keys that changed.
       */
      constructor(ymap, transaction, subs) {
        super(ymap, transaction);
        this.keysChanged = subs;
      }
    };
    YMap = class _YMap extends AbstractType {
      /**
       *
       * @param {Iterable<readonly [string, any]>=} entries - an optional iterable to initialize the YMap
       */
      constructor(entries) {
        super();
        this._prelimContent = null;
        if (entries === void 0) {
          this._prelimContent = /* @__PURE__ */ new Map();
        } else {
          this._prelimContent = new Map(entries);
        }
      }
      /**
       * Integrate this type into the Yjs instance.
       *
       * * Save this struct in the os
       * * This type is sent to other client
       * * Observer functions are fired
       *
       * @param {Doc} y The Yjs instance
       * @param {Item} item
       */
      _integrate(y, item) {
        super._integrate(y, item);
        this._prelimContent.forEach((value, key) => {
          this.set(key, value);
        });
        this._prelimContent = null;
      }
      /**
       * @return {YMap<MapType>}
       */
      _copy() {
        return new _YMap();
      }
      /**
       * Makes a copy of this data type that can be included somewhere else.
       *
       * Note that the content is only readable _after_ it has been included somewhere in the Ydoc.
       *
       * @return {YMap<MapType>}
       */
      clone() {
        const map2 = new _YMap();
        this.forEach((value, key) => {
          map2.set(key, value instanceof AbstractType ? (
            /** @type {typeof value} */
            value.clone()
          ) : value);
        });
        return map2;
      }
      /**
       * Creates YMapEvent and calls observers.
       *
       * @param {Transaction} transaction
       * @param {Set<null|string>} parentSubs Keys changed on this type. `null` if list was modified.
       */
      _callObserver(transaction, parentSubs) {
        callTypeObservers(this, transaction, new YMapEvent(this, transaction, parentSubs));
      }
      /**
       * Transforms this Shared Type to a JSON object.
       *
       * @return {Object<string,any>}
       */
      toJSON() {
        this.doc ?? warnPrematureAccess();
        const map2 = {};
        this._map.forEach((item, key) => {
          if (!item.deleted) {
            const v = item.content.getContent()[item.length - 1];
            map2[key] = v instanceof AbstractType ? v.toJSON() : v;
          }
        });
        return map2;
      }
      /**
       * Returns the size of the YMap (count of key/value pairs)
       *
       * @return {number}
       */
      get size() {
        return [...createMapIterator(this)].length;
      }
      /**
       * Returns the keys for each element in the YMap Type.
       *
       * @return {IterableIterator<string>}
       */
      keys() {
        return iteratorMap(
          createMapIterator(this),
          /** @param {any} v */
          (v) => v[0]
        );
      }
      /**
       * Returns the values for each element in the YMap Type.
       *
       * @return {IterableIterator<MapType>}
       */
      values() {
        return iteratorMap(
          createMapIterator(this),
          /** @param {any} v */
          (v) => v[1].content.getContent()[v[1].length - 1]
        );
      }
      /**
       * Returns an Iterator of [key, value] pairs
       *
       * @return {IterableIterator<[string, MapType]>}
       */
      entries() {
        return iteratorMap(
          createMapIterator(this),
          /** @param {any} v */
          (v) => (
            /** @type {any} */
            [v[0], v[1].content.getContent()[v[1].length - 1]]
          )
        );
      }
      /**
       * Executes a provided function on once on every key-value pair.
       *
       * @param {function(MapType,string,YMap<MapType>):void} f A function to execute on every element of this YArray.
       */
      forEach(f) {
        this.doc ?? warnPrematureAccess();
        this._map.forEach((item, key) => {
          if (!item.deleted) {
            f(item.content.getContent()[item.length - 1], key, this);
          }
        });
      }
      /**
       * Returns an Iterator of [key, value] pairs
       *
       * @return {IterableIterator<[string, MapType]>}
       */
      [Symbol.iterator]() {
        return this.entries();
      }
      /**
       * Remove a specified element from this YMap.
       *
       * @param {string} key The key of the element to remove.
       */
      delete(key) {
        if (this.doc !== null) {
          transact(this.doc, (transaction) => {
            typeMapDelete(transaction, this, key);
          });
        } else {
          this._prelimContent.delete(key);
        }
      }
      /**
       * Adds or updates an element with a specified key and value.
       * @template {MapType} VAL
       *
       * @param {string} key The key of the element to add to this YMap
       * @param {VAL} value The value of the element to add
       * @return {VAL}
       */
      set(key, value) {
        if (this.doc !== null) {
          transact(this.doc, (transaction) => {
            typeMapSet(
              transaction,
              this,
              key,
              /** @type {any} */
              value
            );
          });
        } else {
          this._prelimContent.set(key, value);
        }
        return value;
      }
      /**
       * Returns a specified element from this YMap.
       *
       * @param {string} key
       * @return {MapType|undefined}
       */
      get(key) {
        return (
          /** @type {any} */
          typeMapGet(this, key)
        );
      }
      /**
       * Returns a boolean indicating whether the specified key exists or not.
       *
       * @param {string} key The key to test.
       * @return {boolean}
       */
      has(key) {
        return typeMapHas(this, key);
      }
      /**
       * Removes all elements from this YMap.
       */
      clear() {
        if (this.doc !== null) {
          transact(this.doc, (transaction) => {
            this.forEach(function(_value, key, map2) {
              typeMapDelete(transaction, map2, key);
            });
          });
        } else {
          this._prelimContent.clear();
        }
      }
      /**
       * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder
       */
      _write(encoder) {
        encoder.writeTypeRef(YMapRefID);
      }
    };
    readYMap = (_decoder) => new YMap();
    equalAttrs = (a, b) => a === b || typeof a === "object" && typeof b === "object" && a && b && equalFlat(a, b);
    ItemTextListPosition = class {
      /**
       * @param {Item|null} left
       * @param {Item|null} right
       * @param {number} index
       * @param {Map<string,any>} currentAttributes
       */
      constructor(left, right, index, currentAttributes) {
        this.left = left;
        this.right = right;
        this.index = index;
        this.currentAttributes = currentAttributes;
      }
      /**
       * Only call this if you know that this.right is defined
       */
      forward() {
        if (this.right === null) {
          unexpectedCase();
        }
        switch (this.right.content.constructor) {
          case ContentFormat:
            if (!this.right.deleted) {
              updateCurrentAttributes(
                this.currentAttributes,
                /** @type {ContentFormat} */
                this.right.content
              );
            }
            break;
          default:
            if (!this.right.deleted) {
              this.index += this.right.length;
            }
            break;
        }
        this.left = this.right;
        this.right = this.right.right;
      }
    };
    findNextPosition = (transaction, pos, count) => {
      while (pos.right !== null && count > 0) {
        switch (pos.right.content.constructor) {
          case ContentFormat:
            if (!pos.right.deleted) {
              updateCurrentAttributes(
                pos.currentAttributes,
                /** @type {ContentFormat} */
                pos.right.content
              );
            }
            break;
          default:
            if (!pos.right.deleted) {
              if (count < pos.right.length) {
                getItemCleanStart(transaction, createID(pos.right.id.client, pos.right.id.clock + count));
              }
              pos.index += pos.right.length;
              count -= pos.right.length;
            }
            break;
        }
        pos.left = pos.right;
        pos.right = pos.right.right;
      }
      return pos;
    };
    findPosition = (transaction, parent, index, useSearchMarker) => {
      const currentAttributes = /* @__PURE__ */ new Map();
      const marker = useSearchMarker ? findMarker(parent, index) : null;
      if (marker) {
        const pos = new ItemTextListPosition(marker.p.left, marker.p, marker.index, currentAttributes);
        return findNextPosition(transaction, pos, index - marker.index);
      } else {
        const pos = new ItemTextListPosition(null, parent._start, 0, currentAttributes);
        return findNextPosition(transaction, pos, index);
      }
    };
    insertNegatedAttributes = (transaction, parent, currPos, negatedAttributes) => {
      while (currPos.right !== null && (currPos.right.deleted === true || currPos.right.content.constructor === ContentFormat && equalAttrs(
        negatedAttributes.get(
          /** @type {ContentFormat} */
          currPos.right.content.key
        ),
        /** @type {ContentFormat} */
        currPos.right.content.value
      ))) {
        if (!currPos.right.deleted) {
          negatedAttributes.delete(
            /** @type {ContentFormat} */
            currPos.right.content.key
          );
        }
        currPos.forward();
      }
      const doc2 = transaction.doc;
      const ownClientId = doc2.clientID;
      negatedAttributes.forEach((val, key) => {
        const left = currPos.left;
        const right = currPos.right;
        const nextFormat = new Item(createID(ownClientId, getState(doc2.store, ownClientId)), left, left && left.lastId, right, right && right.id, parent, null, new ContentFormat(key, val));
        nextFormat.integrate(transaction, 0);
        currPos.right = nextFormat;
        currPos.forward();
      });
    };
    updateCurrentAttributes = (currentAttributes, format) => {
      const { key, value } = format;
      if (value === null) {
        currentAttributes.delete(key);
      } else {
        currentAttributes.set(key, value);
      }
    };
    minimizeAttributeChanges = (currPos, attributes) => {
      while (true) {
        if (currPos.right === null) {
          break;
        } else if (currPos.right.deleted || currPos.right.content.constructor === ContentFormat && equalAttrs(
          attributes[
            /** @type {ContentFormat} */
            currPos.right.content.key
          ] ?? null,
          /** @type {ContentFormat} */
          currPos.right.content.value
        )) ;
        else {
          break;
        }
        currPos.forward();
      }
    };
    insertAttributes = (transaction, parent, currPos, attributes) => {
      const doc2 = transaction.doc;
      const ownClientId = doc2.clientID;
      const negatedAttributes = /* @__PURE__ */ new Map();
      for (const key in attributes) {
        const val = attributes[key];
        const currentVal = currPos.currentAttributes.get(key) ?? null;
        if (!equalAttrs(currentVal, val)) {
          negatedAttributes.set(key, currentVal);
          const { left, right } = currPos;
          currPos.right = new Item(createID(ownClientId, getState(doc2.store, ownClientId)), left, left && left.lastId, right, right && right.id, parent, null, new ContentFormat(key, val));
          currPos.right.integrate(transaction, 0);
          currPos.forward();
        }
      }
      return negatedAttributes;
    };
    insertText = (transaction, parent, currPos, text2, attributes) => {
      currPos.currentAttributes.forEach((_val, key) => {
        if (attributes[key] === void 0) {
          attributes[key] = null;
        }
      });
      const doc2 = transaction.doc;
      const ownClientId = doc2.clientID;
      minimizeAttributeChanges(currPos, attributes);
      const negatedAttributes = insertAttributes(transaction, parent, currPos, attributes);
      const content = text2.constructor === String ? new ContentString(
        /** @type {string} */
        text2
      ) : text2 instanceof AbstractType ? new ContentType(text2) : new ContentEmbed(text2);
      let { left, right, index } = currPos;
      if (parent._searchMarker) {
        updateMarkerChanges(parent._searchMarker, currPos.index, content.getLength());
      }
      right = new Item(createID(ownClientId, getState(doc2.store, ownClientId)), left, left && left.lastId, right, right && right.id, parent, null, content);
      right.integrate(transaction, 0);
      currPos.right = right;
      currPos.index = index;
      currPos.forward();
      insertNegatedAttributes(transaction, parent, currPos, negatedAttributes);
    };
    formatText = (transaction, parent, currPos, length2, attributes) => {
      const doc2 = transaction.doc;
      const ownClientId = doc2.clientID;
      minimizeAttributeChanges(currPos, attributes);
      const negatedAttributes = insertAttributes(transaction, parent, currPos, attributes);
      iterationLoop: while (currPos.right !== null && (length2 > 0 || negatedAttributes.size > 0 && (currPos.right.deleted || currPos.right.content.constructor === ContentFormat))) {
        if (!currPos.right.deleted) {
          switch (currPos.right.content.constructor) {
            case ContentFormat: {
              const { key, value } = (
                /** @type {ContentFormat} */
                currPos.right.content
              );
              const attr = attributes[key];
              if (attr !== void 0) {
                if (equalAttrs(attr, value)) {
                  negatedAttributes.delete(key);
                } else {
                  if (length2 === 0) {
                    break iterationLoop;
                  }
                  negatedAttributes.set(key, value);
                }
                currPos.right.delete(transaction);
              } else {
                currPos.currentAttributes.set(key, value);
              }
              break;
            }
            default:
              if (length2 < currPos.right.length) {
                getItemCleanStart(transaction, createID(currPos.right.id.client, currPos.right.id.clock + length2));
              }
              length2 -= currPos.right.length;
              break;
          }
        }
        currPos.forward();
      }
      if (length2 > 0) {
        let newlines = "";
        for (; length2 > 0; length2--) {
          newlines += "\n";
        }
        currPos.right = new Item(createID(ownClientId, getState(doc2.store, ownClientId)), currPos.left, currPos.left && currPos.left.lastId, currPos.right, currPos.right && currPos.right.id, parent, null, new ContentString(newlines));
        currPos.right.integrate(transaction, 0);
        currPos.forward();
      }
      insertNegatedAttributes(transaction, parent, currPos, negatedAttributes);
    };
    cleanupFormattingGap = (transaction, start, curr, startAttributes, currAttributes) => {
      let end = start;
      const endFormats = create();
      while (end && (!end.countable || end.deleted)) {
        if (!end.deleted && end.content.constructor === ContentFormat) {
          const cf = (
            /** @type {ContentFormat} */
            end.content
          );
          endFormats.set(cf.key, cf);
        }
        end = end.right;
      }
      let cleanups = 0;
      let reachedCurr = false;
      while (start !== end) {
        if (curr === start) {
          reachedCurr = true;
        }
        if (!start.deleted) {
          const content = start.content;
          switch (content.constructor) {
            case ContentFormat: {
              const { key, value } = (
                /** @type {ContentFormat} */
                content
              );
              const startAttrValue = startAttributes.get(key) ?? null;
              if (endFormats.get(key) !== content || startAttrValue === value) {
                start.delete(transaction);
                cleanups++;
                if (!reachedCurr && (currAttributes.get(key) ?? null) === value && startAttrValue !== value) {
                  if (startAttrValue === null) {
                    currAttributes.delete(key);
                  } else {
                    currAttributes.set(key, startAttrValue);
                  }
                }
              }
              if (!reachedCurr && !start.deleted) {
                updateCurrentAttributes(
                  currAttributes,
                  /** @type {ContentFormat} */
                  content
                );
              }
              break;
            }
          }
        }
        start = /** @type {Item} */
        start.right;
      }
      return cleanups;
    };
    cleanupContextlessFormattingGap = (transaction, item) => {
      while (item && item.right && (item.right.deleted || !item.right.countable)) {
        item = item.right;
      }
      const attrs = /* @__PURE__ */ new Set();
      while (item && (item.deleted || !item.countable)) {
        if (!item.deleted && item.content.constructor === ContentFormat) {
          const key = (
            /** @type {ContentFormat} */
            item.content.key
          );
          if (attrs.has(key)) {
            item.delete(transaction);
          } else {
            attrs.add(key);
          }
        }
        item = item.left;
      }
    };
    cleanupYTextFormatting = (type) => {
      let res = 0;
      transact(
        /** @type {Doc} */
        type.doc,
        (transaction) => {
          let start = (
            /** @type {Item} */
            type._start
          );
          let end = type._start;
          let startAttributes = create();
          const currentAttributes = copy(startAttributes);
          while (end) {
            if (end.deleted === false) {
              switch (end.content.constructor) {
                case ContentFormat:
                  updateCurrentAttributes(
                    currentAttributes,
                    /** @type {ContentFormat} */
                    end.content
                  );
                  break;
                default:
                  res += cleanupFormattingGap(transaction, start, end, startAttributes, currentAttributes);
                  startAttributes = copy(currentAttributes);
                  start = end;
                  break;
              }
            }
            end = end.right;
          }
        }
      );
      return res;
    };
    cleanupYTextAfterTransaction = (transaction) => {
      const needFullCleanup = /* @__PURE__ */ new Set();
      const doc2 = transaction.doc;
      for (const [client, afterClock] of transaction.afterState.entries()) {
        const clock = transaction.beforeState.get(client) || 0;
        if (afterClock === clock) {
          continue;
        }
        iterateStructs(
          transaction,
          /** @type {Array<Item|GC>} */
          doc2.store.clients.get(client),
          clock,
          afterClock,
          (item) => {
            if (!item.deleted && /** @type {Item} */
            item.content.constructor === ContentFormat && item.constructor !== GC) {
              needFullCleanup.add(
                /** @type {any} */
                item.parent
              );
            }
          }
        );
      }
      transact(doc2, (t) => {
        iterateDeletedStructs(transaction, transaction.deleteSet, (item) => {
          if (item instanceof GC || !/** @type {YText} */
          item.parent._hasFormatting || needFullCleanup.has(
            /** @type {YText} */
            item.parent
          )) {
            return;
          }
          const parent = (
            /** @type {YText} */
            item.parent
          );
          if (item.content.constructor === ContentFormat) {
            needFullCleanup.add(parent);
          } else {
            cleanupContextlessFormattingGap(t, item);
          }
        });
        for (const yText of needFullCleanup) {
          cleanupYTextFormatting(yText);
        }
      });
    };
    deleteText = (transaction, currPos, length2) => {
      const startLength = length2;
      const startAttrs = copy(currPos.currentAttributes);
      const start = currPos.right;
      while (length2 > 0 && currPos.right !== null) {
        if (currPos.right.deleted === false) {
          switch (currPos.right.content.constructor) {
            case ContentType:
            case ContentEmbed:
            case ContentString:
              if (length2 < currPos.right.length) {
                getItemCleanStart(transaction, createID(currPos.right.id.client, currPos.right.id.clock + length2));
              }
              length2 -= currPos.right.length;
              currPos.right.delete(transaction);
              break;
          }
        }
        currPos.forward();
      }
      if (start) {
        cleanupFormattingGap(transaction, start, currPos.right, startAttrs, currPos.currentAttributes);
      }
      const parent = (
        /** @type {AbstractType<any>} */
        /** @type {Item} */
        (currPos.left || currPos.right).parent
      );
      if (parent._searchMarker) {
        updateMarkerChanges(parent._searchMarker, currPos.index, -startLength + length2);
      }
      return currPos;
    };
    YTextEvent = class extends YEvent {
      /**
       * @param {YText} ytext
       * @param {Transaction} transaction
       * @param {Set<any>} subs The keys that changed
       */
      constructor(ytext, transaction, subs) {
        super(ytext, transaction);
        this.childListChanged = false;
        this.keysChanged = /* @__PURE__ */ new Set();
        subs.forEach((sub) => {
          if (sub === null) {
            this.childListChanged = true;
          } else {
            this.keysChanged.add(sub);
          }
        });
      }
      /**
       * @type {{added:Set<Item>,deleted:Set<Item>,keys:Map<string,{action:'add'|'update'|'delete',oldValue:any}>,delta:Array<{insert?:Array<any>|string, delete?:number, retain?:number}>}}
       */
      get changes() {
        if (this._changes === null) {
          const changes = {
            keys: this.keys,
            delta: this.delta,
            added: /* @__PURE__ */ new Set(),
            deleted: /* @__PURE__ */ new Set()
          };
          this._changes = changes;
        }
        return (
          /** @type {any} */
          this._changes
        );
      }
      /**
       * Compute the changes in the delta format.
       * A {@link https://quilljs.com/docs/delta/|Quill Delta}) that represents the changes on the document.
       *
       * @type {Array<{insert?:string|object|AbstractType<any>, delete?:number, retain?:number, attributes?: Object<string,any>}>}
       *
       * @public
       */
      get delta() {
        if (this._delta === null) {
          const y = (
            /** @type {Doc} */
            this.target.doc
          );
          const delta = [];
          transact(y, (transaction) => {
            const currentAttributes = /* @__PURE__ */ new Map();
            const oldAttributes = /* @__PURE__ */ new Map();
            let item = this.target._start;
            let action = null;
            const attributes = {};
            let insert = "";
            let retain = 0;
            let deleteLen = 0;
            const addOp = () => {
              if (action !== null) {
                let op = null;
                switch (action) {
                  case "delete":
                    if (deleteLen > 0) {
                      op = { delete: deleteLen };
                    }
                    deleteLen = 0;
                    break;
                  case "insert":
                    if (typeof insert === "object" || insert.length > 0) {
                      op = { insert };
                      if (currentAttributes.size > 0) {
                        op.attributes = {};
                        currentAttributes.forEach((value, key) => {
                          if (value !== null) {
                            op.attributes[key] = value;
                          }
                        });
                      }
                    }
                    insert = "";
                    break;
                  case "retain":
                    if (retain > 0) {
                      op = { retain };
                      if (!isEmpty(attributes)) {
                        op.attributes = assign({}, attributes);
                      }
                    }
                    retain = 0;
                    break;
                }
                if (op) delta.push(op);
                action = null;
              }
            };
            while (item !== null) {
              switch (item.content.constructor) {
                case ContentType:
                case ContentEmbed:
                  if (this.adds(item)) {
                    if (!this.deletes(item)) {
                      addOp();
                      action = "insert";
                      insert = item.content.getContent()[0];
                      addOp();
                    }
                  } else if (this.deletes(item)) {
                    if (action !== "delete") {
                      addOp();
                      action = "delete";
                    }
                    deleteLen += 1;
                  } else if (!item.deleted) {
                    if (action !== "retain") {
                      addOp();
                      action = "retain";
                    }
                    retain += 1;
                  }
                  break;
                case ContentString:
                  if (this.adds(item)) {
                    if (!this.deletes(item)) {
                      if (action !== "insert") {
                        addOp();
                        action = "insert";
                      }
                      insert += /** @type {ContentString} */
                      item.content.str;
                    }
                  } else if (this.deletes(item)) {
                    if (action !== "delete") {
                      addOp();
                      action = "delete";
                    }
                    deleteLen += item.length;
                  } else if (!item.deleted) {
                    if (action !== "retain") {
                      addOp();
                      action = "retain";
                    }
                    retain += item.length;
                  }
                  break;
                case ContentFormat: {
                  const { key, value } = (
                    /** @type {ContentFormat} */
                    item.content
                  );
                  if (this.adds(item)) {
                    if (!this.deletes(item)) {
                      const curVal = currentAttributes.get(key) ?? null;
                      if (!equalAttrs(curVal, value)) {
                        if (action === "retain") {
                          addOp();
                        }
                        if (equalAttrs(value, oldAttributes.get(key) ?? null)) {
                          delete attributes[key];
                        } else {
                          attributes[key] = value;
                        }
                      } else if (value !== null) {
                        item.delete(transaction);
                      }
                    }
                  } else if (this.deletes(item)) {
                    oldAttributes.set(key, value);
                    const curVal = currentAttributes.get(key) ?? null;
                    if (!equalAttrs(curVal, value)) {
                      if (action === "retain") {
                        addOp();
                      }
                      attributes[key] = curVal;
                    }
                  } else if (!item.deleted) {
                    oldAttributes.set(key, value);
                    const attr = attributes[key];
                    if (attr !== void 0) {
                      if (!equalAttrs(attr, value)) {
                        if (action === "retain") {
                          addOp();
                        }
                        if (value === null) {
                          delete attributes[key];
                        } else {
                          attributes[key] = value;
                        }
                      } else if (attr !== null) {
                        item.delete(transaction);
                      }
                    }
                  }
                  if (!item.deleted) {
                    if (action === "insert") {
                      addOp();
                    }
                    updateCurrentAttributes(
                      currentAttributes,
                      /** @type {ContentFormat} */
                      item.content
                    );
                  }
                  break;
                }
              }
              item = item.right;
            }
            addOp();
            while (delta.length > 0) {
              const lastOp = delta[delta.length - 1];
              if (lastOp.retain !== void 0 && lastOp.attributes === void 0) {
                delta.pop();
              } else {
                break;
              }
            }
          });
          this._delta = delta;
        }
        return (
          /** @type {any} */
          this._delta
        );
      }
    };
    YText = class _YText extends AbstractType {
      /**
       * @param {String} [string] The initial value of the YText.
       */
      constructor(string) {
        super();
        this._pending = string !== void 0 ? [() => this.insert(0, string)] : [];
        this._searchMarker = [];
        this._hasFormatting = false;
      }
      /**
       * Number of characters of this text type.
       *
       * @type {number}
       */
      get length() {
        this.doc ?? warnPrematureAccess();
        return this._length;
      }
      /**
       * @param {Doc} y
       * @param {Item} item
       */
      _integrate(y, item) {
        super._integrate(y, item);
        try {
          this._pending.forEach((f) => f());
        } catch (e) {
          console.error(e);
        }
        this._pending = null;
      }
      _copy() {
        return new _YText();
      }
      /**
       * Makes a copy of this data type that can be included somewhere else.
       *
       * Note that the content is only readable _after_ it has been included somewhere in the Ydoc.
       *
       * @return {YText}
       */
      clone() {
        const text2 = new _YText();
        text2.applyDelta(this.toDelta());
        return text2;
      }
      /**
       * Creates YTextEvent and calls observers.
       *
       * @param {Transaction} transaction
       * @param {Set<null|string>} parentSubs Keys changed on this type. `null` if list was modified.
       */
      _callObserver(transaction, parentSubs) {
        super._callObserver(transaction, parentSubs);
        const event = new YTextEvent(this, transaction, parentSubs);
        callTypeObservers(this, transaction, event);
        if (!transaction.local && this._hasFormatting) {
          transaction._needFormattingCleanup = true;
        }
      }
      /**
       * Returns the unformatted string representation of this YText type.
       *
       * @public
       */
      toString() {
        this.doc ?? warnPrematureAccess();
        let str = "";
        let n = this._start;
        while (n !== null) {
          if (!n.deleted && n.countable && n.content.constructor === ContentString) {
            str += /** @type {ContentString} */
            n.content.str;
          }
          n = n.right;
        }
        return str;
      }
      /**
       * Returns the unformatted string representation of this YText type.
       *
       * @return {string}
       * @public
       */
      toJSON() {
        return this.toString();
      }
      /**
       * Apply a {@link Delta} on this shared YText type.
       *
       * @param {Array<any>} delta The changes to apply on this element.
       * @param {object}  opts
       * @param {boolean} [opts.sanitize] Sanitize input delta. Removes ending newlines if set to true.
       *
       *
       * @public
       */
      applyDelta(delta, { sanitize = true } = {}) {
        if (this.doc !== null) {
          transact(this.doc, (transaction) => {
            const currPos = new ItemTextListPosition(null, this._start, 0, /* @__PURE__ */ new Map());
            for (let i = 0; i < delta.length; i++) {
              const op = delta[i];
              if (op.insert !== void 0) {
                const ins = !sanitize && typeof op.insert === "string" && i === delta.length - 1 && currPos.right === null && op.insert.slice(-1) === "\n" ? op.insert.slice(0, -1) : op.insert;
                if (typeof ins !== "string" || ins.length > 0) {
                  insertText(transaction, this, currPos, ins, op.attributes || {});
                }
              } else if (op.retain !== void 0) {
                formatText(transaction, this, currPos, op.retain, op.attributes || {});
              } else if (op.delete !== void 0) {
                deleteText(transaction, currPos, op.delete);
              }
            }
          });
        } else {
          this._pending.push(() => this.applyDelta(delta));
        }
      }
      /**
       * Returns the Delta representation of this YText type.
       *
       * @param {Snapshot} [snapshot]
       * @param {Snapshot} [prevSnapshot]
       * @param {function('removed' | 'added', ID):any} [computeYChange]
       * @return {any} The Delta representation of this type.
       *
       * @public
       */
      toDelta(snapshot2, prevSnapshot, computeYChange) {
        this.doc ?? warnPrematureAccess();
        const ops = [];
        const currentAttributes = /* @__PURE__ */ new Map();
        const doc2 = (
          /** @type {Doc} */
          this.doc
        );
        let str = "";
        let n = this._start;
        function packStr() {
          if (str.length > 0) {
            const attributes = {};
            let addAttributes = false;
            currentAttributes.forEach((value, key) => {
              addAttributes = true;
              attributes[key] = value;
            });
            const op = { insert: str };
            if (addAttributes) {
              op.attributes = attributes;
            }
            ops.push(op);
            str = "";
          }
        }
        const computeDelta = () => {
          while (n !== null) {
            if (isVisible(n, snapshot2) || prevSnapshot !== void 0 && isVisible(n, prevSnapshot)) {
              switch (n.content.constructor) {
                case ContentString: {
                  const cur = currentAttributes.get("ychange");
                  if (snapshot2 !== void 0 && !isVisible(n, snapshot2)) {
                    if (cur === void 0 || cur.user !== n.id.client || cur.type !== "removed") {
                      packStr();
                      currentAttributes.set("ychange", computeYChange ? computeYChange("removed", n.id) : { type: "removed" });
                    }
                  } else if (prevSnapshot !== void 0 && !isVisible(n, prevSnapshot)) {
                    if (cur === void 0 || cur.user !== n.id.client || cur.type !== "added") {
                      packStr();
                      currentAttributes.set("ychange", computeYChange ? computeYChange("added", n.id) : { type: "added" });
                    }
                  } else if (cur !== void 0) {
                    packStr();
                    currentAttributes.delete("ychange");
                  }
                  str += /** @type {ContentString} */
                  n.content.str;
                  break;
                }
                case ContentType:
                case ContentEmbed: {
                  packStr();
                  const op = {
                    insert: n.content.getContent()[0]
                  };
                  if (currentAttributes.size > 0) {
                    const attrs = (
                      /** @type {Object<string,any>} */
                      {}
                    );
                    op.attributes = attrs;
                    currentAttributes.forEach((value, key) => {
                      attrs[key] = value;
                    });
                  }
                  ops.push(op);
                  break;
                }
                case ContentFormat:
                  if (isVisible(n, snapshot2)) {
                    packStr();
                    updateCurrentAttributes(
                      currentAttributes,
                      /** @type {ContentFormat} */
                      n.content
                    );
                  }
                  break;
              }
            }
            n = n.right;
          }
          packStr();
        };
        if (snapshot2 || prevSnapshot) {
          transact(doc2, (transaction) => {
            if (snapshot2) {
              splitSnapshotAffectedStructs(transaction, snapshot2);
            }
            if (prevSnapshot) {
              splitSnapshotAffectedStructs(transaction, prevSnapshot);
            }
            computeDelta();
          }, "cleanup");
        } else {
          computeDelta();
        }
        return ops;
      }
      /**
       * Insert text at a given index.
       *
       * @param {number} index The index at which to start inserting.
       * @param {String} text The text to insert at the specified position.
       * @param {TextAttributes} [attributes] Optionally define some formatting
       *                                    information to apply on the inserted
       *                                    Text.
       * @public
       */
      insert(index, text2, attributes) {
        if (text2.length <= 0) {
          return;
        }
        const y = this.doc;
        if (y !== null) {
          transact(y, (transaction) => {
            const pos = findPosition(transaction, this, index, !attributes);
            if (!attributes) {
              attributes = {};
              pos.currentAttributes.forEach((v, k) => {
                attributes[k] = v;
              });
            }
            insertText(transaction, this, pos, text2, attributes);
          });
        } else {
          this._pending.push(() => this.insert(index, text2, attributes));
        }
      }
      /**
       * Inserts an embed at a index.
       *
       * @param {number} index The index to insert the embed at.
       * @param {Object | AbstractType<any>} embed The Object that represents the embed.
       * @param {TextAttributes} [attributes] Attribute information to apply on the
       *                                    embed
       *
       * @public
       */
      insertEmbed(index, embed, attributes) {
        const y = this.doc;
        if (y !== null) {
          transact(y, (transaction) => {
            const pos = findPosition(transaction, this, index, !attributes);
            insertText(transaction, this, pos, embed, attributes || {});
          });
        } else {
          this._pending.push(() => this.insertEmbed(index, embed, attributes || {}));
        }
      }
      /**
       * Deletes text starting from an index.
       *
       * @param {number} index Index at which to start deleting.
       * @param {number} length The number of characters to remove. Defaults to 1.
       *
       * @public
       */
      delete(index, length2) {
        if (length2 === 0) {
          return;
        }
        const y = this.doc;
        if (y !== null) {
          transact(y, (transaction) => {
            deleteText(transaction, findPosition(transaction, this, index, true), length2);
          });
        } else {
          this._pending.push(() => this.delete(index, length2));
        }
      }
      /**
       * Assigns properties to a range of text.
       *
       * @param {number} index The position where to start formatting.
       * @param {number} length The amount of characters to assign properties to.
       * @param {TextAttributes} attributes Attribute information to apply on the
       *                                    text.
       *
       * @public
       */
      format(index, length2, attributes) {
        if (length2 === 0) {
          return;
        }
        const y = this.doc;
        if (y !== null) {
          transact(y, (transaction) => {
            const pos = findPosition(transaction, this, index, false);
            if (pos.right === null) {
              return;
            }
            formatText(transaction, this, pos, length2, attributes);
          });
        } else {
          this._pending.push(() => this.format(index, length2, attributes));
        }
      }
      /**
       * Removes an attribute.
       *
       * @note Xml-Text nodes don't have attributes. You can use this feature to assign properties to complete text-blocks.
       *
       * @param {String} attributeName The attribute name that is to be removed.
       *
       * @public
       */
      removeAttribute(attributeName) {
        if (this.doc !== null) {
          transact(this.doc, (transaction) => {
            typeMapDelete(transaction, this, attributeName);
          });
        } else {
          this._pending.push(() => this.removeAttribute(attributeName));
        }
      }
      /**
       * Sets or updates an attribute.
       *
       * @note Xml-Text nodes don't have attributes. You can use this feature to assign properties to complete text-blocks.
       *
       * @param {String} attributeName The attribute name that is to be set.
       * @param {any} attributeValue The attribute value that is to be set.
       *
       * @public
       */
      setAttribute(attributeName, attributeValue) {
        if (this.doc !== null) {
          transact(this.doc, (transaction) => {
            typeMapSet(transaction, this, attributeName, attributeValue);
          });
        } else {
          this._pending.push(() => this.setAttribute(attributeName, attributeValue));
        }
      }
      /**
       * Returns an attribute value that belongs to the attribute name.
       *
       * @note Xml-Text nodes don't have attributes. You can use this feature to assign properties to complete text-blocks.
       *
       * @param {String} attributeName The attribute name that identifies the
       *                               queried value.
       * @return {any} The queried attribute value.
       *
       * @public
       */
      getAttribute(attributeName) {
        return (
          /** @type {any} */
          typeMapGet(this, attributeName)
        );
      }
      /**
       * Returns all attribute name/value pairs in a JSON Object.
       *
       * @note Xml-Text nodes don't have attributes. You can use this feature to assign properties to complete text-blocks.
       *
       * @return {Object<string, any>} A JSON Object that describes the attributes.
       *
       * @public
       */
      getAttributes() {
        return typeMapGetAll(this);
      }
      /**
       * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder
       */
      _write(encoder) {
        encoder.writeTypeRef(YTextRefID);
      }
    };
    readYText = (_decoder) => new YText();
    YXmlTreeWalker = class {
      /**
       * @param {YXmlFragment | YXmlElement} root
       * @param {function(AbstractType<any>):boolean} [f]
       */
      constructor(root, f = () => true) {
        this._filter = f;
        this._root = root;
        this._currentNode = /** @type {Item} */
        root._start;
        this._firstCall = true;
        root.doc ?? warnPrematureAccess();
      }
      [Symbol.iterator]() {
        return this;
      }
      /**
       * Get the next node.
       *
       * @return {IteratorResult<YXmlElement|YXmlText|YXmlHook>} The next node.
       *
       * @public
       */
      next() {
        let n = this._currentNode;
        let type = n && n.content && /** @type {any} */
        n.content.type;
        if (n !== null && (!this._firstCall || n.deleted || !this._filter(type))) {
          do {
            type = /** @type {any} */
            n.content.type;
            if (!n.deleted && (type.constructor === YXmlElement || type.constructor === YXmlFragment) && type._start !== null) {
              n = type._start;
            } else {
              while (n !== null) {
                const nxt = n.next;
                if (nxt !== null) {
                  n = nxt;
                  break;
                } else if (n.parent === this._root) {
                  n = null;
                } else {
                  n = /** @type {AbstractType<any>} */
                  n.parent._item;
                }
              }
            }
          } while (n !== null && (n.deleted || !this._filter(
            /** @type {ContentType} */
            n.content.type
          )));
        }
        this._firstCall = false;
        if (n === null) {
          return { value: void 0, done: true };
        }
        this._currentNode = n;
        return { value: (
          /** @type {any} */
          n.content.type
        ), done: false };
      }
    };
    YXmlFragment = class _YXmlFragment extends AbstractType {
      constructor() {
        super();
        this._prelimContent = [];
      }
      /**
       * @type {YXmlElement|YXmlText|null}
       */
      get firstChild() {
        const first = this._first;
        return first ? first.content.getContent()[0] : null;
      }
      /**
       * Integrate this type into the Yjs instance.
       *
       * * Save this struct in the os
       * * This type is sent to other client
       * * Observer functions are fired
       *
       * @param {Doc} y The Yjs instance
       * @param {Item} item
       */
      _integrate(y, item) {
        super._integrate(y, item);
        this.insert(
          0,
          /** @type {Array<any>} */
          this._prelimContent
        );
        this._prelimContent = null;
      }
      _copy() {
        return new _YXmlFragment();
      }
      /**
       * Makes a copy of this data type that can be included somewhere else.
       *
       * Note that the content is only readable _after_ it has been included somewhere in the Ydoc.
       *
       * @return {YXmlFragment}
       */
      clone() {
        const el = new _YXmlFragment();
        el.insert(0, this.toArray().map((item) => item instanceof AbstractType ? item.clone() : item));
        return el;
      }
      get length() {
        this.doc ?? warnPrematureAccess();
        return this._prelimContent === null ? this._length : this._prelimContent.length;
      }
      /**
       * Create a subtree of childNodes.
       *
       * @example
       * const walker = elem.createTreeWalker(dom => dom.nodeName === 'div')
       * for (let node in walker) {
       *   // `node` is a div node
       *   nop(node)
       * }
       *
       * @param {function(AbstractType<any>):boolean} filter Function that is called on each child element and
       *                          returns a Boolean indicating whether the child
       *                          is to be included in the subtree.
       * @return {YXmlTreeWalker} A subtree and a position within it.
       *
       * @public
       */
      createTreeWalker(filter) {
        return new YXmlTreeWalker(this, filter);
      }
      /**
       * Returns the first YXmlElement that matches the query.
       * Similar to DOM's {@link querySelector}.
       *
       * Query support:
       *   - tagname
       * TODO:
       *   - id
       *   - attribute
       *
       * @param {CSS_Selector} query The query on the children.
       * @return {YXmlElement|YXmlText|YXmlHook|null} The first element that matches the query or null.
       *
       * @public
       */
      querySelector(query) {
        query = query.toUpperCase();
        const iterator = new YXmlTreeWalker(this, (element2) => element2.nodeName && element2.nodeName.toUpperCase() === query);
        const next = iterator.next();
        if (next.done) {
          return null;
        } else {
          return next.value;
        }
      }
      /**
       * Returns all YXmlElements that match the query.
       * Similar to Dom's {@link querySelectorAll}.
       *
       * @todo Does not yet support all queries. Currently only query by tagName.
       *
       * @param {CSS_Selector} query The query on the children
       * @return {Array<YXmlElement|YXmlText|YXmlHook|null>} The elements that match this query.
       *
       * @public
       */
      querySelectorAll(query) {
        query = query.toUpperCase();
        return from(new YXmlTreeWalker(this, (element2) => element2.nodeName && element2.nodeName.toUpperCase() === query));
      }
      /**
       * Creates YXmlEvent and calls observers.
       *
       * @param {Transaction} transaction
       * @param {Set<null|string>} parentSubs Keys changed on this type. `null` if list was modified.
       */
      _callObserver(transaction, parentSubs) {
        callTypeObservers(this, transaction, new YXmlEvent(this, parentSubs, transaction));
      }
      /**
       * Get the string representation of all the children of this YXmlFragment.
       *
       * @return {string} The string representation of all children.
       */
      toString() {
        return typeListMap(this, (xml) => xml.toString()).join("");
      }
      /**
       * @return {string}
       */
      toJSON() {
        return this.toString();
      }
      /**
       * Creates a Dom Element that mirrors this YXmlElement.
       *
       * @param {Document} [_document=document] The document object (you must define
       *                                        this when calling this method in
       *                                        nodejs)
       * @param {Object<string, any>} [hooks={}] Optional property to customize how hooks
       *                                             are presented in the DOM
       * @param {any} [binding] You should not set this property. This is
       *                               used if DomBinding wants to create a
       *                               association to the created DOM type.
       * @return {Node} The {@link https://developer.mozilla.org/en-US/docs/Web/API/Element|Dom Element}
       *
       * @public
       */
      toDOM(_document = document, hooks = {}, binding) {
        const fragment = _document.createDocumentFragment();
        if (binding !== void 0) {
          binding._createAssociation(fragment, this);
        }
        typeListForEach(this, (xmlType) => {
          fragment.insertBefore(xmlType.toDOM(_document, hooks, binding), null);
        });
        return fragment;
      }
      /**
       * Inserts new content at an index.
       *
       * @example
       *  // Insert character 'a' at position 0
       *  xml.insert(0, [new Y.XmlText('text')])
       *
       * @param {number} index The index to insert content at
       * @param {Array<YXmlElement|YXmlText>} content The array of content
       */
      insert(index, content) {
        if (this.doc !== null) {
          transact(this.doc, (transaction) => {
            typeListInsertGenerics(transaction, this, index, content);
          });
        } else {
          this._prelimContent.splice(index, 0, ...content);
        }
      }
      /**
       * Inserts new content at an index.
       *
       * @example
       *  // Insert character 'a' at position 0
       *  xml.insert(0, [new Y.XmlText('text')])
       *
       * @param {null|Item|YXmlElement|YXmlText} ref The index to insert content at
       * @param {Array<YXmlElement|YXmlText>} content The array of content
       */
      insertAfter(ref, content) {
        if (this.doc !== null) {
          transact(this.doc, (transaction) => {
            const refItem = ref && ref instanceof AbstractType ? ref._item : ref;
            typeListInsertGenericsAfter(transaction, this, refItem, content);
          });
        } else {
          const pc = (
            /** @type {Array<any>} */
            this._prelimContent
          );
          const index = ref === null ? 0 : pc.findIndex((el) => el === ref) + 1;
          if (index === 0 && ref !== null) {
            throw create3("Reference item not found");
          }
          pc.splice(index, 0, ...content);
        }
      }
      /**
       * Deletes elements starting from an index.
       *
       * @param {number} index Index at which to start deleting elements
       * @param {number} [length=1] The number of elements to remove. Defaults to 1.
       */
      delete(index, length2 = 1) {
        if (this.doc !== null) {
          transact(this.doc, (transaction) => {
            typeListDelete(transaction, this, index, length2);
          });
        } else {
          this._prelimContent.splice(index, length2);
        }
      }
      /**
       * Transforms this YArray to a JavaScript Array.
       *
       * @return {Array<YXmlElement|YXmlText|YXmlHook>}
       */
      toArray() {
        return typeListToArray(this);
      }
      /**
       * Appends content to this YArray.
       *
       * @param {Array<YXmlElement|YXmlText>} content Array of content to append.
       */
      push(content) {
        this.insert(this.length, content);
      }
      /**
       * Prepends content to this YArray.
       *
       * @param {Array<YXmlElement|YXmlText>} content Array of content to prepend.
       */
      unshift(content) {
        this.insert(0, content);
      }
      /**
       * Returns the i-th element from a YArray.
       *
       * @param {number} index The index of the element to return from the YArray
       * @return {YXmlElement|YXmlText}
       */
      get(index) {
        return typeListGet(this, index);
      }
      /**
       * Returns a portion of this YXmlFragment into a JavaScript Array selected
       * from start to end (end not included).
       *
       * @param {number} [start]
       * @param {number} [end]
       * @return {Array<YXmlElement|YXmlText>}
       */
      slice(start = 0, end = this.length) {
        return typeListSlice(this, start, end);
      }
      /**
       * Executes a provided function on once on every child element.
       *
       * @param {function(YXmlElement|YXmlText,number, typeof self):void} f A function to execute on every element of this YArray.
       */
      forEach(f) {
        typeListForEach(this, f);
      }
      /**
       * Transform the properties of this type to binary and write it to an
       * BinaryEncoder.
       *
       * This is called when this Item is sent to a remote peer.
       *
       * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder The encoder to write data to.
       */
      _write(encoder) {
        encoder.writeTypeRef(YXmlFragmentRefID);
      }
    };
    readYXmlFragment = (_decoder) => new YXmlFragment();
    YXmlElement = class _YXmlElement extends YXmlFragment {
      constructor(nodeName = "UNDEFINED") {
        super();
        this.nodeName = nodeName;
        this._prelimAttrs = /* @__PURE__ */ new Map();
      }
      /**
       * @type {YXmlElement|YXmlText|null}
       */
      get nextSibling() {
        const n = this._item ? this._item.next : null;
        return n ? (
          /** @type {YXmlElement|YXmlText} */
          /** @type {ContentType} */
          n.content.type
        ) : null;
      }
      /**
       * @type {YXmlElement|YXmlText|null}
       */
      get prevSibling() {
        const n = this._item ? this._item.prev : null;
        return n ? (
          /** @type {YXmlElement|YXmlText} */
          /** @type {ContentType} */
          n.content.type
        ) : null;
      }
      /**
       * Integrate this type into the Yjs instance.
       *
       * * Save this struct in the os
       * * This type is sent to other client
       * * Observer functions are fired
       *
       * @param {Doc} y The Yjs instance
       * @param {Item} item
       */
      _integrate(y, item) {
        super._integrate(y, item);
        /** @type {Map<string, any>} */
        this._prelimAttrs.forEach((value, key) => {
          this.setAttribute(key, value);
        });
        this._prelimAttrs = null;
      }
      /**
       * Creates an Item with the same effect as this Item (without position effect)
       *
       * @return {YXmlElement}
       */
      _copy() {
        return new _YXmlElement(this.nodeName);
      }
      /**
       * Makes a copy of this data type that can be included somewhere else.
       *
       * Note that the content is only readable _after_ it has been included somewhere in the Ydoc.
       *
       * @return {YXmlElement<KV>}
       */
      clone() {
        const el = new _YXmlElement(this.nodeName);
        const attrs = this.getAttributes();
        forEach(attrs, (value, key) => {
          el.setAttribute(
            key,
            /** @type {any} */
            value
          );
        });
        el.insert(0, this.toArray().map((v) => v instanceof AbstractType ? v.clone() : v));
        return el;
      }
      /**
       * Returns the XML serialization of this YXmlElement.
       * The attributes are ordered by attribute-name, so you can easily use this
       * method to compare YXmlElements
       *
       * @return {string} The string representation of this type.
       *
       * @public
       */
      toString() {
        const attrs = this.getAttributes();
        const stringBuilder = [];
        const keys2 = [];
        for (const key in attrs) {
          keys2.push(key);
        }
        keys2.sort();
        const keysLen = keys2.length;
        for (let i = 0; i < keysLen; i++) {
          const key = keys2[i];
          stringBuilder.push(key + '="' + attrs[key] + '"');
        }
        const nodeName = this.nodeName.toLocaleLowerCase();
        const attrsString = stringBuilder.length > 0 ? " " + stringBuilder.join(" ") : "";
        return `<${nodeName}${attrsString}>${super.toString()}</${nodeName}>`;
      }
      /**
       * Removes an attribute from this YXmlElement.
       *
       * @param {string} attributeName The attribute name that is to be removed.
       *
       * @public
       */
      removeAttribute(attributeName) {
        if (this.doc !== null) {
          transact(this.doc, (transaction) => {
            typeMapDelete(transaction, this, attributeName);
          });
        } else {
          this._prelimAttrs.delete(attributeName);
        }
      }
      /**
       * Sets or updates an attribute.
       *
       * @template {keyof KV & string} KEY
       *
       * @param {KEY} attributeName The attribute name that is to be set.
       * @param {KV[KEY]} attributeValue The attribute value that is to be set.
       *
       * @public
       */
      setAttribute(attributeName, attributeValue) {
        if (this.doc !== null) {
          transact(this.doc, (transaction) => {
            typeMapSet(transaction, this, attributeName, attributeValue);
          });
        } else {
          this._prelimAttrs.set(attributeName, attributeValue);
        }
      }
      /**
       * Returns an attribute value that belongs to the attribute name.
       *
       * @template {keyof KV & string} KEY
       *
       * @param {KEY} attributeName The attribute name that identifies the
       *                               queried value.
       * @return {KV[KEY]|undefined} The queried attribute value.
       *
       * @public
       */
      getAttribute(attributeName) {
        return (
          /** @type {any} */
          typeMapGet(this, attributeName)
        );
      }
      /**
       * Returns whether an attribute exists
       *
       * @param {string} attributeName The attribute name to check for existence.
       * @return {boolean} whether the attribute exists.
       *
       * @public
       */
      hasAttribute(attributeName) {
        return (
          /** @type {any} */
          typeMapHas(this, attributeName)
        );
      }
      /**
       * Returns all attribute name/value pairs in a JSON Object.
       *
       * @param {Snapshot} [snapshot]
       * @return {{ [Key in Extract<keyof KV,string>]?: KV[Key]}} A JSON Object that describes the attributes.
       *
       * @public
       */
      getAttributes(snapshot2) {
        return (
          /** @type {any} */
          snapshot2 ? typeMapGetAllSnapshot(this, snapshot2) : typeMapGetAll(this)
        );
      }
      /**
       * Creates a Dom Element that mirrors this YXmlElement.
       *
       * @param {Document} [_document=document] The document object (you must define
       *                                        this when calling this method in
       *                                        nodejs)
       * @param {Object<string, any>} [hooks={}] Optional property to customize how hooks
       *                                             are presented in the DOM
       * @param {any} [binding] You should not set this property. This is
       *                               used if DomBinding wants to create a
       *                               association to the created DOM type.
       * @return {Node} The {@link https://developer.mozilla.org/en-US/docs/Web/API/Element|Dom Element}
       *
       * @public
       */
      toDOM(_document = document, hooks = {}, binding) {
        const dom = _document.createElement(this.nodeName);
        const attrs = this.getAttributes();
        for (const key in attrs) {
          const value = attrs[key];
          if (typeof value === "string") {
            dom.setAttribute(key, value);
          }
        }
        typeListForEach(this, (yxml) => {
          dom.appendChild(yxml.toDOM(_document, hooks, binding));
        });
        if (binding !== void 0) {
          binding._createAssociation(dom, this);
        }
        return dom;
      }
      /**
       * Transform the properties of this type to binary and write it to an
       * BinaryEncoder.
       *
       * This is called when this Item is sent to a remote peer.
       *
       * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder The encoder to write data to.
       */
      _write(encoder) {
        encoder.writeTypeRef(YXmlElementRefID);
        encoder.writeKey(this.nodeName);
      }
    };
    readYXmlElement = (decoder) => new YXmlElement(decoder.readKey());
    YXmlEvent = class extends YEvent {
      /**
       * @param {YXmlElement|YXmlText|YXmlFragment} target The target on which the event is created.
       * @param {Set<string|null>} subs The set of changed attributes. `null` is included if the
       *                   child list changed.
       * @param {Transaction} transaction The transaction instance with which the
       *                                  change was created.
       */
      constructor(target, subs, transaction) {
        super(target, transaction);
        this.childListChanged = false;
        this.attributesChanged = /* @__PURE__ */ new Set();
        subs.forEach((sub) => {
          if (sub === null) {
            this.childListChanged = true;
          } else {
            this.attributesChanged.add(sub);
          }
        });
      }
    };
    YXmlHook = class _YXmlHook extends YMap {
      /**
       * @param {string} hookName nodeName of the Dom Node.
       */
      constructor(hookName) {
        super();
        this.hookName = hookName;
      }
      /**
       * Creates an Item with the same effect as this Item (without position effect)
       */
      _copy() {
        return new _YXmlHook(this.hookName);
      }
      /**
       * Makes a copy of this data type that can be included somewhere else.
       *
       * Note that the content is only readable _after_ it has been included somewhere in the Ydoc.
       *
       * @return {YXmlHook}
       */
      clone() {
        const el = new _YXmlHook(this.hookName);
        this.forEach((value, key) => {
          el.set(key, value);
        });
        return el;
      }
      /**
       * Creates a Dom Element that mirrors this YXmlElement.
       *
       * @param {Document} [_document=document] The document object (you must define
       *                                        this when calling this method in
       *                                        nodejs)
       * @param {Object.<string, any>} [hooks] Optional property to customize how hooks
       *                                             are presented in the DOM
       * @param {any} [binding] You should not set this property. This is
       *                               used if DomBinding wants to create a
       *                               association to the created DOM type
       * @return {Element} The {@link https://developer.mozilla.org/en-US/docs/Web/API/Element|Dom Element}
       *
       * @public
       */
      toDOM(_document = document, hooks = {}, binding) {
        const hook = hooks[this.hookName];
        let dom;
        if (hook !== void 0) {
          dom = hook.createDom(this);
        } else {
          dom = document.createElement(this.hookName);
        }
        dom.setAttribute("data-yjs-hook", this.hookName);
        if (binding !== void 0) {
          binding._createAssociation(dom, this);
        }
        return dom;
      }
      /**
       * Transform the properties of this type to binary and write it to an
       * BinaryEncoder.
       *
       * This is called when this Item is sent to a remote peer.
       *
       * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder The encoder to write data to.
       */
      _write(encoder) {
        encoder.writeTypeRef(YXmlHookRefID);
        encoder.writeKey(this.hookName);
      }
    };
    readYXmlHook = (decoder) => new YXmlHook(decoder.readKey());
    YXmlText = class _YXmlText extends YText {
      /**
       * @type {YXmlElement|YXmlText|null}
       */
      get nextSibling() {
        const n = this._item ? this._item.next : null;
        return n ? (
          /** @type {YXmlElement|YXmlText} */
          /** @type {ContentType} */
          n.content.type
        ) : null;
      }
      /**
       * @type {YXmlElement|YXmlText|null}
       */
      get prevSibling() {
        const n = this._item ? this._item.prev : null;
        return n ? (
          /** @type {YXmlElement|YXmlText} */
          /** @type {ContentType} */
          n.content.type
        ) : null;
      }
      _copy() {
        return new _YXmlText();
      }
      /**
       * Makes a copy of this data type that can be included somewhere else.
       *
       * Note that the content is only readable _after_ it has been included somewhere in the Ydoc.
       *
       * @return {YXmlText}
       */
      clone() {
        const text2 = new _YXmlText();
        text2.applyDelta(this.toDelta());
        return text2;
      }
      /**
       * Creates a Dom Element that mirrors this YXmlText.
       *
       * @param {Document} [_document=document] The document object (you must define
       *                                        this when calling this method in
       *                                        nodejs)
       * @param {Object<string, any>} [hooks] Optional property to customize how hooks
       *                                             are presented in the DOM
       * @param {any} [binding] You should not set this property. This is
       *                               used if DomBinding wants to create a
       *                               association to the created DOM type.
       * @return {Text} The {@link https://developer.mozilla.org/en-US/docs/Web/API/Element|Dom Element}
       *
       * @public
       */
      toDOM(_document = document, hooks, binding) {
        const dom = _document.createTextNode(this.toString());
        if (binding !== void 0) {
          binding._createAssociation(dom, this);
        }
        return dom;
      }
      toString() {
        return this.toDelta().map((delta) => {
          const nestedNodes = [];
          for (const nodeName in delta.attributes) {
            const attrs = [];
            for (const key in delta.attributes[nodeName]) {
              attrs.push({ key, value: delta.attributes[nodeName][key] });
            }
            attrs.sort((a, b) => a.key < b.key ? -1 : 1);
            nestedNodes.push({ nodeName, attrs });
          }
          nestedNodes.sort((a, b) => a.nodeName < b.nodeName ? -1 : 1);
          let str = "";
          for (let i = 0; i < nestedNodes.length; i++) {
            const node = nestedNodes[i];
            str += `<${node.nodeName}`;
            for (let j = 0; j < node.attrs.length; j++) {
              const attr = node.attrs[j];
              str += ` ${attr.key}="${attr.value}"`;
            }
            str += ">";
          }
          str += delta.insert;
          for (let i = nestedNodes.length - 1; i >= 0; i--) {
            str += `</${nestedNodes[i].nodeName}>`;
          }
          return str;
        }).join("");
      }
      /**
       * @return {string}
       */
      toJSON() {
        return this.toString();
      }
      /**
       * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder
       */
      _write(encoder) {
        encoder.writeTypeRef(YXmlTextRefID);
      }
    };
    readYXmlText = (decoder) => new YXmlText();
    AbstractStruct = class {
      /**
       * @param {ID} id
       * @param {number} length
       */
      constructor(id2, length2) {
        this.id = id2;
        this.length = length2;
      }
      /**
       * @type {boolean}
       */
      get deleted() {
        throw methodUnimplemented();
      }
      /**
       * Merge this struct with the item to the right.
       * This method is already assuming that `this.id.clock + this.length === this.id.clock`.
       * Also this method does *not* remove right from StructStore!
       * @param {AbstractStruct} right
       * @return {boolean} whether this merged with right
       */
      mergeWith(right) {
        return false;
      }
      /**
       * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder The encoder to write data to.
       * @param {number} offset
       * @param {number} encodingRef
       */
      write(encoder, offset, encodingRef) {
        throw methodUnimplemented();
      }
      /**
       * @param {Transaction} transaction
       * @param {number} offset
       */
      integrate(transaction, offset) {
        throw methodUnimplemented();
      }
    };
    structGCRefNumber = 0;
    GC = class extends AbstractStruct {
      get deleted() {
        return true;
      }
      delete() {
      }
      /**
       * @param {GC} right
       * @return {boolean}
       */
      mergeWith(right) {
        if (this.constructor !== right.constructor) {
          return false;
        }
        this.length += right.length;
        return true;
      }
      /**
       * @param {Transaction} transaction
       * @param {number} offset
       */
      integrate(transaction, offset) {
        if (offset > 0) {
          this.id.clock += offset;
          this.length -= offset;
        }
        addStruct(transaction.doc.store, this);
      }
      /**
       * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder
       * @param {number} offset
       */
      write(encoder, offset) {
        encoder.writeInfo(structGCRefNumber);
        encoder.writeLen(this.length - offset);
      }
      /**
       * @param {Transaction} transaction
       * @param {StructStore} store
       * @return {null | number}
       */
      getMissing(transaction, store) {
        return null;
      }
    };
    ContentBinary = class _ContentBinary {
      /**
       * @param {Uint8Array} content
       */
      constructor(content) {
        this.content = content;
      }
      /**
       * @return {number}
       */
      getLength() {
        return 1;
      }
      /**
       * @return {Array<any>}
       */
      getContent() {
        return [this.content];
      }
      /**
       * @return {boolean}
       */
      isCountable() {
        return true;
      }
      /**
       * @return {ContentBinary}
       */
      copy() {
        return new _ContentBinary(this.content);
      }
      /**
       * @param {number} offset
       * @return {ContentBinary}
       */
      splice(offset) {
        throw methodUnimplemented();
      }
      /**
       * @param {ContentBinary} right
       * @return {boolean}
       */
      mergeWith(right) {
        return false;
      }
      /**
       * @param {Transaction} transaction
       * @param {Item} item
       */
      integrate(transaction, item) {
      }
      /**
       * @param {Transaction} transaction
       */
      delete(transaction) {
      }
      /**
       * @param {StructStore} store
       */
      gc(store) {
      }
      /**
       * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder
       * @param {number} offset
       */
      write(encoder, offset) {
        encoder.writeBuf(this.content);
      }
      /**
       * @return {number}
       */
      getRef() {
        return 3;
      }
    };
    readContentBinary = (decoder) => new ContentBinary(decoder.readBuf());
    ContentDeleted = class _ContentDeleted {
      /**
       * @param {number} len
       */
      constructor(len) {
        this.len = len;
      }
      /**
       * @return {number}
       */
      getLength() {
        return this.len;
      }
      /**
       * @return {Array<any>}
       */
      getContent() {
        return [];
      }
      /**
       * @return {boolean}
       */
      isCountable() {
        return false;
      }
      /**
       * @return {ContentDeleted}
       */
      copy() {
        return new _ContentDeleted(this.len);
      }
      /**
       * @param {number} offset
       * @return {ContentDeleted}
       */
      splice(offset) {
        const right = new _ContentDeleted(this.len - offset);
        this.len = offset;
        return right;
      }
      /**
       * @param {ContentDeleted} right
       * @return {boolean}
       */
      mergeWith(right) {
        this.len += right.len;
        return true;
      }
      /**
       * @param {Transaction} transaction
       * @param {Item} item
       */
      integrate(transaction, item) {
        addToDeleteSet(transaction.deleteSet, item.id.client, item.id.clock, this.len);
        item.markDeleted();
      }
      /**
       * @param {Transaction} transaction
       */
      delete(transaction) {
      }
      /**
       * @param {StructStore} store
       */
      gc(store) {
      }
      /**
       * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder
       * @param {number} offset
       */
      write(encoder, offset) {
        encoder.writeLen(this.len - offset);
      }
      /**
       * @return {number}
       */
      getRef() {
        return 1;
      }
    };
    readContentDeleted = (decoder) => new ContentDeleted(decoder.readLen());
    createDocFromOpts = (guid, opts) => new Doc({ guid, ...opts, shouldLoad: opts.shouldLoad || opts.autoLoad || false });
    ContentDoc = class _ContentDoc {
      /**
       * @param {Doc} doc
       */
      constructor(doc2) {
        if (doc2._item) {
          console.error("This document was already integrated as a sub-document. You should create a second instance instead with the same guid.");
        }
        this.doc = doc2;
        const opts = {};
        this.opts = opts;
        if (!doc2.gc) {
          opts.gc = false;
        }
        if (doc2.autoLoad) {
          opts.autoLoad = true;
        }
        if (doc2.meta !== null) {
          opts.meta = doc2.meta;
        }
      }
      /**
       * @return {number}
       */
      getLength() {
        return 1;
      }
      /**
       * @return {Array<any>}
       */
      getContent() {
        return [this.doc];
      }
      /**
       * @return {boolean}
       */
      isCountable() {
        return true;
      }
      /**
       * @return {ContentDoc}
       */
      copy() {
        return new _ContentDoc(createDocFromOpts(this.doc.guid, this.opts));
      }
      /**
       * @param {number} offset
       * @return {ContentDoc}
       */
      splice(offset) {
        throw methodUnimplemented();
      }
      /**
       * @param {ContentDoc} right
       * @return {boolean}
       */
      mergeWith(right) {
        return false;
      }
      /**
       * @param {Transaction} transaction
       * @param {Item} item
       */
      integrate(transaction, item) {
        this.doc._item = item;
        transaction.subdocsAdded.add(this.doc);
        if (this.doc.shouldLoad) {
          transaction.subdocsLoaded.add(this.doc);
        }
      }
      /**
       * @param {Transaction} transaction
       */
      delete(transaction) {
        if (transaction.subdocsAdded.has(this.doc)) {
          transaction.subdocsAdded.delete(this.doc);
        } else {
          transaction.subdocsRemoved.add(this.doc);
        }
      }
      /**
       * @param {StructStore} store
       */
      gc(store) {
      }
      /**
       * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder
       * @param {number} offset
       */
      write(encoder, offset) {
        encoder.writeString(this.doc.guid);
        encoder.writeAny(this.opts);
      }
      /**
       * @return {number}
       */
      getRef() {
        return 9;
      }
    };
    readContentDoc = (decoder) => new ContentDoc(createDocFromOpts(decoder.readString(), decoder.readAny()));
    ContentEmbed = class _ContentEmbed {
      /**
       * @param {Object} embed
       */
      constructor(embed) {
        this.embed = embed;
      }
      /**
       * @return {number}
       */
      getLength() {
        return 1;
      }
      /**
       * @return {Array<any>}
       */
      getContent() {
        return [this.embed];
      }
      /**
       * @return {boolean}
       */
      isCountable() {
        return true;
      }
      /**
       * @return {ContentEmbed}
       */
      copy() {
        return new _ContentEmbed(this.embed);
      }
      /**
       * @param {number} offset
       * @return {ContentEmbed}
       */
      splice(offset) {
        throw methodUnimplemented();
      }
      /**
       * @param {ContentEmbed} right
       * @return {boolean}
       */
      mergeWith(right) {
        return false;
      }
      /**
       * @param {Transaction} transaction
       * @param {Item} item
       */
      integrate(transaction, item) {
      }
      /**
       * @param {Transaction} transaction
       */
      delete(transaction) {
      }
      /**
       * @param {StructStore} store
       */
      gc(store) {
      }
      /**
       * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder
       * @param {number} offset
       */
      write(encoder, offset) {
        encoder.writeJSON(this.embed);
      }
      /**
       * @return {number}
       */
      getRef() {
        return 5;
      }
    };
    readContentEmbed = (decoder) => new ContentEmbed(decoder.readJSON());
    ContentFormat = class _ContentFormat {
      /**
       * @param {string} key
       * @param {Object} value
       */
      constructor(key, value) {
        this.key = key;
        this.value = value;
      }
      /**
       * @return {number}
       */
      getLength() {
        return 1;
      }
      /**
       * @return {Array<any>}
       */
      getContent() {
        return [];
      }
      /**
       * @return {boolean}
       */
      isCountable() {
        return false;
      }
      /**
       * @return {ContentFormat}
       */
      copy() {
        return new _ContentFormat(this.key, this.value);
      }
      /**
       * @param {number} _offset
       * @return {ContentFormat}
       */
      splice(_offset) {
        throw methodUnimplemented();
      }
      /**
       * @param {ContentFormat} _right
       * @return {boolean}
       */
      mergeWith(_right) {
        return false;
      }
      /**
       * @param {Transaction} _transaction
       * @param {Item} item
       */
      integrate(_transaction, item) {
        const p = (
          /** @type {YText} */
          item.parent
        );
        p._searchMarker = null;
        p._hasFormatting = true;
      }
      /**
       * @param {Transaction} transaction
       */
      delete(transaction) {
      }
      /**
       * @param {StructStore} store
       */
      gc(store) {
      }
      /**
       * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder
       * @param {number} offset
       */
      write(encoder, offset) {
        encoder.writeKey(this.key);
        encoder.writeJSON(this.value);
      }
      /**
       * @return {number}
       */
      getRef() {
        return 6;
      }
    };
    readContentFormat = (decoder) => new ContentFormat(decoder.readKey(), decoder.readJSON());
    ContentJSON = class _ContentJSON {
      /**
       * @param {Array<any>} arr
       */
      constructor(arr) {
        this.arr = arr;
      }
      /**
       * @return {number}
       */
      getLength() {
        return this.arr.length;
      }
      /**
       * @return {Array<any>}
       */
      getContent() {
        return this.arr;
      }
      /**
       * @return {boolean}
       */
      isCountable() {
        return true;
      }
      /**
       * @return {ContentJSON}
       */
      copy() {
        return new _ContentJSON(this.arr);
      }
      /**
       * @param {number} offset
       * @return {ContentJSON}
       */
      splice(offset) {
        const right = new _ContentJSON(this.arr.slice(offset));
        this.arr = this.arr.slice(0, offset);
        return right;
      }
      /**
       * @param {ContentJSON} right
       * @return {boolean}
       */
      mergeWith(right) {
        this.arr = this.arr.concat(right.arr);
        return true;
      }
      /**
       * @param {Transaction} transaction
       * @param {Item} item
       */
      integrate(transaction, item) {
      }
      /**
       * @param {Transaction} transaction
       */
      delete(transaction) {
      }
      /**
       * @param {StructStore} store
       */
      gc(store) {
      }
      /**
       * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder
       * @param {number} offset
       */
      write(encoder, offset) {
        const len = this.arr.length;
        encoder.writeLen(len - offset);
        for (let i = offset; i < len; i++) {
          const c = this.arr[i];
          encoder.writeString(c === void 0 ? "undefined" : JSON.stringify(c));
        }
      }
      /**
       * @return {number}
       */
      getRef() {
        return 2;
      }
    };
    readContentJSON = (decoder) => {
      const len = decoder.readLen();
      const cs = [];
      for (let i = 0; i < len; i++) {
        const c = decoder.readString();
        if (c === "undefined") {
          cs.push(void 0);
        } else {
          cs.push(JSON.parse(c));
        }
      }
      return new ContentJSON(cs);
    };
    isDevMode = getVariable("node_env") === "development";
    ContentAny = class _ContentAny {
      /**
       * @param {Array<any>} arr
       */
      constructor(arr) {
        this.arr = arr;
        isDevMode && deepFreeze(arr);
      }
      /**
       * @return {number}
       */
      getLength() {
        return this.arr.length;
      }
      /**
       * @return {Array<any>}
       */
      getContent() {
        return this.arr;
      }
      /**
       * @return {boolean}
       */
      isCountable() {
        return true;
      }
      /**
       * @return {ContentAny}
       */
      copy() {
        return new _ContentAny(this.arr);
      }
      /**
       * @param {number} offset
       * @return {ContentAny}
       */
      splice(offset) {
        const right = new _ContentAny(this.arr.slice(offset));
        this.arr = this.arr.slice(0, offset);
        return right;
      }
      /**
       * @param {ContentAny} right
       * @return {boolean}
       */
      mergeWith(right) {
        this.arr = this.arr.concat(right.arr);
        return true;
      }
      /**
       * @param {Transaction} transaction
       * @param {Item} item
       */
      integrate(transaction, item) {
      }
      /**
       * @param {Transaction} transaction
       */
      delete(transaction) {
      }
      /**
       * @param {StructStore} store
       */
      gc(store) {
      }
      /**
       * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder
       * @param {number} offset
       */
      write(encoder, offset) {
        const len = this.arr.length;
        encoder.writeLen(len - offset);
        for (let i = offset; i < len; i++) {
          const c = this.arr[i];
          encoder.writeAny(c);
        }
      }
      /**
       * @return {number}
       */
      getRef() {
        return 8;
      }
    };
    readContentAny = (decoder) => {
      const len = decoder.readLen();
      const cs = [];
      for (let i = 0; i < len; i++) {
        cs.push(decoder.readAny());
      }
      return new ContentAny(cs);
    };
    ContentString = class _ContentString {
      /**
       * @param {string} str
       */
      constructor(str) {
        this.str = str;
      }
      /**
       * @return {number}
       */
      getLength() {
        return this.str.length;
      }
      /**
       * @return {Array<any>}
       */
      getContent() {
        return this.str.split("");
      }
      /**
       * @return {boolean}
       */
      isCountable() {
        return true;
      }
      /**
       * @return {ContentString}
       */
      copy() {
        return new _ContentString(this.str);
      }
      /**
       * @param {number} offset
       * @return {ContentString}
       */
      splice(offset) {
        const right = new _ContentString(this.str.slice(offset));
        this.str = this.str.slice(0, offset);
        const firstCharCode = this.str.charCodeAt(offset - 1);
        if (firstCharCode >= 55296 && firstCharCode <= 56319) {
          this.str = this.str.slice(0, offset - 1) + "\uFFFD";
          right.str = "\uFFFD" + right.str.slice(1);
        }
        return right;
      }
      /**
       * @param {ContentString} right
       * @return {boolean}
       */
      mergeWith(right) {
        this.str += right.str;
        return true;
      }
      /**
       * @param {Transaction} transaction
       * @param {Item} item
       */
      integrate(transaction, item) {
      }
      /**
       * @param {Transaction} transaction
       */
      delete(transaction) {
      }
      /**
       * @param {StructStore} store
       */
      gc(store) {
      }
      /**
       * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder
       * @param {number} offset
       */
      write(encoder, offset) {
        encoder.writeString(offset === 0 ? this.str : this.str.slice(offset));
      }
      /**
       * @return {number}
       */
      getRef() {
        return 4;
      }
    };
    readContentString = (decoder) => new ContentString(decoder.readString());
    typeRefs = [
      readYArray,
      readYMap,
      readYText,
      readYXmlElement,
      readYXmlFragment,
      readYXmlHook,
      readYXmlText
    ];
    YArrayRefID = 0;
    YMapRefID = 1;
    YTextRefID = 2;
    YXmlElementRefID = 3;
    YXmlFragmentRefID = 4;
    YXmlHookRefID = 5;
    YXmlTextRefID = 6;
    ContentType = class _ContentType {
      /**
       * @param {AbstractType<any>} type
       */
      constructor(type) {
        this.type = type;
      }
      /**
       * @return {number}
       */
      getLength() {
        return 1;
      }
      /**
       * @return {Array<any>}
       */
      getContent() {
        return [this.type];
      }
      /**
       * @return {boolean}
       */
      isCountable() {
        return true;
      }
      /**
       * @return {ContentType}
       */
      copy() {
        return new _ContentType(this.type._copy());
      }
      /**
       * @param {number} offset
       * @return {ContentType}
       */
      splice(offset) {
        throw methodUnimplemented();
      }
      /**
       * @param {ContentType} right
       * @return {boolean}
       */
      mergeWith(right) {
        return false;
      }
      /**
       * @param {Transaction} transaction
       * @param {Item} item
       */
      integrate(transaction, item) {
        this.type._integrate(transaction.doc, item);
      }
      /**
       * @param {Transaction} transaction
       */
      delete(transaction) {
        let item = this.type._start;
        while (item !== null) {
          if (!item.deleted) {
            item.delete(transaction);
          } else if (item.id.clock < (transaction.beforeState.get(item.id.client) || 0)) {
            transaction._mergeStructs.push(item);
          }
          item = item.right;
        }
        this.type._map.forEach((item2) => {
          if (!item2.deleted) {
            item2.delete(transaction);
          } else if (item2.id.clock < (transaction.beforeState.get(item2.id.client) || 0)) {
            transaction._mergeStructs.push(item2);
          }
        });
        transaction.changed.delete(this.type);
      }
      /**
       * @param {StructStore} store
       */
      gc(store) {
        let item = this.type._start;
        while (item !== null) {
          item.gc(store, true);
          item = item.right;
        }
        this.type._start = null;
        this.type._map.forEach(
          /** @param {Item | null} item */
          (item2) => {
            while (item2 !== null) {
              item2.gc(store, true);
              item2 = item2.left;
            }
          }
        );
        this.type._map = /* @__PURE__ */ new Map();
      }
      /**
       * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder
       * @param {number} offset
       */
      write(encoder, offset) {
        this.type._write(encoder);
      }
      /**
       * @return {number}
       */
      getRef() {
        return 7;
      }
    };
    readContentType = (decoder) => new ContentType(typeRefs[decoder.readTypeRef()](decoder));
    followRedone = (store, id2) => {
      let nextID = id2;
      let diff = 0;
      let item;
      do {
        if (diff > 0) {
          nextID = createID(nextID.client, nextID.clock + diff);
        }
        item = getItem(store, nextID);
        diff = nextID.clock - item.id.clock;
        nextID = item.redone;
      } while (nextID !== null && item instanceof Item);
      return {
        item,
        diff
      };
    };
    keepItem = (item, keep) => {
      while (item !== null && item.keep !== keep) {
        item.keep = keep;
        item = /** @type {AbstractType<any>} */
        item.parent._item;
      }
    };
    splitItem = (transaction, leftItem, diff) => {
      const { client, clock } = leftItem.id;
      const rightItem = new Item(
        createID(client, clock + diff),
        leftItem,
        createID(client, clock + diff - 1),
        leftItem.right,
        leftItem.rightOrigin,
        leftItem.parent,
        leftItem.parentSub,
        leftItem.content.splice(diff)
      );
      if (leftItem.deleted) {
        rightItem.markDeleted();
      }
      if (leftItem.keep) {
        rightItem.keep = true;
      }
      if (leftItem.redone !== null) {
        rightItem.redone = createID(leftItem.redone.client, leftItem.redone.clock + diff);
      }
      leftItem.right = rightItem;
      if (rightItem.right !== null) {
        rightItem.right.left = rightItem;
      }
      transaction._mergeStructs.push(rightItem);
      if (rightItem.parentSub !== null && rightItem.right === null) {
        rightItem.parent._map.set(rightItem.parentSub, rightItem);
      }
      leftItem.length = diff;
      return rightItem;
    };
    isDeletedByUndoStack = (stack, id2) => some(
      stack,
      /** @param {StackItem} s */
      (s) => isDeleted(s.deletions, id2)
    );
    redoItem = (transaction, item, redoitems, itemsToDelete, ignoreRemoteMapChanges, um) => {
      const doc2 = transaction.doc;
      const store = doc2.store;
      const ownClientID = doc2.clientID;
      const redone = item.redone;
      if (redone !== null) {
        return getItemCleanStart(transaction, redone);
      }
      let parentItem = (
        /** @type {AbstractType<any>} */
        item.parent._item
      );
      let left = null;
      let right;
      if (parentItem !== null && parentItem.deleted === true) {
        if (parentItem.redone === null && (!redoitems.has(parentItem) || redoItem(transaction, parentItem, redoitems, itemsToDelete, ignoreRemoteMapChanges, um) === null)) {
          return null;
        }
        while (parentItem.redone !== null) {
          parentItem = getItemCleanStart(transaction, parentItem.redone);
        }
      }
      const parentType = parentItem === null ? (
        /** @type {AbstractType<any>} */
        item.parent
      ) : (
        /** @type {ContentType} */
        parentItem.content.type
      );
      if (item.parentSub === null) {
        left = item.left;
        right = item;
        while (left !== null) {
          let leftTrace = left;
          while (leftTrace !== null && /** @type {AbstractType<any>} */
          leftTrace.parent._item !== parentItem) {
            leftTrace = leftTrace.redone === null ? null : getItemCleanStart(transaction, leftTrace.redone);
          }
          if (leftTrace !== null && /** @type {AbstractType<any>} */
          leftTrace.parent._item === parentItem) {
            left = leftTrace;
            break;
          }
          left = left.left;
        }
        while (right !== null) {
          let rightTrace = right;
          while (rightTrace !== null && /** @type {AbstractType<any>} */
          rightTrace.parent._item !== parentItem) {
            rightTrace = rightTrace.redone === null ? null : getItemCleanStart(transaction, rightTrace.redone);
          }
          if (rightTrace !== null && /** @type {AbstractType<any>} */
          rightTrace.parent._item === parentItem) {
            right = rightTrace;
            break;
          }
          right = right.right;
        }
      } else {
        right = null;
        if (item.right && !ignoreRemoteMapChanges) {
          left = item;
          while (left !== null && left.right !== null && (left.right.redone || isDeleted(itemsToDelete, left.right.id) || isDeletedByUndoStack(um.undoStack, left.right.id) || isDeletedByUndoStack(um.redoStack, left.right.id))) {
            left = left.right;
            while (left.redone) left = getItemCleanStart(transaction, left.redone);
          }
          if (left && left.right !== null) {
            return null;
          }
        } else {
          left = parentType._map.get(item.parentSub) || null;
        }
      }
      const nextClock = getState(store, ownClientID);
      const nextId = createID(ownClientID, nextClock);
      const redoneItem = new Item(
        nextId,
        left,
        left && left.lastId,
        right,
        right && right.id,
        parentType,
        item.parentSub,
        item.content.copy()
      );
      item.redone = nextId;
      keepItem(redoneItem, true);
      redoneItem.integrate(transaction, 0);
      return redoneItem;
    };
    Item = class _Item extends AbstractStruct {
      /**
       * @param {ID} id
       * @param {Item | null} left
       * @param {ID | null} origin
       * @param {Item | null} right
       * @param {ID | null} rightOrigin
       * @param {AbstractType<any>|ID|null} parent Is a type if integrated, is null if it is possible to copy parent from left or right, is ID before integration to search for it.
       * @param {string | null} parentSub
       * @param {AbstractContent} content
       */
      constructor(id2, left, origin, right, rightOrigin, parent, parentSub, content) {
        super(id2, content.getLength());
        this.origin = origin;
        this.left = left;
        this.right = right;
        this.rightOrigin = rightOrigin;
        this.parent = parent;
        this.parentSub = parentSub;
        this.redone = null;
        this.content = content;
        this.info = this.content.isCountable() ? BIT2 : 0;
      }
      /**
       * This is used to mark the item as an indexed fast-search marker
       *
       * @type {boolean}
       */
      set marker(isMarked) {
        if ((this.info & BIT4) > 0 !== isMarked) {
          this.info ^= BIT4;
        }
      }
      get marker() {
        return (this.info & BIT4) > 0;
      }
      /**
       * If true, do not garbage collect this Item.
       */
      get keep() {
        return (this.info & BIT1) > 0;
      }
      set keep(doKeep) {
        if (this.keep !== doKeep) {
          this.info ^= BIT1;
        }
      }
      get countable() {
        return (this.info & BIT2) > 0;
      }
      /**
       * Whether this item was deleted or not.
       * @type {Boolean}
       */
      get deleted() {
        return (this.info & BIT3) > 0;
      }
      set deleted(doDelete) {
        if (this.deleted !== doDelete) {
          this.info ^= BIT3;
        }
      }
      markDeleted() {
        this.info |= BIT3;
      }
      /**
       * Return the creator clientID of the missing op or define missing items and return null.
       *
       * @param {Transaction} transaction
       * @param {StructStore} store
       * @return {null | number}
       */
      getMissing(transaction, store) {
        if (this.origin && this.origin.client !== this.id.client && this.origin.clock >= getState(store, this.origin.client)) {
          return this.origin.client;
        }
        if (this.rightOrigin && this.rightOrigin.client !== this.id.client && this.rightOrigin.clock >= getState(store, this.rightOrigin.client)) {
          return this.rightOrigin.client;
        }
        if (this.parent && this.parent.constructor === ID && this.id.client !== this.parent.client && this.parent.clock >= getState(store, this.parent.client)) {
          return this.parent.client;
        }
        if (this.origin) {
          this.left = getItemCleanEnd(transaction, store, this.origin);
          this.origin = this.left.lastId;
        }
        if (this.rightOrigin) {
          this.right = getItemCleanStart(transaction, this.rightOrigin);
          this.rightOrigin = this.right.id;
        }
        if (this.left && this.left.constructor === GC || this.right && this.right.constructor === GC) {
          this.parent = null;
        } else if (!this.parent) {
          if (this.left && this.left.constructor === _Item) {
            this.parent = this.left.parent;
            this.parentSub = this.left.parentSub;
          } else if (this.right && this.right.constructor === _Item) {
            this.parent = this.right.parent;
            this.parentSub = this.right.parentSub;
          }
        } else if (this.parent.constructor === ID) {
          const parentItem = getItem(store, this.parent);
          if (parentItem.constructor === GC) {
            this.parent = null;
          } else {
            this.parent = /** @type {ContentType} */
            parentItem.content.type;
          }
        }
        return null;
      }
      /**
       * @param {Transaction} transaction
       * @param {number} offset
       */
      integrate(transaction, offset) {
        if (offset > 0) {
          this.id.clock += offset;
          this.left = getItemCleanEnd(transaction, transaction.doc.store, createID(this.id.client, this.id.clock - 1));
          this.origin = this.left.lastId;
          this.content = this.content.splice(offset);
          this.length -= offset;
        }
        if (this.parent) {
          if (!this.left && (!this.right || this.right.left !== null) || this.left && this.left.right !== this.right) {
            let left = this.left;
            let o;
            if (left !== null) {
              o = left.right;
            } else if (this.parentSub !== null) {
              o = /** @type {AbstractType<any>} */
              this.parent._map.get(this.parentSub) || null;
              while (o !== null && o.left !== null) {
                o = o.left;
              }
            } else {
              o = /** @type {AbstractType<any>} */
              this.parent._start;
            }
            const conflictingItems = /* @__PURE__ */ new Set();
            const itemsBeforeOrigin = /* @__PURE__ */ new Set();
            while (o !== null && o !== this.right) {
              itemsBeforeOrigin.add(o);
              conflictingItems.add(o);
              if (compareIDs(this.origin, o.origin)) {
                if (o.id.client < this.id.client) {
                  left = o;
                  conflictingItems.clear();
                } else if (compareIDs(this.rightOrigin, o.rightOrigin)) {
                  break;
                }
              } else if (o.origin !== null && itemsBeforeOrigin.has(getItem(transaction.doc.store, o.origin))) {
                if (!conflictingItems.has(getItem(transaction.doc.store, o.origin))) {
                  left = o;
                  conflictingItems.clear();
                }
              } else {
                break;
              }
              o = o.right;
            }
            this.left = left;
          }
          if (this.left !== null) {
            const right = this.left.right;
            this.right = right;
            this.left.right = this;
          } else {
            let r;
            if (this.parentSub !== null) {
              r = /** @type {AbstractType<any>} */
              this.parent._map.get(this.parentSub) || null;
              while (r !== null && r.left !== null) {
                r = r.left;
              }
            } else {
              r = /** @type {AbstractType<any>} */
              this.parent._start;
              this.parent._start = this;
            }
            this.right = r;
          }
          if (this.right !== null) {
            this.right.left = this;
          } else if (this.parentSub !== null) {
            this.parent._map.set(this.parentSub, this);
            if (this.left !== null) {
              this.left.delete(transaction);
            }
          }
          if (this.parentSub === null && this.countable && !this.deleted) {
            this.parent._length += this.length;
          }
          addStruct(transaction.doc.store, this);
          this.content.integrate(transaction, this);
          addChangedTypeToTransaction(
            transaction,
            /** @type {AbstractType<any>} */
            this.parent,
            this.parentSub
          );
          if (
            /** @type {AbstractType<any>} */
            this.parent._item !== null && /** @type {AbstractType<any>} */
            this.parent._item.deleted || this.parentSub !== null && this.right !== null
          ) {
            this.delete(transaction);
          }
        } else {
          new GC(this.id, this.length).integrate(transaction, 0);
        }
      }
      /**
       * Returns the next non-deleted item
       */
      get next() {
        let n = this.right;
        while (n !== null && n.deleted) {
          n = n.right;
        }
        return n;
      }
      /**
       * Returns the previous non-deleted item
       */
      get prev() {
        let n = this.left;
        while (n !== null && n.deleted) {
          n = n.left;
        }
        return n;
      }
      /**
       * Computes the last content address of this Item.
       */
      get lastId() {
        return this.length === 1 ? this.id : createID(this.id.client, this.id.clock + this.length - 1);
      }
      /**
       * Try to merge two items
       *
       * @param {Item} right
       * @return {boolean}
       */
      mergeWith(right) {
        if (this.constructor === right.constructor && compareIDs(right.origin, this.lastId) && this.right === right && compareIDs(this.rightOrigin, right.rightOrigin) && this.id.client === right.id.client && this.id.clock + this.length === right.id.clock && this.deleted === right.deleted && this.redone === null && right.redone === null && this.content.constructor === right.content.constructor && this.content.mergeWith(right.content)) {
          const searchMarker = (
            /** @type {AbstractType<any>} */
            this.parent._searchMarker
          );
          if (searchMarker) {
            searchMarker.forEach((marker) => {
              if (marker.p === right) {
                marker.p = this;
                if (!this.deleted && this.countable) {
                  marker.index -= this.length;
                }
              }
            });
          }
          if (right.keep) {
            this.keep = true;
          }
          this.right = right.right;
          if (this.right !== null) {
            this.right.left = this;
          }
          this.length += right.length;
          return true;
        }
        return false;
      }
      /**
       * Mark this Item as deleted.
       *
       * @param {Transaction} transaction
       */
      delete(transaction) {
        if (!this.deleted) {
          const parent = (
            /** @type {AbstractType<any>} */
            this.parent
          );
          if (this.countable && this.parentSub === null) {
            parent._length -= this.length;
          }
          this.markDeleted();
          addToDeleteSet(transaction.deleteSet, this.id.client, this.id.clock, this.length);
          addChangedTypeToTransaction(transaction, parent, this.parentSub);
          this.content.delete(transaction);
        }
      }
      /**
       * @param {StructStore} store
       * @param {boolean} parentGCd
       */
      gc(store, parentGCd) {
        if (!this.deleted) {
          throw unexpectedCase();
        }
        this.content.gc(store);
        if (parentGCd) {
          replaceStruct(store, this, new GC(this.id, this.length));
        } else {
          this.content = new ContentDeleted(this.length);
        }
      }
      /**
       * Transform the properties of this type to binary and write it to an
       * BinaryEncoder.
       *
       * This is called when this Item is sent to a remote peer.
       *
       * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder The encoder to write data to.
       * @param {number} offset
       */
      write(encoder, offset) {
        const origin = offset > 0 ? createID(this.id.client, this.id.clock + offset - 1) : this.origin;
        const rightOrigin = this.rightOrigin;
        const parentSub = this.parentSub;
        const info = this.content.getRef() & BITS5 | (origin === null ? 0 : BIT8) | // origin is defined
        (rightOrigin === null ? 0 : BIT7) | // right origin is defined
        (parentSub === null ? 0 : BIT6);
        encoder.writeInfo(info);
        if (origin !== null) {
          encoder.writeLeftID(origin);
        }
        if (rightOrigin !== null) {
          encoder.writeRightID(rightOrigin);
        }
        if (origin === null && rightOrigin === null) {
          const parent = (
            /** @type {AbstractType<any>} */
            this.parent
          );
          if (parent._item !== void 0) {
            const parentItem = parent._item;
            if (parentItem === null) {
              const ykey = findRootTypeKey(parent);
              encoder.writeParentInfo(true);
              encoder.writeString(ykey);
            } else {
              encoder.writeParentInfo(false);
              encoder.writeLeftID(parentItem.id);
            }
          } else if (parent.constructor === String) {
            encoder.writeParentInfo(true);
            encoder.writeString(parent);
          } else if (parent.constructor === ID) {
            encoder.writeParentInfo(false);
            encoder.writeLeftID(parent);
          } else {
            unexpectedCase();
          }
          if (parentSub !== null) {
            encoder.writeString(parentSub);
          }
        }
        this.content.write(encoder, offset);
      }
    };
    readItemContent = (decoder, info) => contentRefs[info & BITS5](decoder);
    contentRefs = [
      () => {
        unexpectedCase();
      },
      // GC is not ItemContent
      readContentDeleted,
      // 1
      readContentJSON,
      // 2
      readContentBinary,
      // 3
      readContentString,
      // 4
      readContentEmbed,
      // 5
      readContentFormat,
      // 6
      readContentType,
      // 7
      readContentAny,
      // 8
      readContentDoc,
      // 9
      () => {
        unexpectedCase();
      }
      // 10 - Skip is not ItemContent
    ];
    structSkipRefNumber = 10;
    Skip = class extends AbstractStruct {
      get deleted() {
        return true;
      }
      delete() {
      }
      /**
       * @param {Skip} right
       * @return {boolean}
       */
      mergeWith(right) {
        if (this.constructor !== right.constructor) {
          return false;
        }
        this.length += right.length;
        return true;
      }
      /**
       * @param {Transaction} transaction
       * @param {number} offset
       */
      integrate(transaction, offset) {
        unexpectedCase();
      }
      /**
       * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder
       * @param {number} offset
       */
      write(encoder, offset) {
        encoder.writeInfo(structSkipRefNumber);
        writeVarUint(encoder.restEncoder, this.length - offset);
      }
      /**
       * @param {Transaction} transaction
       * @param {StructStore} store
       * @return {null | number}
       */
      getMissing(transaction, store) {
        return null;
      }
    };
    glo = /** @type {any} */
    typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : {};
    importIdentifier = "__ $YJS$ __";
    if (glo[importIdentifier] === true) {
      console.error("Yjs was already imported. This breaks constructor checks and will lead to issues! - https://github.com/yjs/yjs/issues/438");
    }
    glo[importIdentifier] = true;
  }
});

// src/main.js
var {
  MarkdownView,
  Notice,
  Plugin,
  PluginSettingTab,
  Platform,
  requestUrl,
  setIcon,
  Setting,
  TFile,
  TFolder,
  normalizePath
} = require("obsidian");
var Y = (init_yjs(), __toCommonJS(yjs_exports));
var PLUGIN_ID = "arcalink-sync";
var LEGACY_PLUGIN_IDS = ["obsidian-http-sync"];
var PLUGIN_VERSION = "0.1.41";
var PLUGIN_BUILD_ID = "2026-08-27T19:37:22Z";
var PLUGIN_UPDATE_LATEST_ARCHIVE_PATH = "/downloads/obsidian-http-sync-latest.zip";
var PLUGIN_UPDATE_FALLBACK_ARCHIVE_PATH = `/downloads/obsidian-http-sync-${PLUGIN_VERSION}.zip`;
var PLUGIN_UPDATE_PUBLIC_BASE_URL = "https://arcalink.ru";
var PLUGIN_UPDATE_FILES = ["manifest.json", "main.js", "sync_logic.js"];
var PLUGIN_UPDATE_WRITE_ORDER = ["main.js", "sync_logic.js", "manifest.json"];
var EVENT_SYNC_DEBOUNCE_MS = 1200;
var AUTO_SYNC_FAILURE_BACKOFF_MS = 6e4;
var SUPPRESSED_EVENT_TTL_MS = 4e3;
var CRDT_LOCAL_DEBOUNCE_MS = 500;
var CRDT_POLL_INTERVAL_MS = 1500;
var CRDT_LEASE_TTL_SECONDS = 30;
var CRDT_LEASE_RENEW_INTERVAL_MS = 1e4;
var CRDT_LEASE_NOTICE_INTERVAL_MS = 15e3;
var NOTE_LEASE_TTL_SECONDS = 30;
var NOTE_LEASE_RENEW_INTERVAL_MS = 1e4;
var NOTE_LEASE_NOTICE_INTERVAL_MS = 15e3;
var CONFLICT_FETCH_LIMIT = 5e3;
var DELETE_QUARANTINE_GRACE_MS = 60 * 1e3;
var DELETE_QUARANTINE_MAX_BATCH_COUNT = 20;
var DELETE_QUARANTINE_MAX_BATCH_RATIO = 0.25;
var REQUIRED_CRDT_CAPABILITIES = [
  "crdt_updates",
  "crdt_snapshots",
  "crdt_update_base_sequence"
];
var DEFAULT_IGNORE_PATHS = [".obsidian/", ".trash/"];
var DEFAULT_IGNORE_PATH_SEGMENTS = [".obsidian", ".trash"];
var OBSIDIAN_CONFIG_DIR = ".obsidian";
var OBSIDIAN_CONFIG_ALWAYS_LOCAL_PATHS = [
  `${OBSIDIAN_CONFIG_DIR}/workspace.json`,
  `${OBSIDIAN_CONFIG_DIR}/workspace-mobile.json`,
  `${OBSIDIAN_CONFIG_DIR}/cache`,
  `${OBSIDIAN_CONFIG_DIR}/plugins/${PLUGIN_ID}`
];
var DEFAULT_AUTH_STATE = {
  status: "unknown",
  reason: "",
  lastChecked: null
};
var AUTH_STATUS = {
  UNKNOWN: "unknown",
  AUTHENTICATED: "authenticated",
  MISSING_TOKEN: "missing_token",
  REFRESH_FAILED: "refresh_failed",
  SESSION_EXPIRED: "session_expired",
  SESSION_REVOKED: "session_revoked",
  BILLING_BLOCKED: "billing_blocked",
  ERROR: "error"
};
var SYNC_BLOCK_REASON = {
  NONE: "none",
  NOT_CONFIGURED: "not_configured",
  MISSING_TOKEN: "missing_token",
  SESSION_EXPIRED: "session_expired",
  SESSION_REVOKED: "session_revoked",
  REFRESH_FAILED: "refresh_failed",
  BILLING_BLOCKED: "billing_blocked",
  NETWORK_ERROR: "network_error",
  SERVER_ERROR: "server_error"
};
var STATUS_LAMP_COLORS = {
  green: "#22c55e",
  red: "#ef4444",
  yellow: "#f59e0b"
};
var COLLABORATION_BLOCK_REASON = {
  NONE: "none",
  BILLING_BLOCKED: "billing_blocked_collaboration",
  NOT_IN_PLAN: "collaboration_not_in_plan",
  MEMBER_LIMIT: "member_limit_exceeded"
};
var DEFAULT_SETTINGS = {
  baseUrl: "http://45.144.65.18",
  userEmail: "",
  userId: "",
  vaultId: "",
  deviceId: "",
  deviceInstanceId: "",
  accessToken: "",
  refreshToken: "",
  language: "ru",
  authLoginCode: "",
  authLoginRequestId: "",
  authLoginExpiresAt: "",
  deviceName: "\u0423\u0441\u0442\u0440\u043E\u0439\u0441\u0442\u0432\u043E Obsidian",
  platform: detectPlatform(),
  appVersion: `obsidian-plugin/${PLUGIN_VERSION}`,
  autoSync: false,
  syncObsidianConfig: false,
  obsidianConfigBootstrapPending: false,
  syncIntervalSeconds: 5,
  crdtMarkdownEnabled: false,
  crdtEditLeaseEnabled: true,
  crdtPollIntervalMs: CRDT_POLL_INTERVAL_MS,
  telegramDefaultInboxFolder: "Inbox/Telegram",
  telegramLastLinkCode: "",
  telegramLastLinkExpiresAt: "",
  ignorePaths: DEFAULT_IGNORE_PATHS.slice(),
  syncFolderPaths: [""],
  lastSyncAt: null,
  lastError: "",
  lastSyncWarning: "",
  syncBlockReason: SYNC_BLOCK_REASON.NONE,
  collaborationBlockReason: COLLABORATION_BLOCK_REASON.NONE,
  authState: { ...DEFAULT_AUTH_STATE },
  state: {
    entries: {}
  },
  crdtState: {
    files: {}
  },
  conflicts: {
    items: {},
    lastFetchedAt: null,
    lastError: ""
  },
  pendingRenameHints: {},
  pendingDeletes: {},
  pendingLocalPaths: {},
  snapshotState: {
    revision: null,
    vaultFingerprint: "",
    crdtHeadsFingerprint: "",
    lastFullAuditAt: null
  }
};
module.exports = class ObsidianHttpSyncPlugin extends Plugin {
  async onload() {
    this.syncInFlight = false;
    this.syncProgress = null;
    this.lastSyncProgress = { completedFiles: 0, totalFiles: 0 };
    this.intervalHandle = null;
    this.pendingSyncTimeout = null;
    this.pendingChangesDuringSync = false;
    this.localDirtyGeneration = Date.now();
    this.dirtyJournalSaveHandle = null;
    this.autoSyncRetryNotBefore = 0;
    this.renameHints = {};
    this.pendingExplicitDeletes = /* @__PURE__ */ new Set();
    this.deletePollingHandle = null;
    this.suppressedPaths = /* @__PURE__ */ new Map();
    this.crdtDocs = /* @__PURE__ */ new Map();
    this.crdtLocalDebounce = /* @__PURE__ */ new Map();
    this.crdtPollingHandle = null;
    this.crdtApplyingRemotePaths = /* @__PURE__ */ new Set();
    this.crdtSyncQueues = /* @__PURE__ */ new Map();
    this.crdtLeases = /* @__PURE__ */ new Map();
    this.crdtLeaseNoticeTimestamps = /* @__PURE__ */ new Map();
    this.crdtProtocolSupported = null;
    this.crdtProtocolUnsupportedNoticeShown = false;
    this.activeNoteLease = null;
    this.localDiffNoteLocks = /* @__PURE__ */ new Map();
    this.noteLeaseEditorGuards = /* @__PURE__ */ new WeakMap();
    this.noteLeaseNoticeTimestamps = /* @__PURE__ */ new Map();
    this.remoteEditorUpdateDepth = 0;
    this.noteLeaseRoutes = {
      claim: "",
      release: ""
    };
    this.noteLeaseSupport = null;
    this.noteLeaseReadSupport = null;
    this.syncRibbonIconEl = null;
    this.syncStatusBarItemEl = null;
    this.activeNoteTakeoverButtonEl = null;
    this.activeNoteTakeoverButtonPath = "";
    this.activeNoteTakeoverButtonHostEl = null;
    await this.loadSettings();
    const syncedFileCount = Object.values(this.settings.state.entries || {}).filter(
      (entry) => entry && entry.entryType === "file"
    ).length;
    this.lastSyncProgress = {
      completedFiles: syncedFileCount,
      totalFiles: syncedFileCount
    };
    this.installSyncRibbonIcon();
    this.installSyncStatusBarItem();
    this.registerRibbonRecovery();
    this.addCommand({
      id: "register-device",
      name: this.t("command.registerDevice"),
      callback: async () => {
        await this.registerCurrentDevice({ notify: true });
      }
    });
    this.addCommand({
      id: "sync-now",
      name: this.t("command.syncVaultNow"),
      callback: async () => {
        await this.runManualSyncFromUi();
      }
    });
    this.addCommand({
      id: "reset-local-state",
      name: this.t("command.resetLocalState"),
      callback: async () => {
        this.settings.state = { entries: {} };
        this.resetCrdtLocalState();
        this.resetSnapshotTracking();
        await this.saveSettings();
        new Notice(this.t("notice.localStateReset"));
      }
    });
    this.addCommand({
      id: "takeover-active-note-lock",
      name: this.t("command.takeoverActiveNoteLock"),
      callback: async () => {
        await this.takeOverActiveNoteLock();
      }
    });
    this.addSettingTab(new ObsidianHttpSyncSettingTab(this.app, this));
    this.registerVaultObservers();
    this.scheduleAutoSync();
    this.scheduleCrdtPolling();
    this.enqueueAutoSync("startup", 0);
  }
  onunload() {
    this.releaseActiveNoteLease().catch((error) => {
      console.warn("[obsidian-http-sync] note lease release during unload failed", error);
    });
    this.removeActiveNoteTakeoverButton();
    this.stopAutoSync();
    this.stopCrdtPolling();
    this.stopDeletePolling();
    if (this.dirtyJournalSaveHandle !== null) {
      window.clearTimeout(this.dirtyJournalSaveHandle);
      this.dirtyJournalSaveHandle = null;
      this.saveData(this.settings).catch(() => {
      });
    }
  }
  installSyncRibbonIcon() {
    if (this.syncRibbonIconEl && this.syncRibbonIconEl.isConnected) {
      return;
    }
    this.syncRibbonIconEl = this.addRibbonIcon("refresh-cw", this.t("command.syncNow"), async () => {
      await this.runManualSyncFromUi();
    });
  }
  installSyncStatusBarItem() {
    if (typeof this.addStatusBarItem !== "function") {
      return;
    }
    this.syncStatusBarItemEl = this.addStatusBarItem();
    this.updateSyncStatusBarItem();
    this.syncStatusBarItemEl.addEventListener("click", async () => {
      await this.runManualSyncFromUi();
    });
  }
  registerRibbonRecovery() {
    if (this.app && this.app.workspace && typeof this.app.workspace.on === "function") {
      this.registerEvent(
        this.app.workspace.on("layout-ready", () => {
          this.installSyncRibbonIcon();
        })
      );
    }
    if (typeof window !== "undefined" && typeof window.setTimeout === "function") {
      window.setTimeout(() => this.installSyncRibbonIcon(), 1e3);
    }
  }
  async runManualSyncFromUi() {
    try {
      await this.syncNow({ notify: true, forceFullAudit: true });
    } catch (error) {
      console.error("[obsidian-http-sync] manual sync failed", error);
    }
  }
  async loadSettings() {
    let loaded = await this.loadData() || {};
    if (!hasRequiredConfig(loaded)) {
      const fallbackLoaded = await this.readSettingsFromVaultFile();
      if (hasRequiredConfig(fallbackLoaded)) {
        loaded = fallbackLoaded;
      }
    }
    const loadedDeviceInstanceId = String(loaded.deviceInstanceId || "").trim();
    const deviceInstanceId = loadedDeviceInstanceId || generateDeviceInstanceId();
    const hasLegacySharedDeviceIdentity = !loadedDeviceInstanceId && Boolean(loaded.deviceId) && isLegacyDefaultDeviceName(loaded.deviceName);
    const normalizedLoaded = {
      ...loaded,
      deviceInstanceId,
      deviceName: normalizeDeviceNameForInstance(loaded.deviceName, deviceInstanceId)
    };
    if (hasLegacySharedDeviceIdentity) {
      normalizedLoaded.deviceId = "";
      normalizedLoaded.accessToken = "";
      normalizedLoaded.refreshToken = "";
      normalizedLoaded.authLoginCode = "";
      normalizedLoaded.authLoginRequestId = "";
      normalizedLoaded.authLoginExpiresAt = "";
      normalizedLoaded.state = { entries: {} };
    }
    this.settings = {
      ...DEFAULT_SETTINGS,
      ...normalizedLoaded,
      ignorePaths: mergeIgnorePaths(normalizedLoaded.ignorePaths),
      syncFolderPaths: normalizeSyncFolderPathList(normalizedLoaded.syncFolderPaths),
      syncBlockReason: normalizedLoaded.syncBlockReason || SYNC_BLOCK_REASON.NONE,
      collaborationBlockReason: normalizedLoaded.collaborationBlockReason || COLLABORATION_BLOCK_REASON.NONE,
      authState: normalizedLoaded.authState && typeof normalizedLoaded.authState === "object" ? {
        status: normalizedLoaded.authState.status || DEFAULT_AUTH_STATE.status,
        reason: normalizedLoaded.authState.reason || DEFAULT_AUTH_STATE.reason,
        lastChecked: normalizedLoaded.authState.lastChecked || DEFAULT_AUTH_STATE.lastChecked
      } : { ...DEFAULT_AUTH_STATE },
      crdtMarkdownEnabled: normalizedLoaded.crdtMarkdownEnabled === void 0 ? DEFAULT_SETTINGS.crdtMarkdownEnabled : Boolean(normalizedLoaded.crdtMarkdownEnabled),
      syncObsidianConfig: normalizedLoaded.syncObsidianConfig === void 0 ? DEFAULT_SETTINGS.syncObsidianConfig : Boolean(normalizedLoaded.syncObsidianConfig),
      obsidianConfigBootstrapPending: normalizedLoaded.obsidianConfigBootstrapPending === void 0 ? DEFAULT_SETTINGS.obsidianConfigBootstrapPending : Boolean(normalizedLoaded.obsidianConfigBootstrapPending),
      crdtEditLeaseEnabled: normalizedLoaded.crdtEditLeaseEnabled === void 0 ? DEFAULT_SETTINGS.crdtEditLeaseEnabled : Boolean(normalizedLoaded.crdtEditLeaseEnabled),
      crdtPollIntervalMs: Math.max(
        1e3,
        Number(normalizedLoaded.crdtPollIntervalMs) || DEFAULT_SETTINGS.crdtPollIntervalMs
      ),
      state: {
        entries: normalizedLoaded.state && normalizedLoaded.state.entries ? { ...normalizedLoaded.state.entries } : {}
      },
      crdtState: {
        files: normalizedLoaded.crdtState && normalizedLoaded.crdtState.files ? { ...normalizedLoaded.crdtState.files } : {}
      },
      pendingRenameHints: normalizedLoaded.pendingRenameHints && typeof normalizedLoaded.pendingRenameHints === "object" ? { ...normalizedLoaded.pendingRenameHints } : {},
      pendingDeletes: normalizedLoaded.pendingDeletes && typeof normalizedLoaded.pendingDeletes === "object" ? normalizePendingDeletes(normalizedLoaded.pendingDeletes) : {},
      pendingLocalPaths: normalizedLoaded.pendingLocalPaths && typeof normalizedLoaded.pendingLocalPaths === "object" ? { ...normalizedLoaded.pendingLocalPaths } : {},
      snapshotState: normalizedLoaded.snapshotState && typeof normalizedLoaded.snapshotState === "object" ? {
        revision: normalizedLoaded.snapshotState.revision !== null && normalizedLoaded.snapshotState.revision !== void 0 && Number.isFinite(Number(normalizedLoaded.snapshotState.revision)) ? Number(normalizedLoaded.snapshotState.revision) : null,
        vaultFingerprint: String(normalizedLoaded.snapshotState.vaultFingerprint || ""),
        crdtHeadsFingerprint: String(normalizedLoaded.snapshotState.crdtHeadsFingerprint || ""),
        lastFullAuditAt: normalizedLoaded.snapshotState.lastFullAuditAt || null
      } : { ...DEFAULT_SETTINGS.snapshotState }
    };
    const entryCountBeforePrune = Object.keys(this.settings.state.entries || {}).length;
    this.settings.state.entries = this.filterSyncableStateEntries(
      this.settings.state.entries
    );
    const stateWasPruned = Object.keys(this.settings.state.entries || {}).length !== entryCountBeforePrune;
    if (!loadedDeviceInstanceId || hasLegacySharedDeviceIdentity || stateWasPruned) {
      await this.saveData(this.settings);
    }
  }
  async readSettingsFromVaultFile() {
    const configDir = this.app && this.app.vault && this.app.vault.configDir ? this.app.vault.configDir : ".obsidian";
    const settingsPath = normalizePath(`${configDir}/plugins/${PLUGIN_ID}/data.json`);
    try {
      const raw = await this.app.vault.adapter.read(settingsPath);
      const parsed = JSON.parse(raw);
      return parsed && typeof parsed === "object" ? parsed : {};
    } catch (_) {
      return {};
    }
  }
  async saveSettings() {
    await this.saveData(this.settings);
    this.scheduleAutoSync();
    this.scheduleDeletePolling();
    this.updateSyncStatusBarItem();
  }
  stopAutoSync() {
    if (this.intervalHandle !== null) {
      window.clearInterval(this.intervalHandle);
      this.intervalHandle = null;
    }
    this.clearPendingAutoSync();
  }
  clearPendingAutoSync() {
    if (this.pendingSyncTimeout !== null) {
      window.clearTimeout(this.pendingSyncTimeout);
      this.pendingSyncTimeout = null;
    }
  }
  async waitForSyncIdleBeforeManualAction(timeoutMs = 15e3) {
    const startedAt = Date.now();
    while (this.syncInFlight && Date.now() - startedAt < timeoutMs) {
      await new Promise((resolve) => window.setTimeout(resolve, 250));
    }
    if (this.syncInFlight) {
      throw new Error(this.t("notice.syncAlreadyRunning"));
    }
    this.clearPendingAutoSync();
  }
  stopDeletePolling() {
    if (this.deletePollingHandle !== null) {
      window.clearInterval(this.deletePollingHandle);
      this.deletePollingHandle = null;
    }
  }
  stopCrdtPolling() {
    if (this.crdtPollingHandle !== null) {
      window.clearInterval(this.crdtPollingHandle);
      this.crdtPollingHandle = null;
    }
    for (const timeoutHandle of this.crdtLocalDebounce.values()) {
      window.clearTimeout(timeoutHandle);
    }
    this.crdtLocalDebounce.clear();
    this.crdtLeases.clear();
    this.crdtLeaseNoticeTimestamps.clear();
    this.crdtSyncQueues.clear();
    this.releaseActiveNoteLease().catch((error) => {
      console.warn("[obsidian-http-sync] note lease release during stop failed", error);
    });
  }
  scheduleCrdtPolling() {
    this.stopCrdtPolling();
    if (!this.isConfigured()) {
      return;
    }
    const intervalMs = Math.max(
      1e3,
      Number(this.settings.crdtPollIntervalMs) || CRDT_POLL_INTERVAL_MS
    );
    this.pollActiveCrdtFile().catch((error) => {
      console.error("[obsidian-http-sync] CRDT polling failed", error);
    });
    this.crdtPollingHandle = window.setInterval(() => {
      this.pollActiveCrdtFile().catch((error) => {
        console.error("[obsidian-http-sync] CRDT polling failed", error);
      });
    }, intervalMs);
  }
  scheduleAutoSync() {
    this.stopAutoSync();
    if (!this.settings.autoSync) {
      this.pendingChangesDuringSync = false;
      return;
    }
    const intervalMs = Math.max(2, Number(this.settings.syncIntervalSeconds) || 5) * 1e3;
    this.intervalHandle = window.setInterval(() => {
      this.enqueueAutoSync("interval-poll", 0);
    }, intervalMs);
  }
  scheduleDeletePolling() {
    this.stopDeletePolling();
    if (!this.isConfigured()) {
      return;
    }
    this.deletePollingHandle = window.setInterval(() => {
      this.pollKnownDeletedDirectories().catch((error) => {
        console.error("[obsidian-http-sync] delete polling failed", error);
      });
    }, 1e3);
  }
  registerVaultObservers() {
    this.registerEvent(
      this.app.vault.on("create", (abstractFile) => {
        this.handleVaultEvent("create", abstractFile).catch((error) => {
          console.error("[obsidian-http-sync] create handler failed", error);
        });
      })
    );
    this.registerEvent(
      this.app.vault.on("modify", (abstractFile) => {
        this.handleVaultEvent("modify", abstractFile).catch((error) => {
          console.error("[obsidian-http-sync] modify handler failed", error);
        });
      })
    );
    this.registerEvent(
      this.app.vault.on("delete", (abstractFile) => {
        this.handleVaultEvent("delete", abstractFile).catch((error) => {
          console.error("[obsidian-http-sync] delete handler failed", error);
        });
      })
    );
    this.registerEvent(
      this.app.vault.on("rename", (abstractFile, oldPath) => {
        this.handleVaultEvent("rename", abstractFile, oldPath).catch((error) => {
          console.error("[obsidian-http-sync] rename handler failed", error);
        });
      })
    );
    this.registerEvent(
      this.app.vault.on("raw", (path) => {
        const normalizedPath = normalizePath(String(path || ""));
        if (this.settings.syncObsidianConfig === true && isRootObsidianConfigPath(normalizedPath) && !this.isPathIgnoredByPattern(normalizedPath) && !this.shouldSuppressEventPath(normalizedPath)) {
          this.markLocalDirtyPath(normalizedPath);
          this.enqueueAutoSync("raw-config", EVENT_SYNC_DEBOUNCE_MS);
        }
      })
    );
    if (this.app.workspace && typeof this.app.workspace.on === "function") {
      this.registerEvent(
        this.app.workspace.on("file-open", () => {
          this.pollActiveCrdtFile().catch((error) => {
            console.error("[obsidian-http-sync] active note polling failed", error);
          });
        })
      );
      this.registerEvent(
        this.app.workspace.on("editor-change", (editor, info) => {
          this.handleEditorChange(editor, info).catch((error) => {
            console.error("[obsidian-http-sync] editor change handler failed", error);
          });
        })
      );
      this.registerEvent(
        this.app.workspace.on("layout-change", () => {
          this.updateActiveNoteTakeoverButton();
        })
      );
    }
  }
  async pollKnownDeletedDirectories() {
    const entries = Object.entries(
      this.settings && this.settings.state && this.settings.state.entries ? this.settings.state.entries : {}
    ).filter(
      ([path, entry]) => entry && entry.entryType === "directory" && path && !this.shouldIgnorePath(path)
    ).sort((left, right) => pathDepth(left[0]) - pathDepth(right[0]));
    for (const [path] of entries) {
      const normalizedPath = normalizePath(String(path || ""));
      if (!normalizedPath || this.hasPendingExplicitDeleteAncestor(normalizedPath)) {
        continue;
      }
      if (!await this.app.vault.adapter.exists(normalizedPath)) {
        this.markPendingExplicitDeletePath(normalizedPath);
        this.markLocalDirtyPath(normalizedPath);
      }
    }
  }
  resetSnapshotTracking() {
    this.settings.pendingLocalPaths = {};
    this.settings.snapshotState = { ...DEFAULT_SETTINGS.snapshotState };
  }
  async setSyncObsidianConfig(value) {
    const enabled = Boolean(value);
    const wasEnabled = this.settings.syncObsidianConfig === true;
    this.settings.syncObsidianConfig = enabled;
    this.settings.obsidianConfigBootstrapPending = enabled && !wasEnabled;
    this.settings.state.entries = this.filterSyncableStateEntries(
      this.settings.state.entries || {}
    );
    this.settings.pendingLocalPaths = filterPathKeyedMap(
      this.settings.pendingLocalPaths,
      (path) => !this.shouldIgnorePath(path)
    );
    this.settings.pendingDeletes = filterPathKeyedMap(
      this.settings.pendingDeletes,
      (path) => !this.shouldIgnorePath(path)
    );
    this.settings.snapshotState = { ...DEFAULT_SETTINGS.snapshotState };
    await this.saveSettings();
    this.enqueueAutoSync("obsidian-config-setting", 0);
  }
  markLocalDirtyPath(path) {
    const normalizedPath = normalizePath(String(path || ""));
    if (!normalizedPath || this.shouldIgnorePath(normalizedPath)) {
      return;
    }
    this.localDirtyGeneration = Math.max(
      Number(this.localDirtyGeneration || 0) + 1,
      Date.now()
    );
    this.settings.pendingLocalPaths = this.settings.pendingLocalPaths || {};
    this.settings.pendingLocalPaths[normalizedPath] = this.localDirtyGeneration;
    this.scheduleDirtyJournalSave();
  }
  scheduleDirtyJournalSave() {
    if (this.dirtyJournalSaveHandle !== null) {
      window.clearTimeout(this.dirtyJournalSaveHandle);
    }
    this.dirtyJournalSaveHandle = window.setTimeout(() => {
      this.dirtyJournalSaveHandle = null;
      this.saveData(this.settings).catch((error) => {
        console.warn("[obsidian-http-sync] failed to persist dirty journal", error);
      });
    }, 500);
  }
  getPendingLocalPathSnapshot() {
    return { ...this.settings.pendingLocalPaths || {} };
  }
  clearProcessedLocalPaths(processedPaths) {
    this.settings.pendingLocalPaths = this.settings.pendingLocalPaths || {};
    for (const [path, generation] of Object.entries(processedPaths || {})) {
      if (this.settings.pendingLocalPaths[path] === generation) {
        delete this.settings.pendingLocalPaths[path];
      }
    }
  }
  async handleEditorChange(editor, info = {}) {
    if (this.remoteEditorUpdateDepth > 0) {
      return;
    }
    const infoFile = info && info.file && info.file.path ? info.file : null;
    const activeFile = this.app.workspace && typeof this.app.workspace.getActiveFile === "function" ? this.app.workspace.getActiveFile() : null;
    const filePath = infoFile && infoFile.path || info && info.path || activeFile && activeFile.path || "";
    const path = normalizePath(String(filePath || ""));
    if (!path || this.shouldIgnorePath(path) || !this.shouldTrackNoteLeaseForPath(path)) {
      return;
    }
    if (!await this.claimLocalDiffNoteEditLock(path, { structural: false })) {
      this.applyActiveNoteLeaseEditorGuard();
    }
  }
  async handleVaultEvent(eventType, abstractFile, oldPath = null) {
    const currentPath = abstractFile && abstractFile.path ? normalizePath(abstractFile.path) : "";
    const normalizedOldPath = oldPath !== null && oldPath !== void 0 ? normalizePath(oldPath) : null;
    const relevantPaths = [currentPath, normalizedOldPath].filter(Boolean);
    if (relevantPaths.length === 0 || relevantPaths.every((path) => this.shouldIgnorePath(path))) {
      return;
    }
    const shouldSuppressVaultEvent = eventType === "rename" ? relevantPaths.length > 0 && relevantPaths.every((path) => this.shouldSuppressEventPath(path)) : relevantPaths.some((path) => this.shouldSuppressEventPath(path));
    if (shouldSuppressVaultEvent) {
      return;
    }
    if (eventType === "rename") {
      const blockedRenamePath = [currentPath, normalizedOldPath].find(
        (path) => path && this.isNoteChangeBlockedByOtherLease(path)
      );
      if (blockedRenamePath) {
        this.showNoteLeaseBlockedNotice(blockedRenamePath, {
          structural: true
        });
        this.applyActiveNoteLeaseEditorGuard();
        return;
      }
    }
    if (eventType === "create" || eventType === "modify") {
      if (currentPath && this.shouldTrackNoteLeaseForPath(currentPath) && !await this.claimLocalDiffNoteEditLock(currentPath, {
        structural: false
      })) {
        return;
      }
    }
    if (eventType === "rename") {
      for (const notePath of [currentPath, normalizedOldPath]) {
        if (notePath && this.shouldTrackNoteLeaseForPath(notePath) && !await this.claimLocalDiffNoteEditLock(notePath, { structural: true })) {
          return;
        }
      }
    }
    if ((eventType === "create" || eventType === "modify") && currentPath && this.shouldUseCrdtForPath(currentPath) && !this.renameHints.hasOwnProperty(currentPath)) {
      this.enqueueCrdtLocalChange(currentPath);
    }
    if ((eventType === "create" || eventType === "modify") && currentPath) {
      this.clearPendingExplicitDeletePath(currentPath);
    }
    if (currentPath && (eventType === "modify" || eventType === "delete") && this.isNoteChangeBlockedByOtherLease(currentPath)) {
      this.showNoteLeaseBlockedNotice(currentPath, {
        structural: eventType === "delete"
      });
      this.applyActiveNoteLeaseEditorGuard();
    }
    if (eventType === "delete" && currentPath) {
      const clearedRenameHint = this.clearPendingRenameHintForPath(currentPath);
      this.markPendingExplicitDeletePath(currentPath);
      if (this.shouldUseCrdtForPath(currentPath)) {
        this.clearCrdtFileState(currentPath);
      } else if (abstractFile instanceof TFolder) {
        this.clearCrdtFolderState(currentPath);
      }
      if (clearedRenameHint) {
        await this.saveSettings();
      }
    }
    if (eventType === "rename" && (abstractFile instanceof TFile || abstractFile instanceof TFolder) && currentPath && normalizedOldPath && !this.shouldIgnorePath(currentPath) && !this.shouldIgnorePath(normalizedOldPath) && currentPath !== normalizedOldPath) {
      this.clearPendingExplicitDeletePath(currentPath);
      this.clearPendingExplicitDeletePath(normalizedOldPath);
      this.renameHints[currentPath] = normalizedOldPath;
      this.settings.pendingRenameHints = this.settings.pendingRenameHints || {};
      this.settings.pendingRenameHints[currentPath] = normalizedOldPath;
      await this.saveSettings();
      if (abstractFile instanceof TFile) {
        this.clearCrdtFileState(normalizedOldPath);
      } else if (abstractFile instanceof TFolder) {
        this.clearCrdtFolderState(normalizedOldPath);
      }
    }
    for (const path of relevantPaths) {
      this.markLocalDirtyPath(path);
    }
    this.enqueueAutoSync(eventType, EVENT_SYNC_DEBOUNCE_MS);
  }
  enqueueAutoSync(reason, delayMs = EVENT_SYNC_DEBOUNCE_MS) {
    if (!this.settings.autoSync) {
      return;
    }
    if (Date.now() < Number(this.autoSyncRetryNotBefore || 0)) {
      return;
    }
    if (this.syncInFlight) {
      if (reason !== "interval-poll") {
        this.pendingChangesDuringSync = true;
      }
      return;
    }
    if (this.pendingSyncTimeout !== null) {
      window.clearTimeout(this.pendingSyncTimeout);
      this.pendingSyncTimeout = null;
    }
    this.pendingSyncTimeout = window.setTimeout(() => {
      this.pendingSyncTimeout = null;
      this.syncNow({
        notify: false,
        forceFullAudit: reason === "startup"
      }).catch((error) => {
        console.error(`[obsidian-http-sync] auto-sync failed after ${reason}`, error);
      });
    }, Math.max(0, Number(delayMs) || 0));
  }
  isConfigured() {
    return Boolean(
      this.settings.baseUrl && (this.settings.userEmail || this.settings.userId) && this.settings.vaultId && this.settings.deviceId && (this.settings.accessToken || this.settings.refreshToken)
    );
  }
  t(key, params2 = {}) {
    return translate(this.settings && this.settings.language, key, params2);
  }
  async ensureUserReference() {
    if (this.settings.accessToken) {
      try {
        const context = await this.refreshCurrentAuthContext();
        if (context && context.user) {
          return context.user;
        }
      } catch (error) {
        console.warn("[obsidian-http-sync] authenticated user refresh failed", error);
      }
    }
    const normalizedEmail = String(this.settings.userEmail || "").trim().toLowerCase();
    if (normalizedEmail) {
      const payload = await this.requestJson(
        "GET",
        `/users/lookup?email=${encodeURIComponent(normalizedEmail)}`
      );
      const resolvedUser = payload && payload.user ? payload.user : null;
      const resolvedId = resolvedUser && resolvedUser.id ? String(resolvedUser.id).trim() : "";
      if (!resolvedId) {
        throw new Error(this.t("error.resolveUser"));
      }
      let changed = false;
      if (this.settings.userId !== resolvedId) {
        this.settings.userId = resolvedId;
        changed = true;
      }
      if (!this.settings.userEmail && resolvedUser.email) {
        this.settings.userEmail = String(resolvedUser.email).trim().toLowerCase();
        changed = true;
      }
      if (changed) {
        await this.saveSettings();
      }
      return resolvedUser;
    }
    const normalizedUserId = String(this.settings.userId || "").trim();
    if (normalizedUserId) {
      return { id: normalizedUserId, email: "" };
    }
    throw new Error(this.t("error.userEmailRequired"));
  }
  async requestLoginCode(options = {}) {
    if (!this.settings.baseUrl || !this.settings.userEmail) {
      throw new Error(this.t("error.backendAndEmailRequired"));
    }
    const payload = await this.requestJson("POST", "/auth/login-requests", {
      email: this.settings.userEmail,
      device_name: this.settings.deviceName || DEFAULT_SETTINGS.deviceName,
      platform: this.settings.platform || detectPlatform(),
      app_version: this.settings.appVersion || DEFAULT_SETTINGS.appVersion
    });
    const loginRequest = payload.auth_login_request || {};
    this.settings.authLoginRequestId = loginRequest.id || "";
    this.settings.authLoginCode = loginRequest.one_time_code || "";
    this.settings.authLoginExpiresAt = loginRequest.expires_at || "";
    await this.saveSettings();
    if (options.notify !== false) {
      new Notice(
        this.settings.authLoginCode ? this.t("notice.loginCode", { code: this.settings.authLoginCode }) : this.t("notice.loginCodeRequested")
      );
    }
    return loginRequest;
  }
  async completeLoginWithCode(oneTimeCode, options = {}) {
    const code = String(oneTimeCode || this.settings.authLoginCode || "").trim();
    if (!this.settings.baseUrl || !this.settings.userEmail || !code) {
      throw new Error(this.t("error.loginCodeRequired"));
    }
    const payload = await this.requestJson("POST", "/auth/login-requests/consume", {
      email: this.settings.userEmail,
      one_time_code: code,
      device_id: this.settings.deviceId || void 0,
      device_name: this.settings.deviceName || DEFAULT_SETTINGS.deviceName,
      platform: this.settings.platform || detectPlatform(),
      app_version: this.settings.appVersion || DEFAULT_SETTINGS.appVersion
    });
    await this.applyAuthSessionBundle(payload);
    await this.saveSettings();
    if (options.notify !== false) {
      new Notice(this.t("notice.loginCompleted"));
    }
    return payload;
  }
  async applyAuthSessionBundle(payload) {
    const user = payload && payload.user ? payload.user : {};
    const device = payload && payload.device ? payload.device : {};
    if (user.id) {
      this.settings.userId = String(user.id).trim();
    }
    if (user.email) {
      this.settings.userEmail = String(user.email).trim().toLowerCase();
    }
    if (device.id) {
      this.settings.deviceId = String(device.id).trim();
    }
    if (device.platform) {
      this.settings.platform = String(device.platform).trim().toLowerCase();
    }
    if (payload && payload.access_token) {
      this.settings.accessToken = payload.access_token;
    }
    if (payload && payload.refresh_token) {
      this.settings.refreshToken = payload.refresh_token;
    }
    this.settings.authLoginCode = "";
    this.settings.authLoginRequestId = "";
    this.settings.authLoginExpiresAt = "";
    this.settings.authState = {
      status: AUTH_STATUS.AUTHENTICATED,
      reason: "",
      lastChecked: (/* @__PURE__ */ new Date()).toISOString()
    };
    this.settings.syncBlockReason = SYNC_BLOCK_REASON.NONE;
    this.settings.collaborationBlockReason = COLLABORATION_BLOCK_REASON.NONE;
    await this.saveSettings();
  }
  async refreshCurrentAuthContext() {
    if (!this.settings.accessToken) {
      throw new Error(this.t("error.accessTokenRequired"));
    }
    const payload = await this.requestJson("GET", "/auth/me");
    const user = payload && payload.user ? payload.user : {};
    const device = payload && payload.device ? payload.device : {};
    let changed = false;
    if (user.id && this.settings.userId !== String(user.id).trim()) {
      this.settings.userId = String(user.id).trim();
      changed = true;
    }
    if (user.email && this.settings.userEmail !== String(user.email).trim().toLowerCase()) {
      this.settings.userEmail = String(user.email).trim().toLowerCase();
      changed = true;
    }
    if (device.id && this.settings.deviceId !== String(device.id).trim()) {
      this.settings.deviceId = String(device.id).trim();
      changed = true;
    }
    if (device.platform && this.settings.platform !== String(device.platform).trim().toLowerCase()) {
      this.settings.platform = String(device.platform).trim().toLowerCase();
      changed = true;
    }
    this.settings.authState = {
      status: AUTH_STATUS.AUTHENTICATED,
      reason: "",
      lastChecked: (/* @__PURE__ */ new Date()).toISOString()
    };
    this.settings.syncBlockReason = SYNC_BLOCK_REASON.NONE;
    this.settings.collaborationBlockReason = COLLABORATION_BLOCK_REASON.NONE;
    changed = true;
    if (changed) {
      await this.saveSettings();
    }
    return payload;
  }
  async listAccessibleVaults() {
    if (!this.settings.userId) {
      await this.refreshCurrentAuthContext();
    }
    if (!this.settings.userId) {
      throw new Error(this.t("error.userIdRequired"));
    }
    const payload = await this.requestJson(
      "GET",
      `/users/${encodeURIComponent(this.settings.userId)}/vaults`
    );
    return Array.isArray(payload.vaults) ? payload.vaults : [];
  }
  getAccessibleVaultSyncFolderPaths(accessibleVault) {
    const syncScope = accessibleVault && accessibleVault.sync_scope ? accessibleVault.sync_scope : null;
    if (syncScope && Array.isArray(syncScope.sync_folder_paths)) {
      return normalizeSyncFolderPathList(syncScope.sync_folder_paths);
    }
    const membership = accessibleVault && accessibleVault.membership ? accessibleVault.membership : null;
    if (membership && Array.isArray(membership.sync_folder_paths)) {
      return normalizeSyncFolderPathList(membership.sync_folder_paths);
    }
    return normalizeSyncFolderPathList(
      []
    );
  }
  hasEmbeddedAccessibleVaultSyncFolderPaths(accessibleVault) {
    const syncScope = accessibleVault && accessibleVault.sync_scope ? accessibleVault.sync_scope : null;
    const membership = accessibleVault && accessibleVault.membership ? accessibleVault.membership : null;
    return Boolean(
      syncScope && Array.isArray(syncScope.sync_folder_paths) || membership && Array.isArray(membership.sync_folder_paths)
    );
  }
  async loadVaultSyncScope(vaultId) {
    const payload = await this.requestJson(
      "GET",
      `/vaults/${encodeURIComponent(vaultId)}/sync-scope`
    );
    return payload && payload.sync_scope ? payload.sync_scope : null;
  }
  async updateVaultSyncScope(paths) {
    const vaultId = String(this.settings.vaultId || "").trim();
    if (!vaultId) {
      throw new Error(this.t("error.sharingConfigRequired"));
    }
    const payload = await this.requestJson(
      "PUT",
      `/vaults/${encodeURIComponent(vaultId)}/sync-scope`,
      {
        sync_folder_paths: normalizeSyncFolderPathList(paths)
      }
    );
    const syncScope = payload && payload.sync_scope ? payload.sync_scope : {};
    this.settings.syncFolderPaths = normalizeSyncFolderPathList(
      Array.isArray(syncScope.sync_folder_paths) ? syncScope.sync_folder_paths : paths
    );
    await this.saveSettings();
    return syncScope;
  }
  async selectAccessibleVault(accessibleVault) {
    const vault = accessibleVault && accessibleVault.vault ? accessibleVault.vault : {};
    const vaultId = vault.id ? String(vault.id).trim() : "";
    if (!vaultId) {
      await this.setVaultId("");
      return;
    }
    let syncFolderPaths = this.getAccessibleVaultSyncFolderPaths(accessibleVault);
    if (!this.hasEmbeddedAccessibleVaultSyncFolderPaths(accessibleVault)) {
      const syncScope = await this.loadVaultSyncScope(vaultId);
      syncFolderPaths = normalizeSyncFolderPathList(
        syncScope && Array.isArray(syncScope.sync_folder_paths) ? syncScope.sync_folder_paths : []
      );
    }
    await this.setVaultId(vaultId, { syncFolderPaths });
  }
  async connectCurrentVaultToAccessibleVault(accessibleVault, syncFolderPaths, options = {}) {
    const vault = accessibleVault && accessibleVault.vault ? accessibleVault.vault : {};
    const vaultId = vault.id ? String(vault.id).trim() : "";
    if (!vaultId) {
      throw new Error(this.t("error.serverVaultRequired"));
    }
    let nextSyncFolderPaths = normalizeSyncFolderPathList(syncFolderPaths);
    const serverSyncFolderPaths = this.getAccessibleVaultSyncFolderPaths(accessibleVault);
    if (JSON.stringify(nextSyncFolderPaths) !== JSON.stringify(serverSyncFolderPaths)) {
      if (accessibleVault && accessibleVault.sync_scope) {
        const payload = await this.requestJson(
          "PUT",
          `/vaults/${encodeURIComponent(vaultId)}/sync-scope`,
          {
            sync_folder_paths: nextSyncFolderPaths
          }
        );
        const syncScope = payload && payload.sync_scope ? payload.sync_scope : {};
        nextSyncFolderPaths = normalizeSyncFolderPathList(
          Array.isArray(syncScope.sync_folder_paths) ? syncScope.sync_folder_paths : nextSyncFolderPaths
        );
      } else {
        nextSyncFolderPaths = serverSyncFolderPaths;
      }
    }
    await this.setVaultId(vaultId, {
      syncFolderPaths: nextSyncFolderPaths,
      pauseAutoSync: true
    });
    if (options.notify !== false) {
      new Notice(this.t("notice.localVaultConnected"));
    }
  }
  getCurrentObsidianVaultName() {
    if (this.app && this.app.vault && typeof this.app.vault.getName === "function") {
      return String(this.app.vault.getName() || "").trim();
    }
    return "";
  }
  async publishCurrentVaultToServer(options = {}) {
    if (!this.settings.baseUrl || !this.settings.userEmail && !this.settings.userId) {
      throw new Error(this.t("error.publishVaultNeedsAccount"));
    }
    const currentUser = await this.ensureUserReference();
    const vaultName = this.getCurrentObsidianVaultName() || "Obsidian Vault";
    const payload = await this.requestJson("POST", "/vaults", {
      owner_user_id: currentUser && currentUser.id ? currentUser.id : this.settings.userId,
      owner_email: this.settings.userEmail || void 0,
      name: vaultName,
      local_vault_name: vaultName,
      sync_folder_paths: this.getSyncFolderPaths()
    });
    const vault = payload && payload.vault ? payload.vault : {};
    if (!vault.id) {
      throw new Error(this.t("error.publishVaultMissingId"));
    }
    await this.setVaultId(vault.id);
    if (options.registerDevice !== false && !this.settings.deviceId) {
      await this.registerCurrentDevice({ notify: false });
    }
    if (options.notify !== false) {
      new Notice(this.t("notice.currentVaultPublished", { name: vault.name || vaultName }));
    }
    return vault;
  }
  async setVaultId(vaultId, options = {}) {
    const nextVaultId = String(vaultId || "").trim();
    const hasServerScope = Array.isArray(options.syncFolderPaths);
    const nextSyncFolderPaths = hasServerScope ? normalizeSyncFolderPathList(options.syncFolderPaths) : this.settings.syncFolderPaths;
    const vaultChanged = this.settings.vaultId !== nextVaultId;
    const scopeChanged = hasServerScope && JSON.stringify(normalizeSyncFolderPathList(this.settings.syncFolderPaths)) !== JSON.stringify(nextSyncFolderPaths);
    if (vaultChanged || scopeChanged) {
      this.settings.vaultId = nextVaultId;
      if (hasServerScope) {
        this.settings.syncFolderPaths = nextSyncFolderPaths;
      }
      if (options.pauseAutoSync !== false && this.settings.autoSync) {
        this.settings.autoSync = false;
      }
      this.settings.state = { entries: {} };
      this.resetCrdtLocalState();
      this.renameHints = {};
      this.settings.pendingRenameHints = {};
      this.settings.pendingDeletes = {};
      this.resetSnapshotTracking();
      this.suppressedPaths.clear();
      if (vaultChanged) {
        this.settings.conflicts = {
          items: {},
          lastFetchedAt: null,
          lastError: ""
        };
      }
    }
    await this.saveSettings();
  }
  async setSyncFolderPaths(paths, options = {}) {
    const nextPaths = normalizeSyncFolderPathList(paths);
    const previousValue = JSON.stringify(this.settings.syncFolderPaths || []);
    const nextValue = JSON.stringify(nextPaths);
    this.settings.syncFolderPaths = nextPaths;
    if (previousValue !== nextValue) {
      if (options.pauseAutoSync !== false && this.settings.autoSync) {
        this.settings.autoSync = false;
      }
      this.settings.state = { entries: {} };
      this.resetCrdtLocalState();
      this.renameHints = {};
      this.settings.pendingRenameHints = {};
      this.settings.pendingDeletes = {};
      this.resetSnapshotTracking();
      this.suppressedPaths.clear();
    }
    await this.saveSettings();
    if (options.updateServer) {
      await this.updateVaultSyncScope(nextPaths);
    }
  }
  async registerCurrentDevice(options = {}) {
    if (!this.settings.baseUrl || !this.settings.userEmail && !this.settings.userId) {
      throw new Error(this.t("error.deviceRegistrationNeedsAccount"));
    }
    const payload = await this.requestJson("POST", "/devices", {
      user_email: this.settings.userEmail || void 0,
      user_id: this.settings.userId,
      name: this.settings.deviceName || DEFAULT_SETTINGS.deviceName,
      platform: this.settings.platform || detectPlatform(),
      app_version: this.settings.appVersion || DEFAULT_SETTINGS.appVersion
    });
    if (payload && payload.device && payload.device.user_id) {
      this.settings.userId = String(payload.device.user_id).trim();
    }
    this.settings.deviceId = payload.device.id;
    await this.saveSettings();
    if (options.notify !== false) {
      new Notice(this.t("notice.deviceRegistered", { deviceId: this.settings.deviceId }));
    }
    return payload.device;
  }
  async listVaultMemberships() {
    this.requireSharingConfig();
    const currentUser = await this.ensureUserReference();
    const query = new URLSearchParams();
    if (this.settings.userEmail) {
      query.set("actor_user_email", this.settings.userEmail);
    } else if (currentUser && currentUser.id) {
      query.set("actor_user_id", String(currentUser.id));
    }
    const payload = await this.requestJson(
      "GET",
      `/vaults/${encodeURIComponent(this.settings.vaultId)}/memberships?${query.toString()}`
    );
    return Array.isArray(payload.memberships) ? payload.memberships : [];
  }
  async listVaultMembershipInvites() {
    this.requireSharingConfig();
    const currentUser = await this.ensureUserReference();
    const query = new URLSearchParams();
    if (this.settings.userEmail) {
      query.set("actor_user_email", this.settings.userEmail);
    } else if (currentUser && currentUser.id) {
      query.set("actor_user_id", String(currentUser.id));
    }
    const payload = await this.requestJson(
      "GET",
      `/vaults/${encodeURIComponent(this.settings.vaultId)}/membership-invites?${query.toString()}`
    );
    return Array.isArray(payload.membership_invites) ? payload.membership_invites : [];
  }
  async grantVaultAccess(targetUserEmail, role, syncFolderPaths = []) {
    this.requireSharingConfig();
    await this.ensureUserReference();
    const normalizedTargetUserEmail = String(targetUserEmail || "").trim().toLowerCase();
    const normalizedRole = String(role || "").trim().toLowerCase();
    if (!normalizedTargetUserEmail) {
      throw new Error(this.t("error.targetEmailRequired"));
    }
    return this.requestJson(
      "POST",
      `/vaults/${encodeURIComponent(this.settings.vaultId)}/membership-invites`,
      {
        actor_user_email: this.settings.userEmail || void 0,
        user_email: normalizedTargetUserEmail,
        role: normalizedRole || "editor",
        sync_folder_paths: normalizeSharedFolderScopeForApi(syncFolderPaths)
      }
    );
  }
  async revokeVaultAccess(targetUserId) {
    this.requireSharingConfig();
    await this.ensureUserReference();
    const normalizedTargetUserId = String(targetUserId || "").trim();
    if (!normalizedTargetUserId) {
      throw new Error(this.t("error.targetUserIdRequired"));
    }
    const query = new URLSearchParams();
    if (this.settings.userEmail) {
      query.set("actor_user_email", this.settings.userEmail);
    } else {
      query.set("actor_user_id", this.settings.userId);
    }
    return this.requestJson(
      "DELETE",
      `/vaults/${encodeURIComponent(this.settings.vaultId)}/memberships/${encodeURIComponent(
        normalizedTargetUserId
      )}?${query.toString()}`
    );
  }
  async revokeVaultInvite(inviteId) {
    this.requireSharingConfig();
    await this.ensureUserReference();
    const normalizedInviteId = String(inviteId || "").trim();
    if (!normalizedInviteId) {
      throw new Error(this.t("error.inviteIdRequired"));
    }
    const query = new URLSearchParams();
    if (this.settings.userEmail) {
      query.set("actor_user_email", this.settings.userEmail);
    } else {
      query.set("actor_user_id", this.settings.userId);
    }
    return this.requestJson(
      "DELETE",
      `/membership-invites/${encodeURIComponent(normalizedInviteId)}?${query.toString()}`
    );
  }
  async createTelegramLinkRequest(defaultInboxFolder) {
    this.requireSharingConfig();
    await this.ensureUserReference();
    const normalizedFolder = String(defaultInboxFolder || this.settings.telegramDefaultInboxFolder || "").trim() || "Inbox/Telegram";
    const timezone = typeof Intl !== "undefined" && Intl.DateTimeFormat && Intl.DateTimeFormat().resolvedOptions ? Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC" : "UTC";
    const payload = await this.requestJson(
      "POST",
      `/users/${encodeURIComponent(this.settings.userId)}/telegram-link-requests`,
      {
        default_vault_id: this.settings.vaultId,
        default_inbox_folder: normalizedFolder,
        timezone_name: timezone
      }
    );
    const linkRequest = payload.telegram_link_request || {};
    this.settings.telegramDefaultInboxFolder = normalizedFolder;
    this.settings.telegramLastLinkCode = linkRequest.one_time_code || "";
    this.settings.telegramLastLinkExpiresAt = linkRequest.expires_at || "";
    await this.saveSettings();
    return payload;
  }
  async listTelegramLinks() {
    if (!this.settings.baseUrl || !this.settings.userEmail && !this.settings.userId) {
      throw new Error(this.t("error.telegramLinksNeedAccount"));
    }
    await this.ensureUserReference();
    const payload = await this.requestJson(
      "GET",
      `/users/${encodeURIComponent(this.settings.userId)}/telegram-links`
    );
    return Array.isArray(payload.telegram_links) ? payload.telegram_links : [];
  }
  async revokeTelegramLink(linkId) {
    if (!this.settings.baseUrl || !this.settings.userEmail && !this.settings.userId) {
      throw new Error(this.t("error.telegramLinksNeedAccount"));
    }
    await this.ensureUserReference();
    const query = new URLSearchParams();
    if (this.settings.userEmail) {
      query.set("user_email", this.settings.userEmail);
    } else {
      query.set("user_id", this.settings.userId);
    }
    return this.requestJson(
      "DELETE",
      `/telegram-links/${encodeURIComponent(linkId)}?${query.toString()}`
    );
  }
  requireSharingConfig() {
    if (!this.settings.baseUrl || !this.settings.userEmail && !this.settings.userId || !this.settings.vaultId) {
      throw new Error(this.t("error.sharingConfigRequired"));
    }
  }
  async fetchVaultSyncSnapshot() {
    const snapshotState = this.settings.snapshotState || DEFAULT_SETTINGS.snapshotState;
    const clientVaultFingerprint = await computeVaultSnapshotFingerprint(
      this.filterSyncableStateEntries(this.settings.state.entries || {}),
      { includeObsidianConfig: this.settings.syncObsidianConfig === true }
    );
    const clientCrdtHeadsFingerprint = await computeCrdtHeadsFingerprint(
      this.settings.crdtState && this.settings.crdtState.files ? this.settings.crdtState.files : {},
      this.settings.state && this.settings.state.entries ? this.settings.state.entries : {}
    );
    const body = {
      client_vault_snapshot_fingerprint: clientVaultFingerprint,
      client_crdt_heads_fingerprint: clientCrdtHeadsFingerprint,
      include_obsidian_config: this.settings.syncObsidianConfig === true,
      include_crdt_heads: this.settings.crdtMarkdownEnabled === true
    };
    if (snapshotState.revision !== null && snapshotState.revision !== void 0 && Number.isFinite(Number(snapshotState.revision))) {
      body.since_revision = Number(snapshotState.revision);
    }
    return this.requestJson(
      "POST",
      `/vaults/${this.settings.vaultId}/sync-snapshot`,
      body
    );
  }
  applyVaultSyncSnapshot(snapshot2) {
    if (!snapshot2 || typeof snapshot2 !== "object") {
      return;
    }
    this.settings.snapshotState = this.settings.snapshotState || {
      ...DEFAULT_SETTINGS.snapshotState
    };
    if (Number.isFinite(Number(snapshot2.revision))) {
      this.settings.snapshotState.revision = Number(snapshot2.revision);
    }
    this.settings.snapshotState.vaultFingerprint = String(
      snapshot2.vault_snapshot_fingerprint || ""
    );
    this.settings.snapshotState.crdtHeadsFingerprint = String(
      snapshot2.crdt_heads_fingerprint || ""
    );
  }
  snapshotDeltaPaths(snapshot2, pendingLocalPaths) {
    return Array.from(
      new Set([
        ...Array.isArray(snapshot2 && snapshot2.changed_paths) ? snapshot2.changed_paths : [],
        ...Object.keys(pendingLocalPaths || {})
      ].map((path) => normalizePath(String(path || ""))).filter(Boolean))
    );
  }
  snapshotDeltaCrdtPaths(snapshot2, pendingLocalPaths) {
    return Array.from(
      new Set([
        ...Array.isArray(snapshot2 && snapshot2.changed_crdt_heads) ? snapshot2.changed_crdt_heads.map((head) => head && head.path) : [],
        ...Object.keys(pendingLocalPaths || {}).filter(
          (path) => this.shouldUseCrdtForPath(path)
        )
      ].map((path) => normalizePath(String(path || ""))).filter(Boolean))
    );
  }
  async syncNow(options = {}) {
    if (this.syncInFlight) {
      this.pendingChangesDuringSync = true;
      if (options.notify !== false) {
        new Notice(this.t("notice.syncAlreadyRunning"));
      }
      return null;
    }
    if (!this.isConfigured()) {
      throw new Error(this.t("error.pluginNotConfigured"));
    }
    this.syncInFlight = true;
    const pendingLocalPathsAtStart = this.getPendingLocalPathSnapshot();
    const report = this.createSyncReport();
    let snapshotComparison = null;
    let fullAudit = options.forceFullAudit === true;
    let deltaPaths = Object.keys(pendingLocalPathsAtStart);
    let deltaCrdtPaths = deltaPaths.filter((path) => this.shouldUseCrdtForPath(path));
    let sessionId = null;
    let remoteEntriesBeforePush = null;
    let finalStatus = "completed";
    let finalErrorMessage = null;
    try {
      this.currentSyncStage = "check-crdt-collaboration";
      await this.disableCrdtMarkdownIfCollaborationBlocked();
      this.currentSyncStage = "compare-vault-snapshot";
      try {
        snapshotComparison = await this.fetchVaultSyncSnapshot();
        fullAudit = fullAudit || snapshotComparison.reset_required === true;
        deltaPaths = this.snapshotDeltaPaths(snapshotComparison, pendingLocalPathsAtStart);
        deltaCrdtPaths = this.snapshotDeltaCrdtPaths(
          snapshotComparison,
          pendingLocalPathsAtStart
        );
      } catch (error) {
        if (![404, 405].includes(Number(error && error.statusCode))) {
          throw error;
        }
        fullAudit = true;
      }
      const hasPendingLocalPathsAtStart = Object.keys(pendingLocalPathsAtStart).length > 0;
      if (!fullAudit && snapshotComparison && snapshotComparison.unchanged !== true && snapshotComparison.fingerprints_match === false && deltaPaths.length === 0 && deltaCrdtPaths.length === 0 && !hasPendingLocalPathsAtStart && this.settings.lastSyncWarning === "vault_snapshot_fingerprint_mismatch") {
        this.applyVaultSyncSnapshot(snapshotComparison);
        this.settings.lastSyncAt = (/* @__PURE__ */ new Date()).toISOString();
        this.settings.lastError = "";
        this.settings.lastSyncWarning = "vault_snapshot_fingerprint_mismatch";
        await this.saveSettings();
        return report;
      }
      this.beginSyncProgress(
        options.onProgress,
        fullAudit ? [] : deltaPaths,
        fullAudit ? null : deltaPaths
      );
      if (!fullAudit && snapshotComparison && snapshotComparison.unchanged === true && !hasPendingLocalPathsAtStart && !this.hasPersistedPendingDeletes()) {
        this.applyVaultSyncSnapshot(snapshotComparison);
        this.settings.lastSyncAt = (/* @__PURE__ */ new Date()).toISOString();
        this.settings.lastError = "";
        if (snapshotComparison.fingerprints_match === true) {
          this.settings.lastSyncWarning = "";
        }
        await this.saveSettings();
        return report;
      }
      this.currentSyncStage = "create-session";
      if (this.hasPersistedPendingDeletes()) {
        remoteEntriesBeforePush = await this.fetchRemoteFileIndex();
        this.clearPendingDeletesMissingFromRemoteIndex(remoteEntriesBeforePush);
      }
      const clientSnapshotEntries = this.withPendingDeleteBaselinesForFingerprint(
        this.filterSyncableStateEntries(this.settings.state.entries || {})
      );
      const sendsWholeVaultSnapshot = this.getSyncFolderPaths().includes("");
      const clientSnapshotFingerprint = sendsWholeVaultSnapshot ? await computeVaultSnapshotFingerprint(
        clientSnapshotEntries,
        { includeObsidianConfig: this.settings.syncObsidianConfig === true }
      ) : "";
      const sessionRequestBody = {
        vault_id: this.settings.vaultId,
        device_id: this.settings.deviceId,
        direction: "bidirectional",
        include_obsidian_config: this.settings.syncObsidianConfig === true
      };
      if (clientSnapshotFingerprint) {
        sessionRequestBody.client_snapshot_fingerprint = clientSnapshotFingerprint;
      }
      const sessionPayload = await this.requestJson(
        "POST",
        "/sync-sessions",
        sessionRequestBody
      );
      sessionId = sessionPayload.sync_session.id;
      const responseWarning = typeof sessionPayload.divergence_warning === "string" && sessionPayload.divergence_warning ? sessionPayload.divergence_warning : null;
      const serverSnapshotFingerprint = typeof sessionPayload.vault_snapshot_fingerprint === "string" ? sessionPayload.vault_snapshot_fingerprint : "";
      if (responseWarning) {
        report.divergenceWarning = responseWarning;
      } else if (serverSnapshotFingerprint && clientSnapshotFingerprint && serverSnapshotFingerprint !== clientSnapshotFingerprint) {
        report.divergenceWarning = "vault_snapshot_fingerprint_mismatch";
      }
      if (Object.keys(this.settings.state.entries || {}).length === 0) {
        this.currentSyncStage = "bootstrap-from-remote";
        await this.maybeBootstrapFromRemote(report);
      }
      this.settings.state.entries = this.filterSyncableStateEntries(
        this.settings.state.entries
      );
      this.currentSyncStage = "reconcile-local-state-with-remote-index";
      remoteEntriesBeforePush = remoteEntriesBeforePush || await this.fetchRemoteFileIndex();
      for (const remoteEntry of remoteEntriesBeforePush) {
        const snapshotEntry = this.remoteFileEntryToSnapshotEntry(remoteEntry);
        if (snapshotEntry && snapshotEntry.entryType === "file" && this.shouldApplyRemotePath(remoteEntry.path)) {
          this.trackSyncFile?.(remoteEntry.path);
        }
      }
      this.settings.state.entries = await this.pruneStateEntriesMissingFromRemoteIndex(
        this.settings.state.entries,
        remoteEntriesBeforePush
      );
      if (this.settings.obsidianConfigBootstrapPending === true) {
        this.currentSyncStage = "bootstrap-obsidian-config";
        await this.bootstrapObsidianConfigFromRemote(remoteEntriesBeforePush, report);
      }
      const previousEntries = cloneEntries(this.settings.state.entries);
      const baselineEntries = cloneEntries(this.settings.state.entries);
      this.currentSyncStage = "scan-local-before-push";
      const currentSnapshot = await this.scanVault(previousEntries);
      this.applyPendingExplicitDeletes(
        previousEntries,
        currentSnapshot,
        remoteEntriesBeforePush
      );
      this.applyImplicitDirectoryDeletes(
        previousEntries,
        currentSnapshot,
        remoteEntriesBeforePush
      );
      this.currentSyncStage = "push-local-changes";
      await this.pushLocalChanges(sessionId, previousEntries, currentSnapshot, report);
      this.currentSyncStage = "sync-crdt-markdown";
      await this.syncCrdtMarkdownFiles(report, {
        paths: fullAudit ? null : deltaCrdtPaths,
        remoteEntries: remoteEntriesBeforePush
      });
      this.currentSyncStage = "pull-remote-changes";
      await this.pullRemoteChanges(baselineEntries, report);
      this.currentSyncStage = "reconcile-remote-index";
      await this.reconcileRemoteFileIndex(baselineEntries, report);
      this.currentSyncStage = "scan-local-after-pull";
      const finalEntries = await this.scanVault(this.settings.state.entries);
      const acceptedPushAwareEntries = this.preserveAcceptedPushBaselines(
        finalEntries,
        report
      );
      const conflictAwareEntries = await this.preserveOpenConflictUnsyncedBaselines(
        acceptedPushAwareEntries,
        previousEntries,
        report
      );
      const locallyStableEntries = this.preserveLocalChangesDuringSyncBaselines(
        conflictAwareEntries,
        currentSnapshot,
        report
      );
      this.settings.state.entries = await this.preserveActiveEditLeaseUnsyncedBaseline(
        locallyStableEntries,
        currentSnapshot
      );
      this.completeSyncFiles?.(
        Object.entries(this.settings.state.entries).filter(([, entry]) => entry && entry.entryType === "file").map(([path]) => path)
      );
      await this.clearCompletedPendingExplicitDeletes();
      this.clearProcessedLocalPaths(pendingLocalPathsAtStart);
      if (fullAudit) {
        this.settings.snapshotState = this.settings.snapshotState || {
          ...DEFAULT_SETTINGS.snapshotState
        };
        this.settings.snapshotState.lastFullAuditAt = (/* @__PURE__ */ new Date()).toISOString();
      }
      try {
        const finalSnapshot = await this.fetchVaultSyncSnapshot();
        this.applyVaultSyncSnapshot(finalSnapshot);
        const finalVaultFingerprint = await computeVaultSnapshotFingerprint(
          this.filterSyncableStateEntries(this.settings.state.entries || {}),
          { includeObsidianConfig: this.settings.syncObsidianConfig === true }
        );
        const finalCrdtFingerprint = await computeCrdtHeadsFingerprint(
          this.settings.crdtState.files || {},
          this.settings.state.entries || {}
        );
        const crdtFingerprintMatches = this.settings.crdtMarkdownEnabled !== true || finalCrdtFingerprint === String(finalSnapshot.crdt_heads_fingerprint || "");
        if (finalVaultFingerprint === String(finalSnapshot.vault_snapshot_fingerprint || "") && crdtFingerprintMatches) {
          report.divergenceWarning = null;
        }
      } catch (error) {
        console.warn("[obsidian-http-sync] failed to refresh sync snapshot", error);
      }
      this.settings.lastSyncAt = (/* @__PURE__ */ new Date()).toISOString();
      this.settings.lastError = "";
      this.settings.lastSyncWarning = report.divergenceWarning || "";
      this.settings.obsidianConfigBootstrapPending = false;
      this.renameHints = {};
      this.settings.pendingRenameHints = {};
      await this.saveSettings();
      let openConflicts = [];
      try {
        openConflicts = await this.syncConflictState();
      } catch (error) {
        console.error("[obsidian-http-sync] Failed to refresh conflict state", error);
      }
      report.conflicts = openConflicts.length;
      if (options.notify !== false) {
        const hasWarnings = Boolean(report.divergenceWarning) || report.conflicts > 0;
        new Notice(
          this.t(hasWarnings ? "notice.syncDoneWithWarning" : "notice.syncDone", {
            pushed: report.pushedOperations,
            pulled: report.pulledOperations,
            conflicts: report.conflicts
          })
        );
      }
      return report;
    } catch (error) {
      finalStatus = "failed";
      classifyAndUpdateAuthState(this, error);
      finalErrorMessage = formatErrorWithContext(
        this.settings.language,
        this.currentSyncStage,
        error
      );
      this.settings.lastError = finalErrorMessage;
      await this.saveSettings();
      if (options.notify !== false) {
        const authNotification = buildAuthFailureNotice(this, error);
        new Notice(
          authNotification || this.t("notice.syncFailed", { message: finalErrorMessage })
        );
      }
      throw error;
    } finally {
      this.currentSyncStage = null;
      if (sessionId !== null) {
        try {
          await this.requestJson("PATCH", `/sync-sessions/${sessionId}`, {
            status: finalStatus,
            error_message: finalErrorMessage
          });
        } catch (error) {
          console.error("[obsidian-http-sync] failed to close session", error);
        }
      }
      this.syncInFlight = false;
      this.syncProgress = null;
      if (finalStatus !== "completed") {
        this.pendingChangesDuringSync = false;
        this.autoSyncRetryNotBefore = Date.now() + AUTO_SYNC_FAILURE_BACKOFF_MS;
      } else {
        this.autoSyncRetryNotBefore = 0;
        if (this.settings.autoSync && this.pendingChangesDuringSync) {
          this.pendingChangesDuringSync = false;
          this.enqueueAutoSync("follow-up", EVENT_SYNC_DEBOUNCE_MS);
        }
      }
      this.updateSyncStatusBarItem();
    }
  }
  async pushLocalChanges(sessionId, previousEntries, currentSnapshot, report, options = {}) {
    const operationGuard = {
      operationSource: options.operationSource || "sync_diff",
      manualOverride: options.manualOverride === true
    };
    const mergedRenameHints = {
      ...this.settings.pendingRenameHints || {},
      ...this.renameHints
    };
    const plan = planLocalChanges(
      previousEntries,
      currentSnapshot,
      this.filterRenameHintsTargetingPendingDeletes(mergedRenameHints)
    );
    for (const path of plan.fileDeletes) {
      this.trackSyncFile?.(path);
    }
    for (const move of plan.moves) {
      const previousEntry = previousEntries[move.path];
      if (previousEntry && previousEntry.entryType === "file") {
        this.trackSyncFile?.(move.targetPath || move.path);
      }
    }
    for (const path of plan.fileUpserts) {
      if (!this.shouldUseCrdtForPath(path)) {
        this.trackSyncFile?.(path);
      }
    }
    this.clearPendingDeletesForCurrentSnapshot(currentSnapshot, previousEntries);
    const directoryDeletes = this.partitionDirectoryDeletes(
      plan.directoryDeletes,
      plan.moves
    );
    const plannedDeleteCount = plan.fileDeletes.length + directoryDeletes.beforeMoves.length + directoryDeletes.afterMoves.length;
    const baselineEntryCount = Object.keys(previousEntries || {}).length;
    const deleteBatchBlockReason = this.deleteBatchBlockReason(
      plannedDeleteCount,
      baselineEntryCount,
      report
    );
    const noteLeaseBlockCache = /* @__PURE__ */ new Map();
    const shouldBlockNoteChange = async (path) => {
      const normalizedPath = normalizePath(String(path || ""));
      if (!normalizedPath) {
        return false;
      }
      if (noteLeaseBlockCache.has(normalizedPath)) {
        return noteLeaseBlockCache.get(normalizedPath);
      }
      const blocked = await this.isNoteChangeBlockedByOtherLeaseFresh(normalizedPath);
      noteLeaseBlockCache.set(normalizedPath, blocked);
      return blocked;
    };
    const shouldClaimNoteChange = async (path, options2 = {}) => {
      if (operationGuard.operationSource !== "sync_diff" || operationGuard.manualOverride === true) {
        return true;
      }
      return this.claimLocalDiffNoteEditLock(path, options2);
    };
    for (const path of plan.fileDeletes) {
      if (this.isPathOpenConflict(path, report)) {
        this.pendingChangesDuringSync = true;
        continue;
      }
      const previousEntry = previousEntries[path];
      if (!this.shouldSendDeleteOperation(
        path,
        previousEntry,
        currentSnapshot,
        report,
        deleteBatchBlockReason
      )) {
        continue;
      }
      if (await shouldBlockNoteChange(path)) {
        this.pendingChangesDuringSync = true;
        this.showNoteLeaseBlockedNotice(path, { structural: true });
        continue;
      }
      const deletePayload = {
        client_operation_id: generateClientOperationId(),
        operation_type: "delete",
        entry_type: "file",
        path,
        storage_delta_bytes: -previousEntry.sizeBytes,
        base_content_hash: previousEntry.contentHash || null
      };
      const conflict = await this.recordGuardedOperation(
        sessionId,
        deletePayload,
        report,
        operationGuard
      );
      if (!conflict) {
        this.clearPendingDeletePath(path);
        this.completeSyncFile?.(path);
      }
    }
    for (const path of directoryDeletes.beforeMoves) {
      if (this.isPathOpenConflict(path, report)) {
        this.pendingChangesDuringSync = true;
        continue;
      }
      if (await shouldBlockNoteChange(path)) {
        this.showNoteLeaseBlockedNotice(path, { structural: true });
        continue;
      }
      const previousEntry = previousEntries[path];
      if (!this.shouldSendDeleteOperation(
        path,
        previousEntry,
        currentSnapshot,
        report,
        deleteBatchBlockReason
      )) {
        continue;
      }
      const conflict = await this.recordGuardedOperation(
        sessionId,
        {
          client_operation_id: generateClientOperationId(),
          operation_type: "rmdir",
          entry_type: "directory",
          path,
          storage_delta_bytes: 0
        },
        report,
        operationGuard
      );
      if (!conflict) {
        this.clearPendingDeletePath(path);
      }
    }
    for (const path of plan.directoryCreates) {
      if (await shouldBlockNoteChange(path)) {
        this.showNoteLeaseBlockedNotice(path, { structural: true });
        continue;
      }
      await this.recordGuardedOperation(
        sessionId,
        {
          client_operation_id: generateClientOperationId(),
          operation_type: "mkdir",
          entry_type: "directory",
          path,
          storage_delta_bytes: 0
        },
        report,
        operationGuard
      );
    }
    for (const move of plan.moves) {
      if (this.isPathOpenConflict(move.path, report) || this.isPathOpenConflict(move.targetPath, report)) {
        this.pendingChangesDuringSync = true;
        continue;
      }
      if (await shouldBlockNoteChange(move.path) || await shouldBlockNoteChange(move.targetPath)) {
        this.showNoteLeaseBlockedNotice(move.path || move.targetPath, {
          structural: true
        });
        continue;
      }
      if (!await shouldClaimNoteChange(move.path, { structural: true }) || !await shouldClaimNoteChange(move.targetPath, { structural: true })) {
        continue;
      }
      const previousEntry = previousEntries[move.path];
      if (!previousEntry) {
        continue;
      }
      if (previousEntry.entryType === "directory") {
        await this.ensureParentDirectories(move.targetPath);
        await this.recordGuardedOperation(
          sessionId,
          {
            client_operation_id: generateClientOperationId(),
            operation_type: "move",
            entry_type: "directory",
            path: move.path,
            target_path: move.targetPath,
            storage_delta_bytes: 0
          },
          report,
          operationGuard
        );
        continue;
      }
      if (previousEntry.entryType !== "file") {
        continue;
      }
      await this.ensureParentDirectories(move.targetPath);
      const conflict = await this.recordGuardedOperation(
        sessionId,
        {
          client_operation_id: generateClientOperationId(),
          operation_type: "move",
          entry_type: "file",
          path: move.path,
          target_path: move.targetPath,
          storage_delta_bytes: 0,
          base_content_hash: previousEntry.contentHash || null
        },
        report,
        operationGuard
      );
      if (!conflict) {
        this.completeSyncFile?.(move.targetPath || move.path);
      }
    }
    for (const path of directoryDeletes.afterMoves) {
      if (this.isPathOpenConflict(path, report)) {
        this.pendingChangesDuringSync = true;
        continue;
      }
      if (await shouldBlockNoteChange(path)) {
        this.showNoteLeaseBlockedNotice(path, { structural: true });
        continue;
      }
      const previousEntry = previousEntries[path];
      if (!this.shouldSendDeleteOperation(
        path,
        previousEntry,
        currentSnapshot,
        report,
        deleteBatchBlockReason
      )) {
        continue;
      }
      const conflict = await this.recordGuardedOperation(
        sessionId,
        {
          client_operation_id: generateClientOperationId(),
          operation_type: "rmdir",
          entry_type: "directory",
          path,
          storage_delta_bytes: 0
        },
        report,
        operationGuard
      );
      if (!conflict) {
        this.clearPendingDeletePath(path);
      }
    }
    for (const path of plan.fileUpserts) {
      if (this.shouldUseCrdtForPath(path)) {
        continue;
      }
      if (this.isPathOpenConflict(path, report)) {
        this.pendingChangesDuringSync = true;
        continue;
      }
      if (await shouldBlockNoteChange(path)) {
        this.showNoteLeaseBlockedNotice(path, { structural: false });
        continue;
      }
      if (!await shouldClaimNoteChange(path, { structural: false })) {
        continue;
      }
      const basePath = plan.upsertBasePaths[path] || path;
      const previousBaseEntry = previousEntries[basePath];
      const currentEntry = await this.readCurrentEntry(path, previousBaseEntry);
      if (!currentEntry || currentEntry.entryType !== "file") {
        continue;
      }
      const binaryPayload = await this.readFileBinary(path);
      const uploadPayload = await this.requestJson(
        "POST",
        `/sync-sessions/${sessionId}/objects`,
        null,
        toArrayBuffer(binaryPayload),
        {
          "Content-Type": "application/octet-stream"
        }
      );
      if (uploadPayload.already_present) {
        report.reusedObjects += 1;
      } else {
        report.uploadedObjects += 1;
      }
      const previousEntry = previousBaseEntry;
      const previousSize = previousEntry && previousEntry.entryType === "file" ? previousEntry.sizeBytes : 0;
      const baseContentHash = previousEntry && previousEntry.entryType === "file" ? previousEntry.contentHash || null : null;
      const conflict = await this.recordGuardedOperation(
        sessionId,
        {
          client_operation_id: generateClientOperationId(),
          operation_type: "upsert",
          entry_type: "file",
          path,
          storage_delta_bytes: currentEntry.sizeBytes - previousSize,
          content_hash: uploadPayload.object.content_hash,
          base_content_hash: baseContentHash
        },
        report,
        operationGuard
      );
      if (!conflict) {
        this.rememberAcceptedPushBaseline(report, path, {
          entryType: "file",
          contentHash: uploadPayload.object.content_hash,
          sizeBytes: binaryPayload.byteLength,
          mtimeMs: currentEntry.mtimeMs
        });
        this.clearPendingDeletePath(path);
        this.completeSyncFile?.(path);
      }
    }
  }
  async maybeBootstrapFromRemote(report) {
    const baselineEntries = {};
    await this.reconcileRemoteFileIndex(baselineEntries, report);
    await this.pullRemoteChanges(baselineEntries, report);
    this.settings.state.entries = baselineEntries;
    return Object.keys(baselineEntries).length > 0 || report.pulledOperations > 0;
  }
  async advanceRemoteCursorToLatestFeedSequence() {
    const bootstrapReport = { pulledOperations: 0 };
    await this.pullRemoteChanges({}, bootstrapReport);
    return bootstrapReport.pulledOperations > 0;
  }
  async pullRemoteChanges(baselineEntries, report) {
    while (true) {
      const feedPayload = await this.requestJson(
        "GET",
        `/devices/${this.settings.deviceId}/vaults/${this.settings.vaultId}/feed?limit=100`
      );
      const operations = Array.isArray(feedPayload.operations) ? feedPayload.operations : [];
      if (operations.length === 0) {
        return;
      }
      for (const operation of operations) {
        if (!this.shouldApplyRemoteOperation(operation)) {
          continue;
        }
        const syncFilePath = this.getRemoteOperationSyncFilePath(operation);
        if (syncFilePath) {
          this.trackSyncFile?.(syncFilePath);
        }
      }
      let lastAppliedSequenceNumber = 0;
      for (const operation of operations) {
        const operationSequenceNumber = Number(operation.sequence_number || 0);
        if (!this.shouldApplyRemoteOperation(operation)) {
          lastAppliedSequenceNumber = Math.max(lastAppliedSequenceNumber, operationSequenceNumber);
          continue;
        }
        const syncFilePath = this.getRemoteOperationSyncFilePath(operation);
        const applyResult = await this.applyRemoteOperation(operation, baselineEntries, report);
        if (applyResult && applyResult.deferred) {
          if (lastAppliedSequenceNumber > 0) {
            await this.requestJson(
              "PATCH",
              `/devices/${this.settings.deviceId}/vaults/${this.settings.vaultId}/cursor`,
              {
                last_applied_sequence_number: lastAppliedSequenceNumber
              }
            );
          }
          return;
        }
        if (syncFilePath && (!applyResult || applyResult.applied !== false)) {
          this.completeSyncFile?.(syncFilePath);
        }
        lastAppliedSequenceNumber = Math.max(lastAppliedSequenceNumber, operationSequenceNumber);
      }
      if (lastAppliedSequenceNumber > 0) {
        await this.requestJson(
          "PATCH",
          `/devices/${this.settings.deviceId}/vaults/${this.settings.vaultId}/cursor`,
          {
            last_applied_sequence_number: lastAppliedSequenceNumber
          }
        );
      }
    }
  }
  getRemoteOperationSyncFilePath(operation) {
    if (!operation || String(operation.entry_type || "") !== "file") {
      return "";
    }
    const operationType = String(operation.operation_type || "");
    if (!["upsert", "delete", "move"].includes(operationType)) {
      return "";
    }
    return normalizePath(
      String(operationType === "move" ? operation.target_path || operation.path || "" : operation.path || "")
    );
  }
  shouldApplyRemoteOperation(operation) {
    const candidatePaths = [];
    if (operation && operation.path !== null && operation.path !== void 0) {
      candidatePaths.push(normalizePath(String(operation.path)));
    }
    if (operation && operation.target_path !== null && operation.target_path !== void 0) {
      candidatePaths.push(normalizePath(String(operation.target_path)));
    }
    return candidatePaths.some(
      (path) => this.shouldApplyRemotePath(path)
    );
  }
  shouldApplyRemotePath(path) {
    const normalizedPath = normalizePath(String(path || ""));
    if (this.isPathIgnoredByPattern(normalizedPath) || isConflictArtifactPath(normalizedPath)) {
      return false;
    }
    return this.isPathInSyncScope(normalizedPath) || this.isPathAncestorOfSyncScope(normalizedPath);
  }
  filterSyncableStateEntries(entries) {
    const filteredEntries = {};
    for (const [path, entry] of Object.entries(entries || {})) {
      const normalizedPath = normalizePath(String(path || ""));
      if (!normalizedPath || this.shouldIgnorePath(normalizedPath)) {
        continue;
      }
      filteredEntries[normalizedPath] = entry;
    }
    return filteredEntries;
  }
  hasPersistedPendingDeletes() {
    return Boolean(
      this.settings && this.settings.pendingDeletes && typeof this.settings.pendingDeletes === "object" && Object.keys(this.settings.pendingDeletes).length > 0
    );
  }
  withPendingDeleteBaselinesForFingerprint(entries) {
    const fingerprintEntries = { ...entries || {} };
    const pendingDeletes = this.settings && this.settings.pendingDeletes && typeof this.settings.pendingDeletes === "object" ? this.settings.pendingDeletes : {};
    for (const [path, pendingEntry] of Object.entries(pendingDeletes)) {
      const normalizedPath = normalizePath(String(path || ""));
      if (!normalizedPath || fingerprintEntries[normalizedPath] || !pendingEntry || !this.shouldApplyRemotePath(normalizedPath)) {
        continue;
      }
      const entryType = String(pendingEntry.entryType || "").trim().toLowerCase();
      if (entryType !== "file" && entryType !== "directory") {
        continue;
      }
      fingerprintEntries[normalizedPath] = {
        entryType,
        contentHash: entryType === "file" ? pendingEntry.contentHash || null : null,
        sizeBytes: entryType === "file" ? Number(pendingEntry.sizeBytes || 0) : 0,
        mtimeMs: null
      };
    }
    return fingerprintEntries;
  }
  clearPendingDeletesMissingFromRemoteIndex(remoteEntries) {
    if (!this.hasPersistedPendingDeletes()) {
      return false;
    }
    const remotePaths = new Set(
      (remoteEntries || []).filter((entry) => entry && entry.path && !entry.is_deleted).map((entry) => normalizePath(String(entry.path || ""))).filter(Boolean)
    );
    let changed = false;
    for (const path of Object.keys(this.settings.pendingDeletes)) {
      const normalizedPath = normalizePath(String(path || ""));
      if (!normalizedPath || !remotePaths.has(normalizedPath)) {
        delete this.settings.pendingDeletes[path];
        changed = true;
      }
    }
    return changed;
  }
  async reconcileRemoteFileIndex(baselineEntries, report) {
    const syncableEntries = (await this.fetchRemoteFileIndex()).filter((entry) => entry.path && !entry.is_deleted && this.shouldApplyRemotePath(entry.path)).sort((left, right) => {
      if (left.entry_type !== right.entry_type) {
        return left.entry_type === "directory" ? -1 : 1;
      }
      const depthDelta = pathDepth(left.path) - pathDepth(right.path);
      return depthDelta || left.path.localeCompare(right.path);
    });
    for (const remoteEntry of syncableEntries) {
      const snapshotEntry = this.remoteFileEntryToSnapshotEntry(remoteEntry);
      if (snapshotEntry && snapshotEntry.entryType === "file") {
        this.trackSyncFile?.(remoteEntry.path);
      }
    }
    for (const remoteEntry of syncableEntries) {
      const path = remoteEntry.path;
      if (typeof this.isPendingRenameSourcePath === "function" && this.isPendingRenameSourcePath(path)) {
        continue;
      }
      if (typeof this.isPendingLocalDeletePath === "function" && this.isPendingLocalDeletePath(path)) {
        continue;
      }
      const snapshotEntry = this.remoteFileEntryToSnapshotEntry(remoteEntry);
      if (!snapshotEntry) {
        continue;
      }
      const tracksFileProgress = snapshotEntry.entryType === "file";
      if (tracksFileProgress) {
        this.trackSyncFile?.(path);
      }
      const sameChecksumBaseline = await this.adoptRemoteBaselineIfSameChecksum(
        path,
        snapshotEntry,
        baselineEntries
      );
      if (sameChecksumBaseline.matched) {
        if (tracksFileProgress) {
          this.completeSyncFile?.(path);
        }
        continue;
      }
      let currentEntry = sameChecksumBaseline.currentEntry;
      if (this.shouldUseCrdtForPath(path)) {
        await this.ensureCrdtDoc(path);
        const crdtBaseline = await this.adoptRemoteBaselineIfSameChecksum(
          path,
          snapshotEntry,
          baselineEntries
        );
        if (crdtBaseline.matched) {
          if (tracksFileProgress) {
            this.completeSyncFile?.(path);
          }
          continue;
        }
        currentEntry = crdtBaseline.currentEntry;
      }
      if (typeof this.shouldDeferRemoteApplyForNoteLease === "function" ? await this.shouldDeferRemoteApplyForNoteLease(path, baselineEntries) : typeof this.shouldDeferRemoteApplyForActiveEditLease === "function" && this.shouldDeferRemoteApplyForActiveEditLease(path)) {
        continue;
      }
      if (typeof this.shouldDeferRemoteApplyForOpenConflict === "function" && this.shouldDeferRemoteApplyForOpenConflict(path, report)) {
        continue;
      }
      if (shouldDeferRemoteApply(baselineEntries[path] || null, currentEntry, snapshotEntry)) {
        continue;
      }
      this.markSuppressedPath(path);
      if (await this.hasUnsyncedLocalChange(path, baselineEntries)) {
        await this.captureConflictCopy(path);
      }
      if (snapshotEntry.entryType === "directory") {
        if (currentEntry && currentEntry.entryType !== "directory") {
          await this.removePath(path);
        }
        await this.ensureDirectory(path);
      } else {
        if (currentEntry && currentEntry.entryType === "directory") {
          await this.removePath(path);
        }
        const binaryResponse = await this.downloadRemoteContentForSync(
          snapshotEntry.contentHash,
          "bootstrap-from-remote",
          path,
          report
        );
        if (!binaryResponse) {
          continue;
        }
        if ((typeof this.shouldDeferRemoteApplyForNoteLease === "function" ? await this.shouldDeferRemoteApplyForNoteLease(path, baselineEntries) : typeof this.shouldDeferRemoteApplyForActiveEditLease === "function" && this.shouldDeferRemoteApplyForActiveEditLease(path)) || typeof this.shouldDeferRemoteApplyForOpenConflict === "function" && this.shouldDeferRemoteApplyForOpenConflict(path, report) || await this.hasUnsyncedLocalChange(path, baselineEntries)) {
          continue;
        }
        await this.writeBinaryFile(path, binaryResponse);
        this.markClassicMarkdownForCrdtBridge(path);
      }
      await this.refreshBaselineEntry(baselineEntries, path);
      this.addReportRemoteAppliedPath(report, path, baselineEntries[path] || null);
      report.pulledOperations += 1;
      if (tracksFileProgress) {
        this.completeSyncFile?.(path);
      }
    }
  }
  isPendingRenameSourcePath(path) {
    const normalizedPath = normalizePath(String(path || ""));
    if (!normalizedPath) {
      return false;
    }
    const renameHints = {
      ...this.settings && this.settings.pendingRenameHints ? this.settings.pendingRenameHints : {},
      ...this.renameHints || {}
    };
    return Object.values(renameHints).some((sourcePath) => {
      const normalizedSourcePath = normalizePath(String(sourcePath || ""));
      return normalizedSourcePath && (normalizedPath === normalizedSourcePath || normalizedPath.startsWith(`${normalizedSourcePath}/`));
    });
  }
  isPendingRenameTargetPath(path) {
    const normalizedPath = normalizePath(String(path || ""));
    if (!normalizedPath) {
      return false;
    }
    const renameHints = {
      ...this.settings && this.settings.pendingRenameHints ? this.settings.pendingRenameHints : {},
      ...this.renameHints || {}
    };
    return Object.keys(renameHints).some((targetPath) => {
      const normalizedTargetPath = normalizePath(String(targetPath || ""));
      return normalizedTargetPath && (normalizedPath === normalizedTargetPath || normalizedPath.startsWith(`${normalizedTargetPath}/`));
    });
  }
  async adoptRemoteBaselineIfSameChecksum(path, snapshotEntry, baselineEntries) {
    const currentEntry = await this.readCurrentEntry(path, baselineEntries[path]);
    if (currentEntry && sameSyncIdentity(currentEntry, snapshotEntry)) {
      baselineEntries[path] = currentEntry;
      return { matched: true, currentEntry };
    }
    return { matched: false, currentEntry };
  }
  async fetchRemoteFileIndex() {
    const pageSize = 1e3;
    const files = [];
    const seenPageSignatures = /* @__PURE__ */ new Set();
    for (let offset = 0; ; offset += pageSize) {
      const payload = await this.requestJson(
        "GET",
        `/vaults/${this.settings.vaultId}/files?include_deleted=false&limit=${pageSize}&offset=${offset}`
      );
      const page = Array.isArray(payload.files) ? payload.files : [];
      const firstEntry = page[0] || {};
      const lastEntry = page[page.length - 1] || {};
      const pageSignature = [
        page.length,
        firstEntry.id || firstEntry.path || "",
        lastEntry.id || lastEntry.path || ""
      ].join(":");
      if (page.length > 0 && seenPageSignatures.has(pageSignature)) {
        throw new Error("remote_file_index_pagination_unsupported");
      }
      seenPageSignatures.add(pageSignature);
      files.push(...page);
      if (page.length < pageSize) {
        break;
      }
    }
    return files.map((entry) => ({
      ...entry,
      path: normalizePath(String(entry.path || "")),
      entry_type: String(entry.entry_type || "")
    }));
  }
  async pruneStateEntriesMissingFromRemoteIndex(entries, remoteEntries) {
    const remotePaths = new Set(
      remoteEntries.filter((entry) => entry.path && !entry.is_deleted && this.shouldApplyRemotePath(entry.path)).map((entry) => entry.path)
    );
    const prunedEntries = {};
    for (const [path, entry] of Object.entries(entries || {})) {
      const normalizedPath = normalizePath(String(path || ""));
      if (!normalizedPath || this.shouldIgnorePath(normalizedPath)) {
        continue;
      }
      if (remotePaths.has(normalizedPath)) {
        prunedEntries[normalizedPath] = entry;
        continue;
      }
      if (await this.app.vault.adapter.exists(normalizedPath)) {
        prunedEntries[normalizedPath] = entry;
      }
    }
    return prunedEntries;
  }
  remoteFileEntryToSnapshotEntry(remoteEntry) {
    const entryType = String(remoteEntry.entry_type || "");
    if (entryType === "directory") {
      return {
        entryType: "directory",
        contentHash: null,
        sizeBytes: 0,
        mtimeMs: null
      };
    }
    if (entryType !== "file" || !remoteEntry.current_content_hash) {
      return null;
    }
    return {
      entryType: "file",
      contentHash: String(remoteEntry.current_content_hash),
      sizeBytes: Number(remoteEntry.current_size_bytes || 0),
      mtimeMs: null
    };
  }
  async bootstrapObsidianConfigFromRemote(remoteEntries, report) {
    const configEntries = (Array.isArray(remoteEntries) ? remoteEntries : []).filter(
      (entry) => entry && entry.path && !entry.is_deleted && isRootObsidianConfigPath(entry.path) && this.shouldApplyRemotePath(entry.path)
    ).sort((left, right) => {
      if (left.entry_type !== right.entry_type) {
        return left.entry_type === "directory" ? -1 : 1;
      }
      return pathDepth(left.path) - pathDepth(right.path) || left.path.localeCompare(right.path);
    });
    for (const remoteEntry of configEntries) {
      const path = normalizePath(String(remoteEntry.path || ""));
      const snapshotEntry = this.remoteFileEntryToSnapshotEntry(remoteEntry);
      if (!snapshotEntry) {
        continue;
      }
      this.markSuppressedPath(path);
      if (snapshotEntry.entryType === "directory") {
        await this.ensureDirectory(path);
      } else {
        const binaryResponse = await this.downloadRemoteContentForSync(
          snapshotEntry.contentHash,
          "bootstrap-obsidian-config",
          path,
          report
        );
        if (!binaryResponse) {
          continue;
        }
        await this.writeBinaryFile(path, binaryResponse);
      }
      const currentEntry = await this.readCurrentEntry(path, snapshotEntry);
      this.settings.state.entries[path] = currentEntry || snapshotEntry;
      this.addReportRemoteAppliedPath(
        report,
        path,
        this.settings.state.entries[path]
      );
    }
  }
  remoteOperationToSnapshotEntry(operation) {
    return remoteOperationToSnapshotEntry(operation);
  }
  buildRemoteSyncScopeIndex(remoteEntries) {
    const remoteSnapshot = {};
    const remoteEntryByPath = {};
    for (const remoteEntry of remoteEntries || []) {
      const remotePath = normalizePath(String(remoteEntry.path || ""));
      if (!remotePath || remoteEntry.is_deleted || !this.shouldApplyRemotePath(remotePath) || !this.isPathInSyncScope(remotePath)) {
        continue;
      }
      const snapshotEntry = this.remoteFileEntryToSnapshotEntry(remoteEntry);
      if (snapshotEntry) {
        remoteSnapshot[remotePath] = snapshotEntry;
        remoteEntryByPath[remotePath] = remoteEntry;
      }
    }
    return { snapshot: remoteSnapshot, entries: remoteEntryByPath };
  }
  buildRemoteSyncScopeSnapshot(remoteEntries) {
    return this.buildRemoteSyncScopeIndex(remoteEntries).snapshot;
  }
  buildVaultDivergenceDetails(paths, localSnapshot, remoteSnapshot, remoteEntryByPath) {
    const details = {};
    for (const path of paths) {
      details[path] = {
        local: localSnapshot[path] ? buildVaultDivergenceLocalDetail(localSnapshot[path]) : null,
        server: remoteSnapshot[path] ? buildVaultDivergenceServerDetail(remoteSnapshot[path], remoteEntryByPath[path]) : null
      };
    }
    return details;
  }
  createSyncReport() {
    return {
      uploadedObjects: 0,
      reusedObjects: 0,
      pushedOperations: 0,
      pulledOperations: 0,
      conflicts: 0,
      crdtPushed: 0,
      crdtPulled: 0,
      missingRemoteObjectContent: 0,
      divergenceWarning: null,
      deferredDeletes: 0,
      deferredNoteLocks: 0,
      conflictedPaths: /* @__PURE__ */ new Set(),
      acceptedPushEntries: {},
      remotelyAppliedPaths: /* @__PURE__ */ new Set(),
      remotelyAppliedEntries: {}
    };
  }
  async buildVaultDivergenceReport() {
    if (!this.isConfigured()) {
      throw new Error(this.t("error.pluginNotConfigured"));
    }
    const remoteEntries = await this.fetchRemoteFileIndex();
    const remoteIndex = this.buildRemoteSyncScopeIndex(remoteEntries);
    const remoteSnapshot = remoteIndex.snapshot;
    const previousEntries = cloneEntries(
      this.filterSyncableStateEntries(this.settings.state.entries || {})
    );
    const localSnapshot = this.filterSyncableStateEntries(
      await this.scanVault(previousEntries)
    );
    const localPaths = Object.keys(localSnapshot).sort();
    const remotePaths = Object.keys(remoteSnapshot).sort();
    const localPathSet = new Set(localPaths);
    const remotePathSet = new Set(remotePaths);
    const localOnly = localPaths.filter((path) => !remotePathSet.has(path));
    const remoteOnly = remotePaths.filter((path) => !localPathSet.has(path));
    const changed = localPaths.filter(
      (path) => remotePathSet.has(path) && snapshotEntryIdentity(localSnapshot[path]) !== snapshotEntryIdentity(remoteSnapshot[path])
    );
    const detailPaths = Array.from(
      new Set(localOnly.concat(remoteOnly, changed))
    ).sort();
    return {
      checkedAt: (/* @__PURE__ */ new Date()).toISOString(),
      localCount: localPaths.length,
      remoteCount: remotePaths.length,
      localOnly,
      remoteOnly,
      changed,
      details: this.buildVaultDivergenceDetails(
        detailPaths,
        localSnapshot,
        remoteSnapshot,
        remoteIndex.entries
      )
    };
  }
  async acceptServerVaultState() {
    await this.waitForSyncIdleBeforeManualAction();
    if (!this.isConfigured()) {
      throw new Error(this.t("error.pluginNotConfigured"));
    }
    this.syncInFlight = true;
    try {
      const remoteEntries = await this.fetchRemoteFileIndex();
      const remoteSnapshot = this.buildRemoteSyncScopeSnapshot(remoteEntries);
      const previousEntries = cloneEntries(
        this.filterSyncableStateEntries(this.settings.state.entries || {})
      );
      const localSnapshot = this.filterSyncableStateEntries(
        await this.scanVault(previousEntries)
      );
      const localPaths = Object.keys(localSnapshot).sort();
      const remotePaths = Object.keys(remoteSnapshot).sort();
      const localPathSet = new Set(localPaths);
      const remotePathSet = new Set(remotePaths);
      const changed = localPaths.filter(
        (path) => remotePathSet.has(path) && snapshotEntryIdentity(localSnapshot[path]) !== snapshotEntryIdentity(remoteSnapshot[path])
      );
      const localOnly = localPaths.filter((path) => !remotePathSet.has(path)).sort((left, right) => pathDepth(right) - pathDepth(left) || right.localeCompare(left));
      const pathsToApply = remotePaths.filter((path) => changed.includes(path) || !localPathSet.has(path)).sort((left, right) => {
        const leftEntry = remoteSnapshot[left];
        const rightEntry = remoteSnapshot[right];
        if (leftEntry.entryType !== rightEntry.entryType) {
          return leftEntry.entryType === "directory" ? -1 : 1;
        }
        return pathDepth(left) - pathDepth(right) || left.localeCompare(right);
      });
      let preservedLocalCopies = 0;
      let removedLocalOnly = 0;
      let appliedRemote = 0;
      const report = this.createSyncReport();
      for (const path of localOnly) {
        if (await this.app.vault.adapter.exists(path)) {
          await this.captureConflictCopy(path);
          preservedLocalCopies += 1;
          this.markSuppressedPath(path);
          await this.removePath(path);
          removedLocalOnly += 1;
        }
        delete this.settings.state.entries[path];
        if (localSnapshot[path] && localSnapshot[path].entryType === "directory") {
          this.clearCrdtFolderState(path);
        } else {
          this.clearCrdtFileState(path);
        }
      }
      for (const path of pathsToApply) {
        const snapshotEntry = remoteSnapshot[path];
        const currentEntry = await this.readCurrentEntry(path, previousEntries[path]);
        if (currentEntry && !sameSyncIdentity(currentEntry, snapshotEntry)) {
          await this.captureConflictCopy(path);
          preservedLocalCopies += 1;
        }
        this.markSuppressedPath(path);
        if (snapshotEntry.entryType === "directory") {
          if (currentEntry && currentEntry.entryType !== "directory") {
            await this.removePath(path);
          }
          await this.ensureDirectory(path);
        } else {
          if (currentEntry && currentEntry.entryType === "directory") {
            await this.removePath(path);
          }
          const binaryResponse = await this.downloadRemoteContentForSync(
            snapshotEntry.contentHash,
            "accept-server-vault-state",
            path,
            report
          );
          if (!binaryResponse) {
            continue;
          }
          await this.writeBinaryFile(path, binaryResponse);
        }
        appliedRemote += 1;
      }
      const finalEntries = await this.scanVault(this.settings.state.entries);
      this.settings.state.entries = this.filterSyncableStateEntries(finalEntries);
      this.settings.lastSyncAt = (/* @__PURE__ */ new Date()).toISOString();
      this.settings.lastError = "";
      this.settings.lastSyncWarning = report.divergenceWarning || "";
      await this.saveSettings();
      return {
        appliedRemote,
        removedLocalOnly,
        preservedLocalCopies
      };
    } finally {
      this.syncInFlight = false;
    }
  }
  async publishLocalVaultStateAsSource() {
    await this.waitForSyncIdleBeforeManualAction();
    if (!this.isConfigured()) {
      throw new Error(this.t("error.pluginNotConfigured"));
    }
    this.syncInFlight = true;
    let sessionId = null;
    try {
      const remoteEntries = await this.fetchRemoteFileIndex();
      const previousEntries = this.buildRemoteSyncScopeSnapshot(remoteEntries);
      const currentSnapshot = this.filterSyncableStateEntries(
        await this.scanVault(previousEntries)
      );
      const sessionPayload = await this.requestJson("POST", "/sync-sessions", {
        vault_id: this.settings.vaultId,
        device_id: this.settings.deviceId,
        direction: "bidirectional"
      });
      sessionId = sessionPayload.sync_session.id;
      const report = this.createSyncReport();
      await this.pushLocalChanges(sessionId, previousEntries, currentSnapshot, report, {
        operationSource: "publish_source",
        manualOverride: true
      });
      await this.requestJson("PATCH", `/sync-sessions/${sessionId}`, {
        status: "completed"
      });
      sessionId = null;
      this.settings.state.entries = currentSnapshot;
      this.settings.lastSyncAt = (/* @__PURE__ */ new Date()).toISOString();
      this.settings.lastError = "";
      this.settings.lastSyncWarning = report.conflicts > 0 ? "sync_conflicts_open" : "";
      await this.saveSettings();
      return report;
    } catch (error) {
      if (sessionId) {
        try {
          await this.requestJson("PATCH", `/sync-sessions/${sessionId}`, {
            status: "cancelled",
            error_message: String(error.message || "").slice(0, 500)
          });
        } catch (_e) {
        }
      }
      throw error;
    } finally {
      this.syncInFlight = false;
    }
  }
  async mergeVaultDivergenceFileSets() {
    await this.waitForSyncIdleBeforeManualAction();
    if (!this.isConfigured()) {
      throw new Error(this.t("error.pluginNotConfigured"));
    }
    this.syncInFlight = true;
    let sessionId = null;
    try {
      const remoteEntries = await this.fetchRemoteFileIndex();
      const remoteSnapshot = this.buildRemoteSyncScopeSnapshot(remoteEntries);
      const previousEntries = cloneEntries(
        this.filterSyncableStateEntries(this.settings.state.entries || {})
      );
      const localSnapshot = this.filterSyncableStateEntries(
        await this.scanVault(previousEntries)
      );
      const localPaths = Object.keys(localSnapshot).sort();
      const remotePaths = Object.keys(remoteSnapshot).sort();
      const localPathSet = new Set(localPaths);
      const remotePathSet = new Set(remotePaths);
      const localOnly = localPaths.filter((path) => !remotePathSet.has(path)).sort((left, right) => {
        const leftEntry = localSnapshot[left];
        const rightEntry = localSnapshot[right];
        if (leftEntry.entryType !== rightEntry.entryType) {
          return leftEntry.entryType === "directory" ? -1 : 1;
        }
        return pathDepth(left) - pathDepth(right) || left.localeCompare(right);
      });
      const remoteOnly = remotePaths.filter((path) => !localPathSet.has(path)).sort((left, right) => {
        const leftEntry = remoteSnapshot[left];
        const rightEntry = remoteSnapshot[right];
        if (leftEntry.entryType !== rightEntry.entryType) {
          return leftEntry.entryType === "directory" ? -1 : 1;
        }
        return pathDepth(left) - pathDepth(right) || left.localeCompare(right);
      });
      const changed = localPaths.filter(
        (path) => remotePathSet.has(path) && snapshotEntryIdentity(localSnapshot[path]) !== snapshotEntryIdentity(remoteSnapshot[path])
      );
      const report = this.createSyncReport();
      let downloadedRemoteOnly = 0;
      let uploadedLocalOnly = 0;
      let createdRemoteDirectories = 0;
      for (const path of remoteOnly) {
        const snapshotEntry = remoteSnapshot[path];
        this.markSuppressedPath(path);
        if (snapshotEntry.entryType === "directory") {
          await this.ensureDirectory(path);
          downloadedRemoteOnly += 1;
          continue;
        }
        const binaryResponse = await this.downloadRemoteContentForSync(
          snapshotEntry.contentHash,
          "merge-vault-divergence-file-sets",
          path,
          report
        );
        if (!binaryResponse) {
          continue;
        }
        await this.writeBinaryFile(path, binaryResponse);
        downloadedRemoteOnly += 1;
      }
      if (localOnly.length > 0) {
        const sessionPayload = await this.requestJson("POST", "/sync-sessions", {
          vault_id: this.settings.vaultId,
          device_id: this.settings.deviceId,
          direction: "bidirectional"
        });
        sessionId = sessionPayload.sync_session.id;
        for (const path of localOnly) {
          const localEntry = localSnapshot[path];
          if (!localEntry) {
            continue;
          }
          if (localEntry.entryType === "directory") {
            const conflict2 = await this.recordGuardedOperation(
              sessionId,
              {
                client_operation_id: generateClientOperationId(),
                operation_type: "mkdir",
                entry_type: "directory",
                path,
                storage_delta_bytes: 0
              },
              report,
              {
                operationSource: "merge_divergence",
                manualOverride: true
              }
            );
            if (!conflict2) {
              createdRemoteDirectories += 1;
            }
            continue;
          }
          if (localEntry.entryType !== "file") {
            continue;
          }
          const binaryPayload = await this.readFileBinary(path);
          const uploadPayload = await this.requestJson(
            "POST",
            `/sync-sessions/${sessionId}/objects`,
            null,
            toArrayBuffer(binaryPayload),
            { "Content-Type": "application/octet-stream" }
          );
          if (uploadPayload.already_present) {
            report.reusedObjects += 1;
          } else {
            report.uploadedObjects += 1;
          }
          const conflict = await this.recordGuardedOperation(
            sessionId,
            {
              client_operation_id: generateClientOperationId(),
              operation_type: "upsert",
              entry_type: "file",
              path,
              storage_delta_bytes: Number(localEntry.sizeBytes || 0),
              content_hash: uploadPayload.object.content_hash,
              base_content_hash: null
            },
            report,
            {
              operationSource: "merge_divergence",
              manualOverride: true
            }
          );
          if (!conflict) {
            uploadedLocalOnly += 1;
          }
        }
        await this.requestJson("PATCH", `/sync-sessions/${sessionId}`, {
          status: "completed"
        });
        sessionId = null;
      }
      const finalEntries = await this.scanVault(this.settings.state.entries);
      this.settings.state.entries = this.filterSyncableStateEntries(finalEntries);
      this.settings.lastSyncAt = (/* @__PURE__ */ new Date()).toISOString();
      this.settings.lastError = "";
      this.settings.lastSyncWarning = report.divergenceWarning || (report.conflicts > 0 ? "sync_conflicts_open" : "");
      await this.saveSettings();
      return {
        downloadedRemoteOnly,
        uploadedLocalOnly,
        createdRemoteDirectories,
        skippedChanged: changed.length,
        conflicts: report.conflicts,
        missingRemoteObjectContent: report.missingRemoteObjectContent
      };
    } catch (error) {
      if (sessionId) {
        try {
          await this.requestJson("PATCH", `/sync-sessions/${sessionId}`, {
            status: "cancelled",
            error_message: String(error.message || "").slice(0, 500)
          });
        } catch (_e) {
        }
      }
      throw error;
    } finally {
      this.syncInFlight = false;
    }
  }
  async applyRemoteOperation(operation, baselineEntries, report) {
    const operationType = String(operation.operation_type);
    const path = String(operation.path);
    const targetPath = operation.target_path !== null && operation.target_path !== void 0 ? String(operation.target_path) : null;
    const contentHash = operation.content_hash !== null && operation.content_hash !== void 0 ? String(operation.content_hash) : null;
    try {
      const touchedPaths = [path];
      if (targetPath) {
        touchedPaths.push(targetPath);
      }
      if (operationType !== "delete" && operationType !== "rmdir" && typeof this.isPendingLocalDeletePath === "function" && touchedPaths.some((touchedPath) => this.isPendingLocalDeletePath(touchedPath))) {
        return { deferred: true };
      }
      if (operationType === "upsert") {
        const snapshotEntry = remoteOperationToSnapshotEntry(operation);
        if (snapshotEntry && typeof this.adoptRemoteBaselineIfSameChecksum === "function") {
          const sameChecksumBaseline = await this.adoptRemoteBaselineIfSameChecksum(
            path,
            snapshotEntry,
            baselineEntries
          );
          if (sameChecksumBaseline.matched) {
            this.markClassicMarkdownForCrdtBridge(path);
            report.pulledOperations += 1;
            return { deferred: false, applied: true };
          }
        }
      }
      if (operationType !== "mkdir" && operationType !== "metadata_update") {
        for (const touchedPath of touchedPaths) {
          if (typeof this.shouldDeferRemoteApplyForNoteLease === "function" ? await this.shouldDeferRemoteApplyForNoteLease(touchedPath, baselineEntries) : typeof this.shouldDeferRemoteApplyForActiveEditLease === "function" && this.shouldDeferRemoteApplyForActiveEditLease(touchedPath)) {
            return { deferred: true };
          }
          if (typeof this.shouldDeferRemoteApplyForOpenConflict === "function" && this.shouldDeferRemoteApplyForOpenConflict(touchedPath, report)) {
            return { deferred: true };
          }
          if (await this.hasUnsyncedLocalChange(touchedPath, baselineEntries)) {
            return { deferred: true };
          }
        }
      }
      for (const touchedPath of touchedPaths) {
        this.markSuppressedPath(touchedPath);
      }
      for (const touchedPath of touchedPaths) {
        if (await this.hasUnsyncedLocalChange(touchedPath, baselineEntries)) {
          await this.captureConflictCopy(touchedPath);
        }
      }
      if (operationType === "mkdir") {
        await this.ensureDirectory(path);
      } else if (operationType === "upsert") {
        if (!contentHash) {
          throw new Error(this.t("error.remoteUpsertMissingHash"));
        }
        const binaryResponse = await this.downloadRemoteContentForSync(
          contentHash,
          "applyRemoteOperation upsert",
          path,
          report
        );
        if (!binaryResponse) {
          return { deferred: false, applied: false };
        }
        if ((typeof this.shouldDeferRemoteApplyForNoteLease === "function" ? await this.shouldDeferRemoteApplyForNoteLease(path, baselineEntries) : typeof this.shouldDeferRemoteApplyForActiveEditLease === "function" && this.shouldDeferRemoteApplyForActiveEditLease(path)) || typeof this.shouldDeferRemoteApplyForOpenConflict === "function" && this.shouldDeferRemoteApplyForOpenConflict(path, report) || await this.hasUnsyncedLocalChange(path, baselineEntries)) {
          return { deferred: true };
        }
        await this.writeBinaryFile(path, binaryResponse);
        this.markClassicMarkdownForCrdtBridge(path);
      } else if (operationType === "delete" || operationType === "rmdir") {
        if (await this.app.vault.adapter.exists(path)) {
          await this.captureConflictCopy(path);
        }
        await this.removePath(path);
        if (operationType === "delete") {
          this.clearPendingDeletePath(path);
          this.clearCrdtFileState(path);
        } else {
          this.clearCrdtFolderState(path);
        }
      } else if (operationType === "move") {
        const moveApplied = await this.applyRemoteMove(
          path,
          targetPath,
          contentHash,
          String(operation.entry_type),
          report
        );
        if (!moveApplied) {
          return { deferred: false, applied: false };
        }
      } else if (operationType === "metadata_update") {
      } else {
        throw new Error(this.t("error.unsupportedRemoteOperation", { operationType }));
      }
      await this.refreshBaselineEntry(baselineEntries, path);
      this.addReportRemoteAppliedPath(report, path, baselineEntries[path] || null);
      if (targetPath) {
        await this.refreshBaselineEntry(baselineEntries, targetPath);
        this.addReportRemoteAppliedPath(report, targetPath, baselineEntries[targetPath] || null);
      }
      report.pulledOperations += 1;
      return { deferred: false, applied: true };
    } catch (error) {
      throw annotateError(
        error,
        `applyRemoteOperation ${operationType} ${path}${targetPath ? ` -> ${targetPath}` : ""}`
      );
    }
  }
  async applyRemoteMove(path, targetPath, contentHash, entryType, report = null) {
    if (!targetPath) {
      throw new Error(this.t("error.remoteMoveMissingTarget"));
    }
    const movedMarkdownLeaves = this.getOpenMarkdownLeavesForPath(path);
    const isDirectory = entryType === "directory";
    const sourceExists = await this.app.vault.adapter.exists(path);
    if (sourceExists) {
      if (await this.app.vault.adapter.exists(targetPath)) {
        await this.removePath(targetPath);
      }
      await this.ensureParentDirectories(targetPath);
      await this.renameVaultPath(path, targetPath);
      this.updateActiveNoteLeasePathAfterRemoteMove(path, targetPath);
      await this.reopenRemoteMovedMarkdownLeaves(movedMarkdownLeaves, targetPath);
      return true;
    }
    if (isDirectory) {
      if (await this.app.vault.adapter.exists(targetPath)) {
        await this.removePath(targetPath);
      }
      await this.ensureDirectory(targetPath);
      this.updateActiveNoteLeasePathAfterRemoteMove(path, targetPath);
      return true;
    }
    if (await this.app.vault.adapter.exists(targetPath)) {
      this.updateActiveNoteLeasePathAfterRemoteMove(path, targetPath);
      await this.reopenRemoteMovedMarkdownLeaves(movedMarkdownLeaves, targetPath);
      return true;
    }
    if (!contentHash) {
      return false;
    }
    const binaryResponse = await this.downloadRemoteContentForSync(
      contentHash,
      "applyRemoteMove",
      targetPath,
      report
    );
    if (!binaryResponse) {
      return false;
    }
    await this.writeBinaryFile(targetPath, binaryResponse);
    this.updateActiveNoteLeasePathAfterRemoteMove(path, targetPath);
    await this.reopenRemoteMovedMarkdownLeaves(movedMarkdownLeaves, targetPath);
    return true;
  }
  async recordGuardedOperation(sessionId, payload, report, options = {}) {
    const operationType = String(payload && payload.operation_type ? payload.operation_type : "").trim().toLowerCase();
    const entryType = String(payload && payload.entry_type ? payload.entry_type : "file").trim().toLowerCase();
    const normalizedPath = normalizePath(String(payload && payload.path ? payload.path : ""));
    const operationSource = normalizeOperationSource(options.operationSource || "sync_diff");
    const manualOverride = options.manualOverride === true;
    const guardedPayload = {
      ...payload,
      operation_source: operationSource,
      manual_override: manualOverride
    };
    if (operationType === "delete" || operationType === "rmdir") {
      if (operationSource !== "sync_diff" && !manualOverride) {
        throw new Error(
          `Manual destructive operation requires manual_override for ${normalizedPath || "(empty path)"}`
        );
      }
      const allowedPaths = Array.isArray(options.allowedPaths) ? options.allowedPaths.map((path) => normalizePath(String(path || ""))).filter(Boolean) : [];
      if (allowedPaths.length > 0 && !allowedPaths.some(
        (allowedPath) => normalizedPath === allowedPath || normalizedPath.startsWith(`${allowedPath}/`)
      )) {
        throw new Error(`Destructive operation path is outside the allowed scope: ${normalizedPath}`);
      }
      if (manualOverride && operationType === "delete" && entryType === "file" && !String(payload.base_content_hash || "").trim()) {
        throw new Error(`Manual file delete requires base_content_hash for ${normalizedPath}`);
      }
    }
    return this.recordOperation(sessionId, guardedPayload, report || this.createSyncReport());
  }
  async recordOperation(sessionId, payload, report) {
    try {
      await this.requestJson(
        "POST",
        `/sync-sessions/${sessionId}/operations`,
        payload
      );
      report.pushedOperations += 1;
      return null;
    } catch (error) {
      if (isRecordOperationNoteLockError(error)) {
        const lockState = extractOperationNoteLock(error);
        report.deferredNoteLocks = Number(report.deferredNoteLocks || 0) + 1;
        this.pendingChangesDuringSync = true;
        this.showNoteLeaseBlockedNotice(lockState.path || payload.path, {
          structural: payload.operation_type !== "upsert"
        });
        return lockState;
      }
      if (isRecordOperationConflictError(error, payload)) {
        const conflict = extractOperationConflict(error);
        if (await this.isAlreadyAppliedOperationConflict(payload, conflict)) {
          try {
            await this.resolveConflict(conflict, "keep_local");
            report.pushedOperations += 1;
            return null;
          } catch (resolveError) {
            console.warn(
              "[obsidian-http-sync] failed to auto-resolve already applied operation conflict",
              resolveError
            );
          }
        }
        report.conflicts += 1;
        this.addReportConflictPath(report, payload.path);
        this.addReportConflictPath(report, payload.target_path);
        this.addReportConflictPath(report, conflict.path);
        this.addReportConflictPath(report, conflict.target_path);
        return conflict;
      }
      if (payload.operation_type === "mkdir" && (isAlreadyExistsError(error) || await this.remoteDirectoryExists(payload.path))) {
        return;
      }
      if (payload.operation_type === "rmdir" && isAlreadyMissingDirectoryError(error)) {
        return;
      }
      throw annotateError(
        error,
        `recordOperation ${payload.operation_type} ${payload.entry_type} ${payload.path}${payload.target_path ? ` -> ${payload.target_path}` : ""}`
      );
    }
  }
  async isAlreadyAppliedOperationConflict(payload, conflict) {
    if (!isAlreadyAppliedOperationConflictCandidate(payload, conflict)) {
      return false;
    }
    const operationType = String(payload && payload.operation_type ? payload.operation_type : "");
    if (operationType !== "delete") {
      return true;
    }
    try {
      return !await this.getRemoteFileEntry(payload.path);
    } catch (error) {
      console.warn(
        "[obsidian-http-sync] failed to verify already applied delete conflict",
        error
      );
      return false;
    }
  }
  async buildDeleteConflictRetryPayload(payload, conflict) {
    if (!conflict || String(payload && payload.operation_type ? payload.operation_type : "") !== "delete" || String(conflict.reason || "") !== "base_content_hash_mismatch") {
      return null;
    }
    const actualContentHash = String(conflict.actual_content_hash || "").trim();
    if (!actualContentHash) {
      return null;
    }
    if (actualContentHash === String(payload.base_content_hash || "").trim()) {
      return null;
    }
    const remoteEntry = await this.getRemoteFileEntry(payload.path);
    if (!remoteEntry) {
      return null;
    }
    return {
      ...payload,
      client_operation_id: generateClientOperationId(),
      base_content_hash: actualContentHash,
      storage_delta_bytes: -Number(remoteEntry.current_size_bytes || 0)
    };
  }
  async getRemoteFileEntry(path) {
    const normalizedPath = normalizePath(String(path || ""));
    if (!normalizedPath) {
      return null;
    }
    const entry = await this.fetchRemoteFileEntry(normalizedPath);
    if (!entry || entry.is_deleted || String(entry.entry_type || "") !== "file") {
      return null;
    }
    return entry;
  }
  async disableCrdtMarkdownIfCollaborationBlocked() {
    if (!this.settings.crdtMarkdownEnabled) {
      return false;
    }
    if (!this.settings.accessToken) {
      if (!this.settings.refreshToken) {
        return false;
      }
      const baseUrl = String(this.settings.baseUrl || "").replace(/\/+$/, "");
      const refreshed = await this.tryRefreshAuthSession(baseUrl);
      if (!refreshed || !this.settings.accessToken) {
        return false;
      }
    }
    if (!this.settings.accessToken) {
      return false;
    }
    let accountStatus = null;
    try {
      let userId = String(this.settings.userId || "").trim();
      if (!userId) {
        const authPayload = await this.requestJson("GET", "/auth/me");
        userId = authPayload && authPayload.user && authPayload.user.id ? String(authPayload.user.id).trim() : "";
      }
      if (!userId) {
        return false;
      }
      const payload = await this.requestJson(
        "GET",
        `/users/${encodeURIComponent(userId)}/account-status`
      );
      accountStatus = payload && payload.account_status && typeof payload.account_status === "object" ? payload.account_status : null;
    } catch (_) {
      return false;
    }
    if (!accountStatus || accountStatus.collaboration_blocked !== true) {
      return false;
    }
    this.settings.crdtMarkdownEnabled = false;
    this.settings.collaborationBlockReason = getCollaborationBlockReasonFromAccountStatus(accountStatus);
    this.resetCrdtLocalState();
    await this.saveSettings();
    new Notice(
      this.t("notice.crdtMarkdownBlocked", {
        reason: this.t(
          `collaborationBlock.reason.${this.settings.collaborationBlockReason}`
        )
      })
    );
    return true;
  }
  async remoteDirectoryExists(path) {
    const normalizedPath = normalizePath(String(path || ""));
    if (!normalizedPath) {
      return false;
    }
    try {
      const payload = await this.requestJson(
        "GET",
        `/vaults/${this.settings.vaultId}/files?include_deleted=false&limit=1000`
      );
      const files = Array.isArray(payload.files) ? payload.files : [];
      return files.some(
        (file) => normalizePath(String(file.path || "")) === normalizedPath && String(file.entry_type || "") === "directory" && !file.is_deleted
      );
    } catch (error) {
      return false;
    }
  }
  resetCrdtLocalState() {
    this.settings.crdtState = { files: {} };
    this.crdtDocs.clear();
    this.crdtLeases.clear();
    this.crdtLeaseNoticeTimestamps.clear();
  }
  clearCrdtFileState(path) {
    const normalizedPath = normalizePath(String(path || ""));
    if (!normalizedPath) {
      return;
    }
    this.crdtDocs.delete(normalizedPath);
    this.crdtLeases.delete(normalizedPath);
    this.crdtLeaseNoticeTimestamps.delete(normalizedPath);
    if (this.settings.crdtState && this.settings.crdtState.files) {
      delete this.settings.crdtState.files[normalizedPath];
    }
  }
  markClassicMarkdownForCrdtBridge(path) {
    const normalizedPath = normalizePath(String(path || ""));
    if (!normalizedPath || !this.shouldUseCrdtForPath(normalizedPath)) {
      return false;
    }
    this.clearCrdtFileState(normalizedPath);
    this.setCrdtDirty(normalizedPath, true);
    this.markLocalDirtyPath(normalizedPath);
    this.pendingChangesDuringSync = true;
    return true;
  }
  clearCrdtFolderState(folderPath) {
    const normalizedFolderPath = normalizePath(String(folderPath || ""));
    if (!normalizedFolderPath) {
      return;
    }
    const prefix = normalizedFolderPath + "/";
    for (const docPath of this.crdtDocs.keys()) {
      if (docPath === normalizedFolderPath || docPath.startsWith(prefix)) {
        this.crdtDocs.delete(docPath);
      }
    }
    for (const leasePath of this.crdtLeases.keys()) {
      if (leasePath === normalizedFolderPath || leasePath.startsWith(prefix)) {
        this.crdtLeases.delete(leasePath);
      }
    }
    for (const noticePath of this.crdtLeaseNoticeTimestamps.keys()) {
      if (noticePath === normalizedFolderPath || noticePath.startsWith(prefix)) {
        this.crdtLeaseNoticeTimestamps.delete(noticePath);
      }
    }
    if (this.settings.crdtState && this.settings.crdtState.files) {
      for (const statePath of Object.keys(this.settings.crdtState.files)) {
        if (statePath === normalizedFolderPath || statePath.startsWith(prefix)) {
          delete this.settings.crdtState.files[statePath];
        }
      }
    }
  }
  enqueueCrdtLocalChange(path) {
    if (!this.isConfigured() || !this.shouldUseCrdtForPath(path)) {
      return;
    }
    const normalizedPath = normalizePath(String(path || ""));
    this.setCrdtDirty(normalizedPath, true);
    if (this.crdtLocalDebounce.has(normalizedPath)) {
      window.clearTimeout(this.crdtLocalDebounce.get(normalizedPath));
    }
    const timeoutHandle = window.setTimeout(() => {
      this.crdtLocalDebounce.delete(normalizedPath);
      this.syncCrdtFile(normalizedPath, null, { mode: "push" }).catch((error) => {
        console.error("[obsidian-http-sync] CRDT local push failed", error);
      });
    }, CRDT_LOCAL_DEBOUNCE_MS);
    this.crdtLocalDebounce.set(normalizedPath, timeoutHandle);
  }
  async pollActiveCrdtFile() {
    const activeFile = this.app.workspace && typeof this.app.workspace.getActiveFile === "function" ? this.app.workspace.getActiveFile() : null;
    await this.pollActiveNoteLease(activeFile);
    if (!this.isConfigured() || !this.settings.crdtMarkdownEnabled) {
      return;
    }
    if (!activeFile || !activeFile.path || !this.shouldUseCrdtForPath(activeFile.path)) {
      return;
    }
    if (this.isCrdtDirty(activeFile.path)) {
      return;
    }
    await this.syncCrdtFile(activeFile.path, null, { mode: "pull" });
  }
  async syncCrdtMarkdownFiles(report, options = {}) {
    if (!this.isConfigured() || !this.settings.crdtMarkdownEnabled) {
      return;
    }
    const markdownFiles = Array.isArray(options.paths) ? Array.from(
      new Set(
        options.paths.map((path) => normalizePath(String(path || ""))).filter(
          (path) => path && this.shouldUseCrdtForPath(path) && !this.isPendingLocalDeletePath(path) && !this.isPendingRenameSourcePath(path) && !this.isPendingRenameTargetPath(path)
        )
      )
    ).sort() : await this.listCrdtMarkdownFiles("");
    for (const path of markdownFiles) {
      this.trackSyncFile?.(path);
    }
    const remoteEntriesByPath = new Map(
      (Array.isArray(options.remoteEntries) ? options.remoteEntries : await this.fetchRemoteFileIndex()).filter((entry) => entry && entry.path && !entry.is_deleted).map((entry) => [normalizePath(String(entry.path)), entry])
    );
    for (const path of markdownFiles) {
      await this.syncCrdtFile(path, report, {
        mode: this.isCrdtDirty(path) ? "push" : "pull",
        remoteEntry: remoteEntriesByPath.get(path) || null
      });
      this.completeSyncFile?.(path);
    }
  }
  async listCrdtMarkdownFiles(directoryPath) {
    const listing = await this.app.vault.adapter.list(directoryPath);
    const paths = [];
    for (const folderPath of listing.folders.slice().sort()) {
      const normalizedPath = normalizePath(folderPath);
      if (this.isPathIgnoredByPattern(normalizedPath) || isConflictArtifactPath(normalizedPath)) {
        continue;
      }
      if (!this.isPathInSyncScope(normalizedPath) && !this.isPathAncestorOfSyncScope(normalizedPath)) {
        continue;
      }
      paths.push(...await this.listCrdtMarkdownFiles(normalizedPath));
    }
    for (const filePath of listing.files.slice().sort()) {
      const normalizedPath = normalizePath(filePath);
      if (this.shouldUseCrdtForPath(normalizedPath)) {
        paths.push(normalizedPath);
      }
    }
    return paths;
  }
  async syncCrdtFile(path, report, options = {}) {
    const normalizedPath = normalizePath(String(path || ""));
    return this.runExclusiveCrdtSync(normalizedPath, async () => {
      if (!this.shouldUseCrdtForPath(normalizedPath) || this.isPendingLocalDeletePath(normalizedPath) || this.isPendingRenameSourcePath(normalizedPath) || this.isPendingRenameTargetPath(normalizedPath)) {
        return;
      }
      const remoteEntryWasProvided = Object.prototype.hasOwnProperty.call(
        options,
        "remoteEntry"
      );
      let remoteEntry = remoteEntryWasProvided ? options.remoteEntry : await this.fetchRemoteFileEntry(normalizedPath);
      let mode = options.mode === "push" ? "push" : "pull";
      if (mode !== "push" && !remoteEntry && remoteEntryWasProvided) {
        remoteEntry = await this.fetchRemoteFileEntry(normalizedPath);
      }
      if (mode !== "push" && remoteEntry && remoteEntry.is_deleted) {
        await this.discardDeletedRemoteCrdtFile(normalizedPath);
        return;
      }
      if (mode !== "push" && !remoteEntry) {
        if (await this.app.vault.adapter.exists(normalizedPath)) {
          this.setCrdtDirty(normalizedPath, true);
          mode = "push";
        } else {
          await this.discardDeletedRemoteCrdtFile(normalizedPath);
          return;
        }
      }
      if (!await this.ensureCrdtProtocolSupported()) {
        return;
      }
      if (mode === "push" && this.shouldUseCrdtLeases() && !options.leaseChecked) {
        if (this.isActiveCrdtPath(normalizedPath)) {
          const lease = await this.ensureActiveCrdtLease(normalizedPath);
          if (lease && lease.heldByOtherDevice) {
            this.showCrdtLeasePausedNotice(normalizedPath);
            return;
          }
        } else if (await this.isCrdtLeaseHeldByOther(normalizedPath)) {
          return;
        }
      }
      if (mode === "pull") {
        await this.pullCrdtRemoteUpdates(normalizedPath, report, {
          skipWriteWhenDirty: true
        });
        return;
      }
      const pushed = await this.pushCrdtLocalFile(normalizedPath, report);
      if (pushed) {
        const state = await this.ensureCrdtDoc(normalizedPath);
        await this.publishCrdtSnapshot(normalizedPath, state);
      }
    });
  }
  async runExclusiveCrdtSync(path, callback) {
    const normalizedPath = normalizePath(String(path || ""));
    const previousQueue = this.crdtSyncQueues.get(normalizedPath) || Promise.resolve();
    let releaseQueue = null;
    const nextQueue = new Promise((resolve) => {
      releaseQueue = resolve;
    });
    const queueMarker = previousQueue.then(() => nextQueue);
    this.crdtSyncQueues.set(normalizedPath, queueMarker);
    await previousQueue;
    try {
      return await callback();
    } finally {
      releaseQueue();
      if (this.crdtSyncQueues.get(normalizedPath) === queueMarker) {
        this.crdtSyncQueues.delete(normalizedPath);
      }
    }
  }
  async discardDeletedRemoteCrdtFile(path) {
    const normalizedPath = normalizePath(String(path || ""));
    if (!normalizedPath) {
      return;
    }
    this.clearCrdtFileState(normalizedPath);
    if (this.settings && this.settings.state && this.settings.state.entries && this.settings.state.entries[normalizedPath]) {
      delete this.settings.state.entries[normalizedPath];
    }
    if (await this.app.vault.adapter.exists(normalizedPath)) {
      this.markSuppressedPath(normalizedPath);
      await this.captureConflictCopy(normalizedPath);
      await this.removePath(normalizedPath);
    }
  }
  markPendingExplicitDeletePath(path) {
    const normalizedPath = normalizePath(String(path || ""));
    if (!normalizedPath) {
      return;
    }
    for (const existingPath of Array.from(this.pendingExplicitDeletes)) {
      if (existingPath === normalizedPath || existingPath.startsWith(`${normalizedPath}/`)) {
        this.pendingExplicitDeletes.delete(existingPath);
      }
      if (normalizedPath.startsWith(`${existingPath}/`) || normalizedPath === existingPath) {
        return;
      }
    }
    this.pendingExplicitDeletes.add(normalizedPath);
  }
  clearPendingExplicitDeletePath(path) {
    const normalizedPath = normalizePath(String(path || ""));
    if (!normalizedPath) {
      return;
    }
    for (const existingPath of Array.from(this.pendingExplicitDeletes)) {
      if (existingPath === normalizedPath || existingPath.startsWith(`${normalizedPath}/`)) {
        this.pendingExplicitDeletes.delete(existingPath);
      }
    }
  }
  hasPendingExplicitDeleteAncestor(path) {
    const normalizedPath = normalizePath(String(path || ""));
    if (!normalizedPath) {
      return false;
    }
    return Array.from(this.pendingExplicitDeletes).some(
      (pendingPath) => pendingPath === normalizedPath || normalizedPath.startsWith(`${pendingPath}/`)
    );
  }
  isPendingLocalDeletePath(path) {
    const normalizedPath = normalizePath(String(path || ""));
    if (!normalizedPath) {
      return false;
    }
    if (this.hasPendingExplicitDeleteAncestor(normalizedPath)) {
      return true;
    }
    const pendingDeletes = this.settings && this.settings.pendingDeletes && typeof this.settings.pendingDeletes === "object" ? this.settings.pendingDeletes : {};
    return Object.keys(pendingDeletes).some((pendingPath) => {
      const normalizedPendingPath = normalizePath(String(pendingPath || ""));
      return normalizedPendingPath && (normalizedPath === normalizedPendingPath || normalizedPath.startsWith(`${normalizedPendingPath}/`));
    });
  }
  filterRenameHintsTargetingPendingDeletes(renameHints) {
    const filteredHints = {};
    for (const [targetPath, sourcePath] of Object.entries(renameHints || {})) {
      const normalizedTargetPath = normalizePath(String(targetPath || ""));
      if (normalizedTargetPath && typeof this.isPendingLocalDeletePath === "function" && this.isPendingLocalDeletePath(normalizedTargetPath)) {
        continue;
      }
      filteredHints[targetPath] = sourcePath;
    }
    return filteredHints;
  }
  applyPendingExplicitDeletes(previousEntries, currentSnapshot, remoteEntries) {
    const hasRuntimeDeletes = this.pendingExplicitDeletes && this.pendingExplicitDeletes.size > 0;
    const hasPersistedDeletes = Boolean(
      this.settings && this.settings.pendingDeletes && typeof this.settings.pendingDeletes === "object" && Object.keys(this.settings.pendingDeletes).length > 0
    );
    if (!hasRuntimeDeletes && !hasPersistedDeletes) {
      return;
    }
    for (const remoteEntry of remoteEntries || []) {
      const remotePath = normalizePath(String(remoteEntry.path || ""));
      if (!remotePath || remoteEntry.is_deleted || !this.shouldApplyRemotePath(remotePath)) {
        continue;
      }
      const matchesPendingDelete = typeof this.isPendingLocalDeletePath === "function" ? this.isPendingLocalDeletePath(remotePath) : Array.from(this.pendingExplicitDeletes || []).some(
        (pendingPath) => remotePath === pendingPath || remotePath.startsWith(`${pendingPath}/`)
      );
      if (!matchesPendingDelete) {
        continue;
      }
      const snapshotEntry = this.remoteFileEntryToSnapshotEntry(remoteEntry);
      if (snapshotEntry) {
        previousEntries[remotePath] = snapshotEntry;
      }
    }
  }
  applyImplicitDirectoryDeletes(previousEntries, currentSnapshot, remoteEntries) {
    if (!Object.keys(previousEntries || {}).length) {
      return;
    }
    const remoteDirectoryRoots = (remoteEntries || []).filter(
      (entry) => entry && !entry.is_deleted && String(entry.entry_type || "") === "directory" && this.shouldApplyRemotePath(entry.path)
    ).map((entry) => normalizePath(String(entry.path || ""))).filter(Boolean).sort((left, right) => pathDepth(left) - pathDepth(right));
    for (const rootPath of remoteDirectoryRoots) {
      if (previousEntries[rootPath] || currentSnapshot[rootPath]) {
        continue;
      }
      const snapshotEntry = this.remoteFileEntryToSnapshotEntry({
        path: rootPath,
        entry_type: "directory"
      });
      if (snapshotEntry) {
        previousEntries[rootPath] = snapshotEntry;
      }
      for (const remoteEntry of remoteEntries || []) {
        const remotePath = normalizePath(String(remoteEntry.path || ""));
        if (!remotePath || remoteEntry.is_deleted || !this.shouldApplyRemotePath(remotePath) || currentSnapshot[remotePath] || previousEntries[remotePath]) {
          continue;
        }
        if (remotePath === rootPath || remotePath.startsWith(`${rootPath}/`)) {
          const descendantSnapshot = this.remoteFileEntryToSnapshotEntry(remoteEntry);
          if (descendantSnapshot) {
            previousEntries[remotePath] = descendantSnapshot;
          }
        }
      }
    }
  }
  async clearCompletedPendingExplicitDeletes() {
    for (const pendingPath of Array.from(this.pendingExplicitDeletes)) {
      if (!await this.app.vault.adapter.exists(pendingPath)) {
        this.pendingExplicitDeletes.delete(pendingPath);
      }
    }
  }
  clearPendingDeletesForCurrentSnapshot(currentSnapshot, previousEntries = {}) {
    if (!this.settings.pendingDeletes || typeof this.settings.pendingDeletes !== "object") {
      this.settings.pendingDeletes = {};
      return;
    }
    for (const path of Object.keys(this.settings.pendingDeletes)) {
      const currentEntry = currentSnapshot && currentSnapshot[path];
      const previousEntry = previousEntries && previousEntries[path];
      if (currentEntry && previousEntry && sameSyncIdentity(previousEntry, currentEntry)) {
        delete this.settings.pendingDeletes[path];
      }
    }
  }
  clearPendingDeletePath(path) {
    const normalizedPath = normalizePath(String(path || ""));
    if (!normalizedPath || !this.settings.pendingDeletes) {
      return;
    }
    delete this.settings.pendingDeletes[normalizedPath];
    this.queueReleaseLocalDiffNoteLock?.(normalizedPath);
  }
  clearPendingRenameHintForPath(path) {
    const normalizedPath = normalizePath(String(path || ""));
    if (!normalizedPath) {
      return false;
    }
    const pathMatches = (candidatePath) => {
      const normalizedCandidatePath = normalizePath(String(candidatePath || ""));
      return normalizedCandidatePath && (normalizedCandidatePath === normalizedPath || normalizedCandidatePath.startsWith(`${normalizedPath}/`) || normalizedPath.startsWith(`${normalizedCandidatePath}/`));
    };
    let changed = false;
    for (const [targetPath, sourcePath] of Object.entries(this.renameHints || {})) {
      if (pathMatches(targetPath) || pathMatches(sourcePath)) {
        delete this.renameHints[targetPath];
        changed = true;
      }
    }
    if (this.settings && this.settings.pendingRenameHints && typeof this.settings.pendingRenameHints === "object") {
      for (const [targetPath, sourcePath] of Object.entries(
        this.settings.pendingRenameHints
      )) {
        if (pathMatches(targetPath) || pathMatches(sourcePath)) {
          delete this.settings.pendingRenameHints[targetPath];
          changed = true;
        }
      }
    }
    return changed;
  }
  deleteBatchBlockReason(plannedDeleteCount, baselineEntryCount, report) {
    if (report && report.divergenceWarning) {
      return "vault_snapshot_fingerprint_mismatch";
    }
    if (plannedDeleteCount > DELETE_QUARANTINE_MAX_BATCH_COUNT) {
      return "mass_delete_count";
    }
    if (baselineEntryCount > 0 && plannedDeleteCount / baselineEntryCount > DELETE_QUARANTINE_MAX_BATCH_RATIO) {
      return "mass_delete_ratio";
    }
    return "";
  }
  shouldSendDeleteOperation(path, previousEntry, currentSnapshot, report, blockReason) {
    const normalizedPath = normalizePath(String(path || ""));
    if (!normalizedPath || !previousEntry || currentSnapshot[normalizedPath]) {
      this.clearPendingDeletePath(normalizedPath);
      return false;
    }
    if (!this.settings.pendingDeletes || typeof this.settings.pendingDeletes !== "object") {
      this.settings.pendingDeletes = {};
    }
    const nowMs = Date.now();
    const previousIdentity = {
      entryType: previousEntry.entryType || "",
      contentHash: previousEntry.contentHash || null,
      sizeBytes: Number(previousEntry.sizeBytes || 0)
    };
    const existing = this.settings.pendingDeletes[normalizedPath] || null;
    const identityMatches = existing && existing.entryType === previousIdentity.entryType && (existing.contentHash || null) === previousIdentity.contentHash && Number(existing.sizeBytes || 0) === previousIdentity.sizeBytes;
    const candidate = identityMatches ? {
      ...existing,
      lastSeenAt: nowMs
    } : {
      ...previousIdentity,
      firstSeenAt: nowMs,
      lastSeenAt: nowMs
    };
    this.settings.pendingDeletes[normalizedPath] = candidate;
    const mature = nowMs - Number(candidate.firstSeenAt || nowMs) >= DELETE_QUARANTINE_GRACE_MS;
    if (!mature || blockReason) {
      report.deferredDeletes = Number(report.deferredDeletes || 0) + 1;
      if (blockReason && !report.divergenceWarning) {
        report.divergenceWarning = `delete_safety_${blockReason}`;
      }
      if (!blockReason) {
        this.pendingChangesDuringSync = true;
      }
      return false;
    }
    return true;
  }
  shouldUseCrdtLeases() {
    return Boolean(this.settings && this.settings.crdtEditLeaseEnabled);
  }
  beginSyncProgress(onProgress, initialFilePaths = [], allowedFilePaths = null) {
    const allowedFiles = Array.isArray(allowedFilePaths) ? new Set(
      allowedFilePaths.map((path) => normalizePath(String(path || ""))).filter(Boolean)
    ) : null;
    this.syncProgress = {
      trackedFiles: new Set(
        initialFilePaths.map((path) => normalizePath(String(path || ""))).filter((path) => Boolean(path) && (!allowedFiles || allowedFiles.has(path)))
      ),
      completedFiles: /* @__PURE__ */ new Set(),
      allowedFiles,
      onProgress: typeof onProgress === "function" ? onProgress : null
    };
    this.emitSyncProgress();
  }
  trackSyncFile(path) {
    if (!this.syncProgress) {
      return;
    }
    const normalizedPath = normalizePath(String(path || ""));
    if (!normalizedPath || this.syncProgress.allowedFiles && !this.syncProgress.allowedFiles.has(normalizedPath) || this.syncProgress.trackedFiles.has(normalizedPath)) {
      return;
    }
    this.syncProgress.trackedFiles.add(normalizedPath);
    this.emitSyncProgress();
  }
  completeSyncFile(path) {
    if (!this.syncProgress) {
      return;
    }
    const normalizedPath = normalizePath(String(path || ""));
    if (!normalizedPath || this.syncProgress.allowedFiles && !this.syncProgress.allowedFiles.has(normalizedPath) || this.syncProgress.completedFiles.has(normalizedPath)) {
      return;
    }
    this.syncProgress.trackedFiles.add(normalizedPath);
    this.syncProgress.completedFiles.add(normalizedPath);
    this.emitSyncProgress();
  }
  completeSyncFiles(paths) {
    if (!this.syncProgress) {
      return;
    }
    let changed = false;
    for (const path of paths || []) {
      const normalizedPath = normalizePath(String(path || ""));
      if (!normalizedPath || this.syncProgress.allowedFiles && !this.syncProgress.allowedFiles.has(normalizedPath)) {
        continue;
      }
      if (!this.syncProgress.trackedFiles.has(normalizedPath)) {
        this.syncProgress.trackedFiles.add(normalizedPath);
        changed = true;
      }
      if (!this.syncProgress.completedFiles.has(normalizedPath)) {
        this.syncProgress.completedFiles.add(normalizedPath);
        changed = true;
      }
    }
    if (changed) {
      this.emitSyncProgress();
    }
  }
  getSyncProgressSnapshot() {
    if (!this.syncProgress) {
      return this.lastSyncProgress ? { ...this.lastSyncProgress } : { completedFiles: 0, totalFiles: 0 };
    }
    return {
      completedFiles: this.syncProgress.completedFiles.size,
      totalFiles: this.syncProgress.trackedFiles.size
    };
  }
  emitSyncProgress() {
    const progress = this.getSyncProgressSnapshot();
    if (this.syncProgress && progress.totalFiles > 0) {
      this.lastSyncProgress = { ...progress };
    }
    this.updateSyncStatusBarItem();
    if (!progress || !this.syncProgress.onProgress) {
      return;
    }
    try {
      this.syncProgress.onProgress(progress);
    } catch (error) {
      console.warn("[obsidian-http-sync] sync progress callback failed", error);
    }
  }
  updateSyncStatusBarItem() {
    if (!this.syncStatusBarItemEl) {
      return;
    }
    const brandLabel = this.t("statusBar.brand");
    const lampState = this.getSyncStatusLampState();
    const syncModeLabel = this.settings.autoSync ? this.t("statusBar.syncModeAuto") : this.t("statusBar.syncModeManual");
    const syncModeIcon = this.settings.autoSync ? "refresh-cw" : "mouse-pointer-click";
    const syncProgress = this.syncProgress ? this.getSyncProgressSnapshot() : null;
    const syncProgressLabel = syncProgress ? this.t("statusBar.syncProgress", {
      completed: syncProgress.completedFiles,
      total: syncProgress.totalFiles
    }) : "";
    const noteStatus = this.getNoteLeaseStatusBarSegment();
    const label = `${brandLabel} | ${lampState.tooltip} | ${syncModeLabel}${syncProgressLabel ? ` | ${syncProgressLabel}` : ""}${noteStatus.aria}`;
    if (typeof this.syncStatusBarItemEl.replaceChildren === "function") {
      this.syncStatusBarItemEl.replaceChildren();
    } else {
      this.syncStatusBarItemEl.textContent = "";
    }
    this.syncStatusBarItemEl.classList.add("arcalink-status-bar-item");
    this.syncStatusBarItemEl.style.display = "inline-flex";
    this.syncStatusBarItemEl.style.alignItems = "center";
    this.syncStatusBarItemEl.style.gap = "6px";
    this.syncStatusBarItemEl.style.whiteSpace = "nowrap";
    this.syncStatusBarItemEl.setAttribute("aria-label", label);
    this.syncStatusBarItemEl.setAttribute("title", label);
    const documentRef = this.syncStatusBarItemEl.ownerDocument || (typeof document !== "undefined" ? document : null);
    if (!documentRef) {
      this.syncStatusBarItemEl.textContent = brandLabel;
      return;
    }
    const brandEl = documentRef.createElement("span");
    brandEl.className = "arcalink-status-bar-brand";
    brandEl.textContent = brandLabel;
    const openSettingsLabel = this.t("statusBar.openSettings");
    brandEl.setAttribute("role", "button");
    brandEl.setAttribute("tabindex", "0");
    brandEl.setAttribute("aria-label", openSettingsLabel);
    brandEl.setAttribute("title", openSettingsLabel);
    brandEl.style.cursor = "pointer";
    brandEl.addEventListener("click", () => this.openPluginSettings());
    brandEl.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") {
        return;
      }
      event.preventDefault();
      this.openPluginSettings();
    });
    this.syncStatusBarItemEl.appendChild(brandEl);
    const lampEl = documentRef.createElement("span");
    lampEl.className = `arcalink-status-bar-lamp arcalink-status-bar-lamp-${lampState.color}`;
    lampEl.setAttribute("role", "img");
    lampEl.setAttribute("aria-label", lampState.tooltip);
    lampEl.setAttribute("title", lampState.tooltip);
    lampEl.style.display = "inline-block";
    lampEl.style.width = "9px";
    lampEl.style.height = "9px";
    lampEl.style.borderRadius = "999px";
    lampEl.style.backgroundColor = STATUS_LAMP_COLORS[lampState.color];
    lampEl.style.boxShadow = `0 0 0 2px rgba(255, 255, 255, 0.18), 0 0 8px ${STATUS_LAMP_COLORS[lampState.color]}`;
    this.syncStatusBarItemEl.appendChild(lampEl);
    const modeEl = documentRef.createElement("span");
    modeEl.className = "arcalink-status-bar-sync-mode";
    modeEl.setAttribute("role", "img");
    modeEl.setAttribute("aria-label", syncModeLabel);
    modeEl.setAttribute("title", syncModeLabel);
    modeEl.style.display = "inline-flex";
    modeEl.style.alignItems = "center";
    modeEl.style.justifyContent = "center";
    modeEl.style.width = "14px";
    modeEl.style.height = "14px";
    if (typeof setIcon === "function") {
      setIcon(modeEl, syncModeIcon);
    } else {
      modeEl.textContent = this.settings.autoSync ? "\u21BB" : "\u21A5";
    }
    this.syncStatusBarItemEl.appendChild(modeEl);
    if (syncProgressLabel) {
      const progressEl = documentRef.createElement("span");
      progressEl.className = "arcalink-status-bar-progress";
      progressEl.textContent = `${syncProgress.completedFiles}/${syncProgress.totalFiles}`;
      progressEl.setAttribute("aria-label", syncProgressLabel);
      progressEl.setAttribute("title", syncProgressLabel);
      this.syncStatusBarItemEl.appendChild(progressEl);
    }
    if (noteStatus.text) {
      const noteEl = documentRef.createElement("span");
      noteEl.className = "arcalink-status-bar-note";
      noteEl.textContent = noteStatus.text.replace(/^\s*\|\s*/, "");
      noteEl.style.opacity = "0.82";
      this.syncStatusBarItemEl.appendChild(noteEl);
    }
  }
  openPluginSettings() {
    const setting = this.app && this.app.setting;
    if (!setting) {
      return;
    }
    if (typeof setting.open === "function") {
      setting.open();
    }
    if (typeof setting.openTabById === "function") {
      setting.openTabById(
        this.manifest && this.manifest.id ? this.manifest.id : PLUGIN_ID
      );
    }
  }
  getSyncStatusLampState() {
    const serverProblemTooltip = this.getStatusLampServerProblemTooltip();
    if (serverProblemTooltip) {
      return {
        color: "red",
        tooltip: serverProblemTooltip
      };
    }
    if (this.settings.lastError) {
      return {
        color: "red",
        tooltip: this.t("statusBar.lampSyncError")
      };
    }
    const conflictCount = this.getCachedOpenConflicts().length;
    if (conflictCount > 0) {
      return {
        color: "yellow",
        tooltip: this.t("statusBar.lampConflictCount", { count: conflictCount })
      };
    }
    if (this.settings.lastSyncWarning === "sync_conflicts_open") {
      return {
        color: "yellow",
        tooltip: this.t("statusBar.lampConflict")
      };
    }
    return {
      color: "green",
      tooltip: this.t("statusBar.lampOk")
    };
  }
  getStatusLampServerProblemTooltip() {
    if (!this.isConfigured()) {
      return this.t("statusBar.lampNoConnection");
    }
    const authState = this.settings.authState || DEFAULT_AUTH_STATE;
    const syncBlockReason = String(this.settings.syncBlockReason || SYNC_BLOCK_REASON.NONE);
    if (syncBlockReason === SYNC_BLOCK_REASON.BILLING_BLOCKED || authState.status === AUTH_STATUS.BILLING_BLOCKED) {
      return this.t("statusBar.lampBlocked");
    }
    if (syncBlockReason && syncBlockReason !== SYNC_BLOCK_REASON.NONE) {
      return this.t("statusBar.lampNoConnection");
    }
    if (authState.status !== AUTH_STATUS.AUTHENTICATED) {
      return this.t("statusBar.lampNoConnection");
    }
    return "";
  }
  getNoteLeaseStatusBarSegment() {
    const lease = this.activeNoteLease;
    if (!lease || !lease.path) {
      return { text: "", aria: "" };
    }
    const holders = this.getOtherNoteLeaseHolders(lease);
    const holderSummary = this.formatNoteLeaseHolderSummary(holders);
    const holderCount = holders.length;
    const isReadonly = Boolean(lease.path && this.isNoteLeaseReadOnly(lease.path));
    if (!isReadonly && holderCount === 0) {
      return { text: "", aria: "" };
    }
    let text2 = "";
    if (isReadonly) {
      text2 = ` | ${this.t("statusBar.noteReadonlyShort")}`;
    } else if (holderCount > 0) {
      text2 = ` | ${this.t("statusBar.notePresenceShort", { count: holderCount })}`;
    }
    const detailKey = isReadonly ? "statusBar.noteReadonly" : "statusBar.notePresence";
    const detail = this.t(detailKey, {
      path: lease.path,
      holders: holderSummary || this.t("statusBar.noteUnknownHolders")
    });
    return { text: text2, aria: ` | ${detail}` };
  }
  getServerConnectionStatusLabel() {
    const authState = this.settings.authState || DEFAULT_AUTH_STATE;
    const syncBlockReason = String(this.settings.syncBlockReason || SYNC_BLOCK_REASON.NONE);
    if (!this.isConfigured()) {
      return this.t("statusBar.serverNotConfigured");
    }
    if (authState.status === AUTH_STATUS.UNKNOWN) {
      return this.t("statusBar.serverChecking");
    }
    if (authState.status === AUTH_STATUS.MISSING_TOKEN) {
      return this.t("statusBar.serverNotConnected");
    }
    if (syncBlockReason && syncBlockReason !== SYNC_BLOCK_REASON.NONE) {
      if (syncBlockReason === SYNC_BLOCK_REASON.BILLING_BLOCKED) {
        return this.t("statusBar.serverBlocked");
      }
      if (syncBlockReason === SYNC_BLOCK_REASON.NETWORK_ERROR || syncBlockReason === SYNC_BLOCK_REASON.SERVER_ERROR || syncBlockReason === SYNC_BLOCK_REASON.REFRESH_FAILED || syncBlockReason === SYNC_BLOCK_REASON.SESSION_EXPIRED || syncBlockReason === SYNC_BLOCK_REASON.SESSION_REVOKED) {
        return this.t("statusBar.serverError");
      }
      return this.t("statusBar.serverBlocked");
    }
    if (authState.status === AUTH_STATUS.AUTHENTICATED) {
      return this.t("statusBar.serverConnected");
    }
    return this.t("statusBar.serverError");
  }
  getSyncProgressStatusLabel() {
    if (!this.isConfigured()) {
      return this.t("statusBar.syncNotConfigured");
    }
    if (this.syncInFlight) {
      return this.t("statusBar.syncing");
    }
    if (this.settings.lastError) {
      return this.t("statusBar.syncError");
    }
    if (this.pendingChangesDuringSync) {
      return this.t("statusBar.syncQueued");
    }
    return this.t("statusBar.syncIdle");
  }
  removeActiveNoteTakeoverButton() {
    if (this.activeNoteTakeoverButtonEl && this.activeNoteTakeoverButtonEl.isConnected) {
      this.activeNoteTakeoverButtonEl.remove();
    }
    this.activeNoteTakeoverButtonEl = null;
    this.activeNoteTakeoverButtonPath = "";
    this.activeNoteTakeoverButtonHostEl = null;
  }
  updateActiveNoteTakeoverButton() {
    const state = this.activeNoteLease;
    const path = state && state.path && this.shouldTrackNoteLeaseForPath(state.path) ? normalizePath(String(state.path)) : "";
    if (!path || !this.isNoteLeaseReadOnly(path)) {
      this.removeActiveNoteTakeoverButton();
      return;
    }
    const openView = this.getOpenEditorView(path);
    const hostEl = openView && openView.containerEl ? openView.containerEl.querySelector(".view-actions") || openView.containerEl.querySelector(".view-header") : null;
    if (!openView || !hostEl) {
      this.removeActiveNoteTakeoverButton();
      return;
    }
    if (this.activeNoteTakeoverButtonEl && this.activeNoteTakeoverButtonEl.isConnected && this.activeNoteTakeoverButtonPath === path && this.activeNoteTakeoverButtonHostEl === hostEl) {
      this.activeNoteTakeoverButtonEl.disabled = this.noteLeaseSupport === false;
      return;
    }
    this.removeActiveNoteTakeoverButton();
    const button = hostEl.createEl("button", {
      text: this.t("button.takeoverActiveNoteEdit")
    });
    button.type = "button";
    button.classList.add("obsidian-http-sync-note-takeover-button");
    button.setAttribute("aria-label", this.t("button.takeoverActiveNoteEdit"));
    button.setAttribute("title", this.t("button.takeoverActiveNoteEdit"));
    button.disabled = this.noteLeaseSupport === false;
    button.style.marginLeft = "0.5em";
    button.style.padding = "0 0.6em";
    button.style.height = "24px";
    button.style.fontSize = "var(--font-ui-smaller)";
    button.style.lineHeight = "22px";
    button.style.fontWeight = "600";
    button.style.color = "#ffffff";
    button.style.backgroundColor = "#16a34a";
    button.style.borderColor = "#15803d";
    button.style.borderRadius = "5px";
    button.addEventListener("click", async (event) => {
      event.preventDefault();
      event.stopPropagation();
      if (button.disabled) {
        new Notice(this.t("notice.noteTakeoverUnavailable"));
        return;
      }
      button.disabled = true;
      try {
        await this.takeOverActiveNoteLock();
      } catch (error) {
        console.error("[obsidian-http-sync] note takeover failed", error);
      } finally {
        this.updateActiveNoteTakeoverButton();
      }
    });
    this.activeNoteTakeoverButtonEl = button;
    this.activeNoteTakeoverButtonPath = path;
    this.activeNoteTakeoverButtonHostEl = hostEl;
  }
  isMarkdownNotePath(path) {
    return normalizePath(String(path || "")).toLowerCase().endsWith(".md");
  }
  shouldTrackNoteLeaseForPath(path) {
    const normalizedPath = normalizePath(String(path || ""));
    if (!normalizedPath || !this.isConfigured() || !this.isMarkdownNotePath(normalizedPath)) {
      return false;
    }
    return this.shouldApplyRemotePath(normalizedPath);
  }
  shouldRenewNoteLease(state) {
    if (!state) {
      return true;
    }
    const expiresAtMs = Date.parse(state.expiresAt || "");
    if (!Number.isFinite(expiresAtMs) || expiresAtMs - Date.now() < NOTE_LEASE_RENEW_INTERVAL_MS) {
      return true;
    }
    return Date.now() - Number(state.checkedAt || 0) >= NOTE_LEASE_RENEW_INTERVAL_MS;
  }
  getNoteLeaseRouteCandidates(kind, leaseId = "") {
    const vaultBase = `/vaults/${this.settings.vaultId}`;
    const baseCandidates = kind === "claim" ? [
      `${vaultBase}/crdt/leases`,
      `${vaultBase}/note-leases`,
      `${vaultBase}/note-leases/claim`,
      `${vaultBase}/notes/leases`,
      `${vaultBase}/notes/leases/claim`,
      `${vaultBase}/edit-locks`,
      `${vaultBase}/edit-locks/claim`
    ] : [
      `${vaultBase}/note-leases`,
      `${vaultBase}/note-leases/release`,
      `${vaultBase}/notes/leases`,
      `${vaultBase}/notes/leases/release`,
      `${vaultBase}/edit-locks`,
      `${vaultBase}/edit-locks/release`
    ];
    const selectedRoute = kind === "claim" ? this.noteLeaseRoutes[kind] : "";
    if (kind === "claim" && selectedRoute) {
      if (selectedRoute === baseCandidates[0]) {
        return [selectedRoute];
      }
      return [baseCandidates[0], selectedRoute, ...baseCandidates.slice(1).filter((candidate) => candidate !== selectedRoute)];
    }
    if (kind === "release") {
      const normalizedLeaseId = String(leaseId || "").trim();
      if (normalizedLeaseId) {
        return [`${vaultBase}/crdt/leases/${encodeURIComponent(normalizedLeaseId)}`, ...baseCandidates];
      }
    }
    return baseCandidates;
  }
  isUnsupportedNoteLeaseError(error) {
    const statusCode = Number(error && error.statusCode) || 0;
    return statusCode === 404 || statusCode === 405 || statusCode === 501;
  }
  buildNoteLeaseRequestBody(path, options = {}) {
    const normalizedPath = normalizePath(String(path || ""));
    const body = {
      device_id: this.settings.deviceId,
      file_path: normalizedPath,
      mode: options.mode || "presence",
      ttl_seconds: NOTE_LEASE_TTL_SECONDS
    };
    if (options.takeover === true) {
      body.takeover = true;
    }
    if (options.exclusive === true) {
      body.exclusive = true;
    }
    if (options.leaseToken) {
      body.lease_token = options.leaseToken;
    }
    if (options.generation !== null && options.generation !== void 0 && options.generation !== "") {
      body.generation = options.generation;
    }
    return body;
  }
  normalizeNoteLeasePayload(path, mode, payload) {
    const lease = payload && payload.lease && typeof payload.lease === "object" ? payload.lease : {};
    const holders = Array.isArray(payload && payload.active_holders) ? payload.active_holders : Array.isArray(payload && payload.holders) ? payload.holders : payload && payload.holder && typeof payload.holder === "object" ? [payload.holder] : [];
    const editable = payload ? payload.editable !== false : true;
    const readonlyReason = String(
      payload && payload.readonly_reason || lease.readonly_reason || ""
    ).trim();
    return {
      path: normalizePath(String(path || "")),
      mode,
      editable,
      heldByCurrentDevice: Boolean(payload && payload.held_by_current_device),
      heldByOtherDevice: Boolean(payload && payload.held_by_other_device) && (!editable || readonlyReason === "held_by_other_device"),
      readonlyReason,
      leaseId: String(lease && lease.id || payload && payload.lease_id || "").trim(),
      leaseToken: String(payload && payload.lease_token || lease.lease_token || "").trim(),
      generation: (payload && payload.generation) !== void 0 ? payload.generation : lease.generation,
      exclusive: Boolean(payload && payload.exclusive || lease.exclusive),
      expiresAt: String(payload && payload.expires_at || lease.expires_at || "").trim(),
      planMode: String(payload && payload.plan_mode || "").trim().toLowerCase(),
      holders,
      checkedAt: Date.now()
    };
  }
  async requestNoteLeaseClaim(path, options = {}) {
    if (this.noteLeaseSupport === false) {
      return null;
    }
    let firstError = null;
    for (const candidateRoute of this.getNoteLeaseRouteCandidates("claim")) {
      try {
        const payload = await this.requestJson(
          "POST",
          candidateRoute,
          this.buildNoteLeaseRequestBody(path, options)
        );
        this.noteLeaseRoutes.claim = candidateRoute;
        this.noteLeaseSupport = true;
        return this.normalizeNoteLeasePayload(path, options.mode || "presence", payload);
      } catch (error) {
        if (this.isUnsupportedNoteLeaseError(error)) {
          continue;
        }
        firstError = firstError || error;
        break;
      }
    }
    if (firstError) {
      throw firstError;
    }
    this.noteLeaseSupport = false;
    return null;
  }
  async releaseNoteLeaseMode(path, mode, leaseId = "", leaseToken = "", generation = null) {
    if (this.noteLeaseSupport === false) {
      return false;
    }
    const normalizedLeaseId = String(leaseId || "").trim();
    if (!normalizedLeaseId) {
      return false;
    }
    let firstError = null;
    for (const candidateRoute of this.getNoteLeaseRouteCandidates("release", normalizedLeaseId)) {
      try {
        if (candidateRoute.includes("/crdt/leases/")) {
          const query2 = new URLSearchParams();
          if (leaseToken) {
            query2.set("lease_token", leaseToken);
          }
          const suffix = query2.toString() ? `?${query2.toString()}` : "";
          const payload2 = await this.requestJson(
            "DELETE",
            `${candidateRoute}${suffix}`
          );
          this.noteLeaseSupport = true;
          return payload2 ? payload2.released !== false : true;
        }
        const query = new URLSearchParams();
        query.set("file_path", normalizePath(String(path || "")));
        query.set("mode", String(mode || "presence"));
        if (leaseToken) {
          query.set("lease_token", leaseToken);
        }
        if (generation !== null && generation !== void 0 && generation !== "") {
          query.set("generation", String(generation));
        }
        const payload = await this.requestJson(
          "DELETE",
          `${candidateRoute}?${query.toString()}`
        );
        this.noteLeaseRoutes.release = candidateRoute;
        this.noteLeaseSupport = true;
        return payload ? payload.released !== false : true;
      } catch (error) {
        if (this.isUnsupportedNoteLeaseError(error)) {
          continue;
        }
        firstError = firstError || error;
        break;
      }
    }
    if (firstError) {
      throw firstError;
    }
    this.noteLeaseSupport = false;
    return false;
  }
  getOtherNoteLeaseHolders(state) {
    if (!state || !Array.isArray(state.holders)) {
      return [];
    }
    return state.holders.filter((holder) => {
      if (!holder || typeof holder !== "object") {
        return false;
      }
      if (holder.current_device === true || holder.is_current_device === true) {
        return false;
      }
      const holderDeviceId = String(holder.device_id || "").trim();
      return !holderDeviceId || holderDeviceId !== String(this.settings.deviceId || "").trim();
    });
  }
  formatNoteLeaseHolder(holder) {
    if (!holder || typeof holder !== "object") {
      return "";
    }
    return String(
      holder.device_name || holder.user_name || holder.user_email || holder.email || holder.device_id || holder.user_id || ""
    ).trim();
  }
  formatNoteLeaseHolderSummary(holders) {
    const labels = (Array.isArray(holders) ? holders : []).map((holder) => this.formatNoteLeaseHolder(holder)).filter(Boolean);
    return labels.slice(0, 2).join(", ");
  }
  shouldAcquireNoteEditLease(path, presenceLease) {
    if (!this.shouldTrackNoteLeaseForPath(path)) {
      return false;
    }
    return String(presenceLease && presenceLease.planMode || "").toLowerCase() !== "team";
  }
  async resolveNoteLeaseState(path, options = {}) {
    const normalizedPath = normalizePath(String(path || ""));
    if (!this.shouldTrackNoteLeaseForPath(normalizedPath)) {
      return null;
    }
    const currentState = this.activeNoteLease && this.activeNoteLease.path === normalizedPath ? this.activeNoteLease : null;
    if (!options.force && currentState && !this.shouldRenewNoteLease(currentState)) {
      return currentState;
    }
    let presenceLease;
    try {
      presenceLease = await this.requestNoteLeaseClaim(normalizedPath, {
        mode: "presence",
        leaseToken: currentState && currentState.presenceToken ? currentState.presenceToken : "",
        generation: currentState && currentState.presenceGeneration !== void 0 ? currentState.presenceGeneration : null
      });
    } catch (error) {
      console.warn("[obsidian-http-sync] note presence claim failed", error);
      return currentState;
    }
    if (!presenceLease) {
      return null;
    }
    let editLease = null;
    if (this.shouldAcquireNoteEditLease(normalizedPath, presenceLease) || options.takeover === true || options.exclusive === true) {
      try {
        editLease = await this.requestNoteLeaseClaim(normalizedPath, {
          mode: "edit",
          takeover: options.takeover === true,
          exclusive: options.exclusive === true,
          leaseToken: currentState && currentState.editToken ? currentState.editToken : "",
          generation: currentState && currentState.editGeneration !== void 0 ? currentState.editGeneration : null
        });
      } catch (error) {
        console.warn("[obsidian-http-sync] note edit claim failed", error);
      }
    }
    const currentEditLease = editLease && editLease.heldByCurrentDevice && editLease.editable !== false ? editLease : null;
    const primaryLease = editLease || presenceLease;
    return {
      path: normalizedPath,
      editable: primaryLease.editable !== false,
      readonlyReason: primaryLease.readonlyReason || "",
      expiresAt: primaryLease.expiresAt || presenceLease.expiresAt || "",
      planMode: primaryLease.planMode || presenceLease.planMode || "",
      holders: Array.isArray(primaryLease.holders) && primaryLease.holders.length > 0 ? primaryLease.holders : presenceLease.holders,
      checkedAt: Date.now(),
      presenceLeaseId: presenceLease.leaseId || "",
      presenceToken: presenceLease.leaseToken || "",
      presenceGeneration: presenceLease.generation,
      editLeaseId: currentEditLease ? currentEditLease.leaseId || "" : "",
      editToken: currentEditLease ? currentEditLease.leaseToken || "" : "",
      editGeneration: currentEditLease ? currentEditLease.generation : null,
      heldByCurrentDevice: Boolean(
        currentEditLease && currentEditLease.heldByCurrentDevice || primaryLease.heldByCurrentDevice
      ),
      heldByOtherDevice: Boolean(primaryLease.heldByOtherDevice),
      exclusive: Boolean(
        currentEditLease && currentEditLease.exclusive || primaryLease.exclusive || presenceLease.exclusive
      )
    };
  }
  async fetchCurrentNoteLeaseReadState(path) {
    if (this.noteLeaseReadSupport === false) {
      return null;
    }
    const normalizedPath = normalizePath(String(path || ""));
    if (!normalizedPath) {
      return null;
    }
    try {
      const query = new URLSearchParams();
      query.set("file_path", normalizedPath);
      const payload = await this.requestJson(
        "GET",
        `/vaults/${this.settings.vaultId}/crdt/leases?${query.toString()}`
      );
      this.noteLeaseReadSupport = true;
      const readState = this.normalizeNoteLeasePayload(normalizedPath, "push-guard", payload);
      if (this.isActiveCrdtPath(normalizedPath) || this.activeNoteLease && this.activeNoteLease.path === normalizedPath) {
        this.setActiveNoteLeaseState({
          ...this.activeNoteLease && this.activeNoteLease.path === normalizedPath ? this.activeNoteLease : {},
          ...readState
        });
      }
      return readState;
    } catch (error) {
      if (this.isUnsupportedNoteLeaseError(error)) {
        this.noteLeaseReadSupport = false;
        return null;
      }
      throw error;
    }
  }
  async pollActiveNoteLease(activeFile = null, options = {}) {
    const currentActiveFile = activeFile || (this.app.workspace && typeof this.app.workspace.getActiveFile === "function" ? this.app.workspace.getActiveFile() : null);
    const nextPath = currentActiveFile && currentActiveFile.path && this.shouldTrackNoteLeaseForPath(currentActiveFile.path) ? normalizePath(String(currentActiveFile.path)) : "";
    const previousState = this.activeNoteLease;
    if (!nextPath) {
      if (previousState) {
        await this.releaseActiveNoteLease();
      } else {
        this.updateSyncStatusBarItem();
      }
      return null;
    }
    if (previousState && previousState.path !== nextPath) {
      await this.releaseActiveNoteLease();
    }
    const currentState = this.activeNoteLease && this.activeNoteLease.path === nextPath ? this.activeNoteLease : null;
    if (!options.force && currentState && !this.shouldRenewNoteLease(currentState)) {
      try {
        const readState = await this.fetchCurrentNoteLeaseReadState(nextPath);
        if (readState) {
          this.applyActiveNoteLeaseEditorGuard();
          this.updateSyncStatusBarItem();
          this.updateActiveNoteTakeoverButton();
          return this.activeNoteLease && this.activeNoteLease.path === nextPath ? this.activeNoteLease : readState;
        }
      } catch (error) {
        console.warn("[obsidian-http-sync] active note lease read refresh failed", error);
      }
      this.applyActiveNoteLeaseEditorGuard();
      this.updateSyncStatusBarItem();
      this.updateActiveNoteTakeoverButton();
      return currentState;
    }
    const nextState = await this.resolveNoteLeaseState(nextPath, {
      force: options.force === true,
      takeover: options.takeover === true,
      exclusive: options.exclusive === true
    });
    if (!nextState) {
      this.clearActiveNoteLeaseState();
      return null;
    }
    this.setActiveNoteLeaseState(nextState);
    return nextState;
  }
  setActiveNoteLeaseState(nextState) {
    const previousState = this.activeNoteLease;
    const wasReadOnly = this.isResolvedNoteLeaseReadOnly(previousState);
    const isReadOnly = this.isResolvedNoteLeaseReadOnly(nextState);
    if (previousState && (!nextState || previousState.path !== nextState.path || !isReadOnly)) {
      this.setOpenEditorReadOnly(previousState.path, false);
    }
    this.activeNoteLease = nextState;
    this.applyActiveNoteLeaseEditorGuard();
    this.updateSyncStatusBarItem();
    this.updateActiveNoteTakeoverButton();
    if (!nextState) {
      return;
    }
    if (isReadOnly && (!wasReadOnly || !previousState || previousState.path !== nextState.path || previousState.readonlyReason !== nextState.readonlyReason)) {
      this.showNoteLeaseBlockedNotice(nextState.path, { structural: false });
      return;
    }
  }
  clearActiveNoteLeaseState() {
    if (this.activeNoteLease && this.activeNoteLease.path) {
      this.setOpenEditorReadOnly(this.activeNoteLease.path, false);
    }
    this.activeNoteLease = null;
    this.updateSyncStatusBarItem();
    this.removeActiveNoteTakeoverButton();
  }
  async releaseActiveNoteLease() {
    const state = this.activeNoteLease;
    this.clearActiveNoteLeaseState();
    if (!state || !state.path) {
      return false;
    }
    const tasks = [];
    if (state.editLeaseId) {
      tasks.push(
        this.releaseNoteLeaseMode(
          state.path,
          "edit",
          state.editLeaseId,
          state.editToken,
          state.editGeneration
        )
      );
    }
    if (state.presenceLeaseId) {
      tasks.push(
        this.releaseNoteLeaseMode(
          state.path,
          "presence",
          state.presenceLeaseId,
          state.presenceToken,
          state.presenceGeneration
        )
      );
    }
    if (tasks.length === 0) {
      return false;
    }
    const settled = await Promise.allSettled(tasks);
    return settled.some((result) => result.status === "fulfilled" && result.value);
  }
  isNoteLeaseReadOnly(path) {
    const normalizedPath = normalizePath(String(path || ""));
    const state = this.activeNoteLease;
    if (!state || !normalizedPath || state.path !== normalizedPath) {
      return false;
    }
    return this.isResolvedNoteLeaseReadOnly(state);
  }
  isResolvedNoteLeaseReadOnly(state) {
    if (!state) {
      return false;
    }
    if (!state.exclusive && String(state.planMode || "") === "team") {
      return false;
    }
    return state.editable === false;
  }
  isNoteLeaseStateBlockingPath(path, state) {
    const normalizedPath = normalizePath(String(path || ""));
    if (!state || !normalizedPath || !this.isResolvedNoteLeaseReadOnly(state)) {
      return false;
    }
    return normalizedPath === state.path || normalizedPath.startsWith(`${state.path}/`) || state.path.startsWith(`${normalizedPath}/`);
  }
  isNoteChangeBlockedByOtherLease(path) {
    const normalizedPath = normalizePath(String(path || ""));
    const state = this.activeNoteLease;
    if (!state || !normalizedPath || !this.isNoteLeaseReadOnly(state.path)) {
      return false;
    }
    return this.isNoteLeaseStateBlockingPath(normalizedPath, state);
  }
  shouldDeferRemoteApplyForActiveEditLease(path) {
    const normalizedPath = normalizePath(String(path || ""));
    const state = this.activeNoteLease;
    if (!state || !normalizedPath || state.path !== normalizedPath || this.isResolvedNoteLeaseReadOnly(state)) {
      return false;
    }
    if (String(state.planMode || "") === "team") {
      return false;
    }
    return Boolean(state.editLeaseId && state.editToken && state.editable !== false);
  }
  shouldDeferRemoteApplyForSharedNonCrdtNote(path) {
    const normalizedPath = normalizePath(String(path || ""));
    const state = this.activeNoteLease;
    if (!state || !normalizedPath || state.path !== normalizedPath || this.shouldUseCrdtForPath(normalizedPath)) {
      return false;
    }
    return this.getOtherNoteLeaseHolders(state).length > 0;
  }
  async shouldDeferRemoteApplyForNoteLease(path, baselineEntries = null) {
    const normalizedPath = normalizePath(String(path || ""));
    if (this.shouldDeferRemoteApplyForActiveEditLease(normalizedPath)) {
      return true;
    }
    if (this.shouldDeferRemoteApplyForSharedNonCrdtNote(normalizedPath) && (!baselineEntries || await this.hasUnsyncedLocalChange(normalizedPath, baselineEntries))) {
      this.showNoteNonCrdtRemotePausedNotice(normalizedPath);
      return true;
    }
    return false;
  }
  addReportConflictPath(report, path) {
    const normalizedPath = normalizePath(String(path || ""));
    if (!report || !normalizedPath) {
      return;
    }
    if (!report.conflictedPaths || typeof report.conflictedPaths.add !== "function") {
      report.conflictedPaths = /* @__PURE__ */ new Set();
    }
    report.conflictedPaths.add(normalizedPath);
  }
  getOpenConflictPaths(report = null) {
    const paths = /* @__PURE__ */ new Set();
    if (report && report.conflictedPaths && typeof report.conflictedPaths.forEach === "function") {
      report.conflictedPaths.forEach((path) => {
        const normalizedPath = normalizePath(String(path || ""));
        if (normalizedPath) {
          paths.add(normalizedPath);
        }
      });
    }
    const items = this.settings && this.settings.conflicts && this.settings.conflicts.items ? this.settings.conflicts.items : {};
    for (const conflict of Object.values(items)) {
      if (!conflict || String(conflict.status || "open") !== "open") {
        continue;
      }
      for (const candidate of [conflict.path, conflict.target_path]) {
        const normalizedPath = normalizePath(String(candidate || ""));
        if (normalizedPath) {
          paths.add(normalizedPath);
        }
      }
    }
    return paths;
  }
  isPathOpenConflict(path, report = null) {
    const normalizedPath = normalizePath(String(path || ""));
    return Boolean(normalizedPath && this.getOpenConflictPaths(report).has(normalizedPath));
  }
  shouldDeferRemoteApplyForOpenConflict(path, report = null) {
    if (!this.isPathOpenConflict(path, report)) {
      return false;
    }
    this.pendingChangesDuringSync = true;
    return true;
  }
  rememberAcceptedPushBaseline(report, path, entry) {
    const normalizedPath = normalizePath(String(path || ""));
    if (!report || !normalizedPath || !entry) {
      return;
    }
    if (!report.acceptedPushEntries) {
      report.acceptedPushEntries = {};
    }
    report.acceptedPushEntries[normalizedPath] = { ...entry };
  }
  addReportRemoteAppliedPath(report, path, entry = null) {
    const normalizedPath = normalizePath(String(path || ""));
    if (!report || !normalizedPath) {
      return;
    }
    if (!report.remotelyAppliedPaths || typeof report.remotelyAppliedPaths.add !== "function") {
      report.remotelyAppliedPaths = /* @__PURE__ */ new Set();
    }
    report.remotelyAppliedPaths.add(normalizedPath);
    if (entry) {
      if (!report.remotelyAppliedEntries) {
        report.remotelyAppliedEntries = {};
      }
      report.remotelyAppliedEntries[normalizedPath] = { ...entry };
    }
  }
  isPathRemoteAppliedDuringSync(path, report = null) {
    const normalizedPath = normalizePath(String(path || ""));
    return Boolean(
      normalizedPath && report && report.remotelyAppliedPaths && typeof report.remotelyAppliedPaths.has === "function" && report.remotelyAppliedPaths.has(normalizedPath)
    );
  }
  getRemoteAppliedEntryDuringSync(path, report = null) {
    const normalizedPath = normalizePath(String(path || ""));
    if (!normalizedPath || !report || !report.remotelyAppliedEntries || !report.remotelyAppliedEntries[normalizedPath]) {
      return null;
    }
    return report.remotelyAppliedEntries[normalizedPath];
  }
  preserveAcceptedPushBaselines(finalEntries, report = null) {
    const acceptedEntries = report && report.acceptedPushEntries ? report.acceptedPushEntries : {};
    const acceptedPaths = Object.keys(acceptedEntries);
    if (acceptedPaths.length === 0) {
      return finalEntries;
    }
    const retainedEntries = { ...finalEntries || {} };
    let retainedAnyAcceptedBaseline = false;
    for (const path of acceptedPaths) {
      const acceptedEntry = acceptedEntries[path];
      if (!acceptedEntry) {
        continue;
      }
      const finalEntry = finalEntries && finalEntries[path] ? finalEntries[path] : null;
      if (finalEntry && sameSyncIdentity(finalEntry, acceptedEntry)) {
        continue;
      }
      retainedEntries[path] = { ...acceptedEntry };
      retainedAnyAcceptedBaseline = true;
    }
    if (retainedAnyAcceptedBaseline) {
      this.pendingChangesDuringSync = true;
    }
    return retainedEntries;
  }
  preserveLocalChangesDuringSyncBaselines(finalEntries, cycleStartEntries, report = null) {
    const retainedEntries = { ...finalEntries || {} };
    const paths = /* @__PURE__ */ new Set([
      ...Object.keys(finalEntries || {}),
      ...Object.keys(cycleStartEntries || {})
    ]);
    let retainedAnyLocalBaseline = false;
    for (const path of paths) {
      const acceptedEntries = report && report.acceptedPushEntries ? report.acceptedPushEntries : {};
      if (acceptedEntries[path] || this.isPathOpenConflict(path, report)) {
        continue;
      }
      const remoteAppliedEntry = this.getRemoteAppliedEntryDuringSync(path, report);
      if (this.isPathRemoteAppliedDuringSync(path, report) && !remoteAppliedEntry) {
        continue;
      }
      const startEntry = cycleStartEntries && cycleStartEntries[path] ? cycleStartEntries[path] : null;
      const finalEntry = finalEntries && finalEntries[path] ? finalEntries[path] : null;
      if (remoteAppliedEntry) {
        if (finalEntry && sameSyncIdentity(finalEntry, remoteAppliedEntry)) {
          continue;
        }
        retainedEntries[path] = { ...remoteAppliedEntry };
        retainedAnyLocalBaseline = true;
        continue;
      }
      if (!startEntry && !finalEntry) {
        continue;
      }
      if (startEntry && finalEntry && sameSyncIdentity(startEntry, finalEntry)) {
        continue;
      }
      if (startEntry) {
        retainedEntries[path] = { ...startEntry };
      } else {
        delete retainedEntries[path];
      }
      retainedAnyLocalBaseline = true;
    }
    if (retainedAnyLocalBaseline) {
      this.pendingChangesDuringSync = true;
    }
    return retainedEntries;
  }
  async preserveOpenConflictUnsyncedBaselines(finalEntries, previousEntries, report = null) {
    const conflictPaths = this.getOpenConflictPaths(report);
    if (conflictPaths.size === 0) {
      return finalEntries;
    }
    const retainedEntries = { ...finalEntries || {} };
    let retainedAnyConflictBaseline = false;
    for (const path of conflictPaths) {
      if (!path) {
        continue;
      }
      const finalEntry = finalEntries && finalEntries[path] ? finalEntries[path] : null;
      const previousEntry = previousEntries && previousEntries[path] ? previousEntries[path] : null;
      let remoteEntry = null;
      let remoteChecked = false;
      try {
        remoteEntry = await this.fetchRemoteSnapshotEntry(path);
        remoteChecked = true;
      } catch (error) {
        console.warn("[obsidian-http-sync] open conflict remote baseline check failed", error);
      }
      const retainedEntry = remoteChecked ? remoteEntry : previousEntry;
      if (retainedEntry && finalEntry && sameSyncIdentity(retainedEntry, finalEntry)) {
        continue;
      }
      if (!retainedEntry && !finalEntry) {
        continue;
      }
      if (retainedEntry) {
        retainedEntries[path] = retainedEntry;
        retainedAnyConflictBaseline = true;
      } else {
        delete retainedEntries[path];
        retainedAnyConflictBaseline = true;
      }
    }
    if (retainedAnyConflictBaseline) {
      this.pendingChangesDuringSync = true;
    }
    return retainedEntries;
  }
  async preserveActiveEditLeaseUnsyncedBaseline(finalEntries, pushedSnapshotEntries) {
    const state = this.activeNoteLease;
    const path = state && state.path ? normalizePath(String(state.path)) : "";
    if (!path || !this.shouldDeferRemoteApplyForActiveEditLease(path) && !this.shouldDeferRemoteApplyForSharedNonCrdtNote(path)) {
      return finalEntries;
    }
    const finalEntry = finalEntries && finalEntries[path] ? finalEntries[path] : null;
    const pushedEntry = pushedSnapshotEntries && pushedSnapshotEntries[path] ? pushedSnapshotEntries[path] : null;
    if (!finalEntry) {
      return finalEntries;
    }
    let remoteEntry = null;
    try {
      remoteEntry = await this.fetchRemoteSnapshotEntry(path);
    } catch (error) {
      console.warn("[obsidian-http-sync] active note remote baseline check failed", error);
    }
    if (remoteEntry && sameSyncIdentity(finalEntry, remoteEntry)) {
      return finalEntries;
    }
    if (!remoteEntry && pushedEntry && sameSyncIdentity(finalEntry, pushedEntry)) {
      return finalEntries;
    }
    const retainedEntries = { ...finalEntries || {} };
    if (remoteEntry) {
      retainedEntries[path] = remoteEntry;
    } else if (pushedEntry) {
      retainedEntries[path] = pushedEntry;
    } else {
      delete retainedEntries[path];
    }
    this.pendingChangesDuringSync = true;
    return retainedEntries;
  }
  async fetchRemoteSnapshotEntry(path) {
    const normalizedPath = normalizePath(String(path || ""));
    if (!normalizedPath) {
      return null;
    }
    const remoteEntry = (await this.fetchRemoteFileIndex()).find(
      (entry) => entry.path === normalizedPath && !entry.is_deleted
    );
    return remoteEntry ? this.remoteFileEntryToSnapshotEntry(remoteEntry) : null;
  }
  async isNoteChangeBlockedByOtherLeaseFresh(path, options = {}) {
    const normalizedPath = normalizePath(String(path || ""));
    if (!normalizedPath || !this.shouldTrackNoteLeaseForPath(normalizedPath)) {
      return false;
    }
    const readState = await this.fetchCurrentNoteLeaseReadState(normalizedPath);
    if (readState) {
      return this.isNoteLeaseStateBlockingPath(normalizedPath, readState);
    }
    const state = await this.resolveNoteLeaseState(normalizedPath, {
      force: options.force === true,
      takeover: options.takeover === true
    });
    return this.isNoteLeaseStateBlockingPath(normalizedPath, state);
  }
  shouldRenewLocalDiffNoteLock(state) {
    if (!state) {
      return true;
    }
    const expiresAtMs = Date.parse(state.expiresAt || "");
    return !Number.isFinite(expiresAtMs) || expiresAtMs - Date.now() < NOTE_LEASE_RENEW_INTERVAL_MS;
  }
  async claimLocalDiffNoteEditLock(path, options = {}) {
    const normalizedPath = normalizePath(String(path || ""));
    if (!normalizedPath || !this.shouldTrackNoteLeaseForPath(normalizedPath)) {
      return true;
    }
    const cachedLock = this.localDiffNoteLocks.get(normalizedPath) || null;
    if (!this.shouldRenewLocalDiffNoteLock(cachedLock)) {
      return true;
    }
    try {
      if (await this.isNoteChangeBlockedByOtherLeaseFresh(normalizedPath, { force: true })) {
        this.pendingChangesDuringSync = true;
        this.showNoteLeaseBlockedNotice(normalizedPath, {
          structural: options.structural === true
        });
        this.applyActiveNoteLeaseEditorGuard();
        return false;
      }
      const activeFile = this.app.workspace && typeof this.app.workspace.getActiveFile === "function" ? this.app.workspace.getActiveFile() : null;
      let nextState = null;
      const isOpenEditorPath = Boolean(
        activeFile && normalizePath(String(activeFile.path || "")) === normalizedPath
      ) || Boolean(this.getOpenEditorView(normalizedPath));
      if (activeFile && normalizePath(String(activeFile.path || "")) === normalizedPath) {
        nextState = await this.pollActiveNoteLease(activeFile, {
          force: true,
          exclusive: true
        });
      } else if (isOpenEditorPath) {
        nextState = await this.requestNoteLeaseClaim(normalizedPath, {
          mode: "edit",
          exclusive: true,
          leaseToken: cachedLock && cachedLock.editToken ? cachedLock.editToken : "",
          generation: cachedLock && cachedLock.editGeneration !== void 0 ? cachedLock.editGeneration : null
        });
      } else {
        return true;
      }
      if (!nextState || nextState.editable === false || nextState.heldByOtherDevice === true) {
        this.pendingChangesDuringSync = true;
        this.showNoteLeaseBlockedNotice(normalizedPath, {
          structural: options.structural === true
        });
        this.applyActiveNoteLeaseEditorGuard();
        return false;
      }
      this.localDiffNoteLocks.set(normalizedPath, {
        expiresAt: nextState.expiresAt || "",
        editLeaseId: nextState.editLeaseId || nextState.leaseId || "",
        editToken: nextState.editToken || nextState.leaseToken || "",
        editGeneration: nextState.editGeneration ?? nextState.generation ?? null
      });
      return true;
    } catch (error) {
      console.warn("[obsidian-http-sync] note edit lock claim failed", error);
      return true;
    }
  }
  queueReleaseLocalDiffNoteLock(path) {
    this.releaseLocalDiffNoteLock(path).catch((error) => {
      console.warn("[obsidian-http-sync] note edit lock release failed", error);
    });
  }
  async releaseLocalDiffNoteLock(path) {
    const normalizedPath = normalizePath(String(path || ""));
    if (!normalizedPath) {
      return false;
    }
    const cachedLock = this.localDiffNoteLocks.get(normalizedPath) || null;
    if (!cachedLock) {
      return false;
    }
    this.localDiffNoteLocks.delete(normalizedPath);
    const activeState = this.activeNoteLease;
    if (activeState && activeState.path === normalizedPath && cachedLock.editLeaseId && activeState.editLeaseId === cachedLock.editLeaseId) {
      return false;
    }
    if (!cachedLock.editLeaseId) {
      return false;
    }
    return this.releaseNoteLeaseMode(
      normalizedPath,
      "edit",
      cachedLock.editLeaseId,
      cachedLock.editToken || "",
      cachedLock.editGeneration
    );
  }
  setOpenEditorReadOnly(path, readOnly) {
    const openView = this.getOpenEditorView(path);
    if (!openView || !openView.editor) {
      return false;
    }
    const editor = openView.editor;
    let applied = this.setCodeMirrorEditorGuard(path, editor, readOnly);
    try {
      if (typeof editor.setOption === "function") {
        editor.setOption("readOnly", readOnly);
        applied = true;
      }
    } catch (error) {
    }
    try {
      if (editor.cm && typeof editor.cm.setOption === "function") {
        editor.cm.setOption("readOnly", readOnly);
        applied = true;
      }
    } catch (error) {
    }
    return applied;
  }
  setCodeMirrorEditorGuard(path, editor, readOnly) {
    const cm = editor && editor.cm ? editor.cm : null;
    if (!cm || typeof cm !== "object") {
      return false;
    }
    let guard = this.noteLeaseEditorGuards.get(cm);
    if (!guard) {
      const originalDispatch = typeof cm.dispatch === "function" ? cm.dispatch.bind(cm) : null;
      guard = {
        path: "",
        readOnly: false,
        originalDispatch,
        contentDOM: cm.contentDOM || null,
        dom: cm.dom || null
      };
      if (originalDispatch) {
        cm.dispatch = (...args2) => {
          if (this.shouldBlockEditorGuard(guard) && this.isEditorDispatchChangingDocument(args2)) {
            this.showNoteLeaseBlockedNotice(guard.path, { structural: false });
            return;
          }
          return originalDispatch(...args2);
        };
      }
      const blockDomEdit = (event) => {
        if (!this.shouldBlockEditorGuard(guard)) {
          return;
        }
        event.preventDefault();
        event.stopImmediatePropagation();
        this.showNoteLeaseBlockedNotice(guard.path, { structural: false });
      };
      const blockKeyEdit = (event) => {
        if (!this.shouldBlockEditorGuard(guard)) {
          return;
        }
        if (this.isEditingKeyEvent(event)) {
          event.preventDefault();
          event.stopImmediatePropagation();
          this.showNoteLeaseBlockedNotice(guard.path, { structural: false });
        }
      };
      guard.blockDomEdit = blockDomEdit;
      guard.blockKeyEdit = blockKeyEdit;
      const contentDOM2 = guard.contentDOM;
      if (contentDOM2 && typeof contentDOM2.addEventListener === "function") {
        for (const eventName of ["beforeinput", "paste", "drop", "cut"]) {
          contentDOM2.addEventListener(eventName, blockDomEdit, true);
        }
        contentDOM2.addEventListener("keydown", blockKeyEdit, true);
      }
      this.noteLeaseEditorGuards.set(cm, guard);
    }
    guard.path = normalizePath(String(path || ""));
    guard.readOnly = readOnly === true;
    const contentDOM = cm.contentDOM || guard.contentDOM;
    if (contentDOM && typeof contentDOM.setAttribute === "function") {
      contentDOM.setAttribute("contenteditable", guard.readOnly ? "false" : "true");
      contentDOM.setAttribute("aria-readonly", guard.readOnly ? "true" : "false");
    }
    const editorDom = cm.dom || guard.dom;
    if (editorDom && editorDom.classList) {
      editorDom.classList.toggle("obsidian-http-sync-note-readonly", guard.readOnly);
    }
    return true;
  }
  shouldBlockEditorGuard(guard) {
    return Boolean(
      guard && guard.readOnly && guard.path && this.remoteEditorUpdateDepth <= 0 && this.isNoteLeaseReadOnly(guard.path)
    );
  }
  isEditorDispatchChangingDocument(args2) {
    const stack = Array.isArray(args2) ? args2.slice() : [args2];
    while (stack.length > 0) {
      const value = stack.shift();
      if (!value || typeof value !== "object") {
        continue;
      }
      if (Array.isArray(value)) {
        stack.push(...value);
        continue;
      }
      if (value.docChanged === true) {
        return true;
      }
      if (!Object.prototype.hasOwnProperty.call(value, "changes")) {
        continue;
      }
      const changes = value.changes;
      if (!changes) {
        continue;
      }
      if (Array.isArray(changes)) {
        if (changes.length > 0) {
          return true;
        }
        continue;
      }
      if (typeof changes === "object") {
        if (changes.empty === true) {
          continue;
        }
        if (typeof changes.iterChanges === "function") {
          let hasChanges = false;
          changes.iterChanges(() => {
            hasChanges = true;
          });
          if (hasChanges) {
            return true;
          }
          continue;
        }
        return true;
      }
      return true;
    }
    return false;
  }
  isEditingKeyEvent(event) {
    if (!event) {
      return false;
    }
    if (event.isComposing) {
      return true;
    }
    const key = String(event.key || "");
    if (key.length === 1 && !event.metaKey && !event.ctrlKey) {
      return true;
    }
    return ["Backspace", "Delete", "Enter", "Tab"].includes(key);
  }
  applyActiveNoteLeaseEditorGuard() {
    if (!this.activeNoteLease || !this.activeNoteLease.path) {
      return;
    }
    this.setOpenEditorReadOnly(
      this.activeNoteLease.path,
      this.isNoteLeaseReadOnly(this.activeNoteLease.path)
    );
  }
  showNoteLeaseBlockedNotice(path, options = {}) {
    const normalizedPath = normalizePath(String(path || ""));
    if (!this.shouldShowNoteLeaseNoticeForPath(normalizedPath)) {
      return;
    }
    const now = Date.now();
    const noticeKey = `${normalizedPath}:${options.structural === true ? "struct" : "edit"}`;
    const lastNoticeAt = Number(this.noteLeaseNoticeTimestamps.get(noticeKey) || 0);
    if (now - lastNoticeAt < NOTE_LEASE_NOTICE_INTERVAL_MS) {
      return;
    }
    this.noteLeaseNoticeTimestamps.set(noticeKey, now);
    const holders = this.activeNoteLease ? this.formatNoteLeaseHolderSummary(this.getOtherNoteLeaseHolders(this.activeNoteLease)) : "";
    const reason = this.activeNoteLease && this.activeNoteLease.readonlyReason || holders || normalizedPath;
    new Notice(
      this.t(
        options.structural === true ? "notice.noteStructuralChangeBlocked" : "notice.noteReadonly",
        { path: normalizedPath, reason }
      )
    );
  }
  showNoteNonCrdtRemotePausedNotice(path) {
    const normalizedPath = normalizePath(String(path || ""));
    if (typeof this.shouldShowNoteLeaseNoticeForPath === "function" && !this.shouldShowNoteLeaseNoticeForPath(normalizedPath)) {
      return;
    }
    const noticeKey = `${normalizedPath}:non-crdt-remote-paused`;
    const now = Date.now();
    const lastNoticeAt = Number(this.noteLeaseNoticeTimestamps.get(noticeKey) || 0);
    if (now - lastNoticeAt < NOTE_LEASE_NOTICE_INTERVAL_MS) {
      return;
    }
    this.noteLeaseNoticeTimestamps.set(noticeKey, now);
    new Notice(
      this.t("notice.noteNonCrdtRemotePaused", {
        path: normalizedPath,
        holders: this.formatNoteLeaseHolderSummary(this.getOtherNoteLeaseHolders(this.activeNoteLease))
      })
    );
  }
  async takeOverActiveNoteLock() {
    const activeFile = this.app.workspace && typeof this.app.workspace.getActiveFile === "function" ? this.app.workspace.getActiveFile() : null;
    if (!activeFile || !activeFile.path || !this.shouldTrackNoteLeaseForPath(activeFile.path)) {
      new Notice(this.t("notice.noteTakeoverUnavailable"));
      return;
    }
    const path = normalizePath(String(activeFile.path));
    const previousState = this.activeNoteLease;
    const nextState = await this.pollActiveNoteLease(activeFile, {
      force: true,
      takeover: true
    });
    if (!nextState && previousState && previousState.path === path) {
      this.activeNoteLease = previousState;
      this.applyActiveNoteLeaseEditorGuard();
      this.updateSyncStatusBarItem();
      this.updateActiveNoteTakeoverButton();
      new Notice(this.t("notice.noteTakeoverUnavailable"));
      return;
    }
    if (this.shouldUseCrdtForPath(path) && this.settings.crdtMarkdownEnabled) {
      try {
        await this.pullCrdtRemoteUpdates(path, null, { skipWriteWhenDirty: true });
      } catch (error) {
        console.warn("[obsidian-http-sync] note takeover baseline refresh failed", error);
      }
    }
    if (!this.settings.state) {
      this.settings.state = { entries: {} };
    }
    if (!this.settings.state.entries) {
      this.settings.state.entries = {};
    }
    await this.refreshBaselineEntry(this.settings.state.entries, path);
    await this.saveSettings();
    this.updateActiveNoteTakeoverButton();
    new Notice(
      this.t(
        nextState && nextState.editable !== false ? "notice.noteTakeoverDone" : "notice.noteTakeoverPending",
        { path }
      )
    );
  }
  async ensureCrdtProtocolSupported() {
    if (!this.settings.crdtMarkdownEnabled) {
      return false;
    }
    if (this.crdtProtocolSupported === true) {
      return true;
    }
    if (this.crdtProtocolSupported === false) {
      return false;
    }
    const payload = await this.requestJson("GET", "/health");
    const capabilities = payload && payload.capabilities && typeof payload.capabilities === "object" ? payload.capabilities : {};
    const supported = REQUIRED_CRDT_CAPABILITIES.every(
      (capability) => capabilities[capability] === true
    );
    this.crdtProtocolSupported = supported;
    if (!supported) {
      this.settings.lastError = this.t("error.crdtProtocolUnsupported");
      await this.saveSettings();
      if (!this.crdtProtocolUnsupportedNoticeShown) {
        this.crdtProtocolUnsupportedNoticeShown = true;
        new Notice(this.settings.lastError);
      }
    }
    return supported;
  }
  isActiveCrdtPath(path) {
    const activeFile = this.app.workspace && typeof this.app.workspace.getActiveFile === "function" ? this.app.workspace.getActiveFile() : null;
    return Boolean(
      activeFile && activeFile.path && normalizePath(String(activeFile.path)) === normalizePath(String(path || ""))
    );
  }
  shouldShowNoteLeaseNoticeForPath(path) {
    const normalizedPath = normalizePath(String(path || ""));
    return Boolean(
      normalizedPath && (this.isActiveCrdtPath(normalizedPath) || this.getOpenEditorView(normalizedPath))
    );
  }
  getCachedCrdtLease(path) {
    const normalizedPath = normalizePath(String(path || ""));
    const cached = this.crdtLeases.get(normalizedPath);
    if (!cached) {
      return null;
    }
    const expiresAtMs = Date.parse(cached.expiresAt || "");
    if (Number.isFinite(expiresAtMs) && expiresAtMs <= Date.now()) {
      this.crdtLeases.delete(normalizedPath);
      return null;
    }
    return cached;
  }
  cacheCrdtLeasePayload(path, payload) {
    const normalizedPath = normalizePath(String(path || ""));
    if (!payload || !payload.lease) {
      this.crdtLeases.delete(normalizedPath);
      return null;
    }
    const lease = payload.lease;
    const leaseEditable = payload.editable !== false;
    const readonlyReason = String(payload.readonly_reason || "");
    const cached = {
      lease,
      leaseId: lease.id || "",
      leaseToken: lease.lease_token || "",
      heldByCurrentDevice: Boolean(payload.held_by_current_device),
      heldByOtherDevice: Boolean(payload.held_by_other_device) && (!leaseEditable || readonlyReason === "held_by_other_device"),
      expiresAt: payload.expires_at || lease.expires_at || "",
      checkedAt: Date.now()
    };
    this.crdtLeases.set(normalizedPath, cached);
    return cached;
  }
  async fetchCrdtLease(path) {
    const query = new URLSearchParams();
    query.set("path", path);
    const payload = await this.requestJson(
      "GET",
      `/vaults/${this.settings.vaultId}/crdt/leases?${query.toString()}`
    );
    return this.cacheCrdtLeasePayload(path, payload);
  }
  async acquireCrdtLease(path) {
    const payload = await this.requestJson(
      "POST",
      `/vaults/${this.settings.vaultId}/crdt/leases`,
      {
        device_id: this.settings.deviceId,
        path,
        ttl_seconds: CRDT_LEASE_TTL_SECONDS
      }
    );
    return this.cacheCrdtLeasePayload(path, payload);
  }
  async releaseCrdtLease(path) {
    const normalizedPath = normalizePath(String(path || ""));
    const cached = this.getCachedCrdtLease(normalizedPath);
    if (!cached || !cached.heldByCurrentDevice || !cached.leaseId) {
      return false;
    }
    const query = new URLSearchParams();
    if (cached.leaseToken) {
      query.set("lease_token", cached.leaseToken);
    }
    const suffix = query.toString() ? `?${query.toString()}` : "";
    const payload = await this.requestJson(
      "DELETE",
      `/vaults/${this.settings.vaultId}/crdt/leases/${encodeURIComponent(
        cached.leaseId
      )}${suffix}`
    );
    if (payload && payload.released) {
      this.crdtLeases.delete(normalizedPath);
    }
    return Boolean(payload && payload.released);
  }
  async ensureActiveCrdtLease(path) {
    const normalizedPath = normalizePath(String(path || ""));
    const cached = this.getCachedCrdtLease(normalizedPath);
    if (cached) {
      if (cached.heldByOtherDevice) {
        return cached;
      }
      const expiresAtMs = Date.parse(cached.expiresAt || "");
      const shouldRenew = !cached.heldByCurrentDevice || Date.now() - Number(cached.checkedAt || 0) >= CRDT_LEASE_RENEW_INTERVAL_MS || Number.isFinite(expiresAtMs) && expiresAtMs - Date.now() < CRDT_LEASE_RENEW_INTERVAL_MS;
      if (!shouldRenew) {
        return cached;
      }
    }
    return this.acquireCrdtLease(normalizedPath);
  }
  async isCrdtLeaseHeldByOther(path) {
    const normalizedPath = normalizePath(String(path || ""));
    const cached = this.getCachedCrdtLease(normalizedPath);
    if (cached) {
      return cached.heldByOtherDevice;
    }
    const lease = await this.fetchCrdtLease(normalizedPath);
    return Boolean(lease && lease.heldByOtherDevice);
  }
  showCrdtLeasePausedNotice(path) {
    const normalizedPath = normalizePath(String(path || ""));
    const now = Date.now();
    const lastNoticeAt = Number(this.crdtLeaseNoticeTimestamps.get(normalizedPath) || 0);
    if (now - lastNoticeAt < CRDT_LEASE_NOTICE_INTERVAL_MS) {
      return;
    }
    this.crdtLeaseNoticeTimestamps.set(normalizedPath, now);
    new Notice(this.t("notice.crdtLeaseHeld"));
  }
  async ensureCrdtDoc(path) {
    const normalizedPath = normalizePath(String(path || ""));
    const existing = this.crdtDocs.get(normalizedPath);
    if (existing) {
      return existing;
    }
    const doc2 = new Y.Doc();
    const text2 = doc2.getText("markdown");
    let sequenceNumber = 0;
    while (true) {
      const updates = await this.fetchCrdtUpdates(normalizedPath, sequenceNumber);
      if (updates.length === 0) {
        break;
      }
      for (const update of updates) {
        const nextSequenceNumber = Number(update.sequence_number || 0);
        if (nextSequenceNumber <= sequenceNumber) {
          continue;
        }
        Y.applyUpdate(doc2, base64ToUint8Array(update.update_base64), "remote");
        sequenceNumber = nextSequenceNumber;
      }
      if (updates.length < 500) {
        break;
      }
    }
    if (sequenceNumber === 0) {
      const snapshot2 = await this.fetchCrdtSnapshot(normalizedPath);
      if (snapshot2 && snapshot2.text !== null && snapshot2.text !== void 0) {
        doc2.transact(() => {
          text2.insert(0, snapshot2.text);
        }, "snapshot");
        sequenceNumber = Number(snapshot2.latestSequenceNumber || 0);
      }
    }
    const state = {
      doc: doc2,
      text: text2,
      sequenceNumber
    };
    this.crdtDocs.set(normalizedPath, state);
    if (sequenceNumber > 0 && !this.isPendingLocalDeletePath(normalizedPath) && !this.isPendingRenameSourcePath(normalizedPath) && !this.isPendingRenameTargetPath(normalizedPath) && !await this.app.vault.adapter.exists(normalizedPath)) {
      await this.writeTextFile(normalizedPath, text2.toString());
    }
    return state;
  }
  async createCrdtDocAtSequence(path, targetSequenceNumber) {
    const normalizedPath = normalizePath(String(path || ""));
    const target = Math.max(0, Number(targetSequenceNumber) || 0);
    const doc2 = new Y.Doc();
    const text2 = doc2.getText("markdown");
    let sequenceNumber = 0;
    while (sequenceNumber < target) {
      const updates = await this.fetchCrdtUpdates(normalizedPath, sequenceNumber);
      if (updates.length === 0) {
        break;
      }
      for (const update of updates) {
        const nextSequenceNumber = Number(update.sequence_number || 0);
        if (nextSequenceNumber <= sequenceNumber) {
          continue;
        }
        if (nextSequenceNumber > target) {
          return { doc: doc2, text: text2, sequenceNumber };
        }
        Y.applyUpdate(doc2, base64ToUint8Array(update.update_base64), "remote");
        sequenceNumber = nextSequenceNumber;
        if (sequenceNumber >= target) {
          break;
        }
      }
      if (updates.length < 500) {
        break;
      }
    }
    return { doc: doc2, text: text2, sequenceNumber };
  }
  async fetchCrdtUpdates(path, afterSequenceNumber) {
    const query = new URLSearchParams();
    query.set("path", path);
    query.set("after_sequence_number", String(Math.max(0, Number(afterSequenceNumber) || 0)));
    query.set("limit", "500");
    const payload = await this.requestJson(
      "GET",
      `/vaults/${this.settings.vaultId}/crdt/updates?${query.toString()}`
    );
    return Array.isArray(payload.updates) ? payload.updates : [];
  }
  async fetchCrdtSnapshot(path) {
    const query = new URLSearchParams();
    query.set("path", path);
    const payload = await this.requestJson(
      "GET",
      `/vaults/${this.settings.vaultId}/crdt/snapshot?${query.toString()}`
    );
    if (!payload || !payload.snapshot) {
      return null;
    }
    return {
      latestSequenceNumber: Number(payload.snapshot.latest_sequence_number || 0),
      text: payload.materialized_content_base64 ? base64ToUtf8(payload.materialized_content_base64) : ""
    };
  }
  async publishCrdtSnapshot(path, state) {
    if (!state || Number(state.sequenceNumber || 0) <= 0) {
      return false;
    }
    const snapshotText = state.text.toString();
    try {
      const payload = await this.requestJson(
        "PUT",
        `/vaults/${this.settings.vaultId}/crdt/snapshot`,
        {
          device_id: this.settings.deviceId,
          path,
          last_applied_sequence_number: Number(state.sequenceNumber || 0),
          materialized_content_base64: utf8ToBase64(snapshotText)
        }
      );
      return Boolean(payload && payload.accepted);
    } catch (error) {
      throw error;
    }
  }
  async pushCrdtLocalFile(path, report) {
    if (this.crdtApplyingRemotePaths.has(path)) {
      return false;
    }
    if (await this.isNoteChangeBlockedByOtherLeaseFresh(path)) {
      this.showNoteLeaseBlockedNotice(path, { structural: false });
      return false;
    }
    const allRenameTargets = /* @__PURE__ */ new Set([
      ...Object.keys(this.settings.pendingRenameHints || {}),
      ...Object.keys(this.renameHints || {})
    ]);
    if (allRenameTargets.has(path)) {
      return false;
    }
    if (this.shouldUseCrdtLeases() && await this.isCrdtLeaseHeldByOther(path)) {
      if (this.isActiveCrdtPath(path)) {
        this.showCrdtLeasePausedNotice(path);
      }
      return false;
    }
    if (!await this.app.vault.adapter.exists(path)) {
      return false;
    }
    const storedCrdtState = this.getCrdtFileState(path);
    const storedSequenceNumber = Math.max(
      0,
      Number(storedCrdtState && storedCrdtState.sequenceNumber) || 0
    );
    const hasPendingLocalEdit = Boolean(storedCrdtState && storedCrdtState.dirty);
    if (hasPendingLocalEdit) {
      const shouldHoldEditLeaseForPath = this.isActiveCrdtPath(path) || Boolean(this.getOpenEditorView(path));
      if (shouldHoldEditLeaseForPath) {
        const lease = await this.ensureActiveCrdtLease(path);
        if (lease && lease.heldByOtherDevice) {
          this.showCrdtLeasePausedNotice(path);
          return false;
        }
      }
    }
    const state = await this.ensureCrdtDoc(path);
    const localText = await this.readTextFile(path);
    const previousText = state.text.toString();
    const remoteAdvancedSinceLastStore = storedSequenceNumber < Number(state.sequenceNumber || 0);
    const shouldAttemptPush = Number(state.sequenceNumber || 0) === 0 || hasPendingLocalEdit || localText !== previousText && !remoteAdvancedSinceLastStore;
    if (!shouldAttemptPush) {
      if (storedSequenceNumber !== Number(state.sequenceNumber || 0)) {
        this.setCrdtSequenceNumber(path, state.sequenceNumber);
        await this.saveSettings();
      }
      return false;
    }
    if (localText === previousText) {
      if (state.sequenceNumber !== 0) {
        this.setCrdtSequenceNumber(path, state.sequenceNumber);
        this.setCrdtDirty(path, false);
        await this.saveSettings();
        return false;
      }
      const baseSequenceNumber2 = state.sequenceNumber;
      const updateBytes2 = Y.encodeStateAsUpdate(state.doc);
      const clientUpdateId2 = generateClientOperationId();
      let payload2;
      try {
        payload2 = await this.requestJson(
          "POST",
          `/vaults/${this.settings.vaultId}/crdt/updates`,
          {
            device_id: this.settings.deviceId,
            path,
            client_update_id: clientUpdateId2,
            base_sequence_number: baseSequenceNumber2,
            update_base64: uint8ArrayToBase64(updateBytes2),
            materialized_content_base64: utf8ToBase64(localText)
          }
        );
      } catch (error) {
        throw error;
      }
      const sequenceNumber2 = Number(
        payload2 && payload2.update ? payload2.update.sequence_number : 0
      );
      if (sequenceNumber2 > state.sequenceNumber && sequenceNumber2 <= baseSequenceNumber2 + 1) {
        state.sequenceNumber = sequenceNumber2;
        this.setCrdtSequenceNumber(path, sequenceNumber2);
        this.setCrdtDirty(path, false);
        await this.saveSettings();
      }
      if (report) {
        report.crdtPushed = Number(report.crdtPushed || 0) + 1;
      }
      return true;
    }
    const localUpdates = [];
    const updateHandler = (update) => {
      localUpdates.push(update);
    };
    state.doc.on("update", updateHandler);
    try {
      state.doc.transact(() => {
        applyTextDiff(state.text, previousText, localText);
      }, "local");
    } finally {
      state.doc.off("update", updateHandler);
    }
    if (localUpdates.length === 0) {
      this.setCrdtSequenceNumber(path, state.sequenceNumber);
      this.setCrdtDirty(path, false);
      await this.saveSettings();
      return false;
    }
    const baseSequenceNumber = state.sequenceNumber;
    const updateBytes = localUpdates.length === 1 ? localUpdates[0] : Y.mergeUpdates(localUpdates);
    const clientUpdateId = generateClientOperationId();
    const materializedText = state.text.toString();
    let payload;
    try {
      payload = await this.requestJson(
        "POST",
        `/vaults/${this.settings.vaultId}/crdt/updates`,
        {
          device_id: this.settings.deviceId,
          path,
          client_update_id: clientUpdateId,
          base_sequence_number: baseSequenceNumber,
          update_base64: uint8ArrayToBase64(updateBytes),
          materialized_content_base64: utf8ToBase64(materializedText)
        }
      );
    } catch (error) {
      throw error;
    }
    const sequenceNumber = Number(
      payload && payload.update ? payload.update.sequence_number : 0
    );
    if (sequenceNumber > state.sequenceNumber && sequenceNumber <= baseSequenceNumber + 1) {
      state.sequenceNumber = sequenceNumber;
      this.setCrdtSequenceNumber(path, sequenceNumber);
      this.setCrdtDirty(path, false);
      await this.saveSettings();
    }
    if (report) {
      report.crdtPushed = Number(report.crdtPushed || 0) + 1;
    }
    return true;
  }
  async pushStaleCrdtLocalFile(path, baseSequenceNumber, localText, latestState, report) {
    const baseState = await this.createCrdtDocAtSequence(path, baseSequenceNumber);
    if (Number(baseState.sequenceNumber || 0) !== Number(baseSequenceNumber || 0)) {
      await this.captureConflictCopy(path);
      if (latestState && Number(latestState.sequenceNumber || 0) > 0) {
        this.setCrdtSequenceNumber(path, latestState.sequenceNumber);
      }
      if (report) {
        report.conflicts = Number(report.conflicts || 0) + 1;
      }
      await this.saveSettings();
      return false;
    }
    const baseText = baseState.text.toString();
    if (localText === baseText) {
      await this.writeLatestCrdtStateToFile(path, latestState);
      await this.saveSettings();
      return false;
    }
    const localUpdates = [];
    const updateHandler = (update) => {
      localUpdates.push(update);
    };
    baseState.doc.on("update", updateHandler);
    try {
      baseState.doc.transact(() => {
        applyTextDiff(baseState.text, baseText, localText);
      }, "local");
    } finally {
      baseState.doc.off("update", updateHandler);
    }
    if (localUpdates.length === 0) {
      return false;
    }
    const updateBytes = localUpdates.length === 1 ? localUpdates[0] : Y.mergeUpdates(localUpdates);
    await this.requestJson(
      "POST",
      `/vaults/${this.settings.vaultId}/crdt/updates`,
      {
        device_id: this.settings.deviceId,
        path,
        client_update_id: generateClientOperationId(),
        base_sequence_number: baseSequenceNumber,
        update_base64: uint8ArrayToBase64(updateBytes),
        materialized_content_base64: utf8ToBase64(localText)
      }
    );
    if (report) {
      report.crdtPushed = Number(report.crdtPushed || 0) + 1;
    }
    return true;
  }
  async pullCrdtRemoteUpdates(path, report, options = {}) {
    const state = await this.ensureCrdtDoc(path);
    let pulledCount = 0;
    while (true) {
      const updates = await this.fetchCrdtUpdates(path, state.sequenceNumber);
      if (updates.length === 0) {
        break;
      }
      for (const update of updates) {
        const nextSequenceNumber = Number(update.sequence_number || 0);
        if (nextSequenceNumber <= state.sequenceNumber) {
          continue;
        }
        Y.applyUpdate(state.doc, base64ToUint8Array(update.update_base64), "remote");
        state.sequenceNumber = nextSequenceNumber;
        pulledCount += 1;
      }
      if (updates.length < 500) {
        break;
      }
    }
    if (pulledCount === 0) {
      return 0;
    }
    this.setCrdtSequenceNumber(path, state.sequenceNumber);
    const nextText = state.text.toString();
    const shouldSkipWrite = options.skipWriteWhenDirty === true && this.isCrdtDirty(path);
    if (!shouldSkipWrite) {
      await this.writeTextFileIfChanged(path, nextText);
    }
    await this.saveSettings();
    if (report) {
      report.crdtPulled = Number(report.crdtPulled || 0) + pulledCount;
    }
    return pulledCount;
  }
  setCrdtSequenceNumber(path, sequenceNumber) {
    if (!this.settings.crdtState) {
      this.settings.crdtState = { files: {} };
    }
    if (!this.settings.crdtState.files) {
      this.settings.crdtState.files = {};
    }
    const previousState = this.settings.crdtState.files[path] || {};
    this.settings.crdtState.files[path] = {
      sequenceNumber: Math.max(0, Number(sequenceNumber) || 0),
      dirty: previousState.dirty === true
    };
  }
  setCrdtDirty(path, dirty) {
    if (!this.settings.crdtState) {
      this.settings.crdtState = { files: {} };
    }
    if (!this.settings.crdtState.files) {
      this.settings.crdtState.files = {};
    }
    const normalizedPath = normalizePath(String(path || ""));
    const previousState = this.settings.crdtState.files[normalizedPath] || {};
    this.settings.crdtState.files[normalizedPath] = {
      sequenceNumber: Math.max(0, Number(previousState.sequenceNumber) || 0),
      dirty: dirty === true
    };
  }
  isCrdtDirty(path) {
    const fileState = this.getCrdtFileState(path);
    return Boolean(fileState && fileState.dirty);
  }
  getCrdtFileState(path) {
    return this.settings && this.settings.crdtState && this.settings.crdtState.files ? this.settings.crdtState.files[path] || null : null;
  }
  async writeLatestCrdtStateToFile(path, state) {
    if (!state) {
      return;
    }
    await this.writeTextFileIfChanged(path, state.text.toString());
    this.setCrdtSequenceNumber(path, state.sequenceNumber);
  }
  async writeTextFileIfChanged(path, nextText) {
    const currentText = await this.app.vault.adapter.exists(path) ? await this.readTextFile(path) : null;
    if (currentText === nextText) {
      return;
    }
    this.crdtApplyingRemotePaths.add(path);
    try {
      await this.writeTextFile(path, nextText);
    } finally {
      this.crdtApplyingRemotePaths.delete(path);
    }
  }
  async readTextFile(path) {
    const editorText = this.getOpenEditorText(path);
    if (editorText !== null) {
      return editorText;
    }
    return this.app.vault.adapter.read(path);
  }
  async writeTextFile(path, text2) {
    this.markSuppressedPath(path);
    await this.ensureParentDirectories(path);
    await this.app.vault.adapter.write(path, text2);
  }
  async scanVault(previousEntries) {
    const snapshot2 = {};
    await this.scanDirectory("", previousEntries, snapshot2);
    return snapshot2;
  }
  async scanDirectory(directoryPath, previousEntries, snapshot2) {
    const listing = await this.app.vault.adapter.list(directoryPath);
    for (const folderPath of listing.folders.slice().sort()) {
      const normalizedPath = normalizePath(folderPath);
      if (this.isPathIgnoredByPattern(normalizedPath) || isConflictArtifactPath(normalizedPath)) {
        continue;
      }
      const inSyncScope = this.isPathInSyncScope(normalizedPath);
      const syncScopeAncestor = this.isPathAncestorOfSyncScope(normalizedPath);
      if (!inSyncScope && !syncScopeAncestor) {
        continue;
      }
      const stat = await this.app.vault.adapter.stat(normalizedPath);
      if (inSyncScope) {
        snapshot2[normalizedPath] = {
          entryType: "directory",
          contentHash: null,
          sizeBytes: 0,
          mtimeMs: stat && typeof stat.mtime === "number" ? stat.mtime : null
        };
      }
      await this.scanDirectory(normalizedPath, previousEntries, snapshot2);
    }
    for (const filePath of listing.files.slice().sort()) {
      const normalizedPath = normalizePath(filePath);
      if (this.shouldIgnorePath(normalizedPath)) {
        continue;
      }
      const entry = await this.readCurrentEntry(
        normalizedPath,
        previousEntries[normalizedPath]
      );
      if (entry) {
        snapshot2[normalizedPath] = entry;
      }
    }
  }
  async readCurrentEntry(path, previousEntry) {
    const normalizedPath = normalizePath(path);
    if (this.shouldIgnorePath(normalizedPath)) {
      return null;
    }
    const stat = await this.app.vault.adapter.stat(normalizedPath);
    if (!stat) {
      return null;
    }
    const abstractFile = this.app.vault.getAbstractFileByPath(normalizedPath);
    if (abstractFile instanceof TFolder || stat.type === "folder") {
      return {
        entryType: "directory",
        contentHash: null,
        sizeBytes: 0,
        mtimeMs: typeof stat.mtime === "number" ? stat.mtime : null
      };
    }
    if (!(abstractFile instanceof TFile) && stat.type === "folder") {
      return {
        entryType: "directory",
        contentHash: null,
        sizeBytes: 0,
        mtimeMs: typeof stat.mtime === "number" ? stat.mtime : null
      };
    }
    const openEditorBinary = this.getOpenEditorBinary(normalizedPath);
    const sizeBytes = openEditorBinary !== null ? openEditorBinary.byteLength : Number(stat.size || 0);
    const mtimeMs = openEditorBinary !== null ? Date.now() : typeof stat.mtime === "number" ? stat.mtime : null;
    if (openEditorBinary === null && previousEntry && previousEntry.entryType === "file" && previousEntry.sizeBytes === sizeBytes && previousEntry.mtimeMs === mtimeMs && previousEntry.contentHash) {
      return {
        entryType: "file",
        contentHash: previousEntry.contentHash,
        sizeBytes,
        mtimeMs
      };
    }
    const binaryPayload = openEditorBinary !== null ? openEditorBinary : await this.app.vault.adapter.readBinary(normalizedPath);
    return {
      entryType: "file",
      contentHash: await hashBinary(binaryPayload),
      sizeBytes,
      mtimeMs
    };
  }
  async hasUnsyncedLocalChange(path, baselineEntries) {
    const baselineEntry = baselineEntries[path] || null;
    const currentEntry = await this.readCurrentEntry(path, baselineEntry);
    if (!baselineEntry) {
      return currentEntry !== null;
    }
    if (!currentEntry) {
      return true;
    }
    return !sameSyncIdentity(baselineEntry, currentEntry);
  }
  async refreshBaselineEntry(baselineEntries, path) {
    const currentEntry = await this.readCurrentEntry(path, baselineEntries[path]);
    if (currentEntry) {
      baselineEntries[path] = currentEntry;
    } else {
      delete baselineEntries[path];
    }
  }
  async captureConflictCopy(path) {
    const stat = await this.app.vault.adapter.stat(path);
    if (!stat) {
      return;
    }
    const conflictPath = buildConflictPath(path);
    this.markSuppressedPath(conflictPath);
    if (stat.type === "folder") {
      await this.copyDirectoryRecursive(path, conflictPath);
      return;
    }
    const binaryPayload = await this.readFileBinary(path);
    await this.writeBinaryFile(conflictPath, binaryPayload);
  }
  getOpenEditorView(path) {
    const normalizedPath = normalizePath(String(path || ""));
    if (!normalizedPath || !this.app || !this.app.workspace) {
      return null;
    }
    const markdownLeaves = typeof this.app.workspace.getLeavesOfType === "function" ? this.app.workspace.getLeavesOfType("markdown") : [];
    if (!Array.isArray(markdownLeaves) || markdownLeaves.length === 0) {
      return null;
    }
    for (const leaf of markdownLeaves) {
      const view = leaf && leaf.view ? leaf.view : null;
      if (!(view instanceof MarkdownView)) {
        continue;
      }
      if (!view.file || normalizePath(String(view.file.path || "")) !== normalizedPath) {
        continue;
      }
      return view;
    }
    return null;
  }
  getOpenMarkdownLeavesForPath(path) {
    const normalizedPath = normalizePath(String(path || ""));
    if (!normalizedPath || !this.app || !this.app.workspace) {
      return [];
    }
    const markdownLeaves = typeof this.app.workspace.getLeavesOfType === "function" ? this.app.workspace.getLeavesOfType("markdown") : [];
    if (!Array.isArray(markdownLeaves) || markdownLeaves.length === 0) {
      return [];
    }
    const matchingLeaves = [];
    for (const leaf of markdownLeaves) {
      const view = leaf && leaf.view ? leaf.view : null;
      if (!(view instanceof MarkdownView)) {
        continue;
      }
      if (!view.file || normalizePath(String(view.file.path || "")) !== normalizedPath) {
        continue;
      }
      matchingLeaves.push({ leaf, view });
    }
    return matchingLeaves;
  }
  getOpenEditorText(path) {
    const openView = this.getOpenEditorView(path);
    if (!openView || !openView.editor || typeof openView.editor.getValue !== "function") {
      return null;
    }
    return String(openView.editor.getValue());
  }
  getOpenEditorBinary(path) {
    const editorText = this.getOpenEditorText(path);
    if (editorText === null) {
      return null;
    }
    return new TextEncoder().encode(editorText);
  }
  async readFileBinary(path) {
    const openEditorBinary = this.getOpenEditorBinary(path);
    if (openEditorBinary !== null) {
      return openEditorBinary;
    }
    return this.app.vault.adapter.readBinary(path);
  }
  async copyDirectoryRecursive(sourcePath, targetPath) {
    await this.ensureDirectory(targetPath);
    const listing = await this.app.vault.adapter.list(sourcePath);
    for (const folderPath of listing.folders.slice().sort()) {
      const folderName = folderPath.split("/").pop();
      await this.copyDirectoryRecursive(folderPath, `${targetPath}/${folderName}`);
    }
    for (const filePath of listing.files.slice().sort()) {
      const fileName = filePath.split("/").pop();
      const binaryPayload = await this.app.vault.adapter.readBinary(filePath);
      await this.writeBinaryFile(`${targetPath}/${fileName}`, binaryPayload);
    }
  }
  async writeBinaryFile(path, payload) {
    this.markSuppressedPath?.(path);
    await this.ensureParentDirectories(path);
    await this.app.vault.adapter.writeBinary(path, toArrayBuffer(payload));
    this.applyOpenEditorBinaryPayload(path, payload);
  }
  applyOpenEditorBinaryPayload(path, payload) {
    const normalizedPath = normalizePath(String(path || ""));
    if (!this.isMarkdownNotePath(normalizedPath)) {
      return false;
    }
    const openView = this.getOpenEditorView(normalizedPath);
    const editor = openView && openView.editor ? openView.editor : null;
    if (!editor || typeof editor.setValue !== "function") {
      return false;
    }
    let text2;
    try {
      text2 = decodeUtf82(payload);
    } catch (error) {
      console.warn("[obsidian-http-sync] unable to decode open editor payload", error);
      return false;
    }
    if (typeof editor.getValue === "function" && String(editor.getValue()) === text2) {
      return false;
    }
    let cursor = null;
    try {
      cursor = typeof editor.getCursor === "function" ? editor.getCursor() : null;
    } catch (error) {
      cursor = null;
    }
    const restoreReadOnly = this.isNoteLeaseReadOnly(normalizedPath);
    this.remoteEditorUpdateDepth += 1;
    try {
      if (restoreReadOnly) {
        this.setOpenEditorReadOnly(normalizedPath, false);
      }
      this.markSuppressedPath(normalizedPath);
      editor.setValue(text2);
      if (cursor && typeof editor.setCursor === "function") {
        try {
          editor.setCursor(cursor);
        } catch (error) {
        }
      }
    } finally {
      if (restoreReadOnly) {
        this.setOpenEditorReadOnly(normalizedPath, true);
      }
      this.remoteEditorUpdateDepth = Math.max(0, this.remoteEditorUpdateDepth - 1);
    }
    return true;
  }
  async renameVaultPath(path, targetPath) {
    const sourcePath = normalizePath(String(path || ""));
    const normalizedTargetPath = normalizePath(String(targetPath || ""));
    const abstractFile = this.app.vault && typeof this.app.vault.getAbstractFileByPath === "function" ? this.app.vault.getAbstractFileByPath(sourcePath) : null;
    if (abstractFile && this.app.fileManager && typeof this.app.fileManager.renameFile === "function") {
      this.markSuppressedPath?.(sourcePath);
      this.markSuppressedPath?.(normalizedTargetPath);
      await this.app.fileManager.renameFile(abstractFile, normalizedTargetPath);
      return;
    }
    if (abstractFile && this.app.vault && typeof this.app.vault.rename === "function") {
      this.markSuppressedPath?.(sourcePath);
      this.markSuppressedPath?.(normalizedTargetPath);
      await this.app.vault.rename(abstractFile, normalizedTargetPath);
      return;
    }
    this.markSuppressedPath?.(sourcePath);
    this.markSuppressedPath?.(normalizedTargetPath);
    await this.app.vault.adapter.rename(sourcePath, normalizedTargetPath);
  }
  updateActiveNoteLeasePathAfterRemoteMove(path, targetPath) {
    const sourcePath = normalizePath(String(path || ""));
    const normalizedTargetPath = normalizePath(String(targetPath || ""));
    if (!sourcePath || !normalizedTargetPath || !this.activeNoteLease || this.activeNoteLease.path !== sourcePath) {
      return false;
    }
    this.setOpenEditorReadOnly(sourcePath, false);
    this.activeNoteLease = {
      ...this.activeNoteLease,
      path: normalizedTargetPath
    };
    if (this.isMarkdownNotePath(normalizedTargetPath)) {
      this.setOpenEditorReadOnly(
        normalizedTargetPath,
        this.isResolvedNoteLeaseReadOnly(this.activeNoteLease)
      );
    }
    return true;
  }
  async reopenRemoteMovedMarkdownLeaves(movedMarkdownLeaves, targetPath) {
    if (!Array.isArray(movedMarkdownLeaves) || movedMarkdownLeaves.length === 0) {
      return false;
    }
    const normalizedTargetPath = normalizePath(String(targetPath || ""));
    if (!this.isMarkdownNotePath(normalizedTargetPath)) {
      return false;
    }
    const targetFile = this.app.vault && typeof this.app.vault.getAbstractFileByPath === "function" ? this.app.vault.getAbstractFileByPath(normalizedTargetPath) : null;
    if (!(targetFile instanceof TFile)) {
      return false;
    }
    let reopened = false;
    for (const entry of movedMarkdownLeaves) {
      const leaf = entry && entry.leaf ? entry.leaf : null;
      if (!leaf || typeof leaf.openFile !== "function") {
        continue;
      }
      try {
        await leaf.openFile(targetFile);
        reopened = true;
      } catch (error) {
        console.warn("[obsidian-http-sync] unable to reopen moved markdown leaf", error);
      }
    }
    if (reopened && this.isNoteLeaseReadOnly(normalizedTargetPath)) {
      this.setOpenEditorReadOnly(normalizedTargetPath, true);
    }
    return reopened;
  }
  async ensureDirectory(path) {
    if (await this.app.vault.adapter.exists(path)) {
      return;
    }
    await this.ensureParentDirectories(path);
    try {
      this.markSuppressedPath?.(path);
      await this.app.vault.adapter.mkdir(path);
    } catch (error) {
      if (!isAlreadyExistsError(error)) {
        throw error;
      }
    }
  }
  async ensureParentDirectories(path) {
    const normalizedPath = normalizePath(path);
    const segments = normalizedPath.split("/");
    segments.pop();
    let currentPath = "";
    for (const segment of segments) {
      currentPath = currentPath ? `${currentPath}/${segment}` : segment;
      if (!currentPath) {
        continue;
      }
      if (!await this.app.vault.adapter.exists(currentPath)) {
        try {
          this.markSuppressedPath?.(currentPath);
          await this.app.vault.adapter.mkdir(currentPath);
        } catch (error) {
          if (!isAlreadyExistsError(error)) {
            throw error;
          }
        }
      }
    }
  }
  async removePath(path) {
    const stat = await this.app.vault.adapter.stat(path);
    if (!stat) {
      return;
    }
    this.markSuppressedPath?.(path);
    if (stat.type === "folder") {
      await this.app.vault.adapter.rmdir(path, true);
      return;
    }
    await this.app.vault.adapter.remove(path);
  }
  shouldIgnorePath(path) {
    const normalizedPath = normalizePath(path);
    if (isConflictArtifactPath(normalizedPath)) {
      return true;
    }
    if (!this.isPathInSyncScope(normalizedPath)) {
      return true;
    }
    return this.isPathIgnoredByPattern(normalizedPath);
  }
  shouldUseCrdtForPath(path) {
    if (!this.settings.crdtMarkdownEnabled) {
      return false;
    }
    const normalizedPath = normalizePath(String(path || ""));
    if (!normalizedPath || !normalizedPath.toLowerCase().endsWith(".md")) {
      return false;
    }
    if (isRootObsidianConfigPath(normalizedPath)) {
      return false;
    }
    if (isConflictArtifactPath(normalizedPath) || this.isPathIgnoredByPattern(normalizedPath)) {
      return false;
    }
    return this.isPathInSyncScope(normalizedPath);
  }
  isPathIgnoredByPattern(path) {
    const normalizedPath = normalizePath(path);
    if (isNestedObsidianConfigPath(normalizedPath)) {
      return true;
    }
    if (isRootObsidianConfigPath(normalizedPath)) {
      if (this.settings.syncObsidianConfig !== true) {
        return true;
      }
      if (isAlwaysLocalObsidianConfigPath(normalizedPath)) {
        return true;
      }
    } else if (hasIgnoredPathSegment(normalizedPath, DEFAULT_IGNORE_PATH_SEGMENTS)) {
      return true;
    }
    const ignorePaths = Array.isArray(this.settings.ignorePaths) ? this.settings.ignorePaths : DEFAULT_IGNORE_PATHS;
    return ignorePaths.some((pattern) => {
      const normalizedPattern = String(pattern || "").replace(/\\/g, "/").replace(/^\.?\//, "");
      if (!normalizedPattern) {
        return false;
      }
      if (this.settings.syncObsidianConfig === true && normalizedPattern === `${OBSIDIAN_CONFIG_DIR}/`) {
        return false;
      }
      if (normalizedPattern.endsWith("/")) {
        const prefix = normalizedPattern.slice(0, -1);
        return normalizedPath === prefix || normalizedPath.startsWith(`${prefix}/`);
      }
      return normalizedPath === normalizedPattern;
    });
  }
  getSyncFolderPaths() {
    return normalizeSyncFolderPathList(this.settings.syncFolderPaths);
  }
  isPathInSyncScope(path) {
    const normalizedPath = normalizePluginPath(path);
    const syncFolders = this.getSyncFolderPaths();
    if (syncFolders.includes("")) {
      return true;
    }
    return syncFolders.some(
      (folderPath) => normalizedPath === folderPath || normalizedPath.startsWith(`${folderPath}/`)
    );
  }
  isPathAncestorOfSyncScope(path) {
    const normalizedPath = normalizePluginPath(path);
    if (!normalizedPath) {
      return true;
    }
    const syncFolders = this.getSyncFolderPaths();
    if (syncFolders.includes("")) {
      return true;
    }
    return syncFolders.some((folderPath) => folderPath.startsWith(`${normalizedPath}/`));
  }
  partitionDirectoryDeletes(directoryDeletes, moves) {
    const sourcePrefixes = /* @__PURE__ */ new Set();
    for (const move of moves) {
      const normalizedPath = normalizePath(move.path);
      const segments = normalizedPath.split("/").filter(Boolean);
      segments.pop();
      let currentPath = "";
      for (const segment of segments) {
        currentPath = currentPath ? `${currentPath}/${segment}` : segment;
        sourcePrefixes.add(currentPath);
      }
    }
    const beforeMoves = [];
    const afterMoves = [];
    for (const path of directoryDeletes) {
      if (sourcePrefixes.has(normalizePath(path))) {
        afterMoves.push(path);
      } else {
        beforeMoves.push(path);
      }
    }
    return { beforeMoves, afterMoves };
  }
  markSuppressedPath(path) {
    const normalizedPath = String(path || "").trim() ? normalizePath(path) : "";
    if (!normalizedPath) {
      return;
    }
    const expiresAt = Date.now() + SUPPRESSED_EVENT_TTL_MS;
    const segments = normalizedPath.split("/").filter(Boolean);
    let currentPath = "";
    for (const segment of segments) {
      currentPath = currentPath ? `${currentPath}/${segment}` : segment;
      this.suppressedPaths.set(currentPath, expiresAt);
    }
  }
  shouldSuppressEventPath(path) {
    const normalizedPath = String(path || "").trim() ? normalizePath(path) : "";
    if (!normalizedPath) {
      return false;
    }
    const now = Date.now();
    for (const [suppressedPath, expiresAt] of Array.from(this.suppressedPaths.entries())) {
      if (expiresAt <= now) {
        this.suppressedPaths.delete(suppressedPath);
        continue;
      }
      if (normalizedPath === suppressedPath || normalizedPath.startsWith(`${suppressedPath}/`) || suppressedPath.startsWith(`${normalizedPath}/`)) {
        return true;
      }
    }
    return false;
  }
  async requestJson(method, path, jsonBody = null, binaryBody = null, headers = {}) {
    const response = await this.request(method, path, jsonBody, binaryBody, headers);
    if (response.contentType !== "application/json") {
      throw new Error(this.t("error.expectedJson"));
    }
    return response.body;
  }
  async requestBinary(method, path, headers = {}) {
    const response = await this.request(method, path, null, null, headers, {
      responseType: "binary"
    });
    return response.body;
  }
  async request(method, path, jsonBody = null, binaryBody = null, headers = {}, options = {}) {
    const requestHeaders = { ...headers };
    if (!requestHeaders.Authorization && this.settings.accessToken) {
      requestHeaders.Authorization = `Bearer ${this.settings.accessToken}`;
    }
    let body = void 0;
    if (jsonBody !== null) {
      body = JSON.stringify(jsonBody);
      requestHeaders["Content-Type"] = requestHeaders["Content-Type"] || "application/json";
    } else if (binaryBody !== null) {
      body = binaryBody;
      requestHeaders["Content-Type"] = requestHeaders["Content-Type"] || "application/octet-stream";
    }
    const baseUrl = String(this.settings.baseUrl || "").replace(/\/+$/, "");
    const performRequest = async (resolvedHeaders) => performObsidianRequest({
      url: `${baseUrl}${path}`,
      method,
      headers: { ...resolvedHeaders },
      body
    });
    let response = await performRequest(requestHeaders);
    let refreshAttempted = false;
    if (response.status === 401 && path !== "/auth/refresh" && this.settings.refreshToken) {
      refreshAttempted = true;
      const refreshed = await this.tryRefreshAuthSession(baseUrl);
      if (refreshed) {
        const retryHeaders = { ...requestHeaders };
        if (this.settings.accessToken) {
          retryHeaders.Authorization = `Bearer ${this.settings.accessToken}`;
        }
        response = await performRequest(retryHeaders);
      }
    }
    const contentTypeHeader = getResponseHeader(response.headers, "content-type") || "";
    const declaredContentType = contentTypeHeader.split(";")[0].trim() || "application/octet-stream";
    const parsedResponse = options.responseType === "binary" && isSuccessfulStatus(response.status) ? {
      contentType: "application/octet-stream",
      payload: getBinaryResponsePayload(response)
    } : parseResponsePayload(response, declaredContentType);
    const contentType = parsedResponse.contentType;
    const payload = parsedResponse.payload;
    if (!isSuccessfulStatus(response.status)) {
      const errorMessage = contentType === "application/json" && payload && payload.error === "sync_blocked_billing" ? buildSyncBlockedBillingMessage(this, payload) : contentType === "application/json" && payload && payload.user_message ? String(payload.user_message) : contentType === "application/json" && payload && payload.message ? payload.message : `HTTP ${response.status}`;
      const error = new Error(
        errorMessage
      );
      error.statusCode = response.status;
      error.payload = contentType === "application/json" ? payload : {};
      if (refreshAttempted) {
        error._refreshAttempted = true;
      }
      throw error;
    }
    return {
      statusCode: response.status,
      contentType,
      body: payload,
      headers: response.headers
    };
  }
  async tryRefreshAuthSession(baseUrl) {
    const refreshToken = String(this.settings.refreshToken || "").trim();
    if (!refreshToken) {
      this.settings.authState = {
        status: AUTH_STATUS.MISSING_TOKEN,
        reason: SYNC_BLOCK_REASON.MISSING_TOKEN,
        lastChecked: (/* @__PURE__ */ new Date()).toISOString()
      };
      this.settings.syncBlockReason = SYNC_BLOCK_REASON.MISSING_TOKEN;
      this.saveSettings().catch(() => {
      });
      return false;
    }
    try {
      const response = await performObsidianRequest({
        url: `${baseUrl}/auth/refresh`,
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh_token: refreshToken })
      });
      if (!isSuccessfulStatus(response.status)) {
        this.settings.authState = {
          status: AUTH_STATUS.SESSION_EXPIRED,
          reason: SYNC_BLOCK_REASON.SESSION_EXPIRED,
          lastChecked: (/* @__PURE__ */ new Date()).toISOString()
        };
        this.settings.syncBlockReason = SYNC_BLOCK_REASON.SESSION_EXPIRED;
        this.saveSettings().catch(() => {
        });
        return false;
      }
      const payload = response.json !== void 0 ? response.json : response.text ? JSON.parse(response.text) : {};
      if (!payload || !payload.access_token || !payload.refresh_token) {
        this.settings.authState = {
          status: AUTH_STATUS.REFRESH_FAILED,
          reason: SYNC_BLOCK_REASON.REFRESH_FAILED,
          lastChecked: (/* @__PURE__ */ new Date()).toISOString()
        };
        this.settings.syncBlockReason = SYNC_BLOCK_REASON.REFRESH_FAILED;
        this.saveSettings().catch(() => {
        });
        return false;
      }
      this.settings.accessToken = payload.access_token;
      this.settings.refreshToken = payload.refresh_token;
      this.settings.authState = {
        status: AUTH_STATUS.AUTHENTICATED,
        reason: "",
        lastChecked: (/* @__PURE__ */ new Date()).toISOString()
      };
      this.settings.syncBlockReason = SYNC_BLOCK_REASON.NONE;
      this.settings.collaborationBlockReason = COLLABORATION_BLOCK_REASON.NONE;
      await this.saveSettings();
      return true;
    } catch (_) {
      this.settings.authState = {
        status: AUTH_STATUS.REFRESH_FAILED,
        reason: SYNC_BLOCK_REASON.REFRESH_FAILED,
        lastChecked: (/* @__PURE__ */ new Date()).toISOString()
      };
      this.settings.syncBlockReason = SYNC_BLOCK_REASON.REFRESH_FAILED;
      this.saveSettings().catch(() => {
      });
      return false;
    }
  }
  async fetchConflicts() {
    if (!this.isConfigured()) {
      return [];
    }
    const response = await this.request(
      "GET",
      `/vaults/${encodeURIComponent(this.settings.vaultId)}/conflicts?status=open&limit=${CONFLICT_FETCH_LIMIT}`
    );
    const body = response.body;
    if (body && Array.isArray(body.conflicts)) {
      return body.conflicts;
    }
    if (Array.isArray(body)) {
      return body;
    }
    return [];
  }
  async syncConflictState() {
    const previousConflicts = this.settings.conflicts || {};
    const previousItems = previousConflicts.items || {};
    try {
      const conflicts = await this.fetchConflicts();
      const openConflicts = conflicts.filter(
        (c) => c && c.status === "open"
      );
      const nextItems = {};
      for (const conflict of openConflicts) {
        if (conflict && conflict.id) {
          const previousItem = previousItems[conflict.id] || {};
          nextItems[conflict.id] = {
            id: conflict.id,
            path: conflict.path || "",
            target_path: conflict.target_path || "",
            entry_type: conflict.entry_type || "",
            operation_type: conflict.operation_type || "",
            reason: conflict.reason || "",
            status: conflict.status || "open",
            created_at: conflict.created_at || "",
            device_id: conflict.device_id || "",
            expected_content_hash: conflict.expected_content_hash !== null && conflict.expected_content_hash !== void 0 ? String(conflict.expected_content_hash) : null,
            actual_content_hash: conflict.actual_content_hash !== null && conflict.actual_content_hash !== void 0 ? String(conflict.actual_content_hash) : null,
            resolved_at: conflict.resolved_at || "",
            resolution: conflict.resolution || "",
            resolved_by_device_id: conflict.resolved_by_device_id || "",
            materialized_remote_path: previousItem.materialized_remote_path || "",
            materialized_remote_content_hash: previousItem.materialized_remote_content_hash || ""
          };
        }
      }
      const nextConflictState = {
        items: nextItems,
        lastFetchedAt: (/* @__PURE__ */ new Date()).toISOString(),
        lastError: ""
      };
      const shouldSave = JSON.stringify(previousItems) !== JSON.stringify(nextItems) || previousConflicts.lastError !== "";
      this.settings.conflicts = nextConflictState;
      if (shouldSave) {
        await this.saveSettings();
      }
      return openConflicts;
    } catch (error) {
      const nextLastError = error && error.message ? error.message : String(error);
      this.settings.conflicts = {
        items: previousItems,
        lastFetchedAt: previousConflicts.lastFetchedAt || null,
        lastError: nextLastError
      };
      if (previousConflicts.lastError !== nextLastError) {
        await this.saveSettings();
      }
      throw error;
    }
  }
  getCachedOpenConflicts() {
    return Object.values(this.settings.conflicts && this.settings.conflicts.items || {}).filter(
      (conflict) => conflict && conflict.status === "open"
    );
  }
  isConflictResolutionSupported(conflict) {
    if (!conflict || conflict.status !== "open") {
      return false;
    }
    const entryType = String(conflict.entry_type || "file");
    const operationType = String(conflict.operation_type || "");
    if (entryType !== "file") {
      return false;
    }
    if (operationType === "upsert") {
      return !this.shouldUseCrdtForPath(conflict.path || "") || this.isHashMismatchConflict(conflict) || this.isMissingBaseConflict(conflict);
    }
    return operationType === "delete" && this.isHashMismatchConflict(conflict);
  }
  isHashMismatchConflict(conflict) {
    return String(conflict && conflict.reason ? conflict.reason : "") === "base_content_hash_mismatch";
  }
  isMissingBaseConflict(conflict) {
    return String(conflict && conflict.reason ? conflict.reason : "") === "missing_base_for_existing_path";
  }
  isMoveTargetOccupiedConflict(conflict) {
    return conflict && conflict.status === "open" && String(conflict.entry_type || "file") === "file" && String(conflict.operation_type || "") === "move" && String(conflict.reason || "") === "target_path_occupied" && Boolean(conflict.path) && Boolean(conflict.target_path);
  }
  isDeleteHashMismatchConflict(conflict) {
    return this.isHashMismatchConflict(conflict) && String(conflict && conflict.entry_type ? conflict.entry_type : "file") === "file" && String(conflict && conflict.operation_type ? conflict.operation_type : "") === "delete";
  }
  assertConflictResolutionSupported(conflict) {
    if (this.isConflictResolutionSupported(conflict)) {
      return;
    }
    throw new Error(
      this.t("error.unsupportedConflictResolution", {
        entryType: String(conflict && conflict.entry_type ? conflict.entry_type : "unknown"),
        operationType: String(
          conflict && conflict.operation_type ? conflict.operation_type : "unknown"
        )
      })
    );
  }
  getOpenConflictCount() {
    const items = this.settings.conflicts && this.settings.conflicts.items ? this.settings.conflicts.items : {};
    return Object.keys(items).length;
  }
  async resolveConflict(conflictOrId, resolution) {
    const conflict = conflictOrId && typeof conflictOrId === "object" ? conflictOrId : null;
    const conflictId = String(conflict ? conflict.id || "" : conflictOrId || "").trim();
    if (!conflictId) {
      throw new Error("Conflict has no id");
    }
    const body = {
      resolved_by_device_id: this.settings.deviceId,
      resolution
    };
    const paths = [];
    const vaultId = String(this.settings.vaultId || "").trim();
    if (vaultId) {
      paths.push(
        `/vaults/${encodeURIComponent(vaultId)}/conflicts/${encodeURIComponent(conflictId)}/resolve`
      );
    }
    paths.push(`/conflicts/${encodeURIComponent(conflictId)}/resolve`);
    let notFoundError = null;
    for (const path of paths) {
      try {
        const payload = await this.requestJson("POST", path, body);
        return payload && payload.conflict ? payload.conflict : null;
      } catch (error) {
        if (Number(error && error.statusCode) === 404) {
          notFoundError = error;
          continue;
        }
        throw error;
      }
    }
    if (conflict) {
      const refreshedConflict = await this.findMatchingOpenConflict(conflict);
      if (!refreshedConflict) {
        return {
          ...conflict,
          status: "resolved",
          resolution,
          resolved_by_device_id: this.settings.deviceId || ""
        };
      }
      if (refreshedConflict.id && refreshedConflict.id !== conflictId) {
        return this.resolveConflict(refreshedConflict, resolution);
      }
    }
    throw notFoundError || new Error("HTTP 404");
  }
  async finalizeConflictResolution(conflict, resolution) {
    const resolvedConflict = await this.resolveConflict(conflict, resolution);
    const conflictId = String(conflict && conflict.id ? conflict.id : "").trim();
    if (conflictId && this.settings.conflicts && this.settings.conflicts.items) {
      delete this.settings.conflicts.items[conflictId];
      this.settings.conflicts.lastError = "";
      this.settings.conflicts.lastFetchedAt = (/* @__PURE__ */ new Date()).toISOString();
    }
    try {
      await this.syncConflictState();
    } catch (error) {
      console.warn(
        "[obsidian-http-sync] conflict resolved but refresh failed",
        error
      );
    }
    await this.saveSettings();
    return resolvedConflict;
  }
  async findMatchingOpenConflict(conflict) {
    const conflicts = await this.syncConflictState();
    return conflicts.find((candidate) => this.isSameConflictIdentity(candidate, conflict)) || null;
  }
  isSameConflictIdentity(left, right) {
    if (!left || !right) {
      return false;
    }
    if (left.id && right.id && left.id === right.id) {
      return true;
    }
    return normalizePath(String(left.path || "")) === normalizePath(String(right.path || "")) && String(left.target_path || "") === String(right.target_path || "") && String(left.operation_type || "") === String(right.operation_type || "") && String(left.entry_type || "file") === String(right.entry_type || "file") && String(left.reason || "") === String(right.reason || "");
  }
  async fetchRemoteFileEntry(path) {
    const normalizedPath = normalizePath(path);
    if (!normalizedPath) {
      return null;
    }
    try {
      const historyPayload = await this.requestJson(
        "GET",
        `/vaults/${this.settings.vaultId}/file-history?path=${encodeURIComponent(normalizedPath)}&limit=1`
      );
      const versions = Array.isArray(historyPayload.versions) ? historyPayload.versions : [];
      const latestVersion = versions[0] || null;
      if (latestVersion) {
        return {
          path: normalizedPath,
          entry_type: String(latestVersion.entry_type || "file"),
          current_content_hash: latestVersion.content_hash !== null && latestVersion.content_hash !== void 0 ? String(latestVersion.content_hash) : null,
          current_size_bytes: Number(latestVersion.size_bytes || 0),
          is_deleted: Boolean(latestVersion.is_deleted) || String(latestVersion.operation_type || "") === "delete",
          latest_version_number: Number(
            latestVersion.version_number || latestVersion.sequence_number || 0
          )
        };
      }
    } catch (error) {
      if (Number(error && error.statusCode) !== 404) {
        throw error;
      }
    }
    const payload = await this.requestJson(
      "GET",
      `/vaults/${this.settings.vaultId}/files?include_deleted=false&limit=1000`
    );
    const files = Array.isArray(payload.files) ? payload.files : [];
    const currentEntry = files.find(
      (entry) => normalizePath(String(entry.path || "")) === normalizedPath
    );
    if (!currentEntry) {
      return null;
    }
    return {
      path: normalizedPath,
      entry_type: String(currentEntry.entry_type || "file"),
      current_content_hash: currentEntry.current_content_hash !== null && currentEntry.current_content_hash !== void 0 ? String(currentEntry.current_content_hash) : null,
      current_size_bytes: Number(currentEntry.current_size_bytes || 0),
      is_deleted: Boolean(currentEntry.is_deleted),
      latest_version_number: Number(currentEntry.latest_version_number || 0)
    };
  }
  async getConflictRemoteEntry(conflict) {
    const path = conflict && conflict.path ? normalizePath(conflict.path) : "";
    if (!path) {
      return null;
    }
    try {
      const remoteEntry = await this.fetchRemoteFileEntry(path);
      if (remoteEntry) {
        return remoteEntry;
      }
    } catch (error) {
      if (Number(error && error.statusCode) !== 404) {
        throw error;
      }
    }
    const actualContentHash = conflict && conflict.actual_content_hash !== null && conflict.actual_content_hash !== void 0 ? String(conflict.actual_content_hash || "").trim() : "";
    if (!actualContentHash) {
      return null;
    }
    return {
      path,
      entry_type: String(conflict && conflict.entry_type || "file"),
      current_content_hash: actualContentHash,
      current_size_bytes: 0,
      is_deleted: false,
      latest_version_number: Number(
        conflict && conflict.actual_sequence_number || 0
      )
    };
  }
  async downloadConflictRemoteContent(conflict, remoteEntry) {
    try {
      return await this.downloadRemoteContent(remoteEntry.current_content_hash);
    } catch (error) {
      if (!isMissingRemoteObjectContentError(error)) {
        throw error;
      }
      const path = String(conflict && conflict.path || "");
      const useLocal = typeof confirm === "function" && confirm(this.t("confirm.remoteConflictContentMissingUseLocal", { path }));
      if (!useLocal) {
        throw new Error(
          this.t("error.remoteConflictContentMissing", { path })
        );
      }
      await this.resolveKeepLocal(conflict);
      return null;
    }
  }
  async downloadRemoteContent(contentHash) {
    const requestedContentHash = String(contentHash || "").trim();
    try {
      return await this.requestBinary(
        "GET",
        `/vaults/${this.settings.vaultId}/objects/${requestedContentHash}/content`
      );
    } catch (error) {
      const normalizedContentHash = normalizeContentHashForCompare(requestedContentHash);
      if (isMissingRemoteObjectContentError(error) && normalizedContentHash && normalizedContentHash !== requestedContentHash) {
        return this.requestBinary(
          "GET",
          `/vaults/${this.settings.vaultId}/objects/${normalizedContentHash}/content`
        );
      }
      throw error;
    }
  }
  async downloadRemoteContentForSync(contentHash, context, path = null, report = null) {
    try {
      return await this.downloadRemoteContent(contentHash);
    } catch (error) {
      if (isMissingRemoteObjectContentError(error)) {
        const pathSuffix = path ? ` for ${path}` : "";
        console.warn(
          `[obsidian-http-sync] missing remote object content${pathSuffix} during ${context}: ${contentHash}`,
          error
        );
        if (report && typeof report === "object") {
          report.missingRemoteObjectContent = Number(report.missingRemoteObjectContent || 0) + 1;
          if (!report.divergenceWarning) {
            report.divergenceWarning = "missing_remote_object_content";
          }
        }
        return null;
      }
      throw error;
    }
  }
  async resolveKeepLocal(conflict) {
    if (typeof this.isMoveTargetOccupiedConflict === "function" && this.isMoveTargetOccupiedConflict(conflict)) {
      return this.resolveKeepLocalMoveTargetOccupied(conflict);
    }
    this.assertConflictResolutionSupported(conflict);
    if (this.isDeleteHashMismatchConflict(conflict)) {
      return this.resolveKeepLocalDeleteHashMismatch(conflict);
    }
    const path = conflict.path;
    if (!path) {
      throw new Error("Conflict has no path");
    }
    if (!await this.app.vault.adapter.exists(path)) {
      return this.resolveKeepLocalDeleteHashMismatch(conflict);
    }
    const remoteEntry = await this.fetchRemoteFileEntry(path);
    const binaryPayload = await this.readFileBinary(path);
    const localContentHash = await hashBinary(binaryPayload);
    const localSizeBytes = binaryPayload.byteLength || binaryPayload.length || 0;
    if (remoteEntry && !remoteEntry.is_deleted && remoteEntry.current_content_hash === localContentHash && Number(remoteEntry.current_size_bytes || 0) === localSizeBytes) {
      if (this.settings.state && this.settings.state.entries) {
        this.settings.state.entries[path] = {
          entryType: "file",
          contentHash: localContentHash,
          sizeBytes: localSizeBytes,
          mtimeMs: Date.now()
        };
      }
      await this.finalizeConflictResolution(conflict, "keep_local");
      return true;
    }
    const sessionPayload = await this.requestJson("POST", "/sync-sessions", {
      vault_id: this.settings.vaultId,
      device_id: this.settings.deviceId,
      direction: "bidirectional"
    });
    const sessionId = sessionPayload.sync_session.id;
    try {
      const uploadPayload = await this.requestJson(
        "POST",
        `/sync-sessions/${sessionId}/objects`,
        null,
        toArrayBuffer(binaryPayload),
        { "Content-Type": "application/octet-stream" }
      );
      const previousSize = remoteEntry && !remoteEntry.is_deleted ? Number(remoteEntry.current_size_bytes || 0) : 0;
      const baseContentHash = remoteEntry && !remoteEntry.is_deleted ? remoteEntry.current_content_hash || null : null;
      await this.recordGuardedOperation(
        sessionId,
        {
          client_operation_id: generateClientOperationId(),
          operation_type: "upsert",
          entry_type: "file",
          path,
          storage_delta_bytes: localSizeBytes - previousSize,
          content_hash: uploadPayload.object.content_hash,
          base_content_hash: baseContentHash
        },
        this.createSyncReport(),
        {
          operationSource: "conflict_resolution",
          manualOverride: true,
          allowedPaths: [path]
        }
      );
      await this.requestJson("PATCH", `/sync-sessions/${sessionId}`, {
        status: "completed"
      });
      if (this.settings.state && this.settings.state.entries) {
        this.settings.state.entries[path] = {
          entryType: "file",
          contentHash: uploadPayload.object.content_hash,
          sizeBytes: localSizeBytes,
          mtimeMs: Date.now()
        };
      }
      await this.finalizeConflictResolution(conflict, "keep_local");
      return true;
    } catch (error) {
      try {
        await this.requestJson("PATCH", `/sync-sessions/${sessionId}`, {
          status: "cancelled",
          error_message: String(error.message || "").slice(0, 500)
        });
      } catch (_e) {
      }
      throw error;
    }
  }
  async resolveKeepLocalDeleteHashMismatch(conflict) {
    const path = conflict.path;
    if (!path) {
      throw new Error("Conflict has no path");
    }
    const remoteEntry = await this.fetchRemoteFileEntry(path);
    if (remoteEntry && !remoteEntry.is_deleted && remoteEntry.current_content_hash) {
      const sessionPayload = await this.requestJson("POST", "/sync-sessions", {
        vault_id: this.settings.vaultId,
        device_id: this.settings.deviceId,
        direction: "bidirectional"
      });
      const sessionId = sessionPayload.sync_session.id;
      try {
        await this.recordGuardedOperation(
          sessionId,
          {
            client_operation_id: generateClientOperationId(),
            operation_type: "delete",
            entry_type: "file",
            path,
            storage_delta_bytes: -Number(remoteEntry.current_size_bytes || 0),
            base_content_hash: remoteEntry.current_content_hash || null
          },
          this.createSyncReport(),
          {
            operationSource: "conflict_resolution",
            manualOverride: true,
            allowedPaths: [path]
          }
        );
        await this.requestJson("PATCH", `/sync-sessions/${sessionId}`, {
          status: "completed"
        });
      } catch (error) {
        try {
          await this.requestJson("PATCH", `/sync-sessions/${sessionId}`, {
            status: "cancelled",
            error_message: String(error.message || "").slice(0, 500)
          });
        } catch (_e) {
        }
        throw error;
      }
    }
    if (await this.app.vault.adapter.exists(path)) {
      this.markSuppressedPath(path);
      await this.removePath(path);
    }
    if (this.settings.state && this.settings.state.entries) {
      delete this.settings.state.entries[path];
    }
    await this.finalizeConflictResolution(conflict, "keep_local");
    return true;
  }
  async resolveKeepLocalMoveTargetOccupied(conflict) {
    const sourcePath = conflict.path;
    const targetPath = conflict.target_path;
    if (!sourcePath || !targetPath) {
      throw new Error("Conflict has no path");
    }
    if (!await this.app.vault.adapter.exists(targetPath)) {
      throw new Error(this.t("error.localFileNotFound", { path: targetPath }));
    }
    const remoteTargetEntry = await this.fetchRemoteFileEntry(targetPath);
    const remoteSourceEntry = await this.fetchRemoteFileEntry(sourcePath);
    const binaryPayload = await this.readFileBinary(targetPath);
    const localContentHash = await hashBinary(binaryPayload);
    const localSizeBytes = binaryPayload.byteLength || binaryPayload.length || 0;
    const sessionPayload = await this.requestJson("POST", "/sync-sessions", {
      vault_id: this.settings.vaultId,
      device_id: this.settings.deviceId,
      direction: "bidirectional"
    });
    const sessionId = sessionPayload.sync_session.id;
    try {
      if (!remoteTargetEntry || remoteTargetEntry.is_deleted || remoteTargetEntry.current_content_hash !== localContentHash || Number(remoteTargetEntry.current_size_bytes || 0) !== localSizeBytes) {
        const uploadPayload = await this.requestJson(
          "POST",
          `/sync-sessions/${sessionId}/objects`,
          null,
          toArrayBuffer(binaryPayload),
          { "Content-Type": "application/octet-stream" }
        );
        const previousSize = remoteTargetEntry && !remoteTargetEntry.is_deleted ? Number(remoteTargetEntry.current_size_bytes || 0) : 0;
        await this.recordGuardedOperation(
          sessionId,
          {
            client_operation_id: generateClientOperationId(),
            operation_type: "upsert",
            entry_type: "file",
            path: targetPath,
            storage_delta_bytes: localSizeBytes - previousSize,
            content_hash: uploadPayload.object.content_hash,
            base_content_hash: remoteTargetEntry && !remoteTargetEntry.is_deleted ? remoteTargetEntry.current_content_hash || null : null
          },
          this.createSyncReport(),
          {
            operationSource: "conflict_resolution",
            manualOverride: true,
            allowedPaths: [sourcePath, targetPath]
          }
        );
      }
      if (sourcePath !== targetPath && remoteSourceEntry && !remoteSourceEntry.is_deleted && remoteSourceEntry.current_content_hash) {
        await this.recordGuardedOperation(
          sessionId,
          {
            client_operation_id: generateClientOperationId(),
            operation_type: "delete",
            entry_type: "file",
            path: sourcePath,
            storage_delta_bytes: -Number(remoteSourceEntry.current_size_bytes || 0),
            base_content_hash: remoteSourceEntry.current_content_hash || null
          },
          this.createSyncReport(),
          {
            operationSource: "conflict_resolution",
            manualOverride: true,
            allowedPaths: [sourcePath, targetPath]
          }
        );
      }
      await this.requestJson("PATCH", `/sync-sessions/${sessionId}`, {
        status: "completed"
      });
    } catch (error) {
      try {
        await this.requestJson("PATCH", `/sync-sessions/${sessionId}`, {
          status: "cancelled",
          error_message: String(error.message || "").slice(0, 500)
        });
      } catch (_e) {
      }
      throw error;
    }
    if (this.settings.state && this.settings.state.entries) {
      this.settings.state.entries[targetPath] = {
        entryType: "file",
        contentHash: localContentHash,
        sizeBytes: localSizeBytes,
        mtimeMs: Date.now()
      };
      delete this.settings.state.entries[sourcePath];
    }
    this.clearPendingDeletePath(targetPath);
    this.clearPendingRenameHintForPath(targetPath);
    await this.finalizeConflictResolution(conflict, "keep_local");
    return true;
  }
  async resolveAcceptRemote(conflict) {
    this.assertConflictResolutionSupported(conflict);
    const path = conflict.path;
    if (!path) {
      throw new Error("Conflict has no path");
    }
    const remoteEntry = await this.getConflictRemoteEntry(conflict);
    if (!remoteEntry || remoteEntry.is_deleted || !remoteEntry.current_content_hash) {
      if (await this.app.vault.adapter.exists(path)) {
        await this.captureConflictCopy(path);
        this.markSuppressedPath(path);
        await this.removePath(path);
      }
      if (this.settings.state && this.settings.state.entries) {
        delete this.settings.state.entries[path];
      }
      await this.finalizeConflictResolution(conflict, "accept_remote");
      return true;
    }
    const localExists = await this.app.vault.adapter.exists(path);
    if (localExists) {
      await this.captureConflictCopy(path);
    }
    const binaryResponse = await this.downloadConflictRemoteContent(
      conflict,
      remoteEntry
    );
    if (binaryResponse === null) {
      return true;
    }
    this.markSuppressedPath(path);
    await this.writeBinaryFile(path, binaryResponse);
    if (this.settings.state && this.settings.state.entries) {
      this.settings.state.entries[path] = {
        entryType: "file",
        contentHash: remoteEntry.current_content_hash,
        sizeBytes: binaryResponse.byteLength || binaryResponse.length || Number(remoteEntry.current_size_bytes || 0),
        mtimeMs: Date.now()
      };
    }
    await this.finalizeConflictResolution(conflict, "accept_remote");
    return true;
  }
  async resolveKeepBoth(conflict) {
    this.assertConflictResolutionSupported(conflict);
    const path = conflict.path;
    if (!path) {
      throw new Error("Conflict has no path");
    }
    if (await this.app.vault.adapter.exists(path)) {
      await this.captureConflictCopy(path);
    }
    const remoteEntry = await this.getConflictRemoteEntry(conflict);
    if (remoteEntry && !remoteEntry.is_deleted && remoteEntry.current_content_hash) {
      const binaryResponse = await this.downloadConflictRemoteContent(
        conflict,
        remoteEntry
      );
      if (binaryResponse === null) {
        return true;
      }
      this.markSuppressedPath(path);
      await this.writeBinaryFile(path, binaryResponse);
      if (this.settings.state && this.settings.state.entries) {
        this.settings.state.entries[path] = {
          entryType: "file",
          contentHash: remoteEntry.current_content_hash,
          sizeBytes: binaryResponse.byteLength || binaryResponse.length || Number(remoteEntry.current_size_bytes || 0),
          mtimeMs: Date.now()
        };
      }
    } else {
      if (await this.app.vault.adapter.exists(path)) {
        this.markSuppressedPath(path);
        await this.removePath(path);
      }
      if (this.settings.state && this.settings.state.entries) {
        delete this.settings.state.entries[path];
      }
    }
    await this.finalizeConflictResolution(conflict, "keep_both");
    return true;
  }
  async materializeRemoteVersion(conflict) {
    this.assertConflictResolutionSupported(conflict);
    const path = conflict && conflict.path ? conflict.path : "";
    if (!path) {
      throw new Error("Path is required for remote materialization");
    }
    const remoteEntry = await this.getConflictRemoteEntry(conflict);
    if (!remoteEntry || remoteEntry.is_deleted || !remoteEntry.current_content_hash) {
      throw new Error(
        this.t("error.remoteFileNotAvailable", { path })
      );
    }
    const binaryResponse = await this.downloadRemoteContent(
      remoteEntry.current_content_hash
    );
    const conflictId = String(conflict.id || "");
    const cachedConflict = conflictId && this.settings.conflicts && this.settings.conflicts.items ? this.settings.conflicts.items[conflictId] || null : null;
    const cachedMaterializedPath = cachedConflict && cachedConflict.materialized_remote_path ? String(cachedConflict.materialized_remote_path) : "";
    if (cachedMaterializedPath && cachedConflict.materialized_remote_content_hash === remoteEntry.current_content_hash && await this.app.vault.adapter.exists(cachedMaterializedPath)) {
      return cachedMaterializedPath;
    }
    const normalizedPath = String(path).replace(/\\/g, "/").replace(/^\/+/, "");
    const lastSlashIndex = normalizedPath.lastIndexOf("/");
    const baseName = lastSlashIndex >= 0 ? normalizedPath.slice(lastSlashIndex + 1) : normalizedPath;
    const parentPath = lastSlashIndex >= 0 ? normalizedPath.slice(0, lastSlashIndex) : "";
    const materializeRoot = ".sync-conflict-local/remote-copies";
    const hashSuffix = String(remoteEntry.current_content_hash || "").replace(/[^a-zA-Z0-9_-]/g, "").slice(-12) || "remote";
    const materializeName = `${baseName}.remote-${hashSuffix}`;
    const materializePath = parentPath ? `${materializeRoot}/${conflictId || "unknown-conflict"}/${parentPath}/${materializeName}` : `${materializeRoot}/${conflictId || "unknown-conflict"}/${materializeName}`;
    this.markSuppressedPath(materializePath);
    await this.writeBinaryFile(materializePath, binaryResponse);
    if (conflictId && this.settings.conflicts && this.settings.conflicts.items) {
      this.settings.conflicts.items[conflictId] = {
        ...this.settings.conflicts.items[conflictId] || {},
        materialized_remote_path: materializePath,
        materialized_remote_content_hash: remoteEntry.current_content_hash
      };
      await this.saveSettings();
    }
    return materializePath;
  }
  getCurrentPluginVersion() {
    const manifestVersion = this.manifest && this.manifest.version ? String(this.manifest.version).trim() : "";
    return manifestVersion || PLUGIN_VERSION;
  }
  getCurrentPluginBuildId() {
    return PLUGIN_BUILD_ID;
  }
  getPluginInstallDir() {
    const manifestDir = this.manifest && this.manifest.dir ? normalizePath(String(this.manifest.dir)) : "";
    const configDir = this.app && this.app.vault && this.app.vault.configDir ? normalizePath(String(this.app.vault.configDir)) : ".obsidian";
    const pluginId = this.manifest && this.manifest.id ? String(this.manifest.id) : PLUGIN_ID;
    if (manifestDir) {
      const cleanManifestDir = manifestDir.replace(/\/+$/, "");
      if (cleanManifestDir === pluginId || !cleanManifestDir.includes("/")) {
        return normalizePath(`${configDir}/plugins/${cleanManifestDir}`).replace(/\/+$/, "");
      }
      if (cleanManifestDir.startsWith("plugins/")) {
        return normalizePath(`${configDir}/${cleanManifestDir}`).replace(/\/+$/, "");
      }
      return cleanManifestDir;
    }
    return normalizePath(`${configDir}/plugins/${pluginId}`);
  }
  applyInstalledPluginManifest(manifest) {
    if (!manifest || String(manifest.id || "").trim() !== PLUGIN_ID) {
      return false;
    }
    const metadataFields = [
      "name",
      "version",
      "minAppVersion",
      "description",
      "author",
      "authorUrl",
      "fundingUrl",
      "isDesktopOnly"
    ];
    const applyMetadata = (target) => {
      if (!target) {
        return;
      }
      for (const field of metadataFields) {
        if (Object.prototype.hasOwnProperty.call(manifest, field)) {
          target[field] = manifest[field];
        }
      }
    };
    applyMetadata(this.manifest);
    const registeredManifest = this.app && this.app.plugins && this.app.plugins.manifests && this.app.plugins.manifests[PLUGIN_ID] ? this.app.plugins.manifests[PLUGIN_ID] : null;
    if (registeredManifest !== this.manifest) {
      applyMetadata(registeredManifest);
    }
    return true;
  }
  async refreshInstalledPluginManifest() {
    const pluginDir = this.getPluginInstallDir();
    const manifestPath = normalizePath(`${pluginDir}/manifest.json`);
    try {
      const manifestSource = await this.app.vault.adapter.read(manifestPath);
      const manifest = JSON.parse(String(manifestSource || ""));
      return this.applyInstalledPluginManifest(manifest) ? manifest : null;
    } catch (error) {
      console.warn(
        "[obsidian-http-sync] unable to refresh installed plugin manifest",
        manifestPath,
        error
      );
      return null;
    }
  }
  getPluginUpdateBaseUrls() {
    const configuredBaseUrl = String(
      this.settings.baseUrl || DEFAULT_SETTINGS.baseUrl || ""
    ).trim().replace(/\/+$/, "");
    const baseUrls = [];
    const addBaseUrl = (url) => {
      const normalizedUrl = String(url || "").trim().replace(/\/+$/, "");
      if (normalizedUrl && !baseUrls.some(
        (existingUrl) => existingUrl.toLowerCase() === normalizedUrl.toLowerCase()
      )) {
        baseUrls.push(normalizedUrl);
      }
    };
    addBaseUrl(configuredBaseUrl);
    addBaseUrl(PLUGIN_UPDATE_PUBLIC_BASE_URL);
    if (baseUrls.length === 0) {
      throw new Error(this.t("error.updateServerRequired"));
    }
    return baseUrls;
  }
  async downloadPluginUpdateArchive() {
    const baseUrls = this.getPluginUpdateBaseUrls();
    const downloadPaths = [
      PLUGIN_UPDATE_LATEST_ARCHIVE_PATH,
      PLUGIN_UPDATE_FALLBACK_ARCHIVE_PATH
    ];
    let lastError = null;
    for (const baseUrl of baseUrls) {
      for (const archivePath of downloadPaths) {
        let response;
        try {
          response = await performObsidianRequest({
            url: `${baseUrl}${archivePath}`,
            method: "GET",
            headers: {
              "Cache-Control": "no-cache",
              "Pragma": "no-cache"
            }
          });
        } catch (error2) {
          lastError = error2;
          continue;
        }
        if (isSuccessfulStatus(response.status)) {
          return {
            baseUrl,
            archivePath,
            archiveBytes: getBinaryResponsePayload(response)
          };
        }
        const error = new Error(`HTTP ${response.status}`);
        error.statusCode = response.status;
        lastError = error;
      }
    }
    throw lastError || new Error("Plugin update archive not found");
  }
  async loadPluginUpdatePackage() {
    const downloaded = await this.downloadPluginUpdateArchive();
    const files = await readPluginZipFiles(
      downloaded.archiveBytes,
      PLUGIN_UPDATE_FILES
    );
    for (const fileName of PLUGIN_UPDATE_FILES) {
      if (!files.has(fileName)) {
        throw new Error(
          this.t("error.pluginArchiveMissingFile", { fileName })
        );
      }
    }
    let manifest;
    try {
      manifest = JSON.parse(decodeUtf82(files.get("manifest.json")));
    } catch (error) {
      throw new Error(this.t("error.pluginManifestInvalid"));
    }
    const latestVersion = String(manifest && manifest.version ? manifest.version : "").trim();
    if (!latestVersion) {
      throw new Error(this.t("error.pluginManifestInvalid"));
    }
    return {
      ...downloaded,
      files,
      manifest,
      latestVersion
    };
  }
  async readInstalledPluginFileHash(fileName) {
    const pluginDir = this.getPluginInstallDir();
    const path = normalizePath(`${pluginDir}/${fileName}`);
    try {
      const exists = this.app && this.app.vault && this.app.vault.adapter && typeof this.app.vault.adapter.exists === "function" ? await this.app.vault.adapter.exists(path) : true;
      if (exists === false) {
        return "";
      }
      const payload = await this.app.vault.adapter.readBinary(path);
      return await hashBinary(payload);
    } catch (error) {
      console.warn("[obsidian-http-sync] unable to hash installed plugin file", path, error);
      return "";
    }
  }
  async checkForPluginUpdate() {
    const updatePackage = await this.loadPluginUpdatePackage();
    const currentVersion = this.getCurrentPluginVersion();
    const files = {};
    let hasDifferentFiles = false;
    for (const fileName of PLUGIN_UPDATE_FILES) {
      const remoteHash = await hashBinary(updatePackage.files.get(fileName));
      const installedHash = await this.readInstalledPluginFileHash(fileName);
      const differs = !installedHash || installedHash !== remoteHash;
      files[fileName] = {
        installedHash,
        remoteHash,
        differs
      };
      if (differs) {
        hasDifferentFiles = true;
      }
    }
    const versionComparison = comparePluginVersions(
      updatePackage.latestVersion,
      currentVersion
    );
    const remoteSupportsSelfUpdate = pluginArchiveSupportsSelfUpdate(
      updatePackage.files.get("main.js")
    );
    const currentBuildId = this.getCurrentPluginBuildId();
    const remoteBuildId = extractPluginBuildId(updatePackage.files.get("main.js"));
    const buildComparison = comparePluginBuildIds(remoteBuildId, currentBuildId);
    const hasNewerSameVersionBuild = versionComparison === 0 && hasDifferentFiles && remoteSupportsSelfUpdate && buildComparison > 0;
    return {
      currentVersion,
      currentBuildId,
      latestVersion: updatePackage.latestVersion,
      remoteBuildId,
      archivePath: updatePackage.archivePath,
      updateAvailable: versionComparison > 0 || hasNewerSameVersionBuild,
      hasDifferentFiles,
      hasNewerSameVersionBuild,
      remoteSupportsSelfUpdate,
      versionComparison,
      buildComparison,
      files
    };
  }
  async installPluginUpdate() {
    const updatePackage = await this.loadPluginUpdatePackage();
    for (const fileName of PLUGIN_UPDATE_WRITE_ORDER) {
      await this.writePluginUpdateFile(fileName, updatePackage.files.get(fileName));
    }
    this.applyInstalledPluginManifest(updatePackage.manifest);
    return {
      latestVersion: updatePackage.latestVersion,
      archivePath: updatePackage.archivePath
    };
  }
  async writePluginUpdateFile(fileName, payload) {
    if (!PLUGIN_UPDATE_FILES.includes(fileName)) {
      throw new Error(`Unsupported plugin update file: ${fileName}`);
    }
    const pluginDir = this.getPluginInstallDir();
    if (!pluginDir) {
      throw new Error(this.t("error.pluginDirectoryUnavailable"));
    }
    await this.writeBinaryFile(normalizePath(`${pluginDir}/${fileName}`), payload);
  }
};
function isSuccessfulStatus(statusCode) {
  return Number(statusCode) >= 200 && Number(statusCode) < 300;
}
function parseResponsePayload(response, declaredContentType) {
  const responseText = typeof response.text === "string" ? response.text : "";
  const trimmedText = responseText.trim();
  const hasJsonPayload = response.json !== void 0;
  const looksLikeJson = trimmedText.startsWith("{") || trimmedText.startsWith("[");
  if (declaredContentType === "application/json" || hasJsonPayload || looksLikeJson) {
    if (hasJsonPayload) {
      return {
        contentType: "application/json",
        payload: response.json
      };
    }
    try {
      return {
        contentType: "application/json",
        payload: trimmedText ? JSON.parse(trimmedText) : {}
      };
    } catch (error) {
      if (declaredContentType === "application/json") {
        throw error;
      }
    }
  }
  return {
    contentType: declaredContentType,
    payload: new Uint8Array(response.arrayBuffer || new ArrayBuffer(0))
  };
}
function getBinaryResponsePayload(response) {
  if (response.arrayBuffer !== void 0) {
    return new Uint8Array(response.arrayBuffer || new ArrayBuffer(0));
  }
  if (typeof response.text === "string") {
    return encodeUtf82(response.text);
  }
  return new Uint8Array(new ArrayBuffer(0));
}
function encodeUtf82(text2) {
  if (typeof TextEncoder !== "undefined") {
    return new TextEncoder().encode(String(text2 || ""));
  }
  throw new Error("UTF-8 encoder is not available");
}
function decodeUtf82(binaryPayload) {
  const arrayBuffer = toArrayBuffer(binaryPayload);
  if (typeof TextDecoder !== "undefined") {
    return new TextDecoder("utf-8").decode(arrayBuffer);
  }
  throw new Error("UTF-8 decoder is not available");
}
async function performObsidianRequest(options) {
  try {
    return await requestUrl(options);
  } catch (error) {
    const normalizedResponse = normalizeFailedRequestResponse(error);
    if (normalizedResponse) {
      return normalizedResponse;
    }
    throw error;
  }
}
function normalizeFailedRequestResponse(error) {
  if (!error || typeof error !== "object") {
    return null;
  }
  const response = error.response && typeof error.response === "object" ? error.response : null;
  const status = Number(
    error.status ?? error.statusCode ?? (response ? response.status ?? response.statusCode : void 0)
  );
  if (!Number.isFinite(status) || status <= 0) {
    return null;
  }
  return {
    status,
    headers: error.headers || (response ? response.headers : {}) || {},
    json: error.json !== void 0 ? error.json : response && response.json !== void 0 ? response.json : void 0,
    text: error.text !== void 0 ? error.text : response && response.text !== void 0 ? response.text : void 0,
    arrayBuffer: error.arrayBuffer !== void 0 ? error.arrayBuffer : response && response.arrayBuffer !== void 0 ? response.arrayBuffer : void 0
  };
}
function getResponseHeader(headers, name) {
  if (!headers || !name) {
    return "";
  }
  const targetName = String(name).toLowerCase();
  for (const [headerName, value] of Object.entries(headers)) {
    if (String(headerName).toLowerCase() === targetName) {
      return String(value || "");
    }
  }
  return "";
}
var UI_LOCALES = {
  en: {
    "button.completeLogin": "Complete login",
    "button.connectSharedVaultHere": "Connect here",
    "button.connectThisLocalVault": "Connect this local vault",
    "button.checkUpdates": "Check updates",
    "button.createLinkCode": "Create link code",
    "button.grantAccess": "Create invite",
    "button.loadVaults": "Scan vaults",
    "button.publishCurrentVault": "Create vault",
    "button.refresh": "Refresh",
    "button.refreshAccount": "Refresh account",
    "button.register": "Register",
    "button.remove": "Remove",
    "button.requestCode": "Request code",
    "button.reconnectThisLocalVault": "Reconnect this local vault",
    "button.resetLocalState": "Reset local state",
    "button.revoke": "Revoke",
    "button.saveFolderSelection": "Save folders",
    "button.syncNow": "Sync now",
    "button.syncProgress": "Syncing {{completed}}/{{total}}",
    "button.takeoverActiveNoteEdit": "Take over editing",
    "button.updatePlugin": "Update",
    "command.registerDevice": "Register current Obsidian app as sync device",
    "command.resetLocalState": "Reset local sync state",
    "command.syncNow": "HTTP Sync Now",
    "command.syncVaultNow": "Sync vault now",
    "command.takeoverActiveNoteLock": "Take over active note lock",
    "dropdown.loadVaultsFirst": "Scan vaults first",
    "dropdown.selectVault": "Select vault",
    "error.accessTokenRequired": "Access token is required",
    "error.backendAndEmailRequired": "Backend URL and user email are required",
    "error.crdtProtocolUnsupported": "Server is too old for safe collaborative Markdown sync. Update the backend before editing shared notes.",
    "error.deviceRegistrationNeedsAccount": "Backend URL and user email must be filled before device registration",
    "error.expectedBinary": "Expected binary response",
    "error.expectedJson": "Expected JSON response",
    "error.loginCodeRequired": "Backend URL, user email and login code are required",
    "error.pluginArchiveMissingFile": "Plugin archive is missing {{fileName}}",
    "error.pluginDirectoryUnavailable": "Plugin install directory is unavailable",
    "error.pluginManifestInvalid": "Downloaded plugin manifest is invalid",
    "error.pluginNotConfigured": "Plugin is not configured: login, vault and device are required",
    "error.publishVaultMissingId": "Server did not return a vault id",
    "error.publishVaultNeedsAccount": "Fill Backend URL and sign in before creating a server vault from the current local vault",
    "error.remoteMoveMissingHash": "Remote file move cannot be reconstructed without content_hash",
    "error.remoteMoveMissingTarget": "Remote move is missing target_path",
    "error.remoteUpsertMissingHash": "Remote upsert is missing content_hash",
    "error.resolveUser": "Could not resolve backend user reference from email",
    "error.serverVaultRequired": "Select a server vault first",
    "error.sharingConfigRequired": "Backend URL, user email and vault ID must be filled first",
    "error.targetEmailRequired": "Target user email is required",
    "error.inviteIdRequired": "Invite ID is required",
    "error.targetUserIdRequired": "Target user ID is required",
    "error.telegramLinksNeedAccount": "Backend URL and user email are required for Telegram links",
    "error.updateServerRequired": "Backend URL is required to check plugin updates",
    "error.unsupportedRemoteOperation": "Unsupported remote operation_type {{operationType}}",
    "error.userEmailRequired": "User email is required",
    "error.userIdRequired": "User ID is required",
    "notice.accountRefreshed": "Account refreshed",
    "notice.accountRefreshFailed": "Account refresh failed: {{message}}",
    "notice.deviceRegistered": "Registered sync device: {{deviceId}}",
    "notice.deviceRegistrationFailed": "Device registration failed: {{message}}",
    "notice.loadedVaults": "Scanned vaults: {{count}}",
    "notice.loadVaultsFailed": "Could not scan vaults: {{message}}",
    "notice.localStateReset": "Local sync state reset",
    "notice.loginCode": "Login code (debug): {{code}}",
    "notice.loginCodeRequested": "Login code sent to email",
    "notice.loginCompleted": "Login completed",
    "notice.loginFailed": "Login failed: {{message}}",
    "notice.loginRequestFailed": "Login request failed: {{message}}",
    "notice.localVaultConnected": "This local vault is connected. Run the first sync manually.",
    "notice.localVaultConnectFailed": "Could not connect this local vault: {{message}}",
    "notice.currentVaultPublished": "Server vault created from current local vault: {{name}}",
    "notice.currentVaultPublishFailed": "Could not create server vault from current local vault: {{message}}",
    "notice.pluginUpdateAvailable": "Plugin update available: {{version}}",
    "notice.pluginUpdateCheckFailed": "Update check failed: {{message}}",
    "notice.pluginUpdateInstallFailed": "Plugin update failed: {{message}}",
    "notice.pluginUpdateInstalled": "Plugin files updated to {{version}}. Restart Obsidian or reload the plugin.",
    "notice.pluginUpdateNotAvailable": "Plugin is already up to date",
    "notice.folderSelectionSaved": "Folder selection saved",
    "notice.folderSelectionSaveFailed": "Could not save folder selection: {{message}}",
    "notice.vaultChangedManualSyncRequired": "Server vault changed. Local sync state was reset. Review the selection and run the first sync manually.",
    "notice.vaultChangedAutoSyncPaused": "Server vault changed. Auto sync was turned off and local sync state was reset. Review the selection and run the first sync manually.",
    "notice.removeAccessFailed": "Failed to remove access: {{message}}",
    "notice.removedAccess": "Removed access for {{member}}",
    "notice.revokeInviteFailed": "Failed to revoke invite: {{message}}",
    "notice.sharingUpdateFailed": "Sharing update failed: {{message}}",
    "notice.syncAlreadyRunning": "Sync is already running",
    "notice.syncBootstrapped": "Sync bootstrapped: pull {{pulled}}, conflicts {{conflicts}}",
    "notice.syncDone": "Sync done: push {{pushed}}, pull {{pulled}}, conflicts {{conflicts}}",
    "notice.syncDoneWithWarning": "Sync completed with warnings: push {{pushed}}, pull {{pulled}}, conflicts {{conflicts}}",
    "notice.syncFailed": "Sync failed: {{message}}",
    "notice.crdtMarkdownBlocked": "Collaborative Markdown editing was turned off: {{reason}}",
    "notice.crdtLeaseHeld": "This note is being edited on another device; sending your changes is temporarily paused.",
    "notice.noteNonCrdtRemotePaused": "This note is open on another device while CRDT is off; remote changes for {{path}} are paused so your local text is not overwritten.",
    "notice.noteReadonly": "This note is read-only on this device right now: {{reason}}",
    "notice.noteStructuralChangeBlocked": "Rename, move or delete was not sent because this note is locked elsewhere: {{path}}",
    "notice.noteTakeoverDone": "Takeover requested for {{path}}",
    "notice.noteTakeoverPending": "Takeover was requested for {{path}}, but the note is still reported as read-only.",
    "notice.noteTakeoverUnavailable": "Open a synced Markdown note before requesting takeover.",
    "notice.telegramCodeCreated": "Telegram link code created",
    "notice.telegramCodeCreatedWithCode": "Telegram link code created: {{code}}",
    "notice.telegramCodeFailed": "Telegram link creation failed: {{message}}",
    "notice.telegramRevokeFailed": "Failed to revoke Telegram link: {{message}}",
    "notice.telegramRevoked": "Telegram chat {{chatId}} revoked",
    "notice.vaultInviteCreated": "Vault invite created for {{email}}",
    "notice.vaultInviteRevoked": "Vault invite revoked for {{email}}",
    "notice.vaultAccessUpdated": "Vault access updated for {{email}}",
    "invite.status.accepted": "accepted",
    "invite.status.expired": "expired",
    "invite.status.pending": "sent, waiting for acceptance",
    "invite.status.revoked": "revoked",
    "role.editor": "editor",
    "role.member": "member",
    "role.owner": "owner",
    "role.viewer": "viewer",
    "settings.accessibleVaults": "Accessible vaults",
    "settings.accessibleVaultsDesc": "These are the vaults already available to your account, including accepted invitations. Choose the one you want to use here.",
    "settings.accessibleVaultsBehavior": "Nothing is linked until you press Connect here. To keep shared notes separate, open or create a separate Obsidian vault first, then press Connect here from that vault.",
    "settings.accessToken": "Access token",
    "settings.accessTokenDesc": "Optional Bearer token for authenticated backend routes",
    "settings.accountSetup": "Account Setup",
    "settings.advancedSettings": "Advanced settings",
    "settings.advancedSettingsDesc": "Rarely needed fields for diagnostics, support and custom sync scope. Most users can ignore this section.",
    "settings.autoGenerated": "auto-generated",
    "settings.autoSync": "Auto sync",
    "settings.autoSyncDesc": "Sync automatically on local vault changes with periodic polling fallback",
    "settings.syncObsidianConfig": "Sync Obsidian settings and plugins",
    "settings.syncObsidianConfigDesc": "Sync .obsidian settings, themes, snippets and community plugins. Enable the source device first, then the others: existing server files win during first import. Workspace state and this sync plugin's own local credentials stay device-local; restart Obsidian after plugin files change.",
    "settings.crdtMarkdownEnabled": "Collaborative Markdown editing",
    "settings.crdtMarkdownEnabledDesc": "Use the CRDT update channel for .md files so concurrent edits merge without whole-file 409 conflicts. All devices on this vault should run an updated plugin.",
    "settings.crdtMarkdownBlockedHint": "Currently unavailable: {{reason}}",
    "settings.backendUrl": "Backend URL",
    "settings.backendUrlDesc": "Example: http://45.144.65.18",
    "settings.basicSyncDesc": "These settings are enough for one user syncing between their own devices.",
    "settings.colleagueEmail": "Colleague email",
    "settings.colleagueEmailDesc": "Email of the colleague who should access this vault",
    "settings.connectedTelegramChats": "Connected Telegram chats",
    "settings.currentLocalVault": "Current local vault: {{vaultName}}",
    "settings.connectCurrentVault": "Connect current local vault",
    "settings.connectCurrentVaultDesc": "The selected server vault and folders will sync into the currently opened Obsidian vault. To use a separate local vault, create or open it in Obsidian first, install this plugin there, then connect it.",
    "settings.connectSharedVaultDesc": "Connects the selected shared vault to the Obsidian vault currently open on this device. First sync remains manual so local notes are not mixed accidentally.",
    "settings.connectedServerVault": "Connected server vault: {{vault}}",
    "settings.currentDevice": "Current device: {{deviceId}}",
    "settings.currentMembers": "Current members",
    "settings.deviceId": "Device ID",
    "settings.deviceIdDesc": "Filled automatically after device registration",
    "settings.deviceName": "Device Name",
    "settings.deviceNameDesc": "Human-readable name shown in backend",
    "settings.expiresAt": "Expires at: {{expiresAt}}",
    "settings.ignorePaths": "Ignore paths",
    "settings.ignorePathsDesc": "One path or prefix per line. Prefixes must end with '/'.",
    "settings.language": "Language",
    "settings.languageDesc": "Plugin interface language",
    "settings.lastCode": "Last code: {{code}}",
    "settings.lastErrorSuffix": " | Last error: {{message}}",
    "settings.lastSyncWarningSuffix": " | Last warning: {{message}}",
    "settings.lastSyncStatus": "Last sync: {{lastSyncAt}}{{lastErrorSuffix}}{{lastWarningSuffix}}",
    "settings.loadMembershipsFailed": "Could not load memberships: {{message}}",
    "settings.loadTelegramFailed": "Could not load Telegram links: {{message}}",
    "settings.loginCode": "Login code",
    "settings.loginCodeDesc": "Enter the one-time code sent to your email",
    "settings.loginCodeDevDesc": "Enter the one-time code sent to your email. Debug servers may prefill it here.",
    "settings.loginRequestExpires": "Last request expires at {{expiresAt}}",
    "settings.inviteSentReference": "Invitation sent | Role: {{role}} | Status: {{status}}",
    "settings.memberReference": "Role: {{role}}",
    "settings.memberReferenceWithId": "Role: {{role}} | reference id: {{userId}}",
    "settings.membershipsNeedConfig": "Fill Backend URL, user email and Vault ID to load vault memberships.",
    "settings.noVaultSelected": "No server vault selected yet.",
    "settings.noMembers": "No members found yet.",
    "settings.noPendingInvites": "No pending invites.",
    "settings.noTelegramChats": "No Telegram chats linked yet.",
    "settings.pendingInvites": "Sent invites",
    "settings.platform": "Platform",
    "settings.platformDesc": "Device platform identifier",
    "settings.pluginUpdate": "Plugin update",
    "settings.pluginUpdateAvailable": "Available version: {{latestVersion}}",
    "settings.pluginUpdateAvailableBuild": "A newer build is available for version {{latestVersion}}",
    "settings.pluginUpdateChecking": "Checking...",
    "settings.pluginUpdateCurrent": "Latest installed: {{latestVersion}}",
    "settings.pluginUpdateDesc": "Plugin version: {{currentVersion}}. {{status}}",
    "settings.pluginUpdateFailed": "Last check failed: {{message}}",
    "settings.pluginUpdateInstalling": "Updating...",
    "settings.pluginUpdateNotChecked": "Updates have not been checked yet.",
    "settings.publishCurrentVault": "Create server vault from this local vault",
    "settings.publishCurrentVaultDesc": "Use this only when the currently opened local Obsidian vault does not yet exist on the server. This creates a new server vault entry from the local vault. If a server vault already exists, scan and select it below instead.",
    "settings.publishCurrentVaultAvailableDesc": "You already have server vaults available. Connect one below, or create another vault if your tariff allows it.",
    "settings.publishCurrentVaultHiddenDesc": "This local vault is already linked to a server vault. If you need a different target, choose it from the list below instead of creating a new one here.",
    "settings.quickStart": "Quick start",
    "settings.quickStartDesc": "Finish these required steps first. Sharing, Telegram and advanced fields can wait until personal sync is already working.",
    "settings.refreshAccount": "Refresh account",
    "settings.refreshAccountDesc": "Service action. Re-reads the saved session and restores user/device data if the UI lost them. Usually not needed during normal daily sync.",
    "settings.refreshToken": "Refresh token",
    "settings.refreshTokenDesc": "Optional refresh token used to renew access after 401",
    "settings.requestLoginCode": "Request login code",
    "settings.requestLoginCodeDesc": "The server sends a one-time login code to this email",
    "settings.reconnectCurrentVaultDesc": "Changing the server vault or folders will reset local sync state and turn off auto sync. The first sync must be started manually.",
    "settings.runSyncNow": "Run sync now",
    "settings.serverSyncFolders": "Server folders to sync",
    "settings.serverSyncFoldersDesc": "One server folder per line. Leave empty to sync the whole selected server vault into the currently opened Obsidian vault. These folders are applied when you connect or reconnect this local vault.",
    "settings.serverSyncFoldersInviteDesc": "These folders come from the accepted invitation or membership and cannot be changed here.",
    "settings.sharedAccessReady": "Shared access is ready",
    "settings.sharedAccessReadyDesc": "Your account can access \u201C{{vault}}\u201D as {{role}}. Scope: {{scope}}.",
    "settings.sharedAccessReadyDescWithInviter": "{{inviter}} shared \u201C{{vault}}\u201D with you as {{role}}. Scope: {{scope}}.",
    "settings.setupStepAccount": "User email is entered",
    "settings.setupStepLogin": "Login is completed and device is registered",
    "settings.setupStepOptional": "Sharing and Telegram are optional after personal sync is working",
    "settings.setupStepServer": "Server URL is configured",
    "settings.setupStepSync": "Plugin is ready for the first sync",
    "settings.setupStepVault": "A server vault is selected",
    "settings.vaultId": "Server vault ID",
    "settings.vaultIdDesc": "Service reference of the selected server vault. Usually not needed in daily use.",
    "settings.sharedFolders": "Shared Folders",
    "settings.sharedFoldersDesc": "Use the folder tree to choose whole-vault access or specific shared folders.",
    "settings.sharedFolderScope": "Folders to share",
    "settings.sharedFolderScopeDesc": "Choose Whole vault or select one or more folders from the tree.",
    "settings.selectedSharedFolders": "Selected folders: {{count}}",
    "settings.noShareableFolders": "No folders in this vault",
    "settings.status": "Status: {{status}}",
    "settings.sync": "Sync",
    "settings.syncFolders": "Folders to publish",
    "settings.syncFoldersDesc": "One local folder per line. Leave empty to publish the whole current Obsidian vault. Changing this resets local sync state.",
    "settings.syncFoldersPlaceholder": "Projects\nArchive/Shared",
    "settings.syncInterval": "Sync interval (seconds)",
    "settings.syncIntervalDesc": "Fallback polling interval while auto sync is enabled",
    "settings.telegramChat": "Chat {{chatId}}",
    "settings.telegramDesc": "You can generate a one-time Telegram link code here and then send `/link CODE` to the bot in a private chat.",
    "settings.telegramInboxFolder": "Telegram inbox folder",
    "settings.telegramInboxFolderDesc": "Default destination folder for notes created from Telegram messages",
    "settings.telegramNeedConfig": "Fill Backend URL and user email to load Telegram links.",
    "settings.title": "Arcalink Sync",
    "settings.unnamedVault": "Unnamed vault",
    "settings.userEmail": "User email",
    "settings.userEmailDesc": "Primary account identifier used by registration, sharing and Telegram flows",
    "settings.userId": "User ID (reference)",
    "settings.userIdDesc": "Resolved automatically from email. Keep it only for diagnostics and support.",
    "settings.vaultConnection": "Vault Connection",
    "settings.vaultRole": "Vault role",
    "settings.vaultRoleDesc": "Role for the invite. Folder restrictions are controlled by Folders to share.",
    "settings.vaultSharing": "Vault Sharing",
    "settings.vaultSharingDesc": "ArcaLink creates an invite by colleague email. Choose the whole vault or specific folders in the tree.",
    "settings.wholeVaultAccess": "Whole vault",
    "settings.wholeVaultAccessInput": "Whole vault",
    "settings.folderScopeAccess": "Folders: {{folders}}",
    "status.never": "never",
    "stage.bootstrap-from-remote": "bootstrap from remote",
    "stage.create-session": "create sync session",
    "stage.pull-remote-changes": "pull remote changes",
    "stage.push-local-changes": "push local changes",
    "stage.scan-local-after-pull": "scan local vault after pull",
    "stage.scan-local-before-push": "scan local vault before push",
    "auth.status.authenticated": "Logged in",
    "auth.status.unknown": "Checking auth...",
    "auth.status.missing_token": "Not logged in \u2014 no access token",
    "auth.status.refresh_failed": "Login expired \u2014 refresh failed",
    "auth.status.session_expired": "Login expired \u2014 session ended",
    "auth.status.session_revoked": "Login revoked \u2014 session was invalidated",
    "auth.status.billing_blocked": "Sync blocked \u2014 check account status",
    "auth.status.error": "Auth error \u2014 see details below",
    "auth.indicatorLabel": "Auth status",
    "syncBlock.reason.none": "No issues detected",
    "syncBlock.reason.not_configured": "Plugin is not fully configured",
    "syncBlock.reason.missing_token": "Access token is missing \u2014 log in again",
    "syncBlock.reason.session_expired": "Session has expired \u2014 log in again",
    "syncBlock.reason.session_revoked": "Session was revoked by server \u2014 log in again",
    "syncBlock.reason.refresh_failed": "Token refresh failed \u2014 log in again",
    "syncBlock.reason.billing_blocked": "Account billing status prevents sync",
    "syncBlock.reason.network_error": "Network error \u2014 check connection",
    "syncBlock.reason.server_error": "Server error \u2014 try again later",
    "syncBlock.label": "Sync status",
    "collaborationBlock.reason.none": "No collaboration issues detected",
    "collaborationBlock.reason.billing_blocked_collaboration": "Collaboration subscription unpaid \u2014 sharing and live editing blocked",
    "collaborationBlock.reason.collaboration_not_in_plan": "Current plan does not include collaboration \u2014 upgrade to enable sharing and live editing",
    "collaborationBlock.reason.member_limit_exceeded": "Vault member limit reached \u2014 upgrade plan or remove unused members",
    "collaborationBlock.label": "Collaboration status",
    "stage.sync-crdt-markdown": "sync collaborative Markdown notes",
    "settings.syncConflicts": "Sync conflicts",
    "settings.syncConflictsNeedConfig": "Select a vault and run the first sync to load conflict information.",
    "settings.noConflicts": "No open conflicts found.",
    "settings.syncConflictsDesc": "These files have conflicting changes. Resolve them from the Obsidian plugin on your device.",
    "settings.conflictItemDesc": "{{createdAt}} | {{reason}} | {{opType}} | {{status}}",
    "settings.loadConflictsFailed": "Failed to load conflicts: {{message}}",
    "settings.loadConflictsUsingCache": "Showing cached conflicts because refresh failed: {{message}}",
    "settings.conflictDetailTitle": "Conflict details",
    "settings.conflictPath": "Path",
    "settings.conflictCreatedAt": "Created at",
    "settings.conflictOperationType": "Operation",
    "settings.conflictReason": "Reason",
    "settings.conflictExpectedHash": "Expected hash",
    "settings.conflictActualHash": "Actual hash",
    "settings.conflictStatus": "Status",
    "settings.conflictDeviceId": "Device",
    "settings.conflictTargetPath": "Target path",
    "settings.conflictResolutionUnsupported": "This conflict type is currently read-only. Resolve it from a device flow that supports {{entryType}} / {{operationType}}.",
    "button.viewConflictDetails": "Details",
    "button.resolveKeepLocal": "Keep local",
    "button.resolveAcceptRemote": "Accept remote",
    "button.resolveKeepBoth": "Keep both",
    "button.materializeRemote": "Show remote version",
    "button.checkVaultDivergence": "Check divergence",
    "button.mergeVaultDivergence": "Merge missing files",
    "button.acceptServerVaultState": "Use server here",
    "button.publishLocalVaultState": "Publish this client",
    "resolution.keepLocal": "keep_local",
    "resolution.acceptRemote": "accept_remote",
    "resolution.keepBoth": "keep_both",
    "resolution.keepLocalDesc": "Publish your local file version to the server and mark the conflict as resolved.",
    "resolution.keepLocalDeleteHashMismatchDesc": "Keep the local deletion: delete the current server file version and mark the conflict as resolved.",
    "resolution.acceptRemoteDesc": "Replace your local file with the current server version. A safety copy will be preserved.",
    "resolution.keepBothDesc": "Keep the server version as the main file and preserve your local version as a conflict copy.",
    "resolution.materializeDesc": "Download the current server version into a read-only comparison file next to your local copy.",
    "confirm.remoteConflictContentMissingUseLocal": "The server content for {{path}} is missing and cannot be restored from the server. Use this device's local version instead?",
    "error.localFileNotFound": "Local file {{path}} no longer exists",
    "error.remoteFileNotAvailable": "Remote version of {{path}} is not available",
    "error.remoteConflictContentMissing": "Server content for {{path}} is missing. Keep the local version to resolve this conflict.",
    "error.syncBlockedBilling.generic": "Sync is blocked because the subscription currently does not allow it.",
    "error.syncBlockedBilling.expired": "Sync is blocked because the subscription has expired.",
    "error.syncBlockedBilling.past_due": "Sync is blocked because the subscription payment is overdue.",
    "error.syncBlockedBilling.suspended": "Sync is blocked because the subscription is suspended.",
    "error.syncBlockedBilling.canceled": "Sync is blocked because the subscription is canceled.",
    "error.unsupportedConflictResolution": "Conflict resolution for {{entryType}} / {{operationType}} is not supported in this version",
    "error.resolveConflictFailed": "Failed to resolve conflict: {{message}}",
    "notice.conflictResolved": "Conflict resolved",
    "notice.conflictResolveFailed": "Conflict resolution failed: {{message}}",
    "notice.remoteMaterialized": "Remote version downloaded to {{path}}",
    "notice.remoteMaterializeFailed": "Failed to download remote version: {{message}}",
    "notice.vaultDivergenceServerAccepted": "Server state applied: remote {{applied}}, local removed {{removed}}, safety copies {{preserved}}",
    "notice.vaultDivergenceLocalPublished": "Local state published: operations {{pushed}}, conflicts {{conflicts}}",
    "notice.vaultDivergenceMerged": "Merge done: server-only downloaded {{downloaded}}, local-only uploaded {{uploaded}}, directories created on server {{directories}}, missing remote objects {{missing}}, conflicts {{conflicts}}, same-path changed left {{changed}}",
    "notice.vaultDivergenceResolveFailed": "Could not resolve vault divergence: {{message}}",
    "settings.vaultDivergence": "Vault divergence",
    "settings.vaultDivergenceNeedConfig": "Select a vault and run the first sync to compare file sets.",
    "settings.vaultDivergenceDesc": "Compares this local vault with the server index without changing files.",
    "settings.checkVaultDivergence": "Compare local and server files",
    "settings.checkVaultDivergenceDesc": "Scans the current vault and shows paths that exist only on one side or have different content.",
    "settings.loadVaultDivergenceFailed": "Failed to compare vaults: {{message}}",
    "settings.vaultDivergenceCheckedAt": "Checked: {{checkedAt}}",
    "settings.vaultDivergenceCounts": "Local: {{localCount}} | Server: {{remoteCount}} | Only local: {{localOnlyCount}} | Only server: {{remoteOnlyCount}} | Changed: {{changedCount}}",
    "settings.vaultDivergenceNoDiff": "No file set differences found.",
    "settings.vaultDivergenceLocalOnly": "Only in this local vault",
    "settings.vaultDivergenceRemoteOnly": "Only on server",
    "settings.vaultDivergenceChanged": "Different content",
    "settings.vaultDivergenceMore": "and {{count}} more",
    "settings.vaultDivergenceTimeHint": "Times: local is this client's file modified time; server is when the server accepted the latest operation.",
    "settings.vaultDivergenceSideLocal": "Local",
    "settings.vaultDivergenceSideServer": "Server",
    "settings.vaultDivergenceSideMissing": "{{side}}: missing",
    "settings.vaultDivergenceSideMeta": "{{side}}: {{modifiedAt}} | {{type}} | {{size}} | {{hash}}",
    "settings.mergeVaultDivergence": "Merge file sets without overwrite",
    "settings.mergeVaultDivergenceDesc": "Downloads files that exist only on the server and uploads files that exist only on this client. Files with different content at the same path are not changed (remaining: {{changed}}).",
    "settings.acceptServerVaultState": "Use server state on this client",
    "settings.acceptServerVaultStateDesc": "Server-only files will be downloaded, changed files will be replaced by server versions, and local-only paths will be removed after safety copies are written under .sync-conflict-local.",
    "settings.publishLocalVaultState": "Make this client the source",
    "settings.publishLocalVaultStateDesc": "Local-only files will be created on the server, changed files will be published from this client, and server-only paths will be deleted from the server.",
    "confirm.acceptServerVaultState": "Apply the server state to this client for {{count}} differences? Server-only files will be downloaded; local-only files will be removed after safety copies are created.",
    "confirm.publishLocalVaultState": "Publish this client as the source for {{count}} differences? Local-only files will be uploaded; server-only files will be deleted from the server for all clients.",
    "confirm.mergeVaultDivergence": "Merge {{count}} paths that exist on only one side? Files with different content at the same path will not be changed (remaining: {{changed}}).",
    "status.unknown": "unknown",
    "sectionStatus.connected": "Connected",
    "sectionStatus.notConnected": "Not connected",
    "sectionStatus.configured": "Configured",
    "sectionStatus.notConfigured": "Not configured",
    "sectionStatus.checking": "Checking\u2026",
    "sectionStatus.blocked": "Blocked",
    "sectionStatus.error": "Error",
    "sectionStatus.autoSync": "Auto sync",
    "sectionStatus.manualSync": "Manual sync",
    "sectionStatus.syncConflicted": "Sync conflicted",
    "sectionStatus.noConflicts": "No conflicts",
    "sectionStatus.conflictsOpen": "{{count}} open",
    "sectionStatus.noVaultDivergence": "No divergence",
    "sectionStatus.vaultDiverged": "{{count}} differences",
    "statusBar.notePresence": "HTTP Sync: note {{path}} is open elsewhere ({{holders}})",
    "statusBar.noteReadonly": "HTTP Sync: note {{path}} is read-only ({{holders}})",
    "statusBar.notePresenceShort": "Note: +{{count}}",
    "statusBar.noteReadonlyShort": "Note: read-only",
    "statusBar.noteUnknownHolders": "unknown holders",
    "statusBar.brand": "Arcalink",
    "statusBar.openSettings": "Open Arcalink settings",
    "statusBar.lampOk": "Arcalink: everything works",
    "statusBar.lampNoConnection": "Arcalink: no server connection",
    "statusBar.lampBlocked": "Arcalink: sync is blocked",
    "statusBar.lampSyncError": "Arcalink: sync error",
    "statusBar.lampConflict": "Arcalink: sync conflicts exist",
    "statusBar.lampConflictCount": "Arcalink: {{count}} open sync conflicts",
    "statusBar.syncModeAuto": "Auto sync",
    "statusBar.syncModeManual": "Manual sync",
    "statusBar.serverLabel": "Server",
    "statusBar.serverConnected": "connected",
    "statusBar.serverChecking": "checking",
    "statusBar.serverBlocked": "blocked",
    "statusBar.serverError": "error",
    "statusBar.serverNotConfigured": "not configured",
    "statusBar.serverNotConnected": "not connected",
    "statusBar.syncLabel": "Sync",
    "statusBar.syncIdle": "idle",
    "statusBar.syncing": "syncing",
    "statusBar.syncProgress": "Files: {{completed}}/{{total}}",
    "statusBar.syncQueued": "queued",
    "statusBar.syncError": "error",
    "statusBar.syncNotConfigured": "not configured"
  },
  ru: {
    "button.completeLogin": "\u0417\u0430\u0432\u0435\u0440\u0448\u0438\u0442\u044C \u0432\u0445\u043E\u0434",
    "button.connectSharedVaultHere": "\u041F\u043E\u0434\u043A\u043B\u044E\u0447\u0438\u0442\u044C \u0441\u044E\u0434\u0430",
    "button.connectThisLocalVault": "\u041F\u043E\u0434\u043A\u043B\u044E\u0447\u0438\u0442\u044C \u044D\u0442\u043E\u0442 \u043B\u043E\u043A\u0430\u043B\u044C\u043D\u044B\u0439 vault",
    "button.checkUpdates": "\u041F\u0440\u043E\u0432\u0435\u0440\u0438\u0442\u044C \u043E\u0431\u043D\u043E\u0432\u043B\u0435\u043D\u0438\u044F",
    "button.createLinkCode": "\u0421\u043E\u0437\u0434\u0430\u0442\u044C \u043A\u043E\u0434 \u043F\u0440\u0438\u0432\u044F\u0437\u043A\u0438",
    "button.grantAccess": "\u0421\u043E\u0437\u0434\u0430\u0442\u044C \u043F\u0440\u0438\u0433\u043B\u0430\u0448\u0435\u043D\u0438\u0435",
    "button.loadVaults": "\u0421\u043A\u0430\u043D\u0438\u0440\u043E\u0432\u0430\u0442\u044C \u0445\u0440\u0430\u043D\u0438\u043B\u0438\u0449\u0430",
    "button.publishCurrentVault": "\u0421\u043E\u0437\u0434\u0430\u0442\u044C \u0445\u0440\u0430\u043D\u0438\u043B\u0438\u0449\u0435",
    "button.refresh": "\u041E\u0431\u043D\u043E\u0432\u0438\u0442\u044C",
    "button.refreshAccount": "\u041E\u0431\u043D\u043E\u0432\u0438\u0442\u044C \u0430\u043A\u043A\u0430\u0443\u043D\u0442",
    "button.register": "\u0417\u0430\u0440\u0435\u0433\u0438\u0441\u0442\u0440\u0438\u0440\u043E\u0432\u0430\u0442\u044C",
    "button.remove": "\u0423\u0434\u0430\u043B\u0438\u0442\u044C",
    "button.requestCode": "\u0417\u0430\u043F\u0440\u043E\u0441\u0438\u0442\u044C \u043A\u043E\u0434",
    "button.reconnectThisLocalVault": "\u041F\u0435\u0440\u0435\u043F\u043E\u0434\u043A\u043B\u044E\u0447\u0438\u0442\u044C \u044D\u0442\u043E\u0442 \u043B\u043E\u043A\u0430\u043B\u044C\u043D\u044B\u0439 vault",
    "button.resetLocalState": "\u0421\u0431\u0440\u043E\u0441\u0438\u0442\u044C \u043B\u043E\u043A\u0430\u043B\u044C\u043D\u043E\u0435 \u0441\u043E\u0441\u0442\u043E\u044F\u043D\u0438\u0435",
    "button.revoke": "\u041E\u0442\u043E\u0437\u0432\u0430\u0442\u044C",
    "button.syncNow": "\u0421\u0438\u043D\u0445\u0440\u043E\u043D\u0438\u0437\u0438\u0440\u043E\u0432\u0430\u0442\u044C",
    "button.syncProgress": "\u0421\u0438\u043D\u0445\u0440\u043E\u043D\u0438\u0437\u0430\u0446\u0438\u044F {{completed}}/{{total}}",
    "button.takeoverActiveNoteEdit": "\u041F\u0435\u0440\u0435\u0445\u0432\u0430\u0442\u0438\u0442\u044C \u0440\u0435\u0434\u0430\u043A\u0442\u0438\u0440\u043E\u0432\u0430\u043D\u0438\u0435",
    "button.updatePlugin": "\u041E\u0431\u043D\u043E\u0432\u0438\u0442\u044C",
    "command.registerDevice": "\u0417\u0430\u0440\u0435\u0433\u0438\u0441\u0442\u0440\u0438\u0440\u043E\u0432\u0430\u0442\u044C \u0442\u0435\u043A\u0443\u0449\u0435\u0435 \u043F\u0440\u0438\u043B\u043E\u0436\u0435\u043D\u0438\u0435 Obsidian \u043A\u0430\u043A \u0443\u0441\u0442\u0440\u043E\u0439\u0441\u0442\u0432\u043E",
    "command.resetLocalState": "\u0421\u0431\u0440\u043E\u0441\u0438\u0442\u044C \u043B\u043E\u043A\u0430\u043B\u044C\u043D\u043E\u0435 \u0441\u043E\u0441\u0442\u043E\u044F\u043D\u0438\u0435 \u0441\u0438\u043D\u0445\u0440\u043E\u043D\u0438\u0437\u0430\u0446\u0438\u0438",
    "command.syncNow": "\u0421\u0438\u043D\u0445\u0440\u043E\u043D\u0438\u0437\u0438\u0440\u043E\u0432\u0430\u0442\u044C \u0441\u0435\u0439\u0447\u0430\u0441",
    "command.syncVaultNow": "\u0421\u0438\u043D\u0445\u0440\u043E\u043D\u0438\u0437\u0438\u0440\u043E\u0432\u0430\u0442\u044C \u0445\u0440\u0430\u043D\u0438\u043B\u0438\u0449\u0435 \u0441\u0435\u0439\u0447\u0430\u0441",
    "command.takeoverActiveNoteLock": "\u041F\u0435\u0440\u0435\u0445\u0432\u0430\u0442\u0438\u0442\u044C \u0431\u043B\u043E\u043A\u0438\u0440\u043E\u0432\u043A\u0443 \u0430\u043A\u0442\u0438\u0432\u043D\u043E\u0439 \u0437\u0430\u043C\u0435\u0442\u043A\u0438",
    "dropdown.loadVaultsFirst": "\u0421\u043D\u0430\u0447\u0430\u043B\u0430 \u0441\u043A\u0430\u043D\u0438\u0440\u0443\u0439\u0442\u0435 \u0445\u0440\u0430\u043D\u0438\u043B\u0438\u0449\u0430",
    "dropdown.selectVault": "\u0412\u044B\u0431\u0435\u0440\u0438\u0442\u0435 \u0445\u0440\u0430\u043D\u0438\u043B\u0438\u0449\u0435",
    "error.accessTokenRequired": "\u041D\u0443\u0436\u0435\u043D \u0442\u043E\u043A\u0435\u043D \u0434\u043E\u0441\u0442\u0443\u043F\u0430",
    "error.backendAndEmailRequired": "\u0423\u043A\u0430\u0436\u0438\u0442\u0435 URL \u0441\u0435\u0440\u0432\u0435\u0440\u0430 \u0438 email \u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044F",
    "error.crdtProtocolUnsupported": "\u0421\u0435\u0440\u0432\u0435\u0440 \u0441\u043B\u0438\u0448\u043A\u043E\u043C \u0441\u0442\u0430\u0440\u044B\u0439 \u0434\u043B\u044F \u0431\u0435\u0437\u043E\u043F\u0430\u0441\u043D\u043E\u0439 \u0441\u043E\u0432\u043C\u0435\u0441\u0442\u043D\u043E\u0439 \u0441\u0438\u043D\u0445\u0440\u043E\u043D\u0438\u0437\u0430\u0446\u0438\u0438 Markdown. \u041E\u0431\u043D\u043E\u0432\u0438\u0442\u0435 backend \u043F\u0435\u0440\u0435\u0434 \u0440\u0435\u0434\u0430\u043A\u0442\u0438\u0440\u043E\u0432\u0430\u043D\u0438\u0435\u043C \u043E\u0431\u0449\u0438\u0445 \u0437\u0430\u043C\u0435\u0442\u043E\u043A.",
    "error.deviceRegistrationNeedsAccount": "\u041F\u0435\u0440\u0435\u0434 \u0440\u0435\u0433\u0438\u0441\u0442\u0440\u0430\u0446\u0438\u0435\u0439 \u0443\u0441\u0442\u0440\u043E\u0439\u0441\u0442\u0432\u0430 \u0443\u043A\u0430\u0436\u0438\u0442\u0435 URL \u0441\u0435\u0440\u0432\u0435\u0440\u0430 \u0438 email \u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044F",
    "error.expectedBinary": "\u041E\u0436\u0438\u0434\u0430\u043B\u0441\u044F \u0431\u0438\u043D\u0430\u0440\u043D\u044B\u0439 \u043E\u0442\u0432\u0435\u0442",
    "error.expectedJson": "\u041E\u0436\u0438\u0434\u0430\u043B\u0441\u044F JSON-\u043E\u0442\u0432\u0435\u0442",
    "error.loginCodeRequired": "\u0423\u043A\u0430\u0436\u0438\u0442\u0435 URL \u0441\u0435\u0440\u0432\u0435\u0440\u0430, email \u0438 \u043A\u043E\u0434 \u0432\u0445\u043E\u0434\u0430",
    "error.pluginArchiveMissingFile": "\u0412 \u0430\u0440\u0445\u0438\u0432\u0435 \u043F\u043B\u0430\u0433\u0438\u043D\u0430 \u043D\u0435\u0442 \u0444\u0430\u0439\u043B\u0430 {{fileName}}",
    "error.pluginDirectoryUnavailable": "\u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u043E\u043F\u0440\u0435\u0434\u0435\u043B\u0438\u0442\u044C \u043F\u0430\u043F\u043A\u0443 \u0443\u0441\u0442\u0430\u043D\u043E\u0432\u043A\u0438 \u043F\u043B\u0430\u0433\u0438\u043D\u0430",
    "error.pluginManifestInvalid": "\u0421\u043A\u0430\u0447\u0430\u043D\u043D\u044B\u0439 manifest \u043F\u043B\u0430\u0433\u0438\u043D\u0430 \u043D\u0435\u043A\u043E\u0440\u0440\u0435\u043A\u0442\u0435\u043D",
    "error.pluginNotConfigured": "\u041F\u043B\u0430\u0433\u0438\u043D \u043D\u0435 \u043D\u0430\u0441\u0442\u0440\u043E\u0435\u043D: \u043D\u0443\u0436\u0435\u043D \u0432\u0445\u043E\u0434, \u0445\u0440\u0430\u043D\u0438\u043B\u0438\u0449\u0435 \u0438 \u0443\u0441\u0442\u0440\u043E\u0439\u0441\u0442\u0432\u043E",
    "error.publishVaultMissingId": "\u0421\u0435\u0440\u0432\u0435\u0440 \u043D\u0435 \u0432\u0435\u0440\u043D\u0443\u043B ID \u0445\u0440\u0430\u043D\u0438\u043B\u0438\u0449\u0430",
    "error.publishVaultNeedsAccount": "\u041F\u0435\u0440\u0435\u0434 \u0441\u043E\u0437\u0434\u0430\u043D\u0438\u0435\u043C server-\u0445\u0440\u0430\u043D\u0438\u043B\u0438\u0449\u0430 \u0438\u0437 \u0442\u0435\u043A\u0443\u0449\u0435\u0433\u043E \u043B\u043E\u043A\u0430\u043B\u044C\u043D\u043E\u0433\u043E vault \u0443\u043A\u0430\u0436\u0438\u0442\u0435 URL \u0441\u0435\u0440\u0432\u0435\u0440\u0430 \u0438 \u0432\u044B\u043F\u043E\u043B\u043D\u0438\u0442\u0435 \u0432\u0445\u043E\u0434",
    "error.remoteMoveMissingHash": "\u041D\u0435\u043B\u044C\u0437\u044F \u0432\u043E\u0441\u0441\u0442\u0430\u043D\u043E\u0432\u0438\u0442\u044C \u0443\u0434\u0430\u043B\u0451\u043D\u043D\u043E\u0435 \u043F\u0435\u0440\u0435\u043C\u0435\u0449\u0435\u043D\u0438\u0435 \u0444\u0430\u0439\u043B\u0430 \u0431\u0435\u0437 content_hash",
    "error.remoteMoveMissingTarget": "\u0412 \u0443\u0434\u0430\u043B\u0451\u043D\u043D\u043E\u043C \u043F\u0435\u0440\u0435\u043C\u0435\u0449\u0435\u043D\u0438\u0438 \u043D\u0435\u0442 target_path",
    "error.remoteUpsertMissingHash": "\u0412 \u0443\u0434\u0430\u043B\u0451\u043D\u043D\u043E\u0439 \u043E\u043F\u0435\u0440\u0430\u0446\u0438\u0438 \u043E\u0431\u043D\u043E\u0432\u043B\u0435\u043D\u0438\u044F \u043D\u0435\u0442 content_hash",
    "error.resolveUser": "\u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u043D\u0430\u0439\u0442\u0438 \u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044F \u043D\u0430 \u0441\u0435\u0440\u0432\u0435\u0440\u0435 \u043F\u043E email",
    "error.serverVaultRequired": "\u0421\u043D\u0430\u0447\u0430\u043B\u0430 \u0432\u044B\u0431\u0435\u0440\u0438\u0442\u0435 server-\u0445\u0440\u0430\u043D\u0438\u043B\u0438\u0449\u0435",
    "error.sharingConfigRequired": "\u0421\u043D\u0430\u0447\u0430\u043B\u0430 \u0437\u0430\u043F\u043E\u043B\u043D\u0438\u0442\u0435 URL \u0441\u0435\u0440\u0432\u0435\u0440\u0430, email \u0438 ID \u0445\u0440\u0430\u043D\u0438\u043B\u0438\u0449\u0430",
    "error.targetEmailRequired": "\u0423\u043A\u0430\u0436\u0438\u0442\u0435 email \u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044F",
    "error.inviteIdRequired": "\u041D\u0443\u0436\u0435\u043D ID \u043F\u0440\u0438\u0433\u043B\u0430\u0448\u0435\u043D\u0438\u044F",
    "error.targetUserIdRequired": "\u0423\u043A\u0430\u0436\u0438\u0442\u0435 ID \u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044F",
    "error.telegramLinksNeedAccount": "\u0414\u043B\u044F Telegram-\u0441\u0432\u044F\u0437\u043E\u043A \u043D\u0443\u0436\u043D\u044B URL \u0441\u0435\u0440\u0432\u0435\u0440\u0430 \u0438 email \u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044F",
    "error.updateServerRequired": "\u0414\u043B\u044F \u043F\u0440\u043E\u0432\u0435\u0440\u043A\u0438 \u043E\u0431\u043D\u043E\u0432\u043B\u0435\u043D\u0438\u0439 \u043D\u0443\u0436\u0435\u043D URL \u0441\u0435\u0440\u0432\u0435\u0440\u0430",
    "error.unsupportedRemoteOperation": "\u041D\u0435\u043F\u043E\u0434\u0434\u0435\u0440\u0436\u0438\u0432\u0430\u0435\u043C\u044B\u0439 \u0442\u0438\u043F \u0443\u0434\u0430\u043B\u0451\u043D\u043D\u043E\u0439 \u043E\u043F\u0435\u0440\u0430\u0446\u0438\u0438: {{operationType}}",
    "error.userEmailRequired": "\u0423\u043A\u0430\u0436\u0438\u0442\u0435 email \u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044F",
    "error.userIdRequired": "\u041D\u0443\u0436\u0435\u043D ID \u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044F",
    "notice.accountRefreshed": "\u0410\u043A\u043A\u0430\u0443\u043D\u0442 \u043E\u0431\u043D\u043E\u0432\u043B\u0451\u043D",
    "notice.accountRefreshFailed": "\u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u043E\u0431\u043D\u043E\u0432\u0438\u0442\u044C \u0430\u043A\u043A\u0430\u0443\u043D\u0442: {{message}}",
    "notice.deviceRegistered": "\u0423\u0441\u0442\u0440\u043E\u0439\u0441\u0442\u0432\u043E \u0441\u0438\u043D\u0445\u0440\u043E\u043D\u0438\u0437\u0430\u0446\u0438\u0438 \u0437\u0430\u0440\u0435\u0433\u0438\u0441\u0442\u0440\u0438\u0440\u043E\u0432\u0430\u043D\u043E: {{deviceId}}",
    "notice.deviceRegistrationFailed": "\u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u0437\u0430\u0440\u0435\u0433\u0438\u0441\u0442\u0440\u0438\u0440\u043E\u0432\u0430\u0442\u044C \u0443\u0441\u0442\u0440\u043E\u0439\u0441\u0442\u0432\u043E: {{message}}",
    "notice.loadedVaults": "\u041D\u0430\u0439\u0434\u0435\u043D\u043E \u0445\u0440\u0430\u043D\u0438\u043B\u0438\u0449: {{count}}",
    "notice.loadVaultsFailed": "\u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u043F\u0440\u043E\u0441\u043A\u0430\u043D\u0438\u0440\u043E\u0432\u0430\u0442\u044C \u0445\u0440\u0430\u043D\u0438\u043B\u0438\u0449\u0430: {{message}}",
    "notice.localStateReset": "\u041B\u043E\u043A\u0430\u043B\u044C\u043D\u043E\u0435 \u0441\u043E\u0441\u0442\u043E\u044F\u043D\u0438\u0435 \u0441\u0438\u043D\u0445\u0440\u043E\u043D\u0438\u0437\u0430\u0446\u0438\u0438 \u0441\u0431\u0440\u043E\u0448\u0435\u043D\u043E",
    "notice.loginCode": "\u041A\u043E\u0434 \u0432\u0445\u043E\u0434\u0430 (debug): {{code}}",
    "notice.loginCodeRequested": "\u041A\u043E\u0434 \u0432\u0445\u043E\u0434\u0430 \u043E\u0442\u043F\u0440\u0430\u0432\u043B\u0435\u043D \u043D\u0430 email",
    "notice.loginCompleted": "\u0412\u0445\u043E\u0434 \u0432\u044B\u043F\u043E\u043B\u043D\u0435\u043D",
    "notice.loginFailed": "\u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u0432\u043E\u0439\u0442\u0438: {{message}}",
    "notice.loginRequestFailed": "\u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u0437\u0430\u043F\u0440\u043E\u0441\u0438\u0442\u044C \u043A\u043E\u0434 \u0432\u0445\u043E\u0434\u0430: {{message}}",
    "notice.localVaultConnected": "\u042D\u0442\u043E\u0442 \u043B\u043E\u043A\u0430\u043B\u044C\u043D\u044B\u0439 vault \u043F\u043E\u0434\u043A\u043B\u044E\u0447\u0451\u043D. \u0417\u0430\u043F\u0443\u0441\u0442\u0438\u0442\u0435 \u043F\u0435\u0440\u0432\u0443\u044E \u0441\u0438\u043D\u0445\u0440\u043E\u043D\u0438\u0437\u0430\u0446\u0438\u044E \u0432\u0440\u0443\u0447\u043D\u0443\u044E.",
    "notice.localVaultConnectFailed": "\u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u043F\u043E\u0434\u043A\u043B\u044E\u0447\u0438\u0442\u044C \u044D\u0442\u043E\u0442 \u043B\u043E\u043A\u0430\u043B\u044C\u043D\u044B\u0439 vault: {{message}}",
    "notice.currentVaultPublished": "Server-\u0445\u0440\u0430\u043D\u0438\u043B\u0438\u0449\u0435 \u0441\u043E\u0437\u0434\u0430\u043D\u043E \u0438\u0437 \u0442\u0435\u043A\u0443\u0449\u0435\u0433\u043E \u043B\u043E\u043A\u0430\u043B\u044C\u043D\u043E\u0433\u043E vault: {{name}}",
    "notice.currentVaultPublishFailed": "\u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u0441\u043E\u0437\u0434\u0430\u0442\u044C server-\u0445\u0440\u0430\u043D\u0438\u043B\u0438\u0449\u0435 \u0438\u0437 \u0442\u0435\u043A\u0443\u0449\u0435\u0433\u043E \u043B\u043E\u043A\u0430\u043B\u044C\u043D\u043E\u0433\u043E vault: {{message}}",
    "notice.pluginUpdateAvailable": "\u0414\u043E\u0441\u0442\u0443\u043F\u043D\u043E \u043E\u0431\u043D\u043E\u0432\u043B\u0435\u043D\u0438\u0435 \u043F\u043B\u0430\u0433\u0438\u043D\u0430: {{version}}",
    "notice.pluginUpdateCheckFailed": "\u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u043F\u0440\u043E\u0432\u0435\u0440\u0438\u0442\u044C \u043E\u0431\u043D\u043E\u0432\u043B\u0435\u043D\u0438\u044F: {{message}}",
    "notice.pluginUpdateInstallFailed": "\u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u043E\u0431\u043D\u043E\u0432\u0438\u0442\u044C \u043F\u043B\u0430\u0433\u0438\u043D: {{message}}",
    "notice.pluginUpdateInstalled": "\u0424\u0430\u0439\u043B\u044B \u043F\u043B\u0430\u0433\u0438\u043D\u0430 \u043E\u0431\u043D\u043E\u0432\u043B\u0435\u043D\u044B \u0434\u043E {{version}}. \u041F\u0435\u0440\u0435\u0437\u0430\u043F\u0443\u0441\u0442\u0438\u0442\u0435 Obsidian \u0438\u043B\u0438 \u043F\u0435\u0440\u0435\u0437\u0430\u0433\u0440\u0443\u0437\u0438\u0442\u0435 \u043F\u043B\u0430\u0433\u0438\u043D.",
    "notice.pluginUpdateNotAvailable": "\u041F\u043B\u0430\u0433\u0438\u043D \u0443\u0436\u0435 \u043E\u0431\u043D\u043E\u0432\u043B\u0451\u043D",
    "notice.vaultChangedManualSyncRequired": "\u0412\u044B\u0431\u043E\u0440 server-\u0445\u0440\u0430\u043D\u0438\u043B\u0438\u0449\u0430 \u0438\u0437\u043C\u0435\u043D\u0451\u043D. \u041B\u043E\u043A\u0430\u043B\u044C\u043D\u043E\u0435 \u0441\u043E\u0441\u0442\u043E\u044F\u043D\u0438\u0435 \u0441\u0438\u043D\u0445\u0440\u043E\u043D\u0438\u0437\u0430\u0446\u0438\u0438 \u0441\u0431\u0440\u043E\u0448\u0435\u043D\u043E. \u041F\u0440\u043E\u0432\u0435\u0440\u044C\u0442\u0435 \u0432\u044B\u0431\u043E\u0440 \u0438 \u0437\u0430\u043F\u0443\u0441\u0442\u0438\u0442\u0435 \u043F\u0435\u0440\u0432\u0443\u044E \u0441\u0438\u043D\u0445\u0440\u043E\u043D\u0438\u0437\u0430\u0446\u0438\u044E \u0432\u0440\u0443\u0447\u043D\u0443\u044E.",
    "notice.vaultChangedAutoSyncPaused": "\u0412\u044B\u0431\u043E\u0440 server-\u0445\u0440\u0430\u043D\u0438\u043B\u0438\u0449\u0430 \u0438\u0437\u043C\u0435\u043D\u0451\u043D. \u0410\u0432\u0442\u043E\u0441\u0438\u043D\u0445\u0440\u043E\u043D\u0438\u0437\u0430\u0446\u0438\u044F \u0432\u044B\u043A\u043B\u044E\u0447\u0435\u043D\u0430, \u0430 \u043B\u043E\u043A\u0430\u043B\u044C\u043D\u043E\u0435 \u0441\u043E\u0441\u0442\u043E\u044F\u043D\u0438\u0435 \u0441\u0438\u043D\u0445\u0440\u043E\u043D\u0438\u0437\u0430\u0446\u0438\u0438 \u0441\u0431\u0440\u043E\u0448\u0435\u043D\u043E. \u041F\u0440\u043E\u0432\u0435\u0440\u044C\u0442\u0435 \u0432\u044B\u0431\u043E\u0440 \u0438 \u0437\u0430\u043F\u0443\u0441\u0442\u0438\u0442\u0435 \u043F\u0435\u0440\u0432\u0443\u044E \u0441\u0438\u043D\u0445\u0440\u043E\u043D\u0438\u0437\u0430\u0446\u0438\u044E \u0432\u0440\u0443\u0447\u043D\u0443\u044E.",
    "notice.removeAccessFailed": "\u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u0443\u0434\u0430\u043B\u0438\u0442\u044C \u0434\u043E\u0441\u0442\u0443\u043F: {{message}}",
    "notice.removedAccess": "\u0414\u043E\u0441\u0442\u0443\u043F \u0443\u0434\u0430\u043B\u0451\u043D \u0434\u043B\u044F {{member}}",
    "notice.revokeInviteFailed": "\u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u043E\u0442\u043E\u0437\u0432\u0430\u0442\u044C \u043F\u0440\u0438\u0433\u043B\u0430\u0448\u0435\u043D\u0438\u0435: {{message}}",
    "notice.sharingUpdateFailed": "\u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u043E\u0431\u043D\u043E\u0432\u0438\u0442\u044C \u0434\u043E\u0441\u0442\u0443\u043F: {{message}}",
    "notice.syncAlreadyRunning": "\u0421\u0438\u043D\u0445\u0440\u043E\u043D\u0438\u0437\u0430\u0446\u0438\u044F \u0443\u0436\u0435 \u0432\u044B\u043F\u043E\u043B\u043D\u044F\u0435\u0442\u0441\u044F",
    "notice.syncBootstrapped": "\u041F\u0435\u0440\u0432\u0438\u0447\u043D\u0430\u044F \u0441\u0438\u043D\u0445\u0440\u043E\u043D\u0438\u0437\u0430\u0446\u0438\u044F: \u043F\u043E\u043B\u0443\u0447\u0435\u043D\u043E {{pulled}}, \u043A\u043E\u043D\u0444\u043B\u0438\u043A\u0442\u043E\u0432 {{conflicts}}",
    "notice.syncDone": "\u0421\u0438\u043D\u0445\u0440\u043E\u043D\u0438\u0437\u0430\u0446\u0438\u044F \u0437\u0430\u0432\u0435\u0440\u0448\u0435\u043D\u0430: \u043E\u0442\u043F\u0440\u0430\u0432\u043B\u0435\u043D\u043E {{pushed}}, \u043F\u043E\u043B\u0443\u0447\u0435\u043D\u043E {{pulled}}, \u043A\u043E\u043D\u0444\u043B\u0438\u043A\u0442\u043E\u0432 {{conflicts}}",
    "notice.syncDoneWithWarning": "\u0421\u0438\u043D\u0445\u0440\u043E\u043D\u0438\u0437\u0430\u0446\u0438\u044F \u0437\u0430\u0432\u0435\u0440\u0448\u0435\u043D\u0430 \u0441 \u043F\u0440\u0435\u0434\u0443\u043F\u0440\u0435\u0436\u0434\u0435\u043D\u0438\u044F\u043C\u0438: \u043E\u0442\u043F\u0440\u0430\u0432\u043B\u0435\u043D\u043E {{pushed}}, \u043F\u043E\u043B\u0443\u0447\u0435\u043D\u043E {{pulled}}, \u043A\u043E\u043D\u0444\u043B\u0438\u043A\u0442\u043E\u0432 {{conflicts}}",
    "notice.syncFailed": "\u041E\u0448\u0438\u0431\u043A\u0430 \u0441\u0438\u043D\u0445\u0440\u043E\u043D\u0438\u0437\u0430\u0446\u0438\u0438: {{message}}",
    "notice.crdtMarkdownBlocked": "\u0421\u043E\u0432\u043C\u0435\u0441\u0442\u043D\u043E\u0435 \u0440\u0435\u0434\u0430\u043A\u0442\u0438\u0440\u043E\u0432\u0430\u043D\u0438\u0435 Markdown \u043E\u0442\u043A\u043B\u044E\u0447\u0435\u043D\u043E: {{reason}}",
    "notice.crdtLeaseHeld": "\u0417\u0430\u043C\u0435\u0442\u043A\u0430 \u0440\u0435\u0434\u0430\u043A\u0442\u0438\u0440\u0443\u0435\u0442\u0441\u044F \u043D\u0430 \u0434\u0440\u0443\u0433\u043E\u043C \u0443\u0441\u0442\u0440\u043E\u0439\u0441\u0442\u0432\u0435; \u043E\u0442\u043F\u0440\u0430\u0432\u043A\u0430 \u0432\u0430\u0448\u0438\u0445 \u043F\u0440\u0430\u0432\u043E\u043A \u0432\u0440\u0435\u043C\u0435\u043D\u043D\u043E \u043F\u0440\u0438\u043E\u0441\u0442\u0430\u043D\u043E\u0432\u043B\u0435\u043D\u0430.",
    "notice.noteNonCrdtRemotePaused": "\u042D\u0442\u0430 \u0437\u0430\u043C\u0435\u0442\u043A\u0430 \u043E\u0442\u043A\u0440\u044B\u0442\u0430 \u043D\u0430 \u0434\u0440\u0443\u0433\u043E\u043C \u0443\u0441\u0442\u0440\u043E\u0439\u0441\u0442\u0432\u0435 \u043F\u0440\u0438 \u0432\u044B\u043A\u043B\u044E\u0447\u0435\u043D\u043D\u043E\u043C CRDT; \u0432\u0445\u043E\u0434\u044F\u0449\u0438\u0435 \u0438\u0437\u043C\u0435\u043D\u0435\u043D\u0438\u044F \u0434\u043B\u044F {{path}} \u043F\u043E\u0441\u0442\u0430\u0432\u043B\u0435\u043D\u044B \u043D\u0430 \u043F\u0430\u0443\u0437\u0443, \u0447\u0442\u043E\u0431\u044B \u043D\u0435 \u043F\u0435\u0440\u0435\u0437\u0430\u043F\u0438\u0441\u0430\u0442\u044C \u0432\u0430\u0448 \u043B\u043E\u043A\u0430\u043B\u044C\u043D\u044B\u0439 \u0442\u0435\u043A\u0441\u0442.",
    "notice.noteReadonly": "\u042D\u0442\u0430 \u0437\u0430\u043C\u0435\u0442\u043A\u0430 \u0441\u0435\u0439\u0447\u0430\u0441 \u0434\u043E\u0441\u0442\u0443\u043F\u043D\u0430 \u0442\u043E\u043B\u044C\u043A\u043E \u0434\u043B\u044F \u0447\u0442\u0435\u043D\u0438\u044F \u043D\u0430 \u044D\u0442\u043E\u043C \u0443\u0441\u0442\u0440\u043E\u0439\u0441\u0442\u0432\u0435: {{reason}}",
    "notice.noteStructuralChangeBlocked": "\u041F\u0435\u0440\u0435\u0438\u043C\u0435\u043D\u043E\u0432\u0430\u043D\u0438\u0435, \u043F\u0435\u0440\u0435\u043C\u0435\u0449\u0435\u043D\u0438\u0435 \u0438\u043B\u0438 \u0443\u0434\u0430\u043B\u0435\u043D\u0438\u0435 \u043D\u0435 \u043E\u0442\u043F\u0440\u0430\u0432\u043B\u0435\u043D\u043E, \u043F\u043E\u0442\u043E\u043C\u0443 \u0447\u0442\u043E \u0437\u0430\u043C\u0435\u0442\u043A\u0430 \u0437\u0430\u0431\u043B\u043E\u043A\u0438\u0440\u043E\u0432\u0430\u043D\u0430 \u0432 \u0434\u0440\u0443\u0433\u043E\u043C \u043A\u043B\u0438\u0435\u043D\u0442\u0435: {{path}}",
    "notice.noteTakeoverDone": "\u0417\u0430\u043F\u0440\u043E\u0448\u0435\u043D \u043F\u0435\u0440\u0435\u0445\u0432\u0430\u0442 \u0431\u043B\u043E\u043A\u0438\u0440\u043E\u0432\u043A\u0438 \u0434\u043B\u044F {{path}}",
    "notice.noteTakeoverPending": "\u041F\u0435\u0440\u0435\u0445\u0432\u0430\u0442 \u0434\u043B\u044F {{path}} \u0437\u0430\u043F\u0440\u043E\u0448\u0435\u043D, \u043D\u043E \u0437\u0430\u043C\u0435\u0442\u043A\u0430 \u0432\u0441\u0451 \u0435\u0449\u0451 \u043F\u043E\u043C\u0435\u0447\u0435\u043D\u0430 \u043A\u0430\u043A read-only.",
    "notice.noteTakeoverUnavailable": "\u0421\u043D\u0430\u0447\u0430\u043B\u0430 \u043E\u0442\u043A\u0440\u043E\u0439\u0442\u0435 \u0441\u0438\u043D\u0445\u0440\u043E\u043D\u0438\u0437\u0438\u0440\u0443\u0435\u043C\u0443\u044E Markdown-\u0437\u0430\u043C\u0435\u0442\u043A\u0443.",
    "notice.telegramCodeCreated": "\u041A\u043E\u0434 \u043F\u0440\u0438\u0432\u044F\u0437\u043A\u0438 Telegram \u0441\u043E\u0437\u0434\u0430\u043D",
    "notice.telegramCodeCreatedWithCode": "\u041A\u043E\u0434 \u043F\u0440\u0438\u0432\u044F\u0437\u043A\u0438 Telegram \u0441\u043E\u0437\u0434\u0430\u043D: {{code}}",
    "notice.telegramCodeFailed": "\u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u0441\u043E\u0437\u0434\u0430\u0442\u044C \u043A\u043E\u0434 Telegram: {{message}}",
    "notice.telegramRevokeFailed": "\u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u043E\u0442\u043E\u0437\u0432\u0430\u0442\u044C Telegram-\u0441\u0432\u044F\u0437\u043A\u0443: {{message}}",
    "notice.telegramRevoked": "Telegram-\u0447\u0430\u0442 {{chatId}} \u043E\u0442\u0432\u044F\u0437\u0430\u043D",
    "notice.vaultInviteCreated": "\u041F\u0440\u0438\u0433\u043B\u0430\u0448\u0435\u043D\u0438\u0435 \u0432 \u0445\u0440\u0430\u043D\u0438\u043B\u0438\u0449\u0435 \u0441\u043E\u0437\u0434\u0430\u043D\u043E \u0434\u043B\u044F {{email}}",
    "notice.vaultInviteRevoked": "\u041F\u0440\u0438\u0433\u043B\u0430\u0448\u0435\u043D\u0438\u0435 \u043E\u0442\u043E\u0437\u0432\u0430\u043D\u043E \u0434\u043B\u044F {{email}}",
    "notice.vaultAccessUpdated": "\u0414\u043E\u0441\u0442\u0443\u043F \u043A \u0445\u0440\u0430\u043D\u0438\u043B\u0438\u0449\u0443 \u043E\u0431\u043D\u043E\u0432\u043B\u0451\u043D \u0434\u043B\u044F {{email}}",
    "invite.status.accepted": "\u043F\u0440\u0438\u043D\u044F\u0442\u043E",
    "invite.status.expired": "\u0438\u0441\u0442\u0435\u043A\u043B\u043E",
    "invite.status.pending": "\u043F\u0440\u0438\u0433\u043B\u0430\u0448\u0435\u043D\u0438\u0435 \u043D\u0430\u043F\u0440\u0430\u0432\u043B\u0435\u043D\u043E, \u043E\u0436\u0438\u0434\u0430\u0435\u0442 \u043F\u0440\u0438\u043D\u044F\u0442\u0438\u044F",
    "invite.status.revoked": "\u043E\u0442\u043E\u0437\u0432\u0430\u043D\u043E",
    "role.editor": "\u0440\u0435\u0434\u0430\u043A\u0442\u043E\u0440",
    "role.member": "\u0443\u0447\u0430\u0441\u0442\u043D\u0438\u043A",
    "role.owner": "\u0432\u043B\u0430\u0434\u0435\u043B\u0435\u0446",
    "role.viewer": "\u043F\u0440\u043E\u0441\u043C\u043E\u0442\u0440",
    "settings.accessibleVaults": "\u0414\u043E\u0441\u0442\u0443\u043F\u043D\u044B\u0435 \u0445\u0440\u0430\u043D\u0438\u043B\u0438\u0449\u0430",
    "settings.accessibleVaultsDesc": "\u042D\u0442\u043E \u0445\u0440\u0430\u043D\u0438\u043B\u0438\u0449\u0430, \u043A \u043A\u043E\u0442\u043E\u0440\u044B\u043C \u0443 \u0432\u0430\u0448\u0435\u0433\u043E \u0430\u043A\u043A\u0430\u0443\u043D\u0442\u0430 \u0443\u0436\u0435 \u0435\u0441\u0442\u044C \u0434\u043E\u0441\u0442\u0443\u043F, \u0432\u043A\u043B\u044E\u0447\u0430\u044F \u043F\u0440\u0438\u043D\u044F\u0442\u044B\u0435 \u043F\u0440\u0438\u0433\u043B\u0430\u0448\u0435\u043D\u0438\u044F. \u0412\u044B\u0431\u0435\u0440\u0438\u0442\u0435 \u0442\u043E, \u043A\u043E\u0442\u043E\u0440\u043E\u0435 \u043D\u0443\u0436\u043D\u043E \u043E\u0442\u043A\u0440\u044B\u0442\u044C \u0437\u0434\u0435\u0441\u044C.",
    "settings.accessibleVaultsBehavior": "\u041D\u0438\u0447\u0435\u0433\u043E \u043D\u0435 \u043F\u0440\u0438\u0432\u044F\u0437\u044B\u0432\u0430\u0435\u0442\u0441\u044F, \u043F\u043E\u043A\u0430 \u0432\u044B \u043D\u0435 \u043D\u0430\u0436\u043C\u0451\u0442\u0435 \xAB\u041F\u043E\u0434\u043A\u043B\u044E\u0447\u0438\u0442\u044C \u0441\u044E\u0434\u0430\xBB. \u0415\u0441\u043B\u0438 \u043E\u0431\u0449\u0438\u0435 \u0437\u0430\u043C\u0435\u0442\u043A\u0438 \u0434\u043E\u043B\u0436\u043D\u044B \u0436\u0438\u0442\u044C \u043E\u0442\u0434\u0435\u043B\u044C\u043D\u043E, \u0441\u043D\u0430\u0447\u0430\u043B\u0430 \u043E\u0442\u043A\u0440\u043E\u0439\u0442\u0435 \u0438\u043B\u0438 \u0441\u043E\u0437\u0434\u0430\u0439\u0442\u0435 \u043E\u0442\u0434\u0435\u043B\u044C\u043D\u044B\u0439 Obsidian vault, \u0437\u0430\u0442\u0435\u043C \u043D\u0430\u0436\u043C\u0438\u0442\u0435 \xAB\u041F\u043E\u0434\u043A\u043B\u044E\u0447\u0438\u0442\u044C \u0441\u044E\u0434\u0430\xBB \u0443\u0436\u0435 \u0438\u0437 \u043D\u0435\u0433\u043E.",
    "settings.accessToken": "\u0422\u043E\u043A\u0435\u043D \u0434\u043E\u0441\u0442\u0443\u043F\u0430",
    "settings.accessTokenDesc": "Bearer-\u0442\u043E\u043A\u0435\u043D \u0434\u043B\u044F \u0437\u0430\u0449\u0438\u0449\u0451\u043D\u043D\u044B\u0445 \u043C\u0430\u0440\u0448\u0440\u0443\u0442\u043E\u0432 \u0441\u0435\u0440\u0432\u0435\u0440\u0430",
    "settings.accountSetup": "\u041D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0430 \u0430\u043A\u043A\u0430\u0443\u043D\u0442\u0430",
    "settings.advancedSettings": "\u041F\u0440\u043E\u0434\u0432\u0438\u043D\u0443\u0442\u044B\u0435 \u043D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438",
    "settings.advancedSettingsDesc": "\u0420\u0435\u0434\u043A\u043E \u043D\u0443\u0436\u043D\u044B\u0435 \u043F\u043E\u043B\u044F \u0434\u043B\u044F \u0434\u0438\u0430\u0433\u043D\u043E\u0441\u0442\u0438\u043A\u0438, \u043F\u043E\u0434\u0434\u0435\u0440\u0436\u043A\u0438 \u0438 \u043D\u0435\u0441\u0442\u0430\u043D\u0434\u0430\u0440\u0442\u043D\u043E\u0433\u043E publish scope. \u0411\u043E\u043B\u044C\u0448\u0438\u043D\u0441\u0442\u0432\u0443 \u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u0435\u0439 \u044D\u0442\u043E\u0442 \u0440\u0430\u0437\u0434\u0435\u043B \u043D\u0435 \u043D\u0443\u0436\u0435\u043D.",
    "settings.autoGenerated": "\u0437\u0430\u043F\u043E\u043B\u043D\u044F\u0435\u0442\u0441\u044F \u0430\u0432\u0442\u043E\u043C\u0430\u0442\u0438\u0447\u0435\u0441\u043A\u0438",
    "settings.autoSync": "\u0410\u0432\u0442\u043E\u0441\u0438\u043D\u0445\u0440\u043E\u043D\u0438\u0437\u0430\u0446\u0438\u044F",
    "settings.autoSyncDesc": "\u0421\u0438\u043D\u0445\u0440\u043E\u043D\u0438\u0437\u0438\u0440\u043E\u0432\u0430\u0442\u044C \u0438\u0437\u043C\u0435\u043D\u0435\u043D\u0438\u044F \u0445\u0440\u0430\u043D\u0438\u043B\u0438\u0449\u0430 \u0430\u0432\u0442\u043E\u043C\u0430\u0442\u0438\u0447\u0435\u0441\u043A\u0438, \u043F\u043E\u043A\u0430 Obsidian \u043E\u0442\u043A\u0440\u044B\u0442",
    "settings.syncObsidianConfig": "\u0421\u0438\u043D\u0445\u0440\u043E\u043D\u0438\u0437\u0438\u0440\u043E\u0432\u0430\u0442\u044C \u043D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438 \u0438 \u043F\u043B\u0430\u0433\u0438\u043D\u044B Obsidian",
    "settings.syncObsidianConfigDesc": "\u041E\u0431\u043C\u0435\u043D\u0438\u0432\u0430\u0442\u044C \u043D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438 .obsidian, \u0442\u0435\u043C\u044B, \u0441\u043D\u0438\u043F\u043F\u0435\u0442\u044B \u0438 \u0441\u0442\u043E\u0440\u043E\u043D\u043D\u0438\u0435 \u043F\u043B\u0430\u0433\u0438\u043D\u044B. \u0421\u043D\u0430\u0447\u0430\u043B\u0430 \u0432\u043A\u043B\u044E\u0447\u0438\u0442\u0435 \u043D\u0430 \u0443\u0441\u0442\u0440\u043E\u0439\u0441\u0442\u0432\u0435-\u0438\u0441\u0442\u043E\u0447\u043D\u0438\u043A\u0435, \u0437\u0430\u0442\u0435\u043C \u043D\u0430 \u043E\u0441\u0442\u0430\u043B\u044C\u043D\u044B\u0445: \u043F\u0440\u0438 \u043F\u0435\u0440\u0432\u043E\u043C \u043E\u0431\u043C\u0435\u043D\u0435 \u0443\u0436\u0435 \u0437\u0430\u0433\u0440\u0443\u0436\u0435\u043D\u043D\u044B\u0435 \u0441\u0435\u0440\u0432\u0435\u0440\u043D\u044B\u0435 \u0444\u0430\u0439\u043B\u044B \u043F\u0440\u0438\u043E\u0440\u0438\u0442\u0435\u0442\u043D\u0435\u0435. \u0420\u0430\u0431\u043E\u0447\u0435\u0435 \u043F\u0440\u043E\u0441\u0442\u0440\u0430\u043D\u0441\u0442\u0432\u043E \u0438 \u043B\u043E\u043A\u0430\u043B\u044C\u043D\u044B\u0435 \u0434\u0430\u043D\u043D\u044B\u0435 \u0441\u0430\u043C\u043E\u0433\u043E \u0441\u0438\u043D\u0445\u0440\u043E\u043D\u0438\u0437\u0430\u0442\u043E\u0440\u0430 \u043D\u0435 \u043F\u0435\u0440\u0435\u0434\u0430\u044E\u0442\u0441\u044F; \u043F\u043E\u0441\u043B\u0435 \u0438\u0437\u043C\u0435\u043D\u0435\u043D\u0438\u044F \u0444\u0430\u0439\u043B\u043E\u0432 \u043F\u043B\u0430\u0433\u0438\u043D\u043E\u0432 \u043F\u0435\u0440\u0435\u0437\u0430\u043F\u0443\u0441\u0442\u0438\u0442\u0435 Obsidian.",
    "settings.crdtMarkdownEnabled": "\u0421\u043E\u0432\u043C\u0435\u0441\u0442\u043D\u043E\u0435 \u0440\u0435\u0434\u0430\u043A\u0442\u0438\u0440\u043E\u0432\u0430\u043D\u0438\u0435 Markdown",
    "settings.crdtMarkdownEnabledDesc": "\u0418\u0441\u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u044C CRDT-\u043A\u0430\u043D\u0430\u043B \u0434\u043B\u044F .md-\u0444\u0430\u0439\u043B\u043E\u0432, \u0447\u0442\u043E\u0431\u044B \u043E\u0434\u043D\u043E\u0432\u0440\u0435\u043C\u0435\u043D\u043D\u044B\u0435 \u043F\u0440\u0430\u0432\u043A\u0438 \u0441\u043B\u0438\u0432\u0430\u043B\u0438\u0441\u044C \u0431\u0435\u0437 whole-file 409 \u043A\u043E\u043D\u0444\u043B\u0438\u043A\u0442\u043E\u0432. \u0412\u0441\u0435 \u0443\u0441\u0442\u0440\u043E\u0439\u0441\u0442\u0432\u0430 \u044D\u0442\u043E\u0433\u043E vault \u0434\u043E\u043B\u0436\u043D\u044B \u0440\u0430\u0431\u043E\u0442\u0430\u0442\u044C \u043D\u0430 \u043E\u0431\u043D\u043E\u0432\u043B\u0435\u043D\u043D\u043E\u043C \u043F\u043B\u0430\u0433\u0438\u043D\u0435.",
    "settings.crdtMarkdownBlockedHint": "\u0421\u0435\u0439\u0447\u0430\u0441 \u043D\u0435\u0434\u043E\u0441\u0442\u0443\u043F\u043D\u043E: {{reason}}",
    "settings.backendUrl": "URL \u0441\u0435\u0440\u0432\u0435\u0440\u0430",
    "settings.backendUrlDesc": "\u041D\u0430\u043F\u0440\u0438\u043C\u0435\u0440: http://45.144.65.18",
    "settings.basicSyncDesc": "\u042D\u0442\u0438\u0445 \u043D\u0430\u0441\u0442\u0440\u043E\u0435\u043A \u0434\u043E\u0441\u0442\u0430\u0442\u043E\u0447\u043D\u043E \u0434\u043B\u044F \u043F\u0435\u0440\u0441\u043E\u043D\u0430\u043B\u044C\u043D\u043E\u0439 \u0441\u0438\u043D\u0445\u0440\u043E\u043D\u0438\u0437\u0430\u0446\u0438\u0438 \u043C\u0435\u0436\u0434\u0443 \u0441\u0432\u043E\u0438\u043C\u0438 \u0443\u0441\u0442\u0440\u043E\u0439\u0441\u0442\u0432\u0430\u043C\u0438.",
    "settings.colleagueEmail": "Email \u043A\u043E\u043B\u043B\u0435\u0433\u0438",
    "settings.colleagueEmailDesc": "Email \u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044F, \u043A\u043E\u0442\u043E\u0440\u043E\u043C\u0443 \u043D\u0443\u0436\u0435\u043D \u0434\u043E\u0441\u0442\u0443\u043F \u043A \u044D\u0442\u043E\u043C\u0443 \u0445\u0440\u0430\u043D\u0438\u043B\u0438\u0449\u0443",
    "settings.connectedTelegramChats": "\u041F\u043E\u0434\u043A\u043B\u044E\u0447\u0451\u043D\u043D\u044B\u0435 Telegram-\u0447\u0430\u0442\u044B",
    "settings.currentLocalVault": "\u0422\u0435\u043A\u0443\u0449\u0438\u0439 \u043B\u043E\u043A\u0430\u043B\u044C\u043D\u044B\u0439 vault: {{vaultName}}",
    "settings.connectCurrentVault": "\u041F\u043E\u0434\u043A\u043B\u044E\u0447\u0438\u0442\u044C \u0442\u0435\u043A\u0443\u0449\u0438\u0439 \u043B\u043E\u043A\u0430\u043B\u044C\u043D\u044B\u0439 vault",
    "settings.connectCurrentVaultDesc": "\u0412\u044B\u0431\u0440\u0430\u043D\u043D\u044B\u0439 server vault \u0438 \u043F\u0430\u043F\u043A\u0438 \u0431\u0443\u0434\u0443\u0442 \u0441\u0438\u043D\u0445\u0440\u043E\u043D\u0438\u0437\u0438\u0440\u043E\u0432\u0430\u0442\u044C\u0441\u044F \u0432 \u0442\u0435\u043A\u0443\u0449\u0438\u0439 \u043E\u0442\u043A\u0440\u044B\u0442\u044B\u0439 Obsidian vault. \u0415\u0441\u043B\u0438 \u043D\u0443\u0436\u0435\u043D \u043E\u0442\u0434\u0435\u043B\u044C\u043D\u044B\u0439 \u043B\u043E\u043A\u0430\u043B\u044C\u043D\u044B\u0439 vault, \u0441\u043D\u0430\u0447\u0430\u043B\u0430 \u0441\u043E\u0437\u0434\u0430\u0439\u0442\u0435 \u0438\u043B\u0438 \u043E\u0442\u043A\u0440\u043E\u0439\u0442\u0435 \u0435\u0433\u043E \u0432 Obsidian, \u0443\u0441\u0442\u0430\u043D\u043E\u0432\u0438\u0442\u0435 \u0442\u0430\u043C \u044D\u0442\u043E\u0442 \u043F\u043B\u0430\u0433\u0438\u043D, \u0437\u0430\u0442\u0435\u043C \u043F\u043E\u0434\u043A\u043B\u044E\u0447\u0438\u0442\u0435 \u0435\u0433\u043E.",
    "settings.connectSharedVaultDesc": "\u041F\u043E\u0434\u043A\u043B\u044E\u0447\u0430\u0435\u0442 \u0432\u044B\u0431\u0440\u0430\u043D\u043D\u043E\u0435 \u043E\u0431\u0449\u0435\u0435 \u0445\u0440\u0430\u043D\u0438\u043B\u0438\u0449\u0435 \u043A Obsidian vault, \u043A\u043E\u0442\u043E\u0440\u044B\u0439 \u0441\u0435\u0439\u0447\u0430\u0441 \u043E\u0442\u043A\u0440\u044B\u0442 \u043D\u0430 \u044D\u0442\u043E\u043C \u0443\u0441\u0442\u0440\u043E\u0439\u0441\u0442\u0432\u0435. \u041F\u0435\u0440\u0432\u0430\u044F \u0441\u0438\u043D\u0445\u0440\u043E\u043D\u0438\u0437\u0430\u0446\u0438\u044F \u043E\u0441\u0442\u0430\u0451\u0442\u0441\u044F \u0440\u0443\u0447\u043D\u043E\u0439, \u0447\u0442\u043E\u0431\u044B \u0441\u043B\u0443\u0447\u0430\u0439\u043D\u043E \u043D\u0435 \u0441\u043C\u0435\u0448\u0430\u0442\u044C \u043B\u043E\u043A\u0430\u043B\u044C\u043D\u044B\u0435 \u0437\u0430\u043C\u0435\u0442\u043A\u0438.",
    "settings.connectedServerVault": "\u041F\u043E\u0434\u043A\u043B\u044E\u0447\u0451\u043D\u043D\u044B\u0439 server vault: {{vault}}",
    "settings.currentDevice": "\u0422\u0435\u043A\u0443\u0449\u0435\u0435 \u0443\u0441\u0442\u0440\u043E\u0439\u0441\u0442\u0432\u043E: {{deviceId}}",
    "settings.currentMembers": "\u0422\u0435\u043A\u0443\u0449\u0438\u0435 \u0443\u0447\u0430\u0441\u0442\u043D\u0438\u043A\u0438",
    "settings.deviceId": "ID \u0443\u0441\u0442\u0440\u043E\u0439\u0441\u0442\u0432\u0430",
    "settings.deviceIdDesc": "\u0417\u0430\u043F\u043E\u043B\u043D\u044F\u0435\u0442\u0441\u044F \u0430\u0432\u0442\u043E\u043C\u0430\u0442\u0438\u0447\u0435\u0441\u043A\u0438 \u043F\u043E\u0441\u043B\u0435 \u0440\u0435\u0433\u0438\u0441\u0442\u0440\u0430\u0446\u0438\u0438 \u0443\u0441\u0442\u0440\u043E\u0439\u0441\u0442\u0432\u0430",
    "settings.deviceName": "\u0418\u043C\u044F \u0443\u0441\u0442\u0440\u043E\u0439\u0441\u0442\u0432\u0430",
    "settings.deviceNameDesc": "\u041F\u043E\u043D\u044F\u0442\u043D\u043E\u0435 \u0438\u043C\u044F \u0443\u0441\u0442\u0440\u043E\u0439\u0441\u0442\u0432\u0430 \u043D\u0430 \u0441\u0435\u0440\u0432\u0435\u0440\u0435",
    "settings.expiresAt": "\u0418\u0441\u0442\u0435\u043A\u0430\u0435\u0442: {{expiresAt}}",
    "settings.ignorePaths": "\u0418\u0433\u043D\u043E\u0440\u0438\u0440\u0443\u0435\u043C\u044B\u0435 \u043F\u0443\u0442\u0438",
    "settings.ignorePathsDesc": "\u041E\u0434\u0438\u043D \u043F\u0443\u0442\u044C \u0438\u043B\u0438 \u043F\u0440\u0435\u0444\u0438\u043A\u0441 \u043D\u0430 \u0441\u0442\u0440\u043E\u043A\u0443. \u041F\u0440\u0435\u0444\u0438\u043A\u0441\u044B \u0434\u043E\u043B\u0436\u043D\u044B \u0437\u0430\u043A\u0430\u043D\u0447\u0438\u0432\u0430\u0442\u044C\u0441\u044F \u043D\u0430 '/'.",
    "settings.language": "\u042F\u0437\u044B\u043A \u0438\u043D\u0442\u0435\u0440\u0444\u0435\u0439\u0441\u0430",
    "settings.languageDesc": "\u042F\u0437\u044B\u043A \u043D\u0430\u0441\u0442\u0440\u043E\u0435\u043A, \u043A\u043E\u043C\u0430\u043D\u0434 \u0438 \u0443\u0432\u0435\u0434\u043E\u043C\u043B\u0435\u043D\u0438\u0439 \u043F\u043B\u0430\u0433\u0438\u043D\u0430",
    "settings.lastCode": "\u041F\u043E\u0441\u043B\u0435\u0434\u043D\u0438\u0439 \u043A\u043E\u0434: {{code}}",
    "settings.lastErrorSuffix": " | \u041F\u043E\u0441\u043B\u0435\u0434\u043D\u044F\u044F \u043E\u0448\u0438\u0431\u043A\u0430: {{message}}",
    "settings.lastSyncWarningSuffix": " | \u041F\u043E\u0441\u043B\u0435\u0434\u043D\u0435\u0435 \u043F\u0440\u0435\u0434\u0443\u043F\u0440\u0435\u0436\u0434\u0435\u043D\u0438\u0435: {{message}}",
    "settings.lastSyncStatus": "\u041F\u043E\u0441\u043B\u0435\u0434\u043D\u044F\u044F \u0441\u0438\u043D\u0445\u0440\u043E\u043D\u0438\u0437\u0430\u0446\u0438\u044F: {{lastSyncAt}}{{lastErrorSuffix}}{{lastWarningSuffix}}",
    "settings.loadMembershipsFailed": "\u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u0437\u0430\u0433\u0440\u0443\u0437\u0438\u0442\u044C \u0443\u0447\u0430\u0441\u0442\u043D\u0438\u043A\u043E\u0432: {{message}}",
    "settings.loadTelegramFailed": "\u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u0437\u0430\u0433\u0440\u0443\u0437\u0438\u0442\u044C Telegram-\u0441\u0432\u044F\u0437\u043A\u0438: {{message}}",
    "settings.loginCode": "\u041A\u043E\u0434 \u0432\u0445\u043E\u0434\u0430",
    "settings.loginCodeDesc": "\u0412\u0432\u0435\u0434\u0438\u0442\u0435 \u043E\u0434\u043D\u043E\u0440\u0430\u0437\u043E\u0432\u044B\u0439 \u043A\u043E\u0434, \u043E\u0442\u043F\u0440\u0430\u0432\u043B\u0435\u043D\u043D\u044B\u0439 \u043D\u0430 email",
    "settings.loginCodeDevDesc": "\u0412\u0432\u0435\u0434\u0438\u0442\u0435 \u043E\u0434\u043D\u043E\u0440\u0430\u0437\u043E\u0432\u044B\u0439 \u043A\u043E\u0434, \u043E\u0442\u043F\u0440\u0430\u0432\u043B\u0435\u043D\u043D\u044B\u0439 \u043D\u0430 email. \u0422\u0435\u0441\u0442\u043E\u0432\u044B\u0439 \u0441\u0435\u0440\u0432\u0435\u0440 \u043C\u043E\u0436\u0435\u0442 \u043F\u043E\u0434\u0441\u0442\u0430\u0432\u0438\u0442\u044C \u0435\u0433\u043E \u0437\u0434\u0435\u0441\u044C.",
    "settings.loginRequestExpires": "\u041F\u043E\u0441\u043B\u0435\u0434\u043D\u0438\u0439 \u0437\u0430\u043F\u0440\u043E\u0441 \u0438\u0441\u0442\u0435\u043A\u0430\u0435\u0442: {{expiresAt}}",
    "settings.inviteSentReference": "\u041F\u0440\u0438\u0433\u043B\u0430\u0448\u0435\u043D\u0438\u0435 \u043D\u0430\u043F\u0440\u0430\u0432\u043B\u0435\u043D\u043E | \u0420\u043E\u043B\u044C: {{role}} | \u0421\u0442\u0430\u0442\u0443\u0441: {{status}}",
    "settings.memberReference": "\u0420\u043E\u043B\u044C: {{role}}",
    "settings.memberReferenceWithId": "\u0420\u043E\u043B\u044C: {{role}} | ID \u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044F: {{userId}}",
    "settings.membershipsNeedConfig": "\u0417\u0430\u043F\u043E\u043B\u043D\u0438\u0442\u0435 URL \u0441\u0435\u0440\u0432\u0435\u0440\u0430, email \u0438 ID \u0445\u0440\u0430\u043D\u0438\u043B\u0438\u0449\u0430, \u0447\u0442\u043E\u0431\u044B \u0437\u0430\u0433\u0440\u0443\u0437\u0438\u0442\u044C \u0443\u0447\u0430\u0441\u0442\u043D\u0438\u043A\u043E\u0432.",
    "settings.noVaultSelected": "\u0425\u0440\u0430\u043D\u0438\u043B\u0438\u0449\u0435 \u043D\u0430 \u0441\u0435\u0440\u0432\u0435\u0440\u0435 \u043F\u043E\u043A\u0430 \u043D\u0435 \u0432\u044B\u0431\u0440\u0430\u043D\u043E.",
    "settings.noMembers": "\u0423\u0447\u0430\u0441\u0442\u043D\u0438\u043A\u043E\u0432 \u043F\u043E\u043A\u0430 \u043D\u0435\u0442.",
    "settings.noPendingInvites": "\u041E\u0436\u0438\u0434\u0430\u044E\u0449\u0438\u0445 \u043F\u0440\u0438\u0433\u043B\u0430\u0448\u0435\u043D\u0438\u0439 \u043D\u0435\u0442.",
    "settings.noTelegramChats": "Telegram-\u0447\u0430\u0442\u044B \u043F\u043E\u043A\u0430 \u043D\u0435 \u043F\u043E\u0434\u043A\u043B\u044E\u0447\u0435\u043D\u044B.",
    "settings.pendingInvites": "\u041D\u0430\u043F\u0440\u0430\u0432\u043B\u0435\u043D\u043D\u044B\u0435 \u043F\u0440\u0438\u0433\u043B\u0430\u0448\u0435\u043D\u0438\u044F",
    "settings.platform": "\u041F\u043B\u0430\u0442\u0444\u043E\u0440\u043C\u0430",
    "settings.platformDesc": "\u0418\u0434\u0435\u043D\u0442\u0438\u0444\u0438\u043A\u0430\u0442\u043E\u0440 \u043F\u043B\u0430\u0442\u0444\u043E\u0440\u043C\u044B \u0443\u0441\u0442\u0440\u043E\u0439\u0441\u0442\u0432\u0430",
    "settings.pluginUpdate": "\u041E\u0431\u043D\u043E\u0432\u043B\u0435\u043D\u0438\u0435 \u043F\u043B\u0430\u0433\u0438\u043D\u0430",
    "settings.pluginUpdateAvailable": "\u0414\u043E\u0441\u0442\u0443\u043F\u043D\u0430\u044F \u0432\u0435\u0440\u0441\u0438\u044F: {{latestVersion}}",
    "settings.pluginUpdateAvailableBuild": "\u0414\u043E\u0441\u0442\u0443\u043F\u043D\u0430 \u043D\u043E\u0432\u0430\u044F \u0441\u0431\u043E\u0440\u043A\u0430 \u0432\u0435\u0440\u0441\u0438\u0438 {{latestVersion}}",
    "settings.pluginUpdateChecking": "\u041F\u0440\u043E\u0432\u0435\u0440\u043A\u0430...",
    "settings.pluginUpdateCurrent": "\u0423\u0441\u0442\u0430\u043D\u043E\u0432\u043B\u0435\u043D\u0430 \u043F\u043E\u0441\u043B\u0435\u0434\u043D\u044F\u044F \u0432\u0435\u0440\u0441\u0438\u044F: {{latestVersion}}",
    "settings.pluginUpdateDesc": "\u0412\u0435\u0440\u0441\u0438\u044F \u043F\u043B\u0430\u0433\u0438\u043D\u0430: {{currentVersion}}. {{status}}",
    "settings.pluginUpdateFailed": "\u041F\u043E\u0441\u043B\u0435\u0434\u043D\u044F\u044F \u043F\u0440\u043E\u0432\u0435\u0440\u043A\u0430 \u043D\u0435 \u0443\u0434\u0430\u043B\u0430\u0441\u044C: {{message}}",
    "settings.pluginUpdateInstalling": "\u041E\u0431\u043D\u043E\u0432\u043B\u0435\u043D\u0438\u0435...",
    "settings.pluginUpdateNotChecked": "\u041E\u0431\u043D\u043E\u0432\u043B\u0435\u043D\u0438\u044F \u0435\u0449\u0451 \u043D\u0435 \u043F\u0440\u043E\u0432\u0435\u0440\u044F\u043B\u0438\u0441\u044C.",
    "settings.publishCurrentVault": "\u0421\u043E\u0437\u0434\u0430\u0442\u044C server-\u0445\u0440\u0430\u043D\u0438\u043B\u0438\u0449\u0435 \u0438\u0437 \u044D\u0442\u043E\u0433\u043E \u043B\u043E\u043A\u0430\u043B\u044C\u043D\u043E\u0433\u043E vault",
    "settings.publishCurrentVaultDesc": "\u0418\u0441\u043F\u043E\u043B\u044C\u0437\u0443\u0439\u0442\u0435 \u044D\u0442\u043E \u0442\u043E\u043B\u044C\u043A\u043E \u0435\u0441\u043B\u0438 \u0442\u0435\u043A\u0443\u0449\u0435\u0433\u043E \u043E\u0442\u043A\u0440\u044B\u0442\u043E\u0433\u043E \u043B\u043E\u043A\u0430\u043B\u044C\u043D\u043E\u0433\u043E Obsidian vault \u0435\u0449\u0451 \u043D\u0435\u0442 \u043D\u0430 \u0441\u0435\u0440\u0432\u0435\u0440\u0435. \u041A\u043D\u043E\u043F\u043A\u0430 \u0441\u043E\u0437\u0434\u0430\u0451\u0442 \u043D\u043E\u0432\u0443\u044E \u0437\u0430\u043F\u0438\u0441\u044C server-\u0445\u0440\u0430\u043D\u0438\u043B\u0438\u0449\u0430 \u0438\u0437 \u043B\u043E\u043A\u0430\u043B\u044C\u043D\u043E\u0433\u043E vault. \u0415\u0441\u043B\u0438 server-\u0445\u0440\u0430\u043D\u0438\u043B\u0438\u0449\u0435 \u0443\u0436\u0435 \u0441\u0443\u0449\u0435\u0441\u0442\u0432\u0443\u0435\u0442, \u043F\u0440\u043E\u0441\u0442\u043E \u043F\u0440\u043E\u0441\u043A\u0430\u043D\u0438\u0440\u0443\u0439\u0442\u0435 \u0438 \u0432\u044B\u0431\u0435\u0440\u0438\u0442\u0435 \u0435\u0433\u043E \u043D\u0438\u0436\u0435.",
    "settings.publishCurrentVaultAvailableDesc": "\u0423 \u0430\u043A\u043A\u0430\u0443\u043D\u0442\u0430 \u0443\u0436\u0435 \u0435\u0441\u0442\u044C \u0434\u043E\u0441\u0442\u0443\u043F\u043D\u044B\u0435 server-\u0445\u0440\u0430\u043D\u0438\u043B\u0438\u0449\u0430. \u041F\u043E\u0434\u043A\u043B\u044E\u0447\u0438\u0442\u0435 \u043E\u0434\u043D\u043E \u0438\u0437 \u043D\u0438\u0445 \u043D\u0438\u0436\u0435 \u0438\u043B\u0438 \u0441\u043E\u0437\u0434\u0430\u0439\u0442\u0435 \u0435\u0449\u0451 \u043E\u0434\u043D\u043E, \u0435\u0441\u043B\u0438 \u044D\u0442\u043E \u043F\u043E\u0437\u0432\u043E\u043B\u044F\u0435\u0442 \u0442\u0430\u0440\u0438\u0444.",
    "settings.publishCurrentVaultHiddenDesc": "\u042D\u0442\u043E\u0442 \u043B\u043E\u043A\u0430\u043B\u044C\u043D\u044B\u0439 vault \u0443\u0436\u0435 \u043F\u0440\u0438\u0432\u044F\u0437\u0430\u043D \u043A server-\u0445\u0440\u0430\u043D\u0438\u043B\u0438\u0449\u0443. \u0415\u0441\u043B\u0438 \u043D\u0443\u0436\u0435\u043D \u0434\u0440\u0443\u0433\u043E\u0439 target, \u0432\u044B\u0431\u0435\u0440\u0438\u0442\u0435 \u0435\u0433\u043E \u0432 \u0441\u043F\u0438\u0441\u043A\u0435 \u043D\u0438\u0436\u0435, \u0430 \u043D\u0435 \u0441\u043E\u0437\u0434\u0430\u0432\u0430\u0439\u0442\u0435 \u043D\u043E\u0432\u043E\u0435 \u0445\u0440\u0430\u043D\u0438\u043B\u0438\u0449\u0435 \u0437\u0434\u0435\u0441\u044C.",
    "settings.quickStart": "\u0411\u044B\u0441\u0442\u0440\u044B\u0439 \u0441\u0442\u0430\u0440\u0442",
    "settings.quickStartDesc": "\u0421\u043D\u0430\u0447\u0430\u043B\u0430 \u043F\u0440\u043E\u0439\u0434\u0438\u0442\u0435 \u043E\u0431\u044F\u0437\u0430\u0442\u0435\u043B\u044C\u043D\u044B\u0435 \u0448\u0430\u0433\u0438. \u0414\u043E\u0441\u0442\u0443\u043F \u043A\u043E\u043B\u043B\u0435\u0433\u0430\u043C, Telegram \u0438 \u0441\u043B\u0443\u0436\u0435\u0431\u043D\u044B\u0435 \u043F\u043E\u043B\u044F \u043C\u043E\u0436\u043D\u043E \u043D\u0430\u0441\u0442\u0440\u043E\u0438\u0442\u044C \u043F\u043E\u0437\u0436\u0435, \u043A\u043E\u0433\u0434\u0430 \u043F\u0435\u0440\u0441\u043E\u043D\u0430\u043B\u044C\u043D\u0430\u044F \u0441\u0438\u043D\u0445\u0440\u043E\u043D\u0438\u0437\u0430\u0446\u0438\u044F \u0443\u0436\u0435 \u0440\u0430\u0431\u043E\u0442\u0430\u0435\u0442.",
    "settings.refreshAccount": "\u041E\u0431\u043D\u043E\u0432\u0438\u0442\u044C \u0430\u043A\u043A\u0430\u0443\u043D\u0442",
    "settings.refreshAccountDesc": "\u0421\u043B\u0443\u0436\u0435\u0431\u043D\u043E\u0435 \u0434\u0435\u0439\u0441\u0442\u0432\u0438\u0435. \u041F\u043E\u0432\u0442\u043E\u0440\u043D\u043E \u0447\u0438\u0442\u0430\u0435\u0442 \u0441\u043E\u0445\u0440\u0430\u043D\u0451\u043D\u043D\u0443\u044E \u0441\u0435\u0441\u0441\u0438\u044E \u0438 \u0432\u043E\u0441\u0441\u0442\u0430\u043D\u0430\u0432\u043B\u0438\u0432\u0430\u0435\u0442 \u0434\u0430\u043D\u043D\u044B\u0435 \u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044F \u0438 \u0443\u0441\u0442\u0440\u043E\u0439\u0441\u0442\u0432\u0430, \u0435\u0441\u043B\u0438 \u0438\u043D\u0442\u0435\u0440\u0444\u0435\u0439\u0441 \u0438\u0445 \u043F\u043E\u0442\u0435\u0440\u044F\u043B. \u041E\u0431\u044B\u0447\u043D\u043E \u0432 \u043F\u043E\u0432\u0441\u0435\u0434\u043D\u0435\u0432\u043D\u043E\u0439 \u0441\u0438\u043D\u0445\u0440\u043E\u043D\u0438\u0437\u0430\u0446\u0438\u0438 \u043D\u0435 \u0442\u0440\u0435\u0431\u0443\u0435\u0442\u0441\u044F.",
    "settings.refreshToken": "\u0422\u043E\u043A\u0435\u043D \u043E\u0431\u043D\u043E\u0432\u043B\u0435\u043D\u0438\u044F",
    "settings.refreshTokenDesc": "\u0422\u043E\u043A\u0435\u043D \u0434\u043B\u044F \u043E\u0431\u043D\u043E\u0432\u043B\u0435\u043D\u0438\u044F \u0442\u043E\u043A\u0435\u043D\u0430 \u0434\u043E\u0441\u0442\u0443\u043F\u0430 \u043F\u043E\u0441\u043B\u0435 \u043E\u0442\u0432\u0435\u0442\u0430 401",
    "settings.requestLoginCode": "\u0417\u0430\u043F\u0440\u043E\u0441\u0438\u0442\u044C \u043A\u043E\u0434 \u0432\u0445\u043E\u0434\u0430",
    "settings.requestLoginCodeDesc": "\u0421\u0435\u0440\u0432\u0435\u0440 \u043E\u0442\u043F\u0440\u0430\u0432\u0438\u0442 \u043E\u0434\u043D\u043E\u0440\u0430\u0437\u043E\u0432\u044B\u0439 \u043A\u043E\u0434 \u0432\u0445\u043E\u0434\u0430 \u043D\u0430 \u044D\u0442\u043E\u0442 email",
    "settings.reconnectCurrentVaultDesc": "\u0421\u043C\u0435\u043D\u0430 server vault \u0438\u043B\u0438 \u043F\u0430\u043F\u043E\u043A \u0441\u0431\u0440\u043E\u0441\u0438\u0442 \u043B\u043E\u043A\u0430\u043B\u044C\u043D\u043E\u0435 \u0441\u043E\u0441\u0442\u043E\u044F\u043D\u0438\u0435 \u0441\u0438\u043D\u0445\u0440\u043E\u043D\u0438\u0437\u0430\u0446\u0438\u0438 \u0438 \u0432\u044B\u043A\u043B\u044E\u0447\u0438\u0442 auto-sync. \u041F\u0435\u0440\u0432\u0443\u044E \u0441\u0438\u043D\u0445\u0440\u043E\u043D\u0438\u0437\u0430\u0446\u0438\u044E \u043D\u0443\u0436\u043D\u043E \u0437\u0430\u043F\u0443\u0441\u0442\u0438\u0442\u044C \u0432\u0440\u0443\u0447\u043D\u0443\u044E.",
    "settings.runSyncNow": "\u0417\u0430\u043F\u0443\u0441\u0442\u0438\u0442\u044C \u0441\u0438\u043D\u0445\u0440\u043E\u043D\u0438\u0437\u0430\u0446\u0438\u044E",
    "settings.serverSyncFolders": "\u041F\u0430\u043F\u043A\u0438 \u0441\u0435\u0440\u0432\u0435\u0440\u0430 \u0434\u043B\u044F \u0441\u0438\u043D\u0445\u0440\u043E\u043D\u0438\u0437\u0430\u0446\u0438\u0438",
    "settings.serverSyncFoldersDesc": "\u041E\u0434\u043D\u0430 \u043F\u0430\u043F\u043A\u0430 server vault \u043D\u0430 \u0441\u0442\u0440\u043E\u043A\u0443. \u041E\u0441\u0442\u0430\u0432\u044C\u0442\u0435 \u043F\u043E\u043B\u0435 \u043F\u0443\u0441\u0442\u044B\u043C, \u0447\u0442\u043E\u0431\u044B \u0441\u0438\u043D\u0445\u0440\u043E\u043D\u0438\u0437\u0438\u0440\u043E\u0432\u0430\u0442\u044C \u0432\u0435\u0441\u044C \u0432\u044B\u0431\u0440\u0430\u043D\u043D\u044B\u0439 server vault \u0432 \u0442\u0435\u043A\u0443\u0449\u0438\u0439 \u043E\u0442\u043A\u0440\u044B\u0442\u044B\u0439 Obsidian vault. \u042D\u0442\u0438 \u043F\u0430\u043F\u043A\u0438 \u043F\u0440\u0438\u043C\u0435\u043D\u044F\u044E\u0442\u0441\u044F \u043F\u0440\u0438 \u043F\u043E\u0434\u043A\u043B\u044E\u0447\u0435\u043D\u0438\u0438 \u0438\u043B\u0438 \u043F\u0435\u0440\u0435\u043F\u043E\u0434\u043A\u043B\u044E\u0447\u0435\u043D\u0438\u0438 \u043B\u043E\u043A\u0430\u043B\u044C\u043D\u043E\u0433\u043E vault.",
    "settings.serverSyncFoldersInviteDesc": "\u042D\u0442\u0438 \u043F\u0430\u043F\u043A\u0438 \u043F\u0440\u0438\u0448\u043B\u0438 \u0438\u0437 \u043F\u0440\u0438\u043D\u044F\u0442\u043E\u0433\u043E \u043F\u0440\u0438\u0433\u043B\u0430\u0448\u0435\u043D\u0438\u044F \u0438\u043B\u0438 \u043F\u0440\u0430\u0432 \u0434\u043E\u0441\u0442\u0443\u043F\u0430 \u0438 \u0437\u0434\u0435\u0441\u044C \u043D\u0435 \u043C\u0435\u043D\u044F\u044E\u0442\u0441\u044F.",
    "settings.sharedAccessReady": "\u0414\u043E\u0441\u0442\u0443\u043F \u0443\u0436\u0435 \u043E\u0442\u043A\u0440\u044B\u0442",
    "settings.sharedAccessReadyDesc": "\u0412\u0430\u0448 \u0430\u043A\u043A\u0430\u0443\u043D\u0442 \u043C\u043E\u0436\u0435\u0442 \u043E\u0442\u043A\u0440\u044B\u0442\u044C \xAB{{vault}}\xBB \u0441 \u0440\u043E\u043B\u044C\u044E {{role}}. \u0414\u043E\u0441\u0442\u0443\u043F: {{scope}}.",
    "settings.sharedAccessReadyDescWithInviter": "{{inviter}} \u043E\u0442\u043A\u0440\u044B\u043B \u0432\u0430\u043C \xAB{{vault}}\xBB \u0441 \u0440\u043E\u043B\u044C\u044E {{role}}. \u0414\u043E\u0441\u0442\u0443\u043F: {{scope}}.",
    "settings.setupStepAccount": "\u0423\u043A\u0430\u0437\u0430\u043D email \u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044F",
    "settings.setupStepLogin": "\u0412\u0445\u043E\u0434 \u0437\u0430\u0432\u0435\u0440\u0448\u0451\u043D \u0438 \u0443\u0441\u0442\u0440\u043E\u0439\u0441\u0442\u0432\u043E \u0437\u0430\u0440\u0435\u0433\u0438\u0441\u0442\u0440\u0438\u0440\u043E\u0432\u0430\u043D\u043E",
    "settings.setupStepOptional": "\u0414\u043E\u0441\u0442\u0443\u043F \u043A\u043E\u043B\u043B\u0435\u0433\u0430\u043C \u0438 Telegram \u043C\u043E\u0436\u043D\u043E \u043F\u043E\u0434\u043A\u043B\u044E\u0447\u0430\u0442\u044C \u0443\u0436\u0435 \u043F\u043E\u0441\u043B\u0435 \u0437\u0430\u043F\u0443\u0441\u043A\u0430 \u043F\u0435\u0440\u0441\u043E\u043D\u0430\u043B\u044C\u043D\u043E\u0439 \u0441\u0438\u043D\u0445\u0440\u043E\u043D\u0438\u0437\u0430\u0446\u0438\u0438",
    "settings.setupStepServer": "\u0423\u043A\u0430\u0437\u0430\u043D \u0430\u0434\u0440\u0435\u0441 \u0441\u0435\u0440\u0432\u0435\u0440\u0430",
    "settings.setupStepSync": "\u041F\u043B\u0430\u0433\u0438\u043D \u0433\u043E\u0442\u043E\u0432 \u043A \u043F\u0435\u0440\u0432\u043E\u0439 \u0441\u0438\u043D\u0445\u0440\u043E\u043D\u0438\u0437\u0430\u0446\u0438\u0438",
    "settings.setupStepVault": "\u0412\u044B\u0431\u0440\u0430\u043D\u043E server-\u0445\u0440\u0430\u043D\u0438\u043B\u0438\u0449\u0435",
    "settings.vaultId": "ID server-\u0445\u0440\u0430\u043D\u0438\u043B\u0438\u0449\u0430",
    "settings.vaultIdDesc": "\u0421\u043B\u0443\u0436\u0435\u0431\u043D\u044B\u0439 \u0438\u0434\u0435\u043D\u0442\u0438\u0444\u0438\u043A\u0430\u0442\u043E\u0440 \u0432\u044B\u0431\u0440\u0430\u043D\u043D\u043E\u0433\u043E server-\u0445\u0440\u0430\u043D\u0438\u043B\u0438\u0449\u0430. \u0412 \u043F\u043E\u0432\u0441\u0435\u0434\u043D\u0435\u0432\u043D\u043E\u0439 \u0440\u0430\u0431\u043E\u0442\u0435 \u043E\u0431\u044B\u0447\u043D\u043E \u043D\u0435 \u043D\u0443\u0436\u0435\u043D.",
    "settings.sharedFolders": "\u041E\u0431\u0449\u0438\u0435 \u043F\u0430\u043F\u043A\u0438",
    "settings.sharedFoldersDesc": "\u0418\u0441\u043F\u043E\u043B\u044C\u0437\u0443\u0439\u0442\u0435 \u0434\u0435\u0440\u0435\u0432\u043E \u043F\u0430\u043F\u043E\u043A, \u0447\u0442\u043E\u0431\u044B \u043E\u0442\u043A\u0440\u044B\u0442\u044C \u0432\u0441\u0451 \u0445\u0440\u0430\u043D\u0438\u043B\u0438\u0449\u0435 \u0438\u043B\u0438 \u0442\u043E\u043B\u044C\u043A\u043E \u0432\u044B\u0431\u0440\u0430\u043D\u043D\u044B\u0435 \u043F\u0430\u043F\u043A\u0438.",
    "settings.sharedFolderScope": "\u041F\u0430\u043F\u043A\u0438 \u0434\u043B\u044F \u0434\u043E\u0441\u0442\u0443\u043F\u0430",
    "settings.sharedFolderScopeDesc": "\u0412\u044B\u0431\u0435\u0440\u0438\u0442\u0435 \u0432\u0441\u0451 \u0445\u0440\u0430\u043D\u0438\u043B\u0438\u0449\u0435 \u0438\u043B\u0438 \u043E\u0434\u043D\u0443 \u043B\u0438\u0431\u043E \u043D\u0435\u0441\u043A\u043E\u043B\u044C\u043A\u043E \u043F\u0430\u043F\u043E\u043A \u0432 \u0434\u0435\u0440\u0435\u0432\u0435.",
    "settings.selectedSharedFolders": "\u0412\u044B\u0431\u0440\u0430\u043D\u043E \u043F\u0430\u043F\u043E\u043A: {{count}}",
    "settings.noShareableFolders": "\u0412 \u0445\u0440\u0430\u043D\u0438\u043B\u0438\u0449\u0435 \u043D\u0435\u0442 \u043F\u0430\u043F\u043E\u043A",
    "settings.status": "\u0421\u0442\u0430\u0442\u0443\u0441: {{status}}",
    "settings.sync": "\u0421\u0438\u043D\u0445\u0440\u043E\u043D\u0438\u0437\u0430\u0446\u0438\u044F",
    "settings.syncFolders": "\u041F\u0430\u043F\u043A\u0438 \u0434\u043B\u044F \u043E\u0442\u043F\u0440\u0430\u0432\u043A\u0438",
    "settings.syncFoldersDesc": "\u041E\u0434\u043D\u0430 \u043B\u043E\u043A\u0430\u043B\u044C\u043D\u0430\u044F \u043F\u0430\u043F\u043A\u0430 \u043D\u0430 \u0441\u0442\u0440\u043E\u043A\u0443. \u041E\u0441\u0442\u0430\u0432\u044C\u0442\u0435 \u043F\u043E\u043B\u0435 \u043F\u0443\u0441\u0442\u044B\u043C, \u0447\u0442\u043E\u0431\u044B \u043E\u0442\u043F\u0440\u0430\u0432\u043B\u044F\u0442\u044C \u0432\u0435\u0441\u044C \u0442\u0435\u043A\u0443\u0449\u0438\u0439 Obsidian vault. \u0418\u0437\u043C\u0435\u043D\u0435\u043D\u0438\u0435 \u0441\u0431\u0440\u0430\u0441\u044B\u0432\u0430\u0435\u0442 \u043B\u043E\u043A\u0430\u043B\u044C\u043D\u043E\u0435 \u0441\u043E\u0441\u0442\u043E\u044F\u043D\u0438\u0435 \u0441\u0438\u043D\u0445\u0440\u043E\u043D\u0438\u0437\u0430\u0446\u0438\u0438.",
    "settings.syncFoldersPlaceholder": "\u041F\u0440\u043E\u0435\u043A\u0442\u044B\n\u0410\u0440\u0445\u0438\u0432/\u041E\u0431\u0449\u0435\u0435",
    "settings.syncInterval": "\u0418\u043D\u0442\u0435\u0440\u0432\u0430\u043B \u0441\u0438\u043D\u0445\u0440\u043E\u043D\u0438\u0437\u0430\u0446\u0438\u0438 (\u0441\u0435\u043A\u0443\u043D\u0434\u044B)",
    "settings.syncIntervalDesc": "\u0420\u0435\u0437\u0435\u0440\u0432\u043D\u044B\u0439 \u0438\u043D\u0442\u0435\u0440\u0432\u0430\u043B \u043E\u043F\u0440\u043E\u0441\u0430, \u043A\u043E\u0433\u0434\u0430 \u0432\u043A\u043B\u044E\u0447\u0435\u043D\u0430 \u0430\u0432\u0442\u043E\u0441\u0438\u043D\u0445\u0440\u043E\u043D\u0438\u0437\u0430\u0446\u0438\u044F",
    "settings.telegramChat": "\u0427\u0430\u0442 {{chatId}}",
    "settings.telegramDesc": "\u0417\u0434\u0435\u0441\u044C \u043C\u043E\u0436\u043D\u043E \u0441\u043E\u0437\u0434\u0430\u0442\u044C \u043E\u0434\u043D\u043E\u0440\u0430\u0437\u043E\u0432\u044B\u0439 \u043A\u043E\u0434 Telegram, \u0430 \u0437\u0430\u0442\u0435\u043C \u043E\u0442\u043F\u0440\u0430\u0432\u0438\u0442\u044C `/link CODE` \u0431\u043E\u0442\u0443 \u0432 \u043B\u0438\u0447\u043D\u043E\u043C \u0447\u0430\u0442\u0435.",
    "settings.telegramInboxFolder": "\u041F\u0430\u043F\u043A\u0430 \u0432\u0445\u043E\u0434\u044F\u0449\u0438\u0445 Telegram",
    "settings.telegramInboxFolderDesc": "\u041F\u0430\u043F\u043A\u0430 \u043D\u0430\u0437\u043D\u0430\u0447\u0435\u043D\u0438\u044F \u0434\u043B\u044F \u0437\u0430\u043C\u0435\u0442\u043E\u043A, \u0441\u043E\u0437\u0434\u0430\u043D\u043D\u044B\u0445 \u0438\u0437 Telegram-\u0441\u043E\u043E\u0431\u0449\u0435\u043D\u0438\u0439",
    "settings.telegramNeedConfig": "\u0417\u0430\u043F\u043E\u043B\u043D\u0438\u0442\u0435 URL \u0441\u0435\u0440\u0432\u0435\u0440\u0430 \u0438 email, \u0447\u0442\u043E\u0431\u044B \u0437\u0430\u0433\u0440\u0443\u0437\u0438\u0442\u044C Telegram-\u0441\u0432\u044F\u0437\u043A\u0438.",
    "settings.title": "Arcalink Sync",
    "settings.unnamedVault": "Vault \u0431\u0435\u0437 \u0438\u043C\u0435\u043D\u0438",
    "settings.userEmail": "Email \u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044F",
    "settings.userEmailDesc": "\u041E\u0441\u043D\u043E\u0432\u043D\u043E\u0439 \u0438\u0434\u0435\u043D\u0442\u0438\u0444\u0438\u043A\u0430\u0442\u043E\u0440 \u0430\u043A\u043A\u0430\u0443\u043D\u0442\u0430 \u0434\u043B\u044F \u0440\u0435\u0433\u0438\u0441\u0442\u0440\u0430\u0446\u0438\u0438, \u0434\u043E\u0441\u0442\u0443\u043F\u0430 \u0438 Telegram",
    "settings.userId": "ID \u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044F (\u0441\u043F\u0440\u0430\u0432\u043E\u0447\u043D\u043E)",
    "settings.userIdDesc": "\u041E\u043F\u0440\u0435\u0434\u0435\u043B\u044F\u0435\u0442\u0441\u044F \u0430\u0432\u0442\u043E\u043C\u0430\u0442\u0438\u0447\u0435\u0441\u043A\u0438 \u043F\u043E email. \u041D\u0443\u0436\u0435\u043D \u0442\u043E\u043B\u044C\u043A\u043E \u0434\u043B\u044F \u0434\u0438\u0430\u0433\u043D\u043E\u0441\u0442\u0438\u043A\u0438 \u0438 \u043F\u043E\u0434\u0434\u0435\u0440\u0436\u043A\u0438.",
    "settings.vaultConnection": "\u041F\u043E\u0434\u043A\u043B\u044E\u0447\u0435\u043D\u0438\u0435 \u0445\u0440\u0430\u043D\u0438\u043B\u0438\u0449\u0430",
    "settings.vaultRole": "\u0420\u043E\u043B\u044C \u0432 \u0445\u0440\u0430\u043D\u0438\u043B\u0438\u0449\u0435",
    "settings.vaultRoleDesc": "\u0420\u043E\u043B\u044C \u0432 \u043F\u0440\u0438\u0433\u043B\u0430\u0448\u0435\u043D\u0438\u0438. \u041E\u0433\u0440\u0430\u043D\u0438\u0447\u0435\u043D\u0438\u0435 \u043F\u043E \u043F\u0430\u043F\u043A\u0430\u043C \u0437\u0430\u0434\u0430\u0451\u0442\u0441\u044F \u0432 \u043F\u043E\u043B\u0435 \u043F\u0430\u043F\u043E\u043A \u0434\u043B\u044F \u0434\u043E\u0441\u0442\u0443\u043F\u0430.",
    "settings.vaultSharing": "\u0414\u043E\u0441\u0442\u0443\u043F \u043A \u0445\u0440\u0430\u043D\u0438\u043B\u0438\u0449\u0443",
    "settings.vaultSharingDesc": "ArcaLink \u0441\u043E\u0437\u0434\u0430\u0451\u0442 \u043F\u0440\u0438\u0433\u043B\u0430\u0448\u0435\u043D\u0438\u0435 \u043F\u043E email \u043A\u043E\u043B\u043B\u0435\u0433\u0438. \u0412\u044B\u0431\u0435\u0440\u0438\u0442\u0435 \u0432\u0441\u0451 \u0445\u0440\u0430\u043D\u0438\u043B\u0438\u0449\u0435 \u0438\u043B\u0438 \u043A\u043E\u043D\u043A\u0440\u0435\u0442\u043D\u044B\u0435 \u043F\u0430\u043F\u043A\u0438 \u0432 \u0434\u0435\u0440\u0435\u0432\u0435.",
    "settings.wholeVaultAccess": "\u0412\u0435\u0441\u044C vault",
    "settings.wholeVaultAccessInput": "\u0432\u0441\u0435 \u0445\u0440\u0430\u043D\u0438\u043B\u0438\u0449\u0435",
    "settings.folderScopeAccess": "\u041F\u0430\u043F\u043A\u0438: {{folders}}",
    "status.never": "\u043D\u0438\u043A\u043E\u0433\u0434\u0430",
    "stage.bootstrap-from-remote": "\u043F\u0435\u0440\u0432\u0438\u0447\u043D\u0430\u044F \u0437\u0430\u0433\u0440\u0443\u0437\u043A\u0430 \u0441 \u0441\u0435\u0440\u0432\u0435\u0440\u0430",
    "stage.create-session": "\u0441\u043E\u0437\u0434\u0430\u043D\u0438\u0435 \u0441\u0435\u0441\u0441\u0438\u0438 \u0441\u0438\u043D\u0445\u0440\u043E\u043D\u0438\u0437\u0430\u0446\u0438\u0438",
    "stage.pull-remote-changes": "\u043F\u043E\u043B\u0443\u0447\u0435\u043D\u0438\u0435 \u0438\u0437\u043C\u0435\u043D\u0435\u043D\u0438\u0439 \u0441 \u0441\u0435\u0440\u0432\u0435\u0440\u0430",
    "stage.push-local-changes": "\u043E\u0442\u043F\u0440\u0430\u0432\u043A\u0430 \u043B\u043E\u043A\u0430\u043B\u044C\u043D\u044B\u0445 \u0438\u0437\u043C\u0435\u043D\u0435\u043D\u0438\u0439",
    "stage.scan-local-after-pull": "\u0441\u043A\u0430\u043D\u0438\u0440\u043E\u0432\u0430\u043D\u0438\u0435 \u0445\u0440\u0430\u043D\u0438\u043B\u0438\u0449\u0430 \u043F\u043E\u0441\u043B\u0435 \u043F\u043E\u043B\u0443\u0447\u0435\u043D\u0438\u044F \u0438\u0437\u043C\u0435\u043D\u0435\u043D\u0438\u0439",
    "stage.scan-local-before-push": "\u0441\u043A\u0430\u043D\u0438\u0440\u043E\u0432\u0430\u043D\u0438\u0435 \u0445\u0440\u0430\u043D\u0438\u043B\u0438\u0449\u0430 \u043F\u0435\u0440\u0435\u0434 \u043E\u0442\u043F\u0440\u0430\u0432\u043A\u043E\u0439",
    "auth.status.authenticated": "\u0412\u0445\u043E\u0434 \u0432\u044B\u043F\u043E\u043B\u043D\u0435\u043D",
    "auth.status.unknown": "\u041F\u0440\u043E\u0432\u0435\u0440\u043A\u0430 \u0430\u0432\u0442\u043E\u0440\u0438\u0437\u0430\u0446\u0438\u0438...",
    "auth.status.missing_token": "\u041D\u0435\u0442 \u0432\u0445\u043E\u0434\u0430 \u2014 \u0442\u043E\u043A\u0435\u043D \u0434\u043E\u0441\u0442\u0443\u043F\u0430 \u043E\u0442\u0441\u0443\u0442\u0441\u0442\u0432\u0443\u0435\u0442",
    "auth.status.refresh_failed": "\u0412\u0445\u043E\u0434 \u0438\u0441\u0442\u0451\u043A \u2014 \u043D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u043E\u0431\u043D\u043E\u0432\u0438\u0442\u044C \u0442\u043E\u043A\u0435\u043D",
    "auth.status.session_expired": "\u0412\u0445\u043E\u0434 \u0438\u0441\u0442\u0451\u043A \u2014 \u0441\u0435\u0441\u0441\u0438\u044F \u0437\u0430\u0432\u0435\u0440\u0448\u0435\u043D\u0430",
    "auth.status.session_revoked": "\u0412\u0445\u043E\u0434 \u043E\u0442\u043E\u0437\u0432\u0430\u043D \u2014 \u0441\u0435\u0441\u0441\u0438\u044F \u0430\u043D\u043D\u0443\u043B\u0438\u0440\u043E\u0432\u0430\u043D\u0430 \u0441\u0435\u0440\u0432\u0435\u0440\u043E\u043C",
    "auth.status.billing_blocked": "\u0421\u0438\u043D\u0445\u0440\u043E\u043D\u0438\u0437\u0430\u0446\u0438\u044F \u0437\u0430\u0431\u043B\u043E\u043A\u0438\u0440\u043E\u0432\u0430\u043D\u0430 \u2014 \u043F\u0440\u043E\u0432\u0435\u0440\u044C\u0442\u0435 \u0441\u0442\u0430\u0442\u0443\u0441 \u0430\u043A\u043A\u0430\u0443\u043D\u0442\u0430",
    "auth.status.error": "\u041E\u0448\u0438\u0431\u043A\u0430 \u0430\u0432\u0442\u043E\u0440\u0438\u0437\u0430\u0446\u0438\u0438 \u2014 \u0441\u043C. \u043F\u043E\u0434\u0440\u043E\u0431\u043D\u043E\u0441\u0442\u0438 \u043D\u0438\u0436\u0435",
    "auth.indicatorLabel": "\u0421\u0442\u0430\u0442\u0443\u0441 \u0430\u0432\u0442\u043E\u0440\u0438\u0437\u0430\u0446\u0438\u0438",
    "syncBlock.reason.none": "\u041F\u0440\u043E\u0431\u043B\u0435\u043C \u043D\u0435 \u043E\u0431\u043D\u0430\u0440\u0443\u0436\u0435\u043D\u043E",
    "syncBlock.reason.not_configured": "\u041F\u043B\u0430\u0433\u0438\u043D \u043D\u0435 \u043F\u043E\u043B\u043D\u043E\u0441\u0442\u044C\u044E \u043D\u0430\u0441\u0442\u0440\u043E\u0435\u043D",
    "syncBlock.reason.missing_token": "\u0422\u043E\u043A\u0435\u043D \u0434\u043E\u0441\u0442\u0443\u043F\u0430 \u043E\u0442\u0441\u0443\u0442\u0441\u0442\u0432\u0443\u0435\u0442 \u2014 \u0432\u043E\u0439\u0434\u0438\u0442\u0435 \u0437\u0430\u043D\u043E\u0432\u043E",
    "syncBlock.reason.session_expired": "\u0421\u0435\u0441\u0441\u0438\u044F \u0438\u0441\u0442\u0435\u043A\u043B\u0430 \u2014 \u0432\u043E\u0439\u0434\u0438\u0442\u0435 \u0437\u0430\u043D\u043E\u0432\u043E",
    "syncBlock.reason.session_revoked": "\u0421\u0435\u0441\u0441\u0438\u044F \u043E\u0442\u043E\u0437\u0432\u0430\u043D\u0430 \u0441\u0435\u0440\u0432\u0435\u0440\u043E\u043C \u2014 \u0432\u043E\u0439\u0434\u0438\u0442\u0435 \u0437\u0430\u043D\u043E\u0432\u043E",
    "syncBlock.reason.refresh_failed": "\u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u043E\u0431\u043D\u043E\u0432\u0438\u0442\u044C \u0442\u043E\u043A\u0435\u043D \u2014 \u0432\u043E\u0439\u0434\u0438\u0442\u0435 \u0437\u0430\u043D\u043E\u0432\u043E",
    "syncBlock.reason.billing_blocked": "\u041A\u043E\u043C\u043C\u0435\u0440\u0447\u0435\u0441\u043A\u0438\u0439 \u0441\u0442\u0430\u0442\u0443\u0441 \u0430\u043A\u043A\u0430\u0443\u043D\u0442\u0430 \u0437\u0430\u043F\u0440\u0435\u0449\u0430\u0435\u0442 \u0441\u0438\u043D\u0445\u0440\u043E\u043D\u0438\u0437\u0430\u0446\u0438\u044E",
    "syncBlock.reason.network_error": "\u0421\u0435\u0442\u0435\u0432\u0430\u044F \u043E\u0448\u0438\u0431\u043A\u0430 \u2014 \u043F\u0440\u043E\u0432\u0435\u0440\u044C\u0442\u0435 \u043F\u043E\u0434\u043A\u043B\u044E\u0447\u0435\u043D\u0438\u0435",
    "syncBlock.reason.server_error": "\u041E\u0448\u0438\u0431\u043A\u0430 \u0441\u0435\u0440\u0432\u0435\u0440\u0430 \u2014 \u043F\u043E\u043F\u0440\u043E\u0431\u0443\u0439\u0442\u0435 \u043F\u043E\u0437\u0436\u0435",
    "syncBlock.label": "\u0421\u0442\u0430\u0442\u0443\u0441 \u0441\u0438\u043D\u0445\u0440\u043E\u043D\u0438\u0437\u0430\u0446\u0438\u0438",
    "collaborationBlock.reason.none": "\u041F\u0440\u043E\u0431\u043B\u0435\u043C \u0441 \u0441\u043E\u0432\u043C\u0435\u0441\u0442\u043D\u043E\u0439 \u0440\u0430\u0431\u043E\u0442\u043E\u0439 \u043D\u0435 \u043E\u0431\u043D\u0430\u0440\u0443\u0436\u0435\u043D\u043E",
    "collaborationBlock.reason.billing_blocked_collaboration": "\u041F\u043E\u0434\u043F\u0438\u0441\u043A\u0430 \u043D\u0430 \u0441\u043E\u0432\u043C\u0435\u0441\u0442\u043D\u0443\u044E \u0440\u0430\u0431\u043E\u0442\u0443 \u043D\u0435 \u043E\u043F\u043B\u0430\u0447\u0435\u043D\u0430 \u2014 \u043E\u0431\u0449\u0438\u0439 \u0434\u043E\u0441\u0442\u0443\u043F \u0438 \u0436\u0438\u0432\u043E\u0435 \u0440\u0435\u0434\u0430\u043A\u0442\u0438\u0440\u043E\u0432\u0430\u043D\u0438\u0435 \u0437\u0430\u0431\u043B\u043E\u043A\u0438\u0440\u043E\u0432\u0430\u043D\u044B",
    "collaborationBlock.reason.collaboration_not_in_plan": "\u0422\u0435\u043A\u0443\u0449\u0438\u0439 \u0442\u0430\u0440\u0438\u0444 \u043D\u0435 \u0432\u043A\u043B\u044E\u0447\u0430\u0435\u0442 \u0441\u043E\u0432\u043C\u0435\u0441\u0442\u043D\u0443\u044E \u0440\u0430\u0431\u043E\u0442\u0443 \u2014 \u0441\u043C\u0435\u043D\u0438\u0442\u0435 \u0442\u0430\u0440\u0438\u0444 \u0434\u043B\u044F \u0434\u043E\u0441\u0442\u0443\u043F\u0430 \u0438 \u0436\u0438\u0432\u043E\u0433\u043E \u0440\u0435\u0434\u0430\u043A\u0442\u0438\u0440\u043E\u0432\u0430\u043D\u0438\u044F",
    "collaborationBlock.reason.member_limit_exceeded": "\u041B\u0438\u043C\u0438\u0442 \u0443\u0447\u0430\u0441\u0442\u043D\u0438\u043A\u043E\u0432 \u0445\u0440\u0430\u043D\u0438\u043B\u0438\u0449\u0430 \u0438\u0441\u0447\u0435\u0440\u043F\u0430\u043D \u2014 \u0441\u043C\u0435\u043D\u0438\u0442\u0435 \u0442\u0430\u0440\u0438\u0444 \u0438\u043B\u0438 \u0443\u0434\u0430\u043B\u0438\u0442\u0435 \u043D\u0435\u0438\u0441\u043F\u043E\u043B\u044C\u0437\u0443\u0435\u043C\u044B\u0445 \u0443\u0447\u0430\u0441\u0442\u043D\u0438\u043A\u043E\u0432",
    "collaborationBlock.label": "\u0421\u0442\u0430\u0442\u0443\u0441 \u0441\u043E\u0432\u043C\u0435\u0441\u0442\u043D\u043E\u0439 \u0440\u0430\u0431\u043E\u0442\u044B",
    "stage.sync-crdt-markdown": "\u0441\u0438\u043D\u0445\u0440\u043E\u043D\u0438\u0437\u0430\u0446\u0438\u044F \u0441\u043E\u0432\u043C\u0435\u0441\u0442\u043D\u044B\u0445 Markdown-\u0437\u0430\u043C\u0435\u0442\u043E\u043A",
    "settings.syncConflicts": "\u041A\u043E\u043D\u0444\u043B\u0438\u043A\u0442\u044B \u0441\u0438\u043D\u0445\u0440\u043E\u043D\u0438\u0437\u0430\u0446\u0438\u0438",
    "settings.syncConflictsNeedConfig": "\u0412\u044B\u0431\u0435\u0440\u0438\u0442\u0435 \u0445\u0440\u0430\u043D\u0438\u043B\u0438\u0449\u0435 \u0438 \u0437\u0430\u043F\u0443\u0441\u0442\u0438\u0442\u0435 \u043F\u0435\u0440\u0432\u0443\u044E \u0441\u0438\u043D\u0445\u0440\u043E\u043D\u0438\u0437\u0430\u0446\u0438\u044E, \u0447\u0442\u043E\u0431\u044B \u0437\u0430\u0433\u0440\u0443\u0437\u0438\u0442\u044C \u0438\u043D\u0444\u043E\u0440\u043C\u0430\u0446\u0438\u044E \u043E \u043A\u043E\u043D\u0444\u043B\u0438\u043A\u0442\u0430\u0445.",
    "settings.noConflicts": "\u041E\u0442\u043A\u0440\u044B\u0442\u044B\u0445 \u043A\u043E\u043D\u0444\u043B\u0438\u043A\u0442\u043E\u0432 \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D\u043E.",
    "settings.syncConflictsDesc": "\u0412 \u044D\u0442\u0438\u0445 \u0444\u0430\u0439\u043B\u0430\u0445 \u0435\u0441\u0442\u044C \u043A\u043E\u043D\u0444\u043B\u0438\u043A\u0442\u0443\u044E\u0449\u0438\u0435 \u0438\u0437\u043C\u0435\u043D\u0435\u043D\u0438\u044F. \u0420\u0430\u0437\u0440\u0435\u0448\u0438\u0442\u0435 \u0438\u0445 \u0438\u0437 \u043F\u043B\u0430\u0433\u0438\u043D\u0430 Obsidian \u043D\u0430 \u0432\u0430\u0448\u0435\u043C \u0443\u0441\u0442\u0440\u043E\u0439\u0441\u0442\u0432\u0435.",
    "settings.conflictItemDesc": "{{createdAt}} | {{reason}} | {{opType}} | {{status}}",
    "settings.loadConflictsFailed": "\u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u0437\u0430\u0433\u0440\u0443\u0437\u0438\u0442\u044C \u043A\u043E\u043D\u0444\u043B\u0438\u043A\u0442\u044B: {{message}}",
    "settings.loadConflictsUsingCache": "\u041F\u043E\u043A\u0430\u0437\u0430\u043D \u0441\u043E\u0445\u0440\u0430\u043D\u0451\u043D\u043D\u044B\u0439 \u0441\u043F\u0438\u0441\u043E\u043A \u043A\u043E\u043D\u0444\u043B\u0438\u043A\u0442\u043E\u0432, \u043F\u043E\u0442\u043E\u043C\u0443 \u0447\u0442\u043E \u043E\u0431\u043D\u043E\u0432\u043B\u0435\u043D\u0438\u0435 \u043D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C: {{message}}",
    "settings.conflictDetailTitle": "\u0414\u0435\u0442\u0430\u043B\u0438 \u043A\u043E\u043D\u0444\u043B\u0438\u043A\u0442\u0430",
    "settings.conflictPath": "\u041F\u0443\u0442\u044C",
    "settings.conflictCreatedAt": "\u0421\u043E\u0437\u0434\u0430\u043D",
    "settings.conflictOperationType": "\u041E\u043F\u0435\u0440\u0430\u0446\u0438\u044F",
    "settings.conflictReason": "\u041F\u0440\u0438\u0447\u0438\u043D\u0430",
    "settings.conflictExpectedHash": "\u041E\u0436\u0438\u0434\u0430\u0435\u043C\u044B\u0439 hash",
    "settings.conflictActualHash": "\u0424\u0430\u043A\u0442\u0438\u0447\u0435\u0441\u043A\u0438\u0439 hash",
    "settings.conflictStatus": "\u0421\u0442\u0430\u0442\u0443\u0441",
    "settings.conflictDeviceId": "\u0423\u0441\u0442\u0440\u043E\u0439\u0441\u0442\u0432\u043E",
    "settings.conflictTargetPath": "\u0426\u0435\u043B\u0435\u0432\u043E\u0439 \u043F\u0443\u0442\u044C",
    "settings.conflictResolutionUnsupported": "\u042D\u0442\u043E\u0442 \u0442\u0438\u043F \u043A\u043E\u043D\u0444\u043B\u0438\u043A\u0442\u0430 \u043F\u043E\u043A\u0430 \u0434\u043E\u0441\u0442\u0443\u043F\u0435\u043D \u0442\u043E\u043B\u044C\u043A\u043E \u0434\u043B\u044F \u043F\u0440\u043E\u0441\u043C\u043E\u0442\u0440\u0430. \u0420\u0430\u0437\u0440\u0435\u0448\u0438\u0442\u0435 \u0435\u0433\u043E \u0432 \u043F\u043E\u0442\u043E\u043A\u0435 \u0443\u0441\u0442\u0440\u043E\u0439\u0441\u0442\u0432\u0430, \u043A\u043E\u0442\u043E\u0440\u044B\u0439 \u043F\u043E\u0434\u0434\u0435\u0440\u0436\u0438\u0432\u0430\u0435\u0442 {{entryType}} / {{operationType}}.",
    "button.viewConflictDetails": "\u0414\u0435\u0442\u0430\u043B\u0438",
    "button.resolveKeepLocal": "\u041E\u0441\u0442\u0430\u0432\u0438\u0442\u044C \u043B\u043E\u043A\u0430\u043B\u044C\u043D\u0443\u044E",
    "button.resolveAcceptRemote": "\u041F\u0440\u0438\u043D\u044F\u0442\u044C \u0441\u0435\u0440\u0432\u0435\u0440\u043D\u0443\u044E",
    "button.resolveKeepBoth": "\u0421\u043E\u0445\u0440\u0430\u043D\u0438\u0442\u044C \u043E\u0431\u0435",
    "button.materializeRemote": "\u041F\u043E\u043A\u0430\u0437\u0430\u0442\u044C \u0441\u0435\u0440\u0432\u0435\u0440\u043D\u0443\u044E \u0432\u0435\u0440\u0441\u0438\u044E",
    "button.checkVaultDivergence": "\u041F\u0440\u043E\u0432\u0435\u0440\u0438\u0442\u044C \u0440\u0430\u0441\u0445\u043E\u0436\u0434\u0435\u043D\u0438\u0435",
    "button.mergeVaultDivergence": "\u0421\u043B\u0438\u0442\u044C \u043E\u0442\u0441\u0443\u0442\u0441\u0442\u0432\u0443\u044E\u0449\u0438\u0435 \u0444\u0430\u0439\u043B\u044B",
    "button.acceptServerVaultState": "\u041F\u0440\u0438\u043D\u044F\u0442\u044C \u0441\u0435\u0440\u0432\u0435\u0440 \u0437\u0434\u0435\u0441\u044C",
    "button.publishLocalVaultState": "\u041E\u043F\u0443\u0431\u043B\u0438\u043A\u043E\u0432\u0430\u0442\u044C \u044D\u0442\u043E\u0442 \u043A\u043B\u0438\u0435\u043D\u0442",
    "resolution.keepLocal": "keep_local",
    "resolution.acceptRemote": "accept_remote",
    "resolution.keepBoth": "keep_both",
    "resolution.keepLocalDesc": "\u041E\u043F\u0443\u0431\u043B\u0438\u043A\u043E\u0432\u0430\u0442\u044C \u0432\u0430\u0448\u0443 \u043B\u043E\u043A\u0430\u043B\u044C\u043D\u0443\u044E \u0432\u0435\u0440\u0441\u0438\u044E \u0444\u0430\u0439\u043B\u0430 \u043D\u0430 \u0441\u0435\u0440\u0432\u0435\u0440\u0435 \u0438 \u043E\u0442\u043C\u0435\u0442\u0438\u0442\u044C \u043A\u043E\u043D\u0444\u043B\u0438\u043A\u0442 \u043A\u0430\u043A \u0440\u0430\u0437\u0440\u0435\u0448\u0451\u043D\u043D\u044B\u0439.",
    "resolution.keepLocalDeleteHashMismatchDesc": "\u041E\u0441\u0442\u0430\u0432\u0438\u0442\u044C \u043B\u043E\u043A\u0430\u043B\u044C\u043D\u043E\u0435 \u0443\u0434\u0430\u043B\u0435\u043D\u0438\u0435: \u0443\u0434\u0430\u043B\u0438\u0442\u044C \u0442\u0435\u043A\u0443\u0449\u0443\u044E \u0441\u0435\u0440\u0432\u0435\u0440\u043D\u0443\u044E \u0432\u0435\u0440\u0441\u0438\u044E \u0444\u0430\u0439\u043B\u0430 \u0438 \u043E\u0442\u043C\u0435\u0442\u0438\u0442\u044C \u043A\u043E\u043D\u0444\u043B\u0438\u043A\u0442 \u0440\u0430\u0437\u0440\u0435\u0448\u0451\u043D\u043D\u044B\u043C.",
    "resolution.acceptRemoteDesc": "\u0417\u0430\u043C\u0435\u043D\u0438\u0442\u044C \u043B\u043E\u043A\u0430\u043B\u044C\u043D\u044B\u0439 \u0444\u0430\u0439\u043B \u0442\u0435\u043A\u0443\u0449\u0435\u0439 \u0441\u0435\u0440\u0432\u0435\u0440\u043D\u043E\u0439 \u0432\u0435\u0440\u0441\u0438\u0435\u0439. \u0411\u0443\u0434\u0435\u0442 \u0441\u043E\u0445\u0440\u0430\u043D\u0435\u043D\u0430 \u0440\u0435\u0437\u0435\u0440\u0432\u043D\u0430\u044F \u043A\u043E\u043F\u0438\u044F.",
    "resolution.keepBothDesc": "\u041E\u0441\u0442\u0430\u0432\u0438\u0442\u044C \u0441\u0435\u0440\u0432\u0435\u0440\u043D\u0443\u044E \u0432\u0435\u0440\u0441\u0438\u044E \u043E\u0441\u043D\u043E\u0432\u043D\u044B\u043C \u0444\u0430\u0439\u043B\u043E\u043C, \u0430 \u043B\u043E\u043A\u0430\u043B\u044C\u043D\u0443\u044E \u0441\u043E\u0445\u0440\u0430\u043D\u0438\u0442\u044C \u043A\u0430\u043A \u043A\u043E\u043F\u0438\u044E \u043A\u043E\u043D\u0444\u043B\u0438\u043A\u0442\u0430.",
    "resolution.materializeDesc": "\u0421\u043A\u0430\u0447\u0430\u0442\u044C \u0442\u0435\u043A\u0443\u0449\u0443\u044E \u0441\u0435\u0440\u0432\u0435\u0440\u043D\u0443\u044E \u0432\u0435\u0440\u0441\u0438\u044E \u0432 \u0444\u0430\u0439\u043B \u0434\u043B\u044F \u0441\u0440\u0430\u0432\u043D\u0435\u043D\u0438\u044F \u0440\u044F\u0434\u043E\u043C \u0441 \u0432\u0430\u0448\u0435\u0439 \u043B\u043E\u043A\u0430\u043B\u044C\u043D\u043E\u0439 \u043A\u043E\u043F\u0438\u0435\u0439.",
    "confirm.remoteConflictContentMissingUseLocal": "\u0421\u043E\u0434\u0435\u0440\u0436\u0438\u043C\u043E\u0435 \u0441\u0435\u0440\u0432\u0435\u0440\u043D\u043E\u0439 \u0432\u0435\u0440\u0441\u0438\u0438 {{path}} \u043E\u0442\u0441\u0443\u0442\u0441\u0442\u0432\u0443\u0435\u0442 \u0438 \u043D\u0435 \u043C\u043E\u0436\u0435\u0442 \u0431\u044B\u0442\u044C \u0432\u043E\u0441\u0441\u0442\u0430\u043D\u043E\u0432\u043B\u0435\u043D\u043E \u0441 \u0441\u0435\u0440\u0432\u0435\u0440\u0430. \u0418\u0441\u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u044C \u043B\u043E\u043A\u0430\u043B\u044C\u043D\u0443\u044E \u0432\u0435\u0440\u0441\u0438\u044E \u0441 \u044D\u0442\u043E\u0433\u043E \u0443\u0441\u0442\u0440\u043E\u0439\u0441\u0442\u0432\u0430?",
    "error.localFileNotFound": "\u041B\u043E\u043A\u0430\u043B\u044C\u043D\u044B\u0439 \u0444\u0430\u0439\u043B {{path}} \u0431\u043E\u043B\u044C\u0448\u0435 \u043D\u0435 \u0441\u0443\u0449\u0435\u0441\u0442\u0432\u0443\u0435\u0442",
    "error.remoteFileNotAvailable": "\u0421\u0435\u0440\u0432\u0435\u0440\u043D\u0430\u044F \u0432\u0435\u0440\u0441\u0438\u044F {{path}} \u043D\u0435\u0434\u043E\u0441\u0442\u0443\u043F\u043D\u0430",
    "error.remoteConflictContentMissing": "\u0421\u043E\u0434\u0435\u0440\u0436\u0438\u043C\u043E\u0435 \u0441\u0435\u0440\u0432\u0435\u0440\u043D\u043E\u0439 \u0432\u0435\u0440\u0441\u0438\u0438 {{path}} \u043E\u0442\u0441\u0443\u0442\u0441\u0442\u0432\u0443\u0435\u0442. \u0414\u043B\u044F \u0440\u0430\u0437\u0440\u0435\u0448\u0435\u043D\u0438\u044F \u043A\u043E\u043D\u0444\u043B\u0438\u043A\u0442\u0430 \u043E\u0441\u0442\u0430\u0432\u044C\u0442\u0435 \u043B\u043E\u043A\u0430\u043B\u044C\u043D\u0443\u044E \u0432\u0435\u0440\u0441\u0438\u044E.",
    "error.syncBlockedBilling.generic": "\u0421\u0438\u043D\u0445\u0440\u043E\u043D\u0438\u0437\u0430\u0446\u0438\u044F \u0437\u0430\u0431\u043B\u043E\u043A\u0438\u0440\u043E\u0432\u0430\u043D\u0430, \u043F\u043E\u0442\u043E\u043C\u0443 \u0447\u0442\u043E \u0442\u0435\u043A\u0443\u0449\u0438\u0439 \u0441\u0442\u0430\u0442\u0443\u0441 \u043F\u043E\u0434\u043F\u0438\u0441\u043A\u0438 \u043D\u0435 \u043F\u043E\u0437\u0432\u043E\u043B\u044F\u0435\u0442 \u0435\u0451 \u0432\u044B\u043F\u043E\u043B\u043D\u044F\u0442\u044C.",
    "error.syncBlockedBilling.expired": "\u0421\u0438\u043D\u0445\u0440\u043E\u043D\u0438\u0437\u0430\u0446\u0438\u044F \u0437\u0430\u0431\u043B\u043E\u043A\u0438\u0440\u043E\u0432\u0430\u043D\u0430, \u043F\u043E\u0442\u043E\u043C\u0443 \u0447\u0442\u043E \u043F\u043E\u0434\u043F\u0438\u0441\u043A\u0430 \u0438\u0441\u0442\u0435\u043A\u043B\u0430.",
    "error.syncBlockedBilling.past_due": "\u0421\u0438\u043D\u0445\u0440\u043E\u043D\u0438\u0437\u0430\u0446\u0438\u044F \u0437\u0430\u0431\u043B\u043E\u043A\u0438\u0440\u043E\u0432\u0430\u043D\u0430, \u043F\u043E\u0442\u043E\u043C\u0443 \u0447\u0442\u043E \u043E\u043F\u043B\u0430\u0442\u0430 \u043F\u043E\u0434\u043F\u0438\u0441\u043A\u0438 \u043F\u0440\u043E\u0441\u0440\u043E\u0447\u0435\u043D\u0430.",
    "error.syncBlockedBilling.suspended": "\u0421\u0438\u043D\u0445\u0440\u043E\u043D\u0438\u0437\u0430\u0446\u0438\u044F \u0437\u0430\u0431\u043B\u043E\u043A\u0438\u0440\u043E\u0432\u0430\u043D\u0430, \u043F\u043E\u0442\u043E\u043C\u0443 \u0447\u0442\u043E \u043F\u043E\u0434\u043F\u0438\u0441\u043A\u0430 \u043F\u0440\u0438\u043E\u0441\u0442\u0430\u043D\u043E\u0432\u043B\u0435\u043D\u0430.",
    "error.syncBlockedBilling.canceled": "\u0421\u0438\u043D\u0445\u0440\u043E\u043D\u0438\u0437\u0430\u0446\u0438\u044F \u0437\u0430\u0431\u043B\u043E\u043A\u0438\u0440\u043E\u0432\u0430\u043D\u0430, \u043F\u043E\u0442\u043E\u043C\u0443 \u0447\u0442\u043E \u043F\u043E\u0434\u043F\u0438\u0441\u043A\u0430 \u043E\u0442\u043C\u0435\u043D\u0435\u043D\u0430.",
    "error.unsupportedConflictResolution": "\u0420\u0430\u0437\u0440\u0435\u0448\u0435\u043D\u0438\u0435 \u043A\u043E\u043D\u0444\u043B\u0438\u043A\u0442\u0430 \u0434\u043B\u044F {{entryType}} / {{operationType}} \u043F\u043E\u043A\u0430 \u043D\u0435 \u043F\u043E\u0434\u0434\u0435\u0440\u0436\u0438\u0432\u0430\u0435\u0442\u0441\u044F",
    "error.resolveConflictFailed": "\u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u0440\u0430\u0437\u0440\u0435\u0448\u0438\u0442\u044C \u043A\u043E\u043D\u0444\u043B\u0438\u043A\u0442: {{message}}",
    "notice.conflictResolved": "\u041A\u043E\u043D\u0444\u043B\u0438\u043A\u0442 \u0440\u0430\u0437\u0440\u0435\u0448\u0451\u043D",
    "notice.conflictResolveFailed": "\u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u0440\u0430\u0437\u0440\u0435\u0448\u0438\u0442\u044C \u043A\u043E\u043D\u0444\u043B\u0438\u043A\u0442: {{message}}",
    "notice.remoteMaterialized": "\u0421\u0435\u0440\u0432\u0435\u0440\u043D\u0430\u044F \u0432\u0435\u0440\u0441\u0438\u044F \u0437\u0430\u0433\u0440\u0443\u0436\u0435\u043D\u0430 \u0432 {{path}}",
    "notice.remoteMaterializeFailed": "\u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u0441\u043A\u0430\u0447\u0430\u0442\u044C \u0441\u0435\u0440\u0432\u0435\u0440\u043D\u0443\u044E \u0432\u0435\u0440\u0441\u0438\u044E: {{message}}",
    "notice.vaultDivergenceServerAccepted": "\u0421\u0435\u0440\u0432\u0435\u0440\u043D\u0430\u044F \u043A\u0430\u0440\u0442\u0438\u043D\u0430 \u043F\u0440\u0438\u043C\u0435\u043D\u0435\u043D\u0430: \u0437\u0430\u0433\u0440\u0443\u0436\u0435\u043D\u043E {{applied}}, \u043B\u043E\u043A\u0430\u043B\u044C\u043D\u043E \u0443\u0434\u0430\u043B\u0435\u043D\u043E {{removed}}, safety copies {{preserved}}",
    "notice.vaultDivergenceLocalPublished": "\u041B\u043E\u043A\u0430\u043B\u044C\u043D\u0430\u044F \u043A\u0430\u0440\u0442\u0438\u043D\u0430 \u043E\u043F\u0443\u0431\u043B\u0438\u043A\u043E\u0432\u0430\u043D\u0430: \u043E\u043F\u0435\u0440\u0430\u0446\u0438\u0439 {{pushed}}, \u043A\u043E\u043D\u0444\u043B\u0438\u043A\u0442\u043E\u0432 {{conflicts}}",
    "notice.vaultDivergenceMerged": "\u0421\u043B\u0438\u044F\u043D\u0438\u0435 \u0432\u044B\u043F\u043E\u043B\u043D\u0435\u043D\u043E: \u0441\u043A\u0430\u0447\u0430\u043D\u043E \u0441 \u0441\u0435\u0440\u0432\u0435\u0440\u0430 {{downloaded}}, \u0437\u0430\u0433\u0440\u0443\u0436\u0435\u043D\u043E \u043D\u0430 \u0441\u0435\u0440\u0432\u0435\u0440 {{uploaded}}, \u0434\u0438\u0440\u0435\u043A\u0442\u043E\u0440\u0438\u0439 \u0441\u043E\u0437\u0434\u0430\u043D\u043E \u043D\u0430 \u0441\u0435\u0440\u0432\u0435\u0440\u0435 {{directories}}, \u043E\u0442\u0441\u0443\u0442\u0441\u0442\u0432\u0443\u044E\u0449\u0438\u0445 \u043E\u0431\u044A\u0435\u043A\u0442\u043E\u0432 \u043D\u0430 \u0441\u0435\u0440\u0432\u0435\u0440\u0435 {{missing}}, \u043A\u043E\u043D\u0444\u043B\u0438\u043A\u0442\u043E\u0432 {{conflicts}}, \u0444\u0430\u0439\u043B\u043E\u0432 \u0441 \u0440\u0430\u0437\u043D\u044B\u043C \u0441\u043E\u0434\u0435\u0440\u0436\u0438\u043C\u044B\u043C \u043E\u0441\u0442\u0430\u0432\u043B\u0435\u043D\u043E {{changed}}",
    "notice.vaultDivergenceResolveFailed": "\u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u0443\u0441\u0442\u0440\u0430\u043D\u0438\u0442\u044C \u0440\u0430\u0441\u0445\u043E\u0436\u0434\u0435\u043D\u0438\u0435 vault: {{message}}",
    "settings.vaultDivergence": "\u0420\u0430\u0441\u0445\u043E\u0436\u0434\u0435\u043D\u0438\u0435 vault",
    "settings.vaultDivergenceNeedConfig": "\u0412\u044B\u0431\u0435\u0440\u0438\u0442\u0435 \u0445\u0440\u0430\u043D\u0438\u043B\u0438\u0449\u0435 \u0438 \u0437\u0430\u043F\u0443\u0441\u0442\u0438\u0442\u0435 \u043F\u0435\u0440\u0432\u0443\u044E \u0441\u0438\u043D\u0445\u0440\u043E\u043D\u0438\u0437\u0430\u0446\u0438\u044E, \u0447\u0442\u043E\u0431\u044B \u0441\u0440\u0430\u0432\u043D\u0438\u0442\u044C \u043D\u0430\u0431\u043E\u0440 \u0444\u0430\u0439\u043B\u043E\u0432.",
    "settings.vaultDivergenceDesc": "\u0421\u0440\u0430\u0432\u043D\u0438\u0432\u0430\u0435\u0442 \u044D\u0442\u043E\u0442 \u043B\u043E\u043A\u0430\u043B\u044C\u043D\u044B\u0439 vault \u0441 \u0441\u0435\u0440\u0432\u0435\u0440\u043D\u044B\u043C \u0438\u043D\u0434\u0435\u043A\u0441\u043E\u043C \u0431\u0435\u0437 \u0438\u0437\u043C\u0435\u043D\u0435\u043D\u0438\u044F \u0444\u0430\u0439\u043B\u043E\u0432.",
    "settings.checkVaultDivergence": "\u0421\u0440\u0430\u0432\u043D\u0438\u0442\u044C \u043B\u043E\u043A\u0430\u043B\u044C\u043D\u044B\u0435 \u0438 \u0441\u0435\u0440\u0432\u0435\u0440\u043D\u044B\u0435 \u0444\u0430\u0439\u043B\u044B",
    "settings.checkVaultDivergenceDesc": "\u0421\u043A\u0430\u043D\u0438\u0440\u0443\u0435\u0442 \u0442\u0435\u043A\u0443\u0449\u0438\u0439 vault \u0438 \u043F\u043E\u043A\u0430\u0437\u044B\u0432\u0430\u0435\u0442 \u043F\u0443\u0442\u0438, \u043A\u043E\u0442\u043E\u0440\u044B\u0435 \u0435\u0441\u0442\u044C \u0442\u043E\u043B\u044C\u043A\u043E \u0441 \u043E\u0434\u043D\u043E\u0439 \u0441\u0442\u043E\u0440\u043E\u043D\u044B \u0438\u043B\u0438 \u043E\u0442\u043B\u0438\u0447\u0430\u044E\u0442\u0441\u044F \u0441\u043E\u0434\u0435\u0440\u0436\u0438\u043C\u044B\u043C.",
    "settings.loadVaultDivergenceFailed": "\u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u0441\u0440\u0430\u0432\u043D\u0438\u0442\u044C vault: {{message}}",
    "settings.vaultDivergenceCheckedAt": "\u041F\u0440\u043E\u0432\u0435\u0440\u0435\u043D\u043E: {{checkedAt}}",
    "settings.vaultDivergenceCounts": "\u041B\u043E\u043A\u0430\u043B\u044C\u043D\u043E: {{localCount}} | \u0421\u0435\u0440\u0432\u0435\u0440: {{remoteCount}} | \u0422\u043E\u043B\u044C\u043A\u043E \u043B\u043E\u043A\u0430\u043B\u044C\u043D\u043E: {{localOnlyCount}} | \u0422\u043E\u043B\u044C\u043A\u043E \u043D\u0430 \u0441\u0435\u0440\u0432\u0435\u0440\u0435: {{remoteOnlyCount}} | \u0418\u0437\u043C\u0435\u043D\u0435\u043D\u044B: {{changedCount}}",
    "settings.vaultDivergenceNoDiff": "\u0420\u0430\u0441\u0445\u043E\u0436\u0434\u0435\u043D\u0438\u0439 \u0432 \u043D\u0430\u0431\u043E\u0440\u0435 \u0444\u0430\u0439\u043B\u043E\u0432 \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D\u043E.",
    "settings.vaultDivergenceLocalOnly": "\u0422\u043E\u043B\u044C\u043A\u043E \u0432 \u044D\u0442\u043E\u043C \u043B\u043E\u043A\u0430\u043B\u044C\u043D\u043E\u043C vault",
    "settings.vaultDivergenceRemoteOnly": "\u0422\u043E\u043B\u044C\u043A\u043E \u043D\u0430 \u0441\u0435\u0440\u0432\u0435\u0440\u0435",
    "settings.vaultDivergenceChanged": "\u0420\u0430\u0437\u043D\u043E\u0435 \u0441\u043E\u0434\u0435\u0440\u0436\u0438\u043C\u043E\u0435",
    "settings.vaultDivergenceMore": "\u0438 \u0435\u0449\u0451 {{count}}",
    "settings.vaultDivergenceTimeHint": "\u0412\u0440\u0435\u043C\u044F: \u043B\u043E\u043A\u0430\u043B\u044C\u043D\u043E \u2014 mtime \u0444\u0430\u0439\u043B\u0430 \u043D\u0430 \u044D\u0442\u043E\u043C \u043A\u043B\u0438\u0435\u043D\u0442\u0435; \u0441\u0435\u0440\u0432\u0435\u0440 \u2014 \u043A\u043E\u0433\u0434\u0430 \u0441\u0435\u0440\u0432\u0435\u0440 \u043F\u0440\u0438\u043D\u044F\u043B \u043F\u043E\u0441\u043B\u0435\u0434\u043D\u044E\u044E \u043E\u043F\u0435\u0440\u0430\u0446\u0438\u044E.",
    "settings.vaultDivergenceSideLocal": "\u041B\u043E\u043A\u0430\u043B\u044C\u043D\u043E",
    "settings.vaultDivergenceSideServer": "\u0421\u0435\u0440\u0432\u0435\u0440",
    "settings.vaultDivergenceSideMissing": "{{side}}: \u043E\u0442\u0441\u0443\u0442\u0441\u0442\u0432\u0443\u0435\u0442",
    "settings.vaultDivergenceSideMeta": "{{side}}: {{modifiedAt}} | {{type}} | {{size}} | {{hash}}",
    "settings.mergeVaultDivergence": "\u0421\u043B\u0438\u0442\u044C \u043D\u0430\u0431\u043E\u0440\u044B \u0444\u0430\u0439\u043B\u043E\u0432 \u0431\u0435\u0437 \u043F\u0435\u0440\u0435\u0437\u0430\u043F\u0438\u0441\u0438",
    "settings.mergeVaultDivergenceDesc": "\u0421\u043A\u0430\u0447\u0430\u0435\u0442 \u0444\u0430\u0439\u043B\u044B, \u043A\u043E\u0442\u043E\u0440\u044B\u0435 \u0435\u0441\u0442\u044C \u0442\u043E\u043B\u044C\u043A\u043E \u043D\u0430 \u0441\u0435\u0440\u0432\u0435\u0440\u0435, \u0438 \u0437\u0430\u0433\u0440\u0443\u0437\u0438\u0442 \u0444\u0430\u0439\u043B\u044B, \u043A\u043E\u0442\u043E\u0440\u044B\u0435 \u0435\u0441\u0442\u044C \u0442\u043E\u043B\u044C\u043A\u043E \u043D\u0430 \u044D\u0442\u043E\u043C \u043A\u043B\u0438\u0435\u043D\u0442\u0435. \u0424\u0430\u0439\u043B\u044B \u0441 \u0440\u0430\u0437\u043D\u044B\u043C \u0441\u043E\u0434\u0435\u0440\u0436\u0438\u043C\u044B\u043C \u043F\u043E \u043E\u0434\u043D\u043E\u043C\u0443 \u043F\u0443\u0442\u0438 \u043D\u0435 \u0438\u0437\u043C\u0435\u043D\u044F\u044E\u0442\u0441\u044F (\u043E\u0441\u0442\u0430\u043D\u0435\u0442\u0441\u044F: {{changed}}).",
    "settings.acceptServerVaultState": "\u041F\u0440\u0438\u043D\u044F\u0442\u044C \u0441\u0435\u0440\u0432\u0435\u0440\u043D\u0443\u044E \u043A\u0430\u0440\u0442\u0438\u043D\u0443 \u043D\u0430 \u044D\u0442\u043E\u043C \u043A\u043B\u0438\u0435\u043D\u0442\u0435",
    "settings.acceptServerVaultStateDesc": "\u0424\u0430\u0439\u043B\u044B \u0442\u043E\u043B\u044C\u043A\u043E \u043D\u0430 \u0441\u0435\u0440\u0432\u0435\u0440\u0435 \u0431\u0443\u0434\u0443\u0442 \u0441\u043A\u0430\u0447\u0430\u043D\u044B, \u0438\u0437\u043C\u0435\u043D\u0451\u043D\u043D\u044B\u0435 \u0444\u0430\u0439\u043B\u044B \u0431\u0443\u0434\u0443\u0442 \u0437\u0430\u043C\u0435\u043D\u0435\u043D\u044B \u0441\u0435\u0440\u0432\u0435\u0440\u043D\u044B\u043C\u0438 \u0432\u0435\u0440\u0441\u0438\u044F\u043C\u0438, \u0430 \u043B\u043E\u043A\u0430\u043B\u044C\u043D\u044B\u0435-only \u043F\u0443\u0442\u0438 \u0431\u0443\u0434\u0443\u0442 \u0443\u0434\u0430\u043B\u0435\u043D\u044B \u043F\u043E\u0441\u043B\u0435 \u0441\u043E\u0445\u0440\u0430\u043D\u0435\u043D\u0438\u044F safety copies \u0432 .sync-conflict-local.",
    "settings.publishLocalVaultState": "\u0421\u0434\u0435\u043B\u0430\u0442\u044C \u044D\u0442\u043E\u0442 \u043A\u043B\u0438\u0435\u043D\u0442 \u0438\u0441\u0442\u043E\u0447\u043D\u0438\u043A\u043E\u043C",
    "settings.publishLocalVaultStateDesc": "\u0424\u0430\u0439\u043B\u044B \u0442\u043E\u043B\u044C\u043A\u043E \u043B\u043E\u043A\u0430\u043B\u044C\u043D\u043E \u0431\u0443\u0434\u0443\u0442 \u0441\u043E\u0437\u0434\u0430\u043D\u044B \u043D\u0430 \u0441\u0435\u0440\u0432\u0435\u0440\u0435, \u0438\u0437\u043C\u0435\u043D\u0451\u043D\u043D\u044B\u0435 \u0444\u0430\u0439\u043B\u044B \u0431\u0443\u0434\u0443\u0442 \u043E\u043F\u0443\u0431\u043B\u0438\u043A\u043E\u0432\u0430\u043D\u044B \u0441 \u044D\u0442\u043E\u0433\u043E \u043A\u043B\u0438\u0435\u043D\u0442\u0430, \u0430 server-only \u043F\u0443\u0442\u0438 \u0431\u0443\u0434\u0443\u0442 \u0443\u0434\u0430\u043B\u0435\u043D\u044B \u0441 \u0441\u0435\u0440\u0432\u0435\u0440\u0430.",
    "confirm.acceptServerVaultState": "\u041F\u0440\u0438\u043C\u0435\u043D\u0438\u0442\u044C \u0441\u0435\u0440\u0432\u0435\u0440\u043D\u0443\u044E \u043A\u0430\u0440\u0442\u0438\u043D\u0443 \u043A \u044D\u0442\u043E\u043C\u0443 \u043A\u043B\u0438\u0435\u043D\u0442\u0443 \u0434\u043B\u044F {{count}} \u0440\u0430\u0441\u0445\u043E\u0436\u0434\u0435\u043D\u0438\u0439? Server-only \u0444\u0430\u0439\u043B\u044B \u0431\u0443\u0434\u0443\u0442 \u0441\u043A\u0430\u0447\u0430\u043D\u044B; local-only \u0444\u0430\u0439\u043B\u044B \u0431\u0443\u0434\u0443\u0442 \u0443\u0434\u0430\u043B\u0435\u043D\u044B \u043F\u043E\u0441\u043B\u0435 \u0441\u043E\u0437\u0434\u0430\u043D\u0438\u044F safety copies.",
    "confirm.publishLocalVaultState": "\u041E\u043F\u0443\u0431\u043B\u0438\u043A\u043E\u0432\u0430\u0442\u044C \u044D\u0442\u043E\u0442 \u043A\u043B\u0438\u0435\u043D\u0442 \u043A\u0430\u043A \u0438\u0441\u0442\u043E\u0447\u043D\u0438\u043A \u0434\u043B\u044F {{count}} \u0440\u0430\u0441\u0445\u043E\u0436\u0434\u0435\u043D\u0438\u0439? Local-only \u0444\u0430\u0439\u043B\u044B \u0431\u0443\u0434\u0443\u0442 \u0437\u0430\u0433\u0440\u0443\u0436\u0435\u043D\u044B; server-only \u0444\u0430\u0439\u043B\u044B \u0431\u0443\u0434\u0443\u0442 \u0443\u0434\u0430\u043B\u0435\u043D\u044B \u0441 \u0441\u0435\u0440\u0432\u0435\u0440\u0430 \u0434\u043B\u044F \u0432\u0441\u0435\u0445 \u043A\u043B\u0438\u0435\u043D\u0442\u043E\u0432.",
    "confirm.mergeVaultDivergence": "\u0421\u043B\u0438\u0442\u044C {{count}} \u043F\u0443\u0442\u0435\u0439, \u043A\u043E\u0442\u043E\u0440\u044B\u0435 \u0435\u0441\u0442\u044C \u0442\u043E\u043B\u044C\u043A\u043E \u0441 \u043E\u0434\u043D\u043E\u0439 \u0441\u0442\u043E\u0440\u043E\u043D\u044B? \u0424\u0430\u0439\u043B\u044B \u0441 \u0440\u0430\u0437\u043D\u044B\u043C \u0441\u043E\u0434\u0435\u0440\u0436\u0438\u043C\u044B\u043C \u043F\u043E \u043E\u0434\u043D\u043E\u043C\u0443 \u043F\u0443\u0442\u0438 \u043D\u0435 \u0431\u0443\u0434\u0443\u0442 \u0438\u0437\u043C\u0435\u043D\u0435\u043D\u044B (\u043E\u0441\u0442\u0430\u043D\u0435\u0442\u0441\u044F: {{changed}}).",
    "status.unknown": "\u043D\u0435\u0438\u0437\u0432\u0435\u0441\u0442\u043D\u043E",
    "sectionStatus.connected": "\u043F\u043E\u0434\u043A\u043B\u044E\u0447\u0435\u043D",
    "sectionStatus.notConnected": "\u043D\u0435 \u043F\u043E\u0434\u043A\u043B\u044E\u0447\u0435\u043D",
    "sectionStatus.configured": "\u043D\u0430\u0441\u0442\u0440\u043E\u0435\u043D",
    "sectionStatus.notConfigured": "\u043D\u0435 \u043D\u0430\u0441\u0442\u0440\u043E\u0435\u043D",
    "sectionStatus.checking": "\u043F\u0440\u043E\u0432\u0435\u0440\u043A\u0430\u2026",
    "sectionStatus.blocked": "\u0437\u0430\u0431\u043B\u043E\u043A\u0438\u0440\u043E\u0432\u0430\u043D\u043E",
    "sectionStatus.error": "\u043E\u0448\u0438\u0431\u043A\u0430",
    "sectionStatus.autoSync": "\u0430\u0432\u0442\u043E\u0441\u0438\u043D\u0445\u0440\u043E\u043D\u0438\u0437\u0430\u0446\u0438\u044F",
    "sectionStatus.manualSync": "\u0440\u0443\u0447\u043D\u0430\u044F \u0441\u0438\u043D\u0445\u0440\u043E\u043D\u0438\u0437\u0430\u0446\u0438\u044F",
    "sectionStatus.syncConflicted": "\u041A\u043E\u043D\u0444\u043B\u0438\u043A\u0442 \u0441\u0438\u043D\u0445\u0440\u043E\u043D\u0438\u0437\u0430\u0446\u0438\u0438",
    "sectionStatus.noConflicts": "\u041D\u0435\u0442 \u043A\u043E\u043D\u0444\u043B\u0438\u043A\u0442\u043E\u0432",
    "sectionStatus.conflictsOpen": "\u041E\u0442\u043A\u0440\u044B\u0442\u043E: {{count}}",
    "sectionStatus.noVaultDivergence": "\u041D\u0435\u0442 \u0440\u0430\u0441\u0445\u043E\u0436\u0434\u0435\u043D\u0438\u0439",
    "sectionStatus.vaultDiverged": "\u0420\u0430\u0441\u0445\u043E\u0436\u0434\u0435\u043D\u0438\u0439: {{count}}",
    "statusBar.notePresence": "HTTP Sync: \u0437\u0430\u043C\u0435\u0442\u043A\u0430 {{path}} \u043E\u0442\u043A\u0440\u044B\u0442\u0430 \u0432 \u0434\u0440\u0443\u0433\u043E\u043C \u043A\u043B\u0438\u0435\u043D\u0442\u0435 ({{holders}})",
    "statusBar.noteReadonly": "HTTP Sync: \u0437\u0430\u043C\u0435\u0442\u043A\u0430 {{path}} \u0434\u043E\u0441\u0442\u0443\u043F\u043D\u0430 \u0442\u043E\u043B\u044C\u043A\u043E \u0434\u043B\u044F \u0447\u0442\u0435\u043D\u0438\u044F ({{holders}})",
    "statusBar.notePresenceShort": "\u0417\u0430\u043C\u0435\u0442\u043A\u0430: +{{count}}",
    "statusBar.noteReadonlyShort": "\u0417\u0430\u043C\u0435\u0442\u043A\u0430: \u0442\u043E\u043B\u044C\u043A\u043E \u0447\u0442\u0435\u043D\u0438\u0435",
    "statusBar.noteUnknownHolders": "\u043D\u0435\u0438\u0437\u0432\u0435\u0441\u0442\u043D\u044B\u0435 \u0434\u0435\u0440\u0436\u0430\u0442\u0435\u043B\u0438",
    "statusBar.brand": "Arcalink",
    "statusBar.openSettings": "\u041E\u0442\u043A\u0440\u044B\u0442\u044C \u043D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438 Arcalink",
    "statusBar.lampOk": "Arcalink: \u0432\u0441\u0451 \u0440\u0430\u0431\u043E\u0442\u0430\u0435\u0442",
    "statusBar.lampNoConnection": "Arcalink: \u043D\u0435\u0442 \u0441\u0432\u044F\u0437\u0438 \u0441 \u0441\u0435\u0440\u0432\u0435\u0440\u043E\u043C",
    "statusBar.lampBlocked": "Arcalink: \u0441\u0438\u043D\u0445\u0440\u043E\u043D\u0438\u0437\u0430\u0446\u0438\u044F \u0437\u0430\u0431\u043B\u043E\u043A\u0438\u0440\u043E\u0432\u0430\u043D\u0430",
    "statusBar.lampSyncError": "Arcalink: \u043E\u0448\u0438\u0431\u043A\u0430 \u0441\u0438\u043D\u0445\u0440\u043E\u043D\u0438\u0437\u0430\u0446\u0438\u0438",
    "statusBar.lampConflict": "Arcalink: \u0435\u0441\u0442\u044C \u043A\u043E\u043D\u0444\u043B\u0438\u043A\u0442\u044B \u0441\u0438\u043D\u0445\u0440\u043E\u043D\u0438\u0437\u0430\u0446\u0438\u0438",
    "statusBar.lampConflictCount": "Arcalink: \u043E\u0442\u043A\u0440\u044B\u0442\u044B\u0445 \u043A\u043E\u043D\u0444\u043B\u0438\u043A\u0442\u043E\u0432: {{count}}",
    "statusBar.syncModeAuto": "\u0410\u0432\u0442\u043E\u0441\u0438\u043D\u0445\u0440\u043E\u043D\u0438\u0437\u0430\u0446\u0438\u044F",
    "statusBar.syncModeManual": "\u0420\u0443\u0447\u043D\u0430\u044F \u0441\u0438\u043D\u0445\u0440\u043E\u043D\u0438\u0437\u0430\u0446\u0438\u044F",
    "statusBar.serverLabel": "\u0421\u0435\u0440\u0432\u0435\u0440",
    "statusBar.serverConnected": "\u043F\u043E\u0434\u043A\u043B\u044E\u0447\u0451\u043D",
    "statusBar.serverChecking": "\u043F\u0440\u043E\u0432\u0435\u0440\u043A\u0430",
    "statusBar.serverBlocked": "\u0437\u0430\u0431\u043B\u043E\u043A\u0438\u0440\u043E\u0432\u0430\u043D",
    "statusBar.serverError": "\u043E\u0448\u0438\u0431\u043A\u0430",
    "statusBar.serverNotConfigured": "\u043D\u0435 \u043D\u0430\u0441\u0442\u0440\u043E\u0435\u043D",
    "statusBar.serverNotConnected": "\u043D\u0435\u0442 \u043F\u043E\u0434\u043A\u043B\u044E\u0447\u0435\u043D\u0438\u044F",
    "statusBar.syncLabel": "\u0421\u0438\u043D\u0445\u0440\u043E\u043D\u0438\u0437\u0430\u0446\u0438\u044F",
    "statusBar.syncIdle": "\u0432 \u043E\u0436\u0438\u0434\u0430\u043D\u0438\u0438",
    "statusBar.syncing": "\u0441\u0438\u043D\u0445\u0440\u043E\u043D\u0438\u0437\u0430\u0446\u0438\u044F",
    "statusBar.syncProgress": "\u0424\u0430\u0439\u043B\u044B: {{completed}}/{{total}}",
    "statusBar.syncQueued": "\u0432 \u043E\u0447\u0435\u0440\u0435\u0434\u0438",
    "statusBar.syncError": "\u043E\u0448\u0438\u0431\u043A\u0430",
    "statusBar.syncNotConfigured": "\u043D\u0435 \u043D\u0430\u0441\u0442\u0440\u043E\u0435\u043D\u0430"
  }
};
function translate(language, key, params2 = {}) {
  const locale = language === "en" ? "en" : "ru";
  const template = UI_LOCALES[locale][key] || UI_LOCALES.en[key] || key;
  return template.replace(
    /\{\{(\w+)\}\}/g,
    (_, name) => Object.prototype.hasOwnProperty.call(params2, name) ? String(params2[name]) : ""
  );
}
function translateRole(language, role) {
  return translate(language, `role.${role || "member"}`);
}
function normalizeSharedFolderScopeForApi(paths) {
  const rawPaths = (Array.isArray(paths) ? paths : [paths]).map((path) => String(path || "").trim()).filter(Boolean).filter((path) => !isWholeVaultScopeInputValue(path));
  if (rawPaths.length === 0) {
    return [];
  }
  const normalized = normalizeSyncFolderPathList(rawPaths);
  return normalized.includes("") ? [] : normalized;
}
function isWholeVaultScopeInputValue(value) {
  const normalizedValue = String(value || "").trim().toLowerCase();
  return [
    "\u0432\u0441\u0435 \u0445\u0440\u0430\u043D\u0438\u043B\u0438\u0449\u0435",
    "\u0432\u0441\u0451 \u0445\u0440\u0430\u043D\u0438\u043B\u0438\u0449\u0435",
    "\u0432\u0435\u0441\u044C vault",
    "whole vault"
  ].includes(normalizedValue);
}
function formatSharedFolderScope(language, paths) {
  const normalized = normalizeSharedFolderScopeForApi(paths);
  if (!normalized.length) {
    return translate(language, "settings.wholeVaultAccess");
  }
  return translate(language, "settings.folderScopeAccess", {
    folders: normalized.join(", ")
  });
}
var ObsidianHttpSyncSettingTab = class extends PluginSettingTab {
  constructor(app, plugin) {
    super(app, plugin);
    this.plugin = plugin;
    this.sharingDraft = {
      userEmail: "",
      role: "editor",
      sharedFolderPaths: this.plugin.t("settings.wholeVaultAccessInput")
    };
    this.sharingFolderExpandedPaths = /* @__PURE__ */ new Set();
    this.availableVaults = [];
    this.selectedVaultDraftId = "";
    this.syncFolderDraft = null;
    this.vaultConnectionAutoOpened = false;
    this.sectionOpenState = {
      account: false,
      vaultConnection: false,
      sync: false,
      vaultDivergence: false,
      conflicts: false,
      sharing: false,
      telegram: false
    };
    this.vaultDivergenceReport = null;
    this.pluginUpdateState = {
      checking: false,
      installing: false,
      checkedAt: "",
      currentVersion: this.plugin.getCurrentPluginVersion(),
      latestVersion: "",
      updateAvailable: false,
      hasDifferentFiles: false,
      lastError: ""
    };
  }
  getAccessibleVaultById(vaultId) {
    const targetVaultId = String(vaultId || "").trim();
    return this.availableVaults.find(
      (accessibleVault) => accessibleVault && accessibleVault.vault && String(accessibleVault.vault.id || "") === targetVaultId
    );
  }
  getSharingDraftFolderPaths() {
    return normalizeSharedFolderScopeForApi(
      String(this.sharingDraft.sharedFolderPaths || "").split("\n")
    );
  }
  setSharingDraftFolderPaths(paths) {
    const normalizedPaths = normalizeSharedFolderScopeForApi(paths);
    this.sharingDraft.sharedFolderPaths = normalizedPaths.length ? normalizedPaths.join("\n") : this.plugin.t("settings.wholeVaultAccessInput");
    return normalizedPaths;
  }
  getShareableVaultFolderTree() {
    const vault = this.app && this.app.vault;
    const root = vault && typeof vault.getRoot === "function" ? vault.getRoot() : null;
    if (!root || !Array.isArray(root.children)) {
      return [];
    }
    const buildNode = (folder) => ({
      name: String(folder.name || folder.path || ""),
      path: normalizePath(String(folder.path || "")),
      children: (Array.isArray(folder.children) ? folder.children : []).filter(
        (child) => child instanceof TFolder && isShareableFolderPath(child.path)
      ).sort(
        (left, right) => String(left.name || left.path || "").localeCompare(
          String(right.name || right.path || "")
        )
      ).map(buildNode)
    });
    return root.children.filter(
      (child) => child instanceof TFolder && isShareableFolderPath(child.path)
    ).sort(
      (left, right) => String(left.name || left.path || "").localeCompare(
        String(right.name || right.path || "")
      )
    ).map(buildNode);
  }
  renderSharedFolderSelector(controlEl) {
    const t = (key, params2 = {}) => this.plugin.t(key, params2);
    controlEl.empty();
    const selectorEl = controlEl.createEl("details", {
      cls: "arcalink-shared-folder-selector"
    });
    selectorEl.style.minWidth = "260px";
    selectorEl.style.maxWidth = "380px";
    selectorEl.style.width = "100%";
    const summaryEl = selectorEl.createEl("summary");
    summaryEl.style.cursor = "pointer";
    summaryEl.style.whiteSpace = "normal";
    const treeEl = selectorEl.createDiv({
      cls: "arcalink-shared-folder-tree"
    });
    treeEl.style.maxHeight = "280px";
    treeEl.style.overflow = "auto";
    treeEl.style.padding = "8px 4px 4px";
    const updateSelection = (path, checked) => {
      const currentPaths = this.getSharingDraftFolderPaths();
      const nextPaths = checked ? currentPaths.concat(path) : currentPaths.filter((currentPath) => currentPath !== path);
      this.setSharingDraftFolderPaths(nextPaths);
      renderTree();
    };
    const createCheckboxRow = (container, label, path, selectedPaths) => {
      const rowEl = container.createEl("span", {
        cls: "arcalink-shared-folder-row"
      });
      rowEl.style.display = "flex";
      rowEl.style.alignItems = "center";
      rowEl.style.gap = "6px";
      rowEl.style.minHeight = "26px";
      const checkboxEl = rowEl.createEl("input");
      checkboxEl.type = "checkbox";
      const selectedExact = path ? selectedPaths.includes(path) : selectedPaths.length === 0;
      const coveredByParent = path ? selectedPaths.some((selectedPath) => path.startsWith(`${selectedPath}/`)) : false;
      const hasSelectedChild = path ? selectedPaths.some((selectedPath) => selectedPath.startsWith(`${path}/`)) : false;
      checkboxEl.checked = selectedExact || coveredByParent;
      checkboxEl.indeterminate = !checkboxEl.checked && hasSelectedChild;
      checkboxEl.disabled = coveredByParent;
      checkboxEl.setAttribute("aria-label", label);
      checkboxEl.addEventListener("click", (event) => event.stopPropagation());
      checkboxEl.addEventListener("change", (event) => {
        event.stopPropagation();
        if (!path) {
          this.setSharingDraftFolderPaths([]);
          renderTree();
          return;
        }
        updateSelection(path, event.currentTarget.checked);
      });
      const labelEl = rowEl.createEl("span", { text: label });
      labelEl.style.overflowWrap = "anywhere";
      return rowEl;
    };
    const renderFolderNode = (container, node, selectedPaths, depth) => {
      const nodeEl = container.createDiv({
        cls: "arcalink-shared-folder-node"
      });
      nodeEl.style.paddingLeft = `${depth * 14}px`;
      if (!node.children.length) {
        createCheckboxRow(nodeEl, node.name, node.path, selectedPaths);
        return;
      }
      const branchEl = nodeEl.createEl("details");
      branchEl.open = this.sharingFolderExpandedPaths.has(node.path);
      branchEl.addEventListener("toggle", () => {
        if (branchEl.open) {
          this.sharingFolderExpandedPaths.add(node.path);
        } else {
          this.sharingFolderExpandedPaths.delete(node.path);
        }
      });
      const branchSummaryEl = branchEl.createEl("summary");
      branchSummaryEl.style.cursor = "pointer";
      createCheckboxRow(
        branchSummaryEl,
        node.name,
        node.path,
        selectedPaths
      );
      const childrenEl = branchEl.createDiv();
      for (const child of node.children) {
        renderFolderNode(childrenEl, child, selectedPaths, depth + 1);
      }
    };
    const renderTree = () => {
      const selectedPaths = this.getSharingDraftFolderPaths();
      summaryEl.setText(
        selectedPaths.length ? t("settings.selectedSharedFolders", { count: selectedPaths.length }) : t("settings.wholeVaultAccessInput")
      );
      treeEl.empty();
      createCheckboxRow(
        treeEl,
        t("settings.wholeVaultAccessInput"),
        "",
        selectedPaths
      );
      const folderTree = this.getShareableVaultFolderTree();
      if (!folderTree.length) {
        const emptyEl = treeEl.createEl("p", {
          text: t("settings.noShareableFolders")
        });
        emptyEl.style.opacity = "0.72";
        emptyEl.style.margin = "6px 0 2px";
        return;
      }
      for (const folder of folderTree) {
        renderFolderNode(treeEl, folder, selectedPaths, 0);
      }
    };
    renderTree();
  }
  getAccessibleVaultLabel(accessibleVault) {
    const vault = accessibleVault && accessibleVault.vault ? accessibleVault.vault : {};
    const membership = accessibleVault && accessibleVault.membership ? accessibleVault.membership : {};
    if (!vault.id) {
      return "";
    }
    const role = translateRole(this.plugin.settings.language, membership.role || "member");
    return `${vault.name || vault.id} (${role})`;
  }
  getAccessibleVaultScopeLabel(accessibleVault) {
    const paths = this.plugin.getAccessibleVaultSyncFolderPaths(accessibleVault);
    if (paths.includes("")) {
      return this.plugin.t("settings.wholeVaultAccess");
    }
    return this.plugin.t("settings.folderScopeAccess", {
      folders: paths.join(", ")
    });
  }
  getAccessibleVaultConnectPrompt(accessibleVault) {
    const vault = accessibleVault && accessibleVault.vault ? accessibleVault.vault : {};
    const membership = accessibleVault && accessibleVault.membership ? accessibleVault.membership : {};
    const vaultLabel = vault.name || vault.id || this.plugin.t("status.unknown");
    const role = translateRole(this.plugin.settings.language, membership.role || "member");
    const scope = this.getAccessibleVaultScopeLabel(accessibleVault);
    const inviter = String(membership.invited_by_user_email || "").trim();
    if (inviter) {
      return this.plugin.t("settings.sharedAccessReadyDescWithInviter", {
        vault: vaultLabel,
        role,
        scope,
        inviter
      });
    }
    return this.plugin.t("settings.sharedAccessReadyDesc", {
      vault: vaultLabel,
      role,
      scope
    });
  }
  shouldPromptVaultConnection() {
    return Boolean(!this.plugin.settings.vaultId && this.availableVaults.length > 0);
  }
  ensureVaultConnectionDraft() {
    if (!this.selectedVaultDraftId && this.plugin.settings.vaultId) {
      this.selectedVaultDraftId = this.plugin.settings.vaultId;
    }
    if (!this.selectedVaultDraftId && this.availableVaults.length === 1) {
      const onlyVault = this.availableVaults[0] && this.availableVaults[0].vault;
      this.selectedVaultDraftId = onlyVault && onlyVault.id ? onlyVault.id : "";
    }
    if (this.syncFolderDraft === null) {
      const selectedAccessibleVault = this.getAccessibleVaultById(this.selectedVaultDraftId);
      this.syncFolderDraft = formatSyncFolderPaths(
        selectedAccessibleVault ? this.plugin.getAccessibleVaultSyncFolderPaths(selectedAccessibleVault) : this.plugin.settings.syncFolderPaths
      );
    }
  }
  async setSelectedVaultDraftId(vaultId) {
    this.selectedVaultDraftId = String(vaultId || "").trim();
    const selectedAccessibleVault = this.getAccessibleVaultById(this.selectedVaultDraftId);
    if (!selectedAccessibleVault) {
      this.syncFolderDraft = formatSyncFolderPaths(this.plugin.settings.syncFolderPaths);
      return;
    }
    let syncFolderPaths = this.plugin.getAccessibleVaultSyncFolderPaths(selectedAccessibleVault);
    if (!this.plugin.hasEmbeddedAccessibleVaultSyncFolderPaths(selectedAccessibleVault)) {
      try {
        const syncScope = await this.plugin.loadVaultSyncScope(this.selectedVaultDraftId);
        selectedAccessibleVault.sync_scope = syncScope;
        syncFolderPaths = normalizeSyncFolderPathList(
          syncScope && Array.isArray(syncScope.sync_folder_paths) ? syncScope.sync_folder_paths : []
        );
      } catch (error) {
        console.warn("[obsidian-http-sync] Could not load vault sync scope", error);
      }
    }
    this.syncFolderDraft = formatSyncFolderPaths(syncFolderPaths);
  }
  async maybePreloadAccessibleVaults() {
    if (this.availableVaults.length > 0) {
      return;
    }
    if (!this.plugin.settings.baseUrl || !this.plugin.settings.userEmail && !this.plugin.settings.userId || !this.plugin.settings.accessToken && !this.plugin.settings.refreshToken) {
      return;
    }
    await this.loadAccessibleVaults({ notify: false });
  }
  renderAuthStatus(containerEl) {
    const t = (key, params2 = {}) => this.plugin.t(key, params2);
    const authState = this.plugin.settings.authState || DEFAULT_AUTH_STATE;
    const authStatusKey = `auth.status.${authState.status}`;
    const authStatusLabel = t(authStatusKey);
    const syncBlockKey = `syncBlock.reason.${this.plugin.settings.syncBlockReason || SYNC_BLOCK_REASON.NONE}`;
    const syncBlockLabel = t(syncBlockKey);
    const statusBlock = containerEl.createDiv();
    const isConfigured = this.plugin.isConfigured();
    const isGood = isConfigured && authState.status === AUTH_STATUS.AUTHENTICATED && (this.plugin.settings.syncBlockReason === SYNC_BLOCK_REASON.NONE || !this.plugin.settings.syncBlockReason);
    const isWarning = authState.status === AUTH_STATUS.UNKNOWN || authState.status === AUTH_STATUS.MISSING_TOKEN;
    const indicator = isGood ? "\u{1F7E2}" : isWarning ? "\u{1F7E1}" : "\u{1F534}";
    statusBlock.createEl("h3", {
      text: `${indicator} ${t("auth.indicatorLabel")}`
    });
    const statusLine = statusBlock.createEl("p");
    statusLine.createEl("strong", { text: `${authStatusLabel}` });
    if (this.plugin.settings.syncBlockReason && this.plugin.settings.syncBlockReason !== SYNC_BLOCK_REASON.NONE) {
      statusBlock.createEl("p", {
        text: `${t("syncBlock.label")}: ${syncBlockLabel}`
      });
    }
    if (authState.lastChecked) {
      const checkedLabel = (this.plugin.settings.language === "ru" ? "\u041F\u0440\u043E\u0432\u0435\u0440\u0435\u043D\u043E" : "Checked") + ": " + new Date(authState.lastChecked).toLocaleString();
      statusBlock.createEl("p", {
        text: checkedLabel,
        cls: "setting-item-description"
      });
    }
  }
  renderSetupChecklist(containerEl) {
    const t = (key, params2 = {}) => this.plugin.t(key, params2);
    const checklist = containerEl.createDiv();
    checklist.createEl("h3", { text: t("settings.quickStart") });
    checklist.createEl("p", { text: t("settings.quickStartDesc") });
    const items = [
      {
        done: Boolean(this.plugin.settings.baseUrl),
        text: t("settings.setupStepServer")
      },
      {
        done: Boolean(this.plugin.settings.userEmail),
        text: t("settings.setupStepAccount")
      },
      {
        done: Boolean(
          this.plugin.settings.userId && this.plugin.settings.deviceId && (this.plugin.settings.accessToken || this.plugin.settings.refreshToken)
        ),
        text: t("settings.setupStepLogin")
      },
      {
        done: Boolean(this.plugin.settings.vaultId),
        text: t("settings.setupStepVault")
      },
      {
        done: Boolean(this.plugin.isConfigured()),
        text: t("settings.setupStepSync")
      },
      {
        done: true,
        text: t("settings.setupStepOptional")
      }
    ];
    const list = checklist.createEl("ul");
    for (const item of items) {
      list.createEl("li", {
        text: `${item.done ? "\u2713" : "\u25CB"} ${item.text}`
      });
    }
  }
  renderPluginUpdateSettings(containerEl) {
    const t = (key, params2 = {}) => this.plugin.t(key, params2);
    const updateState = this.pluginUpdateState || {};
    new Setting(containerEl).setName(t("settings.pluginUpdate")).setDesc(this.getPluginUpdateDescription()).addButton((button) => {
      button.setButtonText(t("button.checkUpdates")).setDisabled(Boolean(updateState.checking || updateState.installing)).onClick(async () => {
        this.pluginUpdateState = {
          ...this.pluginUpdateState,
          checking: true,
          lastError: ""
        };
        await this.display();
        try {
          const result = await this.plugin.checkForPluginUpdate();
          this.pluginUpdateState = {
            checking: false,
            installing: false,
            checkedAt: (/* @__PURE__ */ new Date()).toISOString(),
            currentVersion: result.currentVersion,
            latestVersion: result.latestVersion,
            updateAvailable: result.updateAvailable,
            hasDifferentFiles: result.hasDifferentFiles,
            lastError: ""
          };
          new Notice(
            result.updateAvailable ? t("notice.pluginUpdateAvailable", { version: result.latestVersion }) : t("notice.pluginUpdateNotAvailable")
          );
        } catch (error) {
          this.pluginUpdateState = {
            ...this.pluginUpdateState,
            checking: false,
            installing: false,
            lastError: error.message
          };
          new Notice(t("notice.pluginUpdateCheckFailed", { message: error.message }));
        }
        await this.display();
      });
    }).addButton((button) => {
      button.setCta().setButtonText(t("button.updatePlugin")).setDisabled(
        Boolean(
          updateState.checking || updateState.installing || !updateState.updateAvailable
        )
      ).onClick(async () => {
        this.pluginUpdateState = {
          ...this.pluginUpdateState,
          installing: true,
          lastError: ""
        };
        await this.display();
        try {
          const result = await this.plugin.installPluginUpdate();
          this.pluginUpdateState = {
            checking: false,
            installing: false,
            checkedAt: (/* @__PURE__ */ new Date()).toISOString(),
            currentVersion: result.latestVersion,
            latestVersion: result.latestVersion,
            updateAvailable: false,
            hasDifferentFiles: false,
            lastError: ""
          };
          new Notice(
            t("notice.pluginUpdateInstalled", { version: result.latestVersion }),
            8e3
          );
        } catch (error) {
          this.pluginUpdateState = {
            ...this.pluginUpdateState,
            installing: false,
            lastError: error.message
          };
          new Notice(t("notice.pluginUpdateInstallFailed", { message: error.message }));
        }
        await this.display();
      });
    });
  }
  getPluginUpdateDescription() {
    const updateState = this.pluginUpdateState || {};
    const currentVersion = updateState.currentVersion || this.plugin.getCurrentPluginVersion();
    let status;
    if (updateState.checking) {
      status = this.plugin.t("settings.pluginUpdateChecking");
    } else if (updateState.installing) {
      status = this.plugin.t("settings.pluginUpdateInstalling");
    } else if (updateState.lastError) {
      status = this.plugin.t("settings.pluginUpdateFailed", {
        message: updateState.lastError
      });
    } else if (updateState.updateAvailable) {
      status = this.plugin.t(
        updateState.hasDifferentFiles ? "settings.pluginUpdateAvailableBuild" : "settings.pluginUpdateAvailable",
        {
          latestVersion: updateState.latestVersion || currentVersion
        }
      );
    } else if (updateState.checkedAt) {
      status = this.plugin.t("settings.pluginUpdateCurrent", {
        latestVersion: updateState.latestVersion || currentVersion
      });
    } else {
      status = this.plugin.t("settings.pluginUpdateNotChecked");
    }
    return this.plugin.t("settings.pluginUpdateDesc", {
      currentVersion,
      status
    });
  }
  createSummaryWithStatus(detailsEl, title, initialStatus = "") {
    const summary = detailsEl.createEl("summary");
    const titleSpan = summary.createSpan({ text: title });
    const statusSpan = summary.createSpan({ text: initialStatus || "" });
    statusSpan.style.cssFloat = "right";
    statusSpan.style.opacity = "0.7";
    return statusSpan;
  }
  bindSectionOpenState(detailsEl, sectionKey) {
    const normalizedKey = String(sectionKey || "").trim();
    if (!normalizedKey) {
      return detailsEl;
    }
    detailsEl.open = Boolean(this.sectionOpenState[normalizedKey]);
    detailsEl.addEventListener("toggle", () => {
      this.sectionOpenState[normalizedKey] = detailsEl.open;
    });
    return detailsEl;
  }
  getAuthSectionStatus() {
    const authState = this.plugin.settings.authState || DEFAULT_AUTH_STATE;
    return this.plugin.t(`auth.status.${authState.status}`);
  }
  getVaultConnectionStatus() {
    return this.plugin.t(
      this.plugin.settings.vaultId ? "sectionStatus.connected" : "sectionStatus.notConnected"
    );
  }
  getSyncSectionStatus() {
    if (!this.plugin.isConfigured()) {
      return this.plugin.t("sectionStatus.notConfigured");
    }
    if (this.plugin.settings.syncBlockReason && this.plugin.settings.syncBlockReason !== SYNC_BLOCK_REASON.NONE) {
      return this.plugin.t("sectionStatus.blocked");
    }
    if (this.plugin.settings.lastError) {
      return this.plugin.t("sectionStatus.error");
    }
    if (this.plugin.getOpenConflictCount() > 0) {
      return this.plugin.t("sectionStatus.syncConflicted");
    }
    if (this.plugin.settings.autoSync) {
      return this.plugin.t("sectionStatus.autoSync");
    }
    return this.plugin.t("sectionStatus.manualSync");
  }
  getSharingSectionStatus() {
    if (!this.plugin.settings.baseUrl || !this.plugin.settings.userEmail && !this.plugin.settings.userId || !this.plugin.settings.vaultId) {
      return this.plugin.t("sectionStatus.notConfigured");
    }
    if (this.plugin.settings.collaborationBlockReason && this.plugin.settings.collaborationBlockReason !== COLLABORATION_BLOCK_REASON.NONE) {
      return this.plugin.t("sectionStatus.blocked");
    }
    return this.plugin.t("sectionStatus.checking");
  }
  getTelegramSectionStatus() {
    if (!this.plugin.settings.baseUrl || !this.plugin.settings.userEmail && !this.plugin.settings.userId) {
      return this.plugin.t("sectionStatus.notConnected");
    }
    return this.plugin.t("sectionStatus.checking");
  }
  getCrdtMarkdownSettingDescription() {
    const baseDescription = this.plugin.t("settings.crdtMarkdownEnabledDesc");
    const reason = String(this.plugin.settings.collaborationBlockReason || "").trim();
    if (!reason || reason === COLLABORATION_BLOCK_REASON.NONE) {
      return baseDescription;
    }
    return `${baseDescription} ${this.plugin.t("settings.crdtMarkdownBlockedHint", {
      reason: this.plugin.t(`collaborationBlock.reason.${reason}`)
    })}`;
  }
  isCurrentUserMembership(membership) {
    const currentUserId = String(this.plugin.settings.userId || "").trim();
    const currentUserEmail = String(this.plugin.settings.userEmail || "").trim().toLowerCase();
    const memberUserId = String(membership && membership.user_id || "").trim();
    const memberUserEmail = String(this.getMembershipEmail(membership)).trim().toLowerCase();
    return Boolean(
      currentUserId && memberUserId === currentUserId || currentUserEmail && memberUserEmail === currentUserEmail
    );
  }
  getMembershipEmail(membership) {
    return String(
      membership && (membership.user_email || membership.email || membership.userEmail) || ""
    ).trim();
  }
  getMembershipLabel(membership) {
    return this.getMembershipEmail(membership) || String(membership && membership.user_id || "").trim() || this.plugin.t("status.unknown");
  }
  getInviteEmail(invite) {
    return String(invite && (invite.email || invite.user_email || invite.userEmail) || "").trim();
  }
  getInviteStatusLabel(invite) {
    const status = String(invite && invite.status || "pending").trim().toLowerCase();
    return this.plugin.t(`invite.status.${status}`);
  }
  async display() {
    const { containerEl } = this;
    const t = (key, params2 = {}) => this.plugin.t(key, params2);
    containerEl.empty();
    const installedManifest = await this.plugin.refreshInstalledPluginManifest?.();
    const installedVersion = String(installedManifest?.version || "").trim();
    if (installedVersion) {
      this.pluginUpdateState.currentVersion = installedVersion;
    }
    await this.maybePreloadAccessibleVaults();
    this.ensureVaultConnectionDraft();
    containerEl.createEl("h2", { text: t("settings.title") });
    this.renderSetupChecklist(containerEl);
    this.renderAuthStatus(containerEl);
    this.renderPluginUpdateSettings(containerEl);
    const accountDetails = containerEl.createEl("details");
    this.bindSectionOpenState(accountDetails, "account");
    this.createSummaryWithStatus(accountDetails, t("settings.accountSetup"), this.getAuthSectionStatus());
    accountDetails.createEl("p", { text: t("settings.basicSyncDesc") });
    const accountContainer = accountDetails.createDiv();
    new Setting(accountContainer).setName(t("settings.language")).setDesc(t("settings.languageDesc")).addDropdown((dropdown) => {
      dropdown.addOption("ru", "\u0420\u0443\u0441\u0441\u043A\u0438\u0439");
      dropdown.addOption("en", "English");
      dropdown.setValue(this.plugin.settings.language || "ru");
      dropdown.onChange(async (value) => {
        this.plugin.settings.language = value === "en" ? "en" : "ru";
        await this.plugin.saveSettings();
        await this.display();
      });
    });
    new Setting(accountContainer).setName(t("settings.backendUrl")).setDesc(t("settings.backendUrlDesc")).addText(
      (text2) => text2.setPlaceholder("http://45.144.65.18").setValue(this.plugin.settings.baseUrl).onChange(async (value) => {
        this.plugin.settings.baseUrl = value.trim();
        await this.plugin.saveSettings();
      })
    );
    new Setting(accountContainer).setName(t("settings.userEmail")).setDesc(t("settings.userEmailDesc")).addText(
      (text2) => text2.setPlaceholder("me@example.com").setValue(this.plugin.settings.userEmail || "").onChange(async (value) => {
        const nextEmail = value.trim().toLowerCase();
        const previousEmail = String(this.plugin.settings.userEmail || "").trim().toLowerCase();
        this.plugin.settings.userEmail = nextEmail;
        if (nextEmail !== previousEmail) {
          this.plugin.settings.userId = "";
        }
        await this.plugin.saveSettings();
      })
    );
    new Setting(accountContainer).setName(t("settings.requestLoginCode")).setDesc(
      this.plugin.settings.authLoginExpiresAt ? t("settings.loginRequestExpires", {
        expiresAt: this.plugin.settings.authLoginExpiresAt
      }) : t("settings.requestLoginCodeDesc")
    ).addButton(
      (button) => button.setCta().setButtonText(t("button.requestCode")).onClick(async () => {
        try {
          await this.plugin.requestLoginCode({ notify: true });
          await this.display();
        } catch (error) {
          new Notice(t("notice.loginRequestFailed", { message: error.message }));
        }
      })
    );
    new Setting(accountContainer).setName(t("settings.loginCode")).setDesc(
      this.plugin.settings.authLoginCode ? t("settings.loginCodeDevDesc") : t("settings.loginCodeDesc")
    ).addText(
      (text2) => text2.setPlaceholder("000000").setValue(this.plugin.settings.authLoginCode || "").onChange(async (value) => {
        this.plugin.settings.authLoginCode = value.trim();
        await this.plugin.saveSettings();
      })
    ).addButton(
      (button) => button.setCta().setButtonText(t("button.completeLogin")).onClick(async () => {
        try {
          await this.plugin.completeLoginWithCode(
            this.plugin.settings.authLoginCode,
            { notify: true }
          );
          await this.loadAccessibleVaults({ notify: false });
          await this.display();
        } catch (error) {
          new Notice(t("notice.loginFailed", { message: error.message }));
        }
      })
    );
    const vaultConnectionDetails = containerEl.createEl("details");
    this.bindSectionOpenState(vaultConnectionDetails, "vaultConnection");
    if (this.shouldPromptVaultConnection() && !this.sectionOpenState.vaultConnection && !this.vaultConnectionAutoOpened) {
      vaultConnectionDetails.open = true;
      this.vaultConnectionAutoOpened = true;
    }
    this.createSummaryWithStatus(vaultConnectionDetails, t("settings.vaultConnection"), this.getVaultConnectionStatus());
    const vaultConnectionContainer = vaultConnectionDetails.createDiv();
    const selectedAccessibleVault = this.getAccessibleVaultById(this.selectedVaultDraftId);
    const hasAccessibleVaults = this.availableVaults.length > 0;
    vaultConnectionContainer.createEl("p", {
      text: t("settings.currentLocalVault", {
        vaultName: this.plugin.getCurrentObsidianVaultName() || t("settings.unnamedVault")
      })
    });
    if (this.shouldPromptVaultConnection() && selectedAccessibleVault) {
      const sharedAccessPrompt = vaultConnectionContainer.createDiv();
      sharedAccessPrompt.createEl("p", {
        text: t("settings.sharedAccessReady")
      });
      sharedAccessPrompt.createEl("p", {
        text: this.getAccessibleVaultConnectPrompt(selectedAccessibleVault)
      });
    }
    if (!this.plugin.settings.vaultId) {
      new Setting(vaultConnectionContainer).setName(t("settings.publishCurrentVault")).setDesc(
        hasAccessibleVaults ? t("settings.publishCurrentVaultAvailableDesc") : t("settings.publishCurrentVaultDesc")
      ).addButton(
        (button) => button.setCta().setButtonText(t("button.publishCurrentVault")).onClick(async () => {
          try {
            await this.plugin.publishCurrentVaultToServer({ notify: true });
            await this.loadAccessibleVaults({ notify: false });
            await this.display();
          } catch (error) {
            new Notice(t("notice.currentVaultPublishFailed", { message: error.message }));
          }
        })
      );
    } else {
      vaultConnectionContainer.createEl("p", {
        text: t("settings.publishCurrentVaultHiddenDesc")
      });
    }
    new Setting(vaultConnectionContainer).setName(t("settings.accessibleVaults")).setDesc(t("settings.accessibleVaultsDesc")).addDropdown((dropdown) => {
      dropdown.addOption(
        "",
        this.availableVaults.length ? t("dropdown.selectVault") : t("dropdown.loadVaultsFirst")
      );
      for (const accessibleVault of this.availableVaults) {
        const vault = accessibleVault.vault || {};
        if (!vault.id) {
          continue;
        }
        dropdown.addOption(vault.id, this.getAccessibleVaultLabel(accessibleVault));
      }
      dropdown.setValue(this.selectedVaultDraftId || "");
      dropdown.onChange(async (value) => {
        await this.setSelectedVaultDraftId(value);
        await this.display();
      });
    }).addButton(
      (button) => button.setButtonText(t("button.loadVaults")).onClick(async () => {
        await this.loadAccessibleVaults({ notify: true });
        await this.display();
      })
    );
    vaultConnectionContainer.createEl("p", {
      text: t("settings.accessibleVaultsBehavior")
    });
    new Setting(vaultConnectionContainer).setName(t("settings.serverSyncFolders")).setDesc(
      selectedAccessibleVault && !selectedAccessibleVault.sync_scope ? t("settings.serverSyncFoldersInviteDesc") : t("settings.serverSyncFoldersDesc")
    ).addTextArea((textArea) => {
      textArea.setPlaceholder(t("settings.syncFoldersPlaceholder")).setValue(this.syncFolderDraft).onChange((value) => {
        this.syncFolderDraft = value;
      });
      if (selectedAccessibleVault && !selectedAccessibleVault.sync_scope) {
        textArea.setDisabled(true);
      }
    });
    const connectedAccessibleVault = this.getAccessibleVaultById(this.plugin.settings.vaultId);
    if (this.plugin.settings.vaultId) {
      vaultConnectionContainer.createEl("p", {
        text: t("settings.connectedServerVault", {
          vault: this.getAccessibleVaultLabel(connectedAccessibleVault) || this.plugin.settings.vaultId
        })
      });
    }
    new Setting(vaultConnectionContainer).setName(t("settings.connectCurrentVault")).setDesc(
      this.plugin.settings.vaultId ? t("settings.reconnectCurrentVaultDesc") : selectedAccessibleVault ? t("settings.connectSharedVaultDesc") : t("settings.connectCurrentVaultDesc")
    ).addButton((button) => {
      button.setCta().setButtonText(
        t(
          this.plugin.settings.vaultId ? "button.reconnectThisLocalVault" : selectedAccessibleVault ? "button.connectSharedVaultHere" : "button.connectThisLocalVault"
        )
      ).setDisabled(!this.selectedVaultDraftId).onClick(async () => {
        try {
          const selectedAccessibleVault2 = this.getAccessibleVaultById(
            this.selectedVaultDraftId
          );
          if (!selectedAccessibleVault2) {
            throw new Error(t("error.serverVaultRequired"));
          }
          await this.plugin.connectCurrentVaultToAccessibleVault(
            selectedAccessibleVault2,
            String(this.syncFolderDraft || "").split("\n"),
            { notify: true }
          );
          this.selectedVaultDraftId = this.plugin.settings.vaultId || "";
          this.syncFolderDraft = formatSyncFolderPaths(
            this.plugin.settings.syncFolderPaths
          );
          await this.display();
        } catch (error) {
          new Notice(t("notice.localVaultConnectFailed", { message: error.message }));
        }
      });
    });
    const syncDetails = containerEl.createEl("details");
    this.bindSectionOpenState(syncDetails, "sync");
    this.createSummaryWithStatus(syncDetails, t("settings.sync"), this.getSyncSectionStatus());
    const syncContainer = syncDetails.createDiv();
    new Setting(syncContainer).setName(t("settings.autoSync")).setDesc(t("settings.autoSyncDesc")).addToggle(
      (toggle) => toggle.setValue(this.plugin.settings.autoSync).onChange(async (value) => {
        this.plugin.settings.autoSync = value;
        await this.plugin.saveSettings();
      })
    );
    new Setting(syncContainer).setName(t("settings.syncObsidianConfig")).setDesc(t("settings.syncObsidianConfigDesc")).addToggle(
      (toggle) => toggle.setValue(this.plugin.settings.syncObsidianConfig === true).onChange(async (value) => {
        await this.plugin.setSyncObsidianConfig(value);
      })
    );
    new Setting(syncContainer).setName(t("settings.crdtMarkdownEnabled")).setDesc(this.getCrdtMarkdownSettingDescription()).addToggle(
      (toggle) => toggle.setValue(this.plugin.settings.crdtMarkdownEnabled === true).onChange(async (value) => {
        this.plugin.settings.crdtMarkdownEnabled = Boolean(value);
        if (value) {
          this.plugin.settings.collaborationBlockReason = COLLABORATION_BLOCK_REASON.NONE;
        }
        await this.plugin.saveSettings();
        if (value) {
          await this.plugin.disableCrdtMarkdownIfCollaborationBlocked();
        }
        this.plugin.scheduleCrdtPolling();
        await this.display();
      })
    );
    new Setting(syncContainer).setName(t("settings.syncInterval")).setDesc(t("settings.syncIntervalDesc")).addText(
      (text2) => text2.setValue(String(this.plugin.settings.syncIntervalSeconds)).onChange(async (value) => {
        const nextValue = Number(value);
        this.plugin.settings.syncIntervalSeconds = Number.isFinite(nextValue) ? Math.max(2, Math.floor(nextValue)) : DEFAULT_SETTINGS.syncIntervalSeconds;
        await this.plugin.saveSettings();
      })
    );
    new Setting(syncContainer).setName(t("settings.runSyncNow")).setDesc(
      this.plugin.t("settings.lastSyncStatus", {
        lastSyncAt: this.plugin.settings.lastSyncAt || t("status.never"),
        lastErrorSuffix: this.plugin.settings.lastError ? t("settings.lastErrorSuffix", {
          message: this.plugin.settings.lastError
        }) : "",
        lastSyncWarningSuffix: this.plugin.settings.lastSyncWarning ? t("settings.lastSyncWarningSuffix", {
          message: this.plugin.settings.lastSyncWarning
        }) : ""
      })
    ).addButton(
      (button) => button.setCta().setButtonText(t("button.syncNow")).onClick(async () => {
        button.setDisabled(true);
        try {
          await this.plugin.syncNow({
            notify: true,
            onProgress: ({ completedFiles, totalFiles }) => {
              button.setButtonText(
                t("button.syncProgress", {
                  completed: completedFiles,
                  total: totalFiles
                })
              );
            }
          });
          await this.display();
        } catch (error) {
          await this.display();
        } finally {
          button.setDisabled(false);
        }
      })
    );
    const vaultDivergenceDetails = containerEl.createEl("details");
    this.bindSectionOpenState(vaultDivergenceDetails, "vaultDivergence");
    const vaultDivergenceStatus = this.createSummaryWithStatus(
      vaultDivergenceDetails,
      t("settings.vaultDivergence"),
      ""
    );
    const vaultDivergenceContainer = vaultDivergenceDetails.createDiv();
    await this.renderVaultDivergenceSection(
      vaultDivergenceContainer,
      vaultDivergenceStatus
    );
    const conflictsDetails = containerEl.createEl("details");
    this.bindSectionOpenState(conflictsDetails, "conflicts");
    const conflictsStatus = this.createSummaryWithStatus(
      conflictsDetails,
      t("settings.syncConflicts"),
      ""
    );
    const conflictsContainer = conflictsDetails.createDiv();
    await this.renderConflictsSection(conflictsContainer, conflictsStatus);
    const sharingDetails = containerEl.createEl("details");
    this.bindSectionOpenState(sharingDetails, "sharing");
    const sharingStatus = this.createSummaryWithStatus(sharingDetails, t("settings.vaultSharing"), this.getSharingSectionStatus());
    const sharingContainer = sharingDetails.createDiv();
    sharingContainer.createEl("p", {
      text: t("settings.vaultSharingDesc")
    });
    new Setting(sharingContainer).setName(t("settings.colleagueEmail")).setDesc(t("settings.colleagueEmailDesc")).addText(
      (text2) => text2.setValue(this.sharingDraft.userEmail).onChange((value) => {
        this.sharingDraft.userEmail = value.trim().toLowerCase();
      })
    );
    const sharedFolderSetting = new Setting(sharingContainer).setName(t("settings.sharedFolderScope")).setDesc(t("settings.sharedFolderScopeDesc"));
    this.renderSharedFolderSelector(sharedFolderSetting.controlEl);
    new Setting(sharingContainer).setName(t("settings.vaultRole")).setDesc(t("settings.vaultRoleDesc")).addDropdown((dropdown) => {
      dropdown.addOption("editor", t("role.editor"));
      dropdown.addOption("viewer", t("role.viewer"));
      dropdown.addOption("owner", t("role.owner"));
      dropdown.setValue(this.sharingDraft.role);
      dropdown.onChange((value) => {
        this.sharingDraft.role = value;
      });
    }).addButton(
      (button) => button.setCta().setButtonText(t("button.grantAccess")).onClick(async () => {
        try {
          await this.plugin.grantVaultAccess(
            this.sharingDraft.userEmail,
            this.sharingDraft.role,
            this.getSharingDraftFolderPaths()
          );
          new Notice(t("notice.vaultInviteCreated", { email: this.sharingDraft.userEmail }));
          await this.display();
        } catch (error) {
          new Notice(t("notice.sharingUpdateFailed", { message: error.message }));
        }
      })
    ).addButton(
      (button) => button.setButtonText(t("button.refresh")).onClick(async () => {
        await this.display();
      })
    );
    const membershipsContainer = sharingContainer.createDiv();
    await this.renderVaultMembershipsSection(membershipsContainer, sharingStatus);
    sharingContainer.createEl("h3", { text: t("settings.sharedFolders") });
    sharingContainer.createEl("p", {
      text: t("settings.sharedFoldersDesc")
    });
    const telegramDetails = containerEl.createEl("details");
    this.bindSectionOpenState(telegramDetails, "telegram");
    const telegramStatus = this.createSummaryWithStatus(telegramDetails, "Telegram", this.getTelegramSectionStatus());
    const telegramContainer = telegramDetails.createDiv();
    telegramContainer.createEl("p", {
      text: t("settings.telegramDesc")
    });
    new Setting(telegramContainer).setName(t("settings.telegramInboxFolder")).setDesc(t("settings.telegramInboxFolderDesc")).addText(
      (text2) => text2.setValue(this.plugin.settings.telegramDefaultInboxFolder || "Inbox/Telegram").onChange(async (value) => {
        this.plugin.settings.telegramDefaultInboxFolder = value.trim() || "Inbox/Telegram";
        await this.plugin.saveSettings();
      })
    ).addButton(
      (button) => button.setCta().setButtonText(t("button.createLinkCode")).onClick(async () => {
        try {
          const payload = await this.plugin.createTelegramLinkRequest(
            this.plugin.settings.telegramDefaultInboxFolder
          );
          const code = payload && payload.telegram_link_request && payload.telegram_link_request.one_time_code ? payload.telegram_link_request.one_time_code : "";
          new Notice(
            code ? t("notice.telegramCodeCreatedWithCode", { code }) : t("notice.telegramCodeCreated")
          );
          await this.display();
        } catch (error) {
          new Notice(t("notice.telegramCodeFailed", { message: error.message }));
        }
      })
    );
    if (this.plugin.settings.telegramLastLinkCode) {
      telegramContainer.createEl("p", {
        text: t("settings.lastCode", { code: this.plugin.settings.telegramLastLinkCode })
      });
      if (this.plugin.settings.telegramLastLinkExpiresAt) {
        telegramContainer.createEl("p", {
          text: t("settings.expiresAt", {
            expiresAt: this.plugin.settings.telegramLastLinkExpiresAt
          })
        });
      }
    }
    const telegramLinksContainer = telegramContainer.createDiv();
    await this.renderTelegramLinksSection(telegramLinksContainer, telegramStatus);
  }
  async loadAccessibleVaults(options = {}) {
    try {
      this.availableVaults = await this.plugin.listAccessibleVaults();
      if (!this.selectedVaultDraftId) {
        this.selectedVaultDraftId = this.plugin.settings.vaultId || "";
      }
      if (!this.selectedVaultDraftId && this.availableVaults.length === 1) {
        const onlyVault = this.availableVaults[0] && this.availableVaults[0].vault;
        this.selectedVaultDraftId = onlyVault && onlyVault.id ? onlyVault.id : "";
      }
      this.syncFolderDraft = null;
      this.ensureVaultConnectionDraft();
      if (options.notify !== false) {
        new Notice(this.plugin.t("notice.loadedVaults", { count: this.availableVaults.length }));
      }
      return this.availableVaults;
    } catch (error) {
      this.availableVaults = [];
      if (options.notify !== false) {
        new Notice(this.plugin.t("notice.loadVaultsFailed", { message: error.message }));
      }
      return [];
    }
  }
  async renderVaultMembershipsSection(containerEl, statusSpan = null) {
    containerEl.empty();
    if (!this.plugin.settings.baseUrl || !this.plugin.settings.userEmail && !this.plugin.settings.userId || !this.plugin.settings.vaultId) {
      containerEl.createEl("p", {
        text: this.plugin.t("settings.membershipsNeedConfig")
      });
      if (statusSpan) {
        statusSpan.setText(this.plugin.t("sectionStatus.notConfigured"));
      }
      return;
    }
    try {
      const [memberships, invites] = await Promise.all([
        this.plugin.listVaultMemberships(),
        this.plugin.listVaultMembershipInvites()
      ]);
      const pendingInvites = invites.filter(
        (invite) => String(invite && invite.status || "").toLowerCase() === "pending"
      );
      containerEl.createEl("h4", { text: this.plugin.t("settings.currentMembers") });
      if (!memberships.length) {
        containerEl.createEl("p", { text: this.plugin.t("settings.noMembers") });
      }
      if (statusSpan) {
        const hasOtherMembers = memberships.some(
          (membership) => !this.isCurrentUserMembership(membership)
        );
        const hasPendingInvites = pendingInvites.length > 0;
        statusSpan.setText(
          this.plugin.t(
            hasOtherMembers || hasPendingInvites ? "sectionStatus.configured" : "sectionStatus.notConfigured"
          )
        );
      }
      for (const membership of memberships) {
        const memberLabel = this.getMembershipLabel(membership);
        const memberReference = this.plugin.t("settings.memberReference", {
          role: translateRole(this.plugin.settings.language, membership.role)
        });
        const scopeReference = formatSharedFolderScope(
          this.plugin.settings.language,
          membership.sync_folder_paths
        );
        const row = new Setting(containerEl).setName(`${memberLabel}`).setDesc(`${memberReference} - ${scopeReference}`);
        if (membership.role !== "owner" && membership.user_id !== this.plugin.settings.userId) {
          row.addButton(
            (button) => button.setWarning().setButtonText(this.plugin.t("button.remove")).onClick(async () => {
              try {
                await this.plugin.revokeVaultAccess(membership.user_id);
                new Notice(this.plugin.t("notice.removedAccess", { member: memberLabel }));
                await this.display();
              } catch (error) {
                new Notice(
                  this.plugin.t("notice.removeAccessFailed", { message: error.message })
                );
              }
            })
          );
        }
      }
      containerEl.createEl("h4", { text: this.plugin.t("settings.pendingInvites") });
      if (!pendingInvites.length) {
        containerEl.createEl("p", { text: this.plugin.t("settings.noPendingInvites") });
        return;
      }
      for (const invite of pendingInvites) {
        const inviteEmail = this.getInviteEmail(invite) || this.plugin.t("status.unknown");
        const inviteStatus = this.getInviteStatusLabel(invite);
        const inviteReference = this.plugin.t("settings.inviteSentReference", {
          role: translateRole(this.plugin.settings.language, invite.role),
          status: inviteStatus
        });
        const scopeReference = formatSharedFolderScope(
          this.plugin.settings.language,
          invite.sync_folder_paths
        );
        const row = new Setting(containerEl).setName(inviteEmail).setDesc(`${inviteReference} - ${scopeReference}`);
        row.addButton(
          (button) => button.setWarning().setButtonText(this.plugin.t("button.revoke")).onClick(async () => {
            try {
              await this.plugin.revokeVaultInvite(invite.id);
              new Notice(this.plugin.t("notice.vaultInviteRevoked", { email: inviteEmail }));
              await this.display();
            } catch (error) {
              new Notice(
                this.plugin.t("notice.revokeInviteFailed", { message: error.message })
              );
            }
          })
        );
      }
    } catch (error) {
      containerEl.createEl("p", {
        text: this.plugin.t("settings.loadMembershipsFailed", { message: error.message })
      });
      if (statusSpan) {
        statusSpan.setText(this.plugin.t("sectionStatus.error"));
      }
    }
  }
  async renderTelegramLinksSection(containerEl, statusSpan = null) {
    containerEl.empty();
    if (!this.plugin.settings.baseUrl || !this.plugin.settings.userEmail && !this.plugin.settings.userId) {
      containerEl.createEl("p", {
        text: this.plugin.t("settings.telegramNeedConfig")
      });
      if (statusSpan) {
        statusSpan.setText(this.plugin.t("sectionStatus.notConnected"));
      }
      return;
    }
    try {
      const links = await this.plugin.listTelegramLinks();
      containerEl.createEl("h4", { text: this.plugin.t("settings.connectedTelegramChats") });
      if (!links.length) {
        containerEl.createEl("p", { text: this.plugin.t("settings.noTelegramChats") });
        if (statusSpan) {
          statusSpan.setText(this.plugin.t("sectionStatus.notConnected"));
        }
        return;
      }
      if (statusSpan) {
        const hasActiveLink = links.some((l) => l.status !== "revoked");
        statusSpan.setText(
          this.plugin.t(
            hasActiveLink ? "sectionStatus.connected" : "sectionStatus.notConnected"
          )
        );
      }
      for (const link of links) {
        new Setting(containerEl).setName(this.plugin.t("settings.telegramChat", { chatId: link.telegram_chat_id })).setDesc(this.plugin.t("settings.status", { status: link.status })).addButton(
          (button) => button.setWarning().setButtonText(this.plugin.t("button.revoke")).onClick(async () => {
            try {
              await this.plugin.revokeTelegramLink(link.id);
              new Notice(
                this.plugin.t("notice.telegramRevoked", {
                  chatId: link.telegram_chat_id
                })
              );
              await this.display();
            } catch (error) {
              new Notice(
                this.plugin.t("notice.telegramRevokeFailed", { message: error.message })
              );
            }
          })
        );
      }
    } catch (error) {
      containerEl.createEl("p", {
        text: this.plugin.t("settings.loadTelegramFailed", { message: error.message })
      });
      if (statusSpan) {
        statusSpan.setText(this.plugin.t("sectionStatus.error"));
      }
    }
  }
  async renderVaultDivergenceSection(containerEl, statusSpan = null) {
    containerEl.empty();
    const t = (key, params2 = {}) => this.plugin.t(key, params2);
    if (!this.plugin.isConfigured()) {
      containerEl.createEl("p", { text: t("settings.vaultDivergenceNeedConfig") });
      if (statusSpan) {
        statusSpan.setText(t("sectionStatus.notConfigured"));
      }
      return;
    }
    const report = this.vaultDivergenceReport;
    const totalDifferences = report ? report.localOnly.length + report.remoteOnly.length + report.changed.length : null;
    if (statusSpan) {
      if (!report) {
        statusSpan.setText(t("sectionStatus.configured"));
      } else if (totalDifferences === 0) {
        statusSpan.setText(t("sectionStatus.noVaultDivergence"));
      } else {
        statusSpan.setText(
          t("sectionStatus.vaultDiverged", { count: totalDifferences })
        );
      }
    }
    containerEl.createEl("p", { text: t("settings.vaultDivergenceDesc") });
    new Setting(containerEl).setName(t("settings.checkVaultDivergence")).setDesc(t("settings.checkVaultDivergenceDesc")).addButton(
      (button) => button.setCta().setButtonText(t("button.checkVaultDivergence")).onClick(async () => {
        try {
          if (statusSpan) {
            statusSpan.setText(t("sectionStatus.checking"));
          }
          button.setDisabled(true);
          this.vaultDivergenceReport = await this.plugin.buildVaultDivergenceReport();
          await this.renderVaultDivergenceSection(containerEl, statusSpan);
        } catch (error) {
          this.vaultDivergenceReport = null;
          if (statusSpan) {
            statusSpan.setText(t("sectionStatus.error"));
          }
          new Notice(t("settings.loadVaultDivergenceFailed", { message: error.message }));
          await this.renderVaultDivergenceSection(containerEl, statusSpan);
        }
      })
    );
    if (!report) {
      return;
    }
    const checkedAt = report.checkedAt ? new Date(report.checkedAt).toLocaleString() : t("status.unknown");
    containerEl.createEl("p", {
      text: t("settings.vaultDivergenceCheckedAt", { checkedAt })
    });
    containerEl.createEl("p", {
      text: t("settings.vaultDivergenceCounts", {
        localCount: report.localCount,
        remoteCount: report.remoteCount,
        localOnlyCount: report.localOnly.length,
        remoteOnlyCount: report.remoteOnly.length,
        changedCount: report.changed.length
      })
    });
    containerEl.createEl("p", { text: t("settings.vaultDivergenceTimeHint") });
    if (totalDifferences === 0) {
      containerEl.createEl("p", { text: t("settings.vaultDivergenceNoDiff") });
      return;
    }
    this.renderVaultDivergenceActions(containerEl, statusSpan, report, totalDifferences);
    this.renderVaultDivergencePathList(
      containerEl,
      t("settings.vaultDivergenceLocalOnly"),
      report.localOnly,
      report.details || {}
    );
    this.renderVaultDivergencePathList(
      containerEl,
      t("settings.vaultDivergenceRemoteOnly"),
      report.remoteOnly,
      report.details || {}
    );
    this.renderVaultDivergencePathList(
      containerEl,
      t("settings.vaultDivergenceChanged"),
      report.changed,
      report.details || {}
    );
  }
  renderVaultDivergenceActions(containerEl, statusSpan, report, totalDifferences) {
    const t = (key, params2 = {}) => this.plugin.t(key, params2);
    const mergeCount = report.localOnly.length + report.remoteOnly.length;
    new Setting(containerEl).setName(t("settings.mergeVaultDivergence")).setDesc(t("settings.mergeVaultDivergenceDesc", { changed: report.changed.length })).addButton(
      (button) => button.setCta().setButtonText(t("button.mergeVaultDivergence")).setDisabled(mergeCount === 0).onClick(async () => {
        if (!confirm(
          t("confirm.mergeVaultDivergence", {
            count: mergeCount,
            changed: report.changed.length
          })
        )) {
          return;
        }
        try {
          if (statusSpan) {
            statusSpan.setText(t("sectionStatus.checking"));
          }
          button.setDisabled(true);
          const result = await this.plugin.mergeVaultDivergenceFileSets();
          this.vaultDivergenceReport = await this.plugin.buildVaultDivergenceReport();
          new Notice(
            t("notice.vaultDivergenceMerged", {
              downloaded: result.downloadedRemoteOnly,
              uploaded: result.uploadedLocalOnly,
              directories: result.createdRemoteDirectories,
              missing: result.missingRemoteObjectContent,
              conflicts: result.conflicts,
              changed: result.skippedChanged
            })
          );
          await this.renderVaultDivergenceSection(containerEl, statusSpan);
        } catch (error) {
          if (statusSpan) {
            statusSpan.setText(t("sectionStatus.error"));
          }
          new Notice(t("notice.vaultDivergenceResolveFailed", { message: error.message }));
          await this.renderVaultDivergenceSection(containerEl, statusSpan);
        }
      })
    );
    new Setting(containerEl).setName(t("settings.acceptServerVaultState")).setDesc(t("settings.acceptServerVaultStateDesc")).addButton(
      (button) => button.setWarning().setButtonText(t("button.acceptServerVaultState")).onClick(async () => {
        if (!confirm(t("confirm.acceptServerVaultState", { count: totalDifferences }))) {
          return;
        }
        try {
          if (statusSpan) {
            statusSpan.setText(t("sectionStatus.checking"));
          }
          button.setDisabled(true);
          const result = await this.plugin.acceptServerVaultState();
          this.vaultDivergenceReport = await this.plugin.buildVaultDivergenceReport();
          new Notice(
            t("notice.vaultDivergenceServerAccepted", {
              applied: result.appliedRemote,
              removed: result.removedLocalOnly,
              preserved: result.preservedLocalCopies
            })
          );
          await this.renderVaultDivergenceSection(containerEl, statusSpan);
        } catch (error) {
          if (statusSpan) {
            statusSpan.setText(t("sectionStatus.error"));
          }
          new Notice(t("notice.vaultDivergenceResolveFailed", { message: error.message }));
          await this.renderVaultDivergenceSection(containerEl, statusSpan);
        }
      })
    );
    new Setting(containerEl).setName(t("settings.publishLocalVaultState")).setDesc(t("settings.publishLocalVaultStateDesc")).addButton(
      (button) => button.setWarning().setButtonText(t("button.publishLocalVaultState")).onClick(async () => {
        if (!confirm(t("confirm.publishLocalVaultState", { count: totalDifferences }))) {
          return;
        }
        try {
          if (statusSpan) {
            statusSpan.setText(t("sectionStatus.checking"));
          }
          button.setDisabled(true);
          const report2 = await this.plugin.publishLocalVaultStateAsSource();
          this.vaultDivergenceReport = await this.plugin.buildVaultDivergenceReport();
          new Notice(
            t("notice.vaultDivergenceLocalPublished", {
              pushed: report2.pushedOperations,
              conflicts: report2.conflicts
            })
          );
          await this.renderVaultDivergenceSection(containerEl, statusSpan);
        } catch (error) {
          if (statusSpan) {
            statusSpan.setText(t("sectionStatus.error"));
          }
          new Notice(t("notice.vaultDivergenceResolveFailed", { message: error.message }));
          await this.renderVaultDivergenceSection(containerEl, statusSpan);
        }
      })
    );
  }
  renderVaultDivergencePathList(containerEl, title, paths, details = {}) {
    const visiblePaths = (paths || []).slice(0, 25);
    if (visiblePaths.length === 0) {
      return;
    }
    containerEl.createEl("h4", { text: title });
    const listEl = containerEl.createEl("ul");
    for (const path of visiblePaths) {
      const itemEl = listEl.createEl("li");
      itemEl.createEl("code", { text: path });
      const pathDetails = details[path] || {};
      itemEl.createEl("div", {
        cls: "sync-vault-divergence-meta",
        text: this.formatVaultDivergenceSideDetail(
          this.plugin.t("settings.vaultDivergenceSideLocal"),
          pathDetails.local
        )
      });
      itemEl.createEl("div", {
        cls: "sync-vault-divergence-meta",
        text: this.formatVaultDivergenceSideDetail(
          this.plugin.t("settings.vaultDivergenceSideServer"),
          pathDetails.server
        )
      });
    }
    const hiddenCount = (paths || []).length - visiblePaths.length;
    if (hiddenCount > 0) {
      const itemEl = listEl.createEl("li");
      itemEl.setText(
        this.plugin.t("settings.vaultDivergenceMore", { count: hiddenCount })
      );
    }
  }
  formatVaultDivergenceSideDetail(sideLabel, detail) {
    const t = (key, params2 = {}) => this.plugin.t(key, params2);
    if (!detail) {
      return t("settings.vaultDivergenceSideMissing", { side: sideLabel });
    }
    return t("settings.vaultDivergenceSideMeta", {
      side: sideLabel,
      modifiedAt: formatVaultDivergenceTimestamp(detail.modifiedAt, t("status.unknown")),
      type: detail.entryType || t("status.unknown"),
      size: formatVaultDivergenceSize(detail.sizeBytes),
      hash: shortContentHash(detail.contentHash)
    });
  }
  async renderConflictsSection(containerEl, statusSpan = null) {
    containerEl.empty();
    const t = (key, params2 = {}) => this.plugin.t(key, params2);
    if (!this.plugin.isConfigured()) {
      containerEl.createEl("p", { text: t("settings.syncConflictsNeedConfig") });
      if (statusSpan) {
        statusSpan.setText(t("sectionStatus.notConfigured"));
      }
      return;
    }
    let openConflicts;
    let usedCachedConflicts = false;
    try {
      openConflicts = await this.plugin.syncConflictState();
    } catch (error) {
      usedCachedConflicts = true;
      containerEl.createEl("p", {
        text: t("settings.loadConflictsUsingCache", { message: error.message })
      });
      openConflicts = this.plugin.getCachedOpenConflicts();
    }
    if (openConflicts.length === 0) {
      if (!usedCachedConflicts) {
        containerEl.createEl("p", { text: t("settings.noConflicts") });
      }
      if (statusSpan) {
        statusSpan.setText(
          usedCachedConflicts ? t("sectionStatus.error") : t("sectionStatus.noConflicts")
        );
      }
      return;
    }
    if (statusSpan) {
      statusSpan.setText(t("sectionStatus.conflictsOpen", { count: openConflicts.length }));
    }
    containerEl.createEl("p", {
      text: t("settings.syncConflictsDesc")
    });
    for (const conflict of openConflicts) {
      const pathLabel = conflict.path || conflict.id || "?";
      const createdAt = conflict.created_at ? new Date(conflict.created_at).toLocaleString() : t("status.unknown");
      const reasonLabel = conflict.reason || t("status.unknown");
      const opTypeLabel = conflict.operation_type || t("status.unknown");
      const statusLabel = conflict.status || "";
      const conflictItem = new Setting(containerEl).setName(pathLabel).setDesc(
        t("settings.conflictItemDesc", {
          createdAt,
          reason: reasonLabel,
          opType: opTypeLabel,
          status: statusLabel
        })
      );
      if (conflict.id) {
        const detailContainer = containerEl.createDiv({
          cls: "sync-conflict-detail-container"
        });
        conflictItem.addButton(
          (button) => button.setButtonText(t("button.viewConflictDetails")).onClick(async () => {
            if (detailContainer.children.length > 0) {
              detailContainer.empty();
              return;
            }
            await this.renderConflictDetail(detailContainer, conflict);
            detailContainer.scrollIntoView({ block: "nearest" });
          })
        );
      }
    }
  }
  async renderConflictDetail(containerEl, conflict) {
    const t = (key, params2 = {}) => this.plugin.t(key, params2);
    const detailDiv = containerEl.createDiv({ cls: "sync-conflict-detail" });
    detailDiv.createEl("h4", { text: t("settings.conflictDetailTitle") });
    detailDiv.createEl("p", { text: `${t("settings.conflictPath")}: ${conflict.path || "?"}` });
    detailDiv.createEl("p", {
      text: `${t("settings.conflictCreatedAt")}: ${conflict.created_at ? new Date(conflict.created_at).toLocaleString() : t("status.unknown")}`
    });
    detailDiv.createEl("p", {
      text: `${t("settings.conflictOperationType")}: ${conflict.operation_type || t("status.unknown")}`
    });
    if (conflict.target_path) {
      detailDiv.createEl("p", {
        text: `${t("settings.conflictTargetPath")}: ${conflict.target_path}`
      });
    }
    detailDiv.createEl("p", {
      text: `${t("settings.conflictReason")}: ${conflict.reason || t("status.unknown")}`
    });
    if (conflict.expected_content_hash) {
      detailDiv.createEl("p", {
        text: `${t("settings.conflictExpectedHash")}: ${conflict.expected_content_hash}`
      });
    }
    if (conflict.actual_content_hash) {
      detailDiv.createEl("p", {
        text: `${t("settings.conflictActualHash")}: ${conflict.actual_content_hash}`
      });
    }
    detailDiv.createEl("p", {
      text: `${t("settings.conflictStatus")}: ${conflict.status || t("status.unknown")}`
    });
    if (conflict.device_id) {
      detailDiv.createEl("p", {
        text: `${t("settings.conflictDeviceId")}: ${conflict.device_id}`
      });
    }
    this.renderResolutionActions(detailDiv, conflict);
  }
  renderResolutionActions(containerEl, conflict) {
    if (!conflict || conflict.status !== "open") {
      return;
    }
    const t = (key, params2 = {}) => this.plugin.t(key, params2);
    const actionsDiv = containerEl.createDiv({ cls: "sync-conflict-actions" });
    actionsDiv.createEl("h4", { text: "Resolve" });
    if (this.plugin.isMoveTargetOccupiedConflict(conflict)) {
      new Setting(actionsDiv).setName(t("button.resolveKeepLocal")).setDesc(t("resolution.keepLocalDesc")).addButton(
        (button) => button.setButtonText(t("button.resolveKeepLocal")).onClick(async () => {
          await this.executeResolution(
            () => this.plugin.resolveKeepLocal(conflict),
            conflict
          );
        })
      );
      return;
    }
    if (!this.plugin.isConflictResolutionSupported(conflict)) {
      actionsDiv.createEl("p", {
        text: t("settings.conflictResolutionUnsupported", {
          entryType: conflict.entry_type || "unknown",
          operationType: conflict.operation_type || "unknown"
        })
      });
      return;
    }
    const keepLocalDescKey = this.plugin.isDeleteHashMismatchConflict(conflict) ? "resolution.keepLocalDeleteHashMismatchDesc" : "resolution.keepLocalDesc";
    new Setting(actionsDiv).setName(t("button.resolveKeepLocal")).setDesc(t(keepLocalDescKey)).addButton(
      (button) => button.setButtonText(t("button.resolveKeepLocal")).onClick(async () => {
        await this.executeResolution(
          () => this.plugin.resolveKeepLocal(conflict),
          conflict
        );
      })
    );
    new Setting(actionsDiv).setName(t("button.resolveAcceptRemote")).setDesc(t("resolution.acceptRemoteDesc")).addButton(
      (button) => button.setButtonText(t("button.resolveAcceptRemote")).onClick(async () => {
        await this.executeResolution(
          () => this.plugin.resolveAcceptRemote(conflict),
          conflict
        );
      })
    );
    new Setting(actionsDiv).setName(t("button.resolveKeepBoth")).setDesc(t("resolution.keepBothDesc")).addButton(
      (button) => button.setButtonText(t("button.resolveKeepBoth")).onClick(async () => {
        await this.executeResolution(
          () => this.plugin.resolveKeepBoth(conflict),
          conflict
        );
      })
    );
    new Setting(actionsDiv).setName(t("button.materializeRemote")).setDesc(t("resolution.materializeDesc")).addButton(
      (button) => button.setButtonText(t("button.materializeRemote")).onClick(async () => {
        try {
          const materializedPath = await this.plugin.materializeRemoteVersion(conflict);
          new Notice(
            t("notice.remoteMaterialized", { path: materializedPath })
          );
        } catch (error) {
          new Notice(
            t("notice.remoteMaterializeFailed", { message: error.message })
          );
        }
      })
    );
  }
  async executeResolution(resolveFn, conflict) {
    const t = (key, params2 = {}) => this.plugin.t(key, params2);
    try {
      await resolveFn();
      new Notice(t("notice.conflictResolved"));
      await this.display();
    } catch (error) {
      console.error(
        "[obsidian-http-sync] Resolution failed for",
        conflict.path,
        error
      );
      new Notice(
        t("notice.conflictResolveFailed", {
          message: error.message || String(error)
        })
      );
    }
  }
};
function detectPlatform() {
  if (Platform && Platform.isAndroidApp) {
    return "android";
  }
  if (Platform && Platform.isIosApp) {
    return "ios";
  }
  if (Platform && Platform.isMacOS) {
    return "macos";
  }
  if (Platform && Platform.isWin) {
    return "windows";
  }
  if (Platform && Platform.isLinux) {
    return "linux";
  }
  if (Platform && Platform.isMobileApp) {
    return "mobile";
  }
  if (Platform && Platform.isDesktopApp) {
    return "desktop";
  }
  return "obsidian";
}
function generateDeviceInstanceId() {
  return Math.random().toString(36).slice(2, 10);
}
function normalizeDeviceNameForInstance(deviceName, deviceInstanceId) {
  const normalizedName = String(deviceName || "").trim();
  const baseName = normalizedName || DEFAULT_SETTINGS.deviceName;
  if (String(baseName).includes(String(deviceInstanceId || ""))) {
    return baseName;
  }
  if (isLegacyDefaultDeviceName(baseName)) {
    return `${DEFAULT_SETTINGS.deviceName} ${deviceInstanceId}`;
  }
  return baseName;
}
function isLegacyDefaultDeviceName(deviceName) {
  const normalizedName = String(deviceName || "").trim();
  return !normalizedName || normalizedName === DEFAULT_SETTINGS.deviceName;
}
async function hashBinary(binaryPayload) {
  if (typeof globalThis.crypto === "undefined" || !globalThis.crypto || !globalThis.crypto.subtle) {
    throw new Error("Web Crypto API \u043D\u0435\u0434\u043E\u0441\u0442\u0443\u043F\u0435\u043D");
  }
  const digest = await globalThis.crypto.subtle.digest(
    "SHA-256",
    toArrayBuffer(binaryPayload)
  );
  return `sha256:${toHex(new Uint8Array(digest))}`;
}
function toArrayBuffer(binaryPayload) {
  if (binaryPayload instanceof Uint8Array) {
    return binaryPayload.buffer.slice(
      binaryPayload.byteOffset,
      binaryPayload.byteOffset + binaryPayload.byteLength
    );
  }
  if (binaryPayload instanceof ArrayBuffer) {
    return binaryPayload;
  }
  throw new Error("\u041D\u0435\u043F\u043E\u0434\u0434\u0435\u0440\u0436\u0438\u0432\u0430\u0435\u043C\u044B\u0439 \u0442\u0438\u043F \u0431\u0438\u043D\u0430\u0440\u043D\u044B\u0445 \u0434\u0430\u043D\u043D\u044B\u0445");
}
function toHex(byteArray) {
  return Array.from(byteArray, (byte) => byte.toString(16).padStart(2, "0")).join("");
}
function comparePluginVersions(leftVersion, rightVersion) {
  const leftParts = parsePluginVersionParts(leftVersion);
  const rightParts = parsePluginVersionParts(rightVersion);
  const maxLength = Math.max(leftParts.length, rightParts.length, 3);
  for (let index = 0; index < maxLength; index += 1) {
    const left = leftParts[index] || 0;
    const right = rightParts[index] || 0;
    if (left > right) {
      return 1;
    }
    if (left < right) {
      return -1;
    }
  }
  return 0;
}
function parsePluginVersionParts(version) {
  return String(version || "").split(/[.+-]/).map((part) => Number.parseInt(part, 10)).map((part) => Number.isFinite(part) ? part : 0);
}
function comparePluginBuildIds(leftBuildId, rightBuildId) {
  const left = normalizePluginBuildId(leftBuildId);
  const right = normalizePluginBuildId(rightBuildId);
  if (!left && !right) {
    return 0;
  }
  if (left && !right) {
    return 1;
  }
  if (!left && right) {
    return -1;
  }
  return left.localeCompare(right);
}
function normalizePluginBuildId(buildId) {
  return String(buildId || "").trim();
}
async function readPluginZipFiles(archivePayload, wantedFileNames) {
  const archiveBytes = new Uint8Array(toArrayBuffer(archivePayload));
  const wanted = new Set((wantedFileNames || []).map((name) => String(name || "")));
  const entries = /* @__PURE__ */ new Map();
  const view = new DataView(toArrayBuffer(archiveBytes));
  const endOffset = findZipEndOfCentralDirectory(view);
  if (endOffset < 0) {
    throw new Error("Plugin archive is not a valid ZIP file");
  }
  const entryCount = view.getUint16(endOffset + 10, true);
  const centralDirectoryOffset = view.getUint32(endOffset + 16, true);
  let cursor = centralDirectoryOffset;
  for (let index = 0; index < entryCount; index += 1) {
    if (view.getUint32(cursor, true) !== 33639248) {
      throw new Error("Plugin archive central directory is invalid");
    }
    const compressionMethod = view.getUint16(cursor + 10, true);
    const compressedSize = view.getUint32(cursor + 20, true);
    const uncompressedSize = view.getUint32(cursor + 24, true);
    const fileNameLength = view.getUint16(cursor + 28, true);
    const extraLength = view.getUint16(cursor + 30, true);
    const commentLength = view.getUint16(cursor + 32, true);
    const localHeaderOffset = view.getUint32(cursor + 42, true);
    const fileNameStart = cursor + 46;
    const fileName = decodeUtf82(
      archiveBytes.slice(fileNameStart, fileNameStart + fileNameLength)
    );
    const normalizedFileName = normalizePluginArchiveFileName(fileName);
    if (wanted.has(normalizedFileName)) {
      const payload = await extractZipFilePayload(
        archiveBytes,
        view,
        localHeaderOffset,
        compressionMethod,
        compressedSize,
        uncompressedSize
      );
      entries.set(normalizedFileName, payload);
      if (entries.size === wanted.size) {
        break;
      }
    }
    cursor += 46 + fileNameLength + extraLength + commentLength;
  }
  return entries;
}
function normalizePluginArchiveFileName(fileName) {
  const normalized = String(fileName || "").replace(/\\/g, "/").replace(/^\/+/, "");
  for (const pluginId of [PLUGIN_ID, ...LEGACY_PLUGIN_IDS]) {
    const pluginPrefix = `${pluginId}/`;
    if (normalized.startsWith(pluginPrefix)) {
      return normalized.slice(pluginPrefix.length);
    }
  }
  return normalized;
}
function pluginArchiveSupportsSelfUpdate(mainPayload) {
  try {
    const mainSource = decodeUtf82(mainPayload);
    return mainSource.includes("PLUGIN_UPDATE_LATEST_ARCHIVE_PATH") || mainSource.includes("obsidian-http-sync-latest.zip");
  } catch (error) {
    return false;
  }
}
function extractPluginBuildId(mainPayload) {
  try {
    const mainSource = decodeUtf82(mainPayload);
    const match2 = mainSource.match(
      /\bPLUGIN_BUILD_ID\b\s*=\s*["']([^"']+)["']/
    );
    return match2 ? normalizePluginBuildId(match2[1]) : "";
  } catch (error) {
    return "";
  }
}
function findZipEndOfCentralDirectory(view) {
  const minimumLength = 22;
  const maximumCommentLength = 65535;
  const startOffset = Math.max(0, view.byteLength - minimumLength - maximumCommentLength);
  for (let offset = view.byteLength - minimumLength; offset >= startOffset; offset -= 1) {
    if (view.getUint32(offset, true) === 101010256) {
      return offset;
    }
  }
  return -1;
}
async function extractZipFilePayload(archiveBytes, view, localHeaderOffset, compressionMethod, compressedSize, uncompressedSize) {
  if (view.getUint32(localHeaderOffset, true) !== 67324752) {
    throw new Error("Plugin archive local file header is invalid");
  }
  const localFileNameLength = view.getUint16(localHeaderOffset + 26, true);
  const localExtraLength = view.getUint16(localHeaderOffset + 28, true);
  const dataStart = localHeaderOffset + 30 + localFileNameLength + localExtraLength;
  const compressedPayload = archiveBytes.slice(dataStart, dataStart + compressedSize);
  let payload;
  if (compressionMethod === 0) {
    payload = compressedPayload;
  } else if (compressionMethod === 8) {
    payload = await inflateRawDeflate(compressedPayload);
  } else {
    throw new Error(`Unsupported plugin archive compression method: ${compressionMethod}`);
  }
  if (Number(uncompressedSize) > 0 && payload.byteLength !== Number(uncompressedSize)) {
    throw new Error("Plugin archive file size mismatch");
  }
  return payload;
}
async function inflateRawDeflate(compressedPayload) {
  if (typeof DecompressionStream === "undefined" || typeof Blob === "undefined" || typeof Response === "undefined") {
    throw new Error("DecompressionStream is not available");
  }
  const stream = new Blob([toArrayBuffer(compressedPayload)]).stream().pipeThrough(new DecompressionStream("deflate-raw"));
  return new Uint8Array(await new Response(stream).arrayBuffer());
}
function isAlreadyExistsError(error) {
  const message = String(error && error.message ? error.message : error).toLowerCase();
  return message.includes("already exists");
}
function isRecordOperationConflictError(error, payload) {
  const statusCode = Number(error && error.statusCode);
  if (statusCode !== 409) {
    return false;
  }
  const operationType = String(payload && payload.operation_type ? payload.operation_type : "");
  if (operationType === "mkdir") {
    return false;
  }
  const payloadError = error && error.payload && error.payload.error ? String(error.payload.error).toLowerCase() : "";
  if (payloadError) {
    return payloadError === "conflict_detected";
  }
  return ["upsert", "delete", "move"].includes(operationType);
}
function isRecordOperationNoteLockError(error) {
  const statusCode = Number(error && error.statusCode);
  if (statusCode !== 409) {
    return false;
  }
  const payloadError = error && error.payload && error.payload.error ? String(error.payload.error).toLowerCase() : "";
  return payloadError === "note_edit_locked";
}
function extractOperationNoteLock(error) {
  const payload = error && error.payload && typeof error.payload === "object" ? error.payload : {};
  const lock = payload.lock && typeof payload.lock === "object" ? payload.lock : {};
  const lease = lock.lease && typeof lock.lease === "object" ? lock.lease : {};
  return {
    path: normalizePath(String(payload.path || lease.path || "")),
    readonlyReason: String(payload.readonly_reason || lock.readonly_reason || "held_by_other_device"),
    lock
  };
}
function extractOperationConflict(error) {
  const conflict = error && error.payload ? error.payload.conflict : null;
  return conflict && typeof conflict === "object" ? conflict : {};
}
function isAlreadyAppliedOperationConflictCandidate(payload, conflict) {
  if (!payload || !conflict || typeof conflict !== "object") {
    return false;
  }
  const operationType = String(payload.operation_type || "");
  if (!["upsert", "delete"].includes(operationType)) {
    return false;
  }
  const conflictOperationType = String(conflict.operation_type || operationType);
  if (conflictOperationType !== operationType) {
    return false;
  }
  const entryType = String(payload.entry_type || conflict.entry_type || "");
  const conflictEntryType = String(conflict.entry_type || entryType);
  if (entryType !== "file" || conflictEntryType !== "file") {
    return false;
  }
  if (String(conflict.reason || "") !== "base_content_hash_mismatch") {
    return false;
  }
  const payloadPath = normalizePath(String(payload.path || ""));
  const conflictPath = normalizePath(String(conflict.path || payload.path || ""));
  if (payloadPath && conflictPath && payloadPath !== conflictPath) {
    return false;
  }
  if (operationType === "upsert") {
    const desiredHash = normalizeContentHashForCompare(payload.content_hash);
    const actualHash = normalizeContentHashForCompare(conflict.actual_content_hash);
    return Boolean(desiredHash && actualHash && desiredHash === actualHash);
  }
  return !normalizeContentHashForCompare(conflict.actual_content_hash);
}
function isAlreadyMissingDirectoryError(error) {
  const message = String(error && error.message ? error.message : error).toLowerCase();
  const payloadError = error && error.payload && error.payload.error ? String(error.payload.error).toLowerCase() : "";
  return Number(error && error.statusCode) === 400 && payloadError === "validation_error" && message.includes("rmdir requires an existing active directory");
}
function isMissingRemoteObjectContentError(error) {
  return Number(error && error.statusCode) === 404;
}
function annotateError(error, context) {
  const message = String(error && error.message ? error.message : error);
  const annotated = new Error(`${context}: ${message}`);
  if (error && typeof error === "object") {
    annotated.statusCode = error.statusCode;
    annotated.payload = error.payload;
    annotated.stack = error.stack || annotated.stack;
  }
  return annotated;
}
function classifyAuthError(error, hasAccessToken, hasRefreshToken) {
  if (!error || typeof error !== "object") {
    return {
      authStatus: AUTH_STATUS.ERROR,
      syncBlockReason: SYNC_BLOCK_REASON.SERVER_ERROR
    };
  }
  const statusCode = Number(error.statusCode) || 0;
  const message = String(error.message || "").toLowerCase();
  const payload = error.payload && typeof error.payload === "object" ? error.payload : {};
  const payloadError = String(payload.error || "").toLowerCase();
  const payloadCode = String(payload.code || "").toLowerCase();
  if (!hasAccessToken && !hasRefreshToken) {
    return {
      authStatus: AUTH_STATUS.MISSING_TOKEN,
      syncBlockReason: SYNC_BLOCK_REASON.MISSING_TOKEN
    };
  }
  if (!hasAccessToken && hasRefreshToken) {
    return {
      authStatus: AUTH_STATUS.REFRESH_FAILED,
      syncBlockReason: SYNC_BLOCK_REASON.REFRESH_FAILED
    };
  }
  if (statusCode === 401) {
    if (payloadError === "auth_session_revoked" || payloadCode === "auth_session_revoked" || message.includes("session revoked") || message.includes("auth_session_revoked")) {
      return {
        authStatus: AUTH_STATUS.SESSION_REVOKED,
        syncBlockReason: SYNC_BLOCK_REASON.SESSION_REVOKED
      };
    }
    if (payloadError === "auth_session_expired" || payloadCode === "auth_session_expired" || message.includes("session expired") || message.includes("auth_session_expired")) {
      return {
        authStatus: AUTH_STATUS.SESSION_EXPIRED,
        syncBlockReason: SYNC_BLOCK_REASON.SESSION_EXPIRED
      };
    }
    return {
      authStatus: AUTH_STATUS.SESSION_EXPIRED,
      syncBlockReason: SYNC_BLOCK_REASON.SESSION_EXPIRED
    };
  }
  if (statusCode === 402 || statusCode === 403) {
    const billingIndicators = [
      "billing",
      "payment",
      "past_due",
      "suspended",
      "grace",
      "quota",
      "account_status",
      "billing_blocked"
    ];
    const collaborationIndicators = [
      "collaboration_blocked",
      "collaboration_not_in_plan",
      "member_limit_exceeded"
    ];
    const matchesBilling = billingIndicators.some(
      (indicator) => message.includes(indicator) || payloadError.includes(indicator) || payloadCode.includes(indicator)
    );
    const matchesCollaboration = collaborationIndicators.some(
      (indicator) => message.includes(indicator) || payloadError.includes(indicator) || payloadCode.includes(indicator)
    );
    if (matchesBilling || matchesCollaboration) {
      return {
        authStatus: AUTH_STATUS.BILLING_BLOCKED,
        syncBlockReason: SYNC_BLOCK_REASON.BILLING_BLOCKED
      };
    }
  }
  if (isNetworkError(error)) {
    return {
      authStatus: AUTH_STATUS.ERROR,
      syncBlockReason: SYNC_BLOCK_REASON.NETWORK_ERROR
    };
  }
  return {
    authStatus: AUTH_STATUS.ERROR,
    syncBlockReason: SYNC_BLOCK_REASON.SERVER_ERROR
  };
}
function getCollaborationBlockReasonFromAccountStatus(accountStatus) {
  const reasons = accountStatus && Array.isArray(accountStatus.collaboration_block_reasons) ? accountStatus.collaboration_block_reasons : [];
  const knownReasons = new Set(Object.values(COLLABORATION_BLOCK_REASON));
  const reason = reasons.find(
    (item) => knownReasons.has(String(item)) && item !== COLLABORATION_BLOCK_REASON.NONE
  );
  if (reason) {
    return String(reason);
  }
  if (accountStatus && accountStatus.billing_blocked_collaboration === true) {
    return COLLABORATION_BLOCK_REASON.BILLING_BLOCKED;
  }
  return COLLABORATION_BLOCK_REASON.NOT_IN_PLAN;
}
function isNetworkError(error) {
  if (!error || typeof error !== "object") {
    return false;
  }
  const message = String(error.message || "").toLowerCase();
  const networkIndicators = [
    "fetch",
    "network",
    "timeout",
    "abort",
    "econnrefused",
    "enotfound",
    "econnreset",
    "dns",
    "socket",
    "offline"
  ];
  return networkIndicators.some((indicator) => message.includes(indicator)) || (Number(error.statusCode) || 0) === 0;
}
function classifyAndUpdateAuthState(plugin, error) {
  const existingStatus = (plugin.settings.authState || {}).status || AUTH_STATUS.UNKNOWN;
  const errorStatusCode = Number(error && error.statusCode) || 0;
  const hasAccessToken = Boolean(plugin.settings.accessToken);
  const hasRefreshToken = Boolean(plugin.settings.refreshToken);
  const classified = classifyAuthError(error, hasAccessToken, hasRefreshToken);
  if (existingStatus === AUTH_STATUS.MISSING_TOKEN || existingStatus === AUTH_STATUS.REFRESH_FAILED || existingStatus === AUTH_STATUS.SESSION_EXPIRED || existingStatus === AUTH_STATUS.SESSION_REVOKED || existingStatus === AUTH_STATUS.BILLING_BLOCKED) {
    plugin.settings.authState.lastChecked = (/* @__PURE__ */ new Date()).toISOString();
    return {
      authStatus: existingStatus,
      syncBlockReason: plugin.settings.syncBlockReason || SYNC_BLOCK_REASON.NONE
    };
  }
  if (existingStatus === AUTH_STATUS.AUTHENTICATED && errorStatusCode !== 401 && errorStatusCode !== 403 && classified.authStatus !== AUTH_STATUS.SESSION_EXPIRED && classified.authStatus !== AUTH_STATUS.SESSION_REVOKED && classified.authStatus !== AUTH_STATUS.BILLING_BLOCKED && classified.authStatus !== AUTH_STATUS.MISSING_TOKEN) {
    plugin.settings.authState.lastChecked = (/* @__PURE__ */ new Date()).toISOString();
    return {
      authStatus: existingStatus,
      syncBlockReason: plugin.settings.syncBlockReason || SYNC_BLOCK_REASON.NONE
    };
  }
  plugin.settings.authState = {
    status: classified.authStatus,
    reason: classified.syncBlockReason,
    lastChecked: (/* @__PURE__ */ new Date()).toISOString()
  };
  plugin.settings.syncBlockReason = classified.syncBlockReason;
  return classified;
}
function buildAuthFailureNotice(plugin, error) {
  const language = plugin.settings.language;
  const hasAccessToken = Boolean(plugin.settings.accessToken);
  const hasRefreshToken = Boolean(plugin.settings.refreshToken);
  const classified = classifyAuthError(error, hasAccessToken, hasRefreshToken);
  if (!isAuthFailureNoticeStatus(classified.authStatus)) {
    return null;
  }
  const noticeKey = `auth.status.${classified.authStatus}`;
  const noticeMessage = translate(language, noticeKey);
  if (noticeMessage === noticeKey) {
    return null;
  }
  const reasonKey = `syncBlock.reason.${classified.syncBlockReason}`;
  const reasonMessage = translate(language, reasonKey);
  if (reasonMessage !== reasonKey) {
    return `${noticeMessage}: ${reasonMessage}`;
  }
  return noticeMessage;
}
function isAuthFailureNoticeStatus(authStatus) {
  return authStatus === AUTH_STATUS.MISSING_TOKEN || authStatus === AUTH_STATUS.REFRESH_FAILED || authStatus === AUTH_STATUS.SESSION_EXPIRED || authStatus === AUTH_STATUS.SESSION_REVOKED || authStatus === AUTH_STATUS.BILLING_BLOCKED;
}
function buildSyncBlockedBillingMessage(plugin, payload) {
  const language = plugin && plugin.settings ? plugin.settings.language : "en";
  const effectiveStatus = String(
    payload && (payload.effective_billing_status || payload.billing_status || "")
  ).toLowerCase();
  const reasonKey = `error.syncBlockedBilling.${effectiveStatus || "generic"}`;
  const translatedReason = translate(language, reasonKey);
  if (translatedReason !== reasonKey) {
    return translatedReason;
  }
  if (payload && payload.user_message) {
    return String(payload.user_message);
  }
  if (payload && payload.message) {
    return String(payload.message);
  }
  return translate(language, "error.syncBlockedBilling.generic");
}
function formatErrorWithContext(language, stage, error) {
  const message = String(error && error.message ? error.message : error);
  if (!stage) {
    return message;
  }
  const stageKey = `stage.${stage}`;
  const stageLabel = translate(language, stageKey);
  return `${stageLabel === stageKey ? stage : stageLabel}: ${message}`;
}
function hasRequiredConfig(value) {
  return Boolean(
    value && value.baseUrl && (value.userEmail || value.userId) && value.vaultId && value.deviceId && (value.accessToken || value.refreshToken)
  );
}
function mergeIgnorePaths(paths) {
  const rawPaths = Array.isArray(paths) ? paths : [];
  const merged = [];
  for (const path of DEFAULT_IGNORE_PATHS.concat(rawPaths)) {
    const normalizedPath = normalizeIgnorePath(path);
    if (normalizedPath && !merged.includes(normalizedPath)) {
      merged.push(normalizedPath);
    }
  }
  return merged.length > 0 ? merged : DEFAULT_IGNORE_PATHS.slice();
}
function normalizeIgnorePath(path) {
  return String(path || "").trim().replace(/\\/g, "/").replace(/^\.?\//, "").replace(/^\/+/, "");
}
function normalizePluginPath(path) {
  return String(path || "").replace(/\\/g, "/").replace(/^\.?\//, "").replace(/^\/+/, "").replace(/\/+$/, "").trim();
}
function isRootObsidianConfigPath(path) {
  const normalizedPath = normalizePluginPath(path);
  return normalizedPath === OBSIDIAN_CONFIG_DIR || normalizedPath.startsWith(`${OBSIDIAN_CONFIG_DIR}/`);
}
function isNestedObsidianConfigPath(path) {
  const segments = normalizePluginPath(path).split("/");
  return segments.slice(1).includes(OBSIDIAN_CONFIG_DIR);
}
function isAlwaysLocalObsidianConfigPath(path) {
  const normalizedPath = normalizePluginPath(path);
  return OBSIDIAN_CONFIG_ALWAYS_LOCAL_PATHS.some(
    (localPath) => normalizedPath === localPath || normalizedPath.startsWith(`${localPath}/`)
  );
}
function shouldIncludeVaultSnapshotPath(path, includeObsidianConfig = false) {
  const normalizedPath = normalizePluginPath(path);
  if (!normalizedPath) {
    return false;
  }
  const segments = normalizedPath.split("/");
  if (segments.includes(".trash") || segments.some((segment) => segment.includes(".sync-conflict-"))) {
    return false;
  }
  const obsidianSegmentIndex = segments.indexOf(OBSIDIAN_CONFIG_DIR);
  if (obsidianSegmentIndex < 0) {
    return true;
  }
  return includeObsidianConfig === true && obsidianSegmentIndex === 0 && !isAlwaysLocalObsidianConfigPath(normalizedPath);
}
function filterPathKeyedMap(value, predicate) {
  return Object.fromEntries(
    Object.entries(value && typeof value === "object" ? value : {}).filter(
      ([path]) => predicate(normalizePluginPath(path))
    )
  );
}
function remoteOperationToSnapshotEntry(operation) {
  const operationType = String(operation && operation.operation_type ? operation.operation_type : "");
  const entryType = String(operation && operation.entry_type ? operation.entry_type : "");
  if (operationType === "mkdir" || entryType === "directory") {
    return {
      entryType: "directory",
      contentHash: null,
      sizeBytes: 0,
      mtimeMs: null
    };
  }
  if (operationType !== "upsert") {
    return null;
  }
  const contentHash = operation.content_hash !== null && operation.content_hash !== void 0 ? String(operation.content_hash) : "";
  if (!contentHash) {
    return null;
  }
  return {
    entryType: "file",
    contentHash,
    sizeBytes: Number(operation.resulting_entry_size_bytes || 0),
    mtimeMs: null
  };
}
function normalizeContentHashForCompare(contentHash) {
  const value = String(contentHash || "").trim().toLowerCase();
  return value.startsWith("sha256:") ? value.slice("sha256:".length) : value;
}
async function computeVaultSnapshotFingerprint(entries, options = {}) {
  const includeObsidianConfig = options.includeObsidianConfig === true;
  const normalizedEntries = Object.entries(entries || {}).map(([path, entry]) => {
    const entryType = String(entry && entry.entryType ? entry.entryType : "").trim().toLowerCase();
    const contentHash = entryType === "file" && entry && entry.contentHash ? normalizeContentHashForCompare(entry.contentHash) : "";
    return [
      normalizePluginPath(path),
      entryType,
      contentHash
    ];
  }).filter(
    ([path, entryType]) => Boolean(path) && Boolean(entryType) && shouldIncludeVaultSnapshotPath(path, includeObsidianConfig)
  ).sort((left, right) => {
    if (left[0] < right[0]) {
      return -1;
    }
    if (left[0] > right[0]) {
      return 1;
    }
    return 0;
  });
  const payload = normalizedEntries.map(([path, entryType, contentHash]) => {
    const marker = entryType === "file" ? contentHash : "directory";
    return `${path}\0${entryType}\0${marker}
`;
  }).join("");
  const input = new TextEncoder().encode(payload);
  const subtle2 = globalThis.crypto && globalThis.crypto.subtle ? globalThis.crypto.subtle : null;
  if (subtle2 && typeof subtle2.digest === "function") {
    try {
      const digest = await subtle2.digest("SHA-256", input);
      return `sha256:${Array.from(
        new Uint8Array(digest),
        (byte) => byte.toString(16).padStart(2, "0")
      ).join("")}`;
    } catch (_error) {
      return "";
    }
  }
  return "";
}
async function computeCrdtHeadsFingerprint(crdtFiles, stateEntries) {
  const heads = Object.entries(crdtFiles || {}).map(([path, state]) => [
    normalizePluginPath(path),
    Math.max(0, Number(state && state.sequenceNumber) || 0)
  ]).filter(
    ([path, sequenceNumber]) => Boolean(path) && sequenceNumber > 0 && Boolean(stateEntries && stateEntries[path]) && !path.split("/").some(
      (segment) => segment === ".obsidian" || segment === ".trash" || segment.includes(".sync-conflict-")
    )
  ).sort((left, right) => left[0].localeCompare(right[0]));
  const payload = heads.map(([path, sequenceNumber]) => `${path}\0${sequenceNumber}
`).join("");
  const input = new TextEncoder().encode(payload);
  const subtle2 = globalThis.crypto && globalThis.crypto.subtle ? globalThis.crypto.subtle : null;
  if (subtle2 && typeof subtle2.digest === "function") {
    try {
      const digest = await subtle2.digest("SHA-256", input);
      return `sha256:${Array.from(
        new Uint8Array(digest),
        (byte) => byte.toString(16).padStart(2, "0")
      ).join("")}`;
    } catch (_error) {
      return "";
    }
  }
  return "";
}
function hasIgnoredPathSegment(path, ignoredSegments) {
  const normalizedPath = normalizePluginPath(path);
  if (!normalizedPath) {
    return false;
  }
  const ignoredSegmentSet = new Set(
    (Array.isArray(ignoredSegments) ? ignoredSegments : []).map((segment) => normalizePluginPath(segment)).filter(Boolean)
  );
  return normalizedPath.split("/").some((segment) => ignoredSegmentSet.has(segment));
}
function normalizeSyncFolderPathList(paths) {
  const rawPaths = Array.isArray(paths) ? paths : [""];
  const normalized = [];
  for (const path of rawPaths) {
    const normalizedPath = normalizePluginPath(path);
    if (!normalizedPath) {
      continue;
    }
    if (!normalized.includes(normalizedPath)) {
      normalized.push(normalizedPath);
    }
  }
  if (normalized.length === 0) {
    return [""];
  }
  const sorted = normalized.sort((left, right) => {
    const leftDepth = left.split("/").filter(Boolean).length;
    const rightDepth = right.split("/").filter(Boolean).length;
    if (leftDepth !== rightDepth) {
      return leftDepth - rightDepth;
    }
    return left.localeCompare(right);
  });
  const collapsed = [];
  for (const path of sorted) {
    if (collapsed.some(
      (existingPath) => path === existingPath || path.startsWith(`${existingPath}/`)
    )) {
      continue;
    }
    collapsed.push(path);
  }
  return collapsed;
}
function normalizePendingDeletes(pendingDeletes) {
  const normalized = {};
  const entries = pendingDeletes && typeof pendingDeletes === "object" ? Object.entries(pendingDeletes) : [];
  for (const [path, item] of entries) {
    const normalizedPath = normalizePluginPath(path);
    if (!normalizedPath || !item || typeof item !== "object") {
      continue;
    }
    const entryType = String(item.entryType || item.entry_type || "").trim().toLowerCase();
    if (entryType !== "file" && entryType !== "directory") {
      continue;
    }
    normalized[normalizedPath] = {
      entryType,
      contentHash: item.contentHash !== null && item.contentHash !== void 0 ? String(item.contentHash) : null,
      sizeBytes: Number(item.sizeBytes || item.size_bytes || 0),
      firstSeenAt: Number(item.firstSeenAt || item.first_seen_at || Date.now()),
      lastSeenAt: Number(item.lastSeenAt || item.last_seen_at || Date.now())
    };
  }
  return normalized;
}
function normalizeOperationSource(source) {
  const normalized = String(source || "").trim().toLowerCase().replace(/-/g, "_");
  if (!normalized) {
    return "sync_diff";
  }
  if ([
    "sync_diff",
    "conflict_resolution",
    "publish_source",
    "merge_divergence",
    "manual"
  ].includes(normalized)) {
    return normalized;
  }
  return "manual";
}
function formatSyncFolderPaths(paths) {
  const normalized = normalizeSyncFolderPathList(paths);
  if (normalized.includes("")) {
    return "";
  }
  return normalized.join("\n");
}
function applyTextDiff(yText, previousText, nextText) {
  if (previousText === nextText) {
    return;
  }
  let prefixLength = 0;
  const maxPrefixLength = Math.min(previousText.length, nextText.length);
  while (prefixLength < maxPrefixLength && previousText.charCodeAt(prefixLength) === nextText.charCodeAt(prefixLength)) {
    prefixLength += 1;
  }
  let previousEnd = previousText.length;
  let nextEnd = nextText.length;
  while (previousEnd > prefixLength && nextEnd > prefixLength && previousText.charCodeAt(previousEnd - 1) === nextText.charCodeAt(nextEnd - 1)) {
    previousEnd -= 1;
    nextEnd -= 1;
  }
  if (previousEnd > prefixLength) {
    yText.delete(prefixLength, previousEnd - prefixLength);
  }
  if (nextEnd > prefixLength) {
    yText.insert(prefixLength, nextText.slice(prefixLength, nextEnd));
  }
}
function uint8ArrayToBase64(bytes) {
  const normalizedBytes = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  let binary = "";
  const chunkSize = 32768;
  for (let offset = 0; offset < normalizedBytes.length; offset += chunkSize) {
    const chunk = normalizedBytes.subarray(offset, offset + chunkSize);
    binary += String.fromCharCode(...chunk);
  }
  return btoa(binary);
}
function base64ToUint8Array(payload) {
  const binary = atob(String(payload || ""));
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }
  return bytes;
}
function utf8ToBase64(text2) {
  return uint8ArrayToBase64(new TextEncoder().encode(String(text2 || "")));
}
function base64ToUtf8(payload) {
  return new TextDecoder().decode(base64ToUint8Array(payload));
}
function buildVaultDivergenceLocalDetail(entry) {
  return {
    entryType: String(entry && entry.entryType ? entry.entryType : ""),
    sizeBytes: Number(entry && entry.sizeBytes ? entry.sizeBytes : 0),
    contentHash: entry && entry.contentHash ? String(entry.contentHash) : "",
    modifiedAt: isoFromMtimeMs(entry && entry.mtimeMs)
  };
}
function buildVaultDivergenceServerDetail(snapshotEntry, remoteEntry) {
  return {
    entryType: String(snapshotEntry && snapshotEntry.entryType ? snapshotEntry.entryType : ""),
    sizeBytes: Number(snapshotEntry && snapshotEntry.sizeBytes ? snapshotEntry.sizeBytes : 0),
    contentHash: snapshotEntry && snapshotEntry.contentHash ? String(snapshotEntry.contentHash) : "",
    modifiedAt: String(
      remoteEntry && (remoteEntry.updated_at || remoteEntry.created_at) || ""
    )
  };
}
function isoFromMtimeMs(mtimeMs) {
  const timestamp = Number(mtimeMs);
  if (!Number.isFinite(timestamp)) {
    return "";
  }
  const date = new Date(timestamp);
  return Number.isNaN(date.getTime()) ? "" : date.toISOString();
}
function formatVaultDivergenceTimestamp(value, fallback) {
  const rawValue = String(value || "").trim();
  if (!rawValue) {
    return fallback;
  }
  const date = new Date(rawValue);
  if (Number.isNaN(date.getTime())) {
    return rawValue;
  }
  return date.toLocaleString();
}
function formatVaultDivergenceSize(sizeBytes) {
  const size2 = Number(sizeBytes || 0);
  if (!Number.isFinite(size2)) {
    return "0 B";
  }
  return `${Math.max(0, Math.round(size2))} B`;
}
function shortContentHash(contentHash) {
  const value = String(contentHash || "").trim();
  if (!value) {
    return "-";
  }
  return value.length > 24 ? `${value.slice(0, 24)}...` : value;
}
function sameSyncIdentity(left, right) {
  const leftEntryType = String(left && left.entryType ? left.entryType : "").trim().toLowerCase();
  const rightEntryType = String(right && right.entryType ? right.entryType : "").trim().toLowerCase();
  if (leftEntryType !== rightEntryType) {
    return false;
  }
  if (Number(left && left.sizeBytes || 0) !== Number(right && right.sizeBytes || 0)) {
    return false;
  }
  if (leftEntryType !== "file") {
    return true;
  }
  return normalizeContentHashForCompare(left && left.contentHash) === normalizeContentHashForCompare(right && right.contentHash);
}
function shouldDeferRemoteApply(baselineEntry, currentEntry, remoteEntry) {
  if (!currentEntry || !remoteEntry) {
    return false;
  }
  if (sameSyncIdentity(currentEntry, remoteEntry)) {
    return false;
  }
  if (!baselineEntry) {
    return true;
  }
  return !sameSyncIdentity(currentEntry, baselineEntry);
}
function pathDepth(path) {
  return String(path || "").split("/").filter(Boolean).length;
}
function generateClientOperationId() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}-${Math.random().toString(16).slice(2)}`;
}
function buildConflictPath(path) {
  const normalizedPath = String(path || "").replace(/\\/g, "/").replace(/^\/+/, "");
  const lastSlashIndex = normalizedPath.lastIndexOf("/");
  const parentPath = lastSlashIndex >= 0 ? normalizedPath.slice(0, lastSlashIndex) : "";
  const baseName = lastSlashIndex >= 0 ? normalizedPath.slice(lastSlashIndex + 1) : normalizedPath;
  const suffix = `sync-conflict-${(/* @__PURE__ */ new Date()).toISOString().replace(/[:.]/g, "-")}`;
  const conflictRoot = ".sync-conflict-local";
  const conflictName = `${baseName}.${suffix}`;
  return parentPath ? `${conflictRoot}/${parentPath}/${conflictName}` : `${conflictRoot}/${conflictName}`;
}
function isConflictArtifactPath(path) {
  const normalizedPath = normalizePath(path);
  if (!normalizedPath) {
    return false;
  }
  return normalizedPath.split("/").some((segment) => segment.includes(".sync-conflict-"));
}
function isShareableFolderPath(path) {
  const normalizedPath = normalizePath(String(path || ""));
  if (!normalizedPath) {
    return false;
  }
  return !normalizedPath.split("/").some(
    (segment) => DEFAULT_IGNORE_PATH_SEGMENTS.includes(segment) || segment.includes(".sync-conflict-")
  );
}
function cloneEntries(entries) {
  return JSON.parse(JSON.stringify(entries || {}));
}
function snapshotEntryIdentity(entry) {
  const entryType = String(entry && entry.entryType ? entry.entryType : "").trim().toLowerCase();
  if (!entryType) {
    return "";
  }
  if (entryType === "file") {
    return `${entryType}\0${normalizeContentHashForCompare(entry.contentHash)}`;
  }
  return `${entryType}\0directory`;
}
function planLocalChanges(previousEntries, currentSnapshot, renameHints) {
  const consumedPrevious = /* @__PURE__ */ new Set();
  const consumedCurrent = /* @__PURE__ */ new Set();
  const moves = [];
  const fileDeletes = [];
  const directoryDeletes = [];
  const directoryCreates = [];
  const fileUpserts = [];
  const upsertBasePaths = {};
  const normalizedRenameHints = renameHints || {};
  const sortedRenameTargets = Object.keys(normalizedRenameHints).sort();
  for (const targetPath of sortedRenameTargets) {
    const sourcePath = normalizedRenameHints[targetPath];
    if (!sourcePath || sourcePath === targetPath) {
      continue;
    }
    if (consumedPrevious.has(sourcePath) || consumedCurrent.has(targetPath)) {
      continue;
    }
    const previousEntry = previousEntries[sourcePath];
    const currentEntry = currentSnapshot[targetPath];
    if (!previousEntry || !currentEntry) {
      continue;
    }
    if (previousEntry.entryType === "directory" && currentEntry.entryType === "directory") {
      moves.push({
        path: sourcePath,
        targetPath,
        entryType: "directory"
      });
      consumedPrevious.add(sourcePath);
      consumedCurrent.add(targetPath);
      const sourcePrefix = sourcePath + "/";
      const targetPrefix = targetPath + "/";
      for (const prevPath of Object.keys(previousEntries)) {
        if (prevPath.startsWith(sourcePrefix)) {
          const relative = prevPath.slice(sourcePrefix.length);
          const projectedPath = targetPrefix + relative;
          const prevEntry = previousEntries[prevPath];
          const currEntry = currentSnapshot[projectedPath];
          consumedPrevious.add(prevPath);
          if (currEntry && currEntry.entryType === prevEntry.entryType) {
            consumedCurrent.add(projectedPath);
            if (prevEntry.entryType === "file" && !sameSyncIdentity(prevEntry, currEntry)) {
              fileUpserts.push(projectedPath);
              upsertBasePaths[projectedPath] = prevPath;
            }
          }
        }
      }
      continue;
    }
    if (previousEntry.entryType !== "file" || currentEntry.entryType !== "file") {
      continue;
    }
    moves.push({
      path: sourcePath,
      targetPath,
      entryType: "file"
    });
    consumedPrevious.add(sourcePath);
    consumedCurrent.add(targetPath);
    if (!sameSyncIdentity(previousEntry, currentEntry)) {
      fileUpserts.push(targetPath);
      upsertBasePaths[targetPath] = sourcePath;
    }
  }
  const deletedFilesByIdentity = /* @__PURE__ */ new Map();
  const createdFilesByIdentity = /* @__PURE__ */ new Map();
  const allPaths = Array.from(
    /* @__PURE__ */ new Set([...Object.keys(previousEntries), ...Object.keys(currentSnapshot)])
  ).sort();
  for (const path of allPaths) {
    if (consumedPrevious.has(path) || consumedCurrent.has(path)) {
      continue;
    }
    const previousEntry = previousEntries[path];
    const currentEntry = currentSnapshot[path];
    if (previousEntry && !currentEntry && previousEntry.entryType === "file") {
      const identityKey = fileIdentityKey(previousEntry);
      if (identityKey) {
        if (!deletedFilesByIdentity.has(identityKey)) {
          deletedFilesByIdentity.set(identityKey, []);
        }
        deletedFilesByIdentity.get(identityKey).push(path);
      }
    }
    if (!previousEntry && currentEntry && currentEntry.entryType === "file") {
      const identityKey = fileIdentityKey(currentEntry);
      if (identityKey) {
        if (!createdFilesByIdentity.has(identityKey)) {
          createdFilesByIdentity.set(identityKey, []);
        }
        createdFilesByIdentity.get(identityKey).push(path);
      }
    }
  }
  for (const [identityKey, createdPaths] of createdFilesByIdentity.entries()) {
    const deletedPaths = deletedFilesByIdentity.get(identityKey) || [];
    while (createdPaths.length > 0 && deletedPaths.length > 0) {
      const targetPath = createdPaths.shift();
      const sourcePath = deletedPaths.shift();
      if (sourcePath === targetPath) {
        continue;
      }
      moves.push({
        path: sourcePath,
        targetPath,
        entryType: "file"
      });
      consumedPrevious.add(sourcePath);
      consumedCurrent.add(targetPath);
    }
  }
  for (const path of allPaths) {
    const previousEntry = previousEntries[path];
    const currentEntry = currentSnapshot[path];
    const previousConsumed = previousEntry ? consumedPrevious.has(path) : false;
    const currentConsumed = currentEntry ? consumedCurrent.has(path) : false;
    if (previousConsumed || currentConsumed) {
      continue;
    }
    if (previousEntry && currentEntry) {
      if (previousEntry.entryType !== currentEntry.entryType) {
        if (previousEntry.entryType === "file") {
          fileDeletes.push(path);
        } else {
          directoryDeletes.push(path);
        }
        if (currentEntry.entryType === "directory") {
          directoryCreates.push(path);
        } else {
          fileUpserts.push(path);
        }
        continue;
      }
      if (currentEntry.entryType === "file" && !sameSyncIdentity(previousEntry, currentEntry)) {
        fileUpserts.push(path);
      }
      continue;
    }
    if (!previousEntry && currentEntry) {
      if (currentEntry.entryType === "directory") {
        directoryCreates.push(path);
      } else {
        fileUpserts.push(path);
      }
      continue;
    }
    if (previousEntry && !currentEntry) {
      if (previousEntry.entryType === "file") {
        fileDeletes.push(path);
      } else {
        directoryDeletes.push(path);
      }
    }
  }
  return {
    moves: moves.sort((left, right) => {
      if (pathDepth(left.targetPath) !== pathDepth(right.targetPath)) {
        return pathDepth(left.targetPath) - pathDepth(right.targetPath);
      }
      return left.targetPath.localeCompare(right.targetPath);
    }),
    fileDeletes: fileDeletes.sort((left, right) => pathDepth(right) - pathDepth(left)),
    directoryDeletes: directoryDeletes.sort(
      (left, right) => pathDepth(right) - pathDepth(left)
    ),
    directoryCreates: directoryCreates.sort(
      (left, right) => pathDepth(left) - pathDepth(right)
    ),
    fileUpserts: fileUpserts.sort(),
    upsertBasePaths
  };
}
function fileIdentityKey(entry) {
  if (!entry || entry.entryType !== "file" || !entry.contentHash) {
    return null;
  }
  return `${entry.contentHash}:${Number(entry.sizeBytes || 0)}`;
}
