const assert = require('assert');
const utils = require("../index");


describe('#crypto #generateActivationToken', function () {
  it('Should generate key that is 32 character: ', function () {
    const keyResult = utils.cryptoUtil.generateActivationToken();

    assert.equal(32, keyResult.length);
    assert.equal("string", typeof keyResult);
  });

  it('Should generate key that is 16 character: ', function () {
    const keyResult = utils.cryptoUtil.generateActivationToken(16);

    assert.equal(16, keyResult.length);
    assert.equal("string", typeof keyResult);
  });

  it('Should generate key that is 9 character: ', function () {
    const keyResult = utils.cryptoUtil.generateActivationToken(9);

    assert.equal(9, keyResult.length);
    assert.equal("string", typeof keyResult);
  });
});

describe('#crypto #encryptAnonymousMobile #decryptAnonymousMobile', function () {
  it('Should generate string encrpted key: ', function () {
    const plainText = "test plain text",
    key = "a4e1112f45e84f785358bb86ba750f48";
    const keyResult = utils.cryptoUtil.encryptData(plainText, key);

    assert.equal("string", typeof keyResult);
  });

  it('Should return null because of null key', function () {
    const plainText = "test plain text";
    const keyResult = utils.cryptoUtil.encryptData(plainText, null);

    assert.equal(null, keyResult);
  });

  it('Should cannot solve any key', function () {
    const randomEncriptedText = "jşdjgbd5115fgb",
    key = "a4e1112f45e84f785358bb86ba750f48";

    const keyResult = utils.cryptoUtil.descryptData(randomEncriptedText, key);

    assert.equal(keyResult, null);
  });

  it('Should solve true encrypted key', function () {
    const plainText = "test plain text",
    key = "a4e1112f45e84f785358bb86ba750f48";

    const encryptedKey = utils.cryptoUtil.encryptData(plainText, key);
    const keyResult = utils.cryptoUtil.descryptData(encryptedKey, key);

    assert.equal(keyResult, plainText);
  });
});