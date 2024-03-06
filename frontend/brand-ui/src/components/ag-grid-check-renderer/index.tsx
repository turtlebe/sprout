import { Check } from '@material-ui/icons';
import { Box } from '@plentyag/brand-ui/src/material-ui/core';
import React from 'react';

import { AgGridEmptyRenderer } from '../ag-grid-empty-renderer';

interface AgGridCheckRenderer {
  isChecked: boolean;
}

export const AgGridCheckRenderer: React.FC<AgGridCheckRenderer> = ({ isChecked }) => {
  return isChecked ? (
    <Box display="flex" alignItems="center">
      <Check />
    </Box>
  ) : (
    <AgGridEmptyRenderer />
  );
};
