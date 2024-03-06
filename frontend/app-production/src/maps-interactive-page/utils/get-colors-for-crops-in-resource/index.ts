import { EMPTY_CONTAINER_COLOR, GetCropColor } from '@plentyag/app-production/src/maps-interactive-page/types';

import { getCropsInResource } from '..';

/**
 * This function returns the corresponding crop colors in the given resource.
 * The resource (if it has a materialObj) has field "product" which can have up to
 * two crops. "product" is a comma separated list of crops.
 *
 * If the resource has a container and but no material (ex: empty table) then returns the empty container color.
 * If the resource not empty and has no crops then returns 'undefined'.
 */
export function getColorsForCropsInResource(resourceState: ProdResources.ResourceState, getCropColor: GetCropColor) {
  const crops = getCropsInResource(resourceState);
  const isEmptyContainer = !resourceState?.materialObj && resourceState?.containerObj;
  const firstCropColor = isEmptyContainer
    ? EMPTY_CONTAINER_COLOR
    : crops.length > 0
    ? getCropColor(crops[0])
    : undefined;
  const secondCropColor = crops?.length > 1 ? getCropColor(crops[1]) : undefined;
  return { firstCropColor, secondCropColor };
}
