import { CircularProgressCentered, Snackbar, useSnackbar } from '@plentyag/brand-ui/src/components';
import { Backdrop, Box, Paper, Step, StepContent, StepLabel, Stepper } from '@plentyag/brand-ui/src/material-ui/core';
import { FarmDefWorkcenter } from '@plentyag/core/src/farm-def/types';
import React from 'react';

import { ConfirmStep, SelectWorkcentersStep, UploadFileStep } from '../';
import { useImportPlans } from '../../hooks';
import { CreatedTask, UploadBulkCreateTasks } from '../../types';
import { FinishedStep } from '../finished-step';

import { useStyles } from './styles';

const dataTestIds = {
  root: 'import-plan-module-root',
  loading: 'import-plan-module-loading',
  processing: 'import-plan-module-processing',
  selectWorkcentersStepSelection: 'import-plan-module-select-workceters-selection',
  uploadStepFile: 'import-plan-module-upload-file',
  importSubmittedStep: 'import-plan-module-import-submitted-step',
  importSubmittedStepReset: 'import-plan-module-import-submitted-step-reset',
};

export { dataTestIds as dataTestIdsImportPlansModule };

export interface ImportPlansModule {
  reactorsAndTasksDetailBasePath?: string;
  workcentersBasePath?: string;
  onSuccess?: () => void;
  onError?: (err: Error) => void;
}

export const ImportPlansModule: React.FC<ImportPlansModule> = ({
  reactorsAndTasksDetailBasePath,
  workcentersBasePath,
  onSuccess = () => {},
  onError = () => {},
}) => {
  const classes = useStyles({});

  // States
  const [activeStep, setActiveStep] = React.useState(0);
  const [selectedWorkcenters, setSelectedWorkcenters] = React.useState<FarmDefWorkcenter[]>([]);
  const [selectedFile, setSelectedFile] = React.useState<File>(null);
  const [uploadBulkCreateTasks, setUploadBulkCreateTasks] = React.useState<UploadBulkCreateTasks>(null);
  const [createdTasks, setCreatedTasks] = React.useState<CreatedTask[]>(null);
  const [isSubmitted, setIsSubmitted] = React.useState<boolean>(false);

  // Submit
  const snackbarProps = useSnackbar();
  const { importPlans, isProcessing } = useImportPlans(uploadBulkCreateTasks);

  // Navigation
  function handleNext() {
    setActiveStep(prevStep => prevStep + 1);
  }

  function handleBack() {
    setActiveStep(prevStep => prevStep - 1);
  }

  function handleReset() {
    setSelectedWorkcenters([]);
    setSelectedFile(null);
    setUploadBulkCreateTasks(null);
    setIsSubmitted(false);
    setActiveStep(0);
  }

  // Submissions
  function handleSelectWorkcentersSubmit(workcenters) {
    setSelectedWorkcenters(workcenters);
    handleNext();
  }

  function handleSelectUploadFileSubmit(file, collectedUploadBulkCreateTasks) {
    setSelectedFile(file);
    setUploadBulkCreateTasks(collectedUploadBulkCreateTasks);
    handleNext();
  }

  function handleConfirmCreation() {
    setIsSubmitted(true);

    importPlans({
      onSuccess(workcenterPlans) {
        snackbarProps.successSnackbar('Plans have been submitted for import');
        setCreatedTasks(workcenterPlans);
        onSuccess();
        handleNext();
      },
      onError(err) {
        snackbarProps.errorSnackbar({
          message:
            'Error submitting import plans. Check network connection and try again, otherwise contact FarmOS support.',
        });
        handleNext();
        onError(err);
      },
    });
  }

  return (
    <Box m={2} data-testid={dataTestIds.root}>
      <Snackbar {...snackbarProps} />
      <Paper className={classes.paper}>
        <Stepper activeStep={activeStep} orientation="vertical">
          <Step>
            <StepLabel>
              Select workcenters
              {activeStep !== 0 && selectedWorkcenters.length > 0 && (
                <>
                  <span>: </span>
                  <b data-testid={dataTestIds.selectWorkcentersStepSelection}>
                    {selectedWorkcenters.map(workcenter => workcenter.displayName).join(', ')}
                  </b>
                </>
              )}
            </StepLabel>
            <StepContent>
              <Box className={classes.subContent} justifyContent="flex-end">
                <SelectWorkcentersStep
                  defaultSelectedWorkcenters={selectedWorkcenters}
                  onSelectedWorkcentersSubmit={handleSelectWorkcentersSubmit}
                  submitLabel="Next"
                />
              </Box>
            </StepContent>
          </Step>
          <Step>
            <StepLabel>
              Upload file
              {activeStep !== 1 && selectedFile && (
                <>
                  <span>: </span>
                  <b data-testid={dataTestIds.uploadStepFile}>{selectedFile.name}</b>
                </>
              )}
            </StepLabel>
            <StepContent>
              <Box className={classes.subContent}>
                <UploadFileStep
                  selectedWorkcenters={selectedWorkcenters}
                  onGoBack={handleBack}
                  onSuccessUpload={handleSelectUploadFileSubmit}
                />
              </Box>
            </StepContent>
          </Step>
          <Step>
            <StepLabel>Confirm import</StepLabel>
            <StepContent>
              <Box className={classes.subContent}>
                <ConfirmStep
                  uploadBulkCreateTasks={uploadBulkCreateTasks}
                  onGoBack={handleBack}
                  onConfirm={handleConfirmCreation}
                />
              </Box>
            </StepContent>
          </Step>
          <Step completed={isSubmitted}>
            <StepLabel>Finished import</StepLabel>
            <StepContent>
              <Box className={classes.subContent}>
                <FinishedStep
                  reactorsAndTasksDetailBasePath={reactorsAndTasksDetailBasePath}
                  workcentersBasePath={workcentersBasePath}
                  createdTasks={createdTasks}
                  onReset={handleReset}
                  data-testid={dataTestIds.importSubmittedStep}
                />
              </Box>
            </StepContent>
          </Step>
        </Stepper>
        <Backdrop open={isProcessing} className={classes.containedBackdrop} data-testid={dataTestIds.processing}>
          <CircularProgressCentered />
        </Backdrop>
      </Paper>
    </Box>
  );
};
