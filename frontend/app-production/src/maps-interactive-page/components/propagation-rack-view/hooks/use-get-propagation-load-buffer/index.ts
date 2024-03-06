import { useGetFarmDefObjectByPath } from '@plentyag/app-production/src/common/hooks';
import { useLoadMapsState } from '@plentyag/app-production/src/maps-interactive-page/hooks';
import { MapsState } from '@plentyag/app-production/src/maps-interactive-page/types';
import { ContainerLocation } from '@plentyag/core/src/farm-def/types';
import { getKindFromPath } from '@plentyag/core/src/farm-def/utils';
import { DateTime } from 'luxon';

export interface UseGetLoadBuffer {
  propagationRack: number;
  linePath: string;
  selectedDate: DateTime;
}

export interface UseGetLoadBufferReturn {
  isLoading: boolean;
  loadBufferContainerLocation: ContainerLocation;
  loadBufferState: MapsState;
}

/**
 * This hook fetches the farm def contain location and state info for the propagation load
 * buffer - but only for LAX1. In LAX1 the propgation load buffer is stored in containerLocations
 * field in the TableConveyance object. There is one buffer for each prop rack. In LAX1 there
 * are currently two prop racks, so this hook receives the prop rack number to get the associated
 * load buffer.
 *
 * If the current site is not LAX1 then nothing is loaded or returned.  For v1 we are not showing
 * load buffer in non-LAX1 farms.
 */
export const useGetPropagationLoadBuffer = ({
  propagationRack,
  linePath,
  selectedDate,
}: UseGetLoadBuffer): UseGetLoadBufferReturn => {
  // currently only support getting load buffer for LAX1.
  const hasBuffer = getKindFromPath(linePath, 'sites') === 'LAX1';

  const mainTableLinePath = 'sites/LAX1/areas/TableAutomation/lines/MainTable';

  const { data, isValidating: isLoadingFarmDefObject } = useGetFarmDefObjectByPath(
    hasBuffer ? `${mainTableLinePath}/machines/TableConveyance` : undefined,
    1
  );

  const { isLoading: isLoadingMapsState, mapsState: loadBufferState } = useLoadMapsState(
    hasBuffer
      ? {
          linePath: mainTableLinePath,
          selectedDate,
        }
      : undefined
  );

  const containers = data?.containerLocations;
  const loadBufferContainerLocation =
    hasBuffer && containers && containers[`PropagationRack${propagationRack}LoadBuffer`];

  return { loadBufferContainerLocation, loadBufferState, isLoading: isLoadingMapsState || isLoadingFarmDefObject };
};
