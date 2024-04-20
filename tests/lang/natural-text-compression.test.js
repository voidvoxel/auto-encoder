const { NaturalTextEncoder } = require("../..").lang;


const corpus = [
    "hello world",
    "this is an example",
    "how are you feeling",
    "my name is ashlynne",
    "how was your day been",
    "i like bread",
    "turtles are cute",
    "i love turtles"
];


test(
    "Compress natural text by extracting features",
    () => {
        const encoder = new NaturalTextEncoder();

        encoder.train(
            corpus,
            {
                accuracy: 0.6
            }
        );

        const accuracy = encoder.accuracy(corpus);

        expect(accuracy).toBeGreaterThanOrEqual(0.6);
    }
)


test(
    "Compress a sentence of natural text",
    () => {
        const word = 'turtles';
        const sentence
            =  "hello world my name is ashlynne and i like turtles";

        const encoder = new NaturalTextEncoder();

        encoder.train(
            corpus,
            {
                accuracy: 0.8
            }
        );

        const encodedWord = encoder.encode(sentence);

        const decodedWord = encoder.decodeWord(word);

        expect(decodedWord).toBe(word);

        // const encodedSentence = encoder.encode(sentence);

        // const decodedSentence = encoder.decodeSentence(sentence);

        // expect(decodedSentence).toBe(sentence);

        // const accuracy = encoder.accuracy(corpus);

        // expect(accuracy).toBeGreaterThanOrEqual(0.6);
    }
)
