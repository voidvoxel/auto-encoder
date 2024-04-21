const { NeuralNetworkGPU, likely } = require("brain.js");
const string2vec = require("../encoding/string2vec");

const {
    getLongestWord,
    getWordList
 } = require("./functions");

 const accuracy = require("../functions/accuracy");
const TextCorpus = require("./TextCorpus");


const { appendFileSync, writeFileSync } = require('fs');


class NaturalTextAutoCorrector {
    /**
     * Create a new `NaturalTextAutoCorrector`.
     * @param {import("./NaturalTextEncoder")} encoder
     * The encoder that this `NaturalTextAutoCorrector` will be used in
     * conjunction with.
     * @param {*} options
     */
    constructor (
        encoder,
        options = {}
    ) {
        const words = encoder.trainingWords();

        const rawInputSize = getLongestWord(words).length;

        const inputSize = rawInputSize * 8;

        const outputSize = words.length;

        const hiddenLayers = [
            Math.round(inputSize * 0.8),
            Math.round((inputSize / outputSize) * 0.5 * 0.6),
            Math.round(outputSize * 0.8)
        ];

        options.inputSize = inputSize;
        options.outputSize = outputSize;
        options.hiddenLayers = hiddenLayers;

        this._nn = new NeuralNetworkGPU(options);

        /**
         * The size of the input.
         * @type {number}
         */
        this._rawInputSize = rawInputSize;

        /**
         * The size of the input layer.
         * @type {number}
         */
        this._inputSize = inputSize;

        /**
         * The size of the output layer.
         * @type {number}
         */
        this._rawOutputSize = outputSize;

        /**
         * The sizes of the network's hidden layers.
         * @type {number[]}
         */
        this._hiddenLayerSizes = hiddenLayers;

        /**
         * The `NaturalTextEncoder` used to encode data.
         * @type {import("./NaturalTextEncoder")}
         */
        this._encoder = encoder;
    }


    /**
     * Test the accuracy of the model against the given training data.
     * @param {import("./TextCorpusLike")} corpus
     * The training data to test the model against.
     * @param {boolean} strict
     * Whether or not to enable stricter-accuracy mode.
     * @returns {number}
     * The accuracy of the model against the given data.
     */
    accuracy (corpus) {
        corpus = TextCorpus.from(corpus);

        const words = corpus.uniqueWords();

        let accuracy = 0.0;

        for (let word of words) {
            const correction = this.correct(word);

            if (correction === word) {
                accuracy += 1;
            }
        }

        return accuracy / words.length;
    }


    correct (word) {
        const preprocessedWord = this._preprocessWord(word);

        const correction = likely(
            preprocessedWord,
            this._nn
        );


        appendFileSync(
            'zzz.correct.tmp',
            JSON.stringify([ word, correction ]) + '\n',
            'utf-8'
        );

        return correction;
    }


    /**
     * Train this `NaturalTextAutoCorrector`.
     * @param {*} options
     * The training options.
     */
    train (
        options = {}
    ) {
        const data = this._generateTrainingData();

        this._trainingData = data;

        options.errorThresh ??= 0.011;
        options.iterations ??= 1000;

        return this._nn.train(
            data,
            options
        );
    }


    /**
     * Generate training data for the network.
     * @param {string[]} words
     * A list of words to generate training data from.
     * @returns
     * The generated training data.
     */
    _generateTrainingData (words = null) {
        const data = [];

        words ??= this._encoder.trainingWords();

        for (let word of words) {
            const preprocessedWord = this._preprocessWord(word);

            const input = Array.from(preprocessedWord);
            const output = {};

            output[word] = 1.0;

            const sample = {
                input,
                output
            };

            data.push(sample);
        }


        writeFileSync(
            'zzz.woosh.tmp',
            JSON.stringify(data),
            'utf-8'
        );

        return data;
    }


    _preprocessWord (word) {
        return string2vec(
            word,
            this._rawInputSize
        );
    }
}


module.exports = NaturalTextAutoCorrector;
