import { buildWidget } from '../test-helpers';

import { getNextWidgetPosition } from './get-next-widget-position';

const widgets = [buildWidget({ rowStart: 1, colStart: 1, rowEnd: 2, colEnd: 2 })];

describe('getNextWidgetPosition', () => {
  it('returns the first row', () => {
    expect(getNextWidgetPosition(undefined)).toEqual({ rowStart: 1, colStart: 1, rowEnd: 2, colEnd: 2 });
    expect(getNextWidgetPosition([])).toEqual({ rowStart: 1, colStart: 1, rowEnd: 2, colEnd: 2 });
  });

  it('returns coordinates for the next row', () => {
    expect(getNextWidgetPosition(widgets)).toEqual({ rowStart: 2, colStart: 1, rowEnd: 3, colEnd: 2 });
  });
});
