/**
 * Convert a vector of bits into a word.
 * @param {Float32Array} vec The vector of bits to convert into a word.
 * @returns {string} The decoded word.
 */
function vec2string (
    vec
) {
    const bytes = [];

    for (
        let vecIndex = 0;
        vecIndex < vec.length;
        vecIndex += 8
    ) {
        let byte = 0x00;

        for (
            let localBitIndex = 0;
            localBitIndex < 8;
            localBitIndex++
        ) {
            const bitIndex = vecIndex + localBitIndex;
            const predictedBit = vec[bitIndex];

            const bit = Math.round(predictedBit);

            byte |= bit << localBitIndex;
        }

        bytes.push(byte);
    }

    let word = String.fromCharCode(...bytes).trim();

    return word;
}


module.exports = vec2string;
