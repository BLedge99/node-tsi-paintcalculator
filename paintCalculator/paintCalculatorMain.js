const readline = require('node:readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

const sides = { 'Rectangle': 2, 'Circle': 1, 'Triangle': 3 };
const shapes = ['Rectangle', 'Triangle', 'Circle'];

getQuote();

