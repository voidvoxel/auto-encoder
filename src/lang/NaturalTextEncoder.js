const AutoCompressor = require("../AutoCompressor");
const AutoCompressorStream = require("../stream/AutoCompressorStream");
const AutoEncoder = require("../AutoEncoder");


function getWordList (sentences) {
    if (typeof sentences === 'string') {
        sentences = [ sentences ];
    }

    // Split each sentence into an array of words.
    sentences = sentences.map(
        (value) => value.split(' ')
    );

    let words = {};

    for (let word of sentences.flat()) {
        words[word] = true;
    }

    words = Object.keys(words);

    return words;
}


function getLongestWord (words) {
    let longestWord = '';

    for (let word of words) {
        if (word.length > longestWord.length) {
            longestWord = word;
        }
    }

    return longestWord;
}


class NaturalTextEncoder {
    /**
     * Create a new `NaturalTextEncoder`.
     */
    constructor (
    ) {
        this._ae = null;
    }


    accuracy (corpus) {
        const words = getWordList(corpus);

        return this._ae.accuracy(words);
    }


    decode (encodedText) {
        if (encodedText.length === this._encodedDataSize) {
            return this.decodeWord(encodedText);
        }

        return this.decodeSentence(encodedText);
    }


    decodeSentence (encodedSentence) {
        let sentence = '';

        for (const encodedWord of encodedSentence) {
            const word = this.decodeWord(encodedWord);

            sentence += word + ' ';
        }

        return sentence.trimEnd();
    }


    decodeWord (encodedWord) {
        return this._ae.decode(encodedWord);
    }


    encode (text) {
        if (text.includes(' ')) {
            return this._encodeSentence(text);
        }

        return this._encodeWord(text);
    }


    /**
     * Train the `NaturalTextEncoder` on a corpus.
     * @param {string | string[]} corpus
     * A collection of words used to create training data for the network.
     * @param {*} options
     * The options used to create and train this natural text encoder.
     */
    train (
        corpus,
        options = {}
    ) {
        const words = getWordList(corpus);

        const longestWord = getLongestWord(words);
        const longestWordLength = longestWord.length;

        const encodingScale = options.encodingScale ?? 0.5;

        delete options.encodingScale;

        this._encodedDataSize = longestWordLength * encodingScale;

        this._ae = new AutoEncoder(
            longestWordLength,
            this._encodedDataSize,
            'string'
        );

        this._ae.train(
            words,
            options
        );
    }


    _encodeSentence (sentence) {
        const words = sentence.split(' ');

        const encodedWords = [];

        for (const word of sentence) {
            const encodedWord = this._encodeWord(word);

            encodedWords.push(encodedWord);
        }

        return encodedWords;
    }


    _encodeWord (word) {
        return this._ae.encode(word);
    }
}


module.exports = NaturalTextEncoder;
