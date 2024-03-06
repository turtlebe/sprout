import { errorSnackbar, mockGlobalSnackbar } from '@plentyag/brand-ui/src/components/global-snackbar/test-helper';
import { changeTextField } from '@plentyag/brand-ui/src/test-helpers';
import { act, fireEvent, render, waitFor } from '@testing-library/react';
import React from 'react';

import { useSearch } from '../../hooks/use-search';

import { dataTestIds, Search } from '.';

jest.mock('../../hooks/use-search');
const mockUseSearch = useSearch as jest.Mock;

mockGlobalSnackbar();

describe('Search', () => {
  function renderSearch(lastSearchTerm: string, searchError = '') {
    const searchMock = jest.fn();

    mockUseSearch.mockReturnValue([{ lastSearchTerm, searchError }, { search: searchMock }]);

    const renderResult = render(<Search />);

    return { searchMock, ...renderResult };
  }

  function changeInputAndHitReturn(value: string, getByTestId) {
    act(() => {
      changeTextField(dataTestIds.textField, value);
    });

    act(() => {
      fireEvent.keyDown(getByTestId(dataTestIds.textField).querySelector('input'), { key: 'Enter', code: 'Enter' });
    });
  }

  it('shows snackbar error when error searchin for term', () => {
    const lastSearchTerm = 'bad-search-term';
    const searchError = 'ouch';
    renderSearch(lastSearchTerm, searchError);
    expect(errorSnackbar).toHaveBeenCalledWith({ message: `Error searching "${lastSearchTerm}": ${searchError}` });
  });

  it('updates textfield from lastSearchTerm', async () => {
    const { getByTestId } = renderSearch('some-search');
    const input = getByTestId(dataTestIds.textField).querySelector('input');
    await waitFor(() => {
      expect(input.value).toBe('some-search');
    });
  });

  it('performs search again if user hit returns even when input has not changed', async () => {
    const { searchMock, getByTestId } = renderSearch('');
    changeInputAndHitReturn('hello', getByTestId);
    changeInputAndHitReturn('hello', getByTestId);

    await waitFor(() => {
      expect(searchMock).toHaveBeenCalledTimes(2);
    });
  });

  it('calls "search" when new search term entered', async () => {
    const { searchMock, getByTestId } = renderSearch('');

    changeInputAndHitReturn('hello2', getByTestId);

    await waitFor(() => expect(searchMock).toHaveBeenCalledWith('hello2'));
  });
});
