import { mockFarmStateContainer } from '@plentyag/app-production/src/common/test-helpers';
import { useLogAxiosErrorInSnackbar, useSwrAxios } from '@plentyag/core/src/hooks';
import { actAndAwait } from '@plentyag/core/src/test-helpers';
import { renderHook } from '@testing-library/react-hooks';

import { useLoadFarmStateBySerial } from '.';

jest.mock('@plentyag/core/src/hooks/use-swr-axios');
const mockUseSwrAxios = useSwrAxios as jest.Mock;

jest.mock('@plentyag/core/src/hooks/use-log-axios-error-in-snackbar');
const mockUseLogAxiosErrorInSnackbar = useLogAxiosErrorInSnackbar as jest.Mock;

describe('useLoadFarmStateBySerial', () => {
  let mockRefresh;

  beforeEach(() => {
    mockRefresh = jest.fn();
  });

  function createMockUseSwrAxios(isValidating: boolean, error?: Error) {
    mockUseSwrAxios.mockReturnValue({
      data: mockFarmStateContainer,
      error,
      revalidate: mockRefresh,
      isValidating,
    });
  }

  it('returns data', () => {
    // ARRANGE
    createMockUseSwrAxios(false);

    // ACT
    const { result } = renderHook(() => useLoadFarmStateBySerial('f9e2dc47-75d7-452d-ab0d-d51d4d2e818f'));

    // ASSERT
    expect(result.current.farmStateContainer).toEqual(mockFarmStateContainer);
    expect(result.current.isValidating).toEqual(false);
  });

  it('handles loading state', () => {
    // ARRANGE
    createMockUseSwrAxios(true);

    // ACT
    const { result } = renderHook(() => useLoadFarmStateBySerial('f9e2dc47-75d7-452d-ab0d-d51d4d2e818f'));

    // ASSERT
    expect(result.current.isValidating).toEqual(true);
  });

  it('handles error state', () => {
    // ARRANGE
    const mockError = new Error('nupe');
    createMockUseSwrAxios(false, mockError);

    // ACT
    renderHook(() => useLoadFarmStateBySerial('f9e2dc47-75d7-452d-ab0d-d51d4d2e818f'));

    // ASSERT
    expect(mockUseLogAxiosErrorInSnackbar).toHaveBeenCalledWith(mockError);
  });

  it('handles revalidate', async () => {
    // ARRANGE
    createMockUseSwrAxios(false);
    const { result } = renderHook(() => useLoadFarmStateBySerial('f9e2dc47-75d7-452d-ab0d-d51d4d2e818f'));

    // ACT
    await actAndAwait(async () => result.current.revalidate());

    // ASSERT
    expect(mockRefresh).toHaveBeenCalled();
  });
});
