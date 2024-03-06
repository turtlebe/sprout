import { DialogFormGenTooltip } from '@plentyag/brand-ui/src/components';
import { Typography } from '@plentyag/brand-ui/src/material-ui/core';
import React from 'react';

export const NoDataTimeoutTooltip: React.FC<FormGen.TooltipProps> = props => {
  return (
    <DialogFormGenTooltip title="No Data Timeout" {...props}>
      <Typography paragraph>
        When no data has been received during the "No Data Timeout" duration, a Missing Data Alert will be generated.
      </Typography>
      <Typography paragraph>Leave this value empty to use the default settings.</Typography>
    </DialogFormGenTooltip>
  );
};
