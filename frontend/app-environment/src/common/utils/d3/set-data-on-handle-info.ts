import { HANDLER_INFO } from '@plentyag/app-environment/src/common/utils/constants';
import { Point } from '@plentyag/core/src/types/environment';
import { getComputedTextLength } from '@plentyag/core/src/utils';
import * as d3 from 'd3';

import { getHandleInfoLabel } from '.';

export interface SetDataOnHandleInfo<T extends Point<Date>> {
  svg: SVGSVGElement;
  selector: string;
  data: T;
  coordX: number;
  coordY?: number;
  yAttribute: string;
  unitSymbol: string;
}

/**
 * Update the Handle Info SVG Element, its position and its text content.
 */
export function setDataOnHandleInfo<T extends Point<Date>>({
  svg: svgProp,
  selector,
  data,
  coordX,
  coordY,
  unitSymbol,
  yAttribute,
}: SetDataOnHandleInfo<T>) {
  const svg = d3.select(svgProp);

  if (svg.select(selector).empty()) {
    return;
  }

  // Update the position of the container to where the Handle was moved.
  if (!coordY) {
    // We only want to change the CoordY of the HandleInfo.
    // Therefore we fetch the Y coordinate from the transform: translate(X, Y) attribute.
    const reg = new RegExp(/translate\(\s*([0-9\.\,\s)]+)\)/g);
    const translateValues = svg
      .select(selector)
      .attr('transform')
      .replace(reg, (a, b) => b);
    const currentCoordY = translateValues.split(', ')[1];
    svg.select(selector).attr('transform', `translate(${coordX + HANDLER_INFO.left}, ${currentCoordY})`);
  } else {
    svg.select(selector).attr('transform', `translate(${coordX + HANDLER_INFO.left}, ${coordY + HANDLER_INFO.top})`);
  }

  // Update the Text of the Handle info to refect the new Y and X values.
  const handlerText = svg
    .select<SVGTextElement>(`${selector} text`)
    .text(getHandleInfoLabel({ point: data, yAttribute, unitSymbol }));

  // Update the background <rect> to match the new text size.
  svg.select(`${selector} rect`).attr('width', getComputedTextLength(handlerText.node()) + HANDLER_INFO.left);
}
