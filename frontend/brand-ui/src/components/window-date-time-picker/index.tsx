import { Check } from '@material-ui/icons';
import { Box, Button } from '@plentyag/brand-ui/src/material-ui/core';
import { KeyboardDatePicker, KeyboardDateTimePicker } from '@plentyag/brand-ui/src/material-ui/pickers';
import { appendQueryParams, DateTimeFormat, isValidDate } from '@plentyag/core/src/utils';
import { format as dateFnsFormat } from 'date-fns';
import React from 'react';
import { useHistory } from 'react-router-dom';

const dataTestIds = {
  root: 'window-date-time-picker-root',
  startDateTimePicker: 'window-date-time-picker-start-date-time',
  endDateTimePicker: 'window-date-time-picker-end-date-time',
  applyWindow: 'window-date-time-picker-button-apply',
};

export { dataTestIds as dataTestIdsWindowDateTimePicker };

export interface WindowDateTimePicker {
  onChange?: (startDateTime: Date, endDateTime: Date) => void;
  startDateTime: Date;
  endDateTime: Date;
  format?: string; // override default input format
  disableFuture?: boolean; // disabling future dates for the end date picker
  disableTime?: boolean; // provide the option to use a date picker without time picking
  'data-testid'?: string;
}

export const WindowDateTimePicker: React.FC<WindowDateTimePicker> = ({
  startDateTime,
  endDateTime,
  format = DateTimeFormat.US_DEFAULT,
  disableTime = false,
  disableFuture = false,
  onChange = () => {},
  'data-testid': dataTestId,
}) => {
  const [tempStartDateTime, setTempStartDateTime] = React.useState<Date>(startDateTime);
  const [tempEndDateTime, setTempEndDateTime] = React.useState<Date>(endDateTime);
  const [hasError, setHasError] = React.useState<boolean>(false);
  const history = useHistory();

  function handleApplyWindow() {
    onChange(tempStartDateTime, tempEndDateTime);
    history.push({
      search: appendQueryParams({
        startDateTime: tempStartDateTime.toISOString(),
        endDateTime: tempEndDateTime.toISOString(),
      }),
    });
  }

  function isSameTime(firstSample: Date, secondSample: Date) {
    if (!firstSample || !secondSample) {
      return false;
    }
    const firstSampleString = dateFnsFormat(firstSample, format);
    const secondSampleString = dateFnsFormat(secondSample, format);
    return firstSampleString === secondSampleString;
  }

  // switching pickers with/without time picker (both have similar API)
  const Picker = disableTime ? KeyboardDatePicker : KeyboardDateTimePicker;

  return (
    <Box display="flex" alignItems="flex-end" data-testid={dataTestId ?? dataTestIds.root}>
      <Box padding={1} />
      <Picker
        data-testid={dataTestIds.startDateTimePicker}
        label="From"
        format={format}
        value={tempStartDateTime}
        maxDate={tempEndDateTime}
        maxDateMessage='"From" should not be after To.'
        onChange={setTempStartDateTime}
        onError={error => setHasError(Boolean(error))}
      />
      <Box padding={1} />
      <Picker
        data-testid={dataTestIds.endDateTimePicker}
        label="To"
        value={tempEndDateTime}
        format={format}
        minDate={tempStartDateTime}
        minDateMessage='"To" should not be before From.'
        disableFuture={disableFuture}
        onChange={setTempEndDateTime}
        onError={error => setHasError(Boolean(error))}
      />
      <Box padding={1} />
      <Button
        data-testid={dataTestIds.applyWindow}
        startIcon={<Check />}
        onClick={handleApplyWindow}
        variant="contained"
        disabled={
          hasError ||
          !isValidDate(tempStartDateTime) ||
          !isValidDate(tempEndDateTime) ||
          (isSameTime(tempStartDateTime, startDateTime) && isSameTime(tempEndDateTime, endDateTime))
        }
      >
        Apply
      </Button>
    </Box>
  );
};
