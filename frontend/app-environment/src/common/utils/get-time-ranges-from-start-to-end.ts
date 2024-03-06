import {
  getIntervalWithStepInterpolation,
  padIntervalAlertRule,
  repeatInterval,
} from '@plentyag/app-environment/src/common/utils';
import { AlertRule, InterpolationType, Rule } from '@plentyag/core/src/types/environment';

import { UseMetricGraphApi } from '../hooks';

export interface GetRulesFromStartToEnd {
  alertRule: AlertRule;
  startDateTime: Date;
  endDateTime: Date;
  x: UseMetricGraphApi['scale']['x'];
  y: UseMetricGraphApi['scale']['y'];
  isEditing?: boolean;
}

/**
 * Given a given SPEC_LIMIT or CONTROL_LIMIT AlertRule, pad the interval (@see padInterval) to make the interval repeatable.
 *
 * Apply interpolation (Linear or Step) on the interval.
 *
 * Repeat the interval between startDateTime and endDateTime.
 *
 * This function is explained in details on this confluence page:
 * https://plentyag.atlassian.net/wiki/spaces/EN/pages/2060976395/How+do+we+plot+an+AlertRule+without+interpolation
 */
export const getRulesFromStartToEnd = ({
  alertRule,
  startDateTime,
  endDateTime,
  x,
  y,
  isEditing = false,
}: GetRulesFromStartToEnd): Rule<Date>[] => {
  const rulesPadded =
    alertRule.interpolationType === InterpolationType.linear
      ? padIntervalAlertRule({ alertRule, x, y })
      : getIntervalWithStepInterpolation(padIntervalAlertRule({ alertRule, x, y }));

  return repeatInterval({
    rulesOrActions: rulesPadded,
    alertRuleOrSchedule: alertRule,
    startDateTime,
    endDateTime,
    isEditing,
  });
};
