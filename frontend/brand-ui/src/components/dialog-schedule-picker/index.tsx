import { BaseForm, DialogDefault } from '@plentyag/brand-ui/src/components';
import { Schedule } from '@plentyag/core/src/types/environment';
import { getShortenedPath, truncateStart } from '@plentyag/core/src/utils';
import React from 'react';

import {
  UseSchedulePickerFormGenConfig,
  useSchedulePickerFormGenConfig,
  UseSchedulePickerFormGenValues,
} from './hooks';

export interface DialogSchedulePicker {
  schedule?: Schedule;
  open: DialogDefault['open'];
  onClose: DialogDefault['onClose'];
  onChange: (values: UseSchedulePickerFormGenValues) => void;
  chooseActionDefinitionKey?: UseSchedulePickerFormGenConfig['chooseActionDefinitionKey'];
  multiple?: boolean;
}

export const DialogSchedulePicker: React.FC<DialogSchedulePicker> = ({
  open,
  onClose,
  onChange,
  schedule,
  multiple,
  chooseActionDefinitionKey,
}) => {
  const formGenConfig = useSchedulePickerFormGenConfig({ chooseActionDefinitionKey, multiple });
  const handleSubmit: BaseForm<UseSchedulePickerFormGenValues>['onSubmit'] = values => onChange(values);

  return (
    <DialogDefault
      title={schedule ? truncateStart(getShortenedPath(schedule.path)) : 'Schedule:'}
      open={open}
      onClose={onClose}
    >
      <BaseForm
        formGenConfig={formGenConfig}
        isLoading={false}
        isUpdating={false}
        disableGoToPath
        onSubmit={handleSubmit}
        renderSubmitTextHelper={false}
        initialValues={formGenConfig.deserialize(schedule)}
      />
    </DialogDefault>
  );
};
