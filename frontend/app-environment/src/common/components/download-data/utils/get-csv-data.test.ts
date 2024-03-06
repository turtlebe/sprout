import { buildMetric, buildRolledUpByTimeObservation } from '@plentyag/app-environment/src/common/test-helpers';

import { getCsvData } from './get-csv-data';

describe('getCsvData', () => {
  it('returns CSV data for two metrics with their respective observations', () => {
    const metrics = [buildMetric({}), buildMetric({})];
    const observations = [
      [buildRolledUpByTimeObservation({ rolledUpAt: '2023-01-01T00:00:00Z' })],
      [buildRolledUpByTimeObservation({ rolledUpAt: '2023-01-02T00:00:00Z' })],
    ];

    expect(getCsvData(metrics, observations)).toEqual([
      ['Metric ID', 'Path', 'Measurement Type', 'Observation Name'],
      [metrics[0].id, metrics[0].path, metrics[0].measurementType, metrics[0].observationName],
      [],
      [
        'Rolled Up At',
        'Measurement Type',
        'Obseration Name',
        'Min',
        'Max',
        'Mean',
        'Median',
        'Value',
        'Value Count',
        'Units',
      ],
      ['2023-01-01T00:00:00Z', 'TEMPERATURE', 'AirTemperature', 30, 40, 10, 20, undefined, undefined, 'C'],
      [],
      [],
      ['Metric ID', 'Path', 'Measurement Type', 'Observation Name'],
      [metrics[1].id, metrics[1].path, metrics[1].measurementType, metrics[1].observationName],
      [],
      [
        'Rolled Up At',
        'Measurement Type',
        'Obseration Name',
        'Min',
        'Max',
        'Mean',
        'Median',
        'Value',
        'Value Count',
        'Units',
      ],
      ['2023-01-02T00:00:00Z', 'TEMPERATURE', 'AirTemperature', 30, 40, 10, 20, undefined, undefined, 'C'],
      [],
      [],
    ]);
  });
});
