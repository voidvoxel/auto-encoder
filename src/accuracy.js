const { NeuralNetwork } = require("brain.js");


function accuracy (
    model,
    data
) {
    const invalidModelErrorMessage
        = `Attempt to test accuracy of invalid model "${model}".`;

    if (typeof model !== 'object') {
        throw new Error(invalidModelErrorMessage);
    }

    if (typeof model.accuracy === 'function') {
        return model.accuracy(data);
    } else if (
        model instanceof NeuralNetwork
            || model instanceof NeuralNetworkGPU
    ) {
        return _accuracyNeuralNetwork(
            model,
            data
        );
    } else {
        throw new Error(invalidModelErrorMessage);
    }
}


function accuracyNeuralNetwork (
    model,
    data
) {
    let accuracy = 0.0;

    for (let sample of data) {
        accuracy += _accuracyNeuralNetwork(
            model,
            sample
        );
    }

    accuracy /= data.length;

    return accuracy;
}


function _accuracyNeuralNetwork (
    model,
    sample
) {
    const input = sample.input;
    const expected = sample.output;

    const encoded = model.encode(input);
    const decoded = model.decode(encoded);

    let accuracy = 0;

    for (
        let i = 0;
        i < decoded.length;
        i++
    ) {
        const decodedValue = Math.round(decoded[i]);

        const isCorrect = decodedValue === expected[i];

        if (isCorrect) {
            accuracy += 1;
        }
    }

    accuracy /= decoded.length;

    return accuracy;
}


module.exports = accuracy;
