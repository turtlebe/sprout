import { getIntervalStart } from '@plentyag/app-environment/src/common/utils';
import { Action, AlertRule, Rule, Schedule } from '@plentyag/core/src/types/environment';
import { times } from 'lodash';
import moment from 'moment';

export function getIntervalWithStepInterpolation<T extends Rule | Action>(rulesOrActions: T[]): T[] {
  if (!rulesOrActions) {
    return [];
  }

  const interpolatedRulesOrActions: T[] = [];

  rulesOrActions.forEach((rule, index) => {
    const nextRule = rulesOrActions[index + 1];

    if (nextRule) {
      interpolatedRulesOrActions.push(rule);
      interpolatedRulesOrActions.push({ ...rule, time: nextRule.time, isVirtual: true });
    }
  });

  return interpolatedRulesOrActions;
}

export interface RepeatInterval {
  rulesOrActions: Rule[] | Action[];
  alertRuleOrSchedule: AlertRule | Schedule;
  startDateTime: Date;
  endDateTime: Date;
  isEditing: boolean;
}

/** Takes an array of Rule or Action as a template interval and repeats it over and over from startDateTime to endDateTime. */
export function repeatInterval<T extends Rule<Date> | Action<Date>>({
  rulesOrActions,
  alertRuleOrSchedule,
  startDateTime,
  endDateTime,
  isEditing,
}: RepeatInterval): T[] {
  const { startsAt, repeatInterval, endsAt } = alertRuleOrSchedule;

  if (isEditing) {
    // In EditMode, we only need one interval, moreover the startDateTime is already the beginning of the interval.
    // Returns one interval relative to `startDateTime`.
    return rulesOrActions.map(ruleOrAction => ({
      ...ruleOrAction,
      time: moment(startDateTime).add(ruleOrAction.time, 'seconds').toDate(),
    }));
  } else {
    // In ReadMode,

    // edge case: if the startDateTime is before the startsAt, then we should use the startsAt for the
    // rest of the calculation.
    const _startDateTime = moment(startDateTime).isSameOrAfter(startsAt) ? startDateTime : new Date(startsAt);

    // edge case: if endsAt is undefined, use endDateTime, if endsAt is defined but endDateTime is before endsAt, use endDateTime, otherwise use endsAt.
    const _endDateTime = endsAt
      ? moment(endDateTime).isSameOrBefore(endsAt)
        ? endDateTime
        : new Date(endsAt)
      : endDateTime;

    // Calculate the previousIntervalStart relative to the `startDateTime` selected by the user.
    // This ensures that we cover the interval starting before the selected time window.
    const intervalStart = getIntervalStart(alertRuleOrSchedule, _startDateTime, 0);

    // Calculate how many seconds between `endDateTime` and when the first interval starts.
    const secondsBetweenIntervalStartAndEndDateTime = moment
      .duration(moment(_endDateTime).diff(intervalStart))
      .as('seconds');

    // Calculate how many intervals we have between the first one and the one ending at or after `endDateTime`.
    const intervalCount = Math.ceil(Math.abs(secondsBetweenIntervalStartAndEndDateTime) / repeatInterval);

    const intervalRepeated: T[] = [];

    times(intervalCount, counter => {
      intervalRepeated.push(
        ...rulesOrActions.map(ruleOrAction => ({
          ...ruleOrAction,
          time: moment(intervalStart)
            .add(ruleOrAction.time + counter * repeatInterval, 'seconds')
            .toDate(),
        }))
      );
    });

    if (endsAt) {
      const intervalRepeatedTruncated = intervalRepeated.filter(ruleOrAction =>
        moment(ruleOrAction.time).isBefore(endsAt)
      );

      return [
        ...intervalRepeatedTruncated,
        { ...intervalRepeatedTruncated[intervalRepeatedTruncated.length - 1], time: new Date(endsAt), isVirtual: true },
      ];
    }

    return intervalRepeated;
  }
}
