import { WorkbinTaskDefinition } from '@plentyag/app-production/src/common/types';
import { DateTimeFormat } from '@plentyag/core/src/utils';
import { DateTime } from 'luxon';

export function getFilteredWorkbinTaskDefinition(
  task: WorkbinTaskDefinition,
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
    task.title?.toUpperCase().includes(searchText.toUpperCase()) ||
    task.description?.toUpperCase().includes(searchText.toUpperCase()) ||
    (toSearchCreatedAt &&
      task.createdAt &&
      DateTime.fromISO(task.createdAt)
        .toFormat(DateTimeFormat.US_DEFAULT)
        .toUpperCase()
        .includes(searchText.toUpperCase()))
  );
}
