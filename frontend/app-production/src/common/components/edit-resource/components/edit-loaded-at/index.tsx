import {
  CircularProgressCentered,
  CreateUpdateBaseForm,
  DialogConfirmation,
  Show,
  useGlobalSnackbar,
} from '@plentyag/brand-ui/src/components';
import { Box } from '@plentyag/brand-ui/src/material-ui/core';
import React, { useState } from 'react';

import { DeserializedObj, useEditLoadedAtFormGenConfig, useLoadFarmStateBySerial } from '../../hooks';
import { getEditableLoadAtAttributes } from '../../utils/get-editable-loaded-at-attributes';

import { useStyles } from './styles';
import { getConfirmationMessage } from './utils/get-confirmation-message';

const dataTestIds = {
  loading: 'edit-loaded-at-loading',
  noEditableFields: 'edit-loaded-at-no-editable-fields',
};

export { dataTestIds as dataTestIdsEditLoadedAt };

export interface EditLoadedAt {
  resourceState: ProdResources.ResourceState;
  onClose: () => void;
}

interface SubmitProps {
  values: DeserializedObj;
  submitRequest: (values: DeserializedObj) => void;
  isOpen: boolean;
  message: string;
}

export const DEFAULT_SUBMIT_PROPS = {
  values: null,
  submitRequest: () => {},
  isOpen: false,
  message: '',
};

export const EditLoadedAt: React.FC<EditLoadedAt> = ({ resourceState, onClose }) => {
  const { serial } = resourceState.containerObj;

  const snackbar = useGlobalSnackbar();
  const { farmStateContainer, revalidate, isValidating } = useLoadFarmStateBySerial(serial);
  const [submitProps, setSubmitProps] = useState<SubmitProps>(DEFAULT_SUBMIT_PROPS);
  const editableAttributes = getEditableLoadAtAttributes(farmStateContainer?.resourceState);
  const formGenConfig = useEditLoadedAtFormGenConfig(editableAttributes);
  const classes = useStyles();

  const handleBeforeSubmit = (incomingValues, incomingSubmitRequest) => {
    // set validation message and open dialog box
    const message = getConfirmationMessage(incomingValues);

    // save the confirmed val
    setSubmitProps({
      isOpen: true,
      message,
      values: incomingValues,
      submitRequest: incomingSubmitRequest,
    });
  };

  const handleDialogConfirm = async () => {
    // grab the latest state
    await revalidate();

    // merge it into the object
    const newValues = {
      ...submitProps.values,
      originalObj: farmStateContainer,
    };

    // now submit it
    submitProps.submitRequest(newValues);
  };

  const handleDialogCancel = () => {
    setSubmitProps(DEFAULT_SUBMIT_PROPS);
  };

  const handleSuccess = () => {
    setSubmitProps(DEFAULT_SUBMIT_PROPS);
    snackbar.successSnackbar('Updating loaded at date was successful!');
    onClose();
  };

  return (
    <Box className={classes.container} height="100%" display="flex" flexDirection="column">
      <Show when={!isValidating} fallback={<CircularProgressCentered data-testid={dataTestIds.loading} />}>
        <Show
          when={Boolean(formGenConfig)}
          fallback={
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              height="100%"
              data-testid={dataTestIds.noEditableFields}
            >
              No editable fields
            </Box>
          }
        >
          <CreateUpdateBaseForm
            formGenConfig={formGenConfig}
            initialValues={farmStateContainer}
            isUpdating={true}
            renderSubmitTextHelper
            disableDefaultOnSuccessHandler
            onSuccess={handleSuccess}
            onBeforeSubmit={handleBeforeSubmit}
            isSubmitDisabled={false}
          />
        </Show>
      </Show>

      <DialogConfirmation
        open={submitProps.isOpen}
        title={submitProps.message}
        cancelLabel="No"
        confirmLabel="Yes"
        onConfirm={handleDialogConfirm}
        onCancel={handleDialogCancel}
      />
    </Box>
  );
};
