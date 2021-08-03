const assert = require('assert');
const utils = require("../index");
const sinon = require('sinon');


describe('#jwt #config', function () {
  it('config should be equal default values: ', function () {
    const result = utils.jwtUtil.getConfig();

    assert.deepStrictEqual(result, { expiresIn: '1h', secret: 'sample' });
  });

  it('config should be equal set values: ', function () {
    utils.jwtUtil.setConfig({
      expiresIn: '2h'
    });

    const result = utils.jwtUtil.getConfig();

    assert.deepStrictEqual(result, { expiresIn: '2h', secret: 'sample' });
  });

  it('config should be equal set 2h: ', function () {
    utils.jwtUtil.setConfig({
      expiresIn: '2h'
    });

    const result = utils.jwtUtil.getConfig("expiresIn");

    assert.strictEqual(result, '2h');
  });
});

describe('#jwt #sign', function () {
  it('signed data should be string and not equal null or empty: ', async function () {
    const result = await utils.jwtUtil.sign({ mission: "test" });

    assert.deepStrictEqual(typeof result, 'string');
  });

  it('signed data should be string and not equal null or empty: ', async function () {
    const signedData = await utils.jwtUtil.sign({ mission: "test" });
    const resultData = await utils.jwtUtil.verify(signedData);

    assert.deepStrictEqual(resultData, { mission: "test" });
  });

  it('signed data should be equal verified data: ', async function () {
    const signedData = await utils.jwtUtil.sign({ mission: "test" }, "!mandh.");
    const resultData = await utils.jwtUtil.verify(signedData, "!mandh.");

    assert.deepStrictEqual(resultData, { mission: "test" });
  });

  it('res.cookie should be run: ', async function () {
    const res = {
      cookie: sinon.fake(),
    }

    const signedData = await utils.jwtUtil.sign({ mission: "test" });
    await utils.jwtUtil.cookie(res, { mission: "test" });

    assert(res.cookie.calledOnceWithExactly("jwt", signedData))
  });

  it('res.cookie should be run: ', async function () {
    const res = {
      clearCookie: sinon.fake(),
    }

    await utils.jwtUtil.clear(res);
    assert(res.clearCookie.calledOnceWithExactly("jwt"))
  });
});