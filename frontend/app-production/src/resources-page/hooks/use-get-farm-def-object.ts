import { FarmDefObject } from '@plentyag/core/src/farm-def/types';
import { useSwrAxios } from '@plentyag/core/src/hooks/use-swr-axios';

export function useGetFarmDefObject(objectId: string) {
  return useSwrAxios<FarmDefObject>(
    Boolean(objectId) && { url: `/api/plentyservice/farm-def-service/get-object-by-id/${objectId}` }
  );
}
