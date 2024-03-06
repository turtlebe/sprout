import { TextField as MuiTextField } from '@plentyag/brand-ui/src/material-ui/core';
import { FastField, getIn } from 'formik';
import React from 'react';

import { getError } from '../utils/formik-helpers';

export const TextField: React.FC<{
  className: string;
  fieldName: string;
  label: string;
  disabled?: boolean;
  spellCheck?: boolean;
  validate?: (value: any) => any;
}> = props => {
  const shouldCheckUpdate = (prevProps, nextProps): boolean => {
    return (
      prevProps.disabled !== nextProps.disabled ||
      prevProps.validate !== nextProps.validate ||
      prevProps.name !== nextProps.name ||
      getIn(prevProps.formik.values, nextProps.name) !== getIn(nextProps.formik.values, nextProps.name) ||
      getIn(prevProps.formik.errors, nextProps.name) !== getIn(nextProps.formik.errors, nextProps.name) ||
      getIn(prevProps.formik.touched, nextProps.name) !== getIn(nextProps.formik.touched, nextProps.name) ||
      Object.keys(prevProps).length !== Object.keys(nextProps).length ||
      prevProps.formik.isSubmitting !== nextProps.formik.isSubmitting
    );
  };
  return (
    <FastField
      disabled={props.disabled}
      name={props.fieldName}
      validate={props.validate}
      shouldUpdate={shouldCheckUpdate}
    >
      {({ field, form: { errors } }) => {
        const error = getError(errors, props.fieldName);
        return (
          <MuiTextField
            spellCheck={typeof props.spellCheck === 'boolean' ? props.spellCheck : true}
            disabled={props.disabled}
            multiline
            helperText={error}
            error={!!error}
            className={props.className}
            {...field}
          />
        );
      }}
    </FastField>
  );
};
