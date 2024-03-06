import { getArrayWithoutIndex, getArrayWithUpdatedIndex } from './get-array-with-updated-index';

describe('getArrayWithUpdatedIndex', () => {
  it('returns a copy of the array with a modified index', () => {
    const array = ['1', '2', '3'];
    const result = getArrayWithUpdatedIndex(array, '3', 1);

    expect(result).not.toBe(array);
    expect(result).toEqual(['1', '3', '3']);
  });
});

describe('getArrayWithoutIndex', () => {
  it('returns a copy of the array and removes an index', () => {
    const array = ['1', '2', '3'];
    const result = getArrayWithoutIndex(array, 1);

    expect(result).not.toBe(array);
    expect(result).toEqual(['1', '3']);
  });

  it('returns a copy of the array and removes the index', () => {
    const array = ['1', '2', '3'];
    const result = getArrayWithoutIndex(array, 0);

    expect(result).not.toBe(array);
    expect(result).toEqual(['2', '3']);
  });
});
