import { useLogAxiosErrorInSnackbar, useSwrAxios } from '@plentyag/core/src/hooks';
import { renderHook } from '@testing-library/react-hooks';

import { REFRESH_INTERVAL } from '../../constants';

import { useGetState } from '.';

jest.mock('@plentyag/core/src/hooks/use-swr-axios');
const mockUseSwrAxios = useSwrAxios as jest.Mock;
const mockRevalidate = jest.fn();
const mockData = { x: 'mock data' };
function createMockUseSwrAxios(isValidating: boolean, error?: any) {
  mockUseSwrAxios.mockReturnValue({
    data: mockData,
    error,
    revalidate: mockRevalidate,
    isValidating,
  });
}
jest.mock('@plentyag/core/src/hooks/use-log-axios-error-in-snackbar');
const mockUseLogAxiosErrorInSnackbar = useLogAxiosErrorInSnackbar as jest.Mock;

const mockTitle = 'mock title';
describe('useGetState', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    mockRevalidate.mockClear();
    mockUseLogAxiosErrorInSnackbar.mockClear();
  });

  it('revalidates periodically when axios config is provided', () => {
    createMockUseSwrAxios(false);

    const { result } = renderHook(() => useGetState({ axiosRequestConfig: { url: '/test' }, errorTitle: mockTitle }));

    expect(result.current.data).toBe(mockData);
    expect(result.current.isLoading).toBe(false);

    // call once when first visible.
    expect(mockRevalidate).toHaveBeenCalledTimes(1);

    // called second time after refresh period
    jest.advanceTimersByTime(REFRESH_INTERVAL + 1);
    expect(mockRevalidate).toHaveBeenCalledTimes(2);
  });

  it('does not periodically refresh when "enablePeriodicRefresh" is false', () => {
    createMockUseSwrAxios(false);

    const { result } = renderHook(() =>
      useGetState({ axiosRequestConfig: { url: '/test' }, errorTitle: mockTitle, enablePeriodicRefresh: false })
    );

    // get initial data
    expect(result.current.data).toBe(mockData);

    // but doesn't revalidate
    expect(mockRevalidate).not.toHaveBeenCalled();

    jest.advanceTimersByTime(REFRESH_INTERVAL + 1);
    expect(mockRevalidate).not.toHaveBeenCalled();
  });

  it('does not revalidate periodically when axios config is not provided', () => {
    createMockUseSwrAxios(false);

    renderHook(() => useGetState({ axiosRequestConfig: null, errorTitle: mockTitle }));

    expect(mockRevalidate).not.toHaveBeenCalled();

    jest.advanceTimersByTime(REFRESH_INTERVAL + 1);
    expect(mockRevalidate).not.toHaveBeenCalled();
  });

  it('does not revalidate periodically when axios is loading', () => {
    createMockUseSwrAxios(true);

    renderHook(() => useGetState({ axiosRequestConfig: { url: '/test' }, errorTitle: mockTitle }));

    expect(mockRevalidate).not.toHaveBeenCalled();

    jest.advanceTimersByTime(REFRESH_INTERVAL + 1);
    expect(mockRevalidate).not.toHaveBeenCalled();

    expect(mockUseLogAxiosErrorInSnackbar).toHaveBeenCalledWith(undefined, mockTitle, false);
  });

  it('suppresses console error message when status is 503', () => {
    const error = { response: { status: 503 } };
    createMockUseSwrAxios(false, error);

    renderHook(() => useGetState({ axiosRequestConfig: { url: '/test' }, errorTitle: mockTitle }));

    expect(mockUseLogAxiosErrorInSnackbar).toHaveBeenCalledWith(error, mockTitle, true);
  });
});
