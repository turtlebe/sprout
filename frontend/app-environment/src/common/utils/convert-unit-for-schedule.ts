import { getActionDefinitions } from '@plentyag/app-environment/src/common/utils';
import { ActionDefinition, ScheduleDefinition } from '@plentyag/core/src/farm-def/types';
import { Schedule, YAxisValueType } from '@plentyag/core/src/types/environment';

export type ConvertUnitScheduleFunction = (
  conversionFn: (value: YAxisValueType, actionDefinition: ActionDefinition) => number
) => (schedule: Schedule, scheduleDefinition: ScheduleDefinition) => Schedule;

/**
 * Using the given conversion function, copy the Schedule and convert all its relevant attributes.
 */
export const convertUnitForSchedule: ConvertUnitScheduleFunction = conversionFn => (schedule, scheduleDefinition) => {
  if (!schedule.actions) {
    return { ...schedule };
  }

  return {
    ...schedule,
    actions: schedule.actions.map(action => {
      if (action.valueType === 'SINGLE_VALUE') {
        const [{ actionDefinition }] = getActionDefinitions(scheduleDefinition);
        return { ...action, value: conversionFn(action.value, actionDefinition).toString() };
      } else {
        const convertedValues = getActionDefinitions(scheduleDefinition).reduce((result, { key, actionDefinition }) => {
          result[key] = conversionFn(action.values[key], actionDefinition).toString();
          return result;
        }, {});

        return { ...action, values: convertedValues };
      }
    }),
  };
};
