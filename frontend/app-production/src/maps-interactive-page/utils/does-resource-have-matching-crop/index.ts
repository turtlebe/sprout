import { getCropsInResource } from '@plentyag/app-production/src/maps-interactive-page/utils';

/**
 * This function returns true if the given resource includes at least one crop from the given crops array.
 */
export function doesResourceHaveMatchingCrop(resourceState: ProdResources.ResourceState, crops: string[]) {
  // return true when crops is empty, ie: filter is not applied.
  if (!crops || crops.length === 0) {
    return true;
  }

  const cropsInResource = getCropsInResource(resourceState);

  return cropsInResource.some(cropInResource => crops.includes(cropInResource));
}
