import { FormikProps } from 'formik';
import React from 'react';

export interface FormikEffectOnChange {
  formikProps: FormikProps<unknown>;
  onChange: (values: any) => void;
}

export const FormikEffectOnChange = React.memo(({ formikProps, onChange }: FormikEffectOnChange) => {
  const didMount = React.useRef(false);

  React.useEffect(() => {
    if (didMount.current && onChange) {
      onChange(formikProps.values);
    } else {
      didMount.current = true;
    }
  }, [formikProps.values]);

  return null;
});
