import { Add } from '@material-ui/icons';
import { DialogSchedulePicker } from '@plentyag/brand-ui/src/components';
import { Button } from '@plentyag/brand-ui/src/material-ui/core';
import React from 'react';

const dataTestIds = {
  root: 'button-schedule-picker-root',
};

export { dataTestIds as dataTestIdsButtonSchedulePicker };

export interface ButtonSchedulePicker {
  onChange: DialogSchedulePicker['onChange'];
  disabled?: Button['disabled'];
  chooseActionDefinitionKey?: DialogSchedulePicker['chooseActionDefinitionKey'];
  multiple?: DialogSchedulePicker['multiple'];
}

/**
 * Button that opens a Dialog to choose a Schedule.
 */
export const ButtonSchedulePicker: React.FC<ButtonSchedulePicker> = ({
  onChange,
  disabled,
  chooseActionDefinitionKey,
  multiple,
}) => {
  const [open, setOpen] = React.useState<boolean>(false);
  const handleChange: DialogSchedulePicker['onChange'] = values => {
    onChange(values);
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
      <DialogSchedulePicker
        open={open}
        onChange={handleChange}
        onClose={() => setOpen(false)}
        chooseActionDefinitionKey={chooseActionDefinitionKey}
        multiple={multiple}
      />
    </>
  );
};
