import DateFnsUtils from '@date-io/date-fns';
import {
  DateTimePickerProps,
  KeyboardDateTimePickerProps,
  DateTimePicker as MuiDateTimePicker,
  KeyboardDateTimePicker as MuiKeyboardDateTimePicker,
  MuiPickersUtilsProvider,
} from '@material-ui/pickers';
import { DateTimeFormat } from '@plentyag/core/src/utils';
import { DateTime } from 'luxon';
import React from 'react';

/**
 * This is a MATERIAL-UI format which is a universal DateTime format
 * This format is equivalent to the MOMENT format below {@see DEFAULT_DATETIME_MOMENT_FORMAT}.
 * @deprecated and use DateTimeFormat.US_DEFAULT directly
 */
export const DEFAULT_DATETIME_MUI_FORMAT = DateTimeFormat.US_DEFAULT;

/**
 * Use this format when using moment to fill the input in testing.
 * @deprecated since we're moving away from moment and use DateTimeFormat.US_DEFAULT
 */
export const DEFAULT_DATETIME_MOMENT_FORMAT = 'MM/DD/YYYY hh:mm A';

export type KeyboardDateTimePicker = KeyboardDateTimePickerProps;
export const KeyboardDateTimePicker: React.FC<KeyboardDateTimePicker> = props => {
  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <MuiKeyboardDateTimePicker
        format={DateTimeFormat.US_DEFAULT}
        placeholder={DateTime.now().toFormat(DateTimeFormat.US_DEFAULT)}
        autoComplete="off"
        {...props}
      />
    </MuiPickersUtilsProvider>
  );
};

export type DateTimePicker = DateTimePickerProps;
export const DateTimePicker: React.FC<DateTimePicker> = props => {
  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <MuiDateTimePicker {...props} />
    </MuiPickersUtilsProvider>
  );
};
