import { errorSnackbar, mockGlobalSnackbar } from '@plentyag/brand-ui/src/components/global-snackbar/test-helper';
import { useSwrAxios } from '@plentyag/core/src/hooks/use-swr-axios';
import { actAndAwait, mockConsoleError } from '@plentyag/core/src/test-helpers';
import { renderHook } from '@testing-library/react-hooks';

import { useFetchContainerCountByPath } from '.';

mockGlobalSnackbar();

jest.mock('@plentyag/core/src/hooks/use-swr-axios');
const mockUseSwrAxios = useSwrAxios as jest.Mock;

describe('useFetchContainerCountByPath', () => {
  const mockBufferName = 'aux-buffer-1';

  it('shows loading state', () => {
    // ARRANGE
    mockUseSwrAxios.mockReturnValue({
      data: null,
      revalidate: jest.fn(),
      isValidating: true,
      error: null,
    });

    // ACT
    const { result } = renderHook(() => useFetchContainerCountByPath(mockBufferName, ['TOWER']));

    // ASSERT
    expect(result.current.isLoading).toBeTruthy();
  });

  it('fetches and returns data', () => {
    // ARRANGE
    mockUseSwrAxios.mockReturnValue({
      data: 123,
      revalidate: jest.fn(),
      isValidating: false,
      error: null,
    });

    // ACT
    const { result } = renderHook(() => useFetchContainerCountByPath(mockBufferName, ['TOWER']));

    // ASSERT
    expect(mockUseSwrAxios).toHaveBeenCalledWith({
      url: '/api/production/transfer-conveyance/buffers/states-count/aux-buffer-1?containerTypes[]=TOWER',
    });
    expect(result.current.data).toEqual(123);
    expect(result.current.isLoading).toBeFalsy();
  });

  it('handles errors', () => {
    // ARRANGE
    const consoleError = mockConsoleError();
    const mockError = new Error();
    mockError.message = 'request failed';

    mockUseSwrAxios.mockReturnValue({
      data: null,
      revalidate: jest.fn(),
      isValidating: false,
      error: mockError,
    });

    // ACT
    const { result } = renderHook(() => useFetchContainerCountByPath(mockBufferName, ['TOWER']));

    // ASSERT
    expect(result.current.isLoading).toBeFalsy();
    expect(errorSnackbar).toHaveBeenCalledWith({
      message: mockError.message,
    });
    expect(consoleError).toHaveBeenCalled();
  });

  it('calls revalidate on demand', async () => {
    // ARRANGE
    const mockRevalidate = jest.fn();

    mockUseSwrAxios.mockReturnValue({
      data: {},
      revalidate: mockRevalidate,
      isValidating: false,
      error: null,
    });

    const { result } = renderHook(() => useFetchContainerCountByPath(mockBufferName, ['TOWER']));

    // ACT
    await actAndAwait(async () => result.current.revalidate());

    // ASSERT
    expect(mockRevalidate).toHaveBeenCalled();
  });
});
