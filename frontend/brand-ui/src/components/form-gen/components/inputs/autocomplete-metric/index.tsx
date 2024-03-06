import { PaginatedList } from '@plentyag/core/src/types';
import { Metric } from '@plentyag/core/src/types/environment';
import { toQueryParams } from '@plentyag/core/src/utils';
import { get, sortBy } from 'lodash';
import React from 'react';

import { AutocompleteRemote } from '../autocomplete-remote';
import { memoWithFormikProps } from '../memo-with-formik-props';

export const getMetricsSearchUrl = (path: string, measurementType: String) =>
  `/api/swagger/environment-service/metrics-api/list-metrics${toQueryParams({
    path,
    measurementType,
    includeAlertRules: true,
  })}`;

interface TransformData {
  valueSelector?: string;
}

export const transformData =
  ({ valueSelector }: TransformData): FormGen.FieldSelectRemote<PaginatedList<Metric>>['transformResponse'] =>
  response => {
    const autocompleteOptions = response?.data?.map(metric => ({
      label: metric.observationName,
      value: get(metric, valueSelector, metric),
    }));
    return sortBy(autocompleteOptions, ['label']);
  };

/**
 * FormGen Autocomple Component using {@link AutocompleteRemote} that fetches Measurement Types based on a Path.
 */
export const AutocompleteMetric = memoWithFormikProps<FormGen.FieldAutocompleteMetric>(
  ({ formGenField, formikProps, ...props }) => {
    const { valueSelector, ...otherFormGenFieldProps } = formGenField;
    const transformResponse = transformData({ valueSelector });

    const formGenFieldAutocomplete: FormGen.FieldAutocompleteRemote<PaginatedList<Metric>> = {
      ...otherFormGenFieldProps,
      type: 'AutocompleteRemote',
      url: getMetricsSearchUrl(formGenField.path, formGenField.measurementType),
      transformResponse,
    };

    return <AutocompleteRemote formGenField={formGenFieldAutocomplete} formikProps={formikProps} {...props} />;
  }
);
