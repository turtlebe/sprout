import { STYLE } from '@plentyag/app-production/src/maps-interactive-page/constants';
import {
  ContainerEventHandler,
  EMPTY_CONTAINER_COLOR,
  GetCropColor,
} from '@plentyag/app-production/src/maps-interactive-page/types';
import * as d3 from 'd3';

import { TableRowData } from '../../types';

import { RenderFunction } from '.';

import { drawTray } from './draw-tray';

export const ROW_CLASS = 'row';
export const TRAY_CONTAINER_CLASS = 'tray-container';
export const TRAY_HIGHLIGHT_CLASS = 'tray-highlight';
const TRAY_BASE_COLOR = '#e6e6e6';

export interface RenderTrays {
  rows?: TableRowData[];
  getCropColor: GetCropColor;
  onClick?: ContainerEventHandler;
  onEnter?: ContainerEventHandler;
  onExit?: ContainerEventHandler;
}

const noop = () => {};

export const renderTrays: RenderFunction<RenderTrays> =
  ({ svgRef, scale }) =>
  ({ rows, getCropColor, onClick = noop, onEnter = noop, onExit = noop }) => {
    // No DOM ref? get outta here!
    if (!svgRef.current) {
      return;
    }

    // Scale metadata
    const { xScale, yScale, paddingX, paddingY } = scale;

    // SVG Element
    const svgChartEl = d3.select(svgRef.current);

    const trayWidth = xScale(1) - 1;
    const trayHeight = yScale(1) - 1;

    const trayBaseColor = TRAY_BASE_COLOR;

    // Draw all the trays
    svgChartEl
      .selectAll(`.${ROW_CLASS}`)
      .data(rows)
      .enter()
      .each(function (row, rowIndex) {
        d3.select(this)
          .append('g')
          .attr('class', ROW_CLASS)
          .attr('transform', `translate(0, ${yScale(rowIndex) + paddingY})`)
          .selectAll(`.${TRAY_CONTAINER_CLASS}`)
          .data(row.resources)
          .enter()
          .each(function (resource, resourceIndex) {
            const product = resource?.materialObj?.product;
            const isUnoccupied = !resource?.materialObj && !resource?.containerObj;
            const isEmptyContainer = !resource?.materialObj && resource?.containerObj;
            const trayColor = isUnoccupied
              ? undefined
              : isEmptyContainer
              ? EMPTY_CONTAINER_COLOR
              : product && getCropColor(product);

            const trayContainerEl = d3.select(this).append('g').attr('class', TRAY_CONTAINER_CLASS);

            // Draw tray top
            drawTray({
              el: trayContainerEl,
              x: xScale(resourceIndex) + paddingX,
              y: 0,
              width: trayWidth,
              height: trayHeight,
              strokeColor: trayBaseColor,
              trayColor,
              strokeWidth: 1,
              xColor: trayBaseColor,
            });

            // Draw highlight
            const highlightEl = drawTray({
              el: trayContainerEl,
              className: TRAY_HIGHLIGHT_CLASS,
              x: xScale(resourceIndex) + paddingX + 2,
              y: 2,
              width: trayWidth - 4,
              height: trayHeight - 4,
              trayColor: STYLE.active.fillColor,
              strokeColor: STYLE.active.strokeColor,
              strokeWidth: STYLE.active.strokeWidth,
            }).style('visibility', 'hidden');

            // Get Coordinates
            const positionInParent = `${row.rowName}${resourceIndex + 1}`;

            // Bind click event
            trayContainerEl
              .style('cursor', 'pointer')
              .on('click', function (event) {
                event.preventDefault();
                onClick && onClick(event, this, { positionInParent, resourceState: resource });
              })
              .on('mouseenter', function (event) {
                event.preventDefault();
                onEnter(event, this, { positionInParent, resourceState: resource });
                highlightEl.style('visibility', 'visible');
              })
              .on('mouseleave', function (event) {
                event.preventDefault();
                onExit(event, this, { positionInParent, resourceState: resource });
                highlightEl.style('visibility', 'hidden');
              });
          });
      });
  };
