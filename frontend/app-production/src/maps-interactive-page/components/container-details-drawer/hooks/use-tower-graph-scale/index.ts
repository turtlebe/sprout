import { YAxisScaleType } from '@plentyag/core/src/types';
import * as d3 from 'd3';

import { Site, TowerDimensions } from '../../constants';

export interface UseTowerGraphScale {
  siteName?: string;
  width: number;
  height: number;
}

export interface UseTowerGraphScaleReturn {
  width: number;
  height: number;
  contentHeight: number;
  yScale: d3.AxisScale<YAxisScaleType>;
}

const PLUG_HEIGHT = 20;

/**
 * This scale will try to maintain the aspect ratio of the tray respecting the hight and width limits
 */
export const useTowerGraphScale = ({ siteName, width, height }: UseTowerGraphScale): UseTowerGraphScaleReturn => {
  const towerDimensions = TowerDimensions[Site[siteName || 'Default']];

  const { plugs } = towerDimensions;

  const yScale = d3
    .scaleLinear()
    .domain([0, plugs])
    .range([0, PLUG_HEIGHT * plugs]);

  const contentHeight = yScale(plugs / 2 + 1);

  return {
    width,
    height,
    yScale,
    contentHeight,
  };
};
