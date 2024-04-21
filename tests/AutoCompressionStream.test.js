const BlockStream = require('block-stream');
const { AutoCompressor } = require('../src');
const AutoCompressorStream = require('../src/stream/AutoCompressStream');


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


function decharacter (vec) {
    return vec
        .map(deinteger)
        .join('');
}


function decharacterStream (vec) {
    const result = [];

    vec.map(
        (value, index) => result[index] = deinteger(value * 0.003921569)
    );

    return result.join('');
}


function prettifyCharacter (flatCharacter) {
    let prettyCharacter = '';

    const rowCount = 7;
    const columnCount = 7;

    for (
        let row = 0;
        row < rowCount;
        row++
    ) {
        for (
            let column = 0;
            column < columnCount;
            column++
        ) {
            prettyCharacter += flatCharacter[column + row * columnCount];
        }

        prettyCharacter += '\n';
    }

    return prettyCharacter;
}


function deinteger (value) {
    return value >= 0.5 ? '#' : '.';
}


function logDecompressedCharacter (vec) {
    console.log(
        prettifyCharacter(
            decharacter(vec)
        )
    );
}


function logDecompressedCharacterStream (vec) {
    console.log(
        prettifyCharacter(
            decharacterStream(vec)
        )
    );
}


class DisplayStream extends Transform {
    _transform (
        chunk,
        encoding,
        callback
    ) {
        logDecompressedCharacterStream(chunk);
        // console.log(chunk)

        callback();
    }
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

        const accuracy = autoCompressor.accuracy(TRAINING_SAMPLES);

        console.log('net accuracy:', accuracy);

        const compressStream = new AutoCompressStream(autoCompressor);
        const decompressStream = new AutoCompressStream(autoCompressor, { mode: 'decompress' });

        console.log();

        const inputStream = new BlockStream(a.length);
        const bufferStream = new BlockStream(decompressStream.blockSize());

        const displayStream = new DisplayStream();

        // inputStream.pipe(compressStream).pipe(bufferStream).pipe(decompressStream).pipe(displayStream);
        inputStream.pipe(compressStream).pipe(decompressStream).pipe(displayStream);
        // inputStream.pipe(compressStream).pipe(process.stdout);

        // inputStream.write(new Uint8Array(a));
        // inputStream.write(new Uint8Array(b));
        // inputStream.write(new Uint8Array(c));


        const compressedA = autoCompressor.compress(a);
        const decompressedA = Uint8Array.from(
            autoCompressor.decompress(compressedA).map(
                (value) => Math.round(value * 255)
            )
        );

        // displayStream.write(decompressedA);
        displayStream.write(
            Uint8Array.from(
                autoCompressor.decompress(a).map(
                    (value) => Math.round(value * 255)
                )
            )
        );

        logDecompressedCharacter(a);
    }
);
