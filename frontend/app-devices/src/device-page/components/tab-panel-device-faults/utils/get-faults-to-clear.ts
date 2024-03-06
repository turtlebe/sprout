import { NormalizedObservation } from '@plentyag/core/src/types';

export function getFaultsToClear(observation: NormalizedObservation): object {
  return { faults: JSON.parse(observation?.otherProperties?.faults ?? '{}') };
}
