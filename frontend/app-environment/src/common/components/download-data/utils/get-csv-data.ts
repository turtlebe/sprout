import { RolledUpByTimeObservation } from '@plentyag/core/src/types';
import { Metric } from '@plentyag/core/src/types/environment';

/** Describe Metric's Attributes that we want to export with its header. */
const metricData: { [key: string]: (metric: Metric) => any } = {
  'Metric ID': metric => metric.id,
  Path: metric => metric.path,
  'Measurement Type': metric => metric.measurementType,
  'Observation Name': metric => metric.observationName,
};

/** Describe Observation's Attributes that we want to export with its header. */
const observationData: { [key: string]: (observation: RolledUpByTimeObservation) => any } = {
  'Rolled Up At': observation => observation.rolledUpAt,
  'Measurement Type': observation => observation.measurementType,
  'Obseration Name': observation => observation.observationName,
  Min: observation => observation.min,
  Max: observation => observation.max,
  Mean: observation => observation.mean,
  Median: observation => observation.median,
  Value: observation => observation.value,
  'Value Count': observation => observation.valueCount,
  Units: observation => observation.units,
};

export function getCsvData(metrics: Metric[], observations: RolledUpByTimeObservation[][]) {
  const csvData = [];

  metrics.forEach((metric, index) => {
    csvData.push(Object.keys(metricData));
    csvData.push(Object.keys(metricData).map(key => metricData[key](metric)));
    // insert empty line for space between Metric Info and Observations Data
    csvData.push([]);

    csvData.push(Object.keys(observationData));
    observations[index].forEach(observation => {
      csvData.push(Object.keys(observationData).map(key => observationData[key](observation)));
    });
    // insert two empty lines for space between two Metrics
    csvData.push([]);
    csvData.push([]);
  });

  return csvData;
}
