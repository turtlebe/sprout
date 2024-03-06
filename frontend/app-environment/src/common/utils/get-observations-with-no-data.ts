import { RolledUpByTimeObservation } from '@plentyag/core/src/types';
import moment from 'moment';

export interface GetObservationsWithNoData {
  observations: RolledUpByTimeObservation[];
  timeGranularity: number;
}

/**
 * This function takes an array of Observations and adds missing data-point between the first and last item based on the time granularity.
 *
 * For example, if we ask for observations between 00:00 and 01:00 with a time granularity of 15, we expect observations at:
 * - 00:00
 * - 00:15
 * - 00:30
 * - 00:45
 * - 01:00
 *
 * But if the backend only returns:
 * - 00:15
 * - 00:45
 *
 * Then we have missing data points at:
 * - 00:00
 * - 00:30
 * - 01:00
 *
 * This function will then return:
 * - 00:15
 * - 00:30, noData: true
 * - 00:45
 *
 * In other words it adds missing data-point with a "noData": true attribute between the first and last observations.
 * Note: We don't need to add missing data points before the first item and after the last one.
 */
export function getObservationsWithNoData({
  observations,
  timeGranularity,
}: GetObservationsWithNoData): RolledUpByTimeObservation[] {
  if (!observations || !observations.length) {
    return [];
  }

  let index = 0;
  let currentRolledUpAt = moment.utc(observations[0].rolledUpAt);
  const lastRolledUpAt = moment.utc(observations[observations.length - 1].rolledUpAt);
  const observationsWithNoData: RolledUpByTimeObservation[] = [];

  while (currentRolledUpAt.isSameOrBefore(lastRolledUpAt) && index < observations.length) {
    // get the current observation
    const currentObservation = observations[index];

    if (currentRolledUpAt.isSame(currentObservation.rolledUpAt)) {
      // if the current "rolledUpAt" is the same than the current observation
      // we simply add that observation to the results and increment the index.
      observationsWithNoData.push(currentObservation);
      index++;
    } else {
      // if the current "rolledUpAt" is not the same than the current observation
      // we add a "fake" noData observation to the results.
      // we also don't increment the index as we want to keep the current observation to compare against for the next iteration.
      observationsWithNoData.push({
        ...observations[0],
        rolledUpAt: currentRolledUpAt.format(),
        mean: NaN,
        median: NaN,
        min: NaN,
        max: NaN,
        noData: true,
      });
    }

    // then we increase the `currentRolledUpAt` by `timeGranularity` minutes for the next iteration.
    currentRolledUpAt = moment(currentRolledUpAt).add(timeGranularity, 'minutes');
  }

  return observationsWithNoData;
}
