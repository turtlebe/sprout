import { ContainerData, MapsState } from '@plentyag/app-production/src/maps-interactive-page/types';

export const getMapsStateForTray = (data: ContainerData): MapsState => {
  return {
    [data.positionInParent]: {
      resourceState: data.resourceState,
    },
  };
};
