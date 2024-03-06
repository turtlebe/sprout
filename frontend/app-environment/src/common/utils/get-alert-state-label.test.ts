import { mockAlertRules } from '@plentyag/app-environment/src/common/test-helpers';
import { DEFAULT_DATETIME_MOMENT_FORMAT as FORMAT } from '@plentyag/brand-ui/src/material-ui/pickers/datetime-picker';
import { AlertState } from '@plentyag/core/src/types/environment';
import moment from 'moment';

import { getAlertStateLabel } from '.';

const [alertRule] = mockAlertRules;
const snoozedUntil = moment().add(1, 'day').format();

describe('getAlertStateLabel', () => {
  it('returns AlertState.on', () => {
    expect(getAlertStateLabel(undefined)).toBe(null);
    expect(getAlertStateLabel(null)).toBe(null);
    expect(getAlertStateLabel(alertRule)).toBe(AlertState.on);
    expect(getAlertStateLabel({ ...alertRule, snoozedUntil: '1999-01-01T00:00:00Z' })).toBe(AlertState.on);
  });

  it('returns AlertState.off', () => {
    expect(getAlertStateLabel({ ...alertRule, isEnabled: false })).toBe(AlertState.off);
  });

  it('returns AlertState.snoozed', () => {
    expect(getAlertStateLabel({ ...alertRule, snoozedUntil })).toBe(
      `Alerts Snoozed: ${moment(snoozedUntil).format(FORMAT)}`
    );
  });
});
