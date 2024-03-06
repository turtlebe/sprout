import { DateTime } from 'luxon';

export const SECONDS_AGO_TEXT = 'a few seconds ago';
export const SECONDS_AFTER_TEXT = 'in a few seconds';

/**
 * Return the relative time to now
 * Note: for relative time below one minute, just show a generic "a moment ago" string
 * @param date
 */
export const getRelativeTime = (date: Date) => {
  const dateTime = DateTime.fromJSDate(date);
  const diff = dateTime.diffNow('minutes').minutes;

  if (diff > -1 && diff <= 0) {
    return SECONDS_AGO_TEXT;
  }

  if (diff > 0 && diff < 1) {
    return SECONDS_AFTER_TEXT;
  }
  return dateTime.toRelative();
};
