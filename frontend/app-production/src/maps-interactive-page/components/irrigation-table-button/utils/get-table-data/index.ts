import {
  InternalIrrigationStatus,
  IrrigationStatus,
  IrrigationTask,
} from '@plentyag/app-production/src/maps-interactive-page/types';
import { getKindFromPath } from '@plentyag/core/src/farm-def/utils';
import { uuidv4 } from '@plentyag/core/src/utils/uuidv4';
import { times } from 'lodash';
import { DateTime } from 'luxon';

import { IrrigationTaskTableRowData } from '../../types';
import { createContainerLocationPath } from '../create-container-location-path';
import { getDiffInDays } from '../get-diff-in-days';
interface GetTableDataArguments {
  irrigationTasks: IrrigationTask[];
  tableLoadedDate: Date;
  lotName: string;
  tableSerial: string;
  rackPath: string;
  siteTimeZone: string;
}

/**
 * This function takes the irrigation tasks and flattens the data so it can be displayed in the ui table.
 *
 * Each irrigation task (if it has executed) has an array of executions (ex: some failures and a success).
 * This function pulls the executions out of the array and creates a new row for each execution.
 *
 * If a task has not executed then it's status will be 'created' and executions array will be an empty array.
 *
 * Additionally, this function adds 'unscheduled' placeholders for any days that do not have an irrigation task.
 */
export function getTableData({
  irrigationTasks,
  tableLoadedDate,
  lotName,
  tableSerial,
  rackPath,
  siteTimeZone,
}: GetTableDataArguments): IrrigationTaskTableRowData[] {
  const tableData: IrrigationTaskTableRowData[] = [];

  const site = getKindFromPath(rackPath, 'sites');

  // get the start of day for the loaded table, this is used to calculate the recipe day for each task
  // (which is the number of days since the table was loaded). This is using the time zone of the site
  // where the the table was loaded to get the correct start of day. a recipe day starts at 00:00:00
  // and ends at midnight, so in LAX1 this would be 2023-01-01T08:00:00.000Z to 2023-01-02T07:59:59.999Z
  const tableLoadedStartDay = DateTime.fromJSDate(tableLoadedDate).setZone(siteTimeZone).startOf('day');

  // reformat the data so it can be displayed in the ui table: flatten data, pulling executions out of array.
  siteTimeZone &&
    irrigationTasks?.forEach(data => {
      if (data.status === IrrigationStatus.CREATED) {
        // if data has recipeDay then use it, otherwise calculate it.
        const recipeDay =
          typeof data.recipeDay === 'number'
            ? data.recipeDay
            : getDiffInDays(DateTime.fromISO(data.plannedStartDate), tableLoadedStartDay);
        tableData.push({
          id: data.id,
          status: data.status,
          irrigationDate: new Date(data.plannedStartDate),
          recipeDay,
          rackPath: data.rackPath,
          plannedVolume: data.plannedVolume,
          trigger: data.type,
          lotName: data.lotName || lotName,
          tableSerial: data.tableSerial || tableSerial,
        });
        return;
      }

      data.executions.forEach(exec => {
        // if data has recipeDay then use it, otherwise calculate it.
        const recipeDay =
          typeof data.recipeDay === 'number'
            ? data.recipeDay
            : getDiffInDays(DateTime.fromISO(exec.executedTimestamp), tableLoadedStartDay);
        tableData.push({
          id: data.id,
          status: exec.status,
          irrigationDate: new Date(exec.executedTimestamp),
          recipeDay,
          rackPath: createContainerLocationPath({ site, rack: exec.rack, level: exec.level, bay: exec.bay }),
          plannedVolume: data.plannedVolume,
          trigger: data.type,
          lotName: data.lotName || lotName,
          tableSerial: data.tableSerial || tableSerial,
          failureReason: exec.failureReason,
        });
      });
    });

  const sortedTableData = tableData.sort((a, b) => a.irrigationDate.getTime() - b.irrigationDate.getTime());

  // add placeholder 'unscheduled' days (ie. days with no irrigation tasks)
  const sortedTableDataWithUnscheduledDays: IrrigationTaskTableRowData[] = [];
  sortedTableData.forEach((data, index) => {
    sortedTableDataWithUnscheduledDays.push(data);

    // possibly add multiple unscheduled days between two scheduled days
    if (index < sortedTableData.length - 1) {
      const recipeDayDiffFromNextItem = sortedTableData[index + 1].recipeDay - data.recipeDay;
      if (recipeDayDiffFromNextItem > 1) {
        times(recipeDayDiffFromNextItem - 1, num => {
          const recipeDay = data.recipeDay + num + 1;
          sortedTableDataWithUnscheduledDays.push({
            id: uuidv4(), // fake id so data so can be used as key in the ui table.
            status: InternalIrrigationStatus.UNSCHEDULED,
            irrigationDate: tableLoadedStartDay.plus({ days: recipeDay }).toJSDate(),
            recipeDay,
            rackPath,
            plannedVolume: undefined,
            trigger: undefined,
            lotName: data.lotName || lotName,
            tableSerial: data.tableSerial || tableSerial,
          });
        });
      }
    }
  });

  return sortedTableDataWithUnscheduledDays;
}
