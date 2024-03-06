import { mockScheduleDefinitions, mockSchedules } from '@plentyag/app-environment/src/common/test-helpers';
import { InterpolationType } from '@plentyag/core/src/types/environment';
import * as d3 from 'd3';

import { renderSchedule } from './render-schedule';

const startDateTime = new Date('2022-01-01T00:00:00Z');
const endDateTime = new Date('2022-01-02T00:00:00Z');

const singleValueSchedule = {
  ...mockSchedules.find(schedule => schedule.path.includes('ThermalHumidity')),
  startsAt: startDateTime.toISOString(),
  activatesAt: startDateTime.toISOString(),
};
const singleValueScheduleDefinition = mockScheduleDefinitions.find(schedule => schedule.name === 'ThermalHumidity');

const multipleValueSchedule = {
  ...mockSchedules.find(schedule => schedule.path.includes('SetLightIntensity')),
  startsAt: startDateTime.toISOString(),
  activatesAt: startDateTime.toISOString(),
};
const multipleValueScheduleDefinition = mockScheduleDefinitions.find(schedule => schedule.name === 'SetLightIntensity');

describe('renderSchedule', () => {
  let node, ref, scale;

  beforeEach(() => {
    // ARRANGE
    // -- create dimensions and yScale
    scale = {
      startDateTime,
      endDateTime,
      paddingX: 10,
      paddingY: 10,
      x: d3.scaleTime().domain([startDateTime, endDateTime]).range([0, 100]),
      y: d3.scaleLinear().domain([0, 100]).range([0, 100]),
    };

    // -- create DOM element & ref
    node = document.createElement('div');
    ref = {
      current: node,
    } as unknown as React.MutableRefObject<HTMLDivElement>;
  });

  it('renders a schedule with single values and no interpolation', () => {
    const schedule = { ...singleValueSchedule, interpolationType: InterpolationType.none };
    const scheduleDefinition = singleValueScheduleDefinition;

    renderSchedule({ ref, scale, schedule })({
      schedule,
      scheduleDefinition,
    });

    expect(node.querySelectorAll(`g.frame-${schedule.id}`)).toHaveLength(1);
    expect(node.querySelectorAll(`g.handle-frame-${schedule.id}`)).toHaveLength(1);
    // 2 setpoints, 3 lines per setpoints
    expect(node.querySelectorAll(`line.schedule-${schedule.id}.horizontal`)).toHaveLength(6);
    expect(node.querySelectorAll(`line.schedule-${schedule.id}.vertical`)).toHaveLength(6);
    expect(node.querySelectorAll('circle')).toHaveLength(2);
  });

  it('renders a schedule with multiple values and no interpolation', () => {
    const schedule = { ...multipleValueSchedule, interpolationType: InterpolationType.none };
    const scheduleDefinition = multipleValueScheduleDefinition;

    renderSchedule({ ref, scale, schedule })({
      schedule,
      scheduleDefinition,
    });

    expect(node.querySelectorAll(`g.frame-${schedule.id}`)).toHaveLength(1);
    expect(node.querySelectorAll(`g.handle-frame-${schedule.id}`)).toHaveLength(1);
    // 2 setpoints, 3 lines per setpoints
    expect(node.querySelectorAll(`line.schedule-${schedule.id}.horizontal.zone1`)).toHaveLength(6);
    expect(node.querySelectorAll(`line.schedule-${schedule.id}.vertical.zone1`)).toHaveLength(6);
    expect(node.querySelectorAll(`line.schedule-${schedule.id}.horizontal.zone2`)).toHaveLength(6);
    expect(node.querySelectorAll(`line.schedule-${schedule.id}.vertical.zone2`)).toHaveLength(6);
    expect(node.querySelectorAll('circle')).toHaveLength(4);
  });

  it('renders a schedule with single values and linear interpolation', () => {
    const schedule = { ...singleValueSchedule, interpolationType: InterpolationType.linear };
    const scheduleDefinition = singleValueScheduleDefinition;

    renderSchedule({ ref, scale, schedule })({
      schedule,
      scheduleDefinition,
    });

    expect(node.querySelectorAll(`g.frame-${schedule.id}`)).toHaveLength(1);
    expect(node.querySelectorAll(`g.handle-frame-${schedule.id}`)).toHaveLength(1);
    // 2 setpoints, 2 lines per setpoint & 2 virtual virtual on edges
    expect(node.querySelectorAll(`line.schedule-${schedule.id}.value`)).toHaveLength(4);
    expect(node.querySelectorAll('circle')).toHaveLength(2);
  });

  it('renders a schedule with multiple values and linear interpolation', () => {
    const schedule = { ...multipleValueSchedule, interpolationType: InterpolationType.linear };
    const scheduleDefinition = multipleValueScheduleDefinition;

    renderSchedule({ ref, scale, schedule })({
      schedule,
      scheduleDefinition,
    });

    expect(node.querySelectorAll(`g.frame-${schedule.id}`)).toHaveLength(1);
    expect(node.querySelectorAll(`g.handle-frame-${schedule.id}`)).toHaveLength(1);
    // 2 setpoints, 2 lines per setpoint & 2 virtual on edges
    expect(node.querySelectorAll(`line.schedule-${schedule.id}.value.zone1`)).toHaveLength(4);
    expect(node.querySelectorAll(`line.schedule-${schedule.id}.value.zone2`)).toHaveLength(4);
    expect(node.querySelectorAll('circle')).toHaveLength(4);
  });
});
