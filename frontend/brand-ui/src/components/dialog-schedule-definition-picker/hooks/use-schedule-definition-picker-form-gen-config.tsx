import { ScheduleDefinition } from '@plentyag/core/src/farm-def/types';
import { Schedule } from '@plentyag/core/src/types/environment';
import * as yup from 'yup';

export interface UseScheduleDefinitionPickerFormGenConfigReturn extends FormGen.Config {}

export const useScheduleDefinitionPickerFormGenConfig = (
  compatibleScheduleDefinition: ScheduleDefinition
): UseScheduleDefinitionPickerFormGenConfigReturn => {
  return {
    deserialize: (values: Schedule | ScheduleDefinition) => ({
      path: values?.path,
    }),
    fields: [
      {
        type: 'AutocompleteFarmDefObject',
        name: 'path',
        label: 'Path',
        onChange: object => object,
        closeWhenSelectingKinds: ['scheduleDefinition'],
        showScheduleDefinitions: true,
        compatibleScheduleDefinition,
        resolveScheduleDefinition: true,
        validate: yup.mixed().test('is-schedule-definition', 'You must choose a Schedule.', value => {
          const { path = '' } = value;
          return new RegExp(/scheduleDefinition/).test(path);
        }),
      },
    ],
  };
};
