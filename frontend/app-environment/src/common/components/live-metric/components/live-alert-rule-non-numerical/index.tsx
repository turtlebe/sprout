import { useGetLiveStatusColor } from '@plentyag/app-environment/src/common/hooks';
import {
  getNonNumericalRuleOperator,
  getNonNumericalRuleValue,
  getRuleAt,
} from '@plentyag/app-environment/src/common/utils';
import { Box } from '@plentyag/brand-ui/src/material-ui/core';
import { AlertRule, LiveStatus } from '@plentyag/core/src/types/environment';
import React from 'react';

const dataTestIds = {
  root: 'live-alert-rule-non-numerical-root',
};

export { dataTestIds as dataTestIdsLiveAlertRuleNonNumerical };

export interface LiveAlertRuleNonNumerical {
  alertRule: AlertRule;
  endDateTime: Date;
  status: LiveStatus;
}

export const LiveAlertRuleNonNumerical: React.FC<LiveAlertRuleNonNumerical> = ({ alertRule, endDateTime, status }) => {
  const rule = getRuleAt(alertRule, endDateTime);
  const color = useGetLiveStatusColor(status);

  return (
    <Box data-testid={dataTestIds.root} style={{ color }}>
      {getNonNumericalRuleOperator(rule)} {getNonNumericalRuleValue(rule)}
    </Box>
  );
};
