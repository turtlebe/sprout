import { Cancel, Check, DirectionsRun, HourglassEmpty, PriorityHigh } from '@material-ui/icons';
import { TimelineDot } from '@material-ui/lab';
import { Tooltip, Typography } from '@plentyag/brand-ui/src/material-ui/core';
import React from 'react';

import { TaskStatus } from '../../../common/types';

const dataTestIds = {
  timelineDot: 'task-icon-timeline-dot',
};

export { dataTestIds as dataTestIdsTaskIcon };

export interface TaskIcon {
  taskStatus: TaskStatus;
}

export function getTaskStatusMetaData(taskStatus: TaskStatus) {
  switch (taskStatus) {
    case TaskStatus.CREATED:
      return { color: 'orange', icon: <HourglassEmpty />, message: 'Task has been created' };
    case TaskStatus.QUEUED:
    case TaskStatus.RUNNING:
    case TaskStatus.CANCELLING:
      return { color: 'green', icon: <DirectionsRun />, message: 'Task is running' };
    case TaskStatus.COMPLETED:
      return { color: 'navy', icon: <Check />, message: 'Task is completed' };
    case TaskStatus.CANCELED:
      return { color: 'navy', icon: <Cancel />, message: 'Task has been canceled' };
    case TaskStatus.FAILED:
      return { color: 'red', icon: <PriorityHigh />, message: 'Task has failed' };
    default:
      console.error(`No color has been defined for task status: ${taskStatus}`);
      return { color: 'grey', icon: null, message: '' };
  }
}

export const TaskIcon: React.FC<TaskIcon> = ({ taskStatus }) => {
  const iconAndColor = getTaskStatusMetaData(taskStatus);
  const tooltip = <Typography>{iconAndColor.message}</Typography>;
  return (
    <Tooltip title={tooltip} arrow>
      <TimelineDot data-testid={dataTestIds.timelineDot} style={{ backgroundColor: iconAndColor.color }}>
        {iconAndColor.icon}
      </TimelineDot>
    </Tooltip>
  );
};
