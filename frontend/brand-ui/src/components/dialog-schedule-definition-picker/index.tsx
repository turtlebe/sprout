import { BaseForm, DialogDefault } from '@plentyag/brand-ui/src/components';
import { ScheduleDefinition } from '@plentyag/core/src/farm-def/types';
import { Schedule } from '@plentyag/core/src/types/environment';
import { get } from 'lodash';
import React from 'react';

import { useScheduleDefinitionPickerFormGenConfig } from './hooks';

export interface DialogScheduleDefinitionPicker {
  initialValue?: Schedule | ScheduleDefinition;
  scheduleDefinition: ScheduleDefinition;
  open: DialogDefault['open'];
  onClose: DialogDefault['onClose'];
  onChange: (scheduleOrDefinition: Schedule | ScheduleDefinition) => void;
}

export const DialogScheduleDefinitionPicker: React.FC<DialogScheduleDefinitionPicker> = ({
  scheduleDefinition,
  open,
  onClose,
  onChange,
  initialValue,
}) => {
  const formGenConfig = useScheduleDefinitionPickerFormGenConfig(scheduleDefinition);
  const handleSubmit: BaseForm['onSubmit'] = values => onChange(get(values, 'path'));

  return (
    <DialogDefault title="Choose a Schedule:" open={open} onClose={onClose}>
      <BaseForm
        formGenConfig={formGenConfig}
        onSubmit={handleSubmit}
        initialValues={formGenConfig.deserialize(initialValue)}
        renderSubmitTextHelper={false}
        isLoading={false}
        isUpdating={false}
        disableGoToPath
      />
    </DialogDefault>
  );
};
