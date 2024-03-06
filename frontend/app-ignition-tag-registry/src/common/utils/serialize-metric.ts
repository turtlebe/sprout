import { FarmDefMeasurementType } from '@plentyag/core/src/farm-def/types';

export interface SerializeMetricOptions {
  isUpdating?: boolean;
  username: string;
  convertToDefaultUnit: (value: string, measurementType: string | FarmDefMeasurementType) => number;
}
export function serializeMetric(tag, { username, isUpdating, convertToDefaultUnit }: SerializeMetricOptions) {
  const createdOrUpdatedBy = isUpdating ? 'updatedBy' : 'createdBy';

  return {
    path: tag.path,
    measurementType: tag.measurementType.key,
    observationName: tag.measurementName,
    unitConfig: {
      min: convertToDefaultUnit(tag.min, tag.measurementType.key),
      max: convertToDefaultUnit(tag.max, tag.measurementType.key),
    },
    [createdOrUpdatedBy]: username,
  };
}
