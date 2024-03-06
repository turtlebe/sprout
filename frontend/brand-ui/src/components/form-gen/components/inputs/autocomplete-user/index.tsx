import { User } from '@plentyag/core/src/core-store/types';
import { sortBy } from 'lodash';
import React from 'react';

import { AutocompleteRemote } from '../autocomplete-remote';
import { memoWithFormikProps } from '../memo-with-formik-props';

export const GET_USERS_URL = '/api/core/users';

type TransformUsers = FormGen.FieldSelectRemote<User[]>['transformResponse'];

export const transformUserData: TransformUsers = response => {
  const autocompleteOptions = response.map(user => ({
    label: `${user.firstName} ${user.lastName} (${user.username})`,
    value: user.username,
  }));
  return sortBy(autocompleteOptions, ['label']);
};

/**
 * Provides a selectable list of FarmOS users (displaying first, last and username).
 * The list of users displayed can be filtered down by providing a farmPath and roles.
 */
export const AutocompleteUser = memoWithFormikProps<FormGen.FieldAutocompleteUser>(
  ({ formGenField, formikProps, ...props }) => {
    const { farmPath, roles, ...otherFormGenFieldProps } = formGenField;

    const formGenFieldAutocomplete: FormGen.FieldAutocompleteRemote<User[]> = {
      ...otherFormGenFieldProps,
      type: 'AutocompleteRemote',
      url: GET_USERS_URL,
      urlQueryParams: {
        farmPath,
        roles,
      },
      transformResponse: transformUserData,
    };

    return <AutocompleteRemote formGenField={formGenFieldAutocomplete} formikProps={formikProps} {...props} />;
  }
);
