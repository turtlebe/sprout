import * as d3 from 'd3';

import { GrowLaneDirection } from '../../types';
import { GrowLaneData } from '../use-vertical-grow-graph-data';

import { RenderFunction } from '.';

export interface RenderAxis {
  lanes: GrowLaneData[];
}

export const X_AXIS_CLASS = 'vg-axis-graph';

export const renderAxis: RenderFunction<RenderAxis> =
  ({ svgRef, scale }) =>
  ({ lanes }) => {
    // No DOM ref? get outta here!
    if (!svgRef.current) {
      return;
    }

    // Scale metadata
    const { height, paddingX, chartMarginX, towersScale, ticks } = scale;

    // SVG Element
    const svgChartEl = d3.select(svgRef.current);

    // Draw all the lanes
    svgChartEl
      .selectAll(`.${X_AXIS_CLASS}`)
      .data(lanes)
      .enter()
      .each(function (lane) {
        const laneScaling = towersScale[lane?.laneName || 'default'];

        // Format tick label
        const tickFormatter = (d: any) => {
          const tower = lane.towers.find(tower => tower.index === d);
          return tower.name;
        };

        // Axis config
        let axisFunction: 'axisTop' | 'axisBottom';
        let axisTransform: string;
        if (laneScaling.name === GrowLaneDirection.RIGHT) {
          axisFunction = 'axisTop';
          axisTransform = `translate(${paddingX + chartMarginX}, 20)`;
        }
        if (laneScaling.name === GrowLaneDirection.LEFT) {
          axisFunction = 'axisBottom';
          axisTransform = `translate(${paddingX + chartMarginX}, ${height - 20})`;
        }

        // Go!
        if (axisFunction) {
          const axis = d3[axisFunction](laneScaling.towersScale).tickFormat(tickFormatter).ticks(ticks);
          d3.select(this).append('g').attr('class', X_AXIS_CLASS).attr('transform', axisTransform).call(axis);
        }
      });
  };
