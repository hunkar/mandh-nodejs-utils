const bcrypt = require('bcrypt');
const crypto = require('crypto');
const tokenGeneratorLib = require('token-generator');

//It generates token for any validations
function TokenGenerator({ salt = "mandh-token-salt", timestampMap = "!=m@ndh?=!", hashLength }) {
    this._tokenGenerator = tokenGeneratorLib({
        salt,
        timestampMap,
        hashLength: hashLength || 30
    });

    this.generateToken = () => this._tokenGenerator.generate();

    this.validateToken = token => this._tokenGenerator.isValid(token);
}

//It generates hash and validate hash by bcrypt
function BcryptHasher({ saltRounds = 10 } = {}) {
    this.setSaltRounds = (value) => {
        saltRounds = value;
    }

    //It returns hash of text with bcrypt
    this.getHash = (text) => bcrypt.hashSync(text, saltRounds);

    //It check validity of hash with bcrypt
    this.compare = (text, hashedText) => bcrypt.compareSync(text, hashedText);
}

//Generate token for any activation statuses or sth like that.
const generateActivationToken = (length) => {
    length = length || 32;

    const primeLength = (Math.ceil(Math.sqrt(length)) + 3);

    const diffHell = crypto.createDiffieHellman(Math.pow(2, primeLength));
    diffHell.generateKeys('base64');
    const result = diffHell.getPublicKey('hex');

    return result.toString().substr(0, length);
}

//Decrypt text for any encrypted text from our applications.
const descryptData = (encryptedText, key) => {
    try {
        var decipher = crypto.createDecipher('aes-128-ecb', key);

        chunks = []
        chunks.push(decipher.update(new Buffer(encryptedText, "base64").toString("binary"), "binary"));
        chunks.push(decipher.final('binary'));
        var txt = chunks.join("");
        txt = new Buffer(txt, "binary").toString("utf-8");

        return txt;
    } catch (err) {
        return null;
    }

}

//Encrypt plain text for any our applications.
const encryptData = (plainText, key, outputEncoding = "base64") => {
    try {
        var cipher = crypto.createCipher("aes-128-ecb", new Buffer(key));

        var crypted = Buffer.concat([cipher.update(new Buffer(plainText)), cipher.final()]);
        return crypted.toString(outputEncoding);
    } catch (err) {
        return null;
    }
}

module.exports = {
    TokenGenerator,
    BcryptHasher,
    generateActivationToken,
    descryptData,
    encryptData
}