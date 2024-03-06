import { isNumber } from 'lodash';
import { DateTime, DateTimeOptions } from 'luxon';

/**
 * Our standard date formats
 */
// standards from server
const SQL_DATE_ONLY = 'yyyy-MM-dd';
const SQL_TIME_ONLY = 'HH:mm';
const SQL_TIME_WITH_SECONDS = 'HH:mm:ss';
const SQL_DEFAULT_WITH_TZ = 'yyyy-MM-dd HH:mm:ss.SSS ZZZ';
const SQL_DEFAULT = 'yyyy-MM-dd HH:mm:ss';
const SQL_WITHOUT_SECONDS = 'yyyy-MM-dd HH:mm';

// standards for US
const US_DATE_ONLY = 'MM/dd/yyyy';
const US_TIME_ONLY = 'hh:mm a';
const US_TIME_WITH_SECONDS = 'hh:mm:ss a';
const US_DEFAULT = `${US_DATE_ONLY} ${US_TIME_ONLY}`;
const US_DEFAULT_WITH_SECONDS = `${US_DATE_ONLY} ${US_TIME_WITH_SECONDS}`;

// local format
const DATE_ONLY = 'D';
const TIME_ONLY = 't';
const TIME_WITH_SECONDS = 'tt';
const DEFAULT = `${DATE_ONLY} ${TIME_ONLY}`;
const DEFAULT_WITH_SECONDS = `${DATE_ONLY} ${TIME_WITH_SECONDS}`;

// local verbose format
const VERBOSE_DEFAULT = 'fff';

export const DateTimeFormat = {
  SQL_DATE_ONLY,
  SQL_TIME_ONLY,
  SQL_TIME_WITH_SECONDS,
  SQL_DEFAULT_WITH_TZ,
  SQL_DEFAULT,
  SQL_WITHOUT_SECONDS,
  US_DATE_ONLY,
  US_TIME_ONLY,
  US_TIME_WITH_SECONDS,
  US_DEFAULT,
  US_DEFAULT_WITH_SECONDS,
  DATE_ONLY,
  TIME_ONLY,
  TIME_WITH_SECONDS,
  DEFAULT,
  DEFAULT_WITH_SECONDS,
  VERBOSE_DEFAULT,
};

/**
 * Return a Luxon DateTime instance based on different specific allowedlist input
 *  - valid Luxon DateTime instance
 *  - valid native Date
 *  - valid Epoch seconds
 *  - date string with accompanied format
 *  - date string within the variety of common time formats
 * @param {string | DateTime | Date} value - a string, DateTime, or native Date
 * @param {string} format - date format
 */
export const getLuxonDateTime = (
  value?: string | DateTime | Date | number,
  format?: string,
  formatOptions?: DateTimeOptions
): DateTime => {
  if (value) {
    // If DateTime Object
    if (value instanceof DateTime) {
      return value;
    }

    // If number assume Epoch Seconds
    if (isNumber(value)) {
      return DateTime.fromJSDate(new Date(value * 1000));
    }

    // If JS Date type
    if (value instanceof Date) {
      return DateTime.fromJSDate(value);
    }

    // If specified format
    if (format) {
      return DateTime.fromFormat(value, format, formatOptions);
    }

    // Date strings with common date formats
    const dateTime =
      (DateTime.fromISO(value).isValid && DateTime.fromISO(value)) ||
      (DateTime.fromFormat(value, SQL_DATE_ONLY).isValid && DateTime.fromFormat(value, SQL_DATE_ONLY)) ||
      (DateTime.fromFormat(value, US_DATE_ONLY).isValid && DateTime.fromFormat(value, US_DATE_ONLY)) ||
      (DateTime.fromFormat(value, DATE_ONLY).isValid && DateTime.fromFormat(value, DATE_ONLY)) ||
      (DateTime.fromFormat(value, SQL_DEFAULT_WITH_TZ).isValid && DateTime.fromFormat(value, SQL_DEFAULT_WITH_TZ)) ||
      (DateTime.fromFormat(value, SQL_DEFAULT).isValid && DateTime.fromFormat(value, SQL_DEFAULT)) ||
      (DateTime.fromFormat(value, US_DEFAULT_WITH_SECONDS).isValid &&
        DateTime.fromFormat(value, US_DEFAULT_WITH_SECONDS)) ||
      (DateTime.fromFormat(value, US_DEFAULT).isValid && DateTime.fromFormat(value, US_DEFAULT)) ||
      (DateTime.fromFormat(value, DEFAULT_WITH_SECONDS).isValid && DateTime.fromFormat(value, DEFAULT_WITH_SECONDS)) ||
      (DateTime.fromFormat(value, DEFAULT).isValid && DateTime.fromFormat(value, DEFAULT));
    if (dateTime?.isValid) {
      return dateTime;
    }
  }

  // If value is not defined then return now
  if (value === undefined) {
    return DateTime.now();
  }

  // Default Invalid DateTime
  return DateTime.fromJSDate(null);
};
