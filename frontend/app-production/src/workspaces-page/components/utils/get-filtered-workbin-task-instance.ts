import { WorkbinTaskInstance } from '@plentyag/app-production/src/common/types';
import { DateTimeFormat } from '@plentyag/core/src/utils';
import { DateTime } from 'luxon';

/**
 * To filter based on description field OR TaskInstance ID
 */
export function getFilteredWorkbinTaskInstance(
  task: WorkbinTaskInstance,
  searchText: string,
  toSearchCreatedAt = false
) {
  if (!task) {
    return false;
  }

  if (!searchText) {
    return true;
  }

  return (
    task.description?.toUpperCase().includes(searchText.toUpperCase()) ||
    task.id?.toUpperCase().includes(searchText.toUpperCase()) ||
    (toSearchCreatedAt &&
      task.createdAt &&
      DateTime.fromISO(task.createdAt)
        .toFormat(DateTimeFormat.US_DEFAULT)
        .toUpperCase()
        .includes(searchText.toUpperCase()))
  );
}
