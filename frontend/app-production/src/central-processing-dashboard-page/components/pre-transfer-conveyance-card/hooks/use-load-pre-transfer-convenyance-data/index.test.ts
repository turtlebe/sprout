import {
  mockCarriers,
  mockTowers,
  mockTransplanerOutfeedTowers,
  mockTrays,
} from '@plentyag/app-production/src/central-processing-dashboard-page/test-helpers';
import { useLogAxiosErrorInSnackbar, useSwrAxios } from '@plentyag/core/src/hooks';
import { renderHook } from '@testing-library/react-hooks';

import {
  PICKUP_BUFFER_URL,
  TRANPLANTER_FARM_DEF_PATH,
  TRANPLANTER_OUTFEED_FARM_DEF_PATH,
  TS3_GET_CONTAINERS_BY_PATH_URL,
  useLoadPreTransferConveyanceData,
} from '.';

jest.mock('@plentyag/core/src/hooks/use-swr-axios');
const mockUseSwrAxios = useSwrAxios as jest.Mock;
const mockRevalidatePickupBuffer = jest.fn().mockReturnValue(Promise.resolve(true));
const mockRevalidateTransplanter = jest.fn().mockReturnValue(Promise.resolve(true));
const mockRevalidateTransplanterOutfeed = jest.fn().mockReturnValue(Promise.resolve(true));
const mockPickupBufferData = mockCarriers;
// adding trays here, these should get filtered out in the hook.
const mockTransplanterData = mockTowers.concat(mockTrays);
const mockTransplanterOutfeedData = mockTransplanerOutfeedTowers;

// mock useSwrAxios for each of the three calls to fetch pre-TC data.
function createMockData() {
  mockUseSwrAxios.mockImplementation(({ url, params }) => {
    if (url === PICKUP_BUFFER_URL) {
      return {
        data: mockPickupBufferData,
        isValidating: false,
        revalidate: mockRevalidatePickupBuffer,
        error: null,
      };
    }

    if (url === TS3_GET_CONTAINERS_BY_PATH_URL) {
      if (params.path === TRANPLANTER_FARM_DEF_PATH) {
        return {
          data: mockTransplanterData,
          isValidating: false,
          revalidate: mockRevalidateTransplanter,
          error: null,
        };
      }

      if (params.path === TRANPLANTER_OUTFEED_FARM_DEF_PATH) {
        return {
          data: mockTransplanterOutfeedData,
          isValidating: false,
          revalidate: mockRevalidateTransplanterOutfeed,
          error: null,
        };
      }
    }
  });
}

jest.mock('@plentyag/core/src/hooks/use-log-axios-error-in-snackbar');
const mockUseLogAxiosErrorInSnackbar = useLogAxiosErrorInSnackbar as jest.Mock;

describe('useLoadPreTransferConveyanceData', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('revalidates all data', async () => {
    createMockData();

    const { result } = renderHook(() => useLoadPreTransferConveyanceData());

    await result.current.revalidate();

    expect(mockUseSwrAxios).toHaveBeenCalledTimes(3);

    expect(mockRevalidatePickupBuffer).toHaveBeenCalledTimes(1);
    expect(mockRevalidateTransplanter).toHaveBeenCalledTimes(1);
    expect(mockRevalidateTransplanterOutfeed).toHaveBeenCalledTimes(1);
  });

  it('returns all data', () => {
    createMockData();

    const { result } = renderHook(() => useLoadPreTransferConveyanceData());

    expect(result.current.pickupBuffer).toEqual(mockCarriers);
    expect(result.current.transplanterTowers).toEqual(mockTowers);
    expect(result.current.transplanterOutfeedTowers).toEqual(mockTransplanterOutfeedData);
  });

  it('returns isLoading', () => {
    mockUseSwrAxios.mockReturnValue({
      data: undefined,
      isValidating: true,
      revalidate: jest.fn(),
      error: null,
    });

    const { result } = renderHook(() => useLoadPreTransferConveyanceData());

    expect(result.current.isLoading).toBe(true);
  });

  it('gives erros to snackbar', () => {
    mockUseSwrAxios.mockReturnValue({
      data: undefined,
      isValidating: false,
      revalidate: jest.fn(),
      error: 'ouch',
    });

    renderHook(() => useLoadPreTransferConveyanceData());

    expect(mockUseLogAxiosErrorInSnackbar).toHaveBeenCalledTimes(3);
  });
});
