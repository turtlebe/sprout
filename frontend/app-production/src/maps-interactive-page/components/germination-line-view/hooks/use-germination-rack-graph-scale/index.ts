import { FarmDefMachine } from '@plentyag/core/src/farm-def/types';
import { YAxisScaleType } from '@plentyag/core/src/types';
import * as d3 from 'd3';

export interface UseGerminationRackGraphScale {
  width: number;
  height: number;
  containerLocations: FarmDefMachine['containerLocations'];
}

export interface UseGerminationRackGraphScaleReturn {
  y: d3.AxisScale<YAxisScaleType>;
  width: number;
  height: number;
  paddingX: number;
  paddingY: number;
}

const PADDING_X = 8;
const PADDING_Y = 8;

export const useGerminationRackGraphScale = ({
  width,
  height,
  containerLocations,
}: UseGerminationRackGraphScale): UseGerminationRackGraphScaleReturn => {
  const paddingX = PADDING_X;
  const paddingY = PADDING_Y;

  const dataLength = Object.values(containerLocations).length;

  const y = d3.scaleLinear().domain([0, dataLength]).range([0, height]);

  return {
    y,
    width,
    height,
    paddingX,
    paddingY,
  };
};
