import { mockMeasurementTypes } from '@plentyag/core/src/farm-def/test-helpers';
import { act, renderHook } from '@testing-library/react-hooks';

import { useLocalStorageUnitsPreferences } from '.';

const temperature = mockMeasurementTypes.find(measuremenType => measuremenType.name === 'Temperature');
const celsius = temperature.supportedUnits['C'];
const fahrenheit = temperature.supportedUnits['F'];

describe('useLocalStorageUnitsPreferences', () => {
  it('returns undefined when no preference has been chosen for a given measurementType', () => {
    const { result } = renderHook(() => useLocalStorageUnitsPreferences());

    expect(result.current.getPreferredUnitName('TEMPERATURE')).toBeUndefined();
  });

  it("returns the MeasurementType's preferred unit", () => {
    const { result } = renderHook(() => useLocalStorageUnitsPreferences());

    expect(result.current.getPreferredUnitName('TEMPERATURE')).toBeUndefined();
    expect(result.current.getPreferredUnitName(temperature)).toBeUndefined();

    act(() => result.current.setPreferredUnit(temperature, celsius));

    expect(result.current.getPreferredUnitName('TEMPERATURE')).toBe('C');
    expect(result.current.getPreferredUnitName(temperature)).toBe('C');

    act(() => result.current.setPreferredUnit(temperature, fahrenheit));

    expect(result.current.getPreferredUnitName('TEMPERATURE')).toBe('F');
    expect(result.current.getPreferredUnitName(temperature)).toBe('F');
  });
});
