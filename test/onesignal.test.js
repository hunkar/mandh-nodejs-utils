const assert = require('assert');
var proxyquire = require('proxyquire').noCallThru();
const sinon = require('sinon');

describe('#onesignal #initOnesignal', function () {
  it('Client constructor function should run one time', function () {
    const clientFunction = sinon.fake();
    const onesignalUtil = proxyquire('../onesignal', {
      'onesignal-node': {
        Client: clientFunction
      }
    });

    const onesignalConfig = {
      shortCode: "TR",
      appAuthKey: "1",
      appId: "2",
      smallIcon: "mandh_small"
    };

    onesignalUtil.initOnesignal({
      onesignalConfigurations: [onesignalConfig]
    })

    assert(clientFunction.calledOnceWithExactly({
      userAuthKey: onesignalConfig.appAuthKey,
      app: { appAuthKey: onesignalConfig.appAuthKey, appId: onesignalConfig.appId }
    }))
  });

  it('Client constructor function should run twice', function () {
    const clientFunction = sinon.fake();
    const onesignalUtil = proxyquire('../onesignal', {
      'onesignal-node': {
        Client: clientFunction
      }
    });

    const onesignalConfigurations = [{
      shortCode: "TR",
      appAuthKey: "1",
      appId: "2"
    }, {
      shortCode: "EN",
      appAuthKey: "3",
      appId: "4"
    }];

    onesignalUtil.initOnesignal({
      onesignalConfigurations
    })

    assert.strictEqual(clientFunction.callCount, 2)
  });
});

describe('#onesignal #set and #getIcons', function () {
  it('getOnesignalIconNames should return all icons', function () {
    const clientFunction = sinon.fake();
    const onesignalUtil = proxyquire('../onesignal', {
      'onesignal-node': {
        Client: clientFunction
      }
    });

    const onesignalConfig = {
      shortCode: "TR",
      appAuthKey: "1",
      appId: "2",
      smallIcon: "mandh_small",
      largeIcon: "mandh_large"
    };

    onesignalUtil.initOnesignal({
      onesignalConfigurations: [onesignalConfig]
    })

    assert.deepStrictEqual({ "TR": { smallIcon: "mandh_small", largeIcon: "mandh_large" } }, onesignalUtil.getOnesignalIconNames());
  });

  it('getOnesignalIconNames should return specific shortName', function () {
    const clientFunction = sinon.fake();
    const onesignalUtil = proxyquire('../onesignal', {
      'onesignal-node': {
        Client: clientFunction
      }
    });

    const onesignalConfig = {
      shortCode: "TR",
      appAuthKey: "1",
      appId: "2",
      smallIcon: "mandh_small",
      largeIcon: "mandh_large"
    };

    onesignalUtil.initOnesignal({
      onesignalConfigurations: [onesignalConfig]
    })

    assert.deepStrictEqual({ smallIcon: "mandh_small", largeIcon: "mandh_large" }, onesignalUtil.getOnesignalIconNames("TR"));
  });
})

describe('#onesignal #send', function () {
  it('Send notification should call with successfull data', function () {
    const notificationFn = sinon.fake();
    const notificationFunction = function () {
      return {
        postBody: {}
      }
    };

    const onesignalUtil = proxyquire('../onesignal', {
      'onesignal-node': {
        Client: function () {
          this.sendNotification = notificationFn
        },
        Notification: notificationFunction
      }
    });

    const onesignalConfigurations = [{
      shortCode: "TR",
      appAuthKey: "1",
      appId: "2"
    }];

    onesignalUtil.initOnesignal({
      onesignalConfigurations
    })

    onesignalUtil.send({
      title: "News",
      content: "Bad news from country.",
      picture: "http://dummy.com/1.img",
      data: { app: "Cross Over" },
      segments: ["Active Users"],
      tag: ["Mandh", "NodeJS"],
      shortCode: "TR",
      smallIcon: "small_icon",
      largeIcon: "large_icon"
    })

    assert(notificationFn.calledOnceWithExactly({
      postBody: {
        "included_segments": ["Active Users"],
        "headings": { en: "News" },
        "data": { app: "Cross Over" },
        "big_picture": "http://dummy.com/1.img",
        "small_icon": "small_icon",
        "large_icon": "large_icon",
        filters: [
          { "field": "tag", "key": "Mandh", "relation": "==", "value": "Mandh" },
          { "operator": "OR" },
          { "field": "tag", "key": "NodeJS", "relation": "==", "value": "NodeJS" }
        ]
      },
    }, sinon.match.any))
  });
});