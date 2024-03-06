import { renderHook } from '@testing-library/react-hooks';
import { createMemoryHistory } from 'history';
import React from 'react';
import { Router } from 'react-router-dom';

import { useSearch } from '../use-search';

import { useSearchQueryParameter } from '.';

jest.mock('../use-search');
const mockUseSearch = useSearch as jest.Mock;

describe('useSearchQueryParameter', () => {
  function renderUseSearchQueryParameter(lastSearchTerm: string, searchTermQuery: string) {
    const searchMock = jest.fn();
    mockUseSearch.mockReturnValue([lastSearchTerm, { search: searchMock }]);

    const path = `/production/resources/info?q=${searchTermQuery}`;
    const history = createMemoryHistory({ initialEntries: [path] });

    const wrapper = ({ children }) => <Router history={history}>{children}</Router>;

    renderHook(() => useSearchQueryParameter(), { wrapper });

    return { history, searchMock };
  }

  it('performs search when query parameters updates', () => {
    const searchTermQuery = 'some-search-term';

    const { searchMock } = renderUseSearchQueryParameter('', searchTermQuery);

    expect(searchMock).toHaveBeenCalledWith(searchTermQuery);
  });

  it('does not perform search when query parameter and lastSearchTerm are equal', () => {
    const searchTermQuery = 'some-search-term2';
    const lastSearchTerm = searchTermQuery;

    const { searchMock } = renderUseSearchQueryParameter(lastSearchTerm, searchTermQuery);

    expect(searchMock).not.toHaveBeenCalled();
  });

  it('updates query parameter when lastSearchTerm changes', () => {
    const lastSearchTerm = 'some-search-term3';

    const { history } = renderUseSearchQueryParameter(lastSearchTerm, '');

    expect(history.location.search).toBe(`?q=${lastSearchTerm}`);
  });
});
