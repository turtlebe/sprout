import { buildMetric } from '@plentyag/app-environment/src/common/test-helpers';

import { getUnitConfigMinMax } from './get-unit-config-min-max';

describe('getUnitConfigMinMax', () => {
  it('returns NaN-NaN', () => {
    expect(getUnitConfigMinMax([])).toEqual({ min: NaN, max: NaN });
    expect(getUnitConfigMinMax([null])).toEqual({ min: NaN, max: NaN });
  });

  it("returns min/max based on the Metrics' unit configs", () => {
    const metrics = [
      buildMetric({ unitConfig: { min: 0, max: 10 } }),
      buildMetric({ unitConfig: { min: -10, max: 5 } }),
    ];

    expect(getUnitConfigMinMax(metrics)).toEqual({ min: -10, max: 10 });
  });
});
