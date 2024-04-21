/**
 *
 * @param {string} word
 * The word to convert into a vector.
 * @param {number} wordLength
 * The maximum possible length of a word.
 * @returns {Float32Array}
 */
function string2vec (
    word,
    wordLength = 16
) {
    if (wordLength) {
        word = word.padEnd(wordLength);
    }

    const byteLength = wordLength * 4;
    const bitLength = byteLength * 8;

    const vec = new Float32Array(bitLength);

    let index = 0;

    for (let char of word) {
        let byte = char.charCodeAt(0);

        vec[index++] = byte & 0b0000_0001;
        vec[index++] = (byte & 0b0000_0010) >> 1;
        vec[index++] = (byte & 0b0000_0100) >> 2;
        vec[index++] = (byte & 0b0000_1000) >> 3;
        vec[index++] = (byte & 0b0001_0000) >> 4;
        vec[index++] = (byte & 0b0010_0000) >> 5;
        vec[index++] = (byte & 0b0100_0000) >> 6;
        vec[index++] = (byte & 0b1000_0000) >> 7;
    }

    return vec;
}


module.exports = string2vec;
