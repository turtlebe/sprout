import { buildRolledUpByTimeObservation } from '@plentyag/app-environment/src/common/test-helpers';
import { TimeSummarization } from '@plentyag/core/src/types/environment';

import { getObservationStatsFromObservations } from './get-observation-stats-from-observations';

const observations = [
  buildRolledUpByTimeObservation({ mean: 10, median: 15, min: 100, max: 150, rolledUpAt: '2023-03-30T01:00:00Z' }),
  buildRolledUpByTimeObservation({ mean: 20, median: 30, min: 200, max: 300, rolledUpAt: '2023-03-30T02:00:00Z' }),
  buildRolledUpByTimeObservation({ mean: 40, median: 60, min: 300, max: 600, rolledUpAt: '2023-03-30T03:00:00Z' }),
];

describe('getObservationStatsFromObservations', () => {
  it('returns null when the time summarization is `value`', () => {
    expect(getObservationStatsFromObservations(observations, TimeSummarization.value)).toBe(null);
  });

  it('returns null when observations are empty/null', () => {
    expect(getObservationStatsFromObservations(null, TimeSummarization.median)).toBe(null);
    expect(getObservationStatsFromObservations(undefined, TimeSummarization.median)).toBe(null);
    expect(getObservationStatsFromObservations([], TimeSummarization.median)).toBe(null);
  });

  it('returns null when observations are only noData', () => {
    const observations = [
      buildRolledUpByTimeObservation({
        mean: NaN,
        median: NaN,
        min: NaN,
        max: NaN,
        noData: true,
        rolledUpAt: '2023-03-30T01:00:00Z',
      }),
      buildRolledUpByTimeObservation({
        mean: NaN,
        median: NaN,
        min: NaN,
        max: NaN,
        noData: true,
        rolledUpAt: '2023-03-30T02:00:00Z',
      }),
    ];
    expect(getObservationStatsFromObservations(observations, TimeSummarization.median)).toBe(null);
  });

  it('returns an ObservationStats', () => {
    expect(getObservationStatsFromObservations(observations, TimeSummarization.median)).toEqual({
      count: 3,
      max: 60,
      mean: 35,
      median: 30,
      min: 15,
      stddev: 22.9128784747792,
    });
    expect(getObservationStatsFromObservations(observations, TimeSummarization.min)).toEqual({
      count: 3,
      max: 300,
      mean: 200,
      median: 200,
      min: 100,
      stddev: 100,
    });
  });

  it('filters noData observations ', () => {
    expect(
      getObservationStatsFromObservations(
        [...observations, { ...observations[0], noData: true }],
        TimeSummarization.median
      ).count
    ).toEqual(3);
  });
});
