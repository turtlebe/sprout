import { useLogAxiosErrorInSnackbar, useSwrAxios } from '@plentyag/core/src/hooks';

import { WORKCENTERS_PATHS } from '../../../constants';
import { Workcenter } from '../../types';

export interface UseGetWorkcentersReturn {
  workcenters: Workcenter[];
  isLoading: boolean;
}

/**
 * This hook loads info about workcenters for the user's current farm. If the optional
 * "workspace" parameter is provided then only workcenters associated with the given
 * "workspace" are fetched.
 */
export const useGetWorkcenters = (workspace?: string): UseGetWorkcentersReturn => {
  const { data, isValidating, error } = useSwrAxios<Workcenter[]>({
    url: WORKCENTERS_PATHS.baseApiPath,
    params: { role_name: workspace },
  });

  useLogAxiosErrorInSnackbar(error, 'Error loading Workcenters list');

  return { workcenters: data, isLoading: isValidating };
};
