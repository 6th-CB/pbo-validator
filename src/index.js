const {parsePbo, BinarizedPboError} = require('./util/parsePbo');
const getRelevant = require('./util/getRelevant');
const validate = require('./util/validate');

async function validatePbo(path) {
    console.log(`Validating ${path}`);
    try {
        const parsed = await parsePbo(path);
        const relevant = getRelevant(parsed);
        console.log(validate(relevant).join('\n'));
    } catch (err) {
        if (err instanceof BinarizedPboError) {
            console.log('Can\'t validate, PBO is binarized');
        } else {
            throw err;
        }
    }
    console.log('\n');
}
