import { BufferState } from '@plentyag/app-production/src/central-processing-dashboard-page/types/buffer-state';
import { useLogAxiosErrorInSnackbar, useSwrAxios } from '@plentyag/core/src/hooks';
import React from 'react';

export interface UseLoadPreTransferConveyanceDataReturn {
  pickupBuffer: BufferState[];
  transplanterTowers: ProdResources.ResourceState[];
  transplanterOutfeedTowers: ProdResources.ResourceState[];
  isLoading: boolean;
  revalidate: () => Promise<any>;
}

export const PICKUP_BUFFER_URL = '/api/production/transfer-conveyance/buffers/states/pickup-buffer';
export const TS3_GET_CONTAINERS_BY_PATH_URL = '/api/plentyservice/traceability3/get-states-by-path';
export const TRANPLANTER_FARM_DEF_PATH = 'sites/LAX1/areas/TowerAutomation/lines/TowerProcessing/machines/Transplanter';
export const TRANPLANTER_OUTFEED_FARM_DEF_PATH = `${TRANPLANTER_FARM_DEF_PATH}/containerLocations/TransplanterOutfeed`;

export const useLoadPreTransferConveyanceData = (): UseLoadPreTransferConveyanceDataReturn => {
  const {
    data: pickupBuffer,
    isValidating: isLoadingPickupBuffer,
    revalidate: revalidatePickupBuffer,
    error: errorLoadingPickupBuffer,
  } = useSwrAxios<BufferState[]>({ url: PICKUP_BUFFER_URL });
  useLogAxiosErrorInSnackbar(errorLoadingPickupBuffer, 'Error loading pickup buffer state');

  const {
    data: transplanterTowersAndTrays,
    isValidating: isLoadingTransplanterTowers,
    revalidate: revalidateTransplanterTowers,
    error: errorLoadingTransplanterTowers,
  } = useSwrAxios<ProdResources.ResourceState[]>({
    url: TS3_GET_CONTAINERS_BY_PATH_URL,
    params: {
      path: TRANPLANTER_FARM_DEF_PATH,
      sort_field: 'containerLastMoveDt',
      sort_order: 'asc',
    },
  });
  const transplanterTowers = React.useMemo(
    () => transplanterTowersAndTrays?.filter(tower => tower?.containerObj?.containerType === 'TOWER'),
    [transplanterTowersAndTrays]
  );
  useLogAxiosErrorInSnackbar(errorLoadingTransplanterTowers, 'Error loading transplanter towers state');

  const {
    data: transplanterOutfeedTowers,
    isValidating: isLoadingTransplanterOutfeedTowers,
    revalidate: revalidateTransplanterOutfeedTowers,
    error: errorLoadingTransplanterOutfeedTowers,
  } = useSwrAxios<ProdResources.ResourceState[]>({
    url: TS3_GET_CONTAINERS_BY_PATH_URL,
    params: {
      path: TRANPLANTER_OUTFEED_FARM_DEF_PATH,
      sort_field: 'containerLastMoveDt',
      sort_order: 'asc',
    },
  });
  useLogAxiosErrorInSnackbar(errorLoadingTransplanterOutfeedTowers, 'Error loading transplanter outfeed towers state');

  const isLoading = isLoadingPickupBuffer || isLoadingTransplanterTowers || isLoadingTransplanterOutfeedTowers;

  async function revalidate() {
    return Promise.all([
      revalidatePickupBuffer(),
      revalidateTransplanterTowers(),
      revalidateTransplanterOutfeedTowers(),
    ]);
  }

  return {
    pickupBuffer,
    transplanterTowers,
    transplanterOutfeedTowers,
    isLoading,
    revalidate,
  };
};
