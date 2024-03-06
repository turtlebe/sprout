import { getGraphTooltipDataTestIds } from '@plentyag/app-environment/src/common/components';
import { buildMetric, buildRolledUpByTimeObservation } from '@plentyag/app-environment/src/common/test-helpers';
import { MOUSE_OVER_EFFECT } from '@plentyag/app-environment/src/common/utils/constants';
import { drawContainer, drawMouseOverCircle } from '@plentyag/app-environment/src/common/utils/d3';
import { TimeSummarization } from '@plentyag/core/src/types/environment';
import { getLastPathSegmentFromStringPath } from '@plentyag/core/src/utils';
import * as d3 from 'd3';

import { mouseOverMetricHandler, MouseOverMetricHandler } from './mouse-over-metric-handler';

const { circles, container } = MOUSE_OVER_EFFECT;
const color = '#dedede';
const paddingX = 0;
const paddingY = 0;

function getArguments(x0: Date, timeSummarization = TimeSummarization.median): MouseOverMetricHandler {
  const observations = [
    buildRolledUpByTimeObservation({ rolledUpAt: '2023-01-01T01:00:00Z', median: 10, value: 'A' }),
    buildRolledUpByTimeObservation({ rolledUpAt: '2023-01-01T02:00:00Z', median: 20, value: 'B' }),
    buildRolledUpByTimeObservation({ rolledUpAt: '2023-01-01T03:00:00Z', median: 30, value: 'C', noData: true }),
    buildRolledUpByTimeObservation({ rolledUpAt: '2023-01-01T04:00:00Z', median: 40, value: 'D' }),
  ];
  const graphTooltipSelectors = getGraphTooltipDataTestIds('test');
  const startDateTime = new Date(observations[0]?.rolledUpAt);
  const endDateTime = new Date(observations[observations.length - 1].rolledUpAt);
  const x = d3.scaleTime().domain([startDateTime, endDateTime]);
  const y =
    timeSummarization === TimeSummarization.value
      ? d3
          .scalePoint()
          .domain(observations.map(o => o.value))
          .range([0, 100])
      : d3.scaleLinear().domain([0, 100]).range([0, 100]);

  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  const tooltip = d3.select(document.createElement('div'));
  const tooltipSelector = graphTooltipSelectors.observation;

  // draw container
  drawContainer({ svg, class: container, paddingX, paddingY });

  // draw circle
  drawMouseOverCircle({ svg, class: circles.observations, color });

  // append tooltip content
  tooltip.append('div').attr('id', tooltipSelector);

  return {
    bisect: d3.bisector(d => new Date(d.rolledUpAt)),
    circleSelector: circles.observations,
    data: observations,
    graphTooltipSelectors,
    metric: buildMetric({}),
    mouseX: x(x0),
    svg,
    timeSummarization,
    tooltip,
    tooltipSelector,
    unitSymbol: 'C',
    x,
    y,
  };
}

describe('mouseOverMetricHandler', () => {
  it('hides the circle and clears the tooltip text', () => {
    const args = getArguments(new Date('2023-01-01T05:00:00Z'));
    const { svg, tooltip, tooltipSelector } = args;

    const metricCircle = svg.querySelector(`circle.${circles.observations}`);
    const metricTooltip = tooltip.node().querySelector(`#${tooltipSelector}`);

    // append tooltip content
    metricTooltip.innerHTML = 'foobar';

    expect(metricCircle).not.toHaveAttribute('visibility');
    expect(metricTooltip).toHaveTextContent('foobar');

    mouseOverMetricHandler(args);

    expect(metricCircle).toHaveAttribute('visibility', 'hidden');
    expect(metricCircle).not.toHaveAttribute('transform');
    expect(metricTooltip).toHaveTextContent('');
  });

  it('shows a circle and the value in the tooltip (with the Metric description)', () => {
    const args = getArguments(new Date('2023-01-01T02:00:00Z'));
    const { svg, tooltip, tooltipSelector, metric, mouseX, y } = args;

    const metricCircle = svg.querySelector(`circle.${circles.observations}`);
    const metricTooltip = tooltip.node().querySelector(`#${tooltipSelector}`);

    expect(metricCircle).not.toHaveAttribute('visibility');
    expect(metricTooltip).toHaveTextContent('');

    mouseOverMetricHandler(args);

    expect(metricCircle).toHaveAttribute('visibility', 'visible');
    expect(metricCircle).toHaveAttribute('transform', `translate(${mouseX},${y(20)})`);
    expect(metricTooltip).toHaveTextContent(
      `${getLastPathSegmentFromStringPath(metric.path)} - ${metric.observationName} Median: 20 C`
    );
  });

  it('shows a circle and the value in the tooltip (with the given remaining path)', () => {
    const remainingPath = 'RemainingPath';
    const args = getArguments(new Date('2023-01-01T02:00:00Z'));
    const { svg, tooltip, tooltipSelector, metric, mouseX, y } = args;

    const metricCircle = svg.querySelector(`circle.${circles.observations}`);
    const metricTooltip = tooltip.node().querySelector(`#${tooltipSelector}`);

    expect(metricCircle).not.toHaveAttribute('visibility');
    expect(metricTooltip).toHaveTextContent('');

    mouseOverMetricHandler({ ...args, remainingPath });

    expect(metricCircle).toHaveAttribute('visibility', 'visible');
    expect(metricCircle).toHaveAttribute('transform', `translate(${mouseX},${y(20)})`);
    expect(metricTooltip).toHaveTextContent(`${remainingPath} - ${metric.observationName} Median: 20 C`);
  });

  it('shows a circle and the value in the tooltip (without the Metric description)', () => {
    const args = getArguments(new Date('2023-01-01T02:00:00Z'));
    const { svg, tooltip, tooltipSelector, mouseX, y } = args;

    const metricCircle = svg.querySelector(`circle.${circles.observations}`);
    const metricTooltip = tooltip.node().querySelector(`#${tooltipSelector}`);

    expect(metricCircle).not.toHaveAttribute('visibility');
    expect(metricTooltip).toHaveTextContent('');

    mouseOverMetricHandler({ ...args, metric: null });

    expect(metricCircle).toHaveAttribute('visibility', 'visible');
    expect(metricCircle).toHaveAttribute('transform', `translate(${mouseX},${y(20)})`);
    expect(metricTooltip).toHaveTextContent('Median: 20 C');
  });

  it('hides the circle and ?? when intersecting with a noData observation', () => {
    const args = getArguments(new Date('2023-01-01T03:00:00Z'));
    const { svg, tooltip, tooltipSelector } = args;

    const metricCircle = svg.querySelector(`circle.${circles.observations}`);
    const metricTooltip = tooltip.node().querySelector(`#${tooltipSelector}`);

    expect(metricCircle).not.toHaveAttribute('visibility');
    expect(metricTooltip).toHaveTextContent('');

    mouseOverMetricHandler({ ...args, metric: null });

    expect(metricCircle).toHaveAttribute('visibility', 'hidden');
    expect(metricCircle).not.toHaveAttribute('transform');
    expect(metricTooltip).toHaveTextContent('Median: ??');
  });

  it('shows a circle and the interpolated value in the tooltip', () => {
    const args = getArguments(new Date('2023-01-01T01:30:00Z'));
    const { svg, tooltip, tooltipSelector, mouseX, y } = args;

    const metricCircle = svg.querySelector(`circle.${circles.observations}`);
    const metricTooltip = tooltip.node().querySelector(`#${tooltipSelector}`);

    expect(metricCircle).not.toHaveAttribute('visibility');
    expect(metricTooltip).toHaveTextContent('');

    mouseOverMetricHandler({ ...args, metric: null });

    expect(metricCircle).toHaveAttribute('visibility', 'visible');
    expect(metricCircle).toHaveAttribute('transform', `translate(${mouseX},${y(15)})`);
    expect(metricTooltip).toHaveTextContent('Median: 15 C');
  });

  it('shows a circle and the value in the tooltip when timeSummarization is value', () => {
    const args = getArguments(new Date('2023-01-01T02:00:00Z'), TimeSummarization.value);
    const { svg, tooltip, tooltipSelector, mouseX, y } = args;

    const metricCircle = svg.querySelector(`circle.${circles.observations}`);
    const metricTooltip = tooltip.node().querySelector(`#${tooltipSelector}`);

    expect(metricCircle).not.toHaveAttribute('visibility');
    expect(metricTooltip).toHaveTextContent('');

    mouseOverMetricHandler({ ...args, metric: null });

    expect(metricCircle).toHaveAttribute('visibility', 'visible');
    expect(metricCircle).toHaveAttribute('transform', `translate(${mouseX},${y('A')})`);
    expect(metricTooltip).toHaveTextContent('Value: A');
  });
});
