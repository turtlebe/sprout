export enum WindowDuration {
  oneMinute = 'ONE_MINUTE',
  fiveMinutes = 'FIVE_MINUTES',
  tenMinutes = 'TEN_MINUTES',
  fifteenMinutes = 'FIFTEEN_MINUTES',
  thirtyMinutes = 'THIRTY_MINUTES',
  sixtyMinutes = 'SIXTY_MINUTES',
}

export enum Output {
  boolean = 'BOOLEAN',
  double = 'DOUBLE',
}

export enum Aggregation {
  min = 'MIN',
  max = 'MAX',
  mean = 'MEAN',
  count = 'COUNT',
  interpolate = 'INTERPOLATE',
  uptime = 'UPTIME',
  binaryRatio = 'BINARY_RATIO',
}

export interface DefaultModel {
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface SourceObservationDefinition extends DefaultModel {
  type: 'BaseObservationDefinition' | 'DerivedObservationDefinition';
  id: string;
  streamName: string;
  observationKey: {
    path: string;
    observationName: string;
  };
  window: WindowDuration;
  output: Output;
  dependents: DerivedObservationDefinition[];
}

export interface BaseObservationDefinition extends SourceObservationDefinition {
  aggregation: Aggregation;
  comment: string;
}

export interface DerivedObservationDefinition extends SourceObservationDefinition {
  sourceStreamNames: string[];
  expression: string;
  outputMeasurementType: string;
  outputMeasurementTypeUnits: string;
  dependencies: (BaseObservationDefinition | DerivedObservationDefinition)[];
}
