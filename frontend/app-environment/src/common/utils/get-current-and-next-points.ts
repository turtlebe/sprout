import { Point } from '@plentyag/core/src/types/environment';

export type GetCurrentAndNextPoints = <T extends Point>(args: {
  repeatInterval: number;
  secondsSinceIntervalStart: number;
  points: T[];
}) => { left: T; right: T };

/**
 * Returns the current and next rule/action of an AlertRule/schedule based on the given
 * repeat interval and secondsSinceIntervalStart.
 */
export const getCurrentAndNextPoints: GetCurrentAndNextPoints = ({
  points,
  repeatInterval,
  secondsSinceIntervalStart,
}) => {
  if (!points?.length || typeof secondsSinceIntervalStart !== 'number' || typeof repeatInterval !== 'number') {
    return null;
  }

  const firstPoinst = points[0];
  const lastPoint = points[points.length - 1];

  // Handle the case where `at` is before the first rule.
  if (firstPoinst.time > secondsSinceIntervalStart) {
    return {
      left: {
        ...lastPoint,
        time: lastPoint.time - repeatInterval,
      },
      right: firstPoinst,
    };
  }

  // Handle the case where `at` is after the last rule.
  if (lastPoint.time <= secondsSinceIntervalStart) {
    return {
      left: lastPoint,
      right: {
        ...firstPoinst,
        time: firstPoinst.time + repeatInterval,
      },
    };
  }

  // Otherwise, find the rule for the given `at` timestamp.
  for (let i = 0; i < points.length - 1; i++) {
    const left = points[i];
    const right = points[i + 1];

    if (left.time <= secondsSinceIntervalStart && right.time > secondsSinceIntervalStart) {
      return { left, right };
    }
  }

  return null;
};
