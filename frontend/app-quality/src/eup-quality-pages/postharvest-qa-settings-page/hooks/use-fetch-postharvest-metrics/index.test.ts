import { buildMetric } from '@plentyag/app-environment/src/common/test-helpers';
import { errorSnackbar, mockGlobalSnackbar } from '@plentyag/brand-ui/src/components/global-snackbar/test-helper';
import { useSwrAxios } from '@plentyag/core/src/hooks/use-swr-axios';
import { actAndAwait } from '@plentyag/core/src/test-helpers';
import { renderHook } from '@testing-library/react-hooks';

import { useFetchPostharvestMetrics } from '.';

mockGlobalSnackbar();

jest.mock('@plentyag/core/src/hooks/use-swr-axios');
const mockUseSwrAxios = useSwrAxios as jest.Mock;

describe('useFetchPostharvestMetrics', () => {
  const mockMetricsRecord = {
    tubWeight: buildMetric({
      observationName: 'tubWeight',
    }),
    largeLeaves: buildMetric({
      observationName: 'largeLeaves',
    }),
  };
  const mockMetrics = Object.values(mockMetricsRecord);

  it('shows loading state', () => {
    // ARRANGE
    mockUseSwrAxios.mockReturnValue({
      data: null,
      revalidate: jest.fn(),
      isValidating: true,
      error: null,
    });

    // ACT
    const { result } = renderHook(() => useFetchPostharvestMetrics());

    // ASSERT
    expect(result.current.isLoading).toBeTruthy();
  });

  it('fetches and returns data', () => {
    // ARRANGE
    mockUseSwrAxios.mockReturnValue({
      data: { data: mockMetrics },
      revalidate: jest.fn(),
      isValidating: false,
      error: null,
    });

    // ACT
    const { result } = renderHook(() => useFetchPostharvestMetrics());

    // ASSERT
    expect(result.current.metrics).toEqual(mockMetrics);
    expect(result.current.metricsRecord).toEqual(mockMetricsRecord);
    expect(result.current.isLoading).toBeFalsy();
  });

  it('handles errors', () => {
    // ARRANGE
    const mockError = new Error();
    mockError.message = 'request failed';

    mockUseSwrAxios.mockReturnValue({
      data: null,
      revalidate: jest.fn(),
      isValidating: false,
      error: mockError,
    });

    // ACT
    const { result } = renderHook(() => useFetchPostharvestMetrics());

    // ASSERT
    expect(result.current.isLoading).toBeFalsy();
    expect(errorSnackbar).toHaveBeenCalledWith({
      message: mockError.message,
    });
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

    const { result } = renderHook(() => useFetchPostharvestMetrics());

    // ACT
    await actAndAwait(async () => result.current.revalidate());

    // ASSERT
    expect(mockRevalidate).toHaveBeenCalled();
  });
});
