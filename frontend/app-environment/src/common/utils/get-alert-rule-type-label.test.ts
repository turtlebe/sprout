import { AlertRuleType } from '@plentyag/core/src/types/environment';

import { getAlertRuleTypeLabel } from './get-alert-rule-type-label';

describe('getAlertRuleTypeLabel', () => {
  it('returns Spec Limits', () => {
    expect(getAlertRuleTypeLabel(AlertRuleType.specLimit)).toBe('Spec Limits');
  });

  it('returns Spec Limits (Devices)', () => {
    expect(getAlertRuleTypeLabel(AlertRuleType.specLimitDevices)).toBe('Spec Limits (Devices)');
  });

  it('returns Control Limits', () => {
    expect(getAlertRuleTypeLabel(AlertRuleType.controlLimit)).toBe('Control Limits');
  });

  it('returns Non numerical', () => {
    expect(getAlertRuleTypeLabel(AlertRuleType.nonNumerical)).toBe('Non Numerical Alert');
  });

  describe('when truncated', () => {
    it('returns Spec Limits', () => {
      expect(getAlertRuleTypeLabel(AlertRuleType.specLimit, true)).toBe('SL');
    });

    it('returns Spec Limits (Devices)', () => {
      expect(getAlertRuleTypeLabel(AlertRuleType.specLimitDevices, true)).toBe('SL (D.)');
    });

    it('returns Control Limits', () => {
      expect(getAlertRuleTypeLabel(AlertRuleType.controlLimit, true)).toBe('CL');
    });

    it('returns Non numerical', () => {
      expect(getAlertRuleTypeLabel(AlertRuleType.nonNumerical, true)).toBe('NNA');
    });
  });
});
