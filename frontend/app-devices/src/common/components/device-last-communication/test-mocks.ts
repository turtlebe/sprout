import { NormalizedObservation } from '@plentyag/core/src/types';

export const mockObservation: NormalizedObservation = {
  clientId: 'clientId1',
  containerId: 'containerId1',
  containerLocationRef: 'containerLocationRef1',
  createdAt: '2021-01-01 08:00:00.000', // Server serves SQL time in UTC zone
  derivedFrom: 'derivedFrom1',
  deviceId: 'deviceId1',
  eventId: 'eventId1',
  eventType: 'eventType1',
  isPrediction: false,
  material: 'material1',
  materialId: 'materialId1',
  materialRegionType: 'materialRegionType1',
  measurementType: 'measurementType1',
  numericValue: false,
  objectId: 'objectId1',
  observationId: 'observationId',
  observationName: 'BatteryVoltage',
  observedAt: '2021-01-01 08:00:00.000', // Server serves SQL time in UTC zone
  otherProperties: {},
  path: 'path1',
  predictionValidAt: 'predictionValidAt1',
  rawObservation: {},
  units: 'units1',
  valueDataType: 'float',
  valueNumeric: 3,
  valueString: '',
  isNumericValue: true,
};
