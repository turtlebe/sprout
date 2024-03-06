import { PaginatedList } from '@plentyag/core/src/types';
import { Schedule } from '@plentyag/core/src/types/environment';
import { getShortenedPath, removeParentPath, toQueryParams } from '@plentyag/core/src/utils';
import { get, sortBy } from 'lodash';
import React from 'react';

import { AutocompleteRemote } from '../autocomplete-remote';
import { memoWithFormikProps } from '../memo-with-formik-props';

export const getSchedulesSearchUrl = (pathContains: string) =>
  `/api/swagger/environment-service/schedules-api/list-schedules${toQueryParams({ pathContains: pathContains + '/' })}`;

interface TransformData {
  parentPath: string;
  valueSelector?: string;
}

export const transformData =
  ({
    valueSelector,
    parentPath,
  }: TransformData): FormGen.FieldSelectRemote<PaginatedList<Schedule>>['transformResponse'] =>
  response => {
    const autocompleteOptions = response?.data?.map(schedule => ({
      label: getShortenedPath(removeParentPath(schedule.path, parentPath)),
      value: get(schedule, valueSelector, schedule),
    }));
    return sortBy(autocompleteOptions, ['label']);
  };

/**
 * FormGen Autocomple Component using {@link AutocompleteRemote} that fetches Schedules based on a Path.
 */
export const AutocompleteSchedule = memoWithFormikProps<FormGen.FieldAutocompleteSchedule>(
  ({ formGenField, formikProps, ...props }) => {
    const { valueSelector, ...otherFormGenFieldProps } = formGenField;
    const transformResponse = transformData({ valueSelector, parentPath: formGenField.path });

    const formGenFieldAutocomplete: FormGen.FieldAutocompleteRemote<PaginatedList<Schedule>> = {
      ...otherFormGenFieldProps,
      type: 'AutocompleteRemote',
      url: getSchedulesSearchUrl(formGenField.path),
      transformResponse,
    };

    return <AutocompleteRemote formGenField={formGenFieldAutocomplete} formikProps={formikProps} {...props} />;
  }
);
