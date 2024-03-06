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
import React, { useState } from 'react';

import useLabelingStore from './state';

export interface NewLabelDialog {
  open: boolean;
  handleCreateLabel: (labelName: string) => void;
  handleCancelLabel: () => void;
}

export const NewLabelDialog: React.FC<NewLabelDialog> = ({ open, handleCreateLabel, handleCancelLabel }) => {
  const [labelType, setLabelType] = useState<string>(null);
  const [labelName, setLabelName] = useState<string>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [labelingState, labelingActions] = useLabelingStore<IL.LabelingState, IL.LabelingActions>();

  const handleChange = event => {
    setLabelName(event.target.value);
  };

  const handleAddLabel = () => {
    const name = labelType ? `${labelType}:${labelName}` : labelName;
    handleCreateLabel(name);
  };

  // parse the label set type from the active label set if label set types were provided in the labeling instructions
  const currentLabelSetType = labelingState.labelingInstructions?.labelSetTypes
    ? labelingState.activeLabelSet?.name?.split(':')[0]
    : null;

  // get the label types from the active label set's label set type
  const labelTypes = currentLabelSetType
    ? labelingState.labelingInstructions?.labelSetTypes?.find(labelSetType => labelSetType.name === currentLabelSetType)
        ?.labelTypes
    : null;

  const labelTypeSelect = (
    <React.Fragment>
      <InputLabel htmlFor="labelType">Label Type</InputLabel>
      <Select id="labelType" value={labelType || ''} fullWidth onChange={e => setLabelType(e.target.value as string)}>
        {labelTypes?.map(labelType => (
          <MenuItem key={labelType} value={labelType}>
            {labelType}
          </MenuItem>
        ))}
      </Select>
    </React.Fragment>
  );

  const labelNameInput = (
    <TextField
      autoFocus
      id="name"
      label="Label Text"
      type="text"
      InputProps={
        labelType
          ? {
              startAdornment: <InputAdornment position="start">{labelType}:</InputAdornment>,
            }
          : null
      }
      fullWidth
      onChange={handleChange}
    />
  );

  return (
    <Dialog fullWidth={true} maxWidth="sm" open={open} onClose={handleCancelLabel}>
      <DialogTitle>Add New Label</DialogTitle>
      <DialogContent>
        <FormControl fullWidth>
          {labelingState.labelingInstructions?.labelSetTypes && labelTypeSelect}
          <br />
          {(!labelingState.labelingInstructions?.labelSetTypes || labelType) && labelNameInput}
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button disabled={labelName?.length === 0} onClick={handleAddLabel} color="primary">
          Add Label
        </Button>
        <Button onClick={handleCancelLabel} color="primary">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};
