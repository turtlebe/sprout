import { getLuxonDateTime } from './get-luxon-date-time';

/**
 *  Takes ag-grid date-time string and returns utc time for start of next day.
 * @param dateTime date in format YYYY-MM-DD HH:MM:SS
 */
export function getEndOfDayISOString(dateTime: string) {
  return getLuxonDateTime(dateTime).endOf('day').toUTC().toISO();
}
