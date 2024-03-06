import { isEqual } from 'lodash';

import { ScheduleDefinition } from '../farm-def/types';

export function isScheduleDefinitionCompatible(
  scheduleDefinitionA: ScheduleDefinition,
  scheduleDefinitionB: ScheduleDefinition
) {
  if (!scheduleDefinitionA || !scheduleDefinitionB) {
    return false;
  }

  return (
    isEqual(scheduleDefinitionA.action, scheduleDefinitionB.action) &&
    isEqual(scheduleDefinitionA.actionDefinition, scheduleDefinitionB.actionDefinition) &&
    isEqual(scheduleDefinitionA.actionDefinitions, scheduleDefinitionB.actionDefinitions)
  );
}
