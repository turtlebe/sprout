import { Typography } from '@plentyag/brand-ui/src/material-ui/core';
import { get } from 'lodash';
import React from 'react';

import { TaskTitleRendererProps } from '../../types';
import { getTaskParamsPayload, getTitle } from '../../utils';
import { StackedAndBoxedTitles } from '../stacked-and-boxed-titles';
import { StyledBox } from '../styled-box';

const dataTestIds = {
  root: 'prepare-prop-for-production-task-title-root',
  shuffleTitle: 'prepare-prop-for-production-task-title-shuffle-title',
  tables: 'prepare-prop-for-production-task-title-tables',
};

export { dataTestIds as dataTestIdsPreparePropForProductionTaskTitle };

function getPropRackTitle(propRackNumber: number, taskParams: any) {
  const propRack = get(taskParams, `priority_order_prop_rack_${propRackNumber}`, []);
  const totalTablesToShuffleInPropRack = Array.isArray(propRack) ? propRack.length : propRack ? 1 : 0;
  return `${totalTablesToShuffleInPropRack} tables in Prop Rack ${propRackNumber}`;
}

/**
 * Renders title for task "Prepare Prop For Production"
 * See render requirement details: https://plentyag.atlassian.net/wiki/spaces/EN/pages/2097152153/Workcenter+Task+Titles#Task%3A-Prepare-Prop-For-Production
 */
export const PreparePropForProductionTaskTitle: React.FC<TaskTitleRendererProps> = ({ task }) => {
  const shuffleTitle = getTitle(task, { pending: 'Shuffle', running: 'Shuffling', completed: 'Shuffled' });

  const taskParams = getTaskParamsPayload(task);

  // lax1 has two prop racks.
  const tables = [getPropRackTitle(1, taskParams), getPropRackTitle(2, taskParams)];

  return (
    <StyledBox data-testid={dataTestIds.root}>
      <Typography data-testid={dataTestIds.shuffleTitle}>{shuffleTitle}</Typography>
      <StackedAndBoxedTitles data-testid={dataTestIds.tables} titles={tables} />
      <Typography>to prepare for unload</Typography>
    </StyledBox>
  );
};
