import DateFnsUtils from '@date-io/date-fns';
import {
  DateTimePicker,
  DateTimePickerProps,
  MuiPickersUtilsProvider,
} from '@plentyag/brand-ui/src/material-ui/pickers';
import * as React from 'react';

import { useFormikProps } from '../hooks/use-formik-props';
import { useIsRequired } from '../hooks/use-is-required';
import { memoWithFormikProps } from '../memo-with-formik-props';

const defaultFormat = 'MM/dd/yyyy hh:mm a';

export const DatePicker = memoWithFormikProps<FormGen.FieldDatePicker>(({ formGenField, formikProps, ...props }) => {
  const { decorateLabel } = useIsRequired(formGenField);
  const { value, error, name, label } = useFormikProps(formikProps, formGenField);

  const handleChange: DateTimePickerProps['onChange'] = async date => {
    // eslint-disable-next-line @typescript-eslint/await-thenable
    await formikProps.setFieldValue(name, date);
    formikProps.validateField(name);
  };
  const handleBlur: DateTimePickerProps['onBlur'] = () => formikProps.validateField(name);

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <DateTimePicker
        format={defaultFormat}
        {...formGenField.datePickerProps}
        autoOk
        data-testid={name}
        id={name}
        name={name}
        label={decorateLabel(label)}
        value={value || null}
        onChange={handleChange}
        onBlur={handleBlur}
        error={Boolean(error)}
        helperText={error}
        {...props}
      />
    </MuiPickersUtilsProvider>
  );
});
