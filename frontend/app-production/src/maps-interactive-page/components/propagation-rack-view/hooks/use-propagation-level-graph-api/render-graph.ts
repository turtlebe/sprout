import { drawCommentIcon } from '@plentyag/app-production/src/maps-interactive-page/components/draw-comment-icon';
import { ERROR_COLOR, STYLE } from '@plentyag/app-production/src/maps-interactive-page/constants';
import {
  ContainerData,
  ContainerEventHandler,
  GetCropColor,
  IrrigationExecutionType,
  MapsState,
  QueryParameters,
} from '@plentyag/app-production/src/maps-interactive-page/types';
import { getColorsForCropsInResource } from '@plentyag/app-production/src/maps-interactive-page/utils';
import { getContainerOpacity } from '@plentyag/app-production/src/maps-interactive-page/utils/get-container-opacity';
import { ContainerLocation, FarmDefMachine } from '@plentyag/core/src/farm-def/types';
import * as d3 from 'd3';
import { sortBy } from 'lodash';

import { RenderFunction } from '.';

import { drawIrrigationIcon } from './draw-irrigation-icon';
import { drawIrrigationTypeIcon } from './draw-irrigation-type-icon';
import { drawPropagationTable } from './draw-propagation-table';

export interface RenderGraph {
  containerLocations: FarmDefMachine['containerLocations'];
  mapsState: MapsState;
  getCropColor: GetCropColor;
  selectedTable?: ContainerData;
  queryParameters?: QueryParameters;
  onEnter?: ContainerEventHandler;
  onExit?: ContainerEventHandler;
  onClick?: ContainerEventHandler;
}

const TABLE_BASE_COLOR = '#e6e6e6';

export const CONTAINER_CLASS = 'prop-graph';
export const TABLE_CLASS = 'prop-graph-slot';
export const NAME_CLASS = 'prop-graph-name';

const noop = () => {};

export const renderGraph: RenderFunction<RenderGraph> =
  ({ ref, scale, showLift }) =>
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
    const { width: containerWidth, height: containerHeight, paddingX, paddingY, x } = scale;

    // Container node
    const container = ref.current;

    // Canvas Sizes
    const canvasHeight = containerHeight - paddingY * 2;

    // Data Preparation -- sort by index and convert to array
    const dataPoints = sortBy(Object.values(containerLocations), 'index');

    // Container Element
    const containerEl = d3.select(container);

    // Init SVG
    const svgChartEl = containerEl.select(`svg.${CONTAINER_CLASS}`).node()
      ? containerEl.select(`.${CONTAINER_CLASS}`)
      : containerEl
          .append('svg:svg')
          .attr('overflow', 'visible')
          .attr('class', CONTAINER_CLASS)
          .style('position', 'absolute')
          .style('top', '0')
          .style('left', '0');

    // Adjust width/height
    svgChartEl.attr('width', containerWidth).attr('height', containerHeight);

    // Table properties
    const tableWidth = x(1) - paddingX * 2;
    const tableHeight = canvasHeight;
    const tableBaseColor = TABLE_BASE_COLOR;

    // Load data
    svgChartEl
      .selectAll(`.${TABLE_CLASS}`)
      .data(dataPoints)
      .enter()
      .each(function (containerLocation, index) {
        const tableContainerEl = d3.select(this).append('g').attr('class', TABLE_CLASS);

        // product field can be single crop (ex: "B11") or multiple crops (ex: "B11,WHC")
        const resource = mapsState[containerLocation.ref];
        const resourceState = resource?.resourceState;

        const lastLoadOperation = mapsState[containerLocation.ref]?.lastLoadOperation;

        const { firstCropColor, secondCropColor } = getColorsForCropsInResource(resourceState, getCropColor);

        // Conflicts
        const conflicts = mapsState[containerLocation.ref]?.conflicts;
        const hasError = Boolean(conflicts);

        // If selected table is the same as this point, highlight it
        const toHighlight = selectedTable?.containerLocation?.ref === containerLocation.ref;

        const selectedAgeCohortDate = queryParameters?.ageCohortDate;
        const selectedCrops = queryParameters?.selectedCrops;
        const selectedLabels = queryParameters?.selectedLabels;

        const tableOpacity = getContainerOpacity({ resource, selectedAgeCohortDate, selectedCrops, selectedLabels });

        // Draw Table
        drawPropagationTable({
          el: tableContainerEl,
          x: x(index) + paddingX,
          y: showLift ? paddingY * 1.5 : paddingY / 2,
          width: tableWidth,
          height: tableHeight,
          baseColor: tableBaseColor,
          tableOpacity,
          tableColor: firstCropColor,
          secondTableColor: secondCropColor,
          xColor: tableBaseColor,
          showLift,
          toHighlight,
          highlightStrokeColor: STYLE.active.strokeColor,
          highlightFillColor: STYLE.active.fillColor,
          errorColor: ERROR_COLOR,
          hasError,
        });

        // Irrigation execution type
        const irrigationExecution = queryParameters?.showIrrigationLayer
          ? mapsState[containerLocation.ref]?.irrigationExecution
          : undefined;
        if (irrigationExecution) {
          drawIrrigationIcon({
            el: tableContainerEl,
            x: x(index),
            y: paddingY * 1.8,
            status: irrigationExecution.status,
          });
        }
        if (irrigationExecution?.type == IrrigationExecutionType.MANUAL) {
          drawIrrigationTypeIcon({
            el: tableContainerEl,
            x: x(index) + 15,
            y: paddingY * 2.7,
            irrigationType: irrigationExecution.type,
          });
        }
        if (queryParameters?.showCommentsLayer && mapsState[containerLocation.ref]?.hasComments) {
          drawCommentIcon({ el: tableContainerEl, x: x(index) + 10, y: -20 });
        }

        // Bind click event
        tableContainerEl
          .style('cursor', 'pointer')
          .on('click.callback', (event, containerLocation: ContainerLocation) => {
            event.preventDefault();
            onClick(event, tableContainerEl.node(), {
              containerLocation,
              resourceState,
              lastLoadOperation,
              conflicts,
              irrigationExecution,
            });
          })
          .on('mouseenter.callback', (event, containerLocation: ContainerLocation) => {
            event.preventDefault();
            onEnter(event, tableContainerEl.node(), {
              containerLocation,
              resourceState,
              lastLoadOperation,
              conflicts,
              irrigationExecution,
            });
          })
          .on('mouseleave.callback', (event, containerLocation: ContainerLocation) => {
            event.preventDefault();
            onExit(event, tableContainerEl.node(), {
              containerLocation,
              resourceState,
              lastLoadOperation,
              conflicts,
              irrigationExecution,
            });
          });

        // don't show container index if one only one slot (ex: tableLift)
        const containerIndex = dataPoints.length > 1 ? containerLocation.index.toString() : '';

        const containerNameText = tableContainerEl
          .append('g')
          .attr('class', NAME_CLASS)
          .append('text')
          .text(containerIndex)
          .attr('x', tableWidth / 2 + (x(index) + paddingX))
          .attr('y', tableHeight + paddingY * 1.5)
          .style('text-anchor', 'middle');

        const serial = resourceState?.containerObj?.serial;
        if (serial && queryParameters?.showSerials) {
          const lastThreeDigitsOfSerial = serial.substring(serial.length - 3);
          containerNameText.append('tspan').attr('font-weight', 'bold').text(`:${lastThreeDigitsOfSerial}`);
        }
      });
  };
