import { getGraphTooltipDataTestIds } from '@plentyag/app-environment/src/common/components';
import { buildAlertRule } from '@plentyag/app-environment/src/common/test-helpers';
import { getAlertRuleTypeLabel, getRulesFromStartToEnd } from '@plentyag/app-environment/src/common/utils';
import { MOUSE_OVER_EFFECT } from '@plentyag/app-environment/src/common/utils/constants';
import { drawContainer, drawMouseOverCircle } from '@plentyag/app-environment/src/common/utils/d3';
import { AlertRule, InterpolationType } from '@plentyag/core/src/types/environment';
import * as d3 from 'd3';
import { DateTime } from 'luxon';

import { mouseOverAlertRuleHandler, MouseOverAlertRuleHandler } from './mouse-over-alert-rule-handler';

const { circles, container } = MOUSE_OVER_EFFECT;
const color = '#dedede';
const paddingX = 0;
const paddingY = 0;

function getArguments(alertRule: AlertRule, x0: Date): MouseOverAlertRuleHandler {
  const graphTooltipSelectors = getGraphTooltipDataTestIds('test');
  const startDateTime = new Date(alertRule.startsAt);
  const endDateTime = DateTime.fromISO(alertRule.startsAt).plus({ seconds: alertRule.repeatInterval }).toJSDate();
  const x = d3.scaleTime().domain([startDateTime, endDateTime]);
  const y = d3.scaleLinear().domain([0, 100]).range([0, 100]);
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  const tooltipNode = document.createElement('div');
  const tooltip = d3.select(tooltipNode);
  const tooltipSelector = graphTooltipSelectors.alertRule(alertRule);

  // draw container
  drawContainer({ svg, class: container, paddingX, paddingY });

  // draw circles
  drawMouseOverCircle({ svg, class: circles.alertRuleMin(alertRule), color });
  drawMouseOverCircle({ svg, class: circles.alertRuleMax(alertRule), color });

  // append tooltip content
  tooltip.append('div').attr('id', tooltipSelector);

  return {
    unitSymbol: 'C',
    svg,
    bisect: d3.bisector(d => d.time),
    data: getRulesFromStartToEnd({ alertRule, startDateTime, endDateTime, x, y }),
    graphTooltipSelectors,
    mouseX: x(x0),
    alertRule,
    tooltip,
    x,
    y,
  };
}

describe('mouseOverMetricHandler', () => {
  it('hides the circle and clears the tooltip text', () => {
    const alertRule = buildAlertRule({ rules: [] });
    const args = getArguments(alertRule, new Date(alertRule.startsAt));
    const { svg, tooltip, graphTooltipSelectors } = args;

    const alertRuleCircleMin = svg.querySelector(`circle.${circles.alertRuleMin(alertRule)}`);
    const alertRuleCircleMax = svg.querySelector(`circle.${circles.alertRuleMax(alertRule)}`);
    const alertRuleTooltip = tooltip.node().querySelector(`#${graphTooltipSelectors.alertRule(alertRule)}`);

    alertRuleTooltip.innerHTML = 'foobar';

    expect(alertRuleCircleMin).not.toHaveAttribute('visibility');
    expect(alertRuleCircleMax).not.toHaveAttribute('visibility');
    expect(alertRuleTooltip).toHaveTextContent('foobar');

    mouseOverAlertRuleHandler(args);

    expect(alertRuleCircleMin).toHaveAttribute('visibility', 'hidden');
    expect(alertRuleCircleMin).not.toHaveAttribute('transform');
    expect(alertRuleCircleMax).toHaveAttribute('visibility', 'hidden');
    expect(alertRuleCircleMax).not.toHaveAttribute('transform');
    expect(alertRuleTooltip).toHaveTextContent('');
  });

  it('shows a circle and the min/max in the tooltip', () => {
    const alertRule = buildAlertRule({
      rules: [
        { time: 3600 * 1, gte: 10, lte: 20 },
        { time: 3600 * 2, gte: 20, lte: 30 },
      ],
    });
    const args = getArguments(alertRule, DateTime.fromISO(alertRule.startsAt).plus({ seconds: 1000 }).toJSDate());
    const { svg, tooltip, graphTooltipSelectors, mouseX, y } = args;

    const alertRuleCircleMin = svg.querySelector(`circle.${circles.alertRuleMin(alertRule)}`);
    const alertRuleCircleMax = svg.querySelector(`circle.${circles.alertRuleMax(alertRule)}`);
    const alertRuleTooltip = tooltip.node().querySelector(`#${graphTooltipSelectors.alertRule(alertRule)}`);

    expect(alertRuleCircleMin).not.toHaveAttribute('visibility');
    expect(alertRuleCircleMax).not.toHaveAttribute('visibility');
    expect(alertRuleTooltip).toHaveTextContent('');

    mouseOverAlertRuleHandler(args);

    expect(alertRuleCircleMin).toHaveAttribute('visibility', 'visible');
    expect(alertRuleCircleMin).toHaveAttribute('transform', `translate(${mouseX},${y(20)})`);
    expect(alertRuleCircleMax).toHaveAttribute('visibility', 'visible');
    expect(alertRuleCircleMax).toHaveAttribute('transform', `translate(${mouseX},${y(30)})`);
    expect(alertRuleTooltip).toHaveTextContent(`${getAlertRuleTypeLabel(alertRule.alertRuleType)}: 20-30 C`);
  });

  it('shows a circle and the interpolated min/max in the tooltip', () => {
    const alertRule = buildAlertRule({
      interpolationType: InterpolationType.linear,
      rules: [
        { time: 3600 * 1, gte: 10, lte: 20 },
        { time: 3600 * 2, gte: 20, lte: 30 },
      ],
    });
    const args = getArguments(
      alertRule,
      DateTime.fromISO(alertRule.startsAt)
        .plus({ seconds: 3600 * 1.5 })
        .toJSDate()
    );
    const { svg, tooltip, graphTooltipSelectors, mouseX, y } = args;

    const alertRuleCircleMin = svg.querySelector(`circle.${circles.alertRuleMin(alertRule)}`);
    const alertRuleCircleMax = svg.querySelector(`circle.${circles.alertRuleMax(alertRule)}`);
    const alertRuleTooltip = tooltip.node().querySelector(`#${graphTooltipSelectors.alertRule(alertRule)}`);

    expect(alertRuleCircleMin).not.toHaveAttribute('visibility');
    expect(alertRuleCircleMax).not.toHaveAttribute('visibility');
    expect(alertRuleTooltip).toHaveTextContent('');

    mouseOverAlertRuleHandler(args);

    expect(alertRuleCircleMin).toHaveAttribute('visibility', 'visible');
    expect(alertRuleCircleMin).toHaveAttribute('transform', `translate(${mouseX},${y(15)})`);
    expect(alertRuleCircleMax).toHaveAttribute('visibility', 'visible');
    expect(alertRuleCircleMax).toHaveAttribute('transform', `translate(${mouseX},${y(25)})`);
    expect(alertRuleTooltip).toHaveTextContent(`${getAlertRuleTypeLabel(alertRule.alertRuleType)}: 15-25 C`);
  });

  it('shows a circle and the min value in the tooltip (one-sided rule with min)', () => {
    const alertRule = buildAlertRule({
      rules: [{ time: 0, gte: 10 }],
    });
    const args = getArguments(alertRule, DateTime.fromISO(alertRule.startsAt).plus({ seconds: 1000 }).toJSDate());
    const { svg, tooltip, graphTooltipSelectors, mouseX, y } = args;

    const alertRuleCircleMin = svg.querySelector(`circle.${circles.alertRuleMin(alertRule)}`);
    const alertRuleCircleMax = svg.querySelector(`circle.${circles.alertRuleMax(alertRule)}`);
    const alertRuleTooltip = tooltip.node().querySelector(`#${graphTooltipSelectors.alertRule(alertRule)}`);

    expect(alertRuleCircleMin).not.toHaveAttribute('visibility');
    expect(alertRuleCircleMax).not.toHaveAttribute('visibility');
    expect(alertRuleTooltip).toHaveTextContent('');

    mouseOverAlertRuleHandler(args);

    expect(alertRuleCircleMin).toHaveAttribute('visibility', 'visible');
    expect(alertRuleCircleMin).toHaveAttribute('transform', `translate(${mouseX},${y(10)})`);
    expect(alertRuleCircleMax).toHaveAttribute('visibility', 'hidden');
    expect(alertRuleCircleMax).not.toHaveAttribute('transform');
    expect(alertRuleTooltip).toHaveTextContent(`${getAlertRuleTypeLabel(alertRule.alertRuleType)}: >= 10 C`);
  });

  it('shows a circle and the max value in the tooltip (one-sided rule with max)', () => {
    const alertRule = buildAlertRule({
      rules: [{ time: 0, lte: 10 }],
    });
    const args = getArguments(alertRule, DateTime.fromISO(alertRule.startsAt).plus({ seconds: 1000 }).toJSDate());
    const { svg, tooltip, graphTooltipSelectors, mouseX, y } = args;

    const alertRuleCircleMin = svg.querySelector(`circle.${circles.alertRuleMin(alertRule)}`);
    const alertRuleCircleMax = svg.querySelector(`circle.${circles.alertRuleMax(alertRule)}`);
    const alertRuleTooltip = tooltip.node().querySelector(`#${graphTooltipSelectors.alertRule(alertRule)}`);

    expect(alertRuleCircleMin).not.toHaveAttribute('visibility');
    expect(alertRuleCircleMax).not.toHaveAttribute('visibility');
    expect(alertRuleTooltip).toHaveTextContent('');

    mouseOverAlertRuleHandler(args);

    expect(alertRuleCircleMin).toHaveAttribute('visibility', 'hidden');
    expect(alertRuleCircleMin).not.toHaveAttribute('transform');
    expect(alertRuleCircleMax).toHaveAttribute('visibility', 'visible');
    expect(alertRuleCircleMax).toHaveAttribute('transform', `translate(${mouseX},${y(10)})`);
    expect(alertRuleTooltip).toHaveTextContent(`${getAlertRuleTypeLabel(alertRule.alertRuleType)}: <= 10 C`);
  });
});
