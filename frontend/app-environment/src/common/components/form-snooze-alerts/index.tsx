import { Box, Button } from '@plentyag/brand-ui/src/material-ui/core';
import { KeyboardDateTimePicker } from '@plentyag/brand-ui/src/material-ui/pickers';
import { isValidDate } from '@plentyag/core/src/utils';
import React from 'react';

const dataTestIds = {
  root: 'form-snooze-alert-root',
  keyboardDateTimePicker: 'form-snooze-alert-keyboard-date-time-picker',
  cancel: 'form-snooze-alert-cancel',
  submit: 'form-snooze-alert-submit',
};

export { dataTestIds as dataTestIdsFormSnoozeAlerts };

export interface FormSnoozeAlerts {
  onSubmit: (snoozedUntil: Date) => void;
  onCancel: () => void;
  defaultSnoozeDate?: Date | undefined;
}

/**
 * Form with a KeyboardDateTimePicker and a sumbit CTA that allows to enter a date and receive its value on submit.
 */
export const FormSnoozeAlerts: React.FC<FormSnoozeAlerts> = ({ onSubmit, onCancel, defaultSnoozeDate = null }) => {
  const [snoozedUntil, setSnoozedUntil] = React.useState<Date | undefined>(defaultSnoozeDate);

  return (
    <Box display="flex" justifyContent="center" alignItems="flex-end" data-testid={dataTestIds.root}>
      <KeyboardDateTimePicker
        label="Snooze Until"
        value={snoozedUntil}
        onChange={setSnoozedUntil}
        data-testid={dataTestIds.keyboardDateTimePicker}
      />
      <Box padding={0.5} />
      <Button
        size="small"
        variant="contained"
        onClick={() => onSubmit(snoozedUntil)}
        disabled={!isValidDate(snoozedUntil)}
        data-testid={dataTestIds.submit}
      >
        Snooze
      </Button>
      <Box padding={0.5} />
      <Button size="small" variant="contained" color="default" onClick={onCancel} data-testid={dataTestIds.cancel}>
        Cancel
      </Button>
    </Box>
  );
};
