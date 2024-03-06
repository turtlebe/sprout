import { FarmDefTypes } from '@plentyag/core/src/farm-def/types';
import { get, sortBy } from 'lodash';
import React from 'react';
import { kebabCase } from 'voca';

import { AutocompleteRemote } from '../autocomplete-remote';
import { memoWithFormikProps } from '../memo-with-formik-props';

export const getSearchFarmDefTypeUrl = (kind: string) =>
  `/api/plentyservice/farm-def-service/search-${kebabCase(kind)}s`;

interface TransformFarmDefTypeOptions {
  valueSelector?: string;
}

export const transformFarmDefTypeData =
  (options?: TransformFarmDefTypeOptions): FormGen.FieldSelectRemote<FarmDefTypes[]>['transformResponse'] =>
  response => {
    const { valueSelector = 'name' } = options ?? {};
    const autocompleteOptions = response.map(farmDefType => ({
      label: farmDefType.description,
      value: get(farmDefType, valueSelector, farmDefType),
    }));
    return sortBy(autocompleteOptions, ['label']);
  };

/**
 * FormGen Autocomple Component using {@link AutocompleteRemote} that fetches FarmDef Types.
 */
export const AutocompleteFarmDefType = memoWithFormikProps<FormGen.FieldAutocompleteFarmDefType>(
  ({ formGenField, formikProps, ...props }) => {
    const { valueSelector, ...otherFormGenFieldProps } = formGenField;
    const transformResponse = transformFarmDefTypeData({ valueSelector });

    const formGenFieldAutocomplete: FormGen.FieldAutocompleteRemote<FarmDefTypes[]> = {
      ...otherFormGenFieldProps,
      type: 'AutocompleteRemote',
      url: getSearchFarmDefTypeUrl(formGenField.kind),
      transformResponse,
    };

    return <AutocompleteRemote formGenField={formGenFieldAutocomplete} formikProps={formikProps} {...props} />;
  }
);
