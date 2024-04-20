const { NaturalTextEncoder } = require("../..").lang;


test(
    "Compress natural text by extracting features",
    () => {
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

        const encoder = new NaturalTextEncoder();

        encoder.train(
            sentences,
            {
                accuracy: 0.6
            }
        );

        const accuracy = encoder.accuracy(sentences);

        expect(accuracy).toBeGreaterThanOrEqual(0.6);
    }
)
