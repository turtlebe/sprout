import { STYLE } from '@plentyag/app-production/src/maps-interactive-page/constants';
import {
  ContainerData,
  ContainerEventHandler,
  MapsState,
} from '@plentyag/app-production/src/maps-interactive-page/types';
import { noop } from '@plentyag/app-production/src/maps-interactive-page/utils/noop';
import * as d3 from 'd3';

import { ZOOM_TOWER_HEIGHT, ZOOM_TOWER_WIDTH } from '../../constants';
import { GrowLaneDirection } from '../../types';
import { GrowLaneData } from '../use-vertical-grow-graph-data';

import { RenderFunction } from '.';

export interface RenderHotSpots {
  lanes: GrowLaneData[];
  mapsState: MapsState;
  selectedTower?: ContainerData;
  towerWidth?: number;
  onEnter?: ContainerEventHandler;
  onExit?: ContainerEventHandler;
  onClick?: ContainerEventHandler;
}

export const HOT_SPOTS_CLASS = 'vg-hot-spots';

export const renderHotSpots: RenderFunction<RenderHotSpots> =
  ({ svgRef, scale }) =>
  ({
    lanes,
    mapsState,
    selectedTower,
    towerWidth = ZOOM_TOWER_WIDTH,
    onEnter = noop,
    onExit = noop,
    onClick = noop,
  }) => {
    // No SVG container? get outta here!
    if (!svgRef.current) {
      return;
    }

    // Scale metadata
    const { paddingX, paddingY, chartWidth, chartMarginX, chartMarginY, towersScale, lanesScale } = scale;
    const towerHeight = ZOOM_TOWER_HEIGHT;

    // SVG Element
    const svgChartEl = d3.select(svgRef.current);

    // Draw all the lanes
    svgChartEl
      .selectAll(`.${HOT_SPOTS_CLASS}`)
      .data(lanes)
      .enter()
      .each(function (lane, laneIndex) {
        const laneScaling = towersScale[lane?.laneName || 'default'];

        // initial position of each "row"
        const py = lanesScale(laneIndex) + chartMarginY + paddingY;

        // process each tower
        lane.towers.forEach(containerLocation => {
          const resourceState = mapsState?.[containerLocation.ref]?.resourceState;
          const lastLoadOperation = mapsState?.[containerLocation.ref]?.lastLoadOperation;

          // Conflicts
          const conflicts = mapsState?.[containerLocation.ref]?.conflicts;

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

          // If selected table is the same as this point, highlight it
          const toHighlight = selectedTower?.containerLocation?.ref === containerLocation.ref;

          const hotSpotEl = d3
            .select(this)
            .append('g')
            .attr('class', HOT_SPOTS_CLASS)
            .append('rect')
            .attr('x', x)
            .attr('y', y)
            .attr('width', width)
            .attr('height', height)
            .attr('stroke', STYLE.active.strokeColor)
            .attr('stroke-width', STYLE.active.strokeWidth)
            .attr('fill', STYLE.active.fillColor)
            .attr('stroke-opacity', toHighlight ? 1 : 0)
            .attr('fill-opacity', toHighlight ? 1 : 0);

          hotSpotEl
            .style('cursor', 'pointer')
            .on('click.callback', function (event) {
              event.preventDefault();
              onClick(event, d3.select(this).node(), {
                containerLocation,
                resourceState,
                lastLoadOperation,
                conflicts,
              });
            })
            .on('mouseenter.callback', function (event) {
              event.preventDefault();
              d3.select(this).attr('stroke-opacity', 1).attr('fill-opacity', 1);
              onEnter(event, d3.select(this).node(), {
                containerLocation,
                resourceState,
                lastLoadOperation,
                conflicts,
              });
            })
            .on('mouseleave.callback', function (event) {
              event.preventDefault();
              d3.select(this).attr('stroke-opacity', 0).attr('fill-opacity', 0);
              onExit(event, d3.select(this).node(), { containerLocation, resourceState, lastLoadOperation, conflicts });
            });
        });
      });
  };
