import { Typography } from '@plentyag/brand-ui/src/material-ui/core';
import React from 'react';

import { TaskTitleRendererProps } from '../../types';

const dataTestIds = {
  title: 'default-task-title-title',
};

export { dataTestIds as dataTestIdsDefaultTaskTitle };

export const DefaultTaskTitle: React.FC<TaskTitleRendererProps> = ({ task }) => {
  const taskPath = task?.taskDetails?.taskPath;
  const taskPathParts = taskPath?.split('/');
  const taskName = taskPathParts ? taskPathParts[taskPathParts.length - 1] : '???';
  return <Typography data-testid={dataTestIds.title}>{task?.taskDetails?.title || taskName}</Typography>;
};
