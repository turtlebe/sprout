import Alert from '@material-ui/lab/Alert';
import { BaseForm, DialogDefault, Show } from '@plentyag/brand-ui/src/components';
import { Box } from '@plentyag/brand-ui/src/material-ui/core';
import { Metric } from '@plentyag/core/src/types/environment';
import React from 'react';

import { UseMetricPickerFormGenConfig, useMetricPickerFormGenConfig, UseMetricPickerFormGenValues } from './hooks';

const dataTestIds = {
  warning: 'dialog-metric-picker-warning',
};

export { dataTestIds as dataTestIdsDialogMetricPicker };

export interface DialogMetricPicker {
  metric?: Metric;
  warning?: string;
  open: DialogDefault['open'];
  onClose: DialogDefault['onClose'];
  onChange: (values: UseMetricPickerFormGenValues) => void;
  renderAlertRule?: UseMetricPickerFormGenConfig['renderAlertRule'];
}

export const DialogMetricPicker: React.FC<DialogMetricPicker> = ({
  onChange,
  onClose,
  open,
  metric,
  warning,
  renderAlertRule,
}) => {
  const isUpdating = Boolean(metric);
  const formGenConfig = useMetricPickerFormGenConfig({ renderAlertRule });
  const handleSubmit: BaseForm<UseMetricPickerFormGenValues>['onSubmit'] = values => onChange(values);

  return (
    <DialogDefault title="Metric:" open={open} onClose={onClose}>
      <Show when={Boolean(warning)}>
        <Box padding={2} data-testid={dataTestIds.warning}>
          <Alert severity="warning">{warning}</Alert>
        </Box>
      </Show>
      <BaseForm
        formGenConfig={formGenConfig}
        isLoading={false}
        isUpdating={isUpdating}
        disableGoToPath
        onSubmit={handleSubmit}
        renderSubmitTextHelper={false}
        initialValues={formGenConfig.deserialize(metric)}
      />
    </DialogDefault>
  );
};
