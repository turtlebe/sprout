import { PlanStatus } from '@plentyag/app-production/src/common/types';
import { errorSnackbar, mockGlobalSnackbar } from '@plentyag/brand-ui/src/components/global-snackbar/test-helper';
import { usePostRequest } from '@plentyag/core/src/hooks';
import { actAndAwaitForHook } from '@plentyag/core/src/test-helpers';
import { renderHook } from '@testing-library/react-hooks';

import { getDateFormat } from '../../../common/utils';
import { mockSeedInProgressPlan } from '../../test-helpers';

mockGlobalSnackbar();

jest.mock('@plentyag/core/src/hooks');

import { useChangeWorkcenterPlanExecutionStatus } from '.';

describe('useChangeWorkcenterPlanExecutionStatus', () => {
  function renderUseChangeWorkcenterPlanExecutionStatusHook(isLoading: boolean, mockSuccess: boolean) {
    const mockError = 'ouch';
    const mockUsePostRequest = usePostRequest as jest.Mock;
    const mockMakePostRequest = jest.fn().mockImplementation(({ onSuccess, onError }) => {
      mockSuccess ? onSuccess() : onError(mockError);
    });
    mockUsePostRequest.mockReturnValue({
      makeRequest: mockMakePostRequest,
      isLoading,
    });

    const mockPlannedDate = new Date();
    const mockWorkcenterPath = mockSeedInProgressPlan.plan.workcenter;
    const mockRevalidateWorkcenterPlan = jest.fn();

    const { result } = renderHook(() =>
      useChangeWorkcenterPlanExecutionStatus({
        plannedDate: mockPlannedDate,
        workcenterPath: mockWorkcenterPath,
        revalidateWorkcenterPlan: mockRevalidateWorkcenterPlan,
      })
    );

    return {
      ...result.current,
      mockPlannedDate,
      mockWorkcenterPath,
      mockRevalidateWorkcenterPlan,
      mockMakePostRequest,
      mockError,
    };
  }

  beforeEach(() => {
    errorSnackbar.mockClear();
  });

  it('starts the plan execution and allows pausing and resuming', async () => {
    const {
      changeExecutionStatus,
      mockMakePostRequest,
      mockWorkcenterPath,
      mockPlannedDate,
      mockRevalidateWorkcenterPlan,
      isChangingExecutionStatus,
    } = renderUseChangeWorkcenterPlanExecutionStatusHook(false, true);

    // start execution
    await actAndAwaitForHook(() => {
      changeExecutionStatus(PlanStatus.CREATED);
    });

    expect(mockMakePostRequest).toHaveBeenLastCalledWith(
      expect.objectContaining({
        url: '/api/plentyservice/executive-service/execute-workcenter-plan',
        data: {
          plannedDate: getDateFormat(mockPlannedDate),
          workcenter: mockWorkcenterPath,
        },
      })
    );
    expect(mockRevalidateWorkcenterPlan).toHaveBeenCalledTimes(1);
    expect(isChangingExecutionStatus).toBe(false);

    // pause execution
    await actAndAwaitForHook(() => {
      changeExecutionStatus(PlanStatus.RUNNING);
    });

    expect(mockMakePostRequest).toHaveBeenLastCalledWith(
      expect.objectContaining({
        url: '/api/plentyservice/executive-service/pause-workcenter-plan',
        data: {
          plannedDate: getDateFormat(mockPlannedDate),
          workcenter: mockWorkcenterPath,
        },
      })
    );
    expect(mockRevalidateWorkcenterPlan).toHaveBeenCalledTimes(2);
    expect(isChangingExecutionStatus).toBe(false);

    // resume execution
    await actAndAwaitForHook(() => {
      changeExecutionStatus(PlanStatus.PAUSED);
    });

    expect(mockMakePostRequest).toHaveBeenLastCalledWith(
      expect.objectContaining({
        url: '/api/plentyservice/executive-service/resume-workcenter-plan',
        data: {
          plannedDate: getDateFormat(mockPlannedDate),
          workcenter: mockWorkcenterPath,
        },
      })
    );
    expect(mockRevalidateWorkcenterPlan).toHaveBeenCalledTimes(3);
    expect(isChangingExecutionStatus).toBe(false);

    expect(errorSnackbar).not.toHaveBeenCalled();
  });

  it('does not allow changing status when status change is already in progress', () => {
    // passing true for first argument here, sets mock "usePostRequest" api to indicate change is in progress.
    const { changeExecutionStatus, mockMakePostRequest } = renderUseChangeWorkcenterPlanExecutionStatusHook(true, true);

    changeExecutionStatus(PlanStatus.CREATED);

    expect(mockMakePostRequest).not.toHaveBeenCalled();
  });

  it('shows a snackbar error when plan fails to start executing', () => {
    const {
      changeExecutionStatus,
      isChangingExecutionStatus: isStartingExecution,
      mockMakePostRequest,
      mockWorkcenterPath,
      mockPlannedDate,
      mockRevalidateWorkcenterPlan,
      mockError,
    } = renderUseChangeWorkcenterPlanExecutionStatusHook(false, false);

    changeExecutionStatus(PlanStatus.RUNNING);

    expect(mockMakePostRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        data: {
          plannedDate: getDateFormat(mockPlannedDate),
          workcenter: mockWorkcenterPath,
        },
      })
    );

    expect(isStartingExecution).toBe(false);
    expect(mockRevalidateWorkcenterPlan).not.toHaveBeenCalled();
    expect(errorSnackbar).toHaveBeenCalledWith(expect.objectContaining({ message: mockError }));
  });
});
