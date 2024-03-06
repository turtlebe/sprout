import { useLogAxiosErrorInSnackbar, useSwrAxios } from '@plentyag/core/src/hooks';
import { renderHook } from '@testing-library/react-hooks';

import { LIST_INGEST_URL } from '../../constants';
import {
  mockPostharvestIngest,
  mockPostharvestIngestList,
  mockPostharvestIngestRecord,
} from '../../test-helpers/mock-postharvest-ingest';

import { useFetchPostharvestIngests } from '.';

jest.mock('@plentyag/core/src/hooks/use-swr-axios');
const mockUseSwrAxios = useSwrAxios as jest.Mock;

jest.mock('@plentyag/core/src/hooks/use-log-axios-error-in-snackbar');
const mockUseLogAxiosErrorInSnackbar = useLogAxiosErrorInSnackbar as jest.Mock;

describe('useFetchPostharvestIngests', () => {
  let mockRevalidate;
  beforeEach(() => {
    mockRevalidate = jest.fn();

    mockUseSwrAxios.mockReturnValue({
      data: {
        data: mockPostharvestIngestList,
      },
      revalidate: mockRevalidate,
      isValidating: false,
      error: null,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should not call if site and farm name is defined', () => {
    // ACT
    const { result } = renderHook(() =>
      useFetchPostharvestIngests({
        siteName: null,
        farmName: null,
      })
    );

    // ASSERT
    expect(mockUseSwrAxios).toHaveBeenCalledWith({
      url: null,
    });
    expect(result.current.isLoading).toBeFalsy();
  });

  it('returns an array of ingests', () => {
    // ACT
    const { result } = renderHook(() =>
      useFetchPostharvestIngests({
        siteName: 'LAX1',
        farmName: 'LAX1',
      })
    );

    // ASSERT
    expect(mockUseSwrAxios).toHaveBeenCalledWith({
      url: `${LIST_INGEST_URL}?site=LAX1&farm=LAX1`,
    });
    expect(result.current.postharvestIngests).toEqual(mockPostharvestIngestList);
    expect(result.current.postharvestIngestRecord).toEqual(mockPostharvestIngestRecord);
    expect(result.current.isLoading).toBeFalsy();
  });

  it('revalidates when method is called', async () => {
    // ARRANGE
    const { result } = renderHook(() =>
      useFetchPostharvestIngests({
        siteName: 'LAX1',
        farmName: 'LAX1',
      })
    );

    // ACT
    await result.current.revalidate();

    // ASSERT
    expect(mockRevalidate).toHaveBeenCalled();
  });

  it('getPostharvestIngestByLotAndSku => return ingest given lot and sku', () => {
    // ARRANGE
    const { result } = renderHook(() =>
      useFetchPostharvestIngests({
        siteName: 'LAX1',
        farmName: 'LAX1',
      })
    );

    // ACT
    const ingest = result.current.getPostharvestIngestByLotAndSku({
      lot: '5-LAX1-CRS-276',
      sku: 'CRSCase6Clamshell4o5ozPlenty',
    });

    // ASSERT
    expect(ingest).toEqual(mockPostharvestIngest);
  });

  it('getPostharvestIngestByLotAndSku => return null if nothing is returned', () => {
    // ARRANGE
    mockUseSwrAxios.mockReturnValue({
      data: null,
      revalidate: jest.fn(),
      isValidating: false,
      error: null,
    });

    const { result } = renderHook(() =>
      useFetchPostharvestIngests({
        siteName: 'LAX1',
        farmName: 'LAX1',
      })
    );

    // ACT
    const ingest = result.current.getPostharvestIngestByLotAndSku({
      lot: '5-LAX1-CRS-276',
      sku: 'CRSCase6Clamshell4o5ozPlenty',
    });

    // ASSERT
    expect(ingest).toEqual(null);
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
      useFetchPostharvestIngests({
        siteName: 'LAX1',
        farmName: 'LAX1',
      })
    );

    // ASSERT
    expect(mockUseLogAxiosErrorInSnackbar).toHaveBeenCalledWith(mockError);
  });
});
