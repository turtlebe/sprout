import { buildRolledUpByTimeObservation } from '@plentyag/app-environment/src/common/test-helpers';
import { TimeSummarization } from '@plentyag/core/src/types/environment';

import { getObservationStreamsMinMax } from './get-observation-streams-min-max';

describe('getObservationStreamsMinMax', () => {
  it('returns NaN-NaN', () => {
    expect(getObservationStreamsMinMax([], TimeSummarization.median)).toEqual({ min: NaN, max: NaN });
    expect(getObservationStreamsMinMax([null], TimeSummarization.median)).toEqual({ min: NaN, max: NaN });
  });

  it('returns NaN-NaN when the TimeSummarization is null', () => {
    const observationStreams = [
      [buildRolledUpByTimeObservation({ mean: 0, median: 40, min: 0, max: 0, rolledUpAt: '2023-01-01T00:00:00Z' })],
    ];

    expect(getObservationStreamsMinMax(observationStreams, null)).toEqual({ min: NaN, max: NaN });
  });

  it('returns min/max based on observations and time summarization (median)', () => {
    const observationStreams = [
      [buildRolledUpByTimeObservation({ mean: 0, median: -40, min: 0, max: 0, rolledUpAt: '2023-01-01T00:00:00Z' })],
      [buildRolledUpByTimeObservation({ mean: 0, median: 40, min: 0, max: 0, rolledUpAt: '2023-01-01T00:00:00Z' })],
    ];

    expect(getObservationStreamsMinMax(observationStreams, TimeSummarization.median)).toEqual({ min: -40, max: 40 });
  });

  it('returns min/max based on observations and time summarization handling noData observations (median)', () => {
    const observationStreams = [
      [
        buildRolledUpByTimeObservation({ mean: 0, median: -40, min: 0, max: 0, rolledUpAt: '2023-01-01T00:00:00Z' }),
        buildRolledUpByTimeObservation({
          mean: NaN,
          median: NaN,
          min: NaN,
          max: NaN,
          noData: true,
          rolledUpAt: '2023-01-01T00:00:00Z',
        }),
        buildRolledUpByTimeObservation({ mean: 0, median: 40, min: 0, max: 0, rolledUpAt: '2023-01-01T00:00:00Z' }),
      ],
    ];

    expect(getObservationStreamsMinMax(observationStreams, TimeSummarization.median)).toEqual({ min: -40, max: 40 });
  });

  it('returns min/max based on observations and time summarization (mean)', () => {
    const observationStreams = [
      [buildRolledUpByTimeObservation({ mean: -50, median: 0, min: 0, max: 0, rolledUpAt: '2023-01-01T00:00:00Z' })],
      [buildRolledUpByTimeObservation({ mean: 50, median: 0, min: 0, max: 0, rolledUpAt: '2023-01-01T00:00:00Z' })],
    ];

    expect(getObservationStreamsMinMax(observationStreams, TimeSummarization.mean)).toEqual({ min: -50, max: 50 });
  });

  it('returns min/max based on observations and time summarization (value)', () => {
    const attrs = { mean: 0, median: 0, min: 0, max: 0 };
    const observationStreams = [
      [
        buildRolledUpByTimeObservation({ ...attrs, value: 'A', valueCount: 30, rolledUpAt: '2023-01-01T00:00:00Z' }),
        buildRolledUpByTimeObservation({ ...attrs, value: 'B', valueCount: 50, rolledUpAt: '2023-01-01T00:00:00Z' }),
        buildRolledUpByTimeObservation({ ...attrs, value: 'A', valueCount: 10, rolledUpAt: '2023-01-01T01:00:00Z' }),
        buildRolledUpByTimeObservation({ ...attrs, value: 'B', valueCount: 20, rolledUpAt: '2023-01-01T02:00:00Z' }),
      ],
    ];

    // we have 30 + 50 at the same rolledUpAt = 80
    expect(getObservationStreamsMinMax(observationStreams, TimeSummarization.value)).toEqual({ min: 0, max: 80 });
  });
});
