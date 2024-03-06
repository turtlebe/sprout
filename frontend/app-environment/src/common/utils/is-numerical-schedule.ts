import { ScheduleDefinition } from '@plentyag/core/src/farm-def/types';

import { getActionDefinitions, isNumericalMeasurementType } from '.';

export function isNumericalSchedule(scheduleDefinition: ScheduleDefinition) {
  return getActionDefinitions(scheduleDefinition).every(({ actionDefinition }) =>
    isNumericalMeasurementType(actionDefinition.measurementType)
  );
}
