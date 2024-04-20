const getLongestWord = require("./getLongestWord");
const getWordList = require("./getWordList");


class TextCorpus extends Array {
    /**
     * Create a `Corpus` from a `CorpusLike` object.
     * @param {import("./TextCorpusLike")} corpusLike
     * @returns {TextCorpus}
     * The new `Corpus`.
     */
    static from (corpusLike) {
        if (typeof corpusLike === 'string') {
            return new TextCorpus(corpusLike);
        } else if (typeof corpusLike === 'object') {
            if (corpusLike instanceof TextCorpus) {
                return corpusLike;
            } else if (corpusLike instanceof Array) {
                return new TextCorpus(corpusLike);
            }
        }
    }


    /**
     * Create a new `Corpus`.
     * @param {import("./TextCorpusLike")} text
     * One or more bodies of text to create a `Corpus` from.
     */
    constructor (text) {
        // Get the list of text entries.
        let entries = text;

        if (typeof entries === 'string') {
            entries = [ entries ];
        }

        // Initialize the `Array` aspect of the `Corpus`.
        super(entries);

        // Populate the caches.
        this.longestWord();
        this.uniqueWords();

        // Freeze the object once the caches are populated.
        Object.freeze(this);
    }


    /**
     * Get the longest word in the `Corpus`.
     * @returns {string}
     * The longest word found within the `Corpus`.
     */
    longestWord () {
        return this._longestWord
            ??= getLongestWord(this._words);
    }


    /**
     * Get a list of all unique words within the `Corpus`.
     * @returns {string[]}
     * A list of all unique words found within the `Corpus`.
     */
    uniqueWords () {
        this._uniqueWords
            ??= getWordList(this._entries);

        const uniqueWords = structuredClone(this._uniqueWords);

        return uniqueWords;
    }
}


module.exports = TextCorpus;
