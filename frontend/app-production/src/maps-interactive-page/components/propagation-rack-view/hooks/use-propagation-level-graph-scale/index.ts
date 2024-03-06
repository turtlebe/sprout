import { FarmDefMachine } from '@plentyag/core/src/farm-def/types';
import { XAxisScaleType } from '@plentyag/core/src/types';
import * as d3 from 'd3';

export interface UsePropagationLevelGraphScale {
  width: number;
  height: number;
  containerLocations: FarmDefMachine['containerLocations'];
}

export interface UsePropagationLevelGraphScaleReturn {
  x: d3.AxisScale<XAxisScaleType>;
  width: number;
  height: number;
  paddingX: number;
  paddingY: number;
}

const PADDING_X = 5;
const PADDING_Y = 15;

export const usePropagationLevelGraphScale = ({
  width,
  height,
  containerLocations,
}: UsePropagationLevelGraphScale): UsePropagationLevelGraphScaleReturn => {
  const paddingX = PADDING_X;
  const paddingY = PADDING_Y;

  const dataLength = Object.values(containerLocations).length;

  const x = d3.scaleLinear().domain([0, dataLength]).range([0, width]);

  return {
    x,
    width,
    height,
    paddingX,
    paddingY,
  };
};
