import { reduce, sortBy } from 'lodash';
import React from 'react';

import { AutocompleteRemote } from '../autocomplete-remote';
import { getOptions } from '../autocomplete/utils';
import { memoWithFormikProps } from '../memo-with-formik-props';

export const VIS_ENDPOINT = '/api/plentyservice/varietal-information-service/get-latest-record/TIGRIS';

export interface VisResponse {
  varietals: { [key: string]: { crop: string } };
}

type TransformVisResponse = FormGen.FieldSelectRemote<VisResponse>['transformResponse'];

interface TransformVisDataOptions {
  allowList?: string[];
  extra?: (string | FormGen.ValueLabel)[];
}

export const transformVisData =
  (options?: TransformVisDataOptions): TransformVisResponse =>
  response => {
    const { allowList = [], extra = [] } = options ?? {};
    const filteredVarietals = reduce<any, FormGen.ValueLabel[]>(
      response.varietals,
      (reducedVarietals, varietal, index) => {
        if (allowList.includes(index) || allowList.length === 0) {
          reducedVarietals.push({ label: `${varietal.crop} ${index}`, value: index });
        }
        return reducedVarietals;
      },
      []
    );

    return [...sortBy(filteredVarietals, ['label']), ...getOptions(extra)];
  };

export const AutocompleteCrop = memoWithFormikProps<FormGen.FieldAutocompleteCrop>(
  ({ formGenField, formikProps, ...props }) => {
    const { allowList, extra, ...otherFormGenFieldProps } = formGenField;
    const transformResponse = transformVisData({ allowList, extra });
    const formGenFieldAutocomplete: FormGen.FieldAutocompleteRemote<VisResponse> = {
      ...otherFormGenFieldProps,
      type: 'AutocompleteRemote',
      url: VIS_ENDPOINT,
      transformResponse,
    };

    return <AutocompleteRemote formGenField={formGenFieldAutocomplete} formikProps={formikProps} {...props} />;
  }
);
