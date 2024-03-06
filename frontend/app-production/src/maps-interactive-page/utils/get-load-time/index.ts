import { DateTime } from 'luxon';

/**
 * This function return a string displaying the days/hours/minutes since the container
 * was loaded into the room (germination, propagation or vertical grow).
 */
export function getLoadTime(isoLoadDate: string | Date, baseDate?: DateTime) {
  const _isoLoadDate =
    typeof isoLoadDate === 'string' ? DateTime.fromISO(isoLoadDate) : DateTime.fromJSDate(isoLoadDate);
  const duration = (baseDate || DateTime.now()).diff(_isoLoadDate, ['days', 'hours', 'minutes']);

  const days = duration.get('days');
  const hours = duration.get('hours');
  const minutes = Math.floor(duration.get('minutes'));

  let result = days > 0 ? `${days}d ` : '';
  result += days > 0 || hours > 0 ? `${hours}h ` : '';
  result += `${minutes}m`;

  return result;
}
