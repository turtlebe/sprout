import { ONE_DAY } from '@plentyag/app-environment/src/common/utils/constants';
import { AlertRule, InterpolationType } from '@plentyag/core/src/types/environment';
import { sortBy } from 'lodash';

export const DEFAULT_INTERPOLATION_TYPE = InterpolationType.none;

export interface CopyAlertRule {
  alertRule: AlertRule;
  newRules?: AlertRule['rules'];
  sortRules?: boolean;
}

export function copyAlertRule({ alertRule, newRules, sortRules = true }: CopyAlertRule): AlertRule {
  const unsortedNewRules = newRules || alertRule.rules || [];
  const rules = sortRules ? sortBy(unsortedNewRules, ['time']) : unsortedNewRules;

  return {
    repeatInterval: ONE_DAY, // default repeatInterval if alertRule.repeatInterval is undefined
    interpolationType: DEFAULT_INTERPOLATION_TYPE, // default interpolationType if alertRule.repeatInterval is undefined
    ...alertRule,
    rules,
  };
}
