import { AlertRuleType } from '@plentyag/core/src/types/environment';

import { buildAlertRule } from '../test-helpers';

import { getAlertRuleTypeLabels } from './get-alert-rule-type-labels';

describe('getAlertRuleTypeLabels', () => {
  it('returns an empty string', () => {
    expect(getAlertRuleTypeLabels([])).toBe('');
    expect(getAlertRuleTypeLabels(undefined)).toBe('');
    expect(getAlertRuleTypeLabels(null)).toBe('');
  });

  it('returns Spec Limits', () => {
    expect(getAlertRuleTypeLabels([buildAlertRule({ alertRuleType: AlertRuleType.specLimit })])).toBe('Spec Limits');
  });

  it('returns Control Limits, Spec Limits', () => {
    expect(
      getAlertRuleTypeLabels([
        buildAlertRule({ alertRuleType: AlertRuleType.specLimit }),
        buildAlertRule({ alertRuleType: AlertRuleType.controlLimit }),
      ])
    ).toBe('Control Limits, Spec Limits');
  });

  it('returns Control Limits, Spec Limits (2)', () => {
    expect(
      getAlertRuleTypeLabels([
        buildAlertRule({ alertRuleType: AlertRuleType.specLimit }),
        buildAlertRule({ alertRuleType: AlertRuleType.specLimit }),
        buildAlertRule({ alertRuleType: AlertRuleType.controlLimit }),
      ])
    ).toBe('Control Limits, Spec Limits (2)');
  });

  it('returns Control Limits (4), Spec Limits (2), Spec Limits (Devices) (3)', () => {
    expect(
      getAlertRuleTypeLabels([
        buildAlertRule({ alertRuleType: AlertRuleType.specLimit }),
        buildAlertRule({ alertRuleType: AlertRuleType.specLimit }),
        buildAlertRule({ alertRuleType: AlertRuleType.specLimitDevices }),
        buildAlertRule({ alertRuleType: AlertRuleType.specLimitDevices }),
        buildAlertRule({ alertRuleType: AlertRuleType.specLimitDevices }),
        buildAlertRule({ alertRuleType: AlertRuleType.controlLimit }),
        buildAlertRule({ alertRuleType: AlertRuleType.controlLimit }),
        buildAlertRule({ alertRuleType: AlertRuleType.controlLimit }),
        buildAlertRule({ alertRuleType: AlertRuleType.controlLimit }),
      ])
    ).toBe('Control Limits (4), Spec Limits (2), Spec Limits (Devices) (3)');
  });
});
