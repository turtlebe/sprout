import DateFnsUtils from '@date-io/date-fns';
import {
  DatePickerProps,
  KeyboardDatePickerProps,
  DatePicker as MuiDatePicker,
  KeyboardDatePicker as MuiKeyboardDatePicker,
  MuiPickersUtilsProvider,
} from '@material-ui/pickers';
import React from 'react';

export type KeyboardDatePicker = KeyboardDatePickerProps;
export const KeyboardDatePicker: React.FC<KeyboardDatePicker> = props => {
  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <MuiKeyboardDatePicker {...props} />
    </MuiPickersUtilsProvider>
  );
};

export type DatePicker = DatePickerProps;
export const DatePicker: React.FC<DatePicker> = props => {
  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <MuiDatePicker {...props} />
    </MuiPickersUtilsProvider>
  );
};
