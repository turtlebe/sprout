import * as d3 from 'd3';

export interface UseObservationsScale {
  minY: number;
  maxY: number;
  startDateTime: Date;
  endDateTime: Date;
  width?: number;
  height?: number;
}

export interface UseObservationsScaleReturn {
  x: d3.ScaleTime<number, number>;
  y: d3.AxisScale<number>;
  minY: number;
  maxY: number;
  width: number;
  height: number;
  paddingX: number;
  paddingY: number;
  startDateTime: Date;
  endDateTime: Date;
}

/**
 * Return D3 Scale for a Graph rendering Observations to represent a Data stream.
 */
export const useObservationsScale = ({
  minY,
  maxY,
  startDateTime,
  endDateTime,
  width = 150,
  height = 80,
}: UseObservationsScale): UseObservationsScaleReturn => {
  const paddingX = 4;
  const paddingY = 4;

  const xScale = d3
    .scaleTime()
    .domain([startDateTime, endDateTime])
    .range([0, width - paddingX * 2]);
  const yScale = d3
    .scaleLinear()
    .domain([maxY, minY])
    .range([0, height - paddingY * 2]);

  return { x: xScale, y: yScale, width, height, paddingX, paddingY, startDateTime, endDateTime, minY, maxY };
};
