import { useLogAxiosErrorInSnackbar, useSwrAxios } from '@plentyag/core/src/hooks';
import { renderHook } from '@testing-library/react-hooks';

import { mockCrops } from '../../test-helpers/mock-crops';

import { useLoadCrops } from '.';

jest.mock('@plentyag/core/src/hooks/use-swr-axios');
jest.mock('@plentyag/core/src/hooks/use-log-axios-error-in-snackbar');

const mockUseSwrAxios = useSwrAxios as jest.Mock;
const mockUseLogAxiosErrorInSnackbar = useLogAxiosErrorInSnackbar as jest.Mock;

describe('useLoadCrops', () => {
  afterEach(() => {
    jest.clearAllMocks();
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
    const { result } = renderHook(() => useLoadCrops());

    // ASSERT
    expect(result.current.crops).toEqual(null);
    expect(result.current.isLoading).toBeTruthy();
  });

  it('returns crops successfully', () => {
    // ARRANGE
    mockUseSwrAxios.mockReturnValue({
      data: mockCrops,
      revalidate: jest.fn(),
      error: null,
      isValidating: false,
    });

    // ACT
    const { result } = renderHook(() => useLoadCrops());

    // ASSERT
    expect(result.current.crops).toEqual(mockCrops);
    expect(result.current.isLoading).toBeFalsy();
  });

  it('calls log axios error if error is found', () => {
    // ARRANGE
    const mockError = new Error('bad');
    mockUseSwrAxios.mockReturnValue({
      data: mockCrops,
      revalidate: jest.fn(),
      error: mockError,
      isValidating: false,
    });

    // ACT
    renderHook(() => useLoadCrops());

    // ASSERT
    expect(mockUseLogAxiosErrorInSnackbar).toHaveBeenCalledWith(mockError);
  });
});
