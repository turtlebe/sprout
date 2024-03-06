import { Action, Schedule } from '@plentyag/core/src/types/environment';
import { isEqual, uniq } from 'lodash';

/**
 * Returns the keys of the ActionDefinitions based on the values of the Schedule's actions.
 */
export function getScheduleActionDefinitionKeys(schedule: Schedule): string[] {
  return uniq(
    schedule?.actions
      ?.filter((action: Action) => action.valueType === 'MULTIPLE_VALUE')
      .flatMap((action: Action) => Object.keys(action.values))
      .sort((a, b) => a.localeCompare(b))
  );
}

/**
 * Given multiple Schedules, if all their Actions are compatible and using the same ActionDefinition keys,
 * it returns those keys, otherwise returns an empty array.
 */
export function getSchedulesActionDefinitionKeysWhenEqual(schedules: Schedule[]): string[] {
  if (!schedules?.length) {
    return [];
  }

  const [schedule, ...otherSchedules] = schedules;

  const actionDefinitionKeys = getScheduleActionDefinitionKeys(schedule);

  return otherSchedules.every(otherSchedule =>
    isEqual(getScheduleActionDefinitionKeys(otherSchedule), actionDefinitionKeys)
  )
    ? actionDefinitionKeys
    : [];
}
