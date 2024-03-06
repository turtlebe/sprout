import { ObservationsByTime, TimeGranularity } from '@plentyag/core/src/types/environment';
import moment from 'moment';

export function getObservationsByTimeRange(observationsByTime: ObservationsByTime, timeGranularity: TimeGranularity) {
  if (!observationsByTime || !timeGranularity) {
    return;
  }

  return `${moment(observationsByTime.rolledUpAt).format('lll')} - ${moment(observationsByTime.rolledUpAt)
    .add(timeGranularity.value, 'minute')
    .format('lll')}`;
}
