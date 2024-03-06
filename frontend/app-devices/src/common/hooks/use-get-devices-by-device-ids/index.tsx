import { useSwrAxios, UseSwrAxiosReturn } from '@plentyag/core/src/hooks';
import { PaginatedList } from '@plentyag/core/src/types';

import { Device } from '../../types';

export interface UseGetDevicesByDeviceIdsReturn extends UseSwrAxiosReturn<PaginatedList<Device>> {}

export const SEARCH_DEVICES_URL = '/api/plentyservice/farm-def-service/search-devices-by';

export const useGetDevicesByDeviceIds = (deviceIds: string[]): UseGetDevicesByDeviceIdsReturn => {
  return useSwrAxios<PaginatedList<Device>>(
    Array.isArray(deviceIds) &&
      deviceIds.length > 0 && {
        url: SEARCH_DEVICES_URL,
        method: 'POST',
        data: { deviceIds, sortBy: 'serial', order: 'asc' },
      }
  );
};
