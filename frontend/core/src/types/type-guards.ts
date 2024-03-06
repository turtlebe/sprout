import { AnyObservation, NormalizedObservation, Observation, RolledUpByTimeObservation } from './observation';

export function isRolledUpByTimeObservation(observation: AnyObservation): observation is RolledUpByTimeObservation {
  return observation && observation.hasOwnProperty('rolledUpAt');
}

export function isNormalizedObservation(observation: AnyObservation): observation is NormalizedObservation {
  return observation && observation.hasOwnProperty('observedAt') && observation.hasOwnProperty('measurementType');
}

export function isObservation(observation: AnyObservation): observation is Observation {
  return observation && observation.hasOwnProperty('observedAt') && observation.hasOwnProperty('datumMeasurementType');
}
