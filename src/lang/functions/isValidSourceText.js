function isValidSourceText (text) {
    if (typeof text === 'string') {
        return true;
    }

    if (typeof text === 'object') {
        if (
            text instanceof Array
                && typeof text.flat(Number.POSITIVE_INFINITY)[0]
                    === 'string'
            ) {
            return true;
        }
    }

    return false;
}


module.exports = isValidSourceText;
