import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@plentyag/brand-ui/src/material-ui/core';
import useCoreStore from '@plentyag/core/src/core-store';
import { DateTime } from 'luxon';
import React, { useEffect, useState } from 'react';

import useLabelingStore from './state';

export interface NewLabelSetDialog {
  open: boolean;
  handleCreateLabelSet: (labelSetName: string) => void;
  handleCancelLabelSet: () => void;
}

export const NewLabelSetDialog: React.FC<NewLabelSetDialog> = ({
  open,
  handleCreateLabelSet,
  handleCancelLabelSet,
}) => {
  const [coreState] = useCoreStore();
  const [labelSetType, setLabelSetType] = useState<string>(null);
  const [labelSetName, setLabelSetName] = useState<string>(
    `${coreState.currentUser.username}_${DateTime.now().toISO()}`
  );
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [labelingState, labelingActions] = useLabelingStore<IL.LabelingState, IL.LabelingActions>();

  useEffect(() => {
    setLabelSetName(`${coreState.currentUser.username}_${DateTime.now().toISO()}`);
  }, [open]);

  const handleChange = event => {
    setLabelSetName(event.target.value);
  };

  const handleAddLabelSet = () => {
    const name = labelSetType ? `${labelSetType}:${labelSetName}` : labelSetName;
    handleCreateLabelSet(name);
  };

  const labelSetTypeSelect = (
    <React.Fragment>
      <InputLabel htmlFor="labelSetType">Label Set Type</InputLabel>
      <Select
        id="labelSetType"
        value={labelSetType || ''}
        fullWidth
        onChange={e => setLabelSetType(e.target.value as string)}
      >
        {labelingState.labelingInstructions?.labelSetTypes?.map(labelSetType => (
          <MenuItem key={labelSetType.name} value={labelSetType.name}>
            {labelSetType.name}
          </MenuItem>
        ))}
      </Select>
    </React.Fragment>
  );

  const labelSetNameInput = (
    <TextField
      autoFocus
      id="name"
      label="Label Set Name"
      type="text"
      defaultValue={labelSetName}
      InputProps={
        labelSetType
          ? {
              startAdornment: <InputAdornment position="start">{labelSetType}:</InputAdornment>,
            }
          : null
      }
      fullWidth
      onChange={handleChange}
    />
  );

  return (
    <Dialog fullWidth={true} maxWidth="sm" open={open} onClose={handleCancelLabelSet}>
      <DialogTitle>Add New Label Set</DialogTitle>
      <DialogContent>
        <FormControl fullWidth>
          {labelingState.labelingInstructions?.labelSetTypes && labelSetTypeSelect}
          <br />
          {(!labelingState.labelingInstructions?.labelSetTypes || labelSetType) && labelSetNameInput}
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button disabled={labelSetName?.length === 0} onClick={handleAddLabelSet} color="primary">
          Add Label Set
        </Button>
        <Button onClick={handleCancelLabelSet} color="primary">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};
