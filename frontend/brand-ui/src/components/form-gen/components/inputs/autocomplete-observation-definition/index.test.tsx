import React from 'react';

import { AutocompleteObservationDefinition } from '../autocomplete-observation-definition';
import { AutocompleteTypeahead } from '../autocomplete-typeahead';
import { makeOptions, renderFormGenInputAsync } from '../test-helpers';

jest.mock('../autocomplete-typeahead');

const MockAutocompleteTypeahead = AutocompleteTypeahead as any;

const options = makeOptions({ formGenField: { transformResponse: data => data } });
const response = [{ streamName: 'streamName', valueSelector: { value: 'value' } }];

describe('AutocompleteObservationDefinition', () => {
  it('renders a typeahead component', async () => {
    MockAutocompleteTypeahead.type.mockImplementation(({ formGenField }) => {
      expect(formGenField.type).toBe('AutocompleteTypeahead');
      expect(formGenField.url).toBe('/api/derived-observations/observation-definitions');
      expect(formGenField.getMakeRequestParams('test')).toEqual({ queryParams: { streamName: 'test' } });
      expect(formGenField.autocompleteProps).toBeUndefined();
      expect(formGenField.transformResponse(response)).toEqual(
        response.map(item => ({ label: 'streamName', value: item }))
      );

      return <></>;
    });

    await renderFormGenInputAsync(AutocompleteObservationDefinition, options());

    expect(MockAutocompleteTypeahead.type).toBeCalled();
  });

  it('renders a typeahead component with valueSelector', async () => {
    MockAutocompleteTypeahead.type.mockImplementation(({ formGenField }) => {
      expect(formGenField.type).toBe('AutocompleteTypeahead');
      expect(formGenField.url).toBe('/api/derived-observations/observation-definitions');
      expect(formGenField.getMakeRequestParams('test')).toEqual({ queryParams: { streamName: 'test' } });
      expect(formGenField.autocompleteProps).toBeUndefined();
      expect(formGenField.transformResponse(response)).toEqual(
        response.map(item => ({ label: 'streamName', value: item.valueSelector }))
      );

      return <></>;
    });

    await renderFormGenInputAsync(
      AutocompleteObservationDefinition,
      options({ formGenField: { valueSelector: 'valueSelector' } })
    );

    expect(MockAutocompleteTypeahead.type).toBeCalled();
  });

  it('renders a typeahead component with custom autocompleteProps', async () => {
    MockAutocompleteTypeahead.type.mockImplementation(({ formGenField }) => {
      expect(formGenField.type).toBe('AutocompleteTypeahead');
      expect(formGenField.url).toBe('/api/derived-observations/observation-definitions');
      expect(formGenField.getMakeRequestParams('test')).toEqual({ queryParams: { streamName: 'test' } });
      expect(formGenField.autocompleteProps.multiple).toBe(true);

      return <></>;
    });

    await renderFormGenInputAsync(
      AutocompleteObservationDefinition,
      options({ formGenField: { autocompleteProps: { multiple: true } } })
    );

    expect(MockAutocompleteTypeahead.type).toBeCalled();
  });

  it('queries ObservationDefinitions with a window duration', async () => {
    const window = 'FIVE_MINUTES';
    MockAutocompleteTypeahead.type.mockImplementation(({ formGenField }) => {
      expect(formGenField.type).toBe('AutocompleteTypeahead');
      expect(formGenField.url).toBe(`/api/derived-observations/observation-definitions?window=${window}`);
      expect(formGenField.getMakeRequestParams('test')).toEqual({ queryParams: { window, streamName: 'test' } });

      return <></>;
    });

    await renderFormGenInputAsync(AutocompleteObservationDefinition, options({ formGenField: { window } }));

    expect(MockAutocompleteTypeahead.type).toBeCalled();
  });
});
