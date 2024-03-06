import {
  NormalizedObservation,
  Observation,
  ObservationStats,
  RolledUpByTimeObservation,
} from '@plentyag/core/src/types';

export const mockObservations: Observation[] = [
  {
    datumValue: 'SOFTWARE',
    datumMeasurementType: 'UNKNOWN_MEASUREMENT_TYPE',
    datumUnit: 'UNKNOWN_UNITS',
    observedAt: '2022-11-23T17:32:36.796Z',
    createdAt: '2022-11-23T17:32:36.943Z',
    deviceId: '93dd7ccf-df56-4c8b-b463-5d5ed550ec2c',
    objectId: '',
    clientId: '93dd7ccf-df56-4c8b-b463-5d5ed550ec2c',
    path: 'sites/TEST/areas/CPROC/lines/CentralProcessing/machines/Washer/deviceLocations/TestHathor',
    name: 'HathorDeviceRebooted',
    otherProperties: { rebootNumber: '1344.0' },
  },
];

export const mockNormalizedObservation: NormalizedObservation[] = [
  {
    clientId: 'clientId1',
    containerId: 'containerId1',
    containerLocationRef: 'containerLocationRef1',
    createdAt: '2021-01-01T00:00:00',
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
    observedAt: '2021-01-01 00:00:00', // ODS/Snowflake returns date in this format.
    otherProperties: {},
    path: 'sites/SSF2',
    predictionValidAt: 'predictionValidAt1',
    rawObservation: {},
    units: 'units1',
    valueDataType: 'float',
    valueNumeric: 3,
    valueString: '',
    isNumericValue: true,
  },
];

export const buildNormalizedObservation = ({
  observedAt,
  ...props
}: Partial<NormalizedObservation>): NormalizedObservation => ({
  clientId: 'clientId1',
  containerId: 'containerId1',
  containerLocationRef: 'containerLocationRef1',
  createdAt: '2021-01-01T00:00:00',
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
  observedAt,
  otherProperties: {},
  path: 'sites/LAX1',
  predictionValidAt: 'predictionValidAt1',
  rawObservation: {},
  units: 'units1',
  valueDataType: 'float',
  valueNumeric: 3,
  valueString: '',
  isNumericValue: true,
  ...props,
});

export const mockRolledUpByTimeObservations: RolledUpByTimeObservation[] = [
  {
    rolledUpAt: '2022-01-01T00:00:00Z',
    mean: 10,
    median: 20,
    min: 30,
    max: 40,
    measurementType: 'TEMPERATURE',
    units: 'C',
    observationName: 'AirTemperature',
  },
  {
    rolledUpAt: '2022-01-01T00:15:00Z',
    mean: 10,
    median: 20,
    min: 30,
    max: 40,
    measurementType: 'TEMPERATURE',
    units: 'C',
    observationName: 'AirTemperature',
  },
];

export const mockObservationStats: ObservationStats = {
  min: 10.111,
  max: 15.222,
  median: 20.333,
  mean: 25.444,
  stddev: 30.555,
  count: 1337,
};

export interface BuildRolledUpByTimeObservation {
  rolledUpAt: string;
  mean?: number;
  median?: number;
  min?: number;
  max?: number;
  value?: string;
  valueCount?: number;
  noData?: boolean;
}

export const buildRolledUpByTimeObservation = ({
  rolledUpAt,
  mean = 10,
  median = 20,
  min = 30,
  max = 40,
  value,
  valueCount,
  noData,
}: BuildRolledUpByTimeObservation): RolledUpByTimeObservation => {
  return {
    rolledUpAt,
    mean,
    median,
    min,
    max,
    measurementType: 'TEMPERATURE',
    units: 'C',
    observationName: 'AirTemperature',
    value,
    valueCount,
    noData,
  };
};
