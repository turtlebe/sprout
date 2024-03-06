import * as d3 from 'd3';

export const mockPropagationLevelScaleReturn = {
  width: 100,
  height: 100,
  paddingX: 5,
  paddingY: 15,
  x: d3.scaleLinear().domain([0, 50]).range([0, 100]),
};
