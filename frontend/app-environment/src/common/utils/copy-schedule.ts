import { Action, Schedule } from '@plentyag/core/src/types/environment';
import { sortBy } from 'lodash';

export interface CopySchedule {
  schedule: Schedule;
  newActions?: Action[];
  sortAcions?: boolean;
}

export function copySchedule({ schedule, newActions, sortAcions = true }: CopySchedule) {
  const unsortedActions = newActions || schedule.actions || [];
  const actions = sortAcions ? sortBy(unsortedActions, ['time']) : unsortedActions;

  return { ...schedule, actions };
}
