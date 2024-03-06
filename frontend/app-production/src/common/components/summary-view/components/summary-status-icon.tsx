import { Cancel, Check, DirectionsRun, Help, PriorityHigh } from '@material-ui/icons';
import { Box } from '@plentyag/brand-ui/src/material-ui/core';
import React from 'react';

import { SummaryStatus } from '../../../types';

const dataTestIds = {
  iconContainer: 'summary-status-icon-container',
};

export { dataTestIds as dataTestIdSummaryStatusIcon };

export interface SummaryStatusIcon {
  summaryStatus: SummaryStatus;
}

function getIconAndColor(summaryStatus: SummaryStatus) {
  switch (summaryStatus) {
    case SummaryStatus.RUNNING:
      return { color: 'green', icon: <DirectionsRun fontSize="small" /> };
    case SummaryStatus.SUCCESS:
      return { color: 'navy', icon: <Check fontSize="small" /> };
    case SummaryStatus.CANCELED:
      return { color: 'gold', icon: <Cancel fontSize="small" /> };
    case SummaryStatus.FAILURE:
      return { color: 'red', icon: <PriorityHigh fontSize="small" /> };
    default:
      console.error(`No color has been defined for summary status: ${summaryStatus}`);
      return { color: 'grey', icon: <Help fontSize="small" /> };
  }
}

export const SummaryStatusIcon: React.FC<SummaryStatusIcon> = ({ summaryStatus }) => {
  const iconAndColor = getIconAndColor(summaryStatus);
  return (
    <Box
      data-testid={dataTestIds.iconContainer}
      style={{ verticalAlign: 'middle', color: iconAndColor.color }}
      component="span"
    >
      {iconAndColor.icon}
    </Box>
  );
};
