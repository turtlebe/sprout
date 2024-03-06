import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@plentyag/brand-ui/src/material-ui/core';
import React from 'react';

const dataTestIds = {
  cancel: 'dialog-add-container-serial-numbers-cancel',
  add: 'dialog-add-container-serial-numbers-add',
  textInput: 'dialog-add-container-serial-numbers-text-input',
};

export { dataTestIds as dataTestIdsDialogAddContainerSerialNumbers };

interface DialogAddContainerSerialNumbers {
  onCancel: () => void;
  onAdd: (serials: string[]) => void;
}

export const DialogAddContainerSerialNumbers: React.FC<DialogAddContainerSerialNumbers> = props => {
  const textInputFieldRef = React.useRef<HTMLTextAreaElement>(null);

  function handleAddSerials() {
    const inputText = textInputFieldRef?.current?.value;
    if (inputText) {
      // except: comma or whitespace separated items.
      props.onAdd(inputText.split(/[,\s]/).filter(str => str));
    }
  }

  return (
    <Dialog fullWidth={true} maxWidth="md" open>
      <DialogTitle>Add Container Serial Numbers</DialogTitle>

      <DialogContent>
        <TextField
          data-testid={dataTestIds.textInput}
          inputRef={textInputFieldRef}
          autoFocus
          fullWidth
          variant="outlined"
          multiline
          placeholder="Paste (or type) a list of container serial numbers (space, comma or newline separated)."
          minRows={10}
          maxRows={20}
        />
      </DialogContent>

      <DialogActions>
        <Button data-testid={dataTestIds.cancel} onClick={props.onCancel}>
          Cancel
        </Button>
        <Button data-testid={dataTestIds.add} onClick={handleAddSerials} variant="contained" color="primary">
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
};
