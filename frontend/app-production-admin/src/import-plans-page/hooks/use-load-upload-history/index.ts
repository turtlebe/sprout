import { UploadHistoryEntry } from '@plentyag/app-production-admin/src/import-plans-page/types';
import { useLogAxiosErrorInSnackbar, useSwrAxios } from '@plentyag/core/src/hooks';

export interface UseLoadUploadHistoryReturn {
  uploadHistory: UploadHistoryEntry[];
  revalidate: () => void;
  isLoading: boolean;
}

export function useLoadUploadHistory(): UseLoadUploadHistoryReturn {
  const { data, isValidating, revalidate, error } = useSwrAxios<UploadHistoryEntry[]>({
    url: '/api/production-admin/workcenters/upload-history',
  });

  useLogAxiosErrorInSnackbar(error);

  return {
    uploadHistory: data,
    revalidate,
    isLoading: isValidating,
  };
}
