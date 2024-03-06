import { ScheduleDefinition } from '@plentyag/core/src/farm-def/types';

import { getActionDefinitions, KeyAndActionDefinition } from './get-action-definitions';

/**
 * Fetch the first graphable ActionDefinition of a ScheduleDefinition.
 */
export function getGraphableActionDefinition(scheduleDefinition: ScheduleDefinition): KeyAndActionDefinition {
  if (!scheduleDefinition) {
    return null;
  }

  const [actionDefinitionAndKey] = getActionDefinitions(scheduleDefinition, { graphable: true });

  if (!actionDefinitionAndKey) {
    throw new Error(
      `ScheduleDefinition ${scheduleDefinition.path} does not have a graphable action definition, please fix the Schedule Definition.`
    );
  }

  return actionDefinitionAndKey;
}
