import { NormalizedObservation } from '@plentyag/core/src/types';
import { get } from 'lodash';

export function getObservationValue(observation: NormalizedObservation, valueAttribute) {
  const rawValue = observation.valueString;

  try {
    const value = get(JSON.parse(rawValue), valueAttribute, rawValue);

    if (typeof value === 'object') {
      return JSON.stringify(value);
    }

    return value;
  } catch (JSON) {
    return rawValue;
  }
}
