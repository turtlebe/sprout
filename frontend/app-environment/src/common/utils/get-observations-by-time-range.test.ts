import { buildRolledUpByTimeObservation } from '@plentyag/app-environment/src/common/test-helpers';
import moment from 'moment';

import { getObservationsByTimeRange } from '.';

import { DEFAULT_TIME_GRANULARITY } from './constants';

const now = moment().format();
const observationsByTime = {
  rolledUpAt: now,
  observations: [buildRolledUpByTimeObservation({ rolledUpAt: now })],
};

describe('getObservationsByTimeRange', () => {
  it('returns undefined', () => {
    expect(getObservationsByTimeRange(null, DEFAULT_TIME_GRANULARITY)).toBeUndefined();
    expect(getObservationsByTimeRange(observationsByTime, null)).toBeUndefined();
  });

  it('returns a time range based on the `rolledUpAt` and the `timeGranularity`', () => {
    expect(getObservationsByTimeRange(observationsByTime, DEFAULT_TIME_GRANULARITY)).toBe(
      moment(now).format('lll') + ' - ' + moment(now).add(DEFAULT_TIME_GRANULARITY.value, 'minutes').format('lll')
    );
  });
});
