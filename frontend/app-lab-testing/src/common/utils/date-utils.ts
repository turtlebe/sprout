import { DateTimeFormat, getLuxonDateTime } from '@plentyag/core/src/utils';
import { DateTime } from 'luxon';

/**
 * Takes date in format: yyyy-mm-dd and convert to javascript Date.
 * Backend provides iso date format: yyyy-mm-dd.
 */
export function convertStringToDate(date: string): Date {
  const parts = date.split('-');
  if (parts.length === 3) {
    return new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
  } else {
    return new Date();
  }
}

/**
 * Takes time in format: hh:mm a and convert to javascript Date.
 * Backend provides iso time format: hh:mm a.
 */
export function convertTimeToDate(date: string): Date {
  const dateTime =
    (getLuxonDateTime(date, 'hh:mm').isValid && getLuxonDateTime(date, 'hh:mm')) ||
    (getLuxonDateTime(date, 'hh:mm:ss').isValid && getLuxonDateTime(date, 'hh:mm:ss'));
  if (dateTime?.isValid) {
    return dateTime.toJSDate();
  }

  // return invalid date by default
  return new Date('NaN');
}

/**
 * Convert to format used in views, that is, en-us date format: mm/dd/yyyy
 */
export function convertDateToString(d: Date) {
  if (d) {
    return d.getMonth() + 1 + '-' + d.getDate() + '-' + d.getFullYear();
  }

  throw new Error('Missing date object');
}

function removeLeadingZero(str: string) {
  return parseInt(str, 10);
}

/**
 * Takes ISO date format: yyyy/mm/dd and converts to view format: mm/dd/yyyy
 * Split char can be either '-' or '/'
 * @param IsoString
 */
export function convertISOStringToViewString(IsoString: string) {
  let parts = IsoString.split('-');
  if (parts.length !== 3) {
    parts = IsoString.split('/');
  }

  if (parts.length !== 3) {
    return IsoString;
  }

  return removeLeadingZero(parts[1]) + '-' + removeLeadingZero(parts[2]) + '-' + parts[0];
}

/**
 * Takes ISO time format: hh:mm and converts to view format: hh:mm A
 * @param
 */
export function convert24HourTimeToAMPMFormat(sqlTime: string) {
  if (!sqlTime) {
    return '';
  }

  const dateTime =
    (DateTime.fromFormat(sqlTime, DateTimeFormat.SQL_TIME_ONLY).isValid &&
      DateTime.fromFormat(sqlTime, DateTimeFormat.SQL_TIME_ONLY)) ||
    (DateTime.fromFormat(sqlTime, DateTimeFormat.SQL_TIME_WITH_SECONDS).isValid &&
      DateTime.fromFormat(sqlTime, DateTimeFormat.SQL_TIME_WITH_SECONDS));
  if (dateTime?.isValid) {
    return dateTime.toFormat(DateTimeFormat.US_TIME_ONLY);
  }

  return sqlTime;
}

/**
 * Convert date to ISO year format - that backend requires: yyyy/mm/dd
 */
export function convertDateToISOString(date: Date) {
  if (date) {
    return DateTime.fromJSDate(date).toFormat(DateTimeFormat.SQL_DATE_ONLY);
  }

  throw new Error('Missing date object');
}

/**
 * Convert date to time 24 hour format - the backend requires: hh:mm. e.g. 22:00
 */
export function convertDateToTimeString(d: Date) {
  if (d) {
    return DateTime.fromJSDate(d).toFormat(DateTimeFormat.SQL_TIME_ONLY);
  }

  throw new Error('Missing date object');
}

export function getDateFormat() {
  return 'MM-dd-yyyy';
}

export function getTimeFormat() {
  return DateTimeFormat.US_TIME_ONLY;
}

const INVALID_DATE = 'Invalid Date';
const INVALID_TIME = 'Invalid Time';
const REQUIRED = 'Required';
const minDate = new Date('2000-1-1');
const maxDate = new Date('2100-1-1');

function getFormattedDateString(date: Date) {
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

export function validateDate(date: Date) {
  let error;
  if (!date) {
    error = REQUIRED;
  } else if (!DateTime.fromJSDate(date).isValid) {
    error = INVALID_DATE;
  } else if (date <= minDate) {
    error = `Date must be greater than ${getFormattedDateString(minDate)}`;
  } else if (date >= maxDate) {
    error = `Date must be less than ${getFormattedDateString(maxDate)}`;
  }
  return error;
}

export function validateTime(time: Date) {
  let error;
  if (!time) {
    return;
  }
  if (!DateTime.fromJSDate(time).isValid) {
    error = INVALID_TIME;
  }
  return error;
}
