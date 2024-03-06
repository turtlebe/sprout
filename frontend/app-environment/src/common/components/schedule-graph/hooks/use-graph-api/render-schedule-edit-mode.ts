import { adjustColor, copySchedule, getActionDefinitions } from '@plentyag/app-environment/src/common/utils';
import { COLORS, d3Classes } from '@plentyag/app-environment/src/common/utils/constants';
import {
  dragHandlerLinearInterpolationSchedule,
  dragHandlerNoInterpolationSchedule,
  drawContainer,
  drawHandleInfo,
  drawHandles,
  drawLine,
  getElement,
  onMouseOut,
  onMouseOver,
  setDataOnLine,
  SetDataOnLine,
} from '@plentyag/app-environment/src/common/utils/d3';
import { ScheduleDefinition } from '@plentyag/core/src/farm-def/types';
import { Action, InterpolationType, Schedule } from '@plentyag/core/src/types/environment';
import * as d3 from 'd3';
import moment from 'moment';

import { RenderFunction } from '.';

import { getSetpointsUntilEndDateTime } from './utils';

export interface RenderScheduleEditMode {
  schedule: Schedule;
  scheduleDefinition: ScheduleDefinition;
  onChange: (updatedSchedule: Schedule) => void;
  unitSymbol: string;
}

export const renderScheduleEditMode: RenderFunction<RenderScheduleEditMode> =
  ({ ref, scale }) =>
  ({ schedule, scheduleDefinition, onChange, unitSymbol }) => {
    const { x, y, paddingX, paddingY, startDateTime, endDateTime, minY, maxY } = scale;
    const data = getSetpointsUntilEndDateTime({ schedule, startDateTime, endDateTime, x, y, isEditing: true });
    const dataForHandles = data.filter(setpoint => !setpoint.isVirtual);
    const oneOf = getActionDefinitions(scheduleDefinition).flatMap(
      ({ actionDefinition }) => actionDefinition.oneOf || []
    );
    const yValues = oneOf.length > 0 ? oneOf.map(y) : [];

    // Draw container for Lines
    drawContainer({ svg: ref.current, class: d3Classes.frame, paddingX, paddingY });

    // Draw container for Handles
    drawContainer({ svg: ref.current, class: d3Classes.handleFrame, paddingX, paddingY });

    getActionDefinitions(scheduleDefinition, { graphable: true }).forEach(({ key }, index) => {
      function dragLinearInterpolation(d) {
        const that = this;
        dragHandlerLinearInterpolationSchedule({
          d,
          that,
          x,
          y,
          startDateTime,
          endDateTime,
          minY,
          maxY,
          data,
          ref,
          unitSymbol,
          key,
          dataForHandles,
          oneOf,
          yValues,
        });
      }
      function dragNoInterpolation(d) {
        const that = this;
        dragHandlerNoInterpolationSchedule({
          d,
          that,
          x,
          y,
          startDateTime,
          endDateTime,
          minY,
          maxY,
          data,
          ref,
          unitSymbol,
          key,
          dataForHandles,
          oneOf,
          yValues,
        });
      }
      function dragHandler() {
        return d3
          .drag()
          .on(
            'drag',
            schedule.interpolationType == InterpolationType.linear ? dragLinearInterpolation : dragNoInterpolation
          )
          .on('end', () => {
            const newActions: Action[] = dataForHandles.map(d => {
              return {
                value: d.value,
                values: d.values,
                valueType: key ? 'MULTIPLE_VALUE' : 'SINGLE_VALUE',
                time: Math.round(moment.duration(moment(d.time).diff(startDateTime)).as('seconds')),
              };
            });
            onChange(copySchedule({ schedule, newActions }));
          });
      }

      const color = adjustColor(COLORS.schedule, index);

      // Draw Handles
      drawHandles({
        ref,
        data: dataForHandles,
        fill: color,
        selector: getElement('g', d3Classes.handleFrame),
        cx: d => x(d.time),
        cy: d => y(key ? d.values[key] : d.value),
      })
        .style('cursor', 'pointer')
        .on('mouseover', onMouseOver)
        .on('mouseout', onMouseOut)
        .call(dragHandler());

      // Draw Handles' Info
      drawHandleInfo({
        selector: getElement('g', d3Classes.handleFrame),
        data: dataForHandles,
        unitSymbol,
        yAttribute: key ? `values.${key}` : 'value',
        x,
        y,
        color: color,
        classes: [d3Classes.handleInfo, key],
      });

      const drawLineArgs = {
        ref,
        selector: getElement('g', d3Classes.frame),
        data,
        color: color,
      };
      const setDataOnLineArgs: Omit<SetDataOnLine<Action<Date>>, 'classes'> = {
        ref,
        data,
        x,
        y,
        xValue: d => d.time,
        yValue: d => (key ? d.values[key] : d.value),
      };

      if (schedule.interpolationType === InterpolationType.none) {
        // Draw Lines
        drawLine({ ...drawLineArgs, classes: ['horizontal', key] });
        drawLine({ ...drawLineArgs, classes: ['vertical', key], strokeDasharray: 6 });

        // Set data on Lines drawn previously
        setDataOnLine({ ...setDataOnLineArgs, classes: ['horizontal', key] });
        setDataOnLine({ ...setDataOnLineArgs, classes: ['vertical', key] });
      } else {
        // Draw Lines between handles
        drawLine({ ...drawLineArgs, classes: ['value', key] });

        // Set data on Lines drawn previously
        setDataOnLine({ ...setDataOnLineArgs, classes: ['value', key] });
      } // End !== InterpolationType.none
    });
  };
