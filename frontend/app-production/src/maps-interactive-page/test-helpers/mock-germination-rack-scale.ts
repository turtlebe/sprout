import * as d3 from 'd3';

export const mockGerminationRackGraphScaleReturn = {
  width: 100,
  height: 100,
  paddingX: 8,
  paddingY: 8,
  y: d3.scaleLinear().domain([0, 50]).range([0, 100]),
};
