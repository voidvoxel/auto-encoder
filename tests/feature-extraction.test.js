const { AutoEncoder } = require('../src');


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
    autoEncoder,
    original
) {
    const encoded = autoEncoder.encode(original);
    const decoded = autoEncoder.decode(encoded);

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
    "Extract features",
    () => {
        const autoEncoder = new AutoEncoder(
            a.length,
            a.length * 0.1,
            'number'
        );

        const TRAINING_SAMPLES = [ a, b, c ];

        autoEncoder.train(TRAINING_SAMPLES);

        const accuracyA = calculateAccuracy(
            autoEncoder,
            a
        );

        const accuracyB = calculateAccuracy(
            autoEncoder,
            b
        );

        const accuracyC = calculateAccuracy(
            autoEncoder,
            c
        );

        expect(accuracyA).toBe(1);
        expect(accuracyB).toBe(1);
        expect(accuracyC).toBe(1);
    }
)
