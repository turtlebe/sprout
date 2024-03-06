import { ConvertUnitFunction, Metric } from '@plentyag/core/src/types/environment';

import { convertUnitForAlertRule } from '.';

/**
 * Using the given conversion function, copy the Metric and convert all its relevant attributes.
 */
export const convertUnitForMetric: ConvertUnitFunction<Metric> = conversionFn => metric => {
  return {
    ...metric,
    unitConfig: {
      ...metric.unitConfig,
      min: conversionFn(metric.unitConfig.min),
      max: conversionFn(metric.unitConfig.max),
    },
    alertRules: metric.alertRules.map(convertUnitForAlertRule(conversionFn)),
  };
};
