import { FieldValidator, FormikProps, getIn } from 'formik';
import { isEqual } from 'lodash';
import React from 'react';
import { usePrevious } from 'react-use';

export const useFormikProps = (formikProps: FormikProps<unknown>, formGenField: FormGen.Field) => {
  const { name, label } = formGenField;
  const value = getIn(formikProps.values, name);
  const error = getIn(formikProps.errors, name);

  const previousDefault = usePrevious(formGenField.default);

  React.useEffect(() => {
    formikProps.registerField(
      name,
      formGenField.validate ? { validate: formGenField.validate as unknown as FieldValidator } : {}
    );

    const formikField = formikProps.getFieldProps(formGenField.name);

    const hasDefaultChanged = previousDefault !== undefined && !isEqual(previousDefault, formGenField.default);
    if (formGenField.default !== undefined && (hasDefaultChanged || formikField?.value === undefined)) {
      formikProps.setFieldValue(formGenField.name, formGenField.default);
    }

    return () => {
      formikProps.unregisterField(name);
    };
  }, [formGenField]);

  return {
    value,
    error,
    name,
    label,
  };
};
