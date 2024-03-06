import { useLogAxiosErrorInSnackbar, useSwrAxios } from '@plentyag/core/src/hooks';
import { mockPackagingLots } from '@plentyag/core/src/test-helpers/mocks';
import { act, renderHook } from '@testing-library/react-hooks';
import { DateTime, Settings } from 'luxon';

import { useFetchPackagingLots } from '.';

jest.mock('@plentyag/core/src/hooks/use-swr-axios');
const mockUseSwrAxios = useSwrAxios as jest.Mock;

jest.mock('@plentyag/core/src/hooks/use-log-axios-error-in-snackbar');
const mockUseLogAxiosErrorInSnackbar = useLogAxiosErrorInSnackbar as jest.Mock;

describe('useFetchPackagingLots', () => {
  beforeAll(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2020-04-01'));
    Settings.defaultZone = 'America/Los_Angeles';
  });

  afterAll(() => {
    jest.useRealTimers();
    Settings.defaultZone = 'system';
  });

  let mockStartDate, mockEndDate, mockFarmPath;
  beforeEach(() => {
    mockStartDate = DateTime.fromSQL('2020-01-15').toJSDate();
    mockEndDate = DateTime.fromSQL('2020-02-01').toJSDate();
    mockFarmPath = 'sites/LAX1/farms/LAX1';

    mockUseSwrAxios.mockReturnValue({
      data: null,
      revalidate: jest.fn(),
      error: null,
      isValidating: true,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('errors out if farmPath does not contain a specified farm', () => {
    // ARRANGE
    mockFarmPath = 'sites/LAX1';

    // ACT
    renderHook(() => useFetchPackagingLots({ farmPath: mockFarmPath }));

    // ASSERT
    expect(mockUseLogAxiosErrorInSnackbar).toHaveBeenCalled();
    expect(mockUseSwrAxios).toHaveBeenCalledWith({ url: false });
  });

  it('errors out if farmPath is null', () => {
    // ACT
    renderHook(() => useFetchPackagingLots({ farmPath: null }));

    // ASSERT
    expect(mockUseLogAxiosErrorInSnackbar).toHaveBeenCalled();
    expect(mockUseSwrAxios).toHaveBeenCalledWith({ url: false });
  });

  it('should choose 30 day range from now if start and end date are not specified', () => {
    // ACT
    renderHook(() => useFetchPackagingLots({ farmPath: mockFarmPath }));

    // ASSERT
    expect(mockUseSwrAxios).toHaveBeenCalledWith({
      url: '/api/plentyservice/traceability3/get-packaging-lots?farm_path=sites%2FLAX1%2Ffarms%2FLAX1&start_date=2020-03-01&end_date=2020-03-31',
    });
  });

  it('should choose 30 day range from specified end date if start is not specified', () => {
    // ACT
    renderHook(() => useFetchPackagingLots({ farmPath: mockFarmPath, endDate: mockEndDate }));

    // ASSERT
    expect(mockUseSwrAxios).toHaveBeenCalledWith({
      url: '/api/plentyservice/traceability3/get-packaging-lots?farm_path=sites%2FLAX1%2Ffarms%2FLAX1&start_date=2020-01-02&end_date=2020-02-01',
    });
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
    const { result } = renderHook(() =>
      useFetchPackagingLots({ farmPath: mockFarmPath, startDate: mockStartDate, endDate: mockEndDate })
    );

    // ASSERT
    expect(result.current.lots).toEqual(null);
    expect(result.current.isLoading).toBeTruthy();
  });

  it('returns successfully', () => {
    // ARRANGE
    mockUseSwrAxios.mockReturnValue({
      data: mockPackagingLots,
      revalidate: jest.fn(),
      error: null,
      isValidating: false,
    });

    // ACT
    const { result } = renderHook(() =>
      useFetchPackagingLots({ farmPath: mockFarmPath, startDate: mockStartDate, endDate: mockEndDate })
    );

    // ASSERT
    expect(result.current.lots).toEqual(mockPackagingLots);
    expect(result.current.isLoading).toBeFalsy();

    // -- test lots record index
    expect(result.current.lotsRecord['5-LAX1-C11-245']).toEqual(
      mockPackagingLots.find(lot => lot.lotName === '5-LAX1-C11-245')
    );
  });

  it('calls log axios error if error is found', () => {
    // ARRANGE
    const mockError = new Error('bad');
    mockUseSwrAxios.mockReturnValue({
      data: mockPackagingLots,
      revalidate: jest.fn(),
      error: mockError,
      isValidating: false,
    });

    // ACT
    renderHook(() => useFetchPackagingLots({ farmPath: mockFarmPath, startDate: mockStartDate, endDate: mockEndDate }));

    // ASSERT
    expect(mockUseLogAxiosErrorInSnackbar).toHaveBeenCalledWith(mockError);
  });

  it('calls revalidate when refresh() is called', () => {
    // ARRANGE
    const mockRevalidate = jest.fn();

    mockUseSwrAxios.mockReturnValue({
      data: mockPackagingLots,
      revalidate: mockRevalidate,
      error: null,
      isValidating: false,
    });

    const { result } = renderHook(() =>
      useFetchPackagingLots({ farmPath: mockFarmPath, startDate: mockStartDate, endDate: mockEndDate })
    );

    // ACT
    act(() => {
      result.current.refresh();
    });

    // ASSERT
    expect(mockRevalidate).toHaveBeenCalled();
  });
});
