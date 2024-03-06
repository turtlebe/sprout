import { ScheduleDefinition } from '@plentyag/core/src/farm-def/types';

export function isSingleValueScheduleDefinition(scheduleDefinition: ScheduleDefinition) {
  return Boolean(scheduleDefinition?.action?.supportedKeys?.length === 0 || scheduleDefinition?.actionDefinition);
}
