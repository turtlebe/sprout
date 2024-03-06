import { useLogAxiosErrorInSnackbar, useSwrAxios } from '@plentyag/core/src/hooks';

// import {
//   mockHarvestWorkcenterPlan,
//   mockPackWorkcenterPlan,
//   mockPropLoadWorkcenterPlan,
//   mockPropUnloadWorkcenterPlan,
//   mockSeedWorkcenterPlan,
//   mockTransplantWorkcenterPlan,
// } from '../../../workcenters-page/test-helpers';
import { WorkcenterPlanResponse } from '../../types';
import { getDateFormat } from '../../utils';

export interface UseGetWorkcenterPlan {
  planDate: Date;
  workcenterPath: string;
}

export const useGetWorkcenterPlan = ({ planDate, workcenterPath }: UseGetWorkcenterPlan) => {
  const planDateStr = getDateFormat(planDate);

  const { data, isValidating, error, revalidate } = useSwrAxios<WorkcenterPlanResponse>({
    url: planDateStr && workcenterPath && '/api/plentyservice/executive-service/get-workcenter-plan',
    params: {
      planned_date: planDateStr,
      workcenter: workcenterPath,
    },
  });

  useLogAxiosErrorInSnackbar(error, `Error loading Workcenter plan: ${workcenterPath}`);

  return { isLoading: isValidating, revalidate, planResponse: data };
};
