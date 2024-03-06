import { FormRenderer } from '@plentyag/brand-ui/src/components/form-gen/components/form-renderer';
import { GroupRenderer } from '@plentyag/brand-ui/src/components/form-gen/components/group-renderer';
import { InputRenderer } from '@plentyag/brand-ui/src/components/form-gen/components/input-renderer';
import { getInputComponent } from '@plentyag/brand-ui/src/components/form-gen/components/inputs';
import { TitleRenderer } from '@plentyag/brand-ui/src/components/form-gen/components/title-renderer';
import { useFormGenFields } from '@plentyag/brand-ui/src/components/form-gen/hooks/use-form-gen-fields';
import { useValidationField } from '@plentyag/brand-ui/src/components/form-gen/hooks/use-validation-field';
import { isGroupField } from '@plentyag/brand-ui/src/components/form-gen/utils';
import { Box, Button } from '@plentyag/brand-ui/src/material-ui/core';
import clsx from 'clsx';
import { FormikProps } from 'formik';
import React from 'react';
import * as yup from 'yup';

import { FormikEffectOnChange, FormikEffectOnError } from '..';

import { useStyles } from './styles';

export const dataTestIds = {
  submit: 'form-renderer-submit',
};

interface FormBodyRenderer extends FormRenderer {
  formikProps: FormikProps<unknown>;
  validationSchema: yup.ObjectSchema<object>;
  handleChange: FormikEffectOnChange['onChange'];
}

/**
 * This component contains the main components used by Formik in form-renderer. This
 * component only exists because we need to add a hook and can not be done in form-renderer.
 */
export const FormBodyRenderer: React.FC<FormBodyRenderer> = ({
  formikProps,
  formGenConfig,
  validationSchema,
  handleChange,
  ...props
}) => {
  const defaultClasses = useStyles({});
  const { getConcreteFields } = useFormGenFields({});
  formikProps.validateField = useValidationField({ validationSchema, formikProps });

  return (
    <Box
      id={props.formId}
      component="form"
      onSubmit={formikProps.handleSubmit}
      className={clsx(defaultClasses.form, props.classes?.form)}
      data-testid={props.dataTestId}
    >
      <TitleRenderer formGenConfig={formGenConfig} classes={{ titleContainer: props.classes?.titleContainer }} />
      <FormikEffectOnChange formikProps={formikProps} onChange={handleChange} />
      {props.onError && <FormikEffectOnError formikProps={formikProps} onError={props.onError} />}
      {getConcreteFields(formGenConfig.fields, formikProps.values).map(formGenField =>
        isGroupField(formGenField) ? (
          <GroupRenderer
            key={formGenField.name}
            formikProps={formikProps}
            formGenField={formGenField}
            classes={props.classes}
            context={props.context}
          />
        ) : (
          <InputRenderer
            InputComponent={getInputComponent(formGenField)}
            key={formGenField.name}
            formGenField={formGenField}
            formikProps={formikProps}
            className={clsx(props.classes?.input, defaultClasses.input)}
            style={formGenField.style}
            inputContainer={clsx(props.classes?.inputContainer, defaultClasses.inputContainer)}
            inputContainerStyle={formGenField.inputContainerStyle}
            context={props.context}
          />
        )
      )}
      {props.children
        ? props.children(formikProps)
        : Boolean(props.renderSubmitButton ?? true) && (
            <Button
              variant="contained"
              type="submit"
              className={clsx(defaultClasses.submit, props.classes?.submit)}
              data-testid={dataTestIds.submit}
            >
              Submit
            </Button>
          )}
    </Box>
  );
};
