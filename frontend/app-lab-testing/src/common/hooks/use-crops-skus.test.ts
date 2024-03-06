import { useSwrAxios } from '@plentyag/core/src/hooks/use-swr-axios';
import { renderHook } from '@testing-library/react-hooks';

import { mockCrops, mockSkus } from '../test-helpers/mock-crops-skus';

import { useCrops, useSkus } from './use-crops-skus';

jest.mock('@plentyag/core/src/hooks/use-swr-axios');
const mockUseSwrAxios = useSwrAxios as jest.Mock;
mockUseSwrAxios.mockImplementation(axiosRequestConfig => {
  if (axiosRequestConfig.url.match('.*search-crops-by-farm-path.*')) {
    return { data: mockCrops };
  }
  if (axiosRequestConfig.url.match('.*search-skus-by-farm-path.*')) {
    return { data: mockSkus };
  }
  return { data: undefined, error: 'error' };
});

describe('useCropsSkus', () => {
  it('returns Crops on success', () => {
    const { result } = renderHook(() => useCrops('TIGRIS'));

    expect(result.current.data).toHaveLength(mockCrops.length);
    expect(result.current.data[0]).toEqual(mockCrops[0]);
  });

  it('returns Skus on success', () => {
    const { result } = renderHook(() => useSkus('TIGRIS'));

    expect(result.current.data).toHaveLength(mockSkus.length);
    expect(result.current.data[0]).toEqual(mockSkus[0]);
  });

  it('returns error if there is a problem loading crops', () => {
    mockUseSwrAxios.mockReturnValue({ data: undefined, error: 'error' });
    const { result } = renderHook(() => useCrops('TIGRIS'));

    expect(result.current.data).toBeUndefined();
    expect(result.current.error).toBeDefined();
  });

  it('returns error if there is a problem loading skus', () => {
    mockUseSwrAxios.mockReturnValue({ data: undefined, error: 'error' });
    const { result } = renderHook(() => useSkus('TIGRIS'));

    expect(result.current.data).toBeUndefined();
    expect(result.current.error).toBeDefined();
  });
});
