import DateFnsUtils from '@date-io/date-fns';
import {
  KeyboardTimePickerProps,
  KeyboardTimePicker as MuiKeyboardTimePicker,
  MuiPickersUtilsProvider,
} from '@material-ui/pickers';
import React from 'react';

export type KeyboardTimePicker = KeyboardTimePickerProps;
export const KeyboardTimePicker: React.FC<KeyboardTimePicker> = props => {
  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <MuiKeyboardTimePicker {...props} />
    </MuiPickersUtilsProvider>
  );
};
