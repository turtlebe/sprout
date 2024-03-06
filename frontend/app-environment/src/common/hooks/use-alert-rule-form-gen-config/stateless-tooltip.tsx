import { DialogFormGenTooltip } from '@plentyag/brand-ui/src/components';
import { Typography } from '@plentyag/brand-ui/src/material-ui/core';
import React from 'react';

export const StatelessTooltip: React.FC<FormGen.TooltipProps> = props => {
  return (
    <DialogFormGenTooltip title="Stateless / Stateful" {...props}>
      <Typography paragraph>
        Stateful alert rule has both triggered and resolved states. An alert is created when the state changes.
      </Typography>
      <Typography paragraph>
        Stateless alert rule has only triggered state. An alert is created every time the alert rule conditions are not
        respected.
      </Typography>
    </DialogFormGenTooltip>
  );
};
