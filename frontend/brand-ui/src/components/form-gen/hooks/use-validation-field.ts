import { FormikHelpers, FormikProps } from 'formik';
import * as yup from 'yup';

import { useEventCallback } from './use-event-callback';

type UseValidationFieldReturn = FormikHelpers<any>['validateField'];

export interface UseValidationField {
  validationSchema: yup.ObjectSchema<object>;
  formikProps: FormikProps<unknown>;
}
export const useValidationField = ({ validationSchema, formikProps }: UseValidationField): UseValidationFieldReturn => {
  return useEventCallback((fieldName: string) => {
    const values = formikProps.values;
    if (typeof values === 'object' && fieldName) {
      validationSchema
        .validateAt(fieldName, values as Object)
        .then(() => {
          // no error - so clear.
          formikProps.setFieldError(fieldName, null);
        })
        .catch((err: yup.ValidationError) => {
          // Yup will throw a validation error if validation fails.
          // @see https://github.com/jquense/yup#validationerrorerrors-string--arraystring-value-any-path-string
          if (err.name === 'ValidationError') {
            formikProps.setFieldError(fieldName, err.message);
          } else {
            if (process.env.NODE_ENV !== 'production') {
              console.warn(
                'Warning: An unhandled error was caught during field validation in <Formik validationSchema />',
                err
              );
            }
          }
        });
    }
  });
};
