
const {getCheapCanCombo} = require('./paintCalculator');

test('1 Rectangle Wall, Matt white, Dulux', () => {
    const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    getCheapCanCombo(100, 'Dulux', 'Matt White');
    expect(logSpy).toHaveBeenCalledWith(expect.stringMatching('Minimum cost to paint your wall: £24'));
    logSpy.mockRestore();
});

