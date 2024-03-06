import { HANDLER_INFO } from '@plentyag/app-environment/src/common/utils/constants';
import { Point } from '@plentyag/core/src/types/environment';
import * as d3 from 'd3';
import { get, isNil } from 'lodash';

import { getHandleInfoLabel } from '.';

export interface DrawHandleInfo<T extends Point<Date>> {
  color: string;
  data: T[];
  yAttribute: string;
  classes: string[];
  selector: string;
  unitSymbol: string;
  x: d3.ScaleTime<number, number>;
  y: d3.AxisScale<string | d3.NumberValue>;
}

/**
 * Renders an SVG container that contains a <rect> and a <text> element to display next to
 * a Handle (dots that allows to modify an AlertRule's min/max range or Schedule's action).
 *
 * The <rect> element is used as background for the text with a certain color.
 * The <text> element contains the current value of the Handle (Y value) and the time associated with it (X value).
 */
export function drawHandleInfo<T extends Point<Date>>({
  selector,
  data,
  yAttribute,
  unitSymbol,
  x,
  y,
  color,
  classes,
}: DrawHandleInfo<T>) {
  const handleTexts = d3
    .select(selector)
    .selectAll('handle-info')
    .data(data)
    .enter()
    .append('g')
    .attr('index', (_, i) => i)
    .attr('class', classes.join(' '))
    .attr('display', d => (!isNil(get(d, yAttribute)) ? null : 'none'))
    .attr('transform', d => {
      const value = get(d, yAttribute);
      if (isNil(value)) {
        return;
      }
      return `translate(${x(d.time) + HANDLER_INFO.left}, ${y(value) + HANDLER_INFO.top})`;
    });

  const texts = handleTexts
    .append('text')
    .text(d => getHandleInfoLabel({ point: d, yAttribute, unitSymbol }))
    .attr('fill', '#FFFFFF');

  handleTexts
    .append('rect')
    .lower()
    .attr('fill', color)
    .attr('width', (_, i) => texts.nodes().at(i).getComputedTextLength() + HANDLER_INFO.left)
    .attr('height', (_, i) => (texts.nodes().at(i).getComputedTextLength() == 0 ? 0 : 32))
    .attr('x', (HANDLER_INFO.left * -1) / 2)
    .attr('y', HANDLER_INFO.top * -1 - HANDLER_INFO.top / 4)
    .attr('rx', 4)
    .attr('ry', 4);
}
