import { NormalizedObservation, Observation, RolledUpByTimeObservation } from '.';

import { isNormalizedObservation, isObservation, isRolledUpByTimeObservation } from './type-guards';

const observation = {
  datumMeasurementType: 'TEMPERATURE',
  observedAt: '2022-01-01T00:00:00Z',
} as unknown as Observation;
const normalizedObservation = {
  measurementType: 'TEMPERATURE',
  observedAt: '2022-01-01T00:00:00Z',
} as unknown as NormalizedObservation;
const rolledUpByTimeObservation = { rolledUpAt: '2022-01-01T00:00:00Z' } as unknown as RolledUpByTimeObservation;

describe('isObservation', () => {
  it('returns true', () => {
    expect(isObservation(observation)).toBe(true);
  });

  it('returns false', () => {
    expect(isObservation(normalizedObservation)).toBe(false);
    expect(isObservation(rolledUpByTimeObservation)).toBe(false);
  });
});

describe('isNormalizedObservation', () => {
  it('returns true', () => {
    expect(isNormalizedObservation(normalizedObservation)).toBe(true);
  });

  it('returns false', () => {
    expect(isNormalizedObservation(observation)).toBe(false);
    expect(isNormalizedObservation(rolledUpByTimeObservation)).toBe(false);
  });
});

describe('isRolledUpByTimeObservation', () => {
  it('returns true', () => {
    expect(isRolledUpByTimeObservation(rolledUpByTimeObservation)).toBe(true);
  });

  it('returns false', () => {
    expect(isRolledUpByTimeObservation(observation)).toBe(false);
    expect(isRolledUpByTimeObservation(normalizedObservation)).toBe(false);
  });
});
