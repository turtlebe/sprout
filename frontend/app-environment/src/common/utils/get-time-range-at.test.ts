import { InterpolationType } from '@plentyag/core/src/types/environment';
import moment from 'moment';

import { mockAlertRules } from '../test-helpers';

import { getRuleAt } from './get-time-range-at';

const [alertRule] = mockAlertRules;
const [firstRule, lastRule] = alertRule.rules;

describe('getRuleAt', () => {
  it('returns null', () => {
    expect(getRuleAt(undefined, undefined)).toBeNull();
    expect(getRuleAt(undefined, new Date())).toBeNull();
    expect(getRuleAt({ ...alertRule, repeatInterval: undefined }, new Date())).toBeNull();
    expect(getRuleAt({ ...alertRule, rules: undefined }, new Date())).toBeNull();
    expect(getRuleAt({ ...alertRule, rules: [] }, new Date())).toBeNull();
  });

  it('returns the first rule when `at` is after the first time rule', () => {
    expect(
      getRuleAt(
        alertRule,
        moment(alertRule.startsAt)
          .add(firstRule.time + 1, 'seconds')
          .toDate()
      )
    ).toEqual(firstRule);
  });

  it('returns the last rule when `at` is after the last time rule', () => {
    expect(
      getRuleAt(
        alertRule,
        moment(alertRule.startsAt)
          .add(lastRule.time + 1, 'seconds')
          .toDate()
      )
    ).toEqual(lastRule);
  });

  it('returns the last rule when `at` is before the first time rule', () => {
    expect(
      getRuleAt(
        alertRule,
        moment(alertRule.startsAt)
          .add(firstRule.time - 1, 'seconds')
          .toDate()
      )
    ).toEqual(expect.objectContaining({ gte: lastRule.gte, lte: lastRule.lte }));
  });

  it('returns the last rule (with interpolation type equals to Linear)', () => {
    expect(
      getRuleAt(
        { ...alertRule, interpolationType: InterpolationType.linear },
        moment(alertRule.startsAt).add(lastRule.time, 'seconds').toDate()
      )
    ).toEqual(lastRule);
  });
});
