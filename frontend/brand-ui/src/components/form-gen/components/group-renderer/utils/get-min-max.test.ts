import { getMinMax, MAX, MIN } from '.';

const defaultValue = { min: MIN, max: MAX };

describe('getMinMax', () => {
  it('get defaults', () => {
    expect(
      getMinMax({
        name: 'test',
        type: 'group',
        fields: () => [],
      })
    ).toEqual(defaultValue);

    expect(
      getMinMax({
        name: 'test',
        type: 'group',
        fields: [],
      })
    ).toEqual({ min: undefined, max: undefined });
  });

  it('get max value larger than min', () => {
    expect(
      getMinMax({
        name: 'test',
        type: 'group',
        min: 5,
        max: 4,
        fields: () => [],
      })
    ).toEqual(defaultValue);
  });

  it('get min and max values', () => {
    expect(
      getMinMax({
        name: 'test',
        type: 'group',
        min: 2,
        max: 4,
        fields: () => [],
      })
    ).toEqual({ min: 2, max: 4 });
  });

  it('clamps values', () => {
    expect(
      getMinMax({
        name: 'test',
        type: 'group',
        min: 1000,
        max: 10000,
        fields: () => [],
      })
    ).toEqual(defaultValue);

    expect(
      getMinMax({
        name: 'test',
        type: 'group',
        min: 10,
        max: 10000,
        fields: () => [],
      })
    ).toEqual(defaultValue);

    expect(
      getMinMax({
        name: 'test',
        type: 'group',
        min: 1000,
        max: 1,
        fields: () => [],
      })
    ).toEqual(defaultValue);

    expect(
      getMinMax({
        name: 'test',
        type: 'group',
        min: -1,
        max: -2,
        fields: () => [],
      })
    ).toEqual(defaultValue);
  });
});
