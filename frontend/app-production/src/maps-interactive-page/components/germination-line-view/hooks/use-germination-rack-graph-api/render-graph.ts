import { ERROR_COLOR, STYLE } from '@plentyag/app-production/src/maps-interactive-page/constants';
import {
  ContainerData,
  ContainerEventHandler,
  GetCropColor,
  MapsState,
  QueryParameters,
} from '@plentyag/app-production/src/maps-interactive-page/types';
import { getColorsForCropsInResource, noop } from '@plentyag/app-production/src/maps-interactive-page/utils';
import { getContainerOpacity } from '@plentyag/app-production/src/maps-interactive-page/utils/get-container-opacity';
import { ContainerLocation, FarmDefMachine } from '@plentyag/core/src/farm-def/types';
import * as d3 from 'd3';
import { sortBy } from 'lodash';

import { RenderFunction } from '.';

import { drawGerminationTable } from './draw-germination-table';

export interface RenderGraph {
  selectedTable?: ContainerData;
  queryParameters?: QueryParameters;
  containerLocations: FarmDefMachine['containerLocations'];
  mapsState: MapsState;
  getCropColor: GetCropColor;
  onEnter?: ContainerEventHandler;
  onExit?: ContainerEventHandler;
  onClick?: ContainerEventHandler;
}

const TABLE_SKEW = 72;
const TABLE_SIDE_HEIGHT = 8;
const TABLE_SIDE_OFFSET = 1;
const TABLE_BASE_COLOR = '#e6e6e6';

export const CONTAINER_CLASS = 'germ-graph';
export const TABLE_CONTAINER_CLASS = 'germ-graph-table-container';
export const NAME_CLASS = 'germ-graph-name';
export const TABLE_SERIAL_CLASS = 'germ-graph-table-serial';

export const dataTestIds = {
  table: (ref: string) => `germination-line-table-${ref}`,
};

export { dataTestIds as dataTestIdsGerminationLineRenderGraph };

export const renderGraph: RenderFunction<RenderGraph> =
  ({ ref, scale }) =>
  ({
    selectedTable,
    queryParameters,
    containerLocations,
    mapsState,
    getCropColor,
    onEnter = noop,
    onExit = noop,
    onClick = noop,
  }) => {
    // No DOM ref? get outta here!
    if (!ref.current) {
      return;
    }

    // Scale metadata
    const { width: containerWidth, height: containerHeight, paddingX, paddingY, y } = scale;

    // Container node
    const container = ref.current;

    // Canvas Sizes
    const canvasWidth = containerWidth - paddingX * 2;

    // Data Preparation -- sort by index and convert to array
    const dataPoints = sortBy(Object.values(containerLocations), 'index');

    // Container Element
    const containerEl = d3.select(container);

    // Init SVG
    const svgChartEl = containerEl.select(`svg.${CONTAINER_CLASS}`).node()
      ? containerEl.select(`.${CONTAINER_CLASS}`)
      : containerEl
          .append('svg:svg')
          .attr('class', CONTAINER_CLASS)
          .style('position', 'absolute')
          .style('top', '0')
          .style('left', '0');

    // Adjust width/height
    svgChartEl.attr('width', containerWidth).attr('height', containerHeight);

    // Table properties
    const tableSkew = TABLE_SKEW;
    const tableWidth = canvasWidth - tableSkew;
    const tableSideHeight = TABLE_SIDE_HEIGHT;
    const tableHeight = y(1) - tableSideHeight - paddingY * 2;
    const tableSideOffset = TABLE_SIDE_OFFSET;
    const tableBaseColor = TABLE_BASE_COLOR;

    // Load data
    svgChartEl
      .selectAll(`.${TABLE_CONTAINER_CLASS}`)
      .data(dataPoints)
      .enter()
      .each(function (containerLocation, i) {
        const tableContainerEl = d3
          .select(this)
          .append('g')
          .attr('class', TABLE_CONTAINER_CLASS)
          .attr('data-testid', dataTestIds.table(containerLocation.ref));

        // Data
        const resource = mapsState?.[containerLocation.ref];
        const resourceState = resource?.resourceState;

        const { firstCropColor, secondCropColor } = getColorsForCropsInResource(resourceState, getCropColor);

        const lastLoadOperation = resource?.lastLoadOperation;

        // Conflicts
        const conflicts = mapsState[containerLocation.ref]?.conflicts;
        const hasError = Boolean(conflicts);

        // Bottom up (reverse)
        const index = dataPoints.length - 1 - i;

        // If selected table is the same as this point, highlight it
        const toHighlight = selectedTable?.containerLocation?.ref === containerLocation.ref;

        const selectedAgeCohortDate = queryParameters?.ageCohortDate;
        const selectedCrops = queryParameters?.selectedCrops;
        const selectedLabels = queryParameters?.selectedLabels;

        // Table Opacity
        const tableOpacity = getContainerOpacity({ resource, selectedAgeCohortDate, selectedCrops, selectedLabels });

        // Draw table
        drawGerminationTable({
          el: tableContainerEl,
          x: paddingX,
          y: y(index) + paddingY,
          width: tableWidth,
          height: tableHeight,
          skew: tableSkew,
          sideHeight: tableSideHeight,
          sideOffset: tableSideOffset,
          baseColor: tableBaseColor,
          tableColor: firstCropColor,
          tableOpacity,
          secondTableColor: secondCropColor,
          xColor: tableBaseColor,
          toHighlight,
          highlightStrokeColor: STYLE.active.strokeColor,
          highlightFillColor: STYLE.active.fillColor,
          errorColor: ERROR_COLOR,
          hasError,
        });

        // Bind click event
        tableContainerEl
          .style('cursor', 'pointer')
          .on('click.callback', (event, containerLocation: ContainerLocation) => {
            event.preventDefault();
            onClick(event, tableContainerEl.node(), { containerLocation, resourceState, lastLoadOperation, conflicts });
          })
          .on('mouseenter.callback', (event, containerLocation: ContainerLocation) => {
            event.preventDefault();
            onEnter(event, tableContainerEl.node(), { containerLocation, resourceState, lastLoadOperation, conflicts });
          })
          .on('mouseleave.callback', (event, containerLocation: ContainerLocation) => {
            event.preventDefault();
            onExit(event, tableContainerEl.node(), { containerLocation, resourceState, lastLoadOperation, conflicts });
          });

        // Draw table name text
        const textX = paddingX;
        const textY = y(index) + paddingY * 2;
        d3.select(this)
          .append('g')
          .attr('class', NAME_CLASS)
          .append('text')
          .text(containerLocation.name)
          .attr('x', textX)
          .attr('y', textY);

        // Draw last three digits of table serial number below table name text
        const containerSerial = resourceState?.containerObj?.serial;
        if (queryParameters?.showSerials && containerSerial) {
          const lastThreeDigits = containerSerial.substring(containerSerial.length - 3);

          const serialTextGroup = d3
            .select(this)
            .append('g')
            .attr('class', TABLE_SERIAL_CLASS)
            .attr('transform', `translate(${textX}, ${textY})`);

          const serialText = serialTextGroup
            .append('text')
            .text(`:${lastThreeDigits}`)
            .attr('dy', '1rem') // move one line below table name text
            .attr('font-weight', 'bold');

          // get the bounding box of the serial text so we can draw white rect background.
          const textBBox = serialText.node().getBBox();

          // draw a white background so that serial number is visible when text overlaps table graphic.
          serialTextGroup
            .insert('rect', 'text')
            .style('fill', 'white')
            .attr('dy', '1rem')
            .attr('width', textBBox?.width + 2)
            .attr('height', textBBox?.height);
        }
      });
  };
