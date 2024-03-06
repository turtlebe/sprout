import { FarmDefMeasurementType } from '@plentyag/core/src/farm-def/types';

/**
 * From a MeasurementType, returns the preferred unit if it exsits within the MeasurementType,
 * otherwise returns the defaultUnit.
 */
export function getPreferredUnit(measurementType: FarmDefMeasurementType, preferredUnitName: string) {
  const preferredUnit = measurementType.supportedUnits[preferredUnitName];

  if (!preferredUnit) {
    return measurementType.supportedUnits[measurementType.defaultUnit];
  }

  return preferredUnit;
}
