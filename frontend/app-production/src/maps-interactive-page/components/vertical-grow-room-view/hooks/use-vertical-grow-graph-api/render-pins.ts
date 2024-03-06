import { MapsState, QueryParameters } from '@plentyag/app-production/src/maps-interactive-page/types';
import { ContainerLocation } from '@plentyag/core/src/farm-def/types/container-location';
import * as d3 from 'd3';

import { TOWER_HEIGHT, TOWER_WIDTH } from '../../constants';
import { GrowLaneDirection } from '../../types';
import { GrowLaneData } from '../use-vertical-grow-graph-data';

import { RenderFunction } from '.';

const PIN_CLASS = 'vg-tower-pins';

interface DrawPinArgs {
  mapsState: MapsState;
  containerLocation: ContainerLocation;
  el: d3.Selection<any, any, any, any>;
  x: number;
  y: number;
  width: number;
  height: number;
  queryParameters: QueryParameters;
}

export type DrawPin = (args: DrawPinArgs) => void;

export interface RenderPins {
  mapsState: MapsState;
  lanes: GrowLaneData[];
  towerWidth?: number;
  drawPin: DrawPin;
  queryParameters: QueryParameters;
}

/**
 * This function will render a pin for each tower in each lane.
 * The drawPin function is passed in to allow for custom rendering.
 * The drawPin function should determine whether or not a pin needs to be
 * drawn for the given containerLocation.
 */
export const renderPins: RenderFunction<RenderPins> =
  ({ svgRef, scale }) =>
  ({ mapsState, lanes, towerWidth = TOWER_WIDTH, drawPin, queryParameters }) => {
    // No SVG container? get outta here!
    if (!svgRef.current) {
      return;
    }

    // Scale metadata
    const { paddingX, paddingY, chartWidth, chartMarginX, chartMarginY, towersScale, lanesScale } = scale;
    const towerHeight = TOWER_HEIGHT;

    // SVG Element
    const svgChartEl = d3.select(svgRef.current);

    // Iterate through and create error
    svgChartEl
      .selectAll(`.${PIN_CLASS}`)
      .data(lanes)
      .enter()
      .each(function (lane, laneIndex) {
        const laneScaling = towersScale[lane?.laneName || 'default'];

        // initial position of each "row"
        const py = lanesScale(laneIndex) + chartMarginY + paddingY;

        // process each tower
        lane.towers.forEach(containerLocation => {
          // initial position of towers
          const px = chartMarginX + paddingX;

          // configure each "direction" and orientation of the towers
          let x, y, width, height;
          if (laneScaling.name === GrowLaneDirection.RIGHT || laneScaling.name === GrowLaneDirection.LEFT) {
            x = px + laneScaling.towersScale(containerLocation.index) - towerWidth / 2;
            y = py - towerHeight / 2;
            width = towerWidth;
            height = towerHeight;
          } else {
            // flush towers right if RIGHT_DOWN or left if LEFT_DOWN
            x = (laneScaling.name === 'RIGHT_DOWN' ? px + chartWidth + chartMarginX : paddingX) - towerHeight / 2;
            y = py + laneScaling.towersScale(containerLocation.index) - towerWidth / 2;
            width = towerHeight;
            height = towerWidth;
          }

          drawPin({
            mapsState,
            containerLocation,
            el: d3.select(this),
            x,
            y,
            width,
            height,
            queryParameters,
          });
        });
      });
  };
