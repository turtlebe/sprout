import { ObservationStats } from '@plentyag/core/src/types';
import { ConvertUnitFunction } from '@plentyag/core/src/types/environment';

/**
 * Using the given conversion function, copy the Observation and convert all its relevant attributes.
 */
export const convertUnitForObservationStats: ConvertUnitFunction<ObservationStats> =
  conversionFn => observationStats => {
    return {
      ...observationStats,
      mean: conversionFn(observationStats?.mean),
      median: conversionFn(observationStats?.median),
      min: conversionFn(observationStats?.min),
      max: conversionFn(observationStats?.max),
      stddev: conversionFn(observationStats?.stddev),
    };
  };
