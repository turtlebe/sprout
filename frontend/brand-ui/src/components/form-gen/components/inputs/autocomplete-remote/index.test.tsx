import { useLogAxiosErrorInSnackbar, useSwrAxios } from '@plentyag/core/src/hooks';
import React from 'react';

import { Autocomplete } from '../autocomplete';
import { AutocompleteMultiple } from '../autocomplete-multiple';
import { makeOptions, renderFormGenInputAsync } from '../test-helpers';

import { AutocompleteRemote } from '.';

jest.mock('@plentyag/core/src/hooks');
jest.mock('@plentyag/brand-ui/src/components/global-snackbar');
jest.mock('../autocomplete');
jest.mock('../autocomplete-multiple');

const MockAutocomplete = Autocomplete as any;
const MockAutocompleteMultiple = AutocompleteMultiple as any;
const mockUseLogAxiosErrorInSnackbar = useLogAxiosErrorInSnackbar as jest.Mock;
const mockUseSwrAxios = useSwrAxios as jest.Mock;

const options = makeOptions({ formGenField: { transformResponse: data => data } });

function mockAutocompleteImplementation(expectedOptions: FormGen.ValueLabel[] = []) {
  MockAutocomplete.type.mockImplementation(({ formGenField }) => {
    expect(formGenField.type).toBe('Autocomplete');
    expect(formGenField.name).toBe('mockName');
    expect(formGenField.label).toBe('Mock Label');
    expect(formGenField.options).toEqual(expectedOptions);
    return <></>;
  });
}

function mockAutocompleteMultipleImplementation(expectedOptions: FormGen.ValueLabel[] = []) {
  MockAutocompleteMultiple.type.mockImplementation(({ formGenField }) => {
    expect(formGenField.type).toBe('AutocompleteMultiple');
    expect(formGenField.name).toBe('mockName');
    expect(formGenField.label).toBe('Mock Label');
    expect(formGenField.options).toEqual(expectedOptions);
    return <div data-testid="mock-auto-complete-multiple" />;
  });
}

describe('AutocompleteRemote', () => {
  beforeEach(() => {
    MockAutocomplete.type.mockRestore();
    MockAutocompleteMultiple.type.mockRestore();
    mockUseLogAxiosErrorInSnackbar.mockRestore();
    mockUseSwrAxios.mockRestore();
  });

  it('renders an empty select while loading', async () => {
    mockUseSwrAxios.mockReturnValue({
      data: undefined,
      isValidating: true,
    });

    mockAutocompleteImplementation();

    await renderFormGenInputAsync(AutocompleteRemote, options());

    expect.assertions(4);
  });

  it('renders a select with options fetched from a remote endpoint', async () => {
    const data = [
      { label: 'A', value: 'a' },
      { label: 'B', value: 'b' },
    ];
    mockUseSwrAxios.mockReturnValue({ data, isValidating: false });
    mockAutocompleteImplementation(data);

    await renderFormGenInputAsync(AutocompleteRemote, options());

    expect.assertions(4);
  });

  it('shows a snackbar when an error happens while loading', async () => {
    mockUseSwrAxios.mockReturnValue({
      data: undefined,
      isValidating: false,
      error: 'error',
    });
    mockAutocompleteImplementation();

    await renderFormGenInputAsync(AutocompleteRemote, options());

    expect(mockUseLogAxiosErrorInSnackbar).toHaveBeenCalledWith('error');
    expect.assertions(5);
  });

  it('uses "AutocompleteMultiple" when "multiple" prop is true', async () => {
    const data = [
      { label: 'A', value: 'a' },
      { label: 'B', value: 'b' },
    ];
    mockUseSwrAxios.mockReturnValue({ data, isValidating: false });

    const options = makeOptions({
      formGenField: { transformResponse: data => data, autocompleteProps: { multiple: true } },
    });

    mockAutocompleteMultipleImplementation(data);

    const [{ queryByTestId }] = await renderFormGenInputAsync(AutocompleteRemote, options());

    expect(queryByTestId('mock-auto-complete-multiple')).toBeInTheDocument();

    expect.assertions(5);
  });
});
