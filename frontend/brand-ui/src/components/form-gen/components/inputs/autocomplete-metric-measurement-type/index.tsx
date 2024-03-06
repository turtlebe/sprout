import { toQueryParams } from '@plentyag/core/src/utils';
import { sortBy } from 'lodash';
import React from 'react';

import { AutocompleteRemote } from '../autocomplete-remote';
import { memoWithFormikProps } from '../memo-with-formik-props';

export const getMeasurementTypesUrl = (path: string) =>
  `/api/swagger/environment-service/metrics-api/get-measurement-types-for-path${toQueryParams({ path })}`;

export const transformData = (): FormGen.FieldSelectRemote<string[]>['transformResponse'] => response => {
  const autocompleteOptions = response.map(measurementType => ({
    label: measurementType,
    value: measurementType,
  }));
  return sortBy(autocompleteOptions, ['label']);
};

/**
 * FormGen Autocomple Component using {@link AutocompleteRemote} that fetches Metrics based on a Path and Measurement Type.
 */
export const AutocompleteMetricMeasurementType = memoWithFormikProps<FormGen.FieldAutocompleteMetricMeasurementType>(
  ({ formGenField, formikProps, ...props }) => {
    const { ...otherFormGenFieldProps } = formGenField;
    const transformResponse = transformData();

    const formGenFieldAutocomplete: FormGen.FieldAutocompleteRemote<string[]> = {
      ...otherFormGenFieldProps,
      type: 'AutocompleteRemote',
      url: getMeasurementTypesUrl(formGenField.path),
      transformResponse,
    };

    return <AutocompleteRemote formGenField={formGenFieldAutocomplete} formikProps={formikProps} {...props} />;
  }
);
