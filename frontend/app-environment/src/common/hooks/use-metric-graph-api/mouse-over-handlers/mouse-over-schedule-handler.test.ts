import { getGraphTooltipDataTestIds } from '@plentyag/app-environment/src/common/components';
import { getSetpointsUntilEndDateTime } from '@plentyag/app-environment/src/common/components/schedule-graph/hooks/use-graph-api/utils';
import { buildSchedule } from '@plentyag/app-environment/src/common/test-helpers';
import { MOUSE_OVER_EFFECT } from '@plentyag/app-environment/src/common/utils/constants';
import { drawContainer, drawMouseOverCircle } from '@plentyag/app-environment/src/common/utils/d3';
import { InterpolationType, Schedule } from '@plentyag/core/src/types/environment';
import * as d3 from 'd3';
import { DateTime } from 'luxon';

import { MouseOverScheduleHandler, mouseOverScheduleHandler } from './mouse-over-schedule-handler';

const { circles, container } = MOUSE_OVER_EFFECT;
const color = '#dedede';
const paddingX = 0;
const paddingY = 0;
const scheduleSingleValue = buildSchedule({
  actions: [
    { time: 0, valueType: 'SINGLE_VALUE', value: '10' },
    { time: 3600, valueType: 'SINGLE_VALUE', value: '20' },
  ],
});
const scheduleMultipleValues = buildSchedule({
  actions: [
    { time: 0, valueType: 'MULTIPLE_VALUE', values: { zoneA: '10', zoneB: '20' } },
    { time: 3600, valueType: 'MULTIPLE_VALUE', values: { zoneA: '20', zoneB: '40' } },
  ],
});

interface GetArguments {
  schedule: Schedule;
  x0: Date;
  key?: string;
  remainingPath?: string;
}

function getArguments({
  schedule,
  key,
  x0,
  remainingPath,
}: GetArguments): Omit<MouseOverScheduleHandler, 'onIntersect'> {
  const graphTooltipSelectors = getGraphTooltipDataTestIds('test');
  const startDateTime = new Date(schedule.startsAt);
  const endDateTime = DateTime.fromISO(schedule.startsAt).plus({ seconds: schedule.repeatInterval }).toJSDate();
  const x = d3.scaleTime().domain([startDateTime, endDateTime]);
  const y = d3.scaleLinear().domain([0, 100]).range([0, 100]);
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  const tooltip = d3.select(document.createElement('div'));

  // draw container
  drawContainer({ svg, class: container, paddingX, paddingY });

  // draw circle
  drawMouseOverCircle({ svg, class: circles.schedule(schedule, key), color });

  // append schedule header
  tooltip.append('div').attr('id', graphTooltipSelectors.scheduleHeader(schedule));
  // append schedule content
  tooltip.append('div').attr('id', graphTooltipSelectors.scheduleWithKey(schedule, key));

  return {
    unitSymbol: 'C',
    svg,
    actionDefinition: { measurementType: 'TEMPERATURE', graphable: true, from: 0, to: 100 },
    bisect: d3.bisector(d => d.time),
    data: getSetpointsUntilEndDateTime({ schedule, startDateTime, endDateTime, x, y }),
    graphTooltipSelectors,
    key,
    mouseX: x(x0),
    schedule,
    tooltip,
    x,
    y,
    remainingPath,
  };
}

describe('mouseOverScheduleHandler', () => {
  it("hides the schedule's circle and clears the tooltip text", () => {
    const schedule = buildSchedule({ actions: [] });
    const args = getArguments({ schedule, x0: DateTime.fromISO(schedule.startsAt).plus({ seconds: 3599 }).toJSDate() });
    const { svg, tooltip, graphTooltipSelectors, key } = args;

    const scheduleCircle = svg.querySelector(`circle.${circles.schedule(schedule, key)}`);
    const scheduleHeaderTooltip = tooltip.node().querySelector(`#${graphTooltipSelectors.scheduleHeader(schedule)}`);
    const scheduleTooltip = tooltip.node().querySelector(`#${graphTooltipSelectors.scheduleWithKey(schedule, key)}`);

    // append tooltip content
    scheduleHeaderTooltip.innerHTML = 'foobar';
    scheduleTooltip.innerHTML = 'foobar';

    expect(scheduleCircle).not.toHaveAttribute('visibility');
    expect(scheduleHeaderTooltip).toHaveTextContent('foobar');
    expect(scheduleTooltip).toHaveTextContent('foobar');

    mouseOverScheduleHandler(args);

    expect(scheduleCircle).toHaveAttribute('visibility', 'hidden');
    expect(scheduleCircle).not.toHaveAttribute('transform');
    expect(scheduleHeaderTooltip).toHaveTextContent('');
    expect(scheduleTooltip).toHaveTextContent('');
  });

  it('shows a circle and some content for the tooltip (single value)', () => {
    const schedule = scheduleSingleValue;
    const args = getArguments({ schedule, x0: DateTime.fromISO(schedule.startsAt).plus({ seconds: 3599 }).toJSDate() });
    const { svg, tooltip, graphTooltipSelectors, mouseX, y, key } = args;

    const scheduleCircle = svg.querySelector(`circle.${circles.schedule(schedule, key)}`);
    const scheduleHeaderTooltip = tooltip.node().querySelector(`#${graphTooltipSelectors.scheduleHeader(schedule)}`);
    const scheduleTooltip = tooltip.node().querySelector(`#${graphTooltipSelectors.scheduleWithKey(schedule, key)}`);

    expect(scheduleCircle).not.toHaveAttribute('visibility');
    expect(scheduleHeaderTooltip).toHaveTextContent('');
    expect(scheduleTooltip).toHaveTextContent('');

    mouseOverScheduleHandler(args);

    expect(scheduleCircle).toHaveAttribute('visibility', 'visible');
    expect(scheduleCircle).toHaveAttribute('transform', `translate(${mouseX},${y(10)})`);
    expect(scheduleHeaderTooltip).toHaveTextContent('');
    expect(scheduleTooltip).toHaveTextContent('Schedule: 10 C');
  });

  it('shows a circle and some content for the tooltip (multiple values)', () => {
    const key = 'zoneA';
    const schedule = scheduleMultipleValues;
    const args = getArguments({
      schedule,
      key,
      x0: DateTime.fromISO(schedule.startsAt).plus({ seconds: 3599 }).toJSDate(),
    });
    const { svg, tooltip, graphTooltipSelectors, mouseX, y } = args;

    const scheduleCircle = svg.querySelector(`circle.${circles.schedule(schedule, key)}`);
    const scheduleHeaderTooltip = tooltip.node().querySelector(`#${graphTooltipSelectors.scheduleHeader(schedule)}`);
    const scheduleTooltip = tooltip.node().querySelector(`#${graphTooltipSelectors.scheduleWithKey(schedule, key)}`);

    expect(scheduleCircle).not.toHaveAttribute('visibility');
    expect(scheduleHeaderTooltip).toHaveTextContent('');
    expect(scheduleTooltip).toHaveTextContent('');

    mouseOverScheduleHandler(args);

    expect(scheduleCircle).toHaveAttribute('visibility', 'visible');
    expect(scheduleCircle).toHaveAttribute('transform', `translate(${mouseX},${y(10)})`);
    expect(scheduleHeaderTooltip).toHaveTextContent('');
    expect(scheduleTooltip).toHaveTextContent('Schedule (zoneA): 10 C');
  });

  it('shows a circle and some content for the tooltip for linear interpolated schedule', () => {
    const schedule = { ...scheduleSingleValue, interpolationType: InterpolationType.linear };
    const args = getArguments({ schedule, x0: DateTime.fromISO(schedule.startsAt).plus({ seconds: 1800 }).toJSDate() });
    const { svg, tooltip, graphTooltipSelectors, mouseX, y, key } = args;

    const scheduleCircle = svg.querySelector(`circle.${circles.schedule(schedule, key)}`);
    const scheduleHeaderTooltip = tooltip.node().querySelector(`#${graphTooltipSelectors.scheduleHeader(schedule)}`);
    const scheduleTooltip = tooltip.node().querySelector(`#${graphTooltipSelectors.scheduleWithKey(schedule, key)}`);

    expect(scheduleCircle).not.toHaveAttribute('visibility');
    expect(scheduleHeaderTooltip).toHaveTextContent('');
    expect(scheduleTooltip).toHaveTextContent('');

    mouseOverScheduleHandler(args);

    expect(scheduleCircle).toHaveAttribute('visibility', 'visible');
    expect(scheduleCircle).toHaveAttribute('transform', `translate(${mouseX},${y(15)})`);
    expect(scheduleHeaderTooltip).toHaveTextContent('');
    expect(scheduleTooltip).toHaveTextContent('Schedule: 15 C');
  });

  it('shows a circle and some content for the tooltip (single value using remainingPath)', () => {
    const schedule = scheduleSingleValue;
    const args = getArguments({ schedule, x0: DateTime.fromISO(schedule.startsAt).plus({ seconds: 3599 }).toJSDate() });
    const { svg, tooltip, graphTooltipSelectors, mouseX, y, key } = args;

    const scheduleCircle = svg.querySelector(`circle.${circles.schedule(schedule, key)}`);
    const scheduleHeaderTooltip = tooltip.node().querySelector(`#${graphTooltipSelectors.scheduleHeader(schedule)}`);
    const scheduleTooltip = tooltip.node().querySelector(`#${graphTooltipSelectors.scheduleWithKey(schedule, key)}`);

    expect(scheduleCircle).not.toHaveAttribute('visibility');
    expect(scheduleHeaderTooltip).toHaveTextContent('');
    expect(scheduleTooltip).toHaveTextContent('');

    mouseOverScheduleHandler({ ...args, remainingPath: 'VerticalGrow/GrowRoom1' });

    expect(scheduleCircle).toHaveAttribute('visibility', 'visible');
    expect(scheduleCircle).toHaveAttribute('transform', `translate(${mouseX},${y(10)})`);
    expect(scheduleHeaderTooltip).toHaveTextContent('VerticalGrow/GrowRoom1: 10 C');
    expect(scheduleTooltip).toHaveTextContent('');
  });

  it('shows a circle and some content for the tooltip (multiple values using remainingPath)', () => {
    const key = 'zoneA';
    const schedule = scheduleMultipleValues;
    const args = getArguments({
      schedule,
      key,
      x0: DateTime.fromISO(schedule.startsAt).plus({ seconds: 1800 }).toJSDate(),
    });
    const { svg, tooltip, graphTooltipSelectors, mouseX, y } = args;

    const scheduleCircle = svg.querySelector(`circle.${circles.schedule(schedule, key)}`);
    const scheduleHeaderTooltip = tooltip.node().querySelector(`#${graphTooltipSelectors.scheduleHeader(schedule)}`);
    const scheduleTooltip = tooltip.node().querySelector(`#${graphTooltipSelectors.scheduleWithKey(schedule, key)}`);

    expect(scheduleCircle).not.toHaveAttribute('visibility');
    expect(scheduleHeaderTooltip).toHaveTextContent('');
    expect(scheduleTooltip).toHaveTextContent('');

    mouseOverScheduleHandler({ ...args, remainingPath: 'VerticalGrow/GrowRoom1' });

    expect(scheduleCircle).toHaveAttribute('visibility', 'visible');
    expect(scheduleCircle).toHaveAttribute('transform', `translate(${mouseX},${y(10)})`);
    expect(scheduleHeaderTooltip).toHaveTextContent('VerticalGrow/GrowRoom1');
    expect(scheduleTooltip).toHaveTextContent('zoneA: 10 C');
  });
});
