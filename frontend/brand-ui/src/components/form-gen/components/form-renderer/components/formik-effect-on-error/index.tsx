import { FormikProps } from 'formik';
import React from 'react';

export interface FormikEffectOnError {
  formikProps: FormikProps<unknown>;
  onError: (errors: any) => void;
}

export const FormikEffectOnError = React.memo(({ formikProps, onError }: FormikEffectOnError) => {
  const didMount = React.useRef(false);

  React.useEffect(() => {
    if (didMount.current && onError) {
      onError(formikProps.errors);
    } else {
      didMount.current = true;
    }
  }, [formikProps.errors]);

  return null;
});
