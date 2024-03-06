import { EMPTY_CONTAINER } from '../types';

import { getSortedCrops } from '.';

describe('getSortedCrops', () => {
  it('sorts the items putting empty container at the front', () => {
    expect(getSortedCrops(['CRC', 'BAC', EMPTY_CONTAINER])).toEqual([EMPTY_CONTAINER, 'BAC', 'CRC']);
  });
});
