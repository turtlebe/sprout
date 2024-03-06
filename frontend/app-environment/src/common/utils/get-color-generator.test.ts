import { colors, getColorGenerator, getScheduleColorGenerator, scheduleColors } from './get-color-generator';

describe('getColorGenerator', () => {
  it('returns the next color and loops through over and over', () => {
    const generator = getColorGenerator();

    colors.forEach(color => {
      expect(generator.next().value).toEqual(color);
    });
    colors.forEach(color => {
      expect(generator.next().value).toEqual(color);
    });
  });

  it('returns two generators independent from one another', () => {
    const generator1 = getColorGenerator();
    const generator2 = getColorGenerator();

    expect(generator1.next().value).toEqual(colors[0]);
    expect(generator1.next().value).toEqual(colors[1]);

    expect(generator2.next().value).toEqual(colors[0]);
    expect(generator2.next().value).toEqual(colors[1]);
  });
});

describe('getScheduleColorGenerator', () => {
  it('returns the next color and loops through over and over', () => {
    const generator = getScheduleColorGenerator();

    scheduleColors.forEach(color => {
      expect(generator.next().value).toEqual(color);
    });
    scheduleColors.forEach(color => {
      expect(generator.next().value).toEqual(color);
    });
  });

  it('returns two generators independent from one another', () => {
    const generator1 = getScheduleColorGenerator();
    const generator2 = getScheduleColorGenerator();

    expect(generator1.next().value).toEqual(scheduleColors[0]);
    expect(generator1.next().value).toEqual(scheduleColors[1]);

    expect(generator2.next().value).toEqual(scheduleColors[0]);
    expect(generator2.next().value).toEqual(scheduleColors[1]);
  });
});
