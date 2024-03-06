import { DialogFormGenTooltip } from '@plentyag/brand-ui/src/components';
import { Typography } from '@plentyag/brand-ui/src/material-ui/core';
import React from 'react';

export const RenotifyTooltip: React.FC<FormGen.TooltipProps> = props => {
  return (
    <DialogFormGenTooltip title="Renotify Every" {...props}>
      <Typography paragraph>
        For critical metrics, you might want to make sure that you will not miss or forget about the incident when it is
        triggered. Enabling renotification will send notifications periodically as long as the alert rule has not
        recovered.
      </Typography>
    </DialogFormGenTooltip>
  );
};
