import { useGetRequest, useSwrAxios } from '@plentyag/core/src/hooks';
import React from 'react';

import { Autocomplete } from '../autocomplete';
import { AutocompleteMultiple } from '../autocomplete-multiple';
import { AutocompleteTypeahead } from '../autocomplete-typeahead';
import { makeOptions, renderFormGenInputAsync } from '../test-helpers';

jest.mock('../autocomplete-multiple');
jest.mock('../autocomplete');
jest.mock('@plentyag/core/src/hooks/use-axios');
jest.mock('@plentyag/core/src/hooks/use-swr-axios');

const MockAutocomplete = Autocomplete as any;
const MockAutocompleteMultiple = AutocompleteMultiple as any;
const mockUseSwrAxios = useSwrAxios as jest.Mock;
const mockUseGetRequest = useGetRequest as jest.Mock;
const makeRequest = jest.fn();

const url = '/fake-url';
const transformResponse = response => response.map(item => ({ label: item.attribute, value: item }));
const getMakeRequestParams = inputValue => ({ queryParams: { streamName: inputValue } });
const response = [
  { id: 1, attribute: 'value1', nested: { attribute: 'nestedValue1' } },
  { id: 2, attribute: 'value2', nested: { attribute: 'nestedValue2' } },
];
const options = makeOptions({ formGenField: { url, transformResponse, getMakeRequestParams } });

describe('AutocompleteTypeahead', () => {
  beforeEach(() => {
    MockAutocomplete.type.mockRestore();
    MockAutocompleteMultiple.type.mockRestore();
    mockUseSwrAxios.mockRestore();
    mockUseGetRequest.mockRestore();
    makeRequest.mockRestore();
  });

  it('renders an Autocomplete component', async () => {
    mockUseSwrAxios.mockReturnValue({ data: undefined, isValidating: false });
    mockUseGetRequest.mockReturnValue({ makeRequest, isLoading: false });
    MockAutocomplete.type.mockImplementation(() => <></>);

    await renderFormGenInputAsync(AutocompleteTypeahead, options());

    expect(MockAutocomplete.type).toHaveBeenCalled();
    expect(MockAutocompleteMultiple.type).not.toHaveBeenCalled();
  });

  it('renders an AutocompleteMultiple component', async () => {
    mockUseSwrAxios.mockReturnValue({ data: undefined, isValidating: false });
    mockUseGetRequest.mockReturnValue({ makeRequest, isLoading: false });
    MockAutocompleteMultiple.type.mockImplementation(() => <></>);

    await renderFormGenInputAsync(
      AutocompleteTypeahead,
      options({ formGenField: { autocompleteProps: { multiple: true } } })
    );

    expect(MockAutocomplete.type).not.toHaveBeenCalled();
    expect(MockAutocompleteMultiple.type).toHaveBeenCalled();
  });

  it('transforms the response of the fetched data into a FormGen.ValueLabel[] array', async () => {
    mockUseSwrAxios.mockReturnValue({ data: response, isValidating: false });
    mockUseGetRequest.mockReturnValue({ makeRequest, isLoading: false });

    MockAutocomplete.type.mockImplementation(({ formGenField }) => {
      expect(formGenField.options).toEqual(response.map(item => ({ label: item.attribute, value: item })));
      return <></>;
    });

    await renderFormGenInputAsync(AutocompleteTypeahead, options());

    expect(MockAutocomplete.type).toHaveBeenCalled();
  });

  it('re-fetch data and refresh options', async () => {
    jest.useFakeTimers();

    const response2 = [
      { id: 3, attribute: 'value3', nested: { attribute: 'nestedValue3' } },
      { id: 4, attribute: 'value4', nested: { attribute: 'nestedValue4' } },
    ];
    makeRequest.mockReturnValue(response);
    mockUseSwrAxios.mockReturnValue({ data: response, isValidating: false });
    mockUseGetRequest.mockImplementation(() => ({ data: makeRequest(), makeRequest, isLoading: false }));

    MockAutocomplete.type.mockImplementation(({ formGenField }) => {
      return (
        <>
          {formGenField.options.map((item, index) => (
            <div key={index} data-testid={`item-${index}`}>
              {item.value.attribute}
            </div>
          ))}
          <button data-testid="button" onClick={() => formGenField.autocompleteProps.onInputChange('', 'test')} />
        </>
      );
    });

    const [{ queryByTestId }] = await renderFormGenInputAsync(AutocompleteTypeahead, options());

    expect(MockAutocomplete.type).toHaveBeenCalled();

    expect(queryByTestId('item-0')).toHaveTextContent(response[0].attribute);
    expect(queryByTestId('item-1')).toHaveTextContent(response[1].attribute);

    makeRequest.mockReturnValue(response2);

    queryByTestId('button').click();

    jest.advanceTimersByTime(500);

    expect(queryByTestId('item-0')).toHaveTextContent(response2[0].attribute);
    expect(queryByTestId('item-1')).toHaveTextContent(response2[1].attribute);
    expect(makeRequest).toHaveBeenCalledWith(getMakeRequestParams('test'));

    jest.useRealTimers();
  });
});
