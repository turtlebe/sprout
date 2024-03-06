import { mockAlertRules } from '@plentyag/app-environment/src/common/test-helpers';
import { ONE_DAY } from '@plentyag/app-environment/src/common/utils/constants';
import { AlertRule } from '@plentyag/core/src/types/environment';
import { omit } from 'lodash';

import { copyAlertRule, DEFAULT_INTERPOLATION_TYPE } from './copy-alert-rule';

const [alertRule] = mockAlertRules;

const sortedRules = [
  { time: 0, min: 1, max: 2 },
  { time: 1, min: 2, max: 3 },
];
const unsortedRules = [
  { time: 1, min: 2, max: 3 },
  { time: 0, min: 1, max: 2 },
];
const sortedAlertRule = { ...alertRule, rules: sortedRules };
const unsortedAlertRule = { ...alertRule, rules: unsortedRules };

describe('copyAlertRule', () => {
  it('copies the AlertRule', () => {
    const alertRuleCopy = copyAlertRule({ alertRule, newRules: sortedRules });

    expect(alertRuleCopy).toEqual(sortedAlertRule);
  });

  it('sorts the rules', () => {
    const alertRuleCopy = copyAlertRule({ alertRule, newRules: unsortedRules });

    expect(alertRuleCopy).toEqual(sortedAlertRule);
  });

  it('does not sort the rules', () => {
    const alertRuleCopy = copyAlertRule({ alertRule, newRules: unsortedRules, sortRules: false });

    expect(alertRuleCopy).toEqual(unsortedAlertRule);
  });

  it('defaults interpolationType', () => {
    const alertRuleWithoutInterpolationType = omit<AlertRule>(alertRule, ['interpolationType']) as AlertRule;
    const alertRuleCopy = copyAlertRule({ alertRule: alertRuleWithoutInterpolationType, newRules: [] });

    expect(alertRuleCopy.interpolationType).toBe(DEFAULT_INTERPOLATION_TYPE);
  });

  it('defaults repeatInterval', () => {
    const alertRuleWithoutRepeatInterval = omit<AlertRule>(alertRule, ['repeatInterval']) as AlertRule;
    const alertRuleCopy = copyAlertRule({ alertRule: alertRuleWithoutRepeatInterval, newRules: [] });

    expect(alertRuleCopy.repeatInterval).toBe(ONE_DAY);
  });

  it('creates a copy of the AlertRule and sorts its Rules', () => {
    const alertRuleCopy = copyAlertRule({ alertRule: unsortedAlertRule });

    expect(alertRuleCopy).toEqual(sortedAlertRule);
  });
});
