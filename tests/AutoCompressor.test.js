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


test(
    "Compress data by extracting features",
    async () => {
        const autoCompressor = new AutoCompressor(
            {
                compressionRate: 0.7
            }
        );

        const TRAINING_SAMPLES = [ a, b, c ];

        await autoCompressor.train(TRAINING_SAMPLES);

        const accuracy = autoCompressor.accuracy(TRAINING_SAMPLES);

        expect(accuracy).toBe(1);
    }
)
