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


test(
    "Extract features",
    async () => {
        const autoEncoder = new AutoEncoder(
            a.length,
            a.length * 0.1,
            'number'
        );

        const TRAINING_SAMPLES = [ a, b, c ];

        await autoEncoder.train(TRAINING_SAMPLES);

        const accuracy = autoEncoder.accuracy(TRAINING_SAMPLES);

        expect(accuracy).toBe(1);
    },
    10000
);
