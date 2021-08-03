const assert = require('assert');
const utils = require("../index");


describe('#string #toTurkishSearchable', function () {
  it('"kalaba" input should be same with result: ', function () {
    assert.equal("kalaba", utils.stringUtil.toTurkishSearchable("kalaba"));
  });

  it('"kasaba" input should be same with result: ', function () {
    assert.equal("ka[sşSŞ]aba", utils.stringUtil.toTurkishSearchable("kasaba"));
  });

  it('"akşamlık" input should be same with result: ', function () {
    assert.equal("ak[sşSŞ]aml[iıIİ]k", utils.stringUtil.toTurkishSearchable("akşamlık"));
  });
});

describe('#string #insert', function () {
  it('Insert string to string single', function () {
    assert.equal("name=john", utils.stringUtil.insert("name={0}", "john"));
  });

  it('Insert string to string multiple', function () {
    assert.equal("name=john,john", utils.stringUtil.insert("name={0},{0}", "john"));
  });

  it('Insert string array to string', function () {
    assert.equal("name=john,smith", utils.stringUtil.insert("name={0},{1}", ["john", "smith"]));
  });

  it('Insert string array to string', function () {
    assert.equal("name=john,john", utils.stringUtil.insert("name={0},{0}", ["john", "smith"]));
  });

  it('Insert array to string with disorder', function () {
    assert.equal("name=smith,john", utils.stringUtil.insert("name={1},{0}", ["john", "smith"]));
  });

  it('Insert object array to string', function () {
    assert.equal("name=smith,john,john", utils.stringUtil.insert("name={1},{0},{0}", [{ index: 0, value: "john" }, { index: 1, value: "smith" }]));
  });
});

describe('#string #BadwordChecker #clearWords', function () {
  it('Clean word send for clear', async function () {
    assert.equal("My car is clean.", await new utils.stringUtil.BadwordChecker().clearWords("My car is clean."));
  });

  it('Bad word send for clear', async function () {
    assert.equal("**** you.", await new utils.stringUtil.BadwordChecker().clearWords("Fuck you."));
  });
});

describe('#string #BadwordChecker #hasBadWord', function () {
  it('Clean word send for check', async function () {
    assert.equal(false, await new utils.stringUtil.BadwordChecker().hasBadWord("My car is clean."));
  });

  it('Bad word send for check', async function () {
    assert.equal(true, await new utils.stringUtil.BadwordChecker().hasBadWord("Fuck you."));
  });
});