import { BaseObservationDefinition, DerivedObservationDefinition } from '.';

export function isBaseObservationDefinition(
  definition: BaseObservationDefinition | DerivedObservationDefinition
): definition is BaseObservationDefinition {
  return definition && definition.hasOwnProperty('aggregation');
}

export function isDerivedObservationDefinition(
  definition: BaseObservationDefinition | DerivedObservationDefinition
): definition is DerivedObservationDefinition {
  return definition && definition.hasOwnProperty('expression');
}
