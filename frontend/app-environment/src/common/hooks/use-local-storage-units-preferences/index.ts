import { isMeasurementType } from '@plentyag/core/src/farm-def/type-guards';
import { FarmDefMeasurementType, FarmDefMeasurementUnit } from '@plentyag/core/src/farm-def/types';
import { useLocalStorage } from 'react-use';

export const UNITS_PREFERENCE_KEY = 'environment-v2-units-preferences';

export interface UseLocalStorageUnitsPreferencesReturn {
  getPreferredUnitName: (measurementTypeOrKey: FarmDefMeasurementType | string) => string;
  setPreferredUnit: (measuremenType: FarmDefMeasurementType, unit: FarmDefMeasurementUnit) => void;
}

export const useLocalStorageUnitsPreferences = (): UseLocalStorageUnitsPreferencesReturn => {
  const [unitsPreferences, setUnitsPreferences] = useLocalStorage<{ [key: string]: string }>(UNITS_PREFERENCE_KEY, {});

  return {
    getPreferredUnitName: measurementTypeOrKey => {
      if (!measurementTypeOrKey) {
        return undefined;
      }

      if (isMeasurementType(measurementTypeOrKey)) {
        return unitsPreferences[measurementTypeOrKey.key];
      }

      return unitsPreferences[measurementTypeOrKey];
    },

    setPreferredUnit: (measurementType, unit) => {
      setUnitsPreferences({
        ...unitsPreferences,
        [measurementType.key]: unit.unit,
      });
    },
  };
};
