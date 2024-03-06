import { mockAlertRules } from '@plentyag/app-environment/src/common/test-helpers';
import { omit } from 'lodash';

import { convertUnitForAlertRule } from '.';

const [alertRule] = mockAlertRules;
const conversionFn = values => values * 10;

describe('convertUnitForAlertRule', () => {
  it('does not modify the alertRule when rules are null', () => {
    expect(convertUnitForAlertRule(conversionFn)({ ...alertRule, rules: null })).toHaveProperty('rules', null);
  });

  it('does not modify the alertRule when rules are undefined', () => {
    expect(convertUnitForAlertRule(conversionFn)({ ...alertRule, rules: undefined })).toHaveProperty(
      'rules',
      undefined
    );
  });

  it('returns a copy of the AlertRule', () => {
    const input = { ...alertRule, rules: undefined };
    const output = convertUnitForAlertRule(conversionFn)(input);

    expect(output).not.toBe(input);
    expect(output).toEqual(input);
  });

  it('converts the units of the Rules', () => {
    const input = {
      ...alertRule,
      rules: [
        { time: 0, gte: 10, lte: 20 },
        { time: 1, gte: 20, lte: 30 },
      ],
    };
    const output = convertUnitForAlertRule(conversionFn)(input);

    expect(output.rules).toEqual([
      { time: 0, gte: 100, lte: 200 },
      { time: 1, gte: 200, lte: 300 },
    ]);
    expect(omit(output, ['rules'])).toEqual(omit(input, ['rules']));
  });
});
