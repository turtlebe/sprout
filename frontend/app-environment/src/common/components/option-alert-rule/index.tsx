import { InfoOutlined } from '@material-ui/icons';
import { getAlertRuleTypeLabel, getAlertStateFromAlertRule } from '@plentyag/app-environment/src/common/utils';
import { Box, Tooltip, Typography } from '@plentyag/brand-ui/src/material-ui/core';
import { AlertRule } from '@plentyag/core/src/types/environment';
import { getScopedDataTestIds } from '@plentyag/core/src/utils';
import { DateTime } from 'luxon';
import React from 'react';

const dataTestIds = getScopedDataTestIds({}, 'optionAlertRule');

export { dataTestIds as dataTestIdsOptionAlertRule };

export interface OptionAlertRule {
  alertRule: AlertRule;
}

export const OptionAlertRule: React.FC<OptionAlertRule> = ({ alertRule }) => {
  return (
    <Box display="flex" justifyContent="space-between" alignItems="center" width="100%" gridGap="1rem">
      <Box>
        <Typography>{getAlertRuleTypeLabel(alertRule.alertRuleType)}</Typography>
        <Typography color="textSecondary">{alertRule.description}</Typography>
      </Box>
      <Tooltip
        title={
          <>
            <Typography>Start Time: {DateTime.fromISO(alertRule.startsAt).toISO()}</Typography>
            <Typography>End Time: {alertRule.endsAt ? DateTime.fromISO(alertRule.endsAt).toISO() : '--'}</Typography>
            <Typography>Status: {getAlertStateFromAlertRule(alertRule)}</Typography>
            <Typography>Priority: {alertRule.priority}</Typography>
            <Typography>Repeat Interval: {alertRule.repeatInterval}</Typography>
            <Typography>Interpolation Type: {alertRule.interpolationType}</Typography>
            <Typography>Last modified at: {DateTime.fromISO(alertRule.updatedAt).toISO()}</Typography>
            <Typography>Last modified by: {alertRule.updatedBy}</Typography>
            <Typography>Tags: {alertRule.tags?.join(', ') || '--'}</Typography>
            <Typography>No Data Timeout: {alertRule.noDataTimeout}</Typography>
            <Typography>Duration Window Size: {alertRule.durationWindowSize}</Typography>
            <Typography>Resolve Duration Window Size: {alertRule.durationWindowSizeResolve}</Typography>
            <Typography>Stateful: {alertRule.isStateless ? 'No' : 'Yes'}</Typography>
          </>
        }
      >
        <InfoOutlined />
      </Tooltip>
    </Box>
  );
};
