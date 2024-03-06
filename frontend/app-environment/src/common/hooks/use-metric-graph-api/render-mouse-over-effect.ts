import { getSetpointsUntilEndDateTime } from '@plentyag/app-environment/src/common/components/schedule-graph/hooks/use-graph-api/utils/get-setpoints-until-end-date-time';
import { UseRelatedMetricsAndObservationsReturn } from '@plentyag/app-environment/src/common/hooks';
import {
  adjustColor,
  getActionDefinitions,
  getColorForAlertRuleType,
  getCommonParentPath,
  getRulesFromStartToEnd,
  getScheduleColorGenerator,
} from '@plentyag/app-environment/src/common/utils';
import {
  COLORS,
  DataTestIdsGraphTooltip,
  DEFAULT_TIME_SUMMARIZATION,
  MOUSE_OVER_EFFECT,
} from '@plentyag/app-environment/src/common/utils/constants';
import {
  drawContainer,
  drawMouseOverCircle,
  drawMouseOverCircles,
} from '@plentyag/app-environment/src/common/utils/d3';
import { ScheduleDefinition } from '@plentyag/core/src/farm-def/types';
import { RolledUpByTimeObservation } from '@plentyag/core/src/types';
import {
  Action,
  AlertRule,
  Rule,
  Schedule,
  TimeSummarization,
  TooltipPositioning,
} from '@plentyag/core/src/types/environment';
import * as d3 from 'd3';
import moment from 'moment';

import { RenderFunction } from '.';

import {
  mouseOverAlertRuleHandler,
  MouseOverHandler,
  mouseOverMetricHandler,
  mouseOverScheduleHandler,
} from './mouse-over-handlers';

export interface RenderMouseOverEffect {
  schedule?: Schedule;
  scheduleDefinition?: ScheduleDefinition;
  schedules?: Schedule[];
  scheduleDefinitions?: ScheduleDefinition[];
  alertRules?: AlertRule[];
  observations?: RolledUpByTimeObservation[];
  metricsWithObservations?: UseRelatedMetricsAndObservationsReturn['data'];
  unitSymbol: string;
  graphTooltipSelectors: DataTestIdsGraphTooltip;
  timeSummarization?: TimeSummarization;
  tooltipPositioning?: TooltipPositioning;
}

/**
 * This functions renders a MouseOver effect to interact with various objects: AlertRules, Observations and Schedules.
 *
 * On hover, we use the mouse X coordinate to calculate where it interecepts with the various lines displayed on a graph:
 * - AletRule's min and max values
 * - Obsevations' values
 * - Schedule's actions' values
 *
 * A tooltip follows the mouse displaying the content in a human readable way and helping the user digest the graph's value.
 */
export const renderMouseOverEffect: RenderFunction<RenderMouseOverEffect> =
  ({ ref, scale }) =>
  ({
    schedule,
    scheduleDefinition,
    schedules,
    scheduleDefinitions,
    alertRules = [],
    metricsWithObservations = [],
    observations,
    unitSymbol,
    graphTooltipSelectors,
    timeSummarization = DEFAULT_TIME_SUMMARIZATION,
    tooltipPositioning = TooltipPositioning.default,
  }) => {
    const { width, height, paddingX, paddingY, startDateTime, endDateTime, x, y } = scale;
    const { circles } = MOUSE_OVER_EFFECT;
    const svg = ref.current;

    // Data
    const dataAlertRules = alertRules.map(alertRule =>
      getRulesFromStartToEnd({ alertRule, startDateTime, endDateTime, x, y })
    );
    const dataSchedule = schedule ? getSetpointsUntilEndDateTime({ schedule, startDateTime, endDateTime, x, y }) : [];
    const dataSchedules = schedules
      ? schedules.map(schedule => getSetpointsUntilEndDateTime({ schedule, startDateTime, endDateTime, x, y }))
      : [];

    // Bisect Functions
    const bisectAlertRule = d3.bisector<Rule<Date>, Date>(d => d.time);
    const bisectObservation = d3.bisector<RolledUpByTimeObservation, Date>(d => moment(d.rolledUpAt).toDate());
    const bisectSchedule = d3.bisector<Action<Date>, Date>(d => d.time);

    // Color Generators
    const scheduleColorGenerator = getScheduleColorGenerator();

    // Main Container
    const mouseG = drawContainer({ svg, class: MOUSE_OVER_EFFECT.container, paddingX, paddingY });

    // The tooltip that will follow the mouse when overing on the graph displaying the time and all the values
    // of the objects rendered on the graph.
    const tooltip = d3
      .select<HTMLDivElement, unknown>(`#${graphTooltipSelectors.root}`)
      .style('position', 'absolute')
      .style('visibility', 'hidden');

    // A vertical line that follows the mouse when overing on the graph. It connects the circles vertically.
    const mouseLine = mouseG.append('line').attr('stroke', '#dedede').attr('stroke-width', '0.5px');

    /**
     * Creating circles that follow the observations, schedule, alert rules lines.
     */

    // Circle for the Observations line (context single Metrics)
    if (observations?.length) {
      drawMouseOverCircle({ svg, class: circles.observations, color: COLORS.data });
    }

    // Circles for each Observations lines (context multiple Metrics)
    drawMouseOverCircles({
      svg,
      data: metricsWithObservations,
      class: ({ metric }) => circles.metrics(metric),
      color: ({ colors }) => colors[0],
    });

    // Circle for the Schedule line (context single Schedule)
    if (schedule && scheduleDefinition) {
      getActionDefinitions(scheduleDefinition, { graphable: true }).forEach(({ key }, index) => {
        drawMouseOverCircle({
          svg,
          class: circles.schedule(schedule, key),
          color: adjustColor(COLORS.schedule, index),
        });
      });
    }

    // Circles for each Schedule line (context multiple Schedule)
    if (schedules && scheduleDefinitions) {
      schedules.forEach((schedule, index) => {
        const color = scheduleColorGenerator.next().value;
        getActionDefinitions(scheduleDefinitions[index], { graphable: true }).forEach(({ key }, definitionIndex) => {
          drawMouseOverCircle({
            svg,
            class: circles.schedule(schedule, key),
            color: adjustColor(color, definitionIndex),
          });
        });
      });
    }

    // Circles for each Alert Rules Min line
    drawMouseOverCircles({
      svg,
      data: alertRules,
      class: alertRule => circles.alertRuleMin(alertRule),
      color: alertRule => getColorForAlertRuleType(alertRule.alertRuleType),
    });
    // Circles for each Alert Rules Max line
    drawMouseOverCircles({
      svg,
      data: alertRules,
      class: alertRule => circles.alertRuleMax(alertRule),
      color: alertRule => getColorForAlertRuleType(alertRule.alertRuleType),
    });

    // append a rect to catch mouse movements on canvas
    // can't catch mouse events on a g element
    mouseG
      .append('svg:rect')
      .attr('width', width)
      .attr('height', height)
      .attr('fill', 'none')
      .attr('pointer-events', 'all')
      .on('mouseout', function () {
        mouseG.selectAll('circle').style('opacity', MOUSE_OVER_EFFECT.mouseOutOpacity);
        tooltip.style('visibility', 'hidden');
        mouseLine.style('visibility', 'hidden');
      })
      .on('mouseover', function () {
        mouseG.selectAll('circle').style('opacity', MOUSE_OVER_EFFECT.mouseOverOpacity);
        tooltip.style('visibility', 'visible').style('z-index', 999999999);
        mouseLine.style('visibility', 'visible');
      })
      .on('mousemove', function (event) {
        // Get Mouse's X coordinate
        const [mouseX] = d3.pointer(event);
        // Get its value on the scale.
        const x0 = x.invert(mouseX);

        // --- Tooltip ---

        // Update Tooltip's position
        const { width: tooltipWidth } = tooltip.node().getBoundingClientRect();
        const fitsAtTheEnd = mouseX + tooltipWidth < x(endDateTime);
        const offset = fitsAtTheEnd ? 0 : (tooltipWidth + 34) * -1;
        if (tooltipPositioning === TooltipPositioning.grid) {
          tooltip.style('top', `${event.offsetY + 96}px`).style('left', `${event.offsetX + offset + 32}px`);
        } else {
          tooltip.style('top', `${event.pageY + 16}px`).style('left', `${event.pageX + offset + 32}px`);
        }

        // Update Tooltip's content regarding the Time information
        tooltip.select(`#${graphTooltipSelectors.time}`).text(moment(x0).format('lll'));

        // --- Line connecting Circles ---

        mouseLine
          .attr('x1', mouseX)
          .attr('y1', 0)
          .attr('x2', mouseX)
          .attr('y2', height - paddingY * 2);

        const mouseOverArgs: Omit<MouseOverHandler<unknown>, 'bisect' | 'data'> = {
          svg,
          mouseX,
          x,
          y,
          tooltip,
          unitSymbol,
          graphTooltipSelectors,
        };

        // --- Alert Rules ---

        alertRules.forEach((alertRule, index) => {
          mouseOverAlertRuleHandler({
            ...mouseOverArgs,
            alertRule,
            bisect: bisectAlertRule,
            data: dataAlertRules[index],
          });
        });

        // --- Single Metric (e.g one observations stream) ---

        if (observations) {
          mouseOverMetricHandler({
            ...mouseOverArgs,
            bisect: bisectObservation,
            data: observations,
            circleSelector: circles.observations,
            timeSummarization,
            tooltipSelector: graphTooltipSelectors.observation,
          });
        }

        // --- Multiple Metrics (e.g multiple observations stream) ---

        const { remainingPaths: metricsRemainingPaths } = getCommonParentPath(
          metricsWithObservations?.map(({ metric }) => metric)
        );

        metricsWithObservations.forEach(({ metric, observations }, index) => {
          mouseOverMetricHandler({
            ...mouseOverArgs,
            bisect: bisectObservation,
            data: observations,
            circleSelector: circles.metrics(metric),
            metric,
            timeSummarization,
            tooltipSelector: graphTooltipSelectors.metricWithObservations(metric),
            remainingPath: metricsRemainingPaths[index],
          });
        });

        // --- Single Schedule ---

        if (schedule && scheduleDefinition) {
          getActionDefinitions(scheduleDefinition).forEach(({ key, actionDefinition }) => {
            mouseOverScheduleHandler({
              ...mouseOverArgs,
              bisect: bisectSchedule,
              data: dataSchedule,
              actionDefinition,
              key,
              schedule,
            });
          });
        }

        // --- Multiple Schedules ---

        const { remainingPaths: schedulesRemainingPaths } = getCommonParentPath(schedules);

        if (schedules && scheduleDefinitions) {
          schedules.forEach((schedule, index) => {
            getActionDefinitions(scheduleDefinitions[index]).forEach(({ key, actionDefinition }) => {
              mouseOverScheduleHandler({
                ...mouseOverArgs,
                bisect: bisectSchedule,
                data: dataSchedules[index],
                key,
                actionDefinition,
                schedule,
                remainingPath: schedulesRemainingPaths[index],
              });
            });
          });
        }
      });
  };
