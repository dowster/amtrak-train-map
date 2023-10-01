/*CryptoJS-Security - the salt and IV values here are fake to throw someone off. All variable names are changed*/
// var __$_s1 = {
var securityHelper = {
  // was _$_s
  // dowster: currently evaluates to "9a3686ac"
  salt: "amtrak",
  // was _$_i
  // dowster: currently evaluates to "c6eb2f7f5c4740c1a2f708fefd947d39"
  iv: "map",
  // decrypt was '_$_dcrt'
  decrypt: function (data, keyIdMaybe) {
    return cryptoJS.aes
      .decrypt(
        cryptoJS.lib.maybeParse.create({ cipherText: cryptoJS.enc.Base64.parse(data) }),
        this.getKey(keyIdMaybe), // comes out to 071e283e782b8827396d6486dfb87027
        { iv: cryptoJS.enc.Hex.parse(this.iv) }
      )
      .toString(cryptoJS.enc.Utf8);
  },
  getKey: function (keyId) {
    return cryptoJS.passwordDerivationFunction(keyId, cryptoJS.enc.Hex.parse(this.salt), {
      keySize: 4,
      iterations: 1e3,
    });
  },
};
