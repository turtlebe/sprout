import { UploadFile } from '@plentyag/brand-ui/src/components';
import { Box, Button } from '@plentyag/brand-ui/src/material-ui/core';
import { FarmDefWorkcenter } from '@plentyag/core/src/farm-def/types';
import React, { useEffect, useState } from 'react';

import { useUploadPlan } from '../../hooks';

const dataTestIds = {
  root: 'upload-file-step-root',
  backButton: 'upload-file-back-button',
  nextButton: 'upload-file-next-button',
};

export { dataTestIds as dataTestIdsUploadFileStep };

export interface UploadFileStep {
  selectedWorkcenters: FarmDefWorkcenter[];
  onGoBack: () => void;
  onSuccessUpload: (file: File, response: any) => void;
}

export const UploadFileStep: React.FC<UploadFileStep> = ({
  selectedWorkcenters,
  onSuccessUpload = () => {},
  onGoBack = () => {},
}) => {
  const { isUploadingPlan, makeUploadRequest } = useUploadPlan({ selectedWorkcenters });
  const [file, setFile] = useState<File>(null);

  function handleUploadPlan(file: File) {
    setFile(file);
  }

  function handleRemoveUploadPlan() {
    setFile(null);
  }

  function handleUpload() {
    makeUploadRequest({
      file,
      onSuccess: response => {
        onSuccessUpload(file, response);
      },
      onError: () => {
        handleRemoveUploadPlan();
      },
    });
  }

  useEffect(() => {
    if (file) {
      handleUpload();
    }
  }, [file]);

  return (
    <Box data-testid={dataTestIds.root}>
      <UploadFile
        onSubmit={handleUploadPlan}
        isUploading={isUploadingPlan}
        uploadButtonTitle="Upload Plan"
        selectFileMessage="Select plan to upload or drop here"
        rejectFileMessage="File type must be Excel/Google sheet (.xlsx)"
        accept={{
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
        }}
        file={file}
        onSet={handleUploadPlan}
        onRemove={handleRemoveUploadPlan}
      />
      <Box display="flex" justifyContent="flex-end" mt={1}>
        <Box mr={1}>
          <Button variant="contained" color="default" onClick={onGoBack} data-testid={dataTestIds.backButton}>
            Back
          </Button>
        </Box>
        <Box>
          <Button
            disabled={!file || isUploadingPlan}
            variant="contained"
            color="primary"
            onClick={handleUpload}
            data-testid={dataTestIds.nextButton}
          >
            Next
          </Button>
        </Box>
      </Box>
    </Box>
  );
};
