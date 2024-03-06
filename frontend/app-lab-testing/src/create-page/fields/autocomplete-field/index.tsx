import { FastField, FieldValidator, getIn } from 'formik';
import { isEqual } from 'lodash';
import React from 'react';

import { Autocomplete, AutocompleteProps } from './autocomplete';

export interface AutocompleteField {
  className: string;
  options: any[];
  fieldName: string;
  label: string;
  disabled: boolean;
  noOptionsText?: string;
  multiple?: boolean;
  freeSolo?: boolean;
  isLoading?: boolean;
  getOptionLabel?: AutocompleteProps['getOptionLabel'];
  getOptionSelected?: AutocompleteProps['getOptionSelected'];
  error?: string;
  validate?: FieldValidator;
}

export const AutocompleteField: React.FC<AutocompleteField> = props => {
  const shouldCheckUpdate = (prevProps, nextProps): boolean => {
    return (
      !isEqual(prevProps.options, nextProps.options) ||
      prevProps.noOptionsText !== nextProps.noOptionsText ||
      prevProps.isLoading !== nextProps.isLoading ||
      prevProps.validate !== nextProps.validate ||
      prevProps.disabled !== nextProps.disabled ||
      prevProps.error !== nextProps.error ||
      prevProps.name !== nextProps.name ||
      getIn(prevProps.formik.values, nextProps.name) !== getIn(nextProps.formik.values, nextProps.name) ||
      getIn(prevProps.formik.errors, nextProps.name) !== getIn(nextProps.formik.errors, nextProps.name) ||
      getIn(prevProps.formik.touched, nextProps.name) !== getIn(nextProps.formik.touched, nextProps.name) ||
      Object.keys(prevProps).length !== Object.keys(nextProps).length ||
      prevProps.formik.isSubmitting !== nextProps.formik.isSubmitting
    );
  };

  return (
    // need to pass any props here that should be used in shouldCheckUpdate
    <FastField
      disabled={props.disabled}
      isLoading={props.isLoading}
      options={props.options}
      noOptionsText={props.noOptionsText}
      shouldUpdate={shouldCheckUpdate}
      name={props.fieldName}
      validate={props.validate}
      error={props.error}
    >
      {({ field, form: { errors, setFieldValue, setFieldError } }) => (
        <Autocomplete
          disabled={props.disabled}
          field={field}
          errors={errors}
          setFieldValue={setFieldValue}
          setFieldError={setFieldError}
          autoCompleteProps={props}
        />
      )}
    </FastField>
  );
};
