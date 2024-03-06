import { YAxisScaleType } from '@plentyag/core/src/types';
import * as d3 from 'd3';

import { GrowLaneDirection } from '../../types';
import { GrowLaneData } from '../use-vertical-grow-graph-data';

export interface UseVerticalGrowGraphScale {
  width: number;
  height: number;
  lanes: GrowLaneData[];
  towerWidth?: number;
}

interface Directions {
  range: Iterable<number>;
  name: GrowLaneDirection;
}

interface TowersScale {
  towersScale: d3.AxisScale<YAxisScaleType>;
  name: string;
  laneName: string;
}

export interface UseVerticalGrowGraphScaleReturn {
  width: number;
  height: number;
  paddingX: number;
  paddingY: number;
  chartMarginX: number;
  chartMarginY: number;
  chartWidth: number;
  chartHeight: number;
  ticks: number;
  towersScale: Record<string, TowersScale>;
  lanesScale: d3.AxisScale<YAxisScaleType>;
}

const TOWER_WIDTH = 3;
const PADDING_X = 16;
const PADDING_Y = 16;
const CHART_MARGIN_X = 32;
const CHART_MARGIN_Y = 24;
const MIN_TICK_SPACING = 64;

/**
 * Set the scaling for spacing between each tower and spacing between each "lane"
 * It also contains parameters for how many "ticks" should show for axis.
 */
export const useVerticalGrowGraphScale = ({
  width,
  height,
  lanes,
  towerWidth = TOWER_WIDTH,
}: UseVerticalGrowGraphScale): UseVerticalGrowGraphScaleReturn => {
  const paddingX = PADDING_X;
  const paddingY = PADDING_Y;

  const chartMarginX = CHART_MARGIN_X;
  const chartMarginY = CHART_MARGIN_Y;
  const chartWidth = width - paddingX * 2 - chartMarginX * 2;
  const chartHeight = height - paddingY * 2 - chartMarginY * 2;

  const ticks = Math.floor(chartWidth / MIN_TICK_SPACING);

  // define the scales for the towers of each lane
  const towersScale = lanes.reduce<UseVerticalGrowGraphScaleReturn['towersScale']>((agg, lane, i) => {
    const towersLength = lane.towers.length;

    // directions starting from left to right and continue to "snake" down
    // depends on how many lanes there are
    // ex: >-------\
    //     /-------/
    //     \------->
    const directions: Directions[] = [
      {
        name: GrowLaneDirection.RIGHT,
        range: [0, chartWidth], // left to right
      },
      {
        name: GrowLaneDirection.RIGHT_DOWN,
        range: [-((towersLength / 2) * towerWidth), (towersLength / 2) * towerWidth], // keep it centered
      },
      {
        name: GrowLaneDirection.LEFT,
        range: [chartWidth, 0], // right to left
      },
      {
        name: GrowLaneDirection.LEFT_DOWN,
        range: [-((towersLength / 2) * towerWidth), (towersLength / 2) * towerWidth], // keep it centered
      },
    ];
    const lastDirection = directions.length;

    // determine the range
    const dirObj = directions[i % lastDirection];

    // define the direction and the tower scale method
    agg[lane.laneName] = {
      laneName: lane.laneName,
      name: dirObj.name,
      towersScale: d3.scaleLinear().domain([lane.startIndex, lane.endIndex]).range(dirObj.range),
    };

    return agg;
  }, {});

  // define the scale for the lanes (rows)
  const lanesScale = d3
    .scaleLinear()
    .domain([0, lanes.length - 1])
    .range([0, chartHeight]);

  return {
    width,
    height,
    paddingX,
    paddingY,
    chartMarginX,
    chartMarginY,
    chartWidth,
    chartHeight,
    ticks,
    towersScale,
    lanesScale,
  };
};
