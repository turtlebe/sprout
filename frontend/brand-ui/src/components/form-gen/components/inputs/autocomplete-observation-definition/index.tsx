import { BaseObservationDefinition, DerivedObservationDefinition } from '@plentyag/core/src/types/derived-observations';
import { toQueryParams } from '@plentyag/core/src/utils';
import { get } from 'lodash';

import { AutocompleteTypeahead } from '../autocomplete-typeahead';
import { memoWithFormikProps } from '../memo-with-formik-props';

/**
 * Autocomplete that lets the user choose a BaseObservationDefinition or DerivedObservationDefinition.
 *
 * This input is based on AutocompleteTypeahead, meaning that when the user type in the input, a query is made to backend to fetch new results.
 */
export const AutocompleteObservationDefinition = memoWithFormikProps<FormGen.FieldAutocompleteObservationDefinition>(
  ({ formGenField, formikProps, ...props }) => {
    const { valueSelector, window, ...otherFormGenFieldProps } = formGenField;

    const formGenFieldAutocompelteTypeahead: FormGen.FieldAutocompleteTypeahead<
      (BaseObservationDefinition | DerivedObservationDefinition)[]
    > = {
      ...otherFormGenFieldProps,
      type: 'AutocompleteTypeahead',
      url: `/api/derived-observations/observation-definitions${toQueryParams({ window })}`,
      transformResponse: response =>
        response.map(option => ({
          label: get(option, 'streamName'),
          value: get(option, valueSelector, option),
        })),
      getMakeRequestParams: inputValue => ({ queryParams: { window, streamName: inputValue } }),
    };

    return (
      <AutocompleteTypeahead formGenField={formGenFieldAutocompelteTypeahead} formikProps={formikProps} {...props} />
    );
  }
);
