import { buildMetric } from '@plentyag/app-environment/src/common/test-helpers';

import { isNumericalMetric } from './is-numerical-metric';

describe('isNumericalMetric', () => {
  it('returns false', () => {
    expect(isNumericalMetric(buildMetric({ measurementType: 'BINARY_STATE' }))).toBe(false);
    expect(isNumericalMetric(buildMetric({ measurementType: 'CATEGORICAL_STATE' }))).toBe(false);
    expect(isNumericalMetric(buildMetric({ measurementType: 'UNKNOWN_MEASUREMENT_TYPE' }))).toBe(false);
  });

  it('returns true', () => {
    expect(isNumericalMetric(buildMetric({ measurementType: 'TEMPERATURE' }))).toBe(true);
  });
});
