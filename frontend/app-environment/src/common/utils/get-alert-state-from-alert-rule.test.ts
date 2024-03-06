import { mockAlertRules } from '@plentyag/app-environment/src/common/test-helpers';
import { AlertState } from '@plentyag/core/src/types/environment';
import moment from 'moment';

import { getAlertStateFromAlertRule } from '.';

const [alertRule] = mockAlertRules;

describe('getAlertStateFromAlertRule', () => {
  it('returns AlertState.on', () => {
    expect(getAlertStateFromAlertRule(undefined)).toBe(null);
    expect(getAlertStateFromAlertRule(null)).toBe(null);
    expect(getAlertStateFromAlertRule(alertRule)).toBe(AlertState.on);
    expect(getAlertStateFromAlertRule({ ...alertRule, snoozedUntil: '1999-01-01T00:00:00Z' })).toBe(AlertState.on);
  });

  it('returns AlertState.off', () => {
    expect(getAlertStateFromAlertRule({ ...alertRule, isEnabled: false })).toBe(AlertState.off);
  });

  it('returns AlertState.snoozed', () => {
    expect(getAlertStateFromAlertRule({ ...alertRule, snoozedUntil: moment().add(1, 'day').format() })).toBe(
      AlertState.snoozed
    );
  });
});
