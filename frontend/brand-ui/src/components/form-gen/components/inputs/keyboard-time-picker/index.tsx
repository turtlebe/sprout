import {
  KeyboardTimePickerProps,
  KeyboardTimePicker as MuiKeyboardTimePicker,
} from '@plentyag/brand-ui/src/material-ui/pickers';
import { DateTimeFormat, getLuxonDateTime } from '@plentyag/core/src/utils';
import { DateTime } from 'luxon';
import React from 'react';

import { useFormikProps } from '../hooks/use-formik-props';
import { useIsRequired } from '../hooks/use-is-required';
import { memoWithFormikProps } from '../memo-with-formik-props';

export const KeyboardTimePicker = memoWithFormikProps<FormGen.FieldKeyboardTimePicker>(
  ({ formGenField, formikProps, ...props }) => {
    const { decorateLabel } = useIsRequired(formGenField);
    const { value, error, name, label } = useFormikProps(formikProps, formGenField);
    const { valueFormat } = formGenField;
    const [dateTimeValue, setDateTimeValue] = React.useState<DateTime | undefined>(
      () => value && getLuxonDateTime(value, valueFormat)
    );

    const handleChange: KeyboardTimePickerProps['onChange'] = time =>
      setDateTimeValue(time && DateTime.fromJSDate(time));

    const handleBlur: KeyboardTimePickerProps['onBlur'] = () => formikProps.validateField(name);

    // when `dateTimeValue` changes, update the formikValue.
    React.useEffect(() => {
      formikProps.setFieldValue(
        name,
        dateTimeValue && (valueFormat ? dateTimeValue.toFormat(valueFormat) : dateTimeValue.toISO())
      );
    }, [name, dateTimeValue, valueFormat]);

    React.useEffect(() => {
      if (value) {
        formikProps.validateField(name);
      }

      // when `FormGen.FieldKeyboardTimePicker['valueFormat']` is present,
      // every time the value from formik changes (from the caller), we want to update the `dateTimeValue`.
      if (valueFormat) {
        setDateTimeValue(value && getLuxonDateTime(value, valueFormat));
      }
    }, [name, value, valueFormat]);

    return (
      <MuiKeyboardTimePicker
        {...formGenField.keyboardTimePickerProps}
        data-testid={name}
        id={name}
        name={name}
        value={dateTimeValue || null}
        label={decorateLabel(label)}
        onChange={handleChange}
        onBlur={handleBlur}
        error={Boolean(error)}
        helperText={error}
        placeholder={DateTime.now().toFormat(DateTimeFormat.US_TIME_ONLY)}
        {...props}
      />
    );
  }
);
