import {
  clearUnitPreferenceLocalStorage,
  setUnitPreferenceLocalStorage,
} from '@plentyag/app-environment/src/common/hooks/use-local-storage-units-preferences/test-helpers';
import { mockMeasurementTypes } from '@plentyag/core/src/farm-def/test-helpers';
import { useSwrAxios } from '@plentyag/core/src/hooks';
import { renderHook } from '@testing-library/react-hooks';

import { useUnitConversion } from '.';

jest.mock('@plentyag/core/src/hooks/use-swr-axios');

const mockUseSwrAxios = useSwrAxios as jest.Mock;

const temperature = mockMeasurementTypes.find(measuremtType => measuremtType.key === 'TEMPERATURE');

describe('useUnitConversion', () => {
  beforeEach(() => {
    clearUnitPreferenceLocalStorage();
    mockUseSwrAxios.mockRestore();
  });

  it('returns the fetched measurement types', () => {
    mockUseSwrAxios.mockReturnValue({ data: mockMeasurementTypes });

    const { result } = renderHook(() => useUnitConversion());

    expect(result.current.measurementTypes).toEqual(mockMeasurementTypes);
  });

  it("doesn't convert when there is no preferred unit", () => {
    mockUseSwrAxios.mockReturnValue({ data: mockMeasurementTypes });

    const { result } = renderHook(() => useUnitConversion());

    expect(result.current.convertToDefaultUnit(32, temperature)).toBe(32);
    expect(result.current.convertToDefaultUnit(32, 'TEMPERATURE')).toBe(32);
    expect(result.current.convertToPreferredUnit(32, temperature)).toBe(32);
    expect(result.current.convertToPreferredUnit(32, 'TEMPERATURE')).toBe(32);
  });

  it("doesn't convert when the preferred unit is the default unit", () => {
    setUnitPreferenceLocalStorage({ TEMPERATURE: 'C' });
    mockUseSwrAxios.mockReturnValue({ data: mockMeasurementTypes });

    const { result } = renderHook(() => useUnitConversion());

    expect(result.current.convertToDefaultUnit(32, temperature)).toBe(32);
    expect(result.current.convertToDefaultUnit(32, 'TEMPERATURE')).toBe(32);
    expect(result.current.convertToPreferredUnit(32, temperature)).toBe(32);
    expect(result.current.convertToPreferredUnit(32, 'TEMPERATURE')).toBe(32);
  });

  it("doesn't convert when the value is null or value is undefined", () => {
    mockUseSwrAxios.mockReturnValue({ data: mockMeasurementTypes });

    const { result } = renderHook(() => useUnitConversion());

    expect(result.current.convertToDefaultUnit(null, temperature)).toBe(null);
    expect(result.current.convertToDefaultUnit(undefined, 'TEMPERATURE')).toBe(undefined);
    expect(result.current.convertToPreferredUnit(null, temperature)).toBe(null);
    expect(result.current.convertToPreferredUnit(undefined, 'TEMPERATURE')).toBe(undefined);
  });

  it('throws an error when the given MeasurementType key is invalid', () => {
    setUnitPreferenceLocalStorage({ TEMPERATURE: 'F' });
    mockUseSwrAxios.mockReturnValue({ data: mockMeasurementTypes });

    const { result } = renderHook(() => useUnitConversion());

    expect(() => result.current.convertToDefaultUnit(32, 'INVALID')).toThrow();
    expect(() => result.current.convertToPreferredUnit(32, 'INVALID')).toThrow();
  });

  it('converts to the default unit', () => {
    setUnitPreferenceLocalStorage({ TEMPERATURE: 'F' });
    mockUseSwrAxios.mockReturnValue({ data: mockMeasurementTypes });

    const { result } = renderHook(() => useUnitConversion());

    expect(result.current.convertToDefaultUnit(32, temperature)).toBe(0);
    expect(result.current.convertToDefaultUnit(32, 'TEMPERATURE')).toBe(0);
    expect(result.current.convertToPreferredUnit(0, temperature)).toBe(32);
    expect(result.current.convertToPreferredUnit(0, 'TEMPERATURE')).toBe(32);
  });

  it('returns the concrete MeasurementType from its key', () => {
    mockUseSwrAxios.mockReturnValue({ data: mockMeasurementTypes });

    const { result } = renderHook(() => useUnitConversion());

    expect(result.current.getConcreteMeasurementType('TEMPERATURE')).toEqual(temperature);
    expect(result.current.getConcreteMeasurementType(temperature)).toEqual(temperature);
  });
});
