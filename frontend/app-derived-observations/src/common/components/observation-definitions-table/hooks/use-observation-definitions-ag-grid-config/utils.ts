export const commonFields = {
  streamName: 'streamName',
  path: 'path',
  observationName: 'observationName',
  window: 'window',
  output: 'output',
  createdBy: 'createdBy',
  updatedBy: 'updatedBy',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
};

export const baseFields = {
  ...commonFields,
  aggregation: 'aggregation',
  comment: 'comment',
};

export const derivedFields = {
  ...commonFields,
  sourceStreamNames: 'sourceStreamNames',
  expression: 'expression',
  measurementType: 'outputMeasurementType',
  unit: 'outputMeasurementTypeUnits',
};
