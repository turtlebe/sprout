import { mockCurrentUser } from '@plentyag/core/src/core-store/test-helpers';
import { useLogAxiosErrorInSnackbar, useSwrAxios } from '@plentyag/core/src/hooks';
import { act, renderHook } from '@testing-library/react-hooks';

import { mockUploadHistory } from '../../test-helpers/mock-upload-history';

import { useLoadUploadHistory } from '.';

jest.mock('@plentyag/core/src/hooks/use-swr-axios');
const mockUseSwrAxios = useSwrAxios as jest.Mock;

jest.mock('@plentyag/core/src/hooks/use-log-axios-error-in-snackbar');
const mockUseLogAxiosErrorInSnackbar = useLogAxiosErrorInSnackbar as jest.Mock;

describe('useLoadUploadHistory', () => {
  let mockRevalidate;
  const mockCurrentFarmDefPath = 'sites/SSF2/farms/Tigris';

  beforeEach(() => {
    mockRevalidate = jest.fn();
    mockCurrentUser({ currentFarmDefPath: mockCurrentFarmDefPath });
    mockUseSwrAxios.mockReturnValue({
      data: mockUploadHistory,
      isValidating: false,
      error: undefined,
      revalidate: mockRevalidate,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('loads and respond with data', () => {
    // ACT
    const { result } = renderHook(() => useLoadUploadHistory());

    // ASSERT
    expect(result.current.isLoading).toBeFalsy();
    expect(result.current.uploadHistory).toEqual(mockUploadHistory);
  });

  it('has a loading state', () => {
    // ARRANGE
    mockUseSwrAxios.mockReturnValue({
      data: null,
      isValidating: true,
      error: undefined,
      revalidate: mockRevalidate,
    });

    // ACT
    const { result } = renderHook(() => useLoadUploadHistory());

    // ASSERT
    expect(result.current.isLoading).toBeTruthy();
  });

  it('handles error', () => {
    // ARRANGE
    const mockError = new Error('no way man');

    mockUseSwrAxios.mockReturnValue({
      data: null,
      isValidating: false,
      error: mockError,
      revalidate: mockRevalidate,
    });

    // ACT
    renderHook(() => useLoadUploadHistory());

    // ASSERT
    expect(mockUseLogAxiosErrorInSnackbar).toHaveBeenCalledWith(mockError);
  });

  it('handles refresh/revalidating', () => {
    // ARRANGE
    const { result } = renderHook(() => useLoadUploadHistory());

    // ACT
    act(() => result.current.revalidate());

    // ASSERT
    expect(mockRevalidate).toHaveBeenCalled();
  });
});
