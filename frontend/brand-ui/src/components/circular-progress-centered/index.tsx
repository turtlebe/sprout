import { Box, CircularProgress } from '@plentyag/brand-ui/src/material-ui/core';
import React from 'react';

const dataTestIds = {
  root: 'circular-progress-centered-root',
};

export { dataTestIds as dataTestIdsCircularProgressCentered };

export interface CircularProgressCentered {
  'data-testid'?: string;
  padding?: number;
  size?: string;
}

/**
 * Simple <CircularProgress /> loader vertically and horizontally centered.
 */
export const CircularProgressCentered: React.FC<CircularProgressCentered> = ({
  'data-testid': dataTestId,
  size = '2rem',
  padding,
}) => {
  return (
    <Box display="flex" alignItems="center" justifyContent="center" height="100%" padding={padding}>
      <CircularProgress size={size} data-testid={dataTestId || dataTestIds.root} />
    </Box>
  );
};
