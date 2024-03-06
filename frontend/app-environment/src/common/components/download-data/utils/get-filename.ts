import { Dashboard, Metric, Schedule } from '@plentyag/core/src/types/environment';
import { DateTimeFormat } from '@plentyag/core/src/utils';
import { DateTime } from 'luxon';

export const prefix = 'ev2-data';
export const getLastSegment = path => path.split('/').slice(-1)[0];

export interface GetFilename {
  startDateTime: Date;
  endDateTime: Date;
  metrics: Metric[];
  schedule?: Schedule;
  dashboard?: Dashboard;
  widgetName?: string;
}

export function getFilename({ startDateTime, endDateTime, metrics, schedule, dashboard, widgetName }: GetFilename) {
  const dates = `${DateTime.fromJSDate(startDateTime).toFormat(
    DateTimeFormat.SQL_WITHOUT_SECONDS
  )}-${DateTime.fromJSDate(endDateTime).toFormat(DateTimeFormat.SQL_WITHOUT_SECONDS)}`;

  if (dashboard && widgetName) {
    return [prefix, dashboard.name, widgetName, dates].join('-');
  }

  if (schedule) {
    return [prefix, getLastSegment(schedule.path), dates].join('-');
  }

  return [prefix, getLastSegment(metrics[0].path), metrics[0].observationName, dates].join('-');
}
