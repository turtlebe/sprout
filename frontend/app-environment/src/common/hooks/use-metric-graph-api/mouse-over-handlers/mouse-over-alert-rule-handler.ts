import {
  getAlertRuleTypeLabel,
  getYCoordBetweenTwoPoints,
  isRuleOneSided,
} from '@plentyag/app-environment/src/common/utils';
import { MOUSE_OVER_EFFECT } from '@plentyag/app-environment/src/common/utils/constants';
import { invertValue } from '@plentyag/app-environment/src/common/utils/d3';
import { AlertRule, Rule } from '@plentyag/core/src/types/environment';
import * as d3 from 'd3';
import { isNumber } from 'lodash';

import { MouseOverHandler } from '.';

const { circles } = MOUSE_OVER_EFFECT;

export interface MouseOverAlertRuleHandler extends MouseOverHandler<Rule<Date>> {
  alertRule: AlertRule;
}

export function mouseOverAlertRuleHandler({
  svg,
  alertRule,
  bisect,
  graphTooltipSelectors,
  mouseX,
  data,
  tooltip,
  unitSymbol,
  x,
  y,
}: MouseOverAlertRuleHandler) {
  const circleMin = d3.select(svg).select(`circle.${circles.alertRuleMin(alertRule)}`);
  const circleMax = d3.select(svg).select(`circle.${circles.alertRuleMax(alertRule)}`);
  const alertRuleTooltip = tooltip.select(`#${graphTooltipSelectors.alertRule(alertRule)}`);

  const [maxY, minY] = y.domain();
  // Get the index in the data of where the mouse intersect
  const i = bisect.left(data, x.invert(mouseX));

  // With the index, get the points on the left and right of where the mouse intersects.
  const left = data[i - 1];
  const right = data[i];

  if (left && right) {
    // With the left and right points, calculate the Y coordinates where the mouse intersects (for min and max).
    const minCoordY = getYCoordBetweenTwoPoints({
      mouseX,
      x1: x(left.time),
      y1: y(left.gte ?? minY),
      x2: x(right.time),
      y2: y(right.gte ?? minY),
    });
    const maxCoordY = getYCoordBetweenTwoPoints({
      mouseX,
      x1: x(left.time),
      y1: y(left.lte ?? maxY),
      x2: x(right.time),
      y2: y(right.lte ?? maxY),
    });

    // Update the circle's position based on the Mouse's X coordinate.
    circleMin
      .attr('visibility', isNumber(left.gte) ? 'visible' : 'hidden')
      .attr('transform', isNumber(left.gte) ? 'translate(' + mouseX + ',' + minCoordY + ')' : undefined);
    circleMax
      .attr('visibility', isNumber(left.lte) ? 'visible' : 'hidden')
      .attr('transform', isNumber(left.lte) ? 'translate(' + mouseX + ',' + maxCoordY + ')' : undefined);

    // Generate tooltip legend
    const tooltipLegend = isRuleOneSided(left)
      ? isNumber(left.gte)
        ? `>= ${invertValue(y, minCoordY)}`
        : `<= ${invertValue(y, maxCoordY)}`
      : `${invertValue(y, minCoordY)}-${invertValue(y, maxCoordY)}`;

    // Update the Tooltip's content regarding the AlertRule's min/max values
    alertRuleTooltip.text(`${getAlertRuleTypeLabel(alertRule.alertRuleType)}: ${tooltipLegend} ${unitSymbol}`);
  } else {
    circleMin.attr('visibility', 'hidden');
    circleMax.attr('visibility', 'hidden');
    alertRuleTooltip.text('');
  }
}
