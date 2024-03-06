import { buildMetric, buildRolledUpByTimeObservation } from '@plentyag/app-environment/src/common/test-helpers';

import { getJsonData } from './get-json-data';

describe('getJsonData', () => {
  it('zips the metrics with their observations', () => {
    const metrics = [buildMetric({}), buildMetric({})];
    const observations = [
      [buildRolledUpByTimeObservation({ rolledUpAt: '2023-01-01T00:00:00Z' })],
      [buildRolledUpByTimeObservation({ rolledUpAt: '2023-01-02T00:00:00Z' })],
    ];

    expect(getJsonData(metrics, observations)).toEqual([
      { metric: metrics[0], observations: observations[0] },
      { metric: metrics[1], observations: observations[1] },
    ]);
  });
});
