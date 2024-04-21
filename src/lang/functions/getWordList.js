function getWordList (corpus) {
    if (typeof corpus === 'string') {
        corpus = [ corpus ];
    }

    let entries = corpus;

    if (entries.constructor.name = 'TextCorpus') {
        entries = entries.entries();
    }

    let wordMap = {};

    // Split each sentence into an array of words.
    entries = entries.map(
        (value) => value.split(' ')
    );

    for (let word of entries.flat(Number.POSITIVE_INFINITY)) {
        wordMap[word] = true;
    }

    const words = Object.keys(wordMap);

    return words;
}


module.exports = getWordList;
