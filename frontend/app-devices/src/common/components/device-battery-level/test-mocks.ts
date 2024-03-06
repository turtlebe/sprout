import { NormalizedObservation } from '@plentyag/core/src/types';

export const emptyBatteryObservation: NormalizedObservation = {
  clientId: 'clientId1',
  containerId: 'containerId1',
  containerLocationRef: 'containerLocationRef1',
  createdAt: 'createdAt1',
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
  observationId: 'observationId1',
  observationName: 'BatteryVoltage',
  observedAt: null,
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

export const lowBatteryObservation: NormalizedObservation = {
  ...emptyBatteryObservation,
  valueNumeric: 3.333,
};

export const mediumBatteryObservation: NormalizedObservation = {
  ...emptyBatteryObservation,
  valueNumeric: 3.5,
};

export const highBatteryObservation: NormalizedObservation = {
  ...emptyBatteryObservation,
  valueNumeric: 3.68,
};

export const fullBatteryObservation: NormalizedObservation = {
  ...emptyBatteryObservation,
  valueNumeric: 4.2,
};

export const sprinkle1EmptyBatteryObservation: NormalizedObservation = {
  ...emptyBatteryObservation,
  valueNumeric: 2,
};

export const sprinkle1LowBatteryObservation: NormalizedObservation = {
  ...emptyBatteryObservation,
  valueNumeric: 2.5,
};

export const sprinkle1MediumBatteryObservation: NormalizedObservation = {
  ...emptyBatteryObservation,
  valueNumeric: 2.71,
};

export const sprinkle1HighBatteryObservation: NormalizedObservation = {
  ...emptyBatteryObservation,
  valueNumeric: 2.84,
};

export const sprinkle1FullBatteryObservation: NormalizedObservation = {
  ...emptyBatteryObservation,
  valueNumeric: 3,
};
