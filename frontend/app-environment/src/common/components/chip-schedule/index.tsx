import { Show } from '@plentyag/brand-ui/src/components';
import { Box, Chip } from '@plentyag/brand-ui/src/material-ui/core';
import { Schedule } from '@plentyag/core/src/types/environment';
import { getScopedDataTestIds, getShortenedPath } from '@plentyag/core/src/utils';
import React from 'react';

const dataTestIds = getScopedDataTestIds(
  {
    type: 'type',
    path: 'path',
    actionDefinitionKey: 'actionDefinitionKey',
  },
  'chip-schedule'
);

export { dataTestIds as dataTestIdsChipSchedule };

export interface ChipSchedule {
  schedule: Schedule;
  actionDefinitionKey?: string;
}

export const ChipSchedule: React.FC<ChipSchedule> = ({ schedule, actionDefinitionKey }) => {
  return (
    <Box display="flex" alignItems="center" gridGap="0.5rem">
      <Chip label="Schedule" color="primary" data-testid={dataTestIds.type} />

      <Chip label={getShortenedPath(schedule.path)} data-testid={dataTestIds.path} />
      <Show when={Boolean(actionDefinitionKey)}>
        <Chip label={actionDefinitionKey} data-testid={dataTestIds.actionDefinitionKey} />
      </Show>
    </Box>
  );
};
