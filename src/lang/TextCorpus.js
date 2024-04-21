const {
    getLongestWord,
    getWordList,
    isValidSourceText
 } = require("./functions");


function invalidArgumentError (
    parameterName,
    parameterType,
    value
) {
    throw new TypeError(
        "Invalid argument [ "
            + `${parameterName}: ${typeof parameterType} `
            + `= ${value} (${typeof value}) `
            + " ]"

    );
}


class TextCorpus {
    /**
     * Create a `Corpus` from a `CorpusLike` object.
     * @param {import("./TextCorpusLike")} corpusLike
     * @returns {TextCorpus}
     * The new `Corpus`.
     */
    static from (corpusLike) {
        if (TextCorpus._isTextCorpus(corpusLike)) {
            return corpusLike;
        } else if (isValidSourceText(corpusLike)) {
            return new TextCorpus(corpusLike);
        } else {
            throw invalidArgumentError(
                'corpusLike',
                'TextCorpusLike',
                corpusLike
            );
        }
    }


    /**
     * Return `true` if `corpusLike` is a `Corpus`.
     * Otherwise, returns `false`.
     * @param {import("./TextCorpusLike")} corpusLike
     * The object in question.
     * @returns {boolean}
     * Whether or not `corpusLike` is a `Corpus`.
     * @private
     */
    static _isTextCorpus (corpusLike) {
        if (typeof corpusLike !== 'object') {
            return false;
        }

        if (corpusLike === null) {
            return false;
        }

        if (corpusLike instanceof TextCorpus) {
            return true;
        }

        return false;
    }


    /**
     * Create a new `Corpus`.
     * @param {import("./TextCorpusLike")} text
     * One or more bodies of text to create a `Corpus` from.
     */
    constructor (text) {
        if (TextCorpus._isTextCorpus(text)) {
            text = structuredClone(
                text.flat(Number.POSITIVE_INFINITY)
            );
        }

        if (!isValidSourceText(text)) {
            throw invalidArgumentError(
                'text',
                'TextCorpusLike',
                text
            );
        }

        this._entries = structuredClone(
            text.flat(Number.POSITIVE_INFINITY)
        );

        this._initialize(text);
    }


    entries () {
        return this._entries;
    }


    /**
     * Get the longest word in the `Corpus`.
     * @returns {string}
     * The longest word found within the `Corpus`.
     */
    longestWord () {
        return this._longestWord ??= getLongestWord(this._uniqueWords);
    }


    /**
     * Get a list of all unique words within the `Corpus`.
     * @returns {string[]}
     * A list of all unique words found within the `Corpus`.
     */
    uniqueWords () {
        const uniqueWords = this._uniqueWords ??= getWordList(this);

        return uniqueWords;
    }


    toJSON () {
        return Object.values(this);
    }


    _initialize (entries) {
        if (typeof entries === 'string') {
            entries = [ entries ];
        }

        // Initialize the `Array` aspect of the `Corpus`.
        for (let entry of entries) {
            this._entries.push(entry);
        }

        // Populate the caches.
        this.uniqueWords();
        this.longestWord();

        // Freeze the object once the caches are populated.
        Object.freeze(this);
    }
}


module.exports = TextCorpus;
