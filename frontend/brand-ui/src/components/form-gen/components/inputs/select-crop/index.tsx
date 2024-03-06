import React from 'react';

import { transformVisData, VIS_ENDPOINT, VisResponse } from '../autocomplete-crop';
import { memoWithFormikProps } from '../memo-with-formik-props';
import { SelectRemote } from '../select-remote';

export const SelectCrop = memoWithFormikProps<FormGen.FieldSelectCrop>(({ formGenField, formikProps, ...props }) => {
  const { allowList, extra, ...otherFormGenFieldProps } = formGenField;
  const transformResponse = transformVisData({ allowList, extra });
  const formGenFieldAutocomplete: FormGen.FieldSelectRemote<VisResponse> = {
    ...otherFormGenFieldProps,
    type: 'SelectRemote',
    url: VIS_ENDPOINT,
    transformResponse,
  };

  return <SelectRemote formGenField={formGenFieldAutocomplete} formikProps={formikProps} {...props} />;
});
