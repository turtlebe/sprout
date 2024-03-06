import { useFormGenFields } from '@plentyag/brand-ui/src/components/form-gen';
import { useGlobalSnackbar } from '@plentyag/brand-ui/src/components/global-snackbar';
import { useGoToPath, UseGoToPathReturn } from '@plentyag/core/src/hooks/use-go-to-path';
import { parseErrorMessage } from '@plentyag/core/src/utils/parse-error-message';
import { isEqual, omit } from 'lodash';
import React from 'react';

async function removeImages(images) {
  // for some reasons doing this in a loop doesn't work, so doing it recursively.
  return new Promise(resolve => {
    if (!images || images.length === 0) {
      return resolve(undefined);
    }

    const image = images.pop();

    if (image) {
      image.remove();
    }

    return removeImages(images);
  });
}

export interface BaseFormReadyEvent {
  api: {
    resetForm: () => void;
    handleSuccess: () => void;
    handleError: (error) => void;
  };
}

export interface useBaseFormReadyEvent {
  isUpdating: boolean;
  formGenConfig: FormGen.Config;
  disableGoToPath?: boolean;
}

export interface useBaseFormReadyEventHookReturn {
  formikRef: any;
  formReadyEvent: BaseFormReadyEvent;
  handleChange: (values, initialValues) => void;
  setIsGoToAllowed: UseGoToPathReturn['setIsGoToAllowed'];
}

/**
 * Hook that defines the FormReadyEvent and its API.
 */
export const useBaseFormReadyEvent = ({
  formGenConfig,
  isUpdating,
  disableGoToPath = false,
}: useBaseFormReadyEvent): useBaseFormReadyEventHookReturn => {
  const snackbarProps = useGlobalSnackbar();
  const formikRef = React.useRef(null) as any;
  const { setIsGoToAllowed } = useGoToPath({ isAllowed: true, disabled: disableGoToPath });
  const { findFieldBy } = useFormGenFields(formGenConfig);

  /**
   * Reset the form and removes files if a DragAndDrop component is present
   */
  const resetForm = React.useCallback(() => {
    if (formikRef.current) {
      const dragAndDropInput = findFieldBy<FormGen.FieldDragAndDrop>({ type: 'DragAndDrop' });
      if (dragAndDropInput && formikRef.current.values[dragAndDropInput.name]) {
        void removeImages(formikRef.current.values[dragAndDropInput.name]);
      }
      formikRef.current.resetForm();
      setIsGoToAllowed(true);
    }
  }, [formikRef, findFieldBy]);

  /**
   * Reset the form and use the Snackbar to inform the user of a successful submission.
   */
  const handleSuccess = React.useCallback(() => {
    setIsGoToAllowed(true);

    if (!isUpdating) {
      resetForm();
      snackbarProps.successSnackbar('Your data has been submitted.');
    } else {
      snackbarProps.successSnackbar('Your data has been updated.');
    }
  }, [resetForm, snackbarProps]);

  /**
   * Default callback used when a FormRenderer.FormikEffectOnChange event triggers.
   *
   * In most cases, it's as simple as looking if the current Formik values are different than the initialValues.
   * If they are different, then we block the navigation with `setIsGoToAllowed`.
   *
   * When a DragAndDrop component is part of the FormGen.Fields, we omit its key from Formik values and initialValues.
   * If a file has a `downloadedFromS3` flag, it indicates that the file was fetch from S3 and already
   * uploaded in prior form submission.
   *
   * When the user just uploaded a file but the form has not been submitted yet, the file does not have a `downloadedFromS3` flag.
   */
  const handleChange = React.useCallback(
    (values, initialValues) => {
      const dragAndDropInput = findFieldBy<FormGen.FieldDragAndDrop>({ type: 'DragAndDrop' });

      if (dragAndDropInput) {
        const name = dragAndDropInput.name;

        // compare values without DragAndDrop inputs
        const valuesDifferFromInitialValues = !isEqual(omit(values, [name]), omit(initialValues, [name]));

        // Look if at least one file has been uploaded and not submitted
        const atLeastOneFileDragAndDropped = Boolean(
          values[name] && !values[name].every(f => (f.file ? f.file.downloadedFromS3 : f.downloadedFromS3))
        );
        const hasFormChanged = valuesDifferFromInitialValues || atLeastOneFileDragAndDropped;

        hasFormChanged && setIsGoToAllowed(false);
      } else {
        !isEqual(values, initialValues) && setIsGoToAllowed(false);
      }
    },
    [setIsGoToAllowed]
  );

  /**
   * Logs the error and use the Snackbar to inform the user.
   */
  const handleError = React.useCallback(
    error => {
      const message = parseErrorMessage(error);
      if (error.status < 500 && message) {
        snackbarProps.errorSnackbar({ message });
      } else {
        snackbarProps.errorSnackbar();
        console.error(error);
      }
    },
    [snackbarProps]
  );

  return {
    formikRef,
    setIsGoToAllowed,
    handleChange,
    formReadyEvent: {
      api: {
        resetForm,
        handleSuccess,
        handleError,
      },
    },
  };
};
