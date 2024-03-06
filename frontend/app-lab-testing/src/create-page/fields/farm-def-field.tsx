import { AutocompleteFarmDefObject } from '@plentyag/brand-ui/src/components/autocomplete-farm-def-object';
import { Box } from '@plentyag/brand-ui/src/material-ui/core';
import { isFarmDefObject } from '@plentyag/core/src/farm-def/type-guards';
import { FastField } from 'formik';
import React from 'react';

import { getError } from '../utils/formik-helpers';

interface Props {
  className: string;
  fieldName: string;
  label: string;
  validate?: (value: any) => any;
  disabled: boolean;
}

export const FarmDefField: React.FC<Props> = props => {
  return (
    <FastField name={props.fieldName} validate={props.validate}>
      {({ field, form: { errors, setFieldValue } }) => {
        const error = getError(errors, props.fieldName);
        return (
          <Box className={props.className}>
            <AutocompleteFarmDefObject
              disabled={props.disabled}
              closeWhenSelectingKinds={['machineZone']}
              error={error}
              initialPath={field.value.path}
              onChange={(selectedItem, farmCode) => {
                const location: LT.Location = isFarmDefObject(selectedItem)
                  ? {
                      path: selectedItem?.path,
                      id: selectedItem?.id,
                      farmCode: farmCode,
                    }
                  : { path: null, id: null, farmCode: null };
                setFieldValue(field.name, location);
              }}
            />
          </Box>
        );
      }}
    </FastField>
  );
};
