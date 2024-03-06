import { mockObservationStats } from '@plentyag/app-environment/src/common/test-helpers';

import { convertUnitForObservationStats } from '.';

const conversionFn = values => values * 10;

describe('convertUnitForObservationStats', () => {
  it('converts the numeric values using the conversion function', () => {
    const convertedObservationStats = convertUnitForObservationStats(conversionFn)(mockObservationStats);

    expect(convertedObservationStats.mean).toBe(mockObservationStats.mean * 10);
    expect(convertedObservationStats.median).toBe(mockObservationStats.median * 10);
    expect(convertedObservationStats.min).toBe(mockObservationStats.min * 10);
    expect(convertedObservationStats.max).toBe(mockObservationStats.max * 10);
  });
});
