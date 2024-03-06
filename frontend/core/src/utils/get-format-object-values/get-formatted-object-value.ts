import { DateTime } from 'luxon';

import { DateTimeFormat, getLuxonDateTime } from '../get-luxon-date-time';

/**
 * Function to detect "dates" and other types and format them to a display standard
 */
export const getFormattedObjectValue = (value: string | number | boolean) => {
  if (typeof value === 'string') {
    // If a valid date format then return human readable date
    if (DateTime.fromFormat(value, DateTimeFormat.SQL_DATE_ONLY).isValid) {
      return DateTime.fromFormat(value, DateTimeFormat.SQL_DATE_ONLY).toFormat(DateTimeFormat.US_DATE_ONLY);
    }

    // Otherwise, if a valid date time format then return human readable date and time
    const dateTime = getLuxonDateTime(value);
    if (dateTime.isValid) {
      return dateTime.toFormat(DateTimeFormat.US_DEFAULT);
    }
  }

  return value;
};
