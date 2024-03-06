import { AlertRuleType } from '@plentyag/core/src/types/environment';

import { mockAlertRules } from '../test-helpers';

import { sortByAlertRuleType } from './sort-by-alert-rule-type';

const specLimit = mockAlertRules.find(alertRule => alertRule.alertRuleType === AlertRuleType.specLimit);
const specLimitDevices = mockAlertRules.find(alertRule => alertRule.alertRuleType === AlertRuleType.specLimitDevices);
const controlLimit = mockAlertRules.find(alertRule => alertRule.alertRuleType === AlertRuleType.controlLimit);

describe('sortByAlertRuleType', () => {
  it('sorts the AlertRules by AlertRuleType', () => {
    expect([controlLimit, specLimitDevices, specLimit].sort(sortByAlertRuleType)).toEqual([
      specLimit,
      specLimitDevices,
      controlLimit,
    ]);
  });
});
