import { DialogFormGenTooltip } from '@plentyag/brand-ui/src/components';
import { Typography } from '@plentyag/brand-ui/src/material-ui/core';
import React from 'react';

export const DurationWindowTooltip: React.FC<FormGen.TooltipProps> = props => {
  return (
    <DialogFormGenTooltip title="Duration Window" {...props}>
      <Typography paragraph>
        The "Duration Window" is the duration for which the metric's data does not satisfy the alert rule in order to
        trigger the alert or satisfies the alert rule to resolve the alert. Set to "0" to disable the duration window in
        which case a single data point is enough to trigger or resolve the alert.
      </Typography>
      <Typography paragraph>
        The "Resolve Duration Window" is the duration for which the metric's data has to satisfy the alert rule to
        resolve the alert. The "Resolve Duration Window" overrides the "Duration Window" when resolving the alert. Use
        this if the duration window size to trigger and resolve is different. Set this to "0" to disable in which case a
        single data point is enough to resolve. Does not have any effect "stateless" alert rules which can be triggered
        only.
      </Typography>
      <Typography paragraph>
        Example 1: "Duration Window" is 15 minutes and "Resolve Duration Window" is not set - The alert is triggered
        when the data satisfies the alert rule for 15 minutes and resolved when the data does not satisfy the alert rule
        for 15 minutes.
      </Typography>
      <Typography paragraph>
        Example 2: "Duration Window" is set to 30 minutes and "Resolve Duration Window" is set to 1 minute - The alert
        is triggered if the data does not satisfies the alert rule for 30 minutes and resolved when the data satisfies
        the rules for 1 minute.
      </Typography>
      <Typography paragraph>
        Example 3: "Duration Window" is set to 0 and "Resolve Duration Window" is set to 15 minutes - The alert will be
        triggered whenever a single data point is detected that does not satisfy the alert rule and resolved when all
        the data points satisfy the alert rule for 15 minutes.
      </Typography>
      <Typography paragraph>Leave this value empty to use the default system settings.</Typography>
    </DialogFormGenTooltip>
  );
};
