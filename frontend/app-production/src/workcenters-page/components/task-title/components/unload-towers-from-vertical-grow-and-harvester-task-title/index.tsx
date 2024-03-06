import { isTaskPending, isTaskRunning } from '@plentyag/app-production/src/workcenters-page/utils';
import { Typography } from '@plentyag/brand-ui/src/material-ui/core';
import { getKindFromPath } from '@plentyag/core/src/farm-def/utils';
import React from 'react';

import { TaskTitleRendererProps } from '../../types';
import { getTaskParamsPayload, getTaskParamValue } from '../../utils';
import { BoxedTitle } from '../boxed-title';
import { StyledBox } from '../styled-box';

const dataTestIds = {
  root: 'unload-towers-from-vertical-grow-and-harvest-task-title-root',
  loadTitle: 'unload-towers-from-vertical-grow-and-harvest-task-title-load-title',
  towerCountAndCrop: 'unload-towers-from-vertical-grow-and-harvest-task-title-tower-count-and-crop',
  growPath: 'unload-towers-from-vertical-grow-and-harvest-task-title-grow-path',
};

export { dataTestIds as dataTestIdsUnloadTowersFromVerticalGrowAndHarvestTaskTitle };

/**
 * Renders title for task "Unload Towers From Vertical Grow And Harvest"
 * See render requirement details: https://plentyag.atlassian.net/wiki/spaces/EN/pages/2097152153/Workcenter+Task+Titles#Task%3A-Unload-Towers-From-Vertical-Grow-And-Harvest
 */
export const UnloadTowersFromVerticalGrowAndHarvestTaskTitle: React.FC<TaskTitleRendererProps> = ({ task }) => {
  const leadTitle = isTaskPending(task)
    ? 'Unload and harvest'
    : isTaskRunning(task)
    ? 'Unloading and harvesting'
    : 'Unloaded and harvested';

  const taskParams = getTaskParamsPayload(task);
  const towerCount = getTaskParamValue('tower_count', taskParams);
  const crop = getTaskParamValue('crop', taskParams);

  // ToDo: fetch farm def object from path and use display names.
  const growLanePath = getTaskParamValue('grow_lane', taskParams);
  const growRoom = getKindFromPath(growLanePath, 'lines');
  const growLane = getKindFromPath(growLanePath, 'machines');

  return (
    <StyledBox data-testid={dataTestIds.root}>
      <Typography data-testid={dataTestIds.loadTitle}>{leadTitle}</Typography>
      <BoxedTitle data-testid={dataTestIds.towerCountAndCrop} title={`${towerCount} ${crop} towers (or empty)`} />
      <Typography>from</Typography>
      <BoxedTitle data-testid={dataTestIds.growPath} title={`${growRoom}, ${growLane}`} />
    </StyledBox>
  );
};
