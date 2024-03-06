import { useFormGenFields } from '@plentyag/brand-ui/src/components/form-gen/hooks/use-form-gen-fields';
import { useValidationSchema } from '@plentyag/brand-ui/src/components/form-gen/hooks/use-validation-schema';
import { Formik, FormikConfig, FormikProps } from 'formik';
import React from 'react';

import { FormBodyRenderer, FormikEffectOnChange } from './components';

export interface FormRenderer<T = unknown> {
  initialValues?: any;
  formId?: string;
  formGenConfig: FormGen.Config;
  enableReinitialize?: boolean;
  onChange?: any;
  onError?: any;
  onSubmit: FormikConfig<T>['onSubmit'];
  children?: React.FC<FormikProps<T>>;
  classes?: FormGen.OverridableClassName;
  renderSubmitButton?: boolean;
  innerRef?: FormikConfig<T>['innerRef'];
  dataTestId?: string;
  context?: any;
}

export const FormRenderer: React.FC<FormRenderer> = props => {
  const { fields, getInitialValuesWithDefaults: getInitialValues } = useFormGenFields(props.formGenConfig);
  const initialValues = React.useMemo(
    () => getInitialValues(props.formGenConfig.fields, props.initialValues),
    [props.formGenConfig.fields, props.initialValues]
  );
  const [formikValues, setFormikValues] = React.useState(initialValues ?? {});

  React.useEffect(() => {
    setFormikValues(initialValues);
  }, [initialValues]);

  const validationSchema = useValidationSchema(fields, formikValues);

  const handleChange: FormikEffectOnChange['onChange'] = values => {
    setFormikValues(values);
    if (props.onChange) {
      props.onChange(values);
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      enableReinitialize={props.enableReinitialize ?? false}
      onSubmit={props.onSubmit}
      validationSchema={validationSchema}
      validateOnBlur={false}
      validateOnChange={false}
      validateOnMount={false}
      innerRef={props.innerRef}
    >
      {formikProps => {
        return (
          <FormBodyRenderer
            handleChange={handleChange}
            formikProps={formikProps}
            validationSchema={validationSchema}
            {...props}
          />
        );
      }}
    </Formik>
  );
};
