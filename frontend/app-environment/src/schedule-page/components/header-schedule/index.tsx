import { InactiveChip } from '@plentyag/app-environment/src/common/components/inactive-chip';
import { PATHS } from '@plentyag/app-environment/src/paths';
import { AppBreadcrumbs, AppHeader, Show } from '@plentyag/brand-ui/src/components';
import { Box, Chip, CircularProgress, Typography } from '@plentyag/brand-ui/src/material-ui/core';
import { Schedule } from '@plentyag/core/src/types/environment';
import { getShortenedPath } from '@plentyag/core/src/utils';
import React from 'react';

const dataTestIds = { loader: 'header-metric-description-loader' };

export { dataTestIds as dataTestIdsHeaderSchedule };

export interface HeaderSchedule {
  schedule: Schedule;
  isLoading: boolean;
}

/**
 * Header of the Schedule Page.
 */
export const HeaderSchedule: React.FC<HeaderSchedule> = ({ isLoading, schedule, children }) => {
  return (
    <AppHeader flexDirection="column">
      <AppBreadcrumbs
        homePageRoute={PATHS.schedulesPage}
        homePageName="Schedules"
        pageName={isLoading ? '--' : schedule?.id}
        marginLeft="0.75rem"
      />
      <Box display="flex" alignItems="center" justifyContent="space-between" padding={1}>
        <Box display="flex" alignItems="center">
          {isLoading ? (
            <CircularProgress size="12px" data-testid={dataTestIds.loader} />
          ) : (
            <>
              <Chip color="primary" label={getShortenedPath(schedule?.path)} />
              <Box padding={0.5} />
              <Chip label={`Type: ${schedule?.scheduleType}`} />
              <Box padding={1} />
              <Show when={Boolean(schedule?.description)}>
                <Typography variant="h6">{schedule?.description}</Typography>
                <Box padding={1} />
              </Show>
              <InactiveChip alertRuleOrSchedule={schedule} />
            </>
          )}
        </Box>
      </Box>
      {children}
    </AppHeader>
  );
};
