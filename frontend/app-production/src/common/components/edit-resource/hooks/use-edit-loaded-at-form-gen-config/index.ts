import { FarmStateContainer, LoadedAtAttributes } from '@plentyag/app-production/src/common/types/farm-state';
import { cloneDeep } from 'lodash';
import { DateTime } from 'luxon';
import * as yup from 'yup';

export interface UseEditLoadedAtFormGenConfigReturn extends FormGen.Config {}

export const LoadedAtAttributesLabels: Record<string, string> = {
  [LoadedAtAttributes.LOADED_IN_GERM_AT]: 'Loaded in Germination at',
  [LoadedAtAttributes.LOADED_IN_PROP_AT]: 'Loaded in Propagation at',
  [LoadedAtAttributes.LOADED_IN_GROW_AT]: 'Loaded in Vertical Grow at',
};

export interface DeserializedObj {
  originalObj: FarmStateContainer;
  [LoadedAtAttributes.LOADED_IN_GERM_AT]?: string;
  [LoadedAtAttributes.LOADED_IN_PROP_AT]?: string;
  [LoadedAtAttributes.LOADED_IN_GROW_AT]?: string;
}

export const useEditLoadedAtFormGenConfig = (
  loadedAtAttributes?: LoadedAtAttributes[]
): UseEditLoadedAtFormGenConfigReturn => {
  if (loadedAtAttributes?.length < 1) {
    return null;
  }

  return {
    title: 'Edit Loaded at date',
    updateEndpoint: '/api/plentyservice/executive-service/upsert-container',
    serialize: (values: DeserializedObj): FarmStateContainer => {
      const serializedObj = cloneDeep(values.originalObj);

      loadedAtAttributes.forEach(materialAttribute => {
        serializedObj.resourceState.materialAttributes[materialAttribute] = DateTime.fromISO(values[materialAttribute])
          .toUTC()
          .toISO();
      });

      return serializedObj;
    },
    deserialize: (values: FarmStateContainer): DeserializedObj => {
      const deserializedObj: DeserializedObj = {
        originalObj: values,
      };

      loadedAtAttributes.forEach(materialAttribute => {
        deserializedObj[materialAttribute] = values.resourceState.materialAttributes[materialAttribute];
      });

      return deserializedObj;
    },
    fields: loadedAtAttributes.reduce((acc, materialAttribute) => {
      if (Object.values(LoadedAtAttributes).find(attr => attr === materialAttribute)) {
        acc.push({
          type: 'KeyboardDateTimePicker',
          name: materialAttribute,
          label: LoadedAtAttributesLabels[materialAttribute],
          validate: yup.string().noDateTimeError().noFutureDateTime(),
          keyboardDateTimePickerProps: { autoOk: true, disableFuture: true },
        });
      }
      return acc;
    }, []),
  };
};
