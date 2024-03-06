import { useLogAxiosErrorInSnackbar, useSwrAxios } from '@plentyag/core/src/hooks';
import { renderHook } from '@testing-library/react-hooks';

import { mockSkus, mockSkusRecord } from '../../test-helpers/mocks';

import { SKUS_URL, useFetchSkus } from '.';

jest.mock('@plentyag/core/src/hooks/use-swr-axios');
jest.mock('@plentyag/core/src/hooks/use-log-axios-error-in-snackbar');

const mockUseSwrAxios = useSwrAxios as jest.Mock;
const mockUseLogAxiosErrorInSnackbar = useLogAxiosErrorInSnackbar as jest.Mock;

describe('useFetchSkus', () => {
  const siteName = 'LAX1';
  const farmName = 'LAX1';

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('calls the skus URL without site or farm name', () => {
    // ARRANGE
    mockUseSwrAxios.mockReturnValue({
      data: null,
      revalidate: jest.fn(),
      error: null,
      isValidating: true,
    });

    // ACT
    renderHook(() => useFetchSkus(null, null));

    // ASSERT
    expect(mockUseSwrAxios).toHaveBeenCalledWith({ url: SKUS_URL });
  });

  it('shows loading state', () => {
    // ARRANGE
    mockUseSwrAxios.mockReturnValue({
      data: null,
      revalidate: jest.fn(),
      error: null,
      isValidating: true,
    });

    // ACT
    const { result } = renderHook(() => useFetchSkus(siteName, farmName));

    // ASSERT
    expect(result.current.skus).toEqual(null);
    expect(result.current.isLoading).toBeTruthy();
  });

  it('returns successfully', () => {
    // ARRANGE
    mockUseSwrAxios.mockReturnValue({
      data: mockSkus,
      revalidate: jest.fn(),
      error: null,
      isValidating: false,
    });

    // ACT
    const { result } = renderHook(() => useFetchSkus(siteName, farmName));

    // ASSERT
    expect(result.current.skus).toEqual(mockSkus);
    expect(result.current.skusRecord).toEqual(mockSkusRecord);
    expect(result.current.isLoading).toBeFalsy();
  });

  it('calls log axios error if error is found', () => {
    // ARRANGE
    const mockError = new Error('bad');
    mockUseSwrAxios.mockReturnValue({
      data: mockSkus,
      revalidate: jest.fn(),
      error: mockError,
      isValidating: false,
    });

    // ACT
    renderHook(() => useFetchSkus(siteName, farmName));

    // ASSERT
    expect(mockUseLogAxiosErrorInSnackbar).toHaveBeenCalledWith(mockError);
  });
});
