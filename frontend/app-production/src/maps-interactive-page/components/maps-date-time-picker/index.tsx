import { useQueryParameter } from '@plentyag/app-production/src/maps-interactive-page/hooks/use-query-parameter';
import { KeyboardDateTimePicker } from '@plentyag/brand-ui/src/material-ui/pickers';
import { DateTimeFormat, getScopedDataTestIds } from '@plentyag/core/src/utils';
import { DateTime } from 'luxon';
import React from 'react';

export const dataTestIds = getScopedDataTestIds(
  {
    dateTimePicker: 'date-time-picker',
  },
  'mapsDateTimePicker'
);

export { dataTestIds as dataTestIdsMapsDateTimePicker };

export const MapsDateTimePicker: React.FC = () => {
  const { parameters, setParameters } = useQueryParameter();
  const [tempDateTime, setTempDateTime] = React.useState<DateTime>(parameters.selectedDate);

  React.useEffect(() => {
    setTempDateTime(parameters.selectedDate);
  }, [parameters.selectedDate]);

  function handleDateChange(newDate: Date) {
    const luxonNewDate = DateTime.fromJSDate(newDate);
    setTempDateTime(luxonNewDate);
    if (luxonNewDate.isValid && luxonNewDate <= DateTime.now()) {
      setParameters({ selectedDate: luxonNewDate });
    }
  }

  return (
    <KeyboardDateTimePicker
      data-testid={dataTestIds.dateTimePicker}
      label="Date"
      format={DateTimeFormat.US_DEFAULT}
      inputVariant="outlined"
      size="small"
      fullWidth={false}
      value={tempDateTime}
      disableFuture
      showTodayButton
      todayLabel="now"
      onChange={handleDateChange}
    />
  );
};
