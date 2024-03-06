import { useGlobalSnackbar } from '@plentyag/brand-ui/src/components';
import { usePostRequest } from '@plentyag/core/src/hooks';
import { parseErrorMessage } from '@plentyag/core/src/utils';
import React from 'react';

import { PlanStatus, WorkcenterPlan } from '../../../common/types';
import { getDateFormat } from '../../../common/utils';

export interface UseChangeWorkcenterPlanExecutionStatus {
  plannedDate: Date;
  workcenterPath: string;
  revalidateWorkcenterPlan: () => Promise<boolean>;
}
export interface UseChangeWorkcenterPlanExecutionStatusReturn {
  changeExecutionStatus: (currentStatus: PlanStatus) => void;
  isChangingExecutionStatus: boolean;
}

/**
 * This hook will start, pause, or resume a workcenter plan.
 */
export const useChangeWorkcenterPlanExecutionStatus = ({
  plannedDate,
  workcenterPath,
  revalidateWorkcenterPlan,
}: UseChangeWorkcenterPlanExecutionStatus): UseChangeWorkcenterPlanExecutionStatusReturn => {
  const snackbar = useGlobalSnackbar();

  const { makeRequest, isLoading: isChangingExecutionStatus } = usePostRequest<
    WorkcenterPlan,
    { plannedDate: string; workcenter: string }
  >({});

  const [isReloadingWorkcenterPlan, setIsReloadingWorkcenterPlan] = React.useState(false);

  function changeExecutionStatus(currentStatus: PlanStatus) {
    if (
      !isChangingExecutionStatus &&
      (currentStatus === PlanStatus.CREATED ||
        currentStatus === PlanStatus.RUNNING ||
        currentStatus === PlanStatus.PAUSED)
    ) {
      const newStatus =
        currentStatus === PlanStatus.CREATED
          ? 'Executing'
          : currentStatus === PlanStatus.RUNNING
          ? 'Pausing'
          : 'Resuming';
      const api =
        currentStatus === PlanStatus.CREATED ? 'execute' : currentStatus === PlanStatus.RUNNING ? 'pause' : 'resume';
      makeRequest({
        url: `/api/plentyservice/executive-service/${api}-workcenter-plan`,
        data: {
          plannedDate: getDateFormat(plannedDate),
          workcenter: workcenterPath,
        },
        onSuccess: async () => {
          setIsReloadingWorkcenterPlan(true);
          try {
            await revalidateWorkcenterPlan();
          } finally {
            setIsReloadingWorkcenterPlan(false);
          }
        },
        onError: error =>
          snackbar.errorSnackbar({ title: `Error ${newStatus} Workcenter Plan`, message: parseErrorMessage(error) }),
      });
    }
  }

  return {
    changeExecutionStatus,
    isChangingExecutionStatus: isChangingExecutionStatus || isReloadingWorkcenterPlan,
  };
};
