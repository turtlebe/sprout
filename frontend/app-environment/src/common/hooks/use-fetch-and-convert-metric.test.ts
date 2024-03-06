import {
  clearUnitPreferenceLocalStorage,
  setUnitPreferenceLocalStorage,
} from '@plentyag/app-environment/src/common/hooks/use-local-storage-units-preferences/test-helpers';
import { mockMetrics } from '@plentyag/app-environment/src/common/test-helpers';
import { useSwrAxios } from '@plentyag/core/src/hooks';
import { mockUseFetchMeasurementTypes } from '@plentyag/core/src/hooks/use-fetch-measurement-types/test-helpers';
import { renderHook } from '@testing-library/react-hooks';

import { useFetchAndConvertMetric } from '.';

jest.mock('@plentyag/core/src/hooks/use-swr-axios');

const mockUseSwrAxios = useSwrAxios as jest.Mock;

const [metric] = mockMetrics;

mockUseFetchMeasurementTypes();

describe('useFetchAndConvertMetric', () => {
  beforeEach(() => {
    clearUnitPreferenceLocalStorage();
    mockUseSwrAxios.mockRestore();
  });

  it('returns the swrAxios response without converting the data', () => {
    const response = { data: metric, isValidating: false, error: undefined };
    mockUseSwrAxios.mockReturnValue(response);

    const { result } = renderHook(() => useFetchAndConvertMetric(metric.id));

    expect(result.current).toEqual(response);
  });

  it('returns the swrAxios response without converting the data', () => {
    const response = { data: undefined, isValidating: true, error: 'error' };
    mockUseSwrAxios.mockReturnValue(response);

    const { result } = renderHook(() => useFetchAndConvertMetric(metric.id));

    expect(result.current).toEqual(response);
  });

  it('returns the swrAxios response without converting the data when there is not preferred unit', () => {
    const response = { data: metric };
    mockUseSwrAxios.mockReturnValue(response);

    const { result } = renderHook(() => useFetchAndConvertMetric(metric.id));

    expect(result.current).toEqual(response);
  });

  it('returns the swrAxios response without converting the data when the preferred unit is the default unit', () => {
    setUnitPreferenceLocalStorage({ TEMPERATURE: 'C' });
    const response = { data: metric };
    mockUseSwrAxios.mockReturnValue(response);

    const { result } = renderHook(() => useFetchAndConvertMetric(metric.id));

    expect(result.current).toEqual(response);
    expect(result.current.data.unitConfig.min).toBe(0);
    expect(result.current.data.unitConfig.max).toBe(35);
  });

  it('returns the swrAxios response and convert everything to the preferred unit', () => {
    setUnitPreferenceLocalStorage({ TEMPERATURE: 'F' });
    const response = { data: metric };
    mockUseSwrAxios.mockReturnValue(response);

    const { result } = renderHook(() => useFetchAndConvertMetric(metric.id));

    expect(result.current).not.toEqual(response);
    expect(result.current.data.unitConfig.min).toBe(32);
    expect(result.current.data.unitConfig.max).toBe(95);
  });
});
