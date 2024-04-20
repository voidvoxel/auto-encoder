function getWordList (corpus) {
    if (typeof corpus === 'string') {
        corpus = [ corpus ];
    }

    // Split each sentence into an array of words.
    corpus = corpus.map(
        (value) => value.split(' ')
    );

    let words = {};

    for (let word of corpus.flat()) {
        words[word] = true;
    }

    words = Object.keys(words);

    return words;
}


module.exports = getWordList;
