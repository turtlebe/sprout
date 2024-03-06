import AccessTime from '@material-ui/icons/AccessTime';
import { KeyboardTimePicker as PlentyKeyboardTimePicker } from '@plentyag/brand-ui/src/material-ui/pickers';
import { FastField, FieldProps, getIn } from 'formik';
import React from 'react';

import { getTimeFormat } from '../../common/utils/date-utils';

const dataTestIds = {
  keyboardTimePicker: 'time-field-keyboard-time-picker',
};
export { dataTestIds as dataTestIdsTimeField };

export interface TimePickerProps
  extends FieldProps,
    Omit<PlentyKeyboardTimePicker, 'name' | 'value' | 'error' | 'onChange'> {}

function fieldToTimePicker({
  field,
  form: { isSubmitting, errors, setFieldValue },
  disabled,
  ...props
}: TimePickerProps): PlentyKeyboardTimePicker {
  const fieldError = getIn(errors, field.name);

  return {
    ...props,
    ...field,
    error: !!fieldError,
    helperText: fieldError || props.helperText,
    disabled: disabled !== undefined ? disabled : isSubmitting,
    onChange(time) {
      setFieldValue(field.name, time);
    },
  };
}

export interface TimeField {
  className: string;
  fieldName: string;
  label: string;
  disabled: boolean;
  validate?: (value: any) => any;
}
export const TimeField: React.FC<TimeField> = props => {
  return (
    <FastField name={props.fieldName} validate={props.validate}>
      {fieldProps => {
        return (
          <PlentyKeyboardTimePicker
            data-testid={dataTestIds.keyboardTimePicker}
            format={getTimeFormat()}
            showTodayButton={true}
            className={props.className}
            keyboardIcon={<AccessTime />}
            todayLabel="Now"
            {...fieldToTimePicker({ ...fieldProps, disabled: props.disabled })}
          />
        );
      }}
    </FastField>
  );
};
