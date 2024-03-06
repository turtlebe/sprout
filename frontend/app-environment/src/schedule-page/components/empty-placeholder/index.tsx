import { ErrorOutline } from '@material-ui/icons';
import { Box, Button, Typography } from '@plentyag/brand-ui/src/material-ui/core';
import React from 'react';

const dataTestIds = {
  addAction: 'empty-placeholder-add-action',
};

export { dataTestIds as dataTestIdsEmptyPlaceholder };

export interface EmptyPlaceholder {
  onAddAction: () => void;
}

/**
 * Simple empty placeholder when the Schedule has no Actions.
 */
export const EmptyPlaceholder: React.FC<EmptyPlaceholder> = ({ onAddAction }) => {
  return (
    <Box display="flex" alignItems="center" justifyContent="center" flexDirection="column" height="100%">
      <Box display="flex" marginBottom={2}>
        <ErrorOutline />
        <Box padding={0.25} />
        <Typography>No Actions yet.</Typography>
      </Box>
      <Box display="flex" alignItems="center" justifyContent="center">
        <Button variant="contained" onClick={onAddAction} data-testid={dataTestIds.addAction}>
          Add Actions
        </Button>
      </Box>
    </Box>
  );
};
