import { buildWidget } from '@plentyag/app-environment/src/common/test-helpers';

import { getGridEmptySlots } from './get-grid-empty-slots';

const widgets = [
  buildWidget({ rowStart: 1, colStart: 1, rowEnd: 2, colEnd: 2 }),
  buildWidget({ rowStart: 2, colStart: 1, rowEnd: 3, colEnd: 2 }),
];

describe('getGridEmptySlots', () => {
  it('returns an empty array when current widget is undefined', () => {
    expect(getGridEmptySlots(null, widgets)).toEqual([]);
  });

  it('returns an array of available slots', () => {
    expect(getGridEmptySlots(widgets[0], widgets)).toEqual([
      expect.objectContaining({ rowStart: 1, colStart: 2, rowEnd: 2, colEnd: 3 }),
      expect.objectContaining({ rowStart: 2, colStart: 2, rowEnd: 3, colEnd: 3 }),
      expect.objectContaining({ rowStart: 3, colStart: 1, rowEnd: 4, colEnd: 2 }),
      expect.objectContaining({ rowStart: 3, colStart: 2, rowEnd: 4, colEnd: 3 }),
    ]);
  });
});
