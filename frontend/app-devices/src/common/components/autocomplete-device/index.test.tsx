import { changeTextField, chooseFromAutocompleteByIndex, openAutocomplete } from '@plentyag/brand-ui/src/test-helpers';
import { useGetRequest } from '@plentyag/core/src/hooks';
import { actAndAwait } from '@plentyag/core/src/test-helpers';
import { render } from '@testing-library/react';
import React from 'react';

import { mockDevices } from '../../test-helpers/devices';

import { AutocompleteDevice, dataTestIdsAutocompleteDevice as dataTestIds } from '.';

jest.mock('@plentyag/core/src/hooks');

const mockUseGetRequest = useGetRequest as jest.Mock;

describe('AutocompleteDevice', () => {
  beforeEach(() => {
    mockUseGetRequest.mockRestore();
  });

  it('shows a list of devices', async () => {
    mockUseGetRequest.mockReturnValue({
      data: mockDevices,
      isLoading: false,
      makeRequest: jest.fn(),
    });

    const handleChange = jest.fn();
    const { queryByTestId, getAllByRole, getByRole } = render(<AutocompleteDevice onChange={handleChange} />);

    const input = queryByTestId(dataTestIds.textField).querySelector('input');

    await actAndAwait(() => openAutocomplete(input));

    expect(getByRole('presentation')).toBeInTheDocument();
    expect(getAllByRole('option')).toHaveLength(mockDevices.length);
  });

  it('does not show options when there is only one device', async () => {
    mockUseGetRequest.mockReturnValue({
      data: [mockDevices[0]],
      isLoading: false,
      makeRequest: jest.fn(),
    });

    const handleChange = jest.fn();
    const { queryByTestId, queryByRole } = render(<AutocompleteDevice onChange={handleChange} />);

    const input = queryByTestId(dataTestIds.textField).querySelector('input');

    await actAndAwait(() => openAutocomplete(input));

    expect(queryByRole('presentation')).not.toBeInTheDocument();
  });

  it('selects a device', async () => {
    mockUseGetRequest.mockReturnValue({
      data: mockDevices,
      isLoading: false,
      makeRequest: jest.fn(),
    });

    const handleChange = jest.fn();
    const { queryByTestId, queryByRole } = render(<AutocompleteDevice onChange={handleChange} />);

    const input = queryByTestId(dataTestIds.textField).querySelector('input');

    await actAndAwait(() => openAutocomplete(input));

    expect(queryByRole('presentation')).toBeInTheDocument();

    await actAndAwait(() => chooseFromAutocompleteByIndex(0));

    expect(queryByRole('presentation')).not.toBeInTheDocument();
    expect(handleChange).toHaveBeenCalledWith(mockDevices[0]);
  });

  it('debounces the query to fetch devices', async () => {
    jest.useFakeTimers();

    const makeRequest = jest.fn().mockImplementation(params => {
      expect(params.queryParams.q).toBe('my-id');
      expect(params.onSuccess).toBeDefined();
      params.onSuccess(mockDevices);
    });
    const handleChange = jest.fn();
    mockUseGetRequest.mockReturnValue({
      data: mockDevices,
      isLoading: false,
      makeRequest,
    });

    const { queryByTestId } = render(<AutocompleteDevice onChange={handleChange} />);

    const input = queryByTestId(dataTestIds.textField).querySelector('input');

    await actAndAwait(() => changeTextField(input, 'my-id'));

    expect(makeRequest).not.toHaveBeenCalled();

    await actAndAwait(() => jest.runAllTimers());

    expect(makeRequest).toHaveBeenCalled();
    expect(handleChange).not.toHaveBeenCalled();
  });

  it('automatically selects the device when there is only one device being returned', async () => {
    jest.useFakeTimers();

    const makeRequest = jest.fn().mockImplementation(params => {
      expect(params.queryParams.q).toBe('my-id');
      expect(params.onSuccess).toBeDefined();
      params.onSuccess([mockDevices[0]]);
    });
    const handleChange = jest.fn();
    mockUseGetRequest.mockReturnValue({
      data: mockDevices,
      isLoading: false,
      makeRequest,
    });

    const { queryByTestId } = render(<AutocompleteDevice onChange={handleChange} />);

    const input = queryByTestId(dataTestIds.textField).querySelector('input');

    await actAndAwait(() => changeTextField(input, 'my-id'));

    expect(makeRequest).not.toHaveBeenCalled();

    await actAndAwait(() => jest.runAllTimers());

    expect(makeRequest).toHaveBeenCalled();
    expect(handleChange).toHaveBeenCalled();
  });
});
