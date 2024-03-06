import { Metric } from '@plentyag/core/src/types/environment';

export function isNumericalMeasurementType(measurementType: string) {
  return !['CATEGORICAL_STATE', 'BINARY_STATE', 'UNKNOWN_MEASUREMENT_TYPE'].includes(measurementType);
}

export function isNumericalMetric(metric: Metric) {
  return isNumericalMeasurementType(metric.measurementType);
}
