import { YAxisScaleType } from '@plentyag/core/src/types';
import * as d3 from 'd3';

import { getSetpointsUntilEndDateTime } from '../../components/schedule-graph/hooks/use-graph-api/utils';
import { buildSchedule } from '../../test-helpers';

import { dragHandlerNoInterpolationSchedule } from './drag-handlers';

function getArgs(schedule, key = undefined) {
  const startDateTime = new Date('2023-03-20T00:00:00Z');
  const endDateTime = new Date('2023-03-21T00:00:00Z');
  const maxY = 100;
  const minY = 0;

  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  const ref = { current: svg };

  const x = d3.scaleTime().domain([startDateTime, endDateTime]);
  const y: d3.AxisScale<YAxisScaleType> = d3.scaleLinear().domain([maxY, minY]).range([0, 100]);

  const oneOf = [];
  const unitSymbol = 'C';
  const yValues = [];

  const data = getSetpointsUntilEndDateTime({ schedule, startDateTime, endDateTime, x, y, isEditing: true });
  const dataForHandles = data.filter(setpoint => !setpoint.isVirtual);

  const that = d3.select(svg).append('circle').attr('index', '0').node();

  const d = { x: x(new Date('2023-03-20T01:00:00Z')), y: y(50) } as unknown as d3.D3DragEvent<Element, string, string>;

  return {
    d,
    data,
    dataForHandles,
    endDateTime,
    key,
    maxY,
    minY,
    oneOf,
    ref,
    startDateTime,
    that,
    unitSymbol,
    x,
    y,
    yValues,
  };
}

describe('dragHandlerNoInterpolationSchedule', () => {
  it('mutates the data (single value)', () => {
    const schedule = buildSchedule({
      actions: [
        { time: 0, valueType: 'SINGLE_VALUE', value: '10' },
        { time: 7200, valueType: 'SINGLE_VALUE', value: '20' },
      ],
    });
    const args = getArgs(schedule);
    const { dataForHandles, that } = args;

    expect(dataForHandles).toEqual([
      expect.objectContaining({ value: '10', time: new Date('2023-03-20T00:00:00Z') }),
      expect.objectContaining({ value: '20', time: new Date('2023-03-20T02:00:00Z') }),
    ]);

    expect(that).not.toHaveAttribute('cx');
    expect(that).not.toHaveAttribute('cy');

    dragHandlerNoInterpolationSchedule({
      ...args,
    });

    expect(dataForHandles).toEqual([
      expect.objectContaining({ value: '50', time: new Date('2023-03-20T01:00:00Z') }),
      expect.objectContaining({ value: '20', time: new Date('2023-03-20T02:00:00Z') }),
    ]);

    expect(that).toHaveAttribute('cx');
    expect(that).toHaveAttribute('cy');
  });

  it('mutates the data (single value)', () => {
    const schedule = buildSchedule({
      actions: [
        { time: 0, valueType: 'MULTIPLE_VALUE', values: { zone1: '10', zone: '20' } },
        { time: 7200, valueType: 'MULTIPLE_VALUE', values: { zone1: '30', zone: '40' } },
      ],
    });
    const args = getArgs(schedule, 'zone1');
    const { dataForHandles, that } = args;

    expect(dataForHandles).toEqual([
      expect.objectContaining({ values: { zone1: '10', zone: '20' }, time: new Date('2023-03-20T00:00:00Z') }),
      expect.objectContaining({ values: { zone1: '30', zone: '40' }, time: new Date('2023-03-20T02:00:00Z') }),
    ]);

    expect(that).not.toHaveAttribute('cx');
    expect(that).not.toHaveAttribute('cy');

    dragHandlerNoInterpolationSchedule({
      ...args,
    });

    expect(dataForHandles).toEqual([
      expect.objectContaining({ values: { zone1: '50', zone: '20' }, time: new Date('2023-03-20T01:00:00Z') }),
      expect.objectContaining({ values: { zone1: '30', zone: '40' }, time: new Date('2023-03-20T02:00:00Z') }),
    ]);

    expect(that).toHaveAttribute('cx');
    expect(that).toHaveAttribute('cy');
  });
});
