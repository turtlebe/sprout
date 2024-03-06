import { getActionDefinitions } from '@plentyag/app-environment/src/common/utils';
import { ScheduleDefinition } from '@plentyag/core/src/farm-def/types';
import { uniq } from 'lodash';

export function isScheduleDefinitionActionsEqual(scheduleDefinition: ScheduleDefinition) {
  return uniq(getActionDefinitions(scheduleDefinition).map(item => item.actionDefinition)).length === 1;
}
