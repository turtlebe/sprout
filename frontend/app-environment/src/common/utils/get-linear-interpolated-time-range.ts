import { Rule } from '@plentyag/core/src/types/environment';
import { isNumber } from 'lodash';

import { getYCoordBetweenTwoPoints } from './get-y-coord-between-two-points';

/**
 * Build a new interpolated Rule between two Rules.
 */
export function getLinearInterpolatedRule(ruleA: Rule, ruleB: Rule, secondsSinceIntervalStart: number): Rule {
  const gte =
    isNumber(ruleA.gte) && isNumber(ruleB.gte)
      ? getYCoordBetweenTwoPoints({
          x1: ruleA.time,
          y1: ruleA.gte,
          x2: ruleB.time,
          y2: ruleB.gte,
          mouseX: secondsSinceIntervalStart,
        })
      : null;

  const lte =
    isNumber(ruleA.lte) && isNumber(ruleB.lte)
      ? getYCoordBetweenTwoPoints({
          x1: ruleA.time,
          y1: ruleA.lte,
          x2: ruleB.time,
          y2: ruleB.lte,
          mouseX: secondsSinceIntervalStart,
        })
      : null;

  return {
    time: secondsSinceIntervalStart,
    gte,
    lte,
  };
}
