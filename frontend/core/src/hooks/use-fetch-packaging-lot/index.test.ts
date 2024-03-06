import { useLogAxiosErrorInSnackbar, useSwrAxios } from '@plentyag/core/src/hooks';
import { renderHook } from '@testing-library/react-hooks';

import { mockPackagingLot } from '../../test-helpers/mocks';

import { useFetchPackagingLot } from '.';

jest.mock('@plentyag/core/src/hooks/use-swr-axios');
jest.mock('@plentyag/core/src/hooks/use-log-axios-error-in-snackbar');

const mockUseSwrAxios = useSwrAxios as jest.Mock;
const mockUseLogAxiosErrorInSnackbar = useLogAxiosErrorInSnackbar as jest.Mock;

describe('useFetchPackagingLot', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('does not provide url to make request if lot name is not provided (hence blocking request)', () => {
    // ARRANGE
    mockUseSwrAxios.mockReturnValue({
      data: null,
      revalidate: jest.fn(),
      error: null,
      isValidating: true,
    });

    // ACT
    renderHook(() => useFetchPackagingLot(null));

    // ASSERT
    expect(mockUseSwrAxios).toHaveBeenCalledWith({ url: null });
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
    const { result } = renderHook(() => useFetchPackagingLot('5-LAX1-C11-219'));

    // ASSERT
    expect(result.current.packagingLot).toEqual(null);
    expect(result.current.isLoading).toBeTruthy();
  });

  it('returns successfully', () => {
    // ARRANGE
    mockUseSwrAxios.mockReturnValue({
      data: mockPackagingLot,
      revalidate: jest.fn(),
      error: null,
      isValidating: false,
    });

    // ACT
    const { result } = renderHook(() => useFetchPackagingLot('5-LAX1-C11-219'));

    // ASSERT
    expect(result.current.packagingLot).toEqual(mockPackagingLot);
    expect(result.current.isLoading).toBeFalsy();
  });

  it('calls log axios error if error is found', () => {
    // ARRANGE
    const mockError = new Error('bad');
    mockUseSwrAxios.mockReturnValue({
      data: mockPackagingLot,
      revalidate: jest.fn(),
      error: mockError,
      isValidating: false,
    });

    // ACT
    renderHook(() => useFetchPackagingLot('5-LAX1-C11-219'));

    // ASSERT
    expect(mockUseLogAxiosErrorInSnackbar).toHaveBeenCalledWith(mockError);
  });
});
