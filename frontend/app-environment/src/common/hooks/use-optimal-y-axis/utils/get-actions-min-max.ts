import { getActionDefinitions, isNumericalMeasurementType } from '@plentyag/app-environment/src/common/utils';
import { ScheduleDefinition } from '@plentyag/core/src/farm-def/types';
import { Schedule } from '@plentyag/core/src/types/environment';

export function getActionsMinMax(schedules: Schedule[], scheduleDefinitions: ScheduleDefinition[]) {
  const mins = [];
  const maxs = [];

  scheduleDefinitions.filter(Boolean).forEach((scheduleDefinition, index) => {
    getActionDefinitions(scheduleDefinition).forEach(({ actionDefinition, key }) => {
      const schedule = schedules[index];

      if (!schedule || !actionDefinition.graphable || !isNumericalMeasurementType(actionDefinition.measurementType)) {
        return;
      }

      schedule.actions.forEach(action => {
        const value = parseFloat(key ? action.values[key] : action.value);

        mins.push(value);
        maxs.push(value);
      });
    });
  });

  return {
    min: mins.length ? Math.min(...mins) : NaN,
    max: maxs.length ? Math.max(...maxs) : NaN,
  };
}
