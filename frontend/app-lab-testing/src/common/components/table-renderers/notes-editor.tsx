import { ICellEditor, ICellEditorParams } from '@ag-grid-community/all-modules';
import { Snackbar, useSnackbar } from '@plentyag/brand-ui/src/components/snackbar';
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  makeStyles,
  Portal,
  TextareaAutosize,
} from '@plentyag/brand-ui/src/material-ui/core';
import React from 'react';

import { useSaveNotes } from '../../hooks/use-save-notes';

export const dataTestIds = {
  textarea: 'textarea',
  cancel: 'cancel',
  save: 'save',
};

const useStyles = makeStyles(() => ({
  textarea: {
    resize: 'none',
    width: '100%',
  },
}));

interface INotesCellEditorParams extends ICellEditorParams {
  value: {
    notes: string;
    labTestSampleId: string;
    username: string;
    containerRef: React.RefObject<HTMLDivElement>;
  };
}

export const NotesEditor = React.forwardRef<ICellEditor, INotesCellEditorParams>(
  (props: INotesCellEditorParams, ref) => {
    const classes = useStyles({});
    const snackbarProps = useSnackbar();
    const { saveNotes, isSaving } = useSaveNotes();
    const hasCanceledInput = React.useRef<boolean>(false);
    const textarea = React.useRef<HTMLTextAreaElement>();

    React.useImperativeHandle(ref, () => {
      return {
        getValue: () => {
          return {
            ...props.value,
            notes: textarea.current.value,
          };
        },
        isCancelAfterEnd: () => {
          return hasCanceledInput.current;
        },
        isPopup: () => true,
      };
    });

    function handleClose() {
      if (!isSaving) {
        hasCanceledInput.current = true;
        props.stopEditing();
      }
    }

    function handleSave() {
      const dataToSave = {
        plenty_username: props.value.username,
        lab_test_sample_id: props.value.labTestSampleId,
        notes: textarea.current.value,
      };
      void saveNotes({
        data: dataToSave,
        onSuccess: () => props.stopEditing(),
        onError: () =>
          snackbarProps.errorSnackbar({
            message: 'Error saving notes. Check network connection and try again, otherwise contact FarmOS support.',
          }),
      });
    }

    function handleDialogOpened() {
      const el = textarea.current;
      if (el) {
        // give textarea focus and put cursor at end of text.
        el.focus();
        el.setSelectionRange(el.value.length, el.value.length);
      }
    }

    return (
      <>
        <Portal container={props.value.containerRef.current}>
          <Snackbar {...snackbarProps} />
        </Portal>
        <Dialog
          fullWidth={true}
          maxWidth="sm"
          open={true}
          TransitionProps={{ onEnter: handleDialogOpened }}
          onClose={handleClose}
        >
          <DialogTitle>
            <Box display="flex" flexDirection="row" alignItems="center">
              Edit Notes
            </Box>
          </DialogTitle>
          <DialogContent>
            <TextareaAutosize
              data-testid={dataTestIds.textarea}
              ref={textarea}
              className={classes.textarea}
              maxLength={2000}
              aria-label="edit notes"
              placeholder="Enter notes..."
              minRows={8}
              maxRows={15}
              defaultValue={props.value.notes}
            />
          </DialogContent>
          <DialogActions>
            <Button data-testid={dataTestIds.cancel} color="primary" onClick={handleClose} disabled={isSaving}>
              Cancel
            </Button>
            <Button
              data-testid={dataTestIds.save}
              color="primary"
              onClick={handleSave}
              disabled={isSaving}
              endIcon={isSaving ? <CircularProgress size="1rem" color="primary" /> : null}
            >
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </>
    );
  }
);
