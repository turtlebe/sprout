import { isConcreteField } from '@plentyag/brand-ui/src/components/form-gen/utils';
import { actAndAwaitRender } from '@plentyag/core/src/test-helpers';
import { render, RenderOptions, RenderResult } from '@testing-library/react';
import { Formik } from 'formik';
import { cloneDeep, merge } from 'lodash';
import React from 'react';
import * as yup from 'yup';

interface RenderFormGenInputOptions {
  initialValues?: any;
  validateOnMount?: boolean;
  className?: string;
  setFormikProps?: (formikProps: FormikProps<unknown>) => void;
  formGenField?: any;
  reactTestingLibRenderOptions?: RenderOptions;
}

type RenderFormGenInputReturn = [
  RenderResult,
  { formGenField; validationSchema: yup.ObjectSchema; validateField: jest.Mock }
];

export const makeOptions =
  (defaultOptions: RenderFormGenInputOptions) =>
  (additionalOptions: RenderFormGenInputOptions = {}) => {
    return merge(cloneDeep(defaultOptions), cloneDeep(additionalOptions));
  };

const getUI = (Component: React.FC<FormGen.FieldProps<FormGen.Field>>, options: RenderFormGenInputOptions = {}) => {
  const validateField = jest.fn();
  const formGenField: FormGen.Field = {
    name: 'mockName',
    label: 'Mock Label',
    validate: yup.mixed().test('test-mock-name', 'null', validateField),
    ...options?.formGenField,
  };

  const validationSchema = yup.object().shape({ [formGenField.name]: formGenField.validate });

  const ui = (
    <Formik
      initialValues={options.initialValues ?? {}}
      validateOnMount={options.validateOnMount ?? false}
      validationSchema={validationSchema}
      onSubmit={jest.fn()}
    >
      {formikProps => {
        options.setFormikProps && options.setFormikProps(formikProps);
        return <Component formGenField={formGenField} formikProps={formikProps} className={options?.className} />;
      }}
    </Formik>
  );

  return { formGenField, validationSchema, validateField, ui };
};

export const renderFormGenInput = (
  Component: React.FC<FormGen.FieldProps<FormGen.Field>>,
  options: RenderFormGenInputOptions = {}
): RenderFormGenInputReturn => {
  const { formGenField, validationSchema, validateField, ui } = getUI(Component, options);
  const rendered = render(ui);

  return [rendered, { formGenField, validationSchema, validateField }];
};

export const renderFormGenInputAsync = async (
  Component: React.FC<FormGen.FieldProps<FormGen.Field>>,
  options: RenderFormGenInputOptions = {}
): Promise<RenderFormGenInputReturn> => {
  const { formGenField, validationSchema, validateField, ui } = getUI(Component, options);
  const rendered = await actAndAwaitRender(ui, options.reactTestingLibRenderOptions);

  return [rendered, { formGenField, validationSchema, validateField }];
};

export function mockFormikProps({
  formGenField,
  value = undefined,
  initialValues = undefined,
  unregisterField = jest.fn(),
  registerField = jest.fn(),
  setFieldError = jest.fn(),
  setFieldValue = jest.fn(),
  validateField = jest.fn(),
  getFieldProps = jest.fn(),
}: {
  formGenField: FormGen.Field | FormGen.FieldGroupArray | FormGen.FieldGroupFunction;
  value?: any;
  initialValues?: any;
  unregisterField?: jest.Mock;
  registerField?: jest.Mock;
  setFieldError?: jest.Mock;
  setFieldValue?: jest.Mock;
  validateField?: jest.Mock;
  getFieldProps?: jest.Mock;
}) {
  let values = { [formGenField.name]: value ?? [] };

  if (isConcreteField(formGenField)) {
    values = { [formGenField.name]: value ?? formGenField.default };
  }

  return {
    values,
    initialValues,
    errors: {},
    unregisterField,
    registerField,
    setFieldError,
    setFieldValue,
    validateField,
    getFieldProps,
  } as unknown as FormikProps<{ mockName: string }>;
}
