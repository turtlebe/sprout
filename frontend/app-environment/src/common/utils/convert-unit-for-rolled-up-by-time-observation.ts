import { RolledUpByTimeObservation } from '@plentyag/core/src/types';
import { ConvertUnitFunction } from '@plentyag/core/src/types/environment';

/**
 * Using the given conversion function, copy the Observation and convert all its relevant attributes.
 */
export const convertUnitForRolledUpByTimeObservation: ConvertUnitFunction<RolledUpByTimeObservation> =
  conversionFn => observation => {
    return {
      ...observation,
      mean: conversionFn(observation.mean),
      median: conversionFn(observation.median),
      min: conversionFn(observation.min),
      max: conversionFn(observation.max),
    };
  };
