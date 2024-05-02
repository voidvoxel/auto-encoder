const { TextCorpus } = require("../..");

const { NaturalTextEncoder } = require("../..").lang;


test(
    "Compress natural text by extracting features",
    async () => {
        const sentences = [
            "hello world",
            "this is an example",
            "how are you feeling",
            "my name is ashlynne",
            "how was your day been",
            "i like bread",
            "turtles are cute",
            "i love turtles"
        ];

        const corpus = TextCorpus.from(sentences);

        const encoder = new NaturalTextEncoder();

        // The desired accuracy to reach by the end of training.
        const accuracy = 0.7;
        // The number of attempts to reach the desired accuracy.
        const attempts = 10;
        // The number of iterations per attempt.
        const iterations = 100;

        const trainingResults = await encoder.train(
            sentences,
            {
                accuracy,
                attempts,
                iterations
            }
        );

        const actualAccuracy = trainingResults.accuracy;
        const actualAttempts = trainingResults.attempts;

        expect(actualAccuracy).toBeGreaterThanOrEqual(accuracy);
        expect(actualAttempts).toBeLessThanOrEqual(attempts);
    },
    20000
);
