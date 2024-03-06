import {
  color1Path,
  color2Path,
  outlineAroundColorPaths,
  pinBackgroundPath,
  pinOutlinePath,
} from '@plentyag/app-production/src/maps-interactive-page/assets/draw-multi-crop-pin';
import { GetCropColor } from '@plentyag/app-production/src/maps-interactive-page/types';
import { getCropsInResource } from '@plentyag/app-production/src/maps-interactive-page/utils';
import { getContainerOpacity } from '@plentyag/app-production/src/maps-interactive-page/utils/get-container-opacity';

export const MULTI_CROP_ICON_CLASS = 'vg-tower-multi-crop-icon';

import { DrawPin } from './render-pins';

// args needed to draw a multi-crop pin
interface DrawMultiCropPinArgs {
  getCropColor: GetCropColor;
}

type DrawMultiCropPin = (args: DrawMultiCropPinArgs) => DrawPin;

/**
 * This function draws a pin when the given containerLocation has multiple crops.
 * The pin displays the first two crop colors.
 */
export const drawMultiCropPin: DrawMultiCropPin =
  ({ getCropColor }) =>
  ({ mapsState, containerLocation, el, x, y, width, height, queryParameters }) => {
    const resource = mapsState?.[containerLocation.ref];
    const crops = getCropsInResource(resource?.resourceState);
    const hasMultipleCrops = Boolean(crops.length > 1);

    if (hasMultipleCrops) {
      const opacity = getContainerOpacity({
        resource,
        selectedAgeCohortDate: queryParameters.ageCohortDate,
        selectedCrops: queryParameters.selectedCrops,
        selectedLabels: queryParameters.selectedLabels,
      });

      const multiCropEl = el
        .append('g')
        .attr('class', MULTI_CROP_ICON_CLASS)
        .attr('transform', `translate(${x - 10 + width / 2}, ${y - height - 10})`)
        .style('opacity', opacity);

      multiCropEl.append('path').attr('d', pinBackgroundPath).attr('fill-rule', 'evenodd').attr('fill', '#E0E0E0');

      multiCropEl.append('path').attr('d', pinOutlinePath).attr('fill', '#7D7D7D');

      multiCropEl
        .append('path')
        .attr('d', color1Path)
        .attr('fill-rule', 'evenodd')
        .attr('clip-rule', 'evenodd')
        .attr('fill', getCropColor(crops[0]));

      multiCropEl
        .append('path')
        .attr('d', color2Path)
        .attr('fill-rule', 'evenodd')
        .attr('clip-rule', 'evenodd')
        .attr('fill', getCropColor(crops[1]));

      multiCropEl.append('path').attr('d', outlineAroundColorPaths).attr('fill', '#7D7D7D');
    }
  };
