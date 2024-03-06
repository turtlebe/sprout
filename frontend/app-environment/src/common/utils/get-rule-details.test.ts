import { buildAlertRule, buildMetric } from '../test-helpers';

import { getNumericalRuleDetails, getRuleDetails } from './get-rule-details';

const unitSymbol = 'C';
const metric = buildMetric({
  measurementType: 'TEMPERATURE',
  alertRules: [buildAlertRule({ rules: [{ time: 0, gte: 10, lte: 20 }] })],
});
const nonNumericalMetric = buildMetric({
  measurementType: 'BINARY_STATE',
  alertRules: [buildAlertRule({ rules: [{ time: 0, eq: '1' }] })],
});
const at = new Date();

describe('getNumericalRuleDetails', () => {
  it('renders with X', () => {
    expect(getNumericalRuleDetails({ time: 0, gte: 5 }, 'C')).toBe('5 C (min) >= X (value)');
    expect(getNumericalRuleDetails({ time: 0, lte: 10 }, 'C')).toBe('X (value) <= 10 C (max)');
    expect(getNumericalRuleDetails({ time: 0, gte: 5, lte: 10 }, 'C')).toBe('5 C (min) >= X (value) <= 10 C (max)');
  });

  it('renders with a value', () => {
    expect(getNumericalRuleDetails({ time: 0, gte: 5 }, 'C', '20')).toBe('5 C (min) >= 20 (value)');
    expect(getNumericalRuleDetails({ time: 0, lte: 10 }, 'C', '20')).toBe('20 (value) <= 10 C (max)');
    expect(getNumericalRuleDetails({ time: 0, gte: 5, lte: 10 }, 'C', '20')).toBe(
      '5 C (min) >= 20 (value) <= 10 C (max)'
    );
  });
});

describe('getRuleDetails', () => {
  it('renders blank', () => {
    expect(getRuleDetails({ metric, alertRule: { ...metric.alertRules[0], rules: [] }, at, unitSymbol })).toBe('');
  });

  it('renders a spec for the current numeric rule', () => {
    expect(getRuleDetails({ metric, alertRule: metric.alertRules[0], at, unitSymbol })).toBe(
      '10 C (min) >= X (value) <= 20 C (max)'
    );
  });

  it('renders a spec for the current numeric rule (with gte only)', () => {
    expect(
      getRuleDetails({ metric, alertRule: buildAlertRule({ rules: [{ time: 0, gte: 400 }] }), at, unitSymbol })
    ).toBe('400 C (min) >= X (value)');
  });

  it('renders a spec for the current numeric rule (with lte only)', () => {
    expect(
      getRuleDetails({ metric, alertRule: buildAlertRule({ rules: [{ time: 0, lte: 400 }] }), at, unitSymbol })
    ).toBe('X (value) <= 400 C (max)');
  });

  it('renders a spec for the current non-numeric rule', () => {
    const metric = nonNumericalMetric;
    expect(getRuleDetails({ metric, alertRule: metric.alertRules[0], at, unitSymbol })).toBe('Equals to 1');
  });
});
