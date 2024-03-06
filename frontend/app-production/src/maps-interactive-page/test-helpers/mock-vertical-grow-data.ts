import * as d3 from 'd3';

import { UseVerticalGrowGraphScaleReturn } from '../components/vertical-grow-room-view/hooks/use-vertical-grow-graph-scale';

import { mockFarmDefContainerLocations } from './mock-farm-def-object-data';

export const mockVerticalGrowGraphScale: UseVerticalGrowGraphScaleReturn = {
  width: 500,
  height: 200,
  paddingX: 16,
  paddingY: 16,
  chartMarginX: 32,
  chartMarginY: 24,
  chartWidth: 404,
  chartHeight: 120,
  ticks: 1,
  towersScale: {
    A: { laneName: 'A', name: 'RIGHT', towersScale: d3.scaleLinear().domain([1, 2]).range([0, 404]) },
    '-': { laneName: '-', name: 'RIGHT_DOWN', towersScale: d3.scaleLinear().domain([3, 3]).range([-1.5, -1.5]) },
    B: { laneName: 'B', name: 'LEFT', towersScale: d3.scaleLinear().domain([4, 6]).range([404, 0]) },
  },
  lanesScale: d3.scaleLinear().domain([0, 2]).range([0, 120]),
};

export const mockLanesForStraightStyle = [
  {
    laneName: 'default',
    startIndex: 1,
    endIndex: 1,
    towers: [
      {
        name: 'T1',
        kind: 'containerLocation',
        path: 'sites/SSF2/areas/VerticalGrow/lines/GrowRoom/machines/GrowLane1/containerLocations/T1',
        ref: '123-abc:containerLocation-T1',
        class: 'TowerIndex',
        properties: {},
        containerTypes: ['Tower'],
        index: 1,
        mappings: [],
      },
    ],
  },
];

export const mockVerticalGrowGraphScaleForStraightStyle: UseVerticalGrowGraphScaleReturn = {
  width: 500,
  height: 200,
  paddingX: 16,
  paddingY: 16,
  chartMarginX: 32,
  chartMarginY: 24,
  chartWidth: 404,
  chartHeight: 120,
  ticks: 1,
  towersScale: {
    default: { laneName: 'default', name: 'default', towersScale: d3.scaleLinear().domain([1, 2]).range([0, 404]) },
  },
  lanesScale: d3.scaleLinear().domain([0, 2]).range([0, 120]),
};

export const mockLanes = [
  {
    laneName: 'A',
    startIndex: 1,
    endIndex: 2,
    towers: [
      {
        ...mockFarmDefContainerLocations,
        name: 'A0',
        properties: { lane: 'A' },
        index: 1,
      },
      {
        ...mockFarmDefContainerLocations,
        name: 'A1',
        properties: { lane: 'A' },
        index: 2,
      },
    ],
  },
  {
    laneName: '-',
    startIndex: 3,
    endIndex: 3,
    towers: [
      {
        ...mockFarmDefContainerLocations,
        name: 'UTurn',
        properties: { lane: '-' },
        index: 3,
      },
    ],
  },
  {
    laneName: 'B',
    startIndex: 4,
    endIndex: 6,
    towers: [
      {
        ...mockFarmDefContainerLocations,
        name: 'B0',
        properties: { lane: 'B' },
        index: 4,
      },
      {
        ...mockFarmDefContainerLocations,
        name: 'B1',
        properties: { lane: 'B' },
        index: 5,
      },
      {
        ...mockFarmDefContainerLocations,
        name: 'B2',
        properties: { lane: 'B' },
        index: 6,
      },
    ],
  },
];
