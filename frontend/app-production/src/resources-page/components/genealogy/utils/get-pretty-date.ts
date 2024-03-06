import { DateTimeFormat } from '@plentyag/core/src/utils';
import { DateTime } from 'luxon';

export function getPrettyDate(dataIsoFormat: string) {
  return DateTime.fromISO(dataIsoFormat).toFormat(DateTimeFormat.US_DEFAULT_WITH_SECONDS);
}
