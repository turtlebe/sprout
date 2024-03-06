export type AnyObservation = Observation | NormalizedObservation | RolledUpByTimeObservation;

/**
 * Raw Observation Model as they are in ObservationIngest or on the Kinesis Stream.
 */
export interface Observation {
  clientId: string;
  createdAt: string;
  datumMeasurementType: string;
  datumUnit: string;
  datumValue: string;
  deviceId: string;
  name: string;
  objectId: string;
  observedAt: string;
  otherProperties: any;
  path: string;
}

/**
 * Once Observations land in Snowflake (after the Kinesis Stream), they follow the following model:
 */
export interface NormalizedObservation {
  clientId: string;
  containerId: string;
  containerLocationRef: string;
  createdAt: string;
  derivedFrom: string;
  deviceId: string;
  eventId: string;
  eventType: string;
  isPrediction: boolean;
  material: string;
  materialId: string;
  materialRegionType: string;
  measurementType: string;
  numericValue: boolean;
  objectId: string;
  observationId: string;
  observationName: string;
  observedAt: string;
  otherProperties: any;
  path: string;
  predictionValidAt: string;
  rawObservation: any;
  units: string;
  valueDataType: string;
  valueNumeric: number;
  valueString: string;
  isNumericValue: boolean;
}

/**
 * Model provided by ObservationDigestService when performing aggregation on top of NormalizedObservation.
 *
 * Aggregations can be mean, median, min max over a certain time granularity.
 */
export interface RolledUpByTimeObservation<RolledUpAtType = string> {
  rolledUpAt: RolledUpAtType;
  mean: number;
  median: number;
  min: number;
  max: number;
  value?: string;
  valueCount?: number;
  measurementType: string;
  units: string;
  observationName: string;
  clientId?: string;
  deviceId?: string;
  tagPath?: string;

  /**
   * Frontend only attribute that is used to indicate that we don't have data at this `rolledUpAt` timestamp.
   */
  noData?: boolean;
}

/**
 * Model provided by ObservationDigestService to provide count and freshness statistics for Observations.
 */
export interface ObservationGroup {
  path: string;
  measurementType: string;
  observationName: string;
  count: number;
  lastObservedAt: string;
}

/**
  Model provided by ObservationDigestService to provide statistics related to observations
 */
export interface ObservationStats {
  mean: number;
  median: number;
  min: number;
  max: number;
  stddev: number;
  count: number;
}
