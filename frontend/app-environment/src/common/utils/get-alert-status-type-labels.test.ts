import { mockAlertRules } from '@plentyag/app-environment/src/common/test-helpers';
import { DEFAULT_DATETIME_MOMENT_FORMAT as FORMAT } from '@plentyag/brand-ui/src/material-ui/pickers/datetime-picker';
import { AlertStatusType } from '@plentyag/core/src/types/environment';
import moment from 'moment';

import { getAlertStatusTypeLabels } from './get-alert-status-type-labels';

const [alertRule1Enabled, alertRule2Enabled, alertRule3Enabled] = mockAlertRules;

const [alertRule1Disabled, alertRule2Disabled, alertRule3Disabled] = mockAlertRules.map(alertRule => {
  return { ...alertRule, isEnabled: false };
});

const fiveDaysFromNow = moment().add(5, 'days');

const [alertRule1Snoozed, alertRule2Snoozed, alertRule3Snoozed] = mockAlertRules.map(alertRule => {
  return { ...alertRule, snoozedUntil: fiveDaysFromNow.toISOString() };
});

describe('getAlertStatusTypeLabels', () => {
  it('returns an empty string', () => {
    expect(getAlertStatusTypeLabels([])).toBe('');
  });

  it('returns On (3)', () => {
    expect(getAlertStatusTypeLabels([alertRule1Enabled, alertRule2Enabled, alertRule3Enabled])).toBe(
      `${AlertStatusType.on} (3)`
    );
  });

  it('returns On (2) Off (2)', () => {
    expect(
      getAlertStatusTypeLabels([alertRule1Enabled, alertRule2Enabled, alertRule1Disabled, alertRule2Disabled])
    ).toBe(`${AlertStatusType.on} (2), ${AlertStatusType.off} (2)`);
  });

  it(`returns Snoozed until ${moment(fiveDaysFromNow).format(FORMAT)}`, () => {
    expect(getAlertStatusTypeLabels([alertRule1Snoozed])).toBe(
      `${AlertStatusType.snoozed} until ${moment(fiveDaysFromNow).format(FORMAT)}`
    );
  });

  it('returns Snoozed (2)', () => {
    expect(getAlertStatusTypeLabels([alertRule1Snoozed, alertRule2Snoozed])).toBe(`${AlertStatusType.snoozed} (2)`);
  });

  it(`returns On, Off, Snoozed until ${moment(fiveDaysFromNow).format(FORMAT)}`, () => {
    expect(getAlertStatusTypeLabels([alertRule1Enabled, alertRule1Disabled, alertRule1Snoozed])).toBe(
      `${AlertStatusType.on}, ${AlertStatusType.off}, ${AlertStatusType.snoozed} until ${moment(fiveDaysFromNow).format(
        FORMAT
      )}`
    );
  });

  it('returns On, Off, Snoozed (2)', () => {
    expect(
      getAlertStatusTypeLabels([alertRule3Enabled, alertRule3Disabled, alertRule3Snoozed, alertRule2Snoozed])
    ).toBe(`${AlertStatusType.on}, ${AlertStatusType.off}, ${AlertStatusType.snoozed} (2)`);
  });
});
