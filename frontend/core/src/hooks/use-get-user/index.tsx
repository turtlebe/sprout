import { User } from '@plentyag/core/src/core-store/types';
import { useSwrAxios, UseSwrAxiosReturn } from '@plentyag/core/src/hooks';

export interface UseGetUser {
  username: string;
}

export const useGetUser = ({ username }: UseGetUser): UseSwrAxiosReturn<User> => {
  return useSwrAxios<User>(Boolean(username) && { url: `/api/core/users/${username}` });
};
