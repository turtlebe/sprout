import { MenuItem, TextField as MuiTextField } from '@plentyag/brand-ui/src/material-ui/core';
import { FastField, getIn } from 'formik';
import { isEqual } from 'lodash';
import React from 'react';

import { getError } from '../utils/formik-helpers';

const dataTestIds = {
  textField: 'selectFieldTextField',
};
export { dataTestIds as dataTestIdsSelectField };

// ToDo: replace MuiTextField here with common component from brand-ui

export const SelectField: React.FC<{
  className: string;
  fieldName: string;
  options: LT.SelectOptions;
  helperText?: string;
  label: string;
  disabled: boolean;
  validate?: (value: any) => any;
  onChange?: (value: string) => void;
}> = props => {
  function shouldUpdate(prevProps, nextProps) {
    return (
      !isEqual(prevProps.onChange, nextProps.onChange) ||
      !isEqual(prevProps.options, nextProps.options) ||
      prevProps.validate !== nextProps.validate ||
      prevProps.name !== nextProps.name ||
      getIn(prevProps.formik.values, nextProps.name) !== getIn(nextProps.formik.values, nextProps.name) ||
      getIn(prevProps.formik.errors, nextProps.name) !== getIn(nextProps.formik.errors, nextProps.name) ||
      getIn(prevProps.formik.touched, nextProps.name) !== getIn(nextProps.formik.touched, nextProps.name) ||
      Object.keys(prevProps).length !== Object.keys(nextProps).length ||
      prevProps.formik.isSubmitting !== nextProps.formik.isSubmitting
    );
  }
  return (
    // need to pass any props here that should be used in shouldCheckUpdate
    <FastField
      disabled={props.disabled}
      options={props.options}
      onChange={props.onChange}
      shouldUpdate={shouldUpdate}
      name={props.fieldName}
      validate={props.validate}
    >
      {({ field, form: { errors, setFieldValue } }) => {
        const error = getError(errors, props.fieldName);
        const isValueInOptions = props.options.some(option => option.value === field.value);
        if (!isValueInOptions && field.value !== '') {
          field.value = '';
        }
        return (
          <MuiTextField
            data-testid={dataTestIds.textField}
            error={!!error}
            disabled={!!!props.options.length || props.disabled}
            className={props.className}
            select
            {...field}
            onChange={event => {
              if (props.onChange) {
                props.onChange(event.target.value);
              } else {
                setFieldValue(field.name, event.target.value);
              }
            }}
            helperText={props.helperText || error}
          >
            {props.options.map((options, menuKey) => (
              <MenuItem key={menuKey} value={options.value}>
                {options.label}
              </MenuItem>
            ))}
          </MuiTextField>
        );
      }}
    </FastField>
  );
};
