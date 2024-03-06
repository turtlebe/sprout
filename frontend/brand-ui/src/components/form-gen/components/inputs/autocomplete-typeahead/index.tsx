import { useGetRequest, useSwrAxios } from '@plentyag/core/src/hooks';
import React from 'react';
import { useDebounce } from 'react-use';

import { Autocomplete } from '../autocomplete';
import { AutocompleteMultiple } from '../autocomplete-multiple';
import { memoWithFormikProps } from '../memo-with-formik-props';

/**
 * AutocompleteTypeahead allows to pick a certain endpoint, suggestions options from the result of that endpoint and
 * query again the endpoint as the inputValue of the autocomplete changes.
 *
 * It is built on top of Autocomplete and AutocompleteMultiple.
 *
 * We load a first set of options form the `url` attribute. Convert the results into FormGen.ValueLabel[] options.
 * When the input changes, a debounce is executed, the caller can specify whatever parameters they want to send to `makeRequest`
 * through the `getMakeRequestParams` callback. One the response is fetched, the options of the Autocomplete are updated.
 */
export const AutocompleteTypeahead = memoWithFormikProps<FormGen.FieldAutocompleteTypeahead>(
  ({ formGenField, formikProps, ...props }) => {
    const { url, getMakeRequestParams, transformResponse, autocompleteProps, ...otherFormGenFieldProps } = formGenField;
    const [inputValue, setInputValue] = React.useState<string>();
    const { data: initialOptions, isValidating } = useSwrAxios({ url });
    const { data: newOptions, makeRequest, isLoading } = useGetRequest({ url });
    const options: FormGen.ValueLabel[] = React.useMemo(
      () => (newOptions ?? initialOptions ? transformResponse(newOptions ?? initialOptions) : []),
      [newOptions, initialOptions]
    );
    useDebounce(
      () => {
        if (inputValue) {
          makeRequest(getMakeRequestParams(inputValue));
        }
      },
      500,
      [inputValue]
    );

    const autocompleteFormGenFields: FormGen.FieldAutocomplete = {
      ...otherFormGenFieldProps,
      type: 'Autocomplete',
      options,
      autocompleteProps: {
        ...autocompleteProps,
        loading: isValidating || isLoading,
        onInputChange: (_, value) => setInputValue(value),
      },
    };

    const autocompleteMultipleFormGenFields: FormGen.FieldAutocompleteMultiple = {
      ...otherFormGenFieldProps,
      type: 'AutocompleteMultiple',
      options,
      autocompleteProps: {
        ...autocompleteProps,
        loading: isValidating || isLoading,
        onInputChange: (_, value) => setInputValue(value),
      },
    };

    return autocompleteProps?.multiple ? (
      <AutocompleteMultiple formGenField={autocompleteMultipleFormGenFields} formikProps={formikProps} {...props} />
    ) : (
      <Autocomplete formGenField={autocompleteFormGenFields} formikProps={formikProps} {...props} />
    );
  }
);
