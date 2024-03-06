import { AlertRule, ConvertUnitFunction } from '@plentyag/core/src/types/environment';

/**
 * Using the given conversion function, copy the AlertRule and convert all its relevant attributes.
 */
export const convertUnitForAlertRule: ConvertUnitFunction<AlertRule> = conversionFn => alertRule => {
  if (!alertRule.rules) {
    return { ...alertRule };
  }

  return {
    ...alertRule,
    rules: alertRule.rules?.map(rule => ({
      ...rule,
      gte: conversionFn(rule.gte),
      lte: conversionFn(rule.lte),
    })),
  };
};
