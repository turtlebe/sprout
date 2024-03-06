import {
  AnyObservation,
  NormalizedObservation,
  Observation,
  RolledUpByTimeObservation,
} from '@plentyag/core/src/types';
import { SourceType } from '@plentyag/core/src/types/environment';
import { isNormalizedObservation, isRolledUpByTimeObservation } from '@plentyag/core/src/types/type-guards';

export function getSourceTypeForRolledUpByTimeObservation(observation: RolledUpByTimeObservation): SourceType {
  if (!observation) {
    return SourceType.other;
  }

  if (observation.tagPath) {
    return SourceType.ignition;
  }

  if (observation.deviceId) {
    return SourceType.device;
  }

  if (
    observation?.clientId === 'derived_observation_service' ||
    (observation?.clientId?.length === 30 && observation.observationName.includes('Derived'))
  ) {
    return SourceType.derived;
  }

  return SourceType.other;
}

export function getSourceTypeForNormalizedObservation(observation: NormalizedObservation): SourceType {
  if (!observation) {
    return SourceType.other;
  }

  if (observation.otherProperties?.tagPath) {
    return SourceType.ignition;
  }

  if (observation.deviceId) {
    return SourceType.device;
  }

  if (
    observation?.clientId === 'derived_observation_service' ||
    (observation?.clientId?.length === 30 && observation.observationName.includes('Derived'))
  ) {
    return SourceType.derived;
  }

  return SourceType.other;
}

export function getSourceTypeForObservation(observation: Observation): SourceType {
  if (!observation) {
    return SourceType.other;
  }

  if (observation.otherProperties?.tagPath) {
    return SourceType.ignition;
  }

  if (observation.deviceId) {
    return SourceType.device;
  }

  if (
    observation?.clientId === 'derived_observation_service' ||
    (observation?.clientId?.length === 30 && observation.name.includes('Derived'))
  ) {
    return SourceType.derived;
  }

  return SourceType.other;
}

/**
 * Look at the clientId, deviceId, tagPath attributes on an Observation to determine its source.
 */
export function getSourceType(observation: AnyObservation): SourceType {
  if (isRolledUpByTimeObservation(observation)) {
    return getSourceTypeForRolledUpByTimeObservation(observation);
  }

  if (isNormalizedObservation(observation)) {
    return getSourceTypeForNormalizedObservation(observation);
  }

  return getSourceTypeForObservation(observation);
}
