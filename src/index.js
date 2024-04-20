const AutoCompressor = require("./AutoCompressor");
const AutoEncoder = require("./AutoEncoder");
const accuracy = require("./accuracy");

const lang = require("./lang");


module.exports = {
    AutoCompressor,
    AutoEncoder,
    accuracy,
    lang,
    ...lang
};
