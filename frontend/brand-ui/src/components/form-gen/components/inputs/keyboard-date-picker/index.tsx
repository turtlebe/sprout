import {
  KeyboardDatePickerProps,
  KeyboardDatePicker as MuiKeyboardDatePicker,
} from '@plentyag/brand-ui/src/material-ui/pickers';
import { DateTimeFormat, getLuxonDateTime } from '@plentyag/core/src/utils';
import { DateTime } from 'luxon';
import React from 'react';

import { useFormikProps } from '../hooks/use-formik-props';
import { useIsRequired } from '../hooks/use-is-required';
import { memoWithFormikProps } from '../memo-with-formik-props';

export const KeyboardDatePicker = memoWithFormikProps<FormGen.FieldKeyboardDatePicker>(
  ({ formGenField, formikProps, ...props }) => {
    const { decorateLabel } = useIsRequired(formGenField);
    const { value, error, name, label } = useFormikProps(formikProps, formGenField);
    const { valueFormat } = formGenField;
    const [dateTimeValue, setDateTimeValue] = React.useState<DateTime | undefined>(
      () => value && getLuxonDateTime(value, valueFormat)
    );

    const handleChange: KeyboardDatePickerProps['onChange'] = date =>
      setDateTimeValue(date && DateTime.fromJSDate(date));

    const handleBlur: KeyboardDatePickerProps['onBlur'] = () => formikProps.validateField(name);

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

      // when `FormGen.FieldKeyboardDatePicker['valueFormat']` is present,
      // every time the value from formik changes (from the caller), we want to update the `dateTimeValue`.
      if (valueFormat) {
        setDateTimeValue(value && getLuxonDateTime(value, valueFormat));
      }
    }, [name, value, valueFormat]);

    return (
      <MuiKeyboardDatePicker
        {...formGenField.keyboardDatePickerProps}
        disableToolbar
        variant="inline"
        format={DateTimeFormat.US_DATE_ONLY}
        data-testid={name}
        id={name}
        name={name}
        label={decorateLabel(label)}
        value={dateTimeValue || null}
        onChange={handleChange}
        onBlur={handleBlur}
        error={Boolean(error)}
        helperText={error}
        placeholder={DateTime.now().toFormat(DateTimeFormat.US_DATE_ONLY)}
        {...props}
      />
    );
  }
);
