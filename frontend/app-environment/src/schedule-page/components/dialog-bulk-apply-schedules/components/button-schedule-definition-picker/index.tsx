import { Add } from '@material-ui/icons';
import { DialogScheduleDefinitionPicker } from '@plentyag/brand-ui/src/components';
import { Button } from '@plentyag/brand-ui/src/material-ui/core';
import { ScheduleDefinition } from '@plentyag/core/src/farm-def/types';
import React from 'react';

const dataTestIds = {
  root: 'button-schedule-picker-root',
};

export { dataTestIds as dataTestIdsButtonScheduleDefinitionPicker };

export interface ButtonScheduleDefinitionPicker {
  scheduleDefinition: ScheduleDefinition;
  onChange: DialogScheduleDefinitionPicker['onChange'];
  disabled?: Button['disabled'];
}

/**
 * Button that opens a Dialog to choose a ScheduleDefinition or Schedule.
 */
export const ButtonScheduleDefinitionPicker: React.FC<ButtonScheduleDefinitionPicker> = ({
  scheduleDefinition,
  onChange,
  disabled,
}) => {
  const [open, setOpen] = React.useState<boolean>(false);
  const handleChange: DialogScheduleDefinitionPicker['onChange'] = schedule => {
    onChange(schedule);
    setOpen(false);
  };

  return (
    <>
      <Button
        data-testid={dataTestIds.root}
        onClick={() => setOpen(true)}
        variant="outlined"
        color="default"
        startIcon={<Add />}
        disabled={disabled}
      >
        Add Schedule
      </Button>
      <DialogScheduleDefinitionPicker
        scheduleDefinition={scheduleDefinition}
        open={open}
        onChange={handleChange}
        onClose={() => setOpen(false)}
      />
    </>
  );
};
