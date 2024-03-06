import { useLogAxiosErrorInSnackbar, useSwrAxios } from '@plentyag/core/src/hooks';
import React from 'react';

import { Select } from '../select';
import { makeOptions, renderFormGenInputAsync } from '../test-helpers';

import { SelectRemote } from '.';

jest.mock('@plentyag/core/src/hooks');
jest.mock('@plentyag/brand-ui/src/components/global-snackbar');
jest.mock('../select');

const MockSelect = Select as any;
const mockUseLogAxiosErrorInSnackbar = useLogAxiosErrorInSnackbar as jest.Mock;
const mockUseSwrAxios = useSwrAxios as jest.Mock;

const options = makeOptions({ formGenField: { transformResponse: data => data } });

function mockSelectImplementation(expectedOptions: FormGen.ValueLabel[] = []) {
  MockSelect.type.mockImplementation(({ formGenField }) => {
    expect(formGenField.type).toBe('Select');
    expect(formGenField.name).toBe('mockName');
    expect(formGenField.label).toBe('Mock Label');
    expect(formGenField.options).toEqual(expectedOptions);
    return <></>;
  });
}

describe('SelectRemote', () => {
  beforeEach(() => {
    MockSelect.type.mockRestore();
    mockUseLogAxiosErrorInSnackbar.mockRestore();
    mockUseSwrAxios.mockRestore();
  });

  it('renders an empty select while loading', async () => {
    mockUseSwrAxios.mockReturnValue({ data: undefined, isValidating: true });
    mockSelectImplementation();

    await renderFormGenInputAsync(SelectRemote, options());

    expect.assertions(4);
  });

  it('renders a select with options fetched from a remote endpoint', async () => {
    const data = [
      { label: 'A', value: 'a' },
      { label: 'B', value: 'b' },
    ];
    mockUseSwrAxios.mockReturnValue({ data, isValidating: false });
    mockSelectImplementation(data);

    await renderFormGenInputAsync(SelectRemote, options());

    expect.assertions(4);
  });

  it('shows a snackbar when an error happens while loading', async () => {
    mockUseSwrAxios.mockReturnValue({
      data: undefined,
      isValidating: false,
      error: 'error',
    });
    mockSelectImplementation();

    await renderFormGenInputAsync(SelectRemote, options());

    expect(mockUseLogAxiosErrorInSnackbar).toHaveBeenCalledWith('error');
    expect.assertions(5);
  });
});
