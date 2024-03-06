import { KeyboardArrowRight } from '@material-ui/icons';
import { FormRenderer } from '@plentyag/brand-ui/src/components/form-gen';
import { SubmitterTextHelper } from '@plentyag/brand-ui/src/components/submitter-text-helper';
import { dataTestIdBaseFormSubmit } from '@plentyag/brand-ui/src/constants';
import { Box, Button, LinearProgress, Typography } from '@plentyag/brand-ui/src/material-ui/core';
import clsx from 'clsx';
import React from 'react';

import { BaseFormReadyEvent, useBaseFormReadyEvent } from './hooks/use-base-form-ready-event';
import { useStyles as useStylesDefault } from './styles';
import { useStyles as useStylesGroupRow } from './styles-group-row';

export * from './hooks/use-base-form-ready-event';

interface OverridableClassName {
  baseFormFooter;
}

const dataTestIds = {
  form: 'baseform-form',
  submit: dataTestIdBaseFormSubmit,
  loader: 'baseform-loader',
};

export { dataTestIds as dataTestIdsBaseForm };

export interface BaseForm<T = unknown> {
  isUpdating: boolean;
  isLoading: boolean;
  loadingProgress?: number; // when provided the progressVariant is 'determinate', otherwise 'indeterminate' when not provided.
  initialValues?: any;
  formGenConfig: FormGen.Config;
  onSubmit: FormRenderer<T>['onSubmit'];
  submitterTextHelperProps?: {
    createdAt?: string;
    username?: string;
  };
  renderSubmitTextHelper?: boolean;
  isSubmitDisabled?: boolean;
  onBaseFormReady?: (event: BaseFormReadyEvent) => void;
  classes?: OverridableClassName;
  layout?: FormGen.Layout;
  disableGoToPath?: boolean;
  dataTestIdProps?: {
    form: string;
    submit: string;
    loader: string;
  };
}

const scrollToFirstError = () => {
  const inputContainer = document.querySelector('.Mui-error')?.closest('[data-inputcontainer]');

  inputContainer && inputContainer.scrollIntoView && inputContainer.scrollIntoView();
};

export const BaseForm: React.FC<BaseForm> = ({
  classes,
  formGenConfig,
  initialValues,
  isLoading,
  loadingProgress,
  isSubmitDisabled,
  isUpdating,
  onBaseFormReady,
  onSubmit,
  renderSubmitTextHelper = true,
  submitterTextHelperProps,
  layout = 'default',
  disableGoToPath = false,
  dataTestIdProps,
}) => {
  const defaultLayoutClasses = useStylesDefault({ isLoading });
  const groupRowLayoutClasses = useStylesGroupRow({ isLoading });
  const defaultClasses = layout === 'groupRow' ? groupRowLayoutClasses : defaultLayoutClasses;
  const [submitEvent, setSubmitEvent] = React.useState(null);
  const [errors, setErrors] = React.useState<Object>(null);
  const { handleChange, formikRef, setIsGoToAllowed, formReadyEvent } = useBaseFormReadyEvent({
    formGenConfig,
    isUpdating: isUpdating,
    disableGoToPath,
  });

  React.useEffect(() => {
    if (formikRef.current && onBaseFormReady) {
      onBaseFormReady(formReadyEvent);
    }
  }, [formikRef]);
  React.useEffect(() => {
    if (submitEvent && errors) {
      scrollToFirstError();
      setSubmitEvent(null);
    }
  }, [submitEvent, errors]);
  React.useEffect(() => {
    setIsGoToAllowed(true);
  }, [formGenConfig]);

  return (
    <>
      <LinearProgress
        className={defaultClasses.linearProgress}
        data-testid={dataTestIdProps ? dataTestIdProps.loader : dataTestIds.loader}
        variant={typeof loadingProgress === 'number' ? 'determinate' : 'indeterminate'}
        value={loadingProgress}
      />
      <Box height="100%" display="flex" flexDirection="column">
        <Box display="flex" flexDirection="column" overflow="hidden" flex={'1 1 auto'}>
          <FormRenderer
            enableReinitialize={true}
            dataTestId={dataTestIdProps ? dataTestIdProps.form : dataTestIds.form}
            formId={dataTestIdProps ? dataTestIdProps.form : dataTestIds.form}
            formGenConfig={formGenConfig}
            initialValues={initialValues}
            onSubmit={onSubmit}
            classes={{
              form: defaultClasses.form,
              input: defaultClasses.input,
              inputContainer: defaultClasses.inputContainer,
              inputContainerInGroup: defaultClasses.inputContainerInGroup,
              titleContainer: defaultClasses.titleContainer,
              groupContainer: defaultClasses.groupContainer,
              groupRow: defaultClasses.groupRow,
              nestedGroupContainer: defaultClasses.nestedGroupContainer,
              groupItem: defaultClasses.groupItem,
              groupInputs: defaultClasses.groupInputs,
            }}
            renderSubmitButton={false}
            innerRef={formikRef}
            onChange={values => handleChange(values, initialValues)}
            onError={errors => setErrors(errors)}
            context={formGenConfig.context}
          />
          <Box className={clsx(defaultClasses.baseFormFooter, classes?.baseFormFooter)}>
            <Box display="flex" flexDirection="column">
              <Typography color="textSecondary" variant="subtitle2">
                * Required
              </Typography>
              {renderSubmitTextHelper && (
                <SubmitterTextHelper
                  createdAt={submitterTextHelperProps?.createdAt}
                  username={submitterTextHelperProps?.username}
                />
              )}
            </Box>
            <Button
              data-testid={dataTestIdProps ? dataTestIdProps.submit : dataTestIds.submit}
              form={dataTestIdProps ? dataTestIdProps.form : dataTestIds.form}
              disabled={isLoading || isSubmitDisabled}
              variant="contained"
              type="submit"
              color="primary"
              children={isUpdating ? 'Update' : 'Submit'}
              endIcon={<KeyboardArrowRight />}
              onClick={() => setSubmitEvent({})}
            />
          </Box>
        </Box>
      </Box>
    </>
  );
};
