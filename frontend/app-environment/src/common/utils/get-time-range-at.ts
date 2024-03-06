import { AlertRule, InterpolationType, Rule } from '@plentyag/core/src/types/environment';

import { getCurrentAndNextPoints } from './get-current-and-next-points';
import { getLinearInterpolatedRule } from './get-linear-interpolated-time-range';
import { getSecondsSinceIntervalStart } from './get-seconds-since-interval-start';

export function getRuleAt(alertRule: AlertRule, at: Date): Rule {
  const secondsSinceIntervalStart = getSecondsSinceIntervalStart(alertRule, at);

  if (!secondsSinceIntervalStart) {
    return null;
  }

  const currentAndNext = getCurrentAndNextPoints({
    repeatInterval: alertRule.repeatInterval,
    points: alertRule.rules,
    secondsSinceIntervalStart,
  });

  if (!currentAndNext) {
    return null;
  }

  const { interpolationType } = alertRule;

  if (interpolationType === InterpolationType.none) {
    return currentAndNext.left;
  } else if (interpolationType === InterpolationType.linear) {
    return getLinearInterpolatedRule(currentAndNext.left, currentAndNext.right, secondsSinceIntervalStart);
  }
}
