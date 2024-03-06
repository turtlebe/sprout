import {
  ContainerData,
  ContainerState,
  SupportedAreaClass,
} from '@plentyag/app-production/src/maps-interactive-page/types';

import { LOADED_IN_MATERIAL_ATTRIBUTE } from '../../constants';

export const getResourceLoadedDate = (resource: ContainerState | ContainerData): Date => {
  if (!resource || !resource.resourceState?.materialObj) {
    return null;
  }

  // Grab loaded in from material attribute
  const currentAreaName = resource.resourceState?.location?.machine?.areaName as SupportedAreaClass;
  const loadedInKey = LOADED_IN_MATERIAL_ATTRIBUTE[currentAreaName];
  const loadedInValue = resource.resourceState?.materialAttributes?.[loadedInKey];
  if (loadedInValue) {
    return new Date(loadedInValue);
  }

  // Otherwise, get it from last load operation
  if (resource.lastLoadOperation?.startDt) {
    return new Date(resource.lastLoadOperation.startDt);
  }
};
