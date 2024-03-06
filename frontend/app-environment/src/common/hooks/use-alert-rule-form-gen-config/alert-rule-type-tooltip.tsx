import { getAlertRuleTypeLabel } from '@plentyag/app-environment/src/common/utils';
import { DialogFormGenTooltip } from '@plentyag/brand-ui/src/components';
import { Typography } from '@plentyag/brand-ui/src/material-ui/core';
import { AlertRuleType } from '@plentyag/core/src/types/environment';
import React from 'react';

export const AlertRuleTypeTooltip: React.FC<FormGen.TooltipProps> = props => {
  return (
    <DialogFormGenTooltip title="Alert Rule Type" {...props}>
      <Typography paragraph>
        <Typography variant="h6">{getAlertRuleTypeLabel(AlertRuleType.specLimit)}:</Typography>
        Multiple sources contribute to the data, Alerts are triggered when all sources get out of range.
      </Typography>
      <Typography paragraph>
        <Typography variant="h6">{getAlertRuleTypeLabel(AlertRuleType.specLimitDevices)}:</Typography>
        Multiple sources contribute to the data, Alerts are triggered when one single source gets out of range.
      </Typography>
      <Typography paragraph>
        <Typography variant="h6">{getAlertRuleTypeLabel(AlertRuleType.controlLimit)}:</Typography>
        No Alerts are generated.
      </Typography>
    </DialogFormGenTooltip>
  );
};
