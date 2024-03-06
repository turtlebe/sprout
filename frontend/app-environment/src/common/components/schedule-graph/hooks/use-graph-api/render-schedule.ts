import { adjustColor, getActionDefinitions } from '@plentyag/app-environment/src/common/utils';
import { COLORS } from '@plentyag/app-environment/src/common/utils/constants';
import {
  drawContainer,
  drawHandles,
  drawLine,
  getElement,
  SetDataOnLine,
  setDataOnLine,
} from '@plentyag/app-environment/src/common/utils/d3';
import { ScheduleDefinition } from '@plentyag/core/src/farm-def/types';
import { Action, InterpolationType, Schedule } from '@plentyag/core/src/types/environment';

import { RenderFunction } from '.';

import { getSetpointsUntilEndDateTime } from './utils';

const d3Classes = {
  frame: (schedule: Schedule) => `frame-${schedule.id}`,
  handleFrame: (schedule: Schedule) => `handle-frame-${schedule.id}`,
  handleInfo: (schedule: Schedule) => `handle-info-${schedule.id}`,
};

export interface RenderSchedule {
  schedule: Schedule;
  scheduleDefinition: ScheduleDefinition;
  color?: string;
}

export const renderSchedule: RenderFunction<RenderSchedule> =
  ({ ref, scale }) =>
  ({ schedule, scheduleDefinition, color = COLORS.schedule }) => {
    const { x, y, paddingX, paddingY, startDateTime, endDateTime } = scale;
    const data = getSetpointsUntilEndDateTime({ schedule, startDateTime, endDateTime, x, y, isEditing: false });
    const dataForHandles = data.filter(action => !action.isVirtual);

    // Draw container for Lines
    drawContainer({ svg: ref.current, class: d3Classes.frame(schedule), paddingX, paddingY });

    // Draw container for Handles
    drawContainer({ svg: ref.current, class: d3Classes.handleFrame(schedule), paddingX, paddingY });

    getActionDefinitions(scheduleDefinition, { graphable: true }).forEach(({ key }, index) => {
      const customColor = adjustColor(color, index);
      const id = `schedule-${schedule.id}`;

      // Draw Handles for Setpoints
      drawHandles({
        ref,
        data: dataForHandles,
        fill: customColor,
        selector: getElement('g', d3Classes.handleFrame(schedule)),
        cx: d => x(d.time),
        cy: d => y(key ? d.values[key] : d.value),
      });

      const drawLineArgs = {
        ref,
        selector: getElement('g', d3Classes.frame(schedule)),
        data,
        color: customColor,
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
        drawLine({ ...drawLineArgs, classes: [id, 'horizontal', key] });
        drawLine({ ...drawLineArgs, classes: [id, 'vertical', key], strokeDasharray: 6 });

        // Set data on Lines drawn previously
        setDataOnLine({ ...setDataOnLineArgs, classes: [id, 'horizontal', key] });
        setDataOnLine({ ...setDataOnLineArgs, classes: [id, 'vertical', key] });
      } else {
        // Draw Lines between handles
        drawLine({ ...drawLineArgs, classes: [id, 'value', key] });

        // Set data on Lines drawn previously
        setDataOnLine({ ...setDataOnLineArgs, classes: [id, 'value', key] });
      } // End !== InterpolationType.none
    });
  };
