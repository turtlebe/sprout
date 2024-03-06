import { Check, Clear } from '@material-ui/icons';
import { Box, Button } from '@plentyag/brand-ui/src/material-ui/core';
import React from 'react';

const dataTestIds = {
  save: 'buttons-save-cancel--save',
  cancel: 'buttons-save-cancel--cancel',
};

export { dataTestIds as dataTestIdsButtonsSaveCancel };

export interface ButtonsSaveCancel {
  onSave: () => void;
  onCancel: () => void;
}

export const ButtonsSaveCancel: React.FC<ButtonsSaveCancel> = ({ onSave, onCancel }) => {
  return (
    <Box display="flex" justifyContent="flex-end">
      <Button
        variant="contained"
        color="secondary"
        startIcon={<Clear />}
        onClick={onCancel}
        data-testid={dataTestIds.cancel}
      >
        Cancel
      </Button>
      <Box padding={1} />
      <Button variant="contained" startIcon={<Check />} onClick={onSave} data-testid={dataTestIds.save}>
        Save
      </Button>
    </Box>
  );
};
