const { Transform } = require('stream');


const BlockStream = require('block-stream');


const AutoCompressor = require("../AutoCompressor");


class AutoCompressStream extends Transform {
    /**
     * Create a new `AutoCompressorStream`.
     * @param {AutoCompressor} autoCompressor
     * The stream options.
     * @param {any} options
     * The stream options.
     */
    constructor (
        autoCompressor,
        options = {}
    ) {
        const mode = options.mode ?? 'compress';

        super(options);

        this._mode = mode;

        this._autoCompressor = autoCompressor;
    }


    blockSize () {
        let blockSize = 0;

        if (this.mode() === 'compress') {
            // If compressed mode is enabled, return the uncompressed size.
            blockSize = this._autoCompressor._uncompressedSize;
        } else {
            // If compressed mode is disabled, return the compressed size.
            blockSize = this._autoCompressor._compressedSize;
        }

        blockSize = Math.round(blockSize);

        return blockSize;
    }


    compressionRate () {
        return this._autoCompressor._compressionRate;
    }


    mode () {
        return this._mode[0] === 'c' ? 'compress' : 'decompress';
    }


    _transform (
        chunk,
        encoding,
        callback
    ) {
        switch (encoding) {
            default:
                throw new Error(`Encoding '${encoding}' not yet supported.`);

            case 'binary':
            case 'buffer':
                this._transform_binary(
                    chunk,
                    encoding,
                    callback
                );

                break;
        }

        callback();
    }


    _transform_binary (chunk) {
        let processedChunk;

        if (this.mode() === 'compress') {
            processedChunk = this._autoCompressor.compress(chunk);
        } else {
            processedChunk = this._autoCompressor.decompress(chunk);
        }

        const normalizedProcessedChunk = new Uint8Array(processedChunk.length);

        for (
            let i = 0;
            i < processedChunk.length;
            i++
        ) {
            normalizedProcessedChunk[i] = Math.round(processedChunk[i] * 255);
        }

        this.emit(
            'data',
            normalizedProcessedChunk,
            'binary',
            () => {}
        );
    }
}


module.exports = AutoCompressStream;
