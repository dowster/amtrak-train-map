/*CryptoJS-Security - the salt and IV values here are fake to throw someone off. All variable names are changed*/
var __$_s1 = {
  _$_s: "amtrak",
  _$_i: "map",
  _$_dcrt: function (_, $) {
    return _$_cjs._$_sea
      ._$_dcr(
        _$_cjs.lib._$_cpar.create({ _$_ctxt: _$_cjs.enc.Base64.parse(_) }),
        this._$_gk($),
        { iv: _$_cjs.enc.Hex.parse(this._$_i) }
      )
      .toString(_$_cjs.enc.Utf8);
  },
  _$_gk: function (_) {
    return _$_cjs._$_pdf2(_, _$_cjs.enc.Hex.parse(this._$_s), {
      keySize: 4,
      iterations: 1e3,
    });
  },
};
