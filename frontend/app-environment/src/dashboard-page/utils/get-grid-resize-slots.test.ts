import { buildWidget } from '@plentyag/app-environment/src/common/test-helpers';

import { getGridResizeSlots } from './get-grid-resize-slots';

describe('getGridResizeSlots', () => {
  it('returns an empty array when the current widget is undefined', () => {
    const widgets = [buildWidget({ rowStart: 1, colStart: 1, rowEnd: 2, colEnd: 2 })];

    expect(getGridResizeSlots(null, widgets)).toEqual([]);
  });

  it('returns an array of available slots', () => {
    const widgets = [
      buildWidget({ rowStart: 1, colStart: 1, rowEnd: 2, colEnd: 2 }),
      buildWidget({ rowStart: 2, colStart: 2, rowEnd: 3, colEnd: 3 }),
    ];

    expect(getGridResizeSlots(widgets[0], widgets)).toEqual([
      { id: '1122', rowStart: 1, colStart: 1, rowEnd: 2, colEnd: 2 },
      { id: '1223', rowStart: 1, colStart: 2, rowEnd: 2, colEnd: 3 },
      { id: '1324', rowStart: 1, colStart: 3, rowEnd: 2, colEnd: 4 },
    ]);
  });

  it('does not allow to resize over other widgets', () => {
    const widgets = [
      buildWidget({ rowStart: 1, colStart: 1, rowEnd: 2, colEnd: 2 }),
      buildWidget({ rowStart: 1, colStart: 2, rowEnd: 2, colEnd: 3 }),
    ];

    expect(getGridResizeSlots(widgets[0], widgets)).toEqual([
      { id: '1122', rowStart: 1, colStart: 1, rowEnd: 2, colEnd: 2 },
    ]);
  });
});
