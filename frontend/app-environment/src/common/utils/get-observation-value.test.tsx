import { mockNormalizedObservation } from '../test-helpers';

import { getObservationValue } from '.';

const [mockObservation] = mockNormalizedObservation;
const observation = { ...mockObservation, valueString: JSON.stringify({ key: { nestedKey: 'value' } }) };

describe('getObservationValue', () => {
  it('returns the raw value', () => {
    expect(getObservationValue(observation, undefined)).toBe(observation.valueString);
  });

  it('allows to fetch nested attributes', () => {
    expect(getObservationValue(observation, 'key.nestedKey')).toBe('value');
  });

  it('allows to fetch nested attributes', () => {
    expect(getObservationValue(observation, 'key')).not.toEqual({ nestedKey: 'value' });
    expect(getObservationValue(observation, 'key')).toBe(JSON.stringify({ nestedKey: 'value' }));
  });
});
