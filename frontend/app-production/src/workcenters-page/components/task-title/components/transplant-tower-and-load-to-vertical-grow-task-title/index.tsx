import { Typography } from '@plentyag/brand-ui/src/material-ui/core';
import { getKindFromPath } from '@plentyag/core/src/farm-def/utils';
import React from 'react';

import { TaskTitleRendererProps } from '../../types';
import { getTaskParamsPayload, getTaskParamValue, getTitle } from '../../utils';
import { BoxedTitle } from '../boxed-title';
import { StyledBox } from '../styled-box';

const dataTestIds = {
  root: 'transplant-towers-and-load-to-vertical-grow-task-title-root',
  transplantTitle: 'transplant-towers-and-load-to-vertical-grow-task-title-transplant-title',
  towerCountWithCrop: 'transplant-towers-and-load-to-vertical-grow-task-title-tower-count-with-crop',
  growPath: 'transplant-towers-and-load-to-vertical-grow-task-title-grow-path',
};

export { dataTestIds as dataTestIdsTransplantTowersAndLoadToVerticalGrowTaskTitle };

/**
 * Renders title for task "Transplant Towers And Load To Vertical Grow"
 * See render requirement details: https://plentyag.atlassian.net/wiki/spaces/EN/pages/2097152153/Workcenter+Task+Titles#Task%3A-Transplant-Towers-And-Load-To-Vertical-Grow
 */
export const TransplantTowersAndLoadToVerticalGrowTaskTitle: React.FC<TaskTitleRendererProps> = ({ task }) => {
  const transplantTitle = getTitle(task, {
    pending: 'Transplant',
    running: 'Transplanting',
    completed: 'Transplanted',
  });
  const taskParams = getTaskParamsPayload(task);
  const towerCount = getTaskParamValue('tower_count', taskParams);
  const crop = getTaskParamValue('crop', taskParams);
  const growLanePath = getTaskParamValue('grow_lane', taskParams);
  const growRoom = getKindFromPath(growLanePath, 'lines');
  const growLane = getKindFromPath(growLanePath, 'machines');

  return (
    <StyledBox data-testid={dataTestIds.root}>
      <Typography data-testid={dataTestIds.transplantTitle}>{transplantTitle}</Typography>
      <BoxedTitle data-testid={dataTestIds.towerCountWithCrop} title={`${towerCount} ${crop} towers`} />
      <Typography>to</Typography>
      <BoxedTitle data-testid={dataTestIds.growPath} title={`${growRoom}, ${growLane}`} />
    </StyledBox>
  );
};
