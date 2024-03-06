import { Launch } from '@material-ui/icons';
import { ChipSchedule, LegendColor } from '@plentyag/app-environment/src/common/components';
import { PATHS } from '@plentyag/app-environment/src/paths';
import { Box, IconButton, Paper } from '@plentyag/brand-ui/src/material-ui/core';
import { Schedule } from '@plentyag/core/src/types/environment';
import React from 'react';
import { Link } from 'react-router-dom';

const dataTestIds = {
  root: 'link-schedule-root',
};

export { dataTestIds as dataTestIdsLinkSchedule };

export interface LinkSchedule {
  schedule: Schedule;
  color: string;
  'data-testid'?: string;
}

export const LinkSchedule: React.FC<LinkSchedule> = ({ schedule, color, 'data-testid': dataTestId }) => {
  return (
    <Box padding={1} data-testid={dataTestId || dataTestIds.root}>
      <Paper variant="outlined">
        <Box display="flex" alignItems="center" gridGap="0.5rem">
          <Link to={PATHS.schedulePage(schedule.id)}>
            <IconButton icon={Launch} />
          </Link>
          <LegendColor backgroundColor={color} />
          <ChipSchedule schedule={schedule} />
        </Box>
      </Paper>
    </Box>
  );
};
