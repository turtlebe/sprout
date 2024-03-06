import { Box } from '@plentyag/brand-ui/src/material-ui/core';
import React from 'react';

import { Placeholder } from '../placeholder-renderer';

import { StatusIcon } from './status-icon';

interface Props {
  value: {
    result: string | null; // data about result e.g., "5", "N/A" --> test skipped, null --> pending
    status: boolean; // true if passed, false if failed, null --> pending
  };
}

export const StatusRenderer: React.FC<Props> = ({ value }) => {
  if (!value) {
    return <Placeholder />;
  }
  // show dash for pending (null) result.
  const dataText = typeof value.result === 'string' ? value.result : '-';

  return (
    <Box component="span" display="flex" flexDirection="row" alignItems="center">
      <StatusIcon status={value.status} />
      {dataText}
    </Box>
  );
};
