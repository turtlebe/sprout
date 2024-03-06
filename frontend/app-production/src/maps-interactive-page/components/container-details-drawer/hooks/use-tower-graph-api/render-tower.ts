import { EMPTY_CONTAINER_COLOR, GetCropColor } from '@plentyag/app-production/src/maps-interactive-page/types';
import * as d3 from 'd3';

import { Site, TowerDimensions } from '../../constants';

import { RenderFunction } from '.';

import { drawLeaf } from './draw-leaf';

export const TOWER_CLASS = 'tower';
export const ROW_CLASS = 'tower-row';
const BORDER_RADIUS = 3;
const TOWER_WIDTH = 20;
const PLUG_LOC_WIDTH = 22;
const PLUG_LOC_HEIGHT = 15;
const CROP_FILL = '#BFE0AF';
const CROP_STROKE = '#7EBE63';

export interface RenderTower {
  plugs?: { resourceState: ProdResources.ResourceState }[];
  getCropColor: GetCropColor;
  siteName: string;
}

export const renderTower: RenderFunction<RenderTower> =
  ({ svgRef, scale }) =>
  ({ plugs, getCropColor, siteName }) => {
    // No DOM ref? get outta here!
    if (!svgRef.current) {
      return;
    }

    // Get Tower data
    const towerDimensions = TowerDimensions[Site[siteName || 'Default']];
    const [{ resourceState: resource }] = plugs;

    // Scale metadata
    const { width, yScale, contentHeight } = scale;

    // Draw all the Plugs
    const rows = [...Array(towerDimensions.plugs / 2)];

    // Calculations
    const centerX = width / 2;

    // Color
    const product = resource?.materialObj?.product;
    const isUnoccupied = !resource?.materialObj && !resource?.containerObj;
    const isEmptyContainer = !resource?.materialObj && resource?.containerObj;
    const cropColor = isUnoccupied
      ? undefined
      : isEmptyContainer
      ? EMPTY_CONTAINER_COLOR
      : product && getCropColor(product);

    // SVG Element
    const svgChartEl = d3.select(svgRef.current);

    // Crop Height
    const yOffset = yScale(1);

    // Draw plugs
    svgChartEl
      .selectAll(`.${ROW_CLASS}`)
      .data(rows)
      .enter()
      .each(function (_, rowIndex) {
        const rowEl = d3
          .select(this)
          .append('g')
          .classed(ROW_CLASS, true)
          .attr('transform', `translate(${centerX}, ${yScale(rowIndex)})`);

        // Draw Leaf Graphic
        if (!isUnoccupied && !isEmptyContainer) {
          // Left Crop
          drawLeaf({
            el: rowEl,
            direction: 'left',
            x: -TOWER_WIDTH / 2,
            fillColor: CROP_FILL,
            strokeColor: CROP_STROKE,
          });

          // Right crop
          drawLeaf({
            el: rowEl,
            direction: 'right',
            x: TOWER_WIDTH / 2,
            fillColor: CROP_FILL,
            strokeColor: CROP_STROKE,
          });
        }

        // Draw plug location
        rowEl
          .append('rect')
          .attr('x', -PLUG_LOC_WIDTH / 2)
          .attr('y', yOffset)
          .attr('width', PLUG_LOC_WIDTH)
          .attr('height', PLUG_LOC_HEIGHT)
          .attr('fill', cropColor);
      });

    // Draw tower
    svgChartEl
      .append('rect')
      .classed(TOWER_CLASS, true)
      .attr('x', centerX - TOWER_WIDTH / 2)
      .attr('y', 0)
      .attr('rx', BORDER_RADIUS)
      .attr('width', TOWER_WIDTH)
      .attr('height', contentHeight)
      .attr('fill', cropColor);
  };
