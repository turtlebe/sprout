import { replaceTokens } from '.';

describe('replaceTokens', () => {
  it('should replace token with correct data', () => {
    // ARRANGE
    const mockString = 'My phone is {color}';
    const mockData = { color: 'black' };

    // ACT
    const result = replaceTokens(mockString, token => mockData[token]);

    // ASSERT
    expect(result).toEqual('My phone is black');
  });

  it('should support different open and closing token options', () => {
    // ARRANGE
    const mockString = 'My phone is <<color>>';
    const mockData = { color: 'blue' };
    const mockOptions = {
      open: '<<',
      close: '>>',
    };

    // ACT
    const result = replaceTokens(mockString, token => mockData[token], mockOptions);

    // ASSERT
    expect(result).toEqual('My phone is blue');
  });
});
