const AutoCompressor = require("./AutoCompressor");
const AutoEncoder = require("./AutoEncoder");

const lang = require("./lang");


module.exports = {
    AutoCompressor,
    AutoEncoder,
    lang,
    ...lang
};
