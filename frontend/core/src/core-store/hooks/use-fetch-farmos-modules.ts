import { useSwrAxios, UseSwrAxiosReturn } from '@plentyag/core/src/hooks/use-swr-axios';

const FARMOS_MODULES_URL = '/api/core/farmos-modules';

export type UseFetchFarmOsModulesReturn = UseSwrAxiosReturn<{ farmOsModules: string[] }>;

export const useFetchFarmOsModules = (): UseFetchFarmOsModulesReturn => {
  return useSwrAxios<{ farmOsModules: string[] }, any>({ url: FARMOS_MODULES_URL });
};
