import { KeyboardDatePicker as PlentyKeyboardDatePicker } from '@plentyag/brand-ui/src/material-ui/pickers';
import { FastField, FieldProps, getIn } from 'formik';
import React from 'react';

import { getDateFormat } from '../../common/utils/date-utils';

export interface DatePickerProps
  extends FieldProps,
    Omit<PlentyKeyboardDatePicker, 'name' | 'value' | 'error' | 'onChange'> {}

function fieldToDatePicker({
  field,
  form: { isSubmitting, errors, setFieldValue },
  disabled,
  ...props
}: DatePickerProps): PlentyKeyboardDatePicker {
  const fieldError = getIn(errors, field.name);

  return {
    ...props,
    ...field,
    error: !!fieldError,
    helperText: fieldError || props.helperText,
    disabled: disabled !== undefined ? disabled : isSubmitting,
    onChange(date) {
      setFieldValue(field.name, date);
    },
  };
}

export const DateField: React.FC<{
  className: string;
  fieldName: string;
  label: string;
  disabled: boolean;
  validate?: (value: any) => any;
}> = props => {
  return (
    <FastField name={props.fieldName} validate={props.validate}>
      {fieldProps => {
        return (
          <PlentyKeyboardDatePicker
            format={getDateFormat()}
            className={props.className}
            {...fieldToDatePicker({ ...fieldProps, disabled: props.disabled })}
          />
        );
      }}
    </FastField>
  );
};
