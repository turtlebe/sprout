import {
  EMPTY_CONTAINER_COLOR,
  GetCropColor,
  MapsState,
  QueryParameters,
} from '@plentyag/app-production/src/maps-interactive-page/types';
import { getCropsInResource } from '@plentyag/app-production/src/maps-interactive-page/utils';
import { getContainerOpacity } from '@plentyag/app-production/src/maps-interactive-page/utils/get-container-opacity';

import { TOWER_HEIGHT, TOWER_RADIUS, TOWER_WIDTH } from '../../constants';
import { GrowLaneDirection } from '../../types';
import { GrowLaneData } from '../use-vertical-grow-graph-data';

import { RenderFunction } from '.';

import { shadowColor } from './color-map';
import { drawRoundedRect } from './draw-rounded-rect';

export interface RenderTowers {
  lanes: GrowLaneData[];
  mapsState: MapsState;
  queryParameters?: QueryParameters;
  getCropColor: GetCropColor;
  towerWidth?: number;
}

export const renderTowers: RenderFunction<RenderTowers> =
  ({ canvasCtx, scale }) =>
  ({ lanes, mapsState, queryParameters, getCropColor, towerWidth = TOWER_WIDTH }) => {
    // No Canvas Context? get outta here!
    if (!canvasCtx) {
      return;
    }

    // Scale metadata
    const { paddingX, paddingY, chartWidth, chartMarginX, chartMarginY, towersScale, lanesScale } = scale;

    // Draw all the lanes
    lanes.forEach((lane, laneIndex) => {
      const laneScaling = towersScale[lane?.laneName || 'default'];

      // initial position of each "row"
      const py = lanesScale(laneIndex) + chartMarginY + paddingY;

      // process each tower
      lane.towers.forEach(containerLocation => {
        // product field can be single crop (ex: "B11") or multiple crops (ex: "B11,WHC")
        const resource = mapsState?.[containerLocation.ref];
        const resourceState = resource?.resourceState;
        const crops = getCropsInResource(resourceState);
        const isEmptyContainer = !resourceState?.materialObj && resourceState?.containerObj;
        const firstCropColor = isEmptyContainer ? EMPTY_CONTAINER_COLOR : crops.length > 0 && getCropColor(crops[0]);
        const secondCropColor = isEmptyContainer ? EMPTY_CONTAINER_COLOR : crops.length > 1 && getCropColor(crops[1]);
        const selectedAgeCohortDate = queryParameters.ageCohortDate;
        const selectedCrops = queryParameters.selectedCrops;
        const selectedLabels = queryParameters.selectedLabels;

        // opacity
        const opacity = getContainerOpacity({ resource, selectedAgeCohortDate, selectedCrops, selectedLabels });

        // initial position of towers
        const px = chartMarginX + paddingX;

        // default options
        const drawOptions: any = {
          radius: TOWER_RADIUS,
          upperLeftHalfFillColor: firstCropColor,
          lowerRightHalfFillColor: secondCropColor || firstCropColor,
          shadowColor,
          opacity,
        };

        // configure each "direction" and orientation of the towers
        if (laneScaling.name === GrowLaneDirection.RIGHT || laneScaling.name === GrowLaneDirection.LEFT) {
          drawOptions.x = px + laneScaling.towersScale(containerLocation.index) - towerWidth / 2;
          drawOptions.y = py - TOWER_HEIGHT / 2;
          drawOptions.width = towerWidth;
          drawOptions.height = TOWER_HEIGHT;
        } else {
          // flush towers right if RIGHT_DOWN or left if LEFT_DOWN
          drawOptions.x =
            (laneScaling.name === 'RIGHT_DOWN' ? px + chartWidth + chartMarginX : paddingX) - TOWER_HEIGHT / 2;
          drawOptions.y = py + laneScaling.towersScale(containerLocation.index) - towerWidth / 2;
          drawOptions.width = TOWER_HEIGHT;
          drawOptions.height = towerWidth;
        }

        // GO!
        drawRoundedRect(canvasCtx, drawOptions);
      });
    });
  };
