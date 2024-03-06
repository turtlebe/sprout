import { Close, Publish } from '@material-ui/icons';
import { Box, Button, Chip, CircularProgress, IconButton, Typography } from '@plentyag/brand-ui/src/material-ui/core';
import React from 'react';
import { Accept, useDropzone } from 'react-dropzone';

import { Show } from '../show';

import { useStyles } from './styles';

const dataTestIds = {
  close: 'upload-file-close-cta',
  submit: 'upload-file-submit-cta',
  upload: 'upload-file-upload-cta',
  dragAndDrop: 'upload-file-drag-and-drop',
  fileName: 'upload-file-file-name',
  rejectFileMessage: 'upload-file-reject-file-message',
  selectFileMessage: 'upload-file-select-file-message',
};

export { dataTestIds as dataTestIdsUploadFile };

export interface UploadFile {
  onSubmit?: (file: File) => void;
  onClose?: () => void;
  uploadButtonTitle?: string;
  isUploading?: boolean;
  accept?: Accept;
  selectFileMessage?: string;
  rejectFileMessage?: string;
}

// if you want to "control" this component you can as long as you use the these required fields
// otherwise it is default that we'll use internal state to hold the file
export interface ControlledProps {
  onSet: (file?: File) => void;
  onRemove: (file?: File) => void;
  file: File;
}

export interface UncontrolledProps {
  onSet?: never;
  onRemove?: never;
  file?: never;
}

export const UploadFile: React.FC<UploadFile & (ControlledProps | UncontrolledProps)> = ({
  onSubmit = () => {},
  onRemove,
  onSet,
  onClose,
  uploadButtonTitle,
  isUploading,
  accept,
  selectFileMessage,
  rejectFileMessage,
  file: injectedFile,
}) => {
  // if "injectedFile" is not defined, default to internal state like an uncontrolled component
  const [internalStateFile, setInternalStateFile] = React.useState<File>(null);

  const file = injectedFile || internalStateFile;

  const handleDrop = ([acceptedFile]) => {
    onSet ? onSet(acceptedFile) : setInternalStateFile(acceptedFile);
  };
  const handleDelete = () => {
    onRemove ? onRemove(file) : setInternalStateFile(null);
  };
  const handleConfirm = () => onSubmit(file);

  const { getRootProps, getInputProps, open, isDragActive, isDragReject } = useDropzone({
    accept,
    noClick: true,
    multiple: false,
    onDrop: handleDrop,
  });
  const classes = useStyles({ isDragActive, isDragReject, hasFile: Boolean(file) });

  return (
    <>
      {file ? (
        <div className={classes.root}>
          <Chip key={file.name} label={file.name} onDelete={handleDelete} data-testid={dataTestIds.fileName} />
          <Box padding={0.5} />
          <Button
            variant="contained"
            color="primary"
            startIcon={isUploading ? <CircularProgress size={12} /> : <Publish />}
            onClick={handleConfirm}
            disabled={isUploading}
            data-testid={dataTestIds.submit}
          >
            {uploadButtonTitle || 'Upload'}
          </Button>
        </div>
      ) : (
        <div {...getRootProps()} className={classes.root} data-testid={dataTestIds.dragAndDrop}>
          <input {...getInputProps()} />
          <Show
            when={!isDragReject}
            fallback={
              <Typography data-testid={dataTestIds.rejectFileMessage}>
                {rejectFileMessage || 'File type is not accepted'}
              </Typography>
            }
          >
            <Typography data-testid={dataTestIds.selectFileMessage}>
              {selectFileMessage || 'Drop file here or'}
            </Typography>
          </Show>
          <Box padding={0.5} />
          <Button variant="outlined" onClick={open} data-testid={dataTestIds.upload}>
            Browse
          </Button>
          <Show when={Boolean(onClose)}>
            <IconButton
              data-testid={dataTestIds.close}
              className={classes.close}
              icon={Close}
              aria-label="close"
              color="default"
              size="small"
              onClick={onClose}
            />
          </Show>
        </div>
      )}
    </>
  );
};
