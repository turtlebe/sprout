import { renderAlertRuleD3Area } from '@plentyag/app-environment/src/common/hooks/use-metric-graph-api/render-alert-rule-area';
import { getColorForAlertRuleType, getRulesFromStartToEnd } from '@plentyag/app-environment/src/common/utils';
import { d3Classes } from '@plentyag/app-environment/src/common/utils/constants';
import {
  dragHandlerLinearInterpolationAlertRule,
  dragHandlerNoInterpolationAlertRule,
  drawContainer,
  drawHandleInfo,
  drawHandles,
  drawLine,
  getElement,
  onMouseOut,
  onMouseOver,
  SetDataOnLine,
  setDataOnLine,
} from '@plentyag/app-environment/src/common/utils/d3';
import { copyAlertRule } from '@plentyag/app-environment/src/metric-page/utils';
import { AlertRule, InterpolationType, Rule } from '@plentyag/core/src/types/environment';
import { isScaleLinear } from '@plentyag/core/src/types/environment/type-guards';
import * as d3 from 'd3';
import { isNumber } from 'lodash';
import moment from 'moment';

import { RenderFunction } from '.';

export interface RenderAlertRuleEditMode {
  alertRule: AlertRule;
  onChange: (updatedAlertRule: AlertRule) => void;
  unitSymbol: string;
}

export const renderAlertRuleEditMode: RenderFunction<RenderAlertRuleEditMode> =
  ({ ref, scale }) =>
  ({ alertRule, onChange, unitSymbol }) => {
    const { minY, maxY, x, y, paddingX, paddingY, startDateTime, endDateTime } = scale;

    if (!isScaleLinear(y)) {
      return;
    }

    const data = getRulesFromStartToEnd({ alertRule, startDateTime, endDateTime, x, y, isEditing: true });
    const dataForHandles = data.filter(rule => !rule.isVirtual);
    const dragHandlerArgs = { x, y, startDateTime, endDateTime, minY, maxY, data, ref, unitSymbol };

    function dragLinearInterpolation(d) {
      const that = this;
      dragHandlerLinearInterpolationAlertRule({ ...dragHandlerArgs, d, that });
    }

    function dragNoInterpolation(d) {
      const that = this;
      dragHandlerNoInterpolationAlertRule({ ...dragHandlerArgs, d, that });
    }

    function dragHandler() {
      return d3
        .drag()
        .on(
          'drag',
          alertRule.interpolationType == InterpolationType.linear ? dragLinearInterpolation : dragNoInterpolation
        )
        .on('end', () => {
          const newRules = dataForHandles.map(rule => {
            return {
              ...rule,
              time: Math.round(moment.duration(moment(rule.time).diff(startDateTime)).as('seconds')),
            };
          });

          onChange(copyAlertRule({ alertRule, newRules }));
        });
    }

    // Draw container for Lines, Areas
    drawContainer({ svg: ref.current, class: d3Classes.frame, paddingX, paddingY });

    // Draw Area representing the Rules
    d3.select(getElement('g', d3Classes.frame))
      .append('path')
      .datum(data)
      .attr('fill', `url("#${alertRule.alertRuleType}")`)
      .attr('class', d3Classes.alertRuleArea)
      .attr('stroke', 'none')
      .attr('stroke-width', 1.5)
      .attr('d', renderAlertRuleD3Area({ x, y }));

    // Draw container for Handles Info
    drawContainer({ svg: ref.current, class: d3Classes.handleFrameInfo, paddingX, paddingY, disableClipPath: true });

    // Draw container for Handles
    drawContainer({ svg: ref.current, class: d3Classes.handleFrame, paddingX, paddingY });

    // Draw Handles' Info
    drawHandleInfo({
      selector: getElement('g', d3Classes.handleFrameInfo),
      data: dataForHandles,
      yAttribute: 'gte',
      unitSymbol,
      x,
      y,
      color: getColorForAlertRuleType(alertRule.alertRuleType),
      classes: [d3Classes.handleInfo, 'gte'],
    });
    drawHandleInfo({
      selector: getElement('g', d3Classes.handleFrameInfo),
      data: dataForHandles,
      yAttribute: 'lte',
      unitSymbol,
      x,
      y,
      color: getColorForAlertRuleType(alertRule.alertRuleType),
      classes: [d3Classes.handleInfo, 'lte'],
    });

    // Draw Handles
    const drawHandlesArgs = {
      ref,
      data: dataForHandles,
      fill: getColorForAlertRuleType(alertRule.alertRuleType),
      selector: getElement('g', d3Classes.handleFrame),
      cx: d => x(d.time),
    };
    drawHandles({ ...drawHandlesArgs, cy: d => y(d.gte) })
      .attr('display', d => (isNumber(d.gte) ? undefined : 'none'))
      .attr('gte-or-lte', 'gte')
      .style('cursor', 'pointer')
      .on('mouseover', onMouseOver)
      .on('mouseout', onMouseOut)
      .call(dragHandler());
    drawHandles({ ...drawHandlesArgs, cy: d => y(d.lte) })
      .attr('display', d => (isNumber(d.lte) ? undefined : 'none'))
      .attr('gte-or-lte', 'lte')
      .style('cursor', 'pointer')
      .on('mouseover', onMouseOver)
      .on('mouseout', onMouseOut)
      .call(dragHandler());

    const drawLineArgs = {
      ref,
      selector: getElement('g', d3Classes.frame),
      data,
      color: getColorForAlertRuleType(alertRule.alertRuleType),
    };
    const setDataOnLineArgs: Omit<SetDataOnLine<Rule<Date>>, 'classes' | 'yValue'> = {
      ref,
      data,
      x,
      y,
      xValue: d => d.time,
    };
    if (alertRule.interpolationType === InterpolationType.none) {
      // Draw Lines between handles
      drawLine({ ...drawLineArgs, classes: ['horizontal', 'gte'] });
      drawLine({ ...drawLineArgs, classes: ['horizontal', 'lte'] });
      drawLine({ ...drawLineArgs, classes: ['vertical', 'gte'], strokeDasharray: 6 });
      drawLine({ ...drawLineArgs, classes: ['vertical', 'lte'], strokeDasharray: 6 });

      // Set data on Lines drawn previously
      setDataOnLine({ ...setDataOnLineArgs, classes: ['horizontal', 'gte'], yValue: d => d.gte ?? minY });
      setDataOnLine({ ...setDataOnLineArgs, classes: ['horizontal', 'lte'], yValue: d => d.lte ?? maxY });
      setDataOnLine({ ...setDataOnLineArgs, classes: ['vertical', 'gte'], yValue: d => d.gte ?? minY });
      setDataOnLine({ ...setDataOnLineArgs, classes: ['vertical', 'lte'], yValue: d => d.lte ?? maxY });
    } else {
      // Draw Lines between handles
      drawLine({ ...drawLineArgs, classes: ['gte'] });
      drawLine({ ...drawLineArgs, classes: ['lte'] });

      // Set data on Lines drawn previously
      setDataOnLine({ ...setDataOnLineArgs, classes: ['gte'], yValue: d => d.gte ?? minY });
      setDataOnLine({ ...setDataOnLineArgs, classes: ['lte'], yValue: d => d.lte ?? maxY });
    }
  };
