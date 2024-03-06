import { mockAlertRules, mockMetrics } from '@plentyag/app-environment/src/common/test-helpers';

import { convertUnitForMetric } from '.';

const [metric] = mockMetrics;
const conversionFn = values => values * 10;

describe('convertUnitForMetric', () => {
  it('converts the unitConfig min and max', () => {
    const convertedMetric = convertUnitForMetric(conversionFn)(metric);

    expect(convertedMetric.unitConfig.min).toBe(conversionFn(metric.unitConfig.min));
    expect(convertedMetric.unitConfig.max).toBe(conversionFn(metric.unitConfig.max));
  });

  it("converts the alertRule's rules", () => {
    const metricWithAlertRules = { ...metric, alertRules: mockAlertRules };
    const convertedMetric = convertUnitForMetric(conversionFn)(metricWithAlertRules);

    convertedMetric.alertRules.forEach((alertRule, index) => {
      expect(alertRule.rules).toEqual(
        mockAlertRules[index].rules.map(rule => ({
          ...rule,
          gte: conversionFn(rule.gte),
          lte: conversionFn(rule.lte),
        }))
      );
    });
  });
});
