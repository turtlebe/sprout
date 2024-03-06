import { FarmOsModule } from '@plentyag/core/src/core-store/types';
import { useSwrAxios } from '@plentyag/core/src/hooks/use-swr-axios';

const url = 'api/core/farmos-modules/details';

export const useGetFarmOsModules = () => {
  return useSwrAxios<{ farmOsModules: FarmOsModule[] }, any>({ url });
};
