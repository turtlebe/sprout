import { Metric } from '@plentyag/core/src/types/environment';
import { getShortenedPath } from '@plentyag/core/src/utils';
import { titleCase } from 'voca';

/** Return a user-friendly label to identify a {@link Metric}. */
export function getMetricLabel(metric: Metric): string {
  if (!metric) {
    return '';
  }

  return `${getShortenedPath(metric.path)} - ${titleCase(metric.measurementType)} - ${metric.observationName}`;
}
