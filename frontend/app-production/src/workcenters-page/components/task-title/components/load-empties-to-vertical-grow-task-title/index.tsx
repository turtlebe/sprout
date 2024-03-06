import { Typography } from '@plentyag/brand-ui/src/material-ui/core';
import { getKindFromPath } from '@plentyag/core/src/farm-def/utils';
import React from 'react';

import { TaskTitleRendererProps } from '../../types';
import { getTaskParamsPayload, getTaskParamValue, getTitle } from '../../utils';
import { BoxedTitle } from '../boxed-title';
import { StyledBox } from '../styled-box';

const dataTestIds = {
  root: 'load-empties-to-vertical-grow-task-title-root',
  loadTitle: 'load-empties-to-vertical-grow-task-title-load-title',
  towerCount: 'load-empties-to-vertical-grow-task-title-tower-count',
  growPath: 'load-empties-to-vertical-grow-task-title-grow-path',
};

export { dataTestIds as dataTestIdsLoadEmptiesToVerticalGrowTaskTitle };

/**
 * Renders title for task "Load Empties To Vertical Grow"
 * See render requirement details: https://plentyag.atlassian.net/wiki/spaces/EN/pages/2097152153/Workcenter+Task+Titles#Task%3A-Load-Empties-To-Vertical-Grow
 */
export const LoadEmptiesToVerticalGrowTaskTitle: React.FC<TaskTitleRendererProps> = ({ task }) => {
  const loadTitle = getTitle(task, { pending: 'Load', running: 'Loading', completed: 'Loaded' });

  const taskParams = getTaskParamsPayload(task);
  const towerCount = getTaskParamValue('tower_count', taskParams);
  const growLanePath = getTaskParamValue('grow_lane', taskParams);
  const growRoom = getKindFromPath(growLanePath, 'lines');
  const growLane = getKindFromPath(growLanePath, 'machines');

  return (
    <StyledBox data-testid={dataTestIds.root}>
      <Typography data-testid={dataTestIds.loadTitle}>{loadTitle}</Typography>
      <BoxedTitle data-testid={dataTestIds.towerCount} title={`${towerCount} empty towers`} />
      <Typography>to</Typography>
      <BoxedTitle data-testid={dataTestIds.growPath} title={`${growRoom}, ${growLane}`} />
    </StyledBox>
  );
};
