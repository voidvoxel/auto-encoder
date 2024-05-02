const AutoEncoder = require("../AutoEncoder");
const TextCorpus = require("./TextCorpus");
const getWordList = require("./functions/getWordList");


/**
 * WARNING: Unstable API. Use at your own peril.
 */
class NaturalTextEncoder {
    /**
     * Create a new `NaturalTextEncoder`.
     */
    constructor (
    ) {
        /**
         * The `AutoEncoder` used to encode words.
         * @type {AutoEncoder?}
         */
        this._ae = null;

        /**
         * The list of words that this encoder was trained on.
         * @type {string[]}
         */
        this._words = [];
    }


    /**
     * Test the accuracy of the model against the given training data.
     * @param {import("./TextCorpusLike")} corpus
     * The `Corpus` to test the model against.
     * @returns {number}
     * The accuracy of the model against the given data.
     */
    accuracy (corpus) {
        corpus = TextCorpus.from(corpus);

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
     * @param {import("./TextCorpusLike")} corpus
     * A collection of words used to create training data for the network.
     * @param {*} options
     * The options used to create and train this natural text encoder.
     */
    async train (
        corpus,
        options = {}
    ) {
        /**
         * @type {TextCorpus}
         */
        corpus = TextCorpus.from(corpus);

        /**
         * @type {string[]}
         */
        const words = corpus.uniqueWords();

        const longestWordLength = corpus.longestWord().length;

        const encodingScale = options.encodingScale ?? 0.5;

        delete options.encodingScale;

        this._encodedDataSize = longestWordLength * encodingScale;

        this._ae = new AutoEncoder(
            longestWordLength,
            this._encodedDataSize,
            'string'
        );

        const results = await this._ae.train(
            words,
            options
        );

        this._corpus = corpus;
        this._trainingWords = words;

        return results;
    }


    /**
     * Get a list of words used to train this `NaturalTextEncoder`.
     * @returns {string[]}
     * The words used to train this `NaturalTextEncoder`.
     */
    trainingWords () {
        return this._trainingWords;
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
