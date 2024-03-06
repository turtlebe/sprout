import { useLogAxiosErrorInSnackbar, useSwrAxios } from '@plentyag/core/src/hooks';

import { WORKCENTERS_PATHS } from '../../../constants';
import { WorkcenterDetails } from '../../types';

export interface UseGetWorkcenterReturn {
  workcenter: WorkcenterDetails;
  isLoading: boolean;
  hasError: boolean;
}

export const useGetWorkcenter = (workcenterName: string): UseGetWorkcenterReturn => {
  const { data, isValidating, error } = useSwrAxios<WorkcenterDetails>({
    url: `${WORKCENTERS_PATHS.baseApiPath}/${workcenterName}`,
  });

  useLogAxiosErrorInSnackbar(!isValidating && error, `Error loading Workcenter: ${workcenterName}`);

  return { workcenter: data, isLoading: isValidating, hasError: !!error && !isValidating };
};
