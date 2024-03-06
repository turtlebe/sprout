import { getParentFarmDefPath } from '@plentyag/brand-ui/src/components/autocomplete-farm-def-object/utils';
import { FarmDefObject } from '@plentyag/core/src/farm-def/types';
import { Schedule } from '@plentyag/core/src/types/environment';
import * as yup from 'yup';

import { getScheduleActionDefinitionKeys, getSchedulesActionDefinitionKeysWhenEqual } from '../utils';

export interface UseSchedulePickerFormGenValues {
  farmDefObject: FarmDefObject;
  path: string;
  schedule: Schedule;
  schedules: Schedule[];
  actionDefinitionKey?: string;
}

export interface UseSchedulePickerFormGenConfig {
  chooseActionDefinitionKey?: boolean;
  multiple?: boolean;
}

export interface UseSchedulePickerFormGenConfigReturn extends FormGen.Config {}

export const useSchedulePickerFormGenConfig = ({
  chooseActionDefinitionKey,
  multiple,
}): UseSchedulePickerFormGenConfigReturn => {
  return {
    deserialize: values => {
      return { ...values, farmDefObject: getParentFarmDefPath(values?.path), schedule: values };
    },
    fields: [
      {
        type: 'AutocompleteFarmDefObject',
        name: 'farmDefObject',
        label: 'Path',
        onChange: object => object,
        showScheduleDefinitionParents: true,
        validate: yup.string().required(),
      },
      {
        computed: values => {
          return [
            {
              type: 'AutocompleteSchedule',
              name: multiple ? 'schedules' : 'schedule',
              label: multiple ? 'Schedule(s)' : 'Schedule',
              validate: yup.string().required(),
              path: values?.farmDefObject?.path,
              autocompleteProps: {
                disabled: Boolean(!values?.farmDefObject?.path),
                multiple,
                disableCloseOnSelect: multiple ? true : undefined,
              },
            },
          ];
        },
      },
      {
        computed: values => {
          const actionDefinitionKeys = multiple
            ? getSchedulesActionDefinitionKeysWhenEqual(values.schedules)
            : getScheduleActionDefinitionKeys(values.schedule);

          return chooseActionDefinitionKey && actionDefinitionKeys.length > 0
            ? [
                {
                  type: 'Select',
                  name: 'actionDefinitionKey',
                  label: 'Value',
                  validate: yup.string().optional(),
                  options: actionDefinitionKeys,
                  selectProps: { disabled: Boolean(!actionDefinitionKeys.length) },
                },
              ]
            : [];
        },
      },
    ],
  };
};
