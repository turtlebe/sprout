import {
  mockNormalizedObservation,
  mockObservations,
  mockRolledUpByTimeObservations,
} from '@plentyag/app-environment/src/common/test-helpers';
import { AnyObservation } from '@plentyag/core/src/types';
import { SourceType } from '@plentyag/core/src/types/environment';

import { getSourceType } from './get-source-type';

interface ObservationsByType {
  [key: string]: AnyObservation;
}

const [observation] = mockObservations;
const [normalizedObservation] = mockNormalizedObservation;
const [rolledUpByTimeObservation] = mockRolledUpByTimeObservations;

function getObservationFor(source: SourceType, observationType: 'raw' | 'normalized' | 'rolledup') {
  let observationsByType: ObservationsByType = {
    [SourceType.device]: { ...observation, deviceId: 'device-id' },
    [SourceType.ignition]: { ...observation, deviceId: '', otherProperties: { tagPath: 'tag-path' } },
    [SourceType.derived]: { ...observation, deviceId: undefined, clientId: 'derived_observation_service' },
    [SourceType.other]: { ...observation, deviceId: undefined },
  };

  if (observationType === 'normalized') {
    observationsByType = {
      [SourceType.device]: { ...normalizedObservation, deviceId: 'device-id' },
      [SourceType.ignition]: { ...normalizedObservation, otherProperties: { tagPath: 'tag-path' } },
      [SourceType.derived]: { ...normalizedObservation, deviceId: undefined, clientId: 'derived_observation_service' },
      [SourceType.other]: { ...normalizedObservation, deviceId: undefined },
    };
  }

  if (observationType === 'rolledup') {
    observationsByType = {
      [SourceType.device]: { ...rolledUpByTimeObservation, deviceId: 'device-id' },
      [SourceType.ignition]: { ...rolledUpByTimeObservation, tagPath: 'tag-path' },
      [SourceType.derived]: { ...rolledUpByTimeObservation, clientId: 'derived_observation_service' },
      [SourceType.other]: { ...rolledUpByTimeObservation },
    };
  }

  return observationsByType[source];
}

describe('getSourceType', () => {
  it('returns SourceType.device', () => {
    expect(getSourceType(getObservationFor(SourceType.device, 'raw'))).toBe(SourceType.device);
    expect(getSourceType(getObservationFor(SourceType.device, 'normalized'))).toBe(SourceType.device);
    expect(getSourceType(getObservationFor(SourceType.device, 'rolledup'))).toBe(SourceType.device);
  });

  it('returns SourceType.ignition', () => {
    expect(getSourceType(getObservationFor(SourceType.ignition, 'raw'))).toBe(SourceType.ignition);
    expect(getSourceType(getObservationFor(SourceType.ignition, 'normalized'))).toBe(SourceType.ignition);
    expect(getSourceType(getObservationFor(SourceType.ignition, 'rolledup'))).toBe(SourceType.ignition);
  });

  it('returns SourceType.derived', () => {
    expect(getSourceType(getObservationFor(SourceType.derived, 'raw'))).toBe(SourceType.derived);
    expect(getSourceType(getObservationFor(SourceType.derived, 'normalized'))).toBe(SourceType.derived);
    expect(getSourceType(getObservationFor(SourceType.derived, 'rolledup'))).toBe(SourceType.derived);

    expect(
      getSourceType({
        ...normalizedObservation,
        deviceId: undefined,
        clientId: 'BVRfXRxYmP4q4D3R7cHXHiKrj15EsK',
        observationName: 'TemperatureDerived',
      })
    ).toBe(SourceType.derived);
  });

  it('returns SourceType.other', () => {
    expect(getSourceType(null)).toBe(SourceType.other);
    expect(getSourceType(getObservationFor(SourceType.other, 'raw'))).toBe(SourceType.other);
    expect(getSourceType(getObservationFor(SourceType.other, 'normalized'))).toBe(SourceType.other);
    expect(getSourceType(getObservationFor(SourceType.other, 'rolledup'))).toBe(SourceType.other);
  });
});
