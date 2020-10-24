const fs = require('fs');
const util = require('util');
const armaClassParser = require('arma-class-parser');

class BinarizedPboError extends Error {
    constructor(...args) {
        super(...args);
    }
}

function parsePboString(pbo) {
    if (pbo.indexOf('class EditorData') === -1) {
        throw new BinarizedPboError();
    }
    const content = pbo.slice(pbo.indexOf('class EditorData'), pbo.lastIndexOf('};') + '};'.length);
    const parsed = armaClassParser.parse(content);
    return parsed;
}

async function parsePbo(path) {
    const pbo = await util.promisify(fs.readFile)(path, 'utf8');
    return parsePboString(pbo);
}

module.exports = {
    BinarizedPboError,
    parsePboString,
    parsePbo,
};
