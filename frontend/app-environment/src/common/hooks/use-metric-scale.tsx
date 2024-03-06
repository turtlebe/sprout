import { HEIGHT, PADDING_X, PADDING_Y, WIDTH } from '@plentyag/app-environment/src/common/utils/constants';
import { RolledUpByTimeObservation } from '@plentyag/core/src/types';
import { YAxisScaleType } from '@plentyag/core/src/types/environment';
import * as d3 from 'd3';
import _ from 'lodash';

export interface UseMetricScale {
  isStepInterpolation?: boolean;
  observations?: RolledUpByTimeObservation[];
  minY: number;
  maxY: number;
  startDateTime: Date;
  endDateTime: Date;
  width: number;
  height?: number;
}

export interface UseMetricScaleReturn {
  x: d3.ScaleTime<number, number>;
  y: d3.AxisScale<YAxisScaleType>;
  minY: number;
  maxY: number;
  width: number;
  height: number;
  paddingX: number;
  paddingY: number;
  startDateTime: Date;
  endDateTime: Date;
}

export const useMetricScale = ({
  isStepInterpolation = false,
  observations = [],
  minY,
  maxY,
  startDateTime,
  endDateTime,
  width = WIDTH,
  height = HEIGHT,
}: UseMetricScale): UseMetricScaleReturn => {
  const paddingX = PADDING_X;
  const paddingY = PADDING_Y;

  // The X-Scale is always Time Based.
  const xScale = d3
    .scaleTime()
    .domain([startDateTime, endDateTime])
    .range([0, width - paddingX * 2]);

  if (isStepInterpolation) {
    const oneOf = _.uniq(observations.map(o => o.value));

    const yScale = d3
      .scalePoint()
      .domain(oneOf)
      .range([0, height - paddingY * 2])
      .padding(1);

    return {
      x: xScale,
      y: yScale,
      width,
      height,
      paddingX,
      paddingY,
      minY: null,
      maxY: null,
      startDateTime,
      endDateTime,
    };
  } else {
    const yScale = d3
      .scaleLinear()
      .domain([maxY, minY])
      .range([0, height - paddingY * 2]);

    return {
      x: xScale,
      y: yScale,
      width,
      height,
      paddingX,
      paddingY,
      startDateTime,
      endDateTime,
      minY,
      maxY,
    };
  }
};
