import { useUnitConversion } from '@plentyag/app-environment/src/common/hooks';
import { getActionDefinitions } from '@plentyag/app-environment/src/common/utils';
import { HEIGHT, PADDING_X, PADDING_Y, WIDTH } from '@plentyag/app-environment/src/common/utils/constants';
import { ScheduleDefinition } from '@plentyag/core/src/farm-def/types';
import { YAxisScaleType } from '@plentyag/core/src/types/environment';
import * as d3 from 'd3';

export interface UseScale {
  scheduleDefinitions: ScheduleDefinition[];
  width: number;
  height?: number;
  startDateTime: Date;
  endDateTime: Date;
  minY?: number;
  maxY?: number;
}

export interface UseScaleReturn {
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

export const useScale = ({
  minY: propMinY,
  maxY: propMaxY,
  scheduleDefinitions,
  startDateTime,
  endDateTime,
  width = WIDTH,
  height = HEIGHT,
}: UseScale): UseScaleReturn => {
  const { convertToPreferredUnit, getConcreteMeasurementType } = useUnitConversion();

  const paddingX = PADDING_X;
  const paddingY = PADDING_Y;

  const actionDefinitions = scheduleDefinitions.flatMap(scheduleDefinition =>
    getActionDefinitions(scheduleDefinition, { graphable: true })
  );
  const [{ actionDefinition }] = actionDefinitions;
  const measurementType = getConcreteMeasurementType(actionDefinition.measurementType);

  // The X-Scale is always Time Based.
  const xScale = d3
    .scaleTime()
    .domain([startDateTime, endDateTime])
    .range([0, width - paddingX * 2]);

  const oneOf = actionDefinitions.flatMap(({ actionDefinition }) => actionDefinition.oneOf || []);

  // When the ScheduleDefinition defines a limited set of values through `oneOf`, we use a Point scale.
  if (measurementType.defaultUnit === 'NONE' && oneOf.length > 0) {
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
      minY: null, // we don't need minY/maxY downstream to bound the setpoints when editing.
      maxY: null,
      startDateTime,
      endDateTime,
    };
  }

  const from = Math.min(
    ...actionDefinitions.map(({ actionDefinition }) => actionDefinition.from).filter(Number.isInteger)
  );
  const to = Math.max(...actionDefinitions.map(({ actionDefinition }) => actionDefinition.to).filter(Number.isInteger));

  // The Y-Scale can be Linear between min and max values
  const minY = propMinY || convertToPreferredUnit(from, measurementType);
  const maxY = propMaxY || convertToPreferredUnit(to, measurementType);

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
    minY,
    maxY,
    startDateTime,
    endDateTime,
  };
};
