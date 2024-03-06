import { useLogAxiosErrorInSnackbar, useSwrAxios } from '@plentyag/core/src/hooks';
import { renderHook } from '@testing-library/react-hooks';

import { GET_TALLY_BY_SKU } from '../../constants';
import { mockPostharvestTallyMultipleSku } from '../../test-helpers/mock-postharvest-tally';

import { useFetchPostharvestTallyBySku } from '.';

jest.mock('@plentyag/core/src/hooks/use-swr-axios');
const mockUseSwrAxios = useSwrAxios as jest.Mock;

jest.mock('@plentyag/core/src/hooks/use-log-axios-error-in-snackbar');
const mockUseLogAxiosErrorInSnackbar = useLogAxiosErrorInSnackbar as jest.Mock;

describe('useFetchPostharvestTallyBySku', () => {
  let mockRevalidate;
  beforeEach(() => {
    mockRevalidate = jest.fn();

    mockUseSwrAxios.mockReturnValue({
      data: mockPostharvestTallyMultipleSku,
      revalidate: mockRevalidate,
      isValidating: false,
      error: null,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should not call if site, farm, and lot name is defined', () => {
    // ACT
    const { result } = renderHook(() =>
      useFetchPostharvestTallyBySku({
        siteName: null,
        farmName: null,
        lotName: null,
        skuName: null,
      })
    );

    // ASSERT
    expect(mockUseSwrAxios).toHaveBeenCalledWith({
      url: null,
    });
    expect(result.current.isLoading).toBeFalsy();
  });

  it('returns tally', () => {
    // ACT
    const { result } = renderHook(() =>
      useFetchPostharvestTallyBySku({
        siteName: 'LAX1',
        farmName: 'LAX1',
        lotName: '5-LAX1-CRS-276',
        skuName: 'CRSCase6Clamshell4o5ozPlenty',
      })
    );

    // ASSERT
    expect(mockUseSwrAxios).toHaveBeenCalledWith({
      url: `${GET_TALLY_BY_SKU}?siteName=LAX1&farmName=LAX1&lotName=5-LAX1-CRS-276&skuName=CRSCase6Clamshell4o5ozPlenty`,
    });
    expect(result.current.postharvestSkuTally).toEqual(mockPostharvestTallyMultipleSku);
    expect(result.current.isLoading).toBeFalsy();
  });

  it('revalidates when method is called', async () => {
    // ARRANGE
    const { result } = renderHook(() =>
      useFetchPostharvestTallyBySku({
        siteName: 'LAX1',
        farmName: 'LAX1',
        lotName: '5-LAX1-CRS-276',
        skuName: 'CRSCase6Clamshell4o5ozPlenty',
      })
    );

    // ACT
    await result.current.revalidate();

    // ASSERT
    expect(mockRevalidate).toHaveBeenCalled();
  });

  it('handles error', () => {
    // ARRANGE
    const mockError = new Error('poop');

    mockUseSwrAxios.mockReturnValue({
      data: null,
      revalidate: mockRevalidate,
      isValidating: false,
      error: mockError,
    });

    // ACT
    renderHook(() =>
      useFetchPostharvestTallyBySku({
        siteName: 'LAX1',
        farmName: 'LAX1',
        lotName: '5-LAX1-CRS-276',
        skuName: 'CRSCase6Clamshell4o5ozPlenty',
      })
    );

    // ASSERT
    expect(mockUseLogAxiosErrorInSnackbar).toHaveBeenCalledWith(mockError);
  });
});
