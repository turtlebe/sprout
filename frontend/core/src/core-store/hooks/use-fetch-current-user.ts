import { useSwrAxios, UseSwrAxiosReturn } from '@plentyag/core/src/hooks/use-swr-axios';

import { CurrentUserData } from '../types';

const CURRENT_USER_URL = '/api/core/current-user';

export type UseFetchCurrentUserReturn = UseSwrAxiosReturn<CurrentUserData>;

export const useFetchCurrentUser = (): UseFetchCurrentUserReturn => {
  return useSwrAxios<CurrentUserData, any>({ url: CURRENT_USER_URL });
};
