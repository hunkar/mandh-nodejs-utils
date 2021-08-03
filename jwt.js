const jwt = require('jsonwebtoken');

var config = {
    expiresIn: '1h',
    secret: 'sample'
}

const setConfig = (configs) => {
    if (!configs) return;

    Object.keys(configs).forEach(key => {
        if (configs[key] !== undefined)
            config[key] = configs[key];
    })
}

const getConfig = (key) => key ? config[key] : config;

const sign = (data, secret) => {
    return new Promise((res, rej) => {
        jwt.sign(
            {
                data
            },
            secret || config.secret,
            { expiresIn: config.expiresIn },
            (err, token) => {
                if (err) res();
                else res(token);
            }
        );
    });
}

const verify = (token, secret) => {
    return new Promise((res, rej) => {
        jwt.verify(token, secret || config.secret, (err, verified) => {
            if (err)
                res();
            else
                res(verified.data);
        });
    });
}

const cookie = async (res, data, secret) => {
    res.cookie('jwt', await sign(data, secret));
}

const clear = async (res) => {
    res.clearCookie("jwt");
}

module.exports = {
    verify,
    sign,
    cookie,
    clear,
    setConfig,
    getConfig
};
