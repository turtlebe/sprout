import { LiveActionValue } from '@plentyag/app-environment/src/common/components';
import { useConverter } from '@plentyag/app-environment/src/common/hooks';
import { PATHS } from '@plentyag/app-environment/src/paths';
import { Show, UnstyledLink } from '@plentyag/brand-ui/src/components';
import { Box, CircularProgress, Tooltip, Typography } from '@plentyag/brand-ui/src/material-ui/core';
import { Schedule } from '@plentyag/core/src/types/environment';
import { getScopedDataTestIds, getShortenedPath } from '@plentyag/core/src/utils';
import React from 'react';

const dataTestIds = getScopedDataTestIds(
  {
    path: 'path',
    loader: 'loader',
  },
  'widgetLiveGroupSchedule'
);

export { dataTestIds as dataTestIdsWidgetLiveGroupSchedule };

export interface WidgetLiveGroupSchedule {
  schedule: Schedule;
  options: { actionDefinitionKey?: string };
  remainingPath?: string;
}

export const WidgetLiveGroupSchedule: React.FC<WidgetLiveGroupSchedule> = ({
  schedule: scheduleProp,
  options = {},
  remainingPath,
}) => {
  const { schedule, scheduleDefinition, isLoading } = useConverter({ schedule: scheduleProp });

  return (
    <Box display="flex" justifyContent="space-between" data-testid={dataTestIds.root}>
      <UnstyledLink to={PATHS.schedulePage(schedule?.id)}>
        <Tooltip title={getShortenedPath(schedule?.path)}>
          <Typography variant="subtitle2" color="textSecondary" data-testid={dataTestIds.path}>
            {remainingPath}
          </Typography>
        </Tooltip>
      </UnstyledLink>
      <Show when={!isLoading} fallback={<CircularProgress size="12px" data-testid={dataTestIds.loader} />}>
        <LiveActionValue
          schedule={schedule}
          scheduleDefinition={scheduleDefinition}
          actionDefinitionKey={options.actionDefinitionKey}
          noActionDefinitionKeyWarning="Please edit the Widget configuration to choose which value to display."
        />
      </Show>
    </Box>
  );
};
