import { mockMeasurementTypes } from '@plentyag/core/src/farm-def/test-helpers';
import { useSwrAxios } from '@plentyag/core/src/hooks';
import { renderHook } from '@testing-library/react-hooks';

import { useFetchMeasurementTypes } from '.';

jest.mock('@plentyag/core/src/hooks');

const mockUseSwrAxios = useSwrAxios as jest.Mock;

describe('useFetchMeasurementTypes', () => {
  beforeEach(() => {
    mockUseSwrAxios.mockRestore();
  });

  it('returns a loading state', () => {
    mockUseSwrAxios.mockReturnValue({ data: undefined, isValidating: true });

    const { result } = renderHook(() => useFetchMeasurementTypes());

    expect(result.current.isLoading).toBe(true);
    expect(result.current.measurementTypes).toBeUndefined();
  });

  it('sets isLoading as false when revalidating the data', () => {
    mockUseSwrAxios.mockReturnValue({ data: mockMeasurementTypes, isValidating: true });

    const { result } = renderHook(() => useFetchMeasurementTypes());

    expect(result.current.isLoading).toBe(false);
    expect(result.current.measurementTypes).toEqual(mockMeasurementTypes);
  });

  it('returns measurement-types', () => {
    mockUseSwrAxios.mockReturnValue({ data: mockMeasurementTypes, isValidating: false });

    const { result } = renderHook(() => useFetchMeasurementTypes());

    expect(result.current.isLoading).toBe(false);
    expect(result.current.measurementTypes).toEqual(mockMeasurementTypes);
  });
});
