import { buildAlertRule, buildMetric } from '@plentyag/app-environment/src/common/test-helpers';

import { getRulesMinMax } from './get-rules-min-max';

describe('getRulesMinMax', () => {
  it('returns NaN-NaN', () => {
    expect(getRulesMinMax([])).toEqual({ min: NaN, max: NaN });
    expect(getRulesMinMax([null])).toEqual({ min: NaN, max: NaN });
  });

  it('returns min/max of the rules', () => {
    const metrics = [buildMetric({ alertRules: [buildAlertRule({ rules: [{ time: 0, gte: -10, lte: 10 }] })] })];

    expect(getRulesMinMax(metrics)).toEqual({ min: -10, max: 10 });
  });

  it('returns min/max of the rules based on the extra alertRules passed', () => {
    const metrics = [buildMetric({ alertRules: [] })];
    const alertRules = [buildAlertRule({ rules: [{ time: 0, gte: -20, lte: 20 }] })];

    expect(getRulesMinMax(metrics, alertRules)).toEqual({ min: -20, max: 20 });
  });
});
