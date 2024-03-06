import { useLogAxiosErrorInSnackbar, useSwrAxios } from '@plentyag/core/src/hooks';
import React from 'react';

import { Autocomplete } from '../autocomplete';
import { AutocompleteMultiple } from '../autocomplete-multiple';
import { memoWithFormikProps } from '../memo-with-formik-props';

export const AutocompleteRemote = memoWithFormikProps<FormGen.FieldAutocompleteRemote<unknown>>(
  ({ formGenField, formikProps, ...props }) => {
    const { url, urlQueryParams, transformResponse, autocompleteProps, ...otherFormGenFieldProps } = formGenField;
    const { data, isValidating, error } = useSwrAxios({ url, params: urlQueryParams });
    useLogAxiosErrorInSnackbar(error);

    const options = React.useMemo(() => (data ? transformResponse(data) : []), [data, transformResponse]);

    const autocompleteFormGenFields: FormGen.FieldAutocomplete = {
      ...otherFormGenFieldProps,
      type: 'Autocomplete',
      options,
      autocompleteProps: {
        ...autocompleteProps,
        loading: isValidating,
      },
    };

    const autocompleteMultipleFormGenFields: FormGen.FieldAutocompleteMultiple = {
      ...otherFormGenFieldProps,
      type: 'AutocompleteMultiple',
      options,
      autocompleteProps: {
        ...autocompleteProps,
        loading: isValidating,
      },
    };

    return autocompleteProps?.multiple ? (
      <AutocompleteMultiple formGenField={autocompleteMultipleFormGenFields} formikProps={formikProps} {...props} />
    ) : (
      <Autocomplete formGenField={autocompleteFormGenFields} formikProps={formikProps} {...props} />
    );
  }
);
