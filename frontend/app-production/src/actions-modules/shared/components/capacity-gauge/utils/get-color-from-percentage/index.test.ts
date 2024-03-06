import { getColorFromPercentage } from '.';

describe('getColorFromPercentage', () => {
  it('returns correct color from percentage ', () => {
    // ACT
    const result1 = getColorFromPercentage(101);
    const result2 = getColorFromPercentage(100);
    const result3 = getColorFromPercentage(95);
    const result4 = getColorFromPercentage(82);
    const result5 = getColorFromPercentage(50);
    const result6 = getColorFromPercentage(0);

    // ASSERT
    expect(result1).toEqual('#9C072A');
    expect(result2).toEqual('#9C072A');
    expect(result3).toEqual('#F58604');
    expect(result4).toEqual('#FFD57E');
    expect(result5).toEqual('#15C370');
    expect(result6).toEqual('#15C370');
  });
});
