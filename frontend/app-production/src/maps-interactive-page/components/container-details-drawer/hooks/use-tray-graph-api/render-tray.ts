import { EMPTY_CONTAINER_COLOR, GetCropColor } from '@plentyag/app-production/src/maps-interactive-page/types';
import * as d3 from 'd3';

import { Site, TrayDimensions } from '../../constants';

import { RenderFunction } from '.';

import { drawPlug } from './draw-plug';
import { drawSprout } from './draw-sprout';

export const ROW_CLASS = 'tray-row';
export const PLUG_CONTAINER_CLASS = 'plug-container';
const BORDER_RADIUS = 3;
const CROP_FILL = '#BFE0AF';
const CROP_STROKE = '#7EBE63';

export interface RenderTray {
  plugs?: { resourceState: ProdResources.ResourceState }[];
  getCropColor: GetCropColor;
  siteName: string;
}

export const renderTray: RenderFunction<RenderTray> =
  ({ svgRef, scale }) =>
  ({ plugs, getCropColor, siteName }) => {
    // No DOM ref? get outta here!
    if (!svgRef.current) {
      return;
    }

    const trayDimensions = TrayDimensions[Site[siteName || 'Default']];

    const [{ resourceState: resource }] = plugs;

    // Scale metadata
    const { xScale, yScale, paddingX, paddingY } = scale;

    // SVG Element
    const svgChartEl = d3.select(svgRef.current);

    const plugWidth = xScale(1) - 1;
    const plugHeight = yScale(1) - 1;

    // Draw all the trays
    // Init row/column sizes
    const rows = [...Array(trayDimensions.plugsVertically)];
    const columns = [...Array(trayDimensions.plugsHorizontally)];

    svgChartEl
      .selectAll(`.${ROW_CLASS}`)
      .data(rows)
      .enter()
      .each(function (_, rowIndex) {
        d3.select(this)
          .append('g')
          .classed(ROW_CLASS, true)
          .attr('transform', `translate(0, ${yScale(rowIndex) + paddingY})`)
          .selectAll(`.${PLUG_CONTAINER_CLASS}`)
          .data(columns)
          .enter()
          .each(function (_, resourceIndex) {
            const product = resource?.materialObj?.product;
            const isUnoccupied = !resource?.materialObj && !resource?.containerObj;
            const isEmptyContainer = !resource?.materialObj && resource?.containerObj;
            const plugColor = isUnoccupied
              ? undefined
              : isEmptyContainer
              ? EMPTY_CONTAINER_COLOR
              : product && getCropColor(product);

            const plugContainerEl = d3.select(this).append('g').classed(PLUG_CONTAINER_CLASS, true);

            const x = xScale(resourceIndex) + paddingX;

            drawPlug({
              el: plugContainerEl,
              x,
              borderRadius: BORDER_RADIUS,
              width: plugWidth,
              height: plugHeight,
              plugColor,
            });

            drawSprout({
              el: plugContainerEl,
              x,
              fillColor: CROP_FILL,
              strokeColor: CROP_STROKE,
              baseWidth: plugWidth,
              baseHeight: plugHeight,
            });
          });
      });
  };
