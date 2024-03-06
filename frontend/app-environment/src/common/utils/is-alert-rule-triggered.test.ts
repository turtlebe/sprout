import moment from 'moment';

import { buildAlertRule, mockAlertRules } from '../test-helpers';

import { isAlertRuleTriggered, isAlertRuleTriggeredNonNumerical } from './is-alert-rule-triggered';

const [alertRule] = mockAlertRules;
const at = moment(alertRule.startsAt).add(alertRule.rules[1].time, 'seconds').toDate();

describe('isAlertRuleTriggered', () => {
  it('returns null', () => {
    expect(isAlertRuleTriggered({ ...alertRule, rules: [] }, at, 10)).toBe(null);
  });

  it('returns true', () => {
    expect(isAlertRuleTriggered(alertRule, at, alertRule.rules[1].gte - 1)).toBe(true);
  });

  it('returns false', () => {
    expect(isAlertRuleTriggered(alertRule, at, alertRule.rules[1].gte)).toBe(false);
  });

  it('supports one sided rules', () => {
    const alertRule1 = buildAlertRule({ rules: [{ time: 0, gte: 0 }] });
    expect(isAlertRuleTriggered(alertRule1, at, 0)).toBe(false);
    expect(isAlertRuleTriggered(alertRule1, at, -1)).toBe(true);

    const alertRule2 = buildAlertRule({ rules: [{ time: 0, lte: 400 }] });
    expect(isAlertRuleTriggered(alertRule2, at, 400)).toBe(false);
    expect(isAlertRuleTriggered(alertRule2, at, 401)).toBe(true);
  });
});

describe('isAlertRuleTriggeredNonNumerical', () => {
  describe('eq', () => {
    const alertRule = buildAlertRule({ rules: [{ time: 0, eq: 'a' }] });

    it('returns true', () => {
      expect(isAlertRuleTriggeredNonNumerical(alertRule, at, 'a')).toBe(true);
    });

    it('returns false', () => {
      expect(isAlertRuleTriggeredNonNumerical(alertRule, at, 'b')).toBe(false);
    });
  });

  describe('neq', () => {
    const alertRule = buildAlertRule({ rules: [{ time: 0, neq: 'a' }] });

    it('returns true', () => {
      expect(isAlertRuleTriggeredNonNumerical(alertRule, at, 'b')).toBe(true);
    });

    it('returns false', () => {
      expect(isAlertRuleTriggeredNonNumerical(alertRule, at, 'a')).toBe(false);
    });
  });

  describe('in', () => {
    const alertRule = buildAlertRule({ rules: [{ time: 0, _in: ['a', 'b'] }] });

    it('returns true', () => {
      expect(isAlertRuleTriggeredNonNumerical(alertRule, at, 'a')).toBe(true);
      expect(isAlertRuleTriggeredNonNumerical(alertRule, at, 'b')).toBe(true);
    });

    it('returns false', () => {
      expect(isAlertRuleTriggeredNonNumerical(alertRule, at, 'c')).toBe(false);
    });
  });

  describe('nin', () => {
    const alertRule = buildAlertRule({ rules: [{ time: 0, nin: ['a', 'b'] }] });

    it('returns true', () => {
      expect(isAlertRuleTriggeredNonNumerical(alertRule, at, 'c')).toBe(true);
    });

    it('returns false', () => {
      expect(isAlertRuleTriggeredNonNumerical(alertRule, at, 'a')).toBe(false);
      expect(isAlertRuleTriggeredNonNumerical(alertRule, at, 'b')).toBe(false);
    });
  });

  describe('contains', () => {
    const alertRule = buildAlertRule({ rules: [{ time: 0, contains: 'moonlight' }] });

    it('returns true', () => {
      expect(isAlertRuleTriggeredNonNumerical(alertRule, at, 'moon')).toBe(true);
      expect(isAlertRuleTriggeredNonNumerical(alertRule, at, 'light')).toBe(true);
    });

    it('returns false', () => {
      expect(isAlertRuleTriggeredNonNumerical(alertRule, at, 'sun')).toBe(false);
    });
  });

  describe('ncontains', () => {
    const alertRule = buildAlertRule({ rules: [{ time: 0, ncontains: 'moonlight' }] });

    it('returns true', () => {
      expect(isAlertRuleTriggeredNonNumerical(alertRule, at, 'sun')).toBe(true);
    });

    it('returns false', () => {
      expect(isAlertRuleTriggeredNonNumerical(alertRule, at, 'moon')).toBe(false);
      expect(isAlertRuleTriggeredNonNumerical(alertRule, at, 'light')).toBe(false);
    });
  });
});
