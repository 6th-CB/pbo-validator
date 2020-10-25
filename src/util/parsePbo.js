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
    pbo = pbo.split(/\0{16}/u)[2]; // Missionfile .pbo appears to have regions split by 32 bytes of 0
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
