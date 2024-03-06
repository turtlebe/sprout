import { DialogFormGenTooltip } from '@plentyag/brand-ui/src/components';
import { Typography } from '@plentyag/brand-ui/src/material-ui/core';
import React from 'react';

export const NotificationTypeTooltip: React.FC<FormGen.TooltipProps> = props => {
  return (
    <DialogFormGenTooltip title="Notification Type" {...props}>
      <Typography paragraph>The notification type controls what type of notification you receive:</Typography>
      <Typography variant="h6">Default</Typography>
      <Typography paragraph>
        By default, this is the notification received when an Alert Rule is not satisfied.
      </Typography>
      <Typography variant="h6">No Data</Typography>
      <Typography paragraph>This is the notification received when data has been missing.</Typography>
    </DialogFormGenTooltip>
  );
};
