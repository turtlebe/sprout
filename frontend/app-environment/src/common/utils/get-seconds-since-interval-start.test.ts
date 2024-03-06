import moment from 'moment';

import { mockAlertRules } from '../test-helpers';

import { getSecondsSinceIntervalStart } from './get-seconds-since-interval-start';

const [alertRule] = mockAlertRules;

describe('getSecondsSinceIntervalStart', () => {
  it('returns null', () => {
    expect(getSecondsSinceIntervalStart(null, null)).toBeNull();
    expect(getSecondsSinceIntervalStart(alertRule, null)).toBeNull();
    expect(getSecondsSinceIntervalStart(null, new Date())).toBeNull();
    expect(getSecondsSinceIntervalStart({ ...alertRule, repeatInterval: undefined }, new Date())).toBeNull();
  });

  it('returns the seconds since starts at', () => {
    expect(getSecondsSinceIntervalStart(alertRule, moment(alertRule.startsAt).add(3600, 'seconds').toDate())).toBe(
      3600
    );
    expect(getSecondsSinceIntervalStart(alertRule, moment(alertRule.startsAt).add(1800, 'seconds').toDate())).toBe(
      1800
    );
    expect(getSecondsSinceIntervalStart(alertRule, moment(alertRule.startsAt).add(-1800, 'seconds').toDate())).toBe(
      -1800
    );
  });
});
