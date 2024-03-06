import { Add } from '@material-ui/icons';
import { DialogMetricPicker } from '@plentyag/brand-ui/src/components';
import { Button } from '@plentyag/brand-ui/src/material-ui/core';
import React from 'react';

const dataTestIds = {
  root: 'button-metric-picker-root',
};

export { dataTestIds as dataTestIdsButtonMetricPicker };

export interface ButtonMetricPicker {
  onChange: DialogMetricPicker['onChange'];
  disabled?: Button['disabled'];
  renderAlertRule?: DialogMetricPicker['renderAlertRule'];
}

/**
 * Button that opens a Dialog to choose a Metric.
 */
export const ButtonMetricPicker: React.FC<ButtonMetricPicker> = ({ onChange, disabled, renderAlertRule }) => {
  const [open, setOpen] = React.useState<boolean>(false);
  const handleChange: DialogMetricPicker['onChange'] = values => {
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
        Add Metric
      </Button>
      <DialogMetricPicker
        open={open}
        onChange={handleChange}
        onClose={() => setOpen(false)}
        renderAlertRule={renderAlertRule}
      />
    </>
  );
};
