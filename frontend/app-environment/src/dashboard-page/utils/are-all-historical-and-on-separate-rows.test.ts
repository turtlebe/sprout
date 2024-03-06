import { buildWidget } from '@plentyag/app-environment/src/common/test-helpers';
import { WidgetType } from '@plentyag/core/src/types/environment';

import { areAllHistoricalAndOnSeparateRows } from './are-all-historical-and-on-separate-rows';

describe('areAllHistoricalAndOnSeparateRows', () => {
  it('returns false', () => {
    expect(areAllHistoricalAndOnSeparateRows(undefined)).toBe(false);

    expect(areAllHistoricalAndOnSeparateRows([])).toBe(false);

    expect(
      areAllHistoricalAndOnSeparateRows([
        buildWidget({ widgetType: WidgetType.historical }),
        buildWidget({ widgetType: WidgetType.liveGroup }),
      ])
    ).toBe(false);

    expect(
      areAllHistoricalAndOnSeparateRows([
        buildWidget({ widgetType: WidgetType.historical, rowStart: 1, rowEnd: 2, colStart: 1, colEnd: 2 }),
        buildWidget({ widgetType: WidgetType.historical, rowStart: 1, rowEnd: 2, colStart: 2, colEnd: 3 }),
      ])
    ).toBe(false);
  });

  it('returns true', () => {
    expect(
      areAllHistoricalAndOnSeparateRows([
        buildWidget({ widgetType: WidgetType.historical, rowStart: 1, rowEnd: 2, colStart: 1, colEnd: 2 }),
        buildWidget({ widgetType: WidgetType.historical, rowStart: 2, rowEnd: 3, colStart: 2, colEnd: 3 }),
      ])
    ).toBe(true);
  });
});
