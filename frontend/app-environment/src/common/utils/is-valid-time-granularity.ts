import { TimeGranularity } from '@plentyag/core/src/types/environment';
import moment from 'moment';

export interface IsValidTimeGranularity {
  timeGranularity: TimeGranularity;
  startDateTime: Date;
  endDateTime: Date;
}

export function isValidTimeGranularity({ timeGranularity, startDateTime, endDateTime }: IsValidTimeGranularity) {
  if (!timeGranularity.maxDurationWindow) {
    return true;
  }

  const duration = moment.duration(moment(endDateTime).diff(startDateTime)).as('minutes');

  return timeGranularity.maxDurationWindow >= duration;
}
