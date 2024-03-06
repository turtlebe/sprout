import { render, waitForElementToBeRemoved } from '@testing-library/react';
import { cloneDeep } from 'lodash';
import React from 'react';

import { useSearch } from '../../hooks/use-search';
import { mockResult } from '../search/mock-search-result';

import { dataTestids, SearchRefreshButton } from '.';

jest.mock('../../hooks/use-search');
const mockUseSearch = useSearch as jest.Mock;

describe('SearchRefreshButton', () => {
  it('renders null when no searchResult is provided', () => {
    mockUseSearch.mockReturnValue([null, { refreshSearch: () => {} }]);
    const { container } = render(<SearchRefreshButton />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders null when searchResult isLatest is false', () => {
    const mockSearchResultHistoric = cloneDeep(mockResult);
    mockSearchResultHistoric.isLatest = false;
    mockUseSearch.mockReturnValue([mockSearchResultHistoric, { refreshSearch: () => {} }]);
    const { container } = render(<SearchRefreshButton />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders refresh button and invokes doRefresh when refresh button is clicked', async () => {
    const mockDoRefresh = jest.fn();
    mockUseSearch.mockReturnValue([mockResult, { refreshSearch: mockDoRefresh }]);

    const { queryByTestId } = render(<SearchRefreshButton />);

    expect(queryByTestId(dataTestids.loader)).toBeInTheDocument();

    await waitForElementToBeRemoved(queryByTestId(dataTestids.loader), { timeout: 2500 });

    queryByTestId(dataTestids.button).click();

    expect(mockDoRefresh).toHaveBeenCalled();
  });
});
