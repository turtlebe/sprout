import { AlertRuleType } from '@plentyag/core/src/types/environment';

import { mockMetrics } from '../test-helpers';

import { getAvailableAlertRuleTypes } from './get-available-alert-rule-types';

const [metric] = mockMetrics;

describe('getAvailableAlertRuleTypes', () => {
  it('returns non numerical only', () => {
    expect(getAvailableAlertRuleTypes({ ...metric, measurementType: 'BINARY_STATE' })).toEqual([
      AlertRuleType.nonNumerical,
    ]);
  });

  it('returns numerical types only', () => {
    expect(getAvailableAlertRuleTypes(metric)).toEqual([
      AlertRuleType.controlLimit,
      AlertRuleType.specLimit,
      AlertRuleType.specLimitDevices,
    ]);
  });
});
