import { useLogAxiosErrorInSnackbar, useSwrAxios } from '@plentyag/core/src/hooks';
import { renderHook } from '@testing-library/react-hooks';
import { DateTime } from 'luxon';

import { mockFinishedGoodsCases } from '../../test-helpers/mocks';

import { useFetchFinishedGoodCases } from '.';

jest.mock('@plentyag/core/src/hooks/use-swr-axios');
jest.mock('@plentyag/core/src/hooks/use-log-axios-error-in-snackbar');

const mockUseSwrAxios = useSwrAxios as jest.Mock;
const mockUseLogAxiosErrorInSnackbar = useLogAxiosErrorInSnackbar as jest.Mock;

describe('useFetchFinishedGoodCases', () => {
  const now = DateTime.now();
  const startDate = now.minus({ days: 30 }).toJSDate();
  const endDate = now.toJSDate();

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('does not provide url to make request if start date or end date is not provided', () => {
    // ARRANGE
    mockUseSwrAxios.mockReturnValue({
      data: null,
      revalidate: jest.fn(),
      error: null,
      isValidating: true,
    });

    // ACT
    renderHook(() => useFetchFinishedGoodCases(null, null));

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
    const { result } = renderHook(() => useFetchFinishedGoodCases(startDate, endDate));

    // ASSERT
    expect(result.current.cases).toEqual(null);
    expect(result.current.isLoading).toBeTruthy();
  });

  it('returns successfully', () => {
    // ARRANGE
    mockUseSwrAxios.mockReturnValue({
      data: mockFinishedGoodsCases,
      revalidate: jest.fn(),
      error: null,
      isValidating: false,
    });

    // ACT
    const { result } = renderHook(() => useFetchFinishedGoodCases(startDate, endDate));

    // ASSERT
    expect(result.current.cases).toEqual(mockFinishedGoodsCases);
    expect(result.current.isLoading).toBeFalsy();
  });

  it('calls log axios error if error is found', () => {
    // ARRANGE
    const mockError = new Error('bad');
    mockUseSwrAxios.mockReturnValue({
      data: mockFinishedGoodsCases,
      revalidate: jest.fn(),
      error: mockError,
      isValidating: false,
    });

    // ACT
    renderHook(() => useFetchFinishedGoodCases(startDate, endDate));

    // ASSERT
    expect(mockUseLogAxiosErrorInSnackbar).toHaveBeenCalledWith(mockError);
  });
});
