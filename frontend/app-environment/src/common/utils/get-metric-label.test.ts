import { mockMetrics } from '@plentyag/app-environment/src/common/test-helpers';

import { getMetricLabel } from './get-metric-label';

const [metric] = mockMetrics;

describe('getMetricLabel', () => {
  it('returns the shortened path, the measurement type and the observation name', () => {
    expect(getMetricLabel(metric)).toBe('LAR1 - Temperature - AirTemperature');
  });
});
