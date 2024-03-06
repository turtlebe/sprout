import { CircularProgress, Typography } from '@plentyag/brand-ui/src/material-ui/core';
import { DateTimeFormat } from '@plentyag/core/src/utils';
import { DateTime } from 'luxon';
import React from 'react';

import { Label } from './index';

export const NO_INFO_AVAILABLE = 'No Info availble';

interface LabelTooltip {
  label: Label;
  isLoading: boolean;
  labelOperations: Map<string, ProdActions.OperationDeltaModel>;
}

export const LabelTooltip: React.FC<LabelTooltip> = ({ label, isLoading, labelOperations }) => {
  if (isLoading) {
    return (
      <Typography variant="caption">
        Loading...
        <CircularProgress size="1rem" color="secondary" />
      </Typography>
    );
  }

  if (labelOperations.has(label.name)) {
    const op = labelOperations.get(label.name);
    const dateCreated = DateTime.fromISO(op.endDt).toFormat(DateTimeFormat.US_DEFAULT_WITH_SECONDS);
    return <Typography variant="caption">Label Created: {dateCreated}</Typography>;
  }

  return <Typography variant="caption">{NO_INFO_AVAILABLE}</Typography>;
};
