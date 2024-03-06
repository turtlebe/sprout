import { EVS_URLS } from '@plentyag/app-environment/src/common/utils';
import { ONE_DAY } from '@plentyag/app-environment/src/common/utils/constants';
import { isScheduleDefinition } from '@plentyag/core/src/farm-def/type-guards';
import { Schedule, ScheduleType } from '@plentyag/core/src/types/environment';
import * as yup from 'yup';
export interface UseScheduleFormGenConfig {
  schedule?: Schedule;
  username: string;
}
export interface UseScheduleFormGenConfigReturn extends FormGen.Config {}

export const useScheduleFormGenConfig = ({
  schedule,
  username,
}: UseScheduleFormGenConfig): UseScheduleFormGenConfigReturn => {
  const isUpdating = Boolean(schedule);
  const createdOrUpdatedBy = isUpdating ? 'updatedBy' : 'createdBy';

  return {
    title: isUpdating ? 'Edit Schedule' : 'Create Schedule',
    createEndpoint: EVS_URLS.schedules.createUrl(),
    updateEndpoint: EVS_URLS.schedules.updateUrl(schedule),
    serialize: values => ({ ...values, [createdOrUpdatedBy]: username }),
    fields: [
      {
        type: 'AutocompleteFarmDefObject',
        name: 'path',
        label: 'Path',
        validate: yup.string().required(),
        showScheduleDefinitions: true,
        closeWhenSelectingKinds: ['scheduleDefinition'],
        onChange: farmDefObject => (isScheduleDefinition(farmDefObject) ? farmDefObject.path : ''),
        autocompleteProps: isUpdating ? { disabled: true } : undefined,
      },
      {
        type: 'Select',
        name: 'scheduleType',
        label: 'Schedule Type',
        options: [
          { label: 'Continuous', value: ScheduleType.CONTINUOUS },
          { label: 'Event', value: ScheduleType.EVENT },
        ],
        validate: yup.string().required(),
      },
      {
        type: 'TextField',
        name: 'description',
        label: 'Description',
      },
      {
        type: 'KeyboardDateTimePicker',
        name: 'startsAt',
        label: 'Start Time',
        validate: yup.string().noMomentError().required(),
      },
      {
        type: 'KeyboardDateTimePicker',
        name: 'activatesAt',
        label: 'Activation Time',
        validate: yup.string().noMomentError().required(),
      },
      {
        type: 'KeyboardDateTimePicker',
        name: 'endsAt',
        label: 'End Time',
        validate: yup.string().noMomentError().nullable(),
      },
      {
        type: 'TextField',
        name: 'priority',
        label: 'Priority',
        textFieldProps: { type: 'number' },
        default: 1,
        validate: yup.number().integer().moreThan(0).required(),
      },
      {
        type: 'TextField',
        name: 'repeatInterval',
        label: 'Repeat Interval',
        textFieldProps: { type: 'number' },
        default: ONE_DAY,
        validate: yup.number().integer().moreThan(0).required(),
      },
    ],
  };
};
