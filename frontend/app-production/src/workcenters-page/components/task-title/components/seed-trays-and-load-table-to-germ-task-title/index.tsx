import { ResourceLink } from '@plentyag/app-production/src/common/components';
import { Show } from '@plentyag/brand-ui/src/components';
import { Typography } from '@plentyag/brand-ui/src/material-ui/core';
import { getKindFromPath } from '@plentyag/core/src/farm-def/utils';
import { get } from 'lodash';
import React from 'react';

import { TaskTitleRendererProps } from '../../types';
import { getTaskParamsPayload, getTaskParamValue, getTitle, unknownValue } from '../../utils';
import { BoxedTitle } from '../boxed-title';
import { StackedAndBoxedTitles } from '../stacked-and-boxed-titles';
import { StyledBox } from '../styled-box';

const dataTestIds = {
  root: 'seed-trays-and-load-table-to-germ-task-title-root',
  seedTitle: 'seed-trays-and-load-table-to-germ-task-title-seed-title',
  tableLink: 'seed-trays-and-load-table-to-germ-task-title-table-link',
  tableFallback: 'seed-trays-and-load-table-to-germ-task-title-table-fallback',
  prescriptionTitles: 'seed-trays-and-load-table-to-germ-task-title-prescription-titles',
  germStack: 'seed-trays-and-load-table-to-germ-task-title-germ-stack',
};

export { dataTestIds as dataTestIdsSeedTraysAndLoadTableToGermTaskTitle };

function getEntry(entryNumber: number, prescription: any) {
  const entry = get(prescription, `entry${entryNumber}`);
  const numberOfTrays = getTaskParamValue('number_of_trays', entry);
  const crop = getTaskParamValue('crop', entry);
  if (numberOfTrays === unknownValue && crop === unknownValue) {
    return undefined;
  }
  return entry ? { numberOfTrays, crop } : undefined;
}

/**
 * Renders title for task "Seed Trays And Load Table To Germ"
 * See render requirement details: https://plentyag.atlassian.net/wiki/spaces/EN/pages/2097152153/Workcenter+Task+Titles#Task%3A-Seed-Trays-And-Load-Table-To-Germ
 */
export const SeedTraysAndLoadTableToGermTaskTitle: React.FC<TaskTitleRendererProps> = ({ task }) => {
  const seedTitle = getTitle(task, { pending: 'Seed', running: 'Seeding', completed: 'Seeded' });
  const tableSerial = get(task?.executionDetails, 'loadedTableSerial');
  const taskParams = getTaskParamsPayload(task);
  const germStackPath = getTaskParamValue('germ_stack_path', taskParams);
  const germStack = getKindFromPath(germStackPath, 'machines');
  const prescription = get(taskParams, 'seed_trays_and_load_to_table_prescription', {});

  const prescriptionTitles = [];
  // up to 5 entries for lax1.
  for (var entryNum = 1; entryNum <= 5; entryNum++) {
    const entry = getEntry(entryNum, prescription);
    if (entry) {
      prescriptionTitles.push(`${entry.numberOfTrays} Trays of ${entry.crop}`);
    }
  }

  return (
    <StyledBox data-testid={dataTestIds.root}>
      <Typography data-testid={dataTestIds.seedTitle}>{seedTitle}&nbsp;</Typography>
      <Show
        when={Boolean(tableSerial)}
        fallback={<Typography data-testid={dataTestIds.tableFallback}>table</Typography>}
      >
        <ResourceLink
          data-testid={dataTestIds.tableLink}
          resourceName={<Typography>Table</Typography>}
          resourceId={tableSerial}
          openInNewTab={false}
        />
      </Show>
      <Typography>&nbsp;with</Typography>
      <StackedAndBoxedTitles data-testid={dataTestIds.prescriptionTitles} titles={prescriptionTitles} />
      <Typography>and load to</Typography>
      <BoxedTitle data-testid={dataTestIds.germStack} title={germStack} />
    </StyledBox>
  );
};
