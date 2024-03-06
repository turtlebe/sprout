import { DateTime } from 'luxon';

import { AgeCohortDate } from '../../types';

/**
 * This function checks if the container was loaded into the room on
 * the same day as the provided "ageCohortDate".  if "ageCohortDate" is "all" (indicating
 * all containers regardless of load date are shown) then return true.
 */
export function isLoadDateInSameDayAsAgeCohortDate(ageCohortDate: AgeCohortDate, loadedDate?: Date) {
  if (ageCohortDate === 'all') {
    return true;
  }

  if (!loadedDate) {
    return false;
  }

  return DateTime.fromJSDate(loadedDate).hasSame(DateTime.fromJSDate(ageCohortDate), 'day');
}
