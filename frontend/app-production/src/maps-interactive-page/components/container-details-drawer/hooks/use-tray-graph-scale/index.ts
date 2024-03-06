import { YAxisScaleType } from '@plentyag/core/src/types';
import * as d3 from 'd3';

import { Site, TrayDimensions } from '../../constants';

export interface UseTrayGraphScale {
  siteName?: string;
  width: number;
  height: number;
}

export interface UseTrayGraphScaleReturn {
  width: number;
  height: number;
  paddingX: number;
  paddingY: number;
  yScale: d3.AxisScale<YAxisScaleType>;
  xScale: d3.AxisScale<YAxisScaleType>;
}

const PADDING_X = 32;
const PADDING_Y = 32;

/**
 * This scale will try to maintain the aspect ratio of the tray respecting the hight and width limits
 */
export const useTrayGraphScale = ({ siteName, width, height }: UseTrayGraphScale): UseTrayGraphScaleReturn => {
  const paddingX = PADDING_X;
  const paddingY = PADDING_Y;

  const chartWidth = width - paddingX * 2;
  const chartHeight = height - paddingY * 2;

  const trayDimensions = TrayDimensions[Site[siteName || 'Default']];

  const sizeRatio = trayDimensions.plugsHorizontally / trayDimensions.plugsVertically;

  const chartWidthBasedOnHeight = chartHeight * sizeRatio;
  const chartHeightBasedOnWidth = chartWidth / sizeRatio;

  let yScale, xScale;
  if (chartHeight < chartHeightBasedOnWidth) {
    xScale = d3.scaleLinear().domain([0, trayDimensions.plugsHorizontally]).range([0, chartWidthBasedOnHeight]);
    yScale = d3.scaleLinear().domain([0, trayDimensions.plugsVertically]).range([0, chartHeight]);
  } else {
    xScale = d3.scaleLinear().domain([0, trayDimensions.plugsHorizontally]).range([0, chartWidth]);
    yScale = d3.scaleLinear().domain([0, trayDimensions.plugsVertically]).range([0, chartHeightBasedOnWidth]);
  }

  return {
    width,
    height,
    paddingX,
    paddingY,
    yScale,
    xScale,
  };
};
