import { mockAlertRules } from '@plentyag/app-environment/src/common/test-helpers';
import moment from 'moment';

import { getAlertRulesWithUpdatedStatus } from '.';

describe('getAlertRulesWithUpdatedStatus', () => {
  it('fetches empty array, because there is no differences in alert rule statuses', () => {
    expect(getAlertRulesWithUpdatedStatus(mockAlertRules, [...mockAlertRules])).toEqual([]);
  });

  it('fetches all alert rule statuses updated to off', () => {
    const turnedOffAlertRuleArray = mockAlertRules.map(alertRule => {
      return { ...alertRule, isEnabled: false };
    });
    expect(getAlertRulesWithUpdatedStatus(mockAlertRules, turnedOffAlertRuleArray)).toEqual(turnedOffAlertRuleArray);
  });

  it('fetches all alert rule statuses updated to snoozed', () => {
    const snoozeUntilDate = moment('2030-12-01T00:00:00Z');
    const snoozedAlertRuleArray = mockAlertRules.map(alertRule => {
      return { ...alertRule, snoozedUntil: snoozeUntilDate.toISOString() };
    });
    expect(getAlertRulesWithUpdatedStatus(mockAlertRules, snoozedAlertRuleArray)).toEqual(snoozedAlertRuleArray);
  });

  it('fetches single alert rule status changed to off', () => {
    const turnedOffSingleAlertRuleArray = mockAlertRules.map((alertRule, index) => {
      if (index == 0) {
        return { ...alertRule, isEnabled: false };
      } else {
        return { ...alertRule };
      }
    });
    expect(getAlertRulesWithUpdatedStatus(mockAlertRules, turnedOffSingleAlertRuleArray)).toEqual([
      { ...mockAlertRules[0], isEnabled: false },
    ]);
  });

  it('fetches single alert rule status changed to snoozed', () => {
    const snoozeUntilDate = moment('2030-12-01T00:00:00Z');
    const turnedOffSingleAlertRuleArray = mockAlertRules.map((alertRule, index) => {
      if (index == 1) {
        return { ...alertRule, snoozedUntil: snoozeUntilDate.toISOString() };
      } else {
        return { ...alertRule };
      }
    });
    expect(getAlertRulesWithUpdatedStatus(mockAlertRules, turnedOffSingleAlertRuleArray)).toEqual([
      { ...mockAlertRules[1], snoozedUntil: snoozeUntilDate.toISOString() },
    ]);
  });

  it('fetches multiple alert rule status changes, to off and snoozed', () => {
    const snoozeUntilDate = moment('2030-12-01T00:00:00Z');
    const turnedOffAndSnoozedAlertRuleArray = mockAlertRules.map((alertRule, index) => {
      if (index == 0) {
        return { ...alertRule, snoozedUntil: snoozeUntilDate.toISOString() };
      } else if (index == 1) {
        return { ...alertRule, isEnabled: false };
      } else {
        return { ...alertRule };
      }
    });
    expect(getAlertRulesWithUpdatedStatus(mockAlertRules, turnedOffAndSnoozedAlertRuleArray)).toEqual([
      { ...mockAlertRules[0], snoozedUntil: snoozeUntilDate.toISOString() },
      { ...mockAlertRules[1], isEnabled: false },
    ]);
  });
});
