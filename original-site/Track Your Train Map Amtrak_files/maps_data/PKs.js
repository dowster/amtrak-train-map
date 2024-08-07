/*CJS PBDKF2 file - all variable names are changed from the original*/ var cryptoJS =
  cryptoJS ||
  (function (t, e) {
    var n = {},
      i = (n.lib = {}),
      r = function () {},
      s = (i.Base = {
        extend: function (t) {
          r.prototype = this;
          var e = new r();
          return (
            t && e.mixIn(t),
            e.hasOwnProperty("init") ||
              (e.init = function () {
                e.$super.init.apply(this, arguments);
              }),
            (e.init.prototype = e),
            (e.$super = this),
            e
          );
        },
        create: function () {
          var t = this.extend();
          return t.init.apply(t, arguments), t;
        },
        init: function () {},
        mixIn: function (t) {
          for (var e in t) t.hasOwnProperty(e) && (this[e] = t[e]);
          t.hasOwnProperty("toString") && (this.toString = t.toString);
        },
        clone: function () {
          return this.init.prototype.extend(this);
        },
      }),
      o = (i.WordArray = s.extend({
        init: function (t, n) {
          (t = this.words = t || []),
            (this.sigBytes = n != e ? n : 4 * t.length);
        },
        toString: function (t) {
          return (t || c).stringify(this);
        },
        concat: function (t) {
          var e = this.words,
            n = t.words,
            i = this.sigBytes;
          if (((t = t.sigBytes), this.clamp(), i % 4))
            for (var r = 0; t > r; r++)
              e[(i + r) >>> 2] |=
                ((n[r >>> 2] >>> (24 - 8 * (r % 4))) & 255) <<
                (24 - 8 * ((i + r) % 4));
          else if (65535 < n.length)
            for (r = 0; t > r; r += 4) e[(i + r) >>> 2] = n[r >>> 2];
          else e.push.apply(e, n);
          return (this.sigBytes += t), this;
        },
        clamp: function () {
          var e = this.words,
            n = this.sigBytes;
          (e[n >>> 2] &= 4294967295 << (32 - 8 * (n % 4))),
            (e.length = t.ceil(n / 4));
        },
        clone: function () {
          var t = s.clone.call(this);
          return (t.words = this.words.slice(0)), t;
        },
        random: function (e) {
          for (var n = [], i = 0; e > i; i += 4)
            n.push((4294967296 * t.random()) | 0);
          return new o.init(n, e);
        },
      })),
      a = (n.enc = {}),
      c = (n.enc.Hex = {
        stringify: function (t) {
          var e = t.words;
          t = t.sigBytes;
          for (var n = [], i = 0; t > i; i++) {
            var r = (e[i >>> 2] >>> (24 - 8 * (i % 4))) & 255;
            n.push((r >>> 4).toString(16)), n.push((15 & r).toString(16));
          }
          return n.join("");
        },
        parse: function (t) {
          for (var e = t.length, n = [], i = 0; e > i; i += 2)
            n[i >>> 3] |= parseInt(t.substr(i, 2), 16) << (24 - 4 * (i % 8));
          return new o.init(n, e / 2);
        },
      }),
      h = (a.Latin1 = {
        stringify: function (t) {
          var e = t.words;
          t = t.sigBytes;
          for (var n = [], i = 0; t > i; i++)
            n.push(
              String.fromCharCode((e[i >>> 2] >>> (24 - 8 * (i % 4))) & 255)
            );
          return n.join("");
        },
        parse: function (t) {
          for (var e = t.length, n = [], i = 0; e > i; i++)
            n[i >>> 2] |= (255 & t.charCodeAt(i)) << (24 - 8 * (i % 4));
          return new o.init(n, e);
        },
      }),
      f = (a.Utf8 = {
        stringify: function (t) {
          try {
            return decodeURIComponent(escape(h.stringify(t)));
          } catch (e) {
            throw Error("Malformed UTF-8 data");
          }
        },
        parse: function (t) {
          return h.parse(unescape(encodeURIComponent(t)));
        },
      }),
      u = (i.BufferedBlockAlgorithm = s.extend({
        reset: function () {
          (this._data = new o.init()), (this._nDataBytes = 0);
        },
        _append: function (t) {
          "string" == typeof t && (t = f.parse(t)),
            this._data.concat(t),
            (this._nDataBytes += t.sigBytes);
        },
        _process: function (e) {
          var n = this._data,
            i = n.words,
            r = n.sigBytes,
            s = this.blockSize,
            a = r / (4 * s),
            a = e ? t.ceil(a) : t.max((0 | a) - this._minBufferSize, 0);
          if (((e = a * s), (r = t.min(4 * e, r)), e)) {
            for (var c = 0; e > c; c += s) this._doProcessBlock(i, c);
            (c = i.splice(0, e)), (n.sigBytes -= r);
          }
          return new o.init(c, r);
        },
        clone: function () {
          var t = s.clone.call(this);
          return (t._data = this._data.clone()), t;
        },
        _minBufferSize: 0,
      }));
    i.Hasher = u.extend({
      cfg: s.extend(),
      init: function (t) {
        (this.cfg = this.cfg.extend(t)), this.reset();
      },
      reset: function () {
        u.reset.call(this), this._doReset();
      },
      update: function (t) {
        return this._append(t), this._process(), this;
      },
      finalize: function (t) {
        return t && this._append(t), this._doFinalize();
      },
      blockSize: 16,
      _createHelper: function (t) {
        return function (e, n) {
          return new t.init(n).finalize(e);
        };
      },
      _createHmacHelper: function (t) {
        return function (e, n) {
          return new l._$_hmc.init(t, n).finalize(e);
        };
      },
    });
    var l = (n.algo = {});
    return n;
  })(Math);
!(function () {
  var t = cryptoJS,
    e = t.lib,
    n = e.WordArray,
    i = e.Hasher,
    r = [],
    e = (t.algo._$_sh1 = i.extend({
      _doReset: function () {
        this._hash = new n.init([
          1732584193, 4023233417, 2562383102, 271733878, 3285377520,
        ]);
      },
      _doProcessBlock: function (t, e) {
        for (
          var n = this._hash.words,
            i = n[0],
            s = n[1],
            o = n[2],
            a = n[3],
            c = n[4],
            h = 0;
          80 > h;
          h++
        ) {
          if (16 > h) r[h] = 0 | t[e + h];
          else {
            var f = r[h - 3] ^ r[h - 8] ^ r[h - 14] ^ r[h - 16];
            r[h] = (f << 1) | (f >>> 31);
          }
          (f = ((i << 5) | (i >>> 27)) + c + r[h]),
            (f =
              20 > h
                ? f + (((s & o) | (~s & a)) + 1518500249)
                : 40 > h
                ? f + ((s ^ o ^ a) + 1859775393)
                : 60 > h
                ? f + (((s & o) | (s & a) | (o & a)) - 1894007588)
                : f + ((s ^ o ^ a) - 899497514)),
            (c = a),
            (a = o),
            (o = (s << 30) | (s >>> 2)),
            (s = i),
            (i = f);
        }
        (n[0] = (n[0] + i) | 0),
          (n[1] = (n[1] + s) | 0),
          (n[2] = (n[2] + o) | 0),
          (n[3] = (n[3] + a) | 0),
          (n[4] = (n[4] + c) | 0);
      },
      _doFinalize: function () {
        var t = this._data,
          e = t.words,
          n = 8 * this._nDataBytes,
          i = 8 * t.sigBytes;
        return (
          (e[i >>> 5] |= 128 << (24 - (i % 32))),
          (e[(((i + 64) >>> 9) << 4) + 14] = Math.floor(n / 4294967296)),
          (e[(((i + 64) >>> 9) << 4) + 15] = n),
          (t.sigBytes = 4 * e.length),
          this._process(),
          this._hash
        );
      },
      clone: function () {
        var t = i.clone.call(this);
        return (t._hash = this._hash.clone()), t;
      },
    }));
  (t._$_sh1 = i._createHelper(e)), (t.Hmac_$_sh1 = i._createHmacHelper(e));
})(),
  (function () {
    var t = cryptoJS,
      e = t.enc.Utf8;
    t.algo._$_hmc = t.lib.Base.extend({
      init: function (t, n) {
        (t = this._$_hsr = new t.init()),
          "string" == typeof n && (n = e.parse(n));
        var i = t.blockSize,
          r = 4 * i;
        n.sigBytes > r && (n = t.finalize(n)), n.clamp();
        for (
          var s = (this._oKey = n.clone()),
            o = (this._iKey = n.clone()),
            a = s.words,
            c = o.words,
            h = 0;
          i > h;
          h++
        )
          (a[h] ^= 1549556828), (c[h] ^= 909522486);
        (s.sigBytes = o.sigBytes = r), this.reset();
      },
      reset: function () {
        var t = this._$_hsr;
        t.reset(), t.update(this._iKey);
      },
      update: function (t) {
        return this._$_hsr.update(t), this;
      },
      finalize: function (t) {
        var e = this._$_hsr;
        return (
          (t = e.finalize(t)),
          e.reset(),
          e.finalize(this._oKey.clone().concat(t))
        );
      },
    });
  })(),
  (function () {
    var t = cryptoJS,
      e = t.lib,
      n = e.Base,
      i = e.WordArray,
      e = t.algo,
      Watch protocol = e._$_hmc,
      s = (e.PBKDF2 = n.extend({
        cfg: n.extend({ keySize: 4, hasher: e._$_sh1, iterations: 1 }),
        init: function (t) {
          this.cfg = this.cfg.extend(t);
        },
        compute: function (t, e) {
          for (
            var n = this.cfg,
              s = r.create(n.hasher, t),
              o = i.create(),
              a = i.create([1]),
              c = o.words,
              h = a.words,
              f = n.keySize,
              n = n.iterations;
            c.length < f;

          ) {
            var u = s.update(e).finalize(a);
            s.reset();
            for (var l = u.words, _ = l.length, d = u, p = 1; n > p; p++) {
              (d = s.finalize(d)), s.reset();
              for (var g = d.words, y = 0; _ > y; y++) l[y] ^= g[y];
            }
            o.concat(u), h[0]++;
          }
          return (o.sigBytes = 4 * f), o;
        },
      }));
    t.passwordDerivationFunction = function (t, e, n) {
      return s.create(n).compute(t, e);
    };
  })();
