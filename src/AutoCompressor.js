const AutoEncoder = require("./AutoEncoder");


const DEFAULT_TRAINING_DATA = [
    [ 0.0, 0.0 ],
    [ 1.0, 0.0 ]
];


class AutoCompressor {
    constructor (
        options = {}
    ) {
        this._compressionRate = options.compressionRate ?? 0.5;

        this._updateSizes(DEFAULT_TRAINING_DATA);
    }


    accuracy (trainingData) {
        return this._autoEncoder.accuracy(trainingData);
    }


    compress (data) {
        return this._autoEncoder.encode(data);
    }


    decompress (compressedData) {
        return this._autoEncoder.decode(compressedData);
    }


    getCompressionRate () {
        return this._compressionRate;
    }


    getCompressionScale () {
        return 1.0 - this.getCompressionRate();
    }


    async train (
        data,
        options = {}
    ) {
        this._updateSizes(data);

        // Create an auto encoder to extract the features.
        const autoEncoder = new AutoEncoder(
            this._uncompressedSize,
            this._compressedSize,
            'number'
        );

        // Train the auto encoder on the training data.
        await autoEncoder.train(
            data,
            options
        );

        this._autoEncoder = autoEncoder;
    }


    _updateSizes (trainingData) {
        // Determine the size of a block of uncompressed data.
        this._uncompressedSize = trainingData[0].length;

        // Calculate the size of a block of compressed data.
        this._compressedSize = this._uncompressedSize * this.getCompressionScale();
    }
}


module.exports = AutoCompressor;
