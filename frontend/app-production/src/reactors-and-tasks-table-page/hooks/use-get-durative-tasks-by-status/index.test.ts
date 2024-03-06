import { TaskStatus } from '@plentyag/app-production/src/common/types';
import { mocktasks } from '@plentyag/app-production/src/reactors-and-tasks-detail-page/test-helpers';
import { useCoreStore } from '@plentyag/core/src/core-store';
import { useLogAxiosErrorInSnackbar, useSwrAxios } from '@plentyag/core/src/hooks';
import { actAndAwaitForHook } from '@plentyag/core/src/test-helpers';
import { renderHook } from '@testing-library/react-hooks';

import { useGetDurativeTasksByStatus } from '.';

jest.mock('@plentyag/core/src/core-store');
jest.mock('@plentyag/core/src/hooks');

describe('useGetDurativeTasksByStatus', () => {
  beforeEach(() => {
    // ARRANGE
    // -- hooks
    (useCoreStore as jest.Mock).mockReturnValue([
      {
        currentUser: {
          currentFarmDefPath: 'sites/LAX1/farms/LAX1',
        },
      },
    ]);
    (useSwrAxios as jest.Mock).mockReturnValue({
      data: mocktasks,
    });
    useLogAxiosErrorInSnackbar as jest.Mock;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('returns tasks given task status', () => {
    // ARRANGE
    (useSwrAxios as jest.Mock).mockReturnValue({
      data: mocktasks,
      revalidate: jest.fn(),
      error: null,
      isValidating: false,
    });

    // ACT
    const { result } = renderHook(() => useGetDurativeTasksByStatus(TaskStatus.RUNNING));

    // ASSERT
    expect(result.current.tasks).toEqual(mocktasks);
    expect(result.current.isLoading).toBeFalsy();
  });

  it('calls revalidate when "refetch" method is called', async () => {
    // ARRANGE
    const mockRevalidate = jest.fn();
    (useSwrAxios as jest.Mock).mockReturnValue({
      data: mocktasks,
      revalidate: mockRevalidate,
      error: null,
      isValidating: false,
    });

    const { result } = renderHook(() => useGetDurativeTasksByStatus(TaskStatus.RUNNING));

    // ACT
    await actAndAwaitForHook(async () => {
      return result.current.refetch();
    });

    // ASSERT
    expect(mockRevalidate).toHaveBeenCalled();
  });

  it('calls log axios error if error is found', () => {
    // ARRANGE
    const mockError = new Error('bad');
    (useSwrAxios as jest.Mock).mockReturnValue({
      data: mocktasks,
      revalidate: jest.fn(),
      error: mockError,
      isValidating: false,
    });

    // ACT
    renderHook(() => useGetDurativeTasksByStatus(TaskStatus.RUNNING));

    // ASSERT
    expect(useLogAxiosErrorInSnackbar).toHaveBeenCalledWith(mockError);
  });
});
