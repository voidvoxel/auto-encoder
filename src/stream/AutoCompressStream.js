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

        this._blockStream = new BlockStream(this.blockSize());

        this._blockStream.on(
            'data',
            (chunk) => {
                this.emit(
                    'data',
                    chunk,
                    'binary',
                    () => {}
                );
            }
        );

        this.on(
            'close',
            () => {
                this._blockStream.close();
            }
        );
    }


    blockSize () {
        if (this._mode === MODE_COMPRESS) {
            return this._autoCompressor._uncompressedSize;
        } else {
            return this._autoCompressor._compressedSize;
        }
    }


    compressionRate () {
        return this._autoCompressor._compressionRate;
    }


    mode () {
        return this._mode;
    }


    _compress () {
        this._autoCompressor.compress(

        );
    }


    _flush () {

    }


    write (chunk) {
        chunk = chunk.map(
            (value) => Math.round(value * 255)
        );

        chunk = new Uint8Array(chunk);

        super.write(chunk);
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
        this._blockStream.write(chunk);
    }
}


module.exports = AutoCompressStream;
