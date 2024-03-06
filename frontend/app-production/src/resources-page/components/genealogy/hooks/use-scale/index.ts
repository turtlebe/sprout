import * as d3 from 'd3';

import { getChartRange } from './get-chart-range';

export function useScale(ref: ProdResources.ChartRef, focusedResource: ProdResources.FocusedResource) {
  const { x, y } = getChartRange(focusedResource);

  const width = 1200;

  // adjust start and end date by 6 hours to give bit of view buffer on each side.
  // also gracefully handles edge case where there is a single operation, so timeline shows more than one tick.
  const startDate = new Date(x.startDate);
  startDate.setHours(startDate.getHours() - 6);

  const endDate = new Date(x.endDate);
  endDate.setHours(endDate.getHours() + 6);

  const xScale = d3.scaleTime().domain([startDate, endDate]).range([0, width]);

  // total number of ticks/index in the vertical direction.
  // this is essentially maximum of number of antecedents or subsequents plus 1.
  const numYTicks = y.endIndex - y.startIndex + 1;

  const tickHeight = 70;
  // dyanamically calculate height based on number of resource lines drawn vertically.
  // allow 70 pixel height for each line.
  const height = numYTicks * tickHeight;

  const timelineHeight = 30;
  const yScale = d3
    .scaleLinear()
    .domain([y.startIndex - 1, y.endIndex + 1])
    .range([height - timelineHeight, 0]);

  return { x: xScale, y: yScale, numYTicks, tickHeight, width, height, timelineHeight };
}
