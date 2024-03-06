import { getLuxonDateTime } from './get-luxon-date-time';

/**
 * Takes ag-grid date-time string and returns utc time for start of day.
 * @param dateTime date in format YYYY-MM-DD HH:MM:SS
 */
export function getStartOfDayISOString(dateTime: string) {
  return getLuxonDateTime(dateTime).startOf('day').toUTC().toISO();
}
