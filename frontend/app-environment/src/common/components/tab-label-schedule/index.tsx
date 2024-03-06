import { LegendColor } from '@plentyag/app-environment/src/common/components';
import { Box } from '@plentyag/brand-ui/src/material-ui/core';
import { ScheduleDefinition } from '@plentyag/core/src/farm-def/types';
import React from 'react';

import { COLORS } from '../../utils/constants';

const dataTestIds = {};

export { dataTestIds as dataTestIdsTabLabelSchedule };

export interface TabLabelSchedule {
  scheduleDefinition: ScheduleDefinition;
}

/**
 * Label for a Tab with content related to a Schedule.
 */
export const TabLabelSchedule: React.FC<TabLabelSchedule> = ({}) => {
  return (
    <Box display="flex">
      Schedule
      <Box padding={1} />
      <LegendColor backgroundColor={COLORS.schedule} />
    </Box>
  );
};
