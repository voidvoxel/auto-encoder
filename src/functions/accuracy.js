const { NeuralNetwork } = require("brain.js");


const { writeFileSync } = require('fs');


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
        return accuracyNeuralNetwork(
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
        const sampleAccuracy = _accuracyNeuralNetwork(
            model,
            sample
        );

        accuracy += sampleAccuracy;
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

    const output = model.run(input);

    let accuracy = 0;

    for (
        let i = 0;
        i < output.length;
        i++
    ) {
        const roundedOutput = Math.round(output[i]);

        const isCorrect = roundedOutput === expected[i];

        if (isCorrect) {
            accuracy += 1;
        }
    }

    accuracy /= output.length;

    return Number.isNaN(accuracy) ? 0 : accuracy;
}


module.exports = accuracy;
