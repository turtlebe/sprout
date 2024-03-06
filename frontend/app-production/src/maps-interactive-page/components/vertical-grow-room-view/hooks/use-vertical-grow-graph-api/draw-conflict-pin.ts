import { conflictPinIconPath } from '@plentyag/app-production/src/maps-interactive-page/assets/draw-elements';
import { ERROR_COLOR } from '@plentyag/app-production/src/maps-interactive-page/constants';
import { getContainerOpacity } from '@plentyag/app-production/src/maps-interactive-page/utils/get-container-opacity';

export const ERROR_SURFACE_COLOR = '#cccccc';
export const CONFLICT_CLASS = 'vg-tower-conflict';
export const CONFLICT_ICON_CLASS = 'vg-tower-conflict-icon';
export const INNER_PADDING = 0.1;

import { TOWER_RADIUS } from '../../constants';

import { DrawPin } from './render-pins';

/**
 * This function draws a pin on the tower for the given containerLocation
 * when there is a conflict (more than one tower at the given location).
 * The pin is red with exclamation mark.
 */
export const drawConflictPin: DrawPin = ({
  mapsState,
  containerLocation,
  el,
  x,
  y,
  width,
  height,
  queryParameters,
}) => {
  const resource = mapsState?.[containerLocation.ref];
  const conflicts = resource?.conflicts;
  const hasConflicts = Boolean(conflicts);

  if (hasConflicts) {
    const conflictOpacity = getContainerOpacity({
      resource,
      selectedAgeCohortDate: queryParameters.ageCohortDate,
      selectedCrops: queryParameters.selectedCrops,
      selectedLabels: queryParameters.selectedLabels,
    });
    const errorEl = el.append('g').attr('class', CONFLICT_CLASS).attr('transform', `translate(${x}, ${y})`);

    // draw the tower
    errorEl
      .append('rect')
      .attr('rx', TOWER_RADIUS)
      .attr('x', width * INNER_PADDING)
      .attr('y', height * INNER_PADDING)
      .attr('width', width - width * INNER_PADDING * 2)
      .attr('height', height - height * INNER_PADDING * 2)
      .attr('fill', ERROR_SURFACE_COLOR);

    // draw the icon
    errorEl
      .append('g')
      .classed(CONFLICT_ICON_CLASS, true)
      .attr('transform', `translate(${-10 + width / 2}, ${-height - 10})`)
      .append('path')
      .attr('d', conflictPinIconPath)
      .attr('fill-rule', 'evenodd')
      .attr('clip-rule', 'evenodd')
      .attr('fill', ERROR_COLOR)
      .style('opacity', conflictOpacity);
  }
};
