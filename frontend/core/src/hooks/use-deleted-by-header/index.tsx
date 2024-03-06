import { useCoreStore } from '@plentyag/core/src/core-store';
import { AxiosRequestHeaders } from 'axios';

export type UseDeletedByHeaderReturn = AxiosRequestHeaders;

export const useDeletedByHeader = (): UseDeletedByHeaderReturn => {
  const [coreStore] = useCoreStore();

  return {
    'X-Deleted-By': coreStore.currentUser?.username,
  };
};
