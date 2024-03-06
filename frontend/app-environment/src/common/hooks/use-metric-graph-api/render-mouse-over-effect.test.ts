import * as d3 from 'd3';

import { getGraphTooltipDataTestIds } from '../../components';
import {
  buildAlertRule,
  buildMetric,
  buildRolledUpByTimeObservation,
  buildSchedule,
  buildScheduleDefinition,
} from '../../test-helpers';
import { MOUSE_OVER_EFFECT } from '../../utils/constants';

import { renderMouseOverEffect } from './render-mouse-over-effect';

const unitSymbol = 'C';
const graphTooltipSelectors = getGraphTooltipDataTestIds('test');
const startDateTime = new Date('2023-01-01T00:00:00Z');
const endDateTime = new Date('2023-01-02T00:00:00Z');
const actionDefinition = { from: 0, to: 100, measurementType: 'TEMPERATURE', graphable: true };

const { circles, container } = MOUSE_OVER_EFFECT;

describe('renderMouseOverEffect', () => {
  let node, ref, scale;

  beforeEach(() => {
    // ARRANGE
    // -- create dimensions and yScale
    scale = {
      x: d3.scaleTime().domain([startDateTime, endDateTime]).range([0, 100]),
      y: d3.scaleLinear().domain([0, 100]).range([0, 100]),
      min: 0,
      max: 100,
      alertRuleMin: 10,
      alertRuleMax: 20,
    };

    // -- create DOM element & ref
    node = document.createElement('div');
    ref = {
      current: node,
    } as unknown as React.MutableRefObject<HTMLDivElement>;
  });

  it('draws a circle for the observations line for a single metric', () => {
    const observations = [
      buildRolledUpByTimeObservation({ rolledUpAt: '2023-01-01T01:00:00Z' }),
      buildRolledUpByTimeObservation({ rolledUpAt: '2023-01-01T02:00:00Z' }),
      buildRolledUpByTimeObservation({ rolledUpAt: '2023-01-01T03:00:00Z' }),
    ];

    renderMouseOverEffect({ ref, scale })({ observations, unitSymbol, graphTooltipSelectors });

    expect(node.querySelector(`g.${container}`)).not.toBe(null);
    expect(node.querySelectorAll('line').length).toBe(1);
    expect(node.querySelectorAll('circle').length).toBe(1);
    expect(node.querySelector(`circle.${circles.observations}`)).not.toBe(null);
  });

  it('draws a circle for each observations line for multiple metrics', () => {
    const metricsWithObservations = [
      {
        metric: buildMetric({}),
        observations: [
          buildRolledUpByTimeObservation({ rolledUpAt: '2023-01-01T01:00:00Z' }),
          buildRolledUpByTimeObservation({ rolledUpAt: '2023-01-01T03:00:00Z' }),
        ],
        colors: ['#dedede', '#dfdfdf', '#dadada'],
      },
      {
        metric: buildMetric({}),
        observations: [
          buildRolledUpByTimeObservation({ rolledUpAt: '2023-01-01T04:00:00Z' }),
          buildRolledUpByTimeObservation({ rolledUpAt: '2023-01-01T05:00:00Z' }),
        ],
        colors: ['#fefefe', '#fafafa', '#fcfcfc'],
      },
    ];

    renderMouseOverEffect({ ref, scale })({ metricsWithObservations, unitSymbol, graphTooltipSelectors });

    expect(node.querySelector(`g.${container}`)).not.toBe(null);
    expect(node.querySelectorAll('line').length).toBe(1);
    expect(node.querySelectorAll('circle').length).toBe(2);
    expect(node.querySelector(`circle.${circles.metrics(metricsWithObservations[0].metric)}`)).not.toBe(null);
    expect(node.querySelector(`circle.${circles.metrics(metricsWithObservations[1].metric)}`)).not.toBe(null);
  });

  it('draws a circle for each alert rule min and max line', () => {
    const alertRules = [
      buildAlertRule({ startsAt: '2023-01-01T00:00:00Z', rules: [{ time: 0, gte: 10, lte: 20 }] }),
      buildAlertRule({ startsAt: '2023-01-01T00:00:00Z', rules: [{ time: 0, gte: 20, lte: 40 }] }),
    ];

    renderMouseOverEffect({ ref, scale })({ alertRules, unitSymbol, graphTooltipSelectors });

    expect(node.querySelector(`g.${container}`)).not.toBe(null);
    expect(node.querySelectorAll('line').length).toBe(1);
    expect(node.querySelectorAll('circle').length).toBe(4);
    expect(node.querySelector(`circle.${circles.alertRuleMin(alertRules[0])}`)).not.toBe(null);
    expect(node.querySelector(`circle.${circles.alertRuleMax(alertRules[0])}`)).not.toBe(null);
    expect(node.querySelector(`circle.${circles.alertRuleMin(alertRules[1])}`)).not.toBe(null);
    expect(node.querySelector(`circle.${circles.alertRuleMax(alertRules[1])}`)).not.toBe(null);
  });

  it('draws a circle for a single schedule line (context Single Schedule)', () => {
    const schedule = buildSchedule({});
    const scheduleDefinition = buildScheduleDefinition({ actionDefinition });

    renderMouseOverEffect({ ref, scale })({ schedule, scheduleDefinition, unitSymbol, graphTooltipSelectors });

    expect(node.querySelector(`g.${container}`)).not.toBe(null);
    expect(node.querySelectorAll('line').length).toBe(1);
    expect(node.querySelectorAll('circle').length).toBe(1);
    expect(node.querySelector(`circle.${circles.schedule(schedule, undefined)}`)).not.toBe(null);
  });

  it('draws a circle for each schedule line (context Single Schedule)', () => {
    const schedule = buildSchedule({});
    const scheduleDefinition = buildScheduleDefinition({
      actionDefinitions: { SetAirTemperature: actionDefinition, SetWaterTemperature: actionDefinition },
    });

    renderMouseOverEffect({ ref, scale })({ schedule, scheduleDefinition, unitSymbol, graphTooltipSelectors });

    expect(node.querySelector(`g.${container}`)).not.toBe(null);
    expect(node.querySelectorAll('line').length).toBe(1);
    expect(node.querySelectorAll('circle').length).toBe(2);
    expect(node.querySelector(`circle.${circles.schedule(schedule, 'SetAirTemperature')}`)).not.toBe(null);
    expect(node.querySelector(`circle.${circles.schedule(schedule, 'SetWaterTemperature')}`)).not.toBe(null);
  });

  it('draws a circle for a single schedule line (context Multiple Schedules)', () => {
    const schedules = [buildSchedule({}), buildSchedule({})];
    const scheduleDefinitions = [
      buildScheduleDefinition({ actionDefinition }),
      buildScheduleDefinition({ actionDefinition }),
    ];

    renderMouseOverEffect({ ref, scale })({ schedules, scheduleDefinitions, unitSymbol, graphTooltipSelectors });

    expect(node.querySelector(`g.${container}`)).not.toBe(null);
    expect(node.querySelectorAll('line').length).toBe(1);
    expect(node.querySelectorAll('circle').length).toBe(2);
    expect(node.querySelector(`circle.${circles.schedule(schedules[0], undefined)}`)).not.toBe(null);
    expect(node.querySelector(`circle.${circles.schedule(schedules[1], undefined)}`)).not.toBe(null);
  });

  it('draws a circle for each schedule line (context Multiple Schedules)', () => {
    const schedules = [buildSchedule({}), buildSchedule({})];
    const scheduleDefinitions = [
      buildScheduleDefinition({
        actionDefinitions: { SetAirTemperature: actionDefinition, SetWaterTemperature: actionDefinition },
      }),
      buildScheduleDefinition({
        actionDefinitions: { SetInteriorTemperature: actionDefinition, SetExteriorTemperature: actionDefinition },
      }),
    ];

    renderMouseOverEffect({ ref, scale })({ schedules, scheduleDefinitions, unitSymbol, graphTooltipSelectors });

    expect(node.querySelector(`g.${container}`)).not.toBe(null);
    expect(node.querySelectorAll('line').length).toBe(1);
    expect(node.querySelectorAll('circle').length).toBe(4);
    expect(node.querySelector(`circle.${circles.schedule(schedules[0], 'SetAirTemperature')}`)).not.toBe(null);
    expect(node.querySelector(`circle.${circles.schedule(schedules[0], 'SetWaterTemperature')}`)).not.toBe(null);
    expect(node.querySelector(`circle.${circles.schedule(schedules[1], 'SetInteriorTemperature')}`)).not.toBe(null);
    expect(node.querySelector(`circle.${circles.schedule(schedules[1], 'SetExteriorTemperature')}`)).not.toBe(null);
  });
});
