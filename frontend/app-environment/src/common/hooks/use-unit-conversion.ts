import { isMeasurementType } from '@plentyag/core/src/farm-def/type-guards';
import { FarmDefMeasurementType, FarmDefMeasurementUnit } from '@plentyag/core/src/farm-def/types';
import { useFetchMeasurementTypes } from '@plentyag/core/src/hooks/use-fetch-measurement-types';
import { YAxisValueType } from '@plentyag/core/src/types/environment';
import { isNil } from 'lodash';
import { evaluate } from 'mathjs';

import { getPreferredUnit as getPreferredUnitUtils } from '../utils';

import { useLocalStorageUnitsPreferences } from './use-local-storage-units-preferences';

export interface UseUnitConversionReturn {
  convertToDefaultUnit: (value: YAxisValueType, measurementType: FarmDefMeasurementType | string) => number;
  convertToPreferredUnit: (value: YAxisValueType, measurementType: FarmDefMeasurementType | string) => number;
  measurementTypes: FarmDefMeasurementType[];
  getConcreteMeasurementType: (measurementTypeOrKey: FarmDefMeasurementType | string) => FarmDefMeasurementType;
  getPreferredUnit: (measurementTypeOrKey: string | FarmDefMeasurementType) => FarmDefMeasurementUnit;
}

/**
 * Hook that provides two calback to convert values to the default unit or the preferred unit.
 *
 * This hook pulls MeasurementType from farm-def and cache them for throttle that query for 1 minute.
 */
export const useUnitConversion = (): UseUnitConversionReturn => {
  const { getPreferredUnitName } = useLocalStorageUnitsPreferences();
  const { measurementTypes } = useFetchMeasurementTypes();

  const getConcreteMeasurementType: UseUnitConversionReturn['getConcreteMeasurementType'] = measurementTypeOrKey =>
    isMeasurementType(measurementTypeOrKey)
      ? measurementTypeOrKey
      : measurementTypes.find(measurementType => measurementType.key === measurementTypeOrKey);

  const getPreferredUnit: UseUnitConversionReturn['getPreferredUnit'] = measurementTypeOrKey => {
    if (measurementTypes.length === 0 && !isMeasurementType(measurementTypeOrKey)) {
      throw new Error(
        'No MeasurementTypes were found, please call useFetchMeasurementTypes() earlier in the app lifecycle.'
      );
    }

    const measurementType = getConcreteMeasurementType(measurementTypeOrKey);

    if (!measurementType) {
      throw new Error(`Cannot find MeasurementType for ${measurementTypeOrKey}`);
    }

    return getPreferredUnitUtils(measurementType, getPreferredUnitName(measurementType));
  };

  const convertToDefaultUnit: UseUnitConversionReturn['convertToDefaultUnit'] = (value, measurementTypeOrKey) => {
    const measurementType = getConcreteMeasurementType(measurementTypeOrKey);
    const preferredUnit = getPreferredUnit(measurementType);

    if (measurementType.defaultUnit === 'NONE' || isNil(value)) {
      return value;
    }

    return evaluate(preferredUnit.conversionToDefaultUnit.replace('X', value.toString()));
  };

  const convertToPreferredUnit: UseUnitConversionReturn['convertToPreferredUnit'] = (value, measurementTypeOrKey) => {
    const measurementType = getConcreteMeasurementType(measurementTypeOrKey);
    const preferredUnit = getPreferredUnit(measurementType);

    if (measurementType.defaultUnit === 'NONE' || isNil(value)) {
      return value;
    }

    return evaluate(preferredUnit.conversionFromDefaultUnit.replace('X', value.toString()));
  };

  return {
    convertToDefaultUnit,
    convertToPreferredUnit,
    measurementTypes,
    getConcreteMeasurementType,
    getPreferredUnit,
  };
};
