import { buildRolledUpByTimeObservation } from '@plentyag/app-environment/src/common/test-helpers';

import { getObservationsWithNoData } from './get-observations-with-no-data';

interface Observation {
  rolledUpAt: string;
  noData?: boolean;
}

function observation({ rolledUpAt, noData = undefined }: Observation) {
  if (noData) {
    return {
      ...buildRolledUpByTimeObservation({ rolledUpAt }),
      median: NaN,
      mean: NaN,
      min: NaN,
      max: NaN,
      noData: true,
    };
  }
  return buildRolledUpByTimeObservation({ rolledUpAt });
}

describe('getObservationsWithNoData', () => {
  it('returns an empty array when there are no observations', () => {
    const observations = [];

    expect(
      getObservationsWithNoData({
        observations,
        timeGranularity: 15,
      })
    ).toEqual([]);
  });

  it('returns the data as is when no data points are missing (with one observation)', () => {
    const observations = [observation({ rolledUpAt: '2022-01-01T00:15:00Z' })];

    expect(getObservationsWithNoData({ observations, timeGranularity: 5 })).toEqual([
      observation({ rolledUpAt: '2022-01-01T00:15:00Z' }),
    ]);
  });

  it('returns the data as is when no data points are missing (with more than two observations)', () => {
    const observations = [
      observation({ rolledUpAt: '2022-01-01T00:15:00Z' }),
      observation({ rolledUpAt: '2022-01-01T00:30:00Z' }),
      observation({ rolledUpAt: '2022-01-01T00:45:00Z' }),
    ];

    expect(getObservationsWithNoData({ observations, timeGranularity: 15 })).toEqual([
      observation({ rolledUpAt: '2022-01-01T00:15:00Z' }),
      observation({ rolledUpAt: '2022-01-01T00:30:00Z' }),
      observation({ rolledUpAt: '2022-01-01T00:45:00Z' }),
    ]);
  });

  it('adds fake "noData" observations when data points are missing (with two observations)', () => {
    const observations = [
      observation({ rolledUpAt: '2022-01-01T00:15:00Z' }),
      observation({ rolledUpAt: '2022-01-01T00:45:00Z' }),
    ];

    expect(getObservationsWithNoData({ observations, timeGranularity: 5 })).toEqual([
      observation({ rolledUpAt: '2022-01-01T00:15:00Z' }),
      observation({ rolledUpAt: '2022-01-01T00:20:00Z', noData: true }),
      observation({ rolledUpAt: '2022-01-01T00:25:00Z', noData: true }),
      observation({ rolledUpAt: '2022-01-01T00:30:00Z', noData: true }),
      observation({ rolledUpAt: '2022-01-01T00:35:00Z', noData: true }),
      observation({ rolledUpAt: '2022-01-01T00:40:00Z', noData: true }),
      observation({ rolledUpAt: '2022-01-01T00:45:00Z' }),
    ]);
  });

  it('adds fake "noData" observations when data points are missing (with more than two observations)', () => {
    const observations = [
      observation({ rolledUpAt: '2022-01-01T00:15:00Z' }),
      observation({ rolledUpAt: '2022-01-01T00:30:00Z' }),
      observation({ rolledUpAt: '2022-01-01T00:45:00Z' }),
    ];

    expect(getObservationsWithNoData({ observations, timeGranularity: 5 })).toEqual([
      observation({ rolledUpAt: '2022-01-01T00:15:00Z' }),
      observation({ rolledUpAt: '2022-01-01T00:20:00Z', noData: true }),
      observation({ rolledUpAt: '2022-01-01T00:25:00Z', noData: true }),
      observation({ rolledUpAt: '2022-01-01T00:30:00Z' }),
      observation({ rolledUpAt: '2022-01-01T00:35:00Z', noData: true }),
      observation({ rolledUpAt: '2022-01-01T00:40:00Z', noData: true }),
      observation({ rolledUpAt: '2022-01-01T00:45:00Z' }),
    ]);
  });
});
