import { FarmDefSite } from '@plentyag/core/src/farm-def/types';
import { useLogAxiosErrorInSnackbar, useSwrAxios } from '@plentyag/core/src/hooks';

export interface UseGetFarmDefSiteObject {
  site: string;
}
export interface UseGetFarmDefSiteObjectReturn {
  farmSiteObject: FarmDefSite;
  isLoading: boolean;
}

export const getFarmDefObjectByPathUrl = '/api/swagger/farm-def-service/objects-v3-api/get-object-by-path2';

export const useGetFarmDefSiteObject = ({ site }: UseGetFarmDefSiteObject): UseGetFarmDefSiteObjectReturn => {
  const {
    data: farmSiteObject,
    isValidating: isLoading,
    error,
  } = useSwrAxios<FarmDefSite>({
    url: site && `${getFarmDefObjectByPathUrl}/sites/${site}?depth=0`,
  });

  useLogAxiosErrorInSnackbar(error, `Error loading farm def site: ${site}`);

  return { farmSiteObject, isLoading };
};
