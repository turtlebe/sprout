import { useCoreStore } from '@plentyag/core/src/core-store';
import { useLogAxiosErrorInSnackbar, useSwrAxios } from '@plentyag/core/src/hooks';
import { mockPackagingLots } from '@plentyag/core/src/test-helpers/mocks';
import { renderHook } from '@testing-library/react-hooks';

import { mockDupSkuWithoutProductWeight, mockSku, mockSkuB10, mockSkus } from '../../test-helpers/mock-skus';

import { useLoadSkusForPackagingLots } from '.';

jest.mock('@plentyag/core/src/core-store');
const mockUseCoreStore = useCoreStore as jest.Mock;

jest.mock('@plentyag/core/src/hooks/use-swr-axios');
const mockUseSwrAxios = useSwrAxios as jest.Mock;

jest.mock('@plentyag/core/src/hooks/use-log-axios-error-in-snackbar');
const mockUseLogAxiosErrorInSnackbar = useLogAxiosErrorInSnackbar as jest.Mock;

describe('useLoadSkusForPackagingLots', () => {
  beforeEach(() => {
    mockUseCoreStore.mockReturnValue([
      {
        currentUser: {
          currentFarmDefPath: 'sites/LAX1/farms/LAX1',
        },
      },
    ]);

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

  it('does not provide url to make request if there are no packaging lots given', () => {
    // ARRANGE
    mockUseSwrAxios.mockReturnValue({
      data: null,
      revalidate: jest.fn(),
      error: null,
      isValidating: true,
    });

    // ACT
    renderHook(() => useLoadSkusForPackagingLots({ lots: [] }));

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
    const { result } = renderHook(() => useLoadSkusForPackagingLots({ lots: mockPackagingLots }));

    // ASSERT
    expect(result.current.skus).toEqual([]);
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
    const { result } = renderHook(() => useLoadSkusForPackagingLots({ lots: mockPackagingLots }));

    // ASSERT
    expect(result.current.skus).toEqual(mockSkus);
    expect(result.current.isLoading).toBeFalsy();
  });

  it('removes invalid duplicates', () => {
    // ARRANGE
    mockUseSwrAxios.mockReturnValue({
      data: [mockSku, mockDupSkuWithoutProductWeight, mockSkuB10], // with dup
      revalidate: jest.fn(),
      error: null,
      isValidating: false,
    });

    // ACT
    const { result } = renderHook(() => useLoadSkusForPackagingLots({ lots: mockPackagingLots }));

    // ASSERT
    expect(result.current.skus).toEqual([mockSku, mockSkuB10]); // without dup
  });

  it('forms the correct url given packaging lots and skuTypeClass', () => {
    // ARRANGE
    mockUseSwrAxios.mockReturnValue({
      data: mockSkus,
      revalidate: jest.fn(),
      error: null,
      isValidating: false,
    });

    // ACT
    renderHook(() =>
      useLoadSkusForPackagingLots({ lots: mockPackagingLots, skuTypeClass: 'Case', includeDeleted: true })
    );

    // ASSERT
    expect(mockUseSwrAxios).toHaveBeenCalledWith({
      url: '/api/swagger/farm-def-service/skus-api/search-skus?includeDeleted=true&skuTypeClass=Case&packagingLotCropCode[]=C11&packagingLotCropCode[]=KC1',
    });
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
    renderHook(() => useLoadSkusForPackagingLots({ lots: mockPackagingLots }));

    // ASSERT
    expect(mockUseLogAxiosErrorInSnackbar).toHaveBeenCalledWith(mockError);
  });
});
