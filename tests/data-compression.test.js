const { AutoCompressor } = require('../src');


const a = character(
    '.#####.' +
    '#.....#' +
    '#.....#' +
    '#######' +
    '#.....#' +
    '#.....#' +
    '#.....#'
  );
  const b = character(
    '######.' +
    '#.....#' +
    '#.....#' +
    '######.' +
    '#.....#' +
    '#.....#' +
    '######.'
  );
  const c = character(
    '#######' +
    '#......' +
    '#......' +
    '#......' +
    '#......' +
    '#......' +
    '#######'
  );


/**
 * Turn the # into 1s and . into 0s. for whole string
 * @param string
 * @returns {Array}
 */
function character(string) {
    return string
        .trim()
        .split('')
        .map(integer);
}

/**
 * Return 0 or 1 for '#'
 * @param character
 * @returns {number}
 */
function integer(character) {
    if ('#' === character) return 1;
    return 0;
}


function calculateAccuracy (
    autoCompressor,
    original
) {
    const encoded = autoCompressor.compress(original);
    const decoded = autoCompressor.decompress(encoded);

    let accuracy = 0;

    for (
        let i = 0;
        i < decoded.length;
        i++
    ) {
        const originalValue = original[i];
        const decodedValue = Math.round(decoded[i]);

        const isCorrect = originalValue === decodedValue;

        if (isCorrect) {
            accuracy += 1;
        }
    }

    accuracy /= decoded.length;

    return accuracy;
}


test(
    "Compress data by extracting features",
    () => {
        const autoCompressor = new AutoCompressor(
            {
                compressionRate: 0.7
            }
        );

        const TRAINING_SAMPLES = [ a, b, c ];

        autoCompressor.train(TRAINING_SAMPLES);

        const accuracyA = calculateAccuracy(
            autoCompressor,
            a
        );

        const accuracyB = calculateAccuracy(
            autoCompressor,
            b
        );

        const accuracyC = calculateAccuracy(
            autoCompressor,
            c
        );

        expect(accuracyA).toBe(1);
        expect(accuracyB).toBe(1);
        expect(accuracyC).toBe(1);
    }
)
