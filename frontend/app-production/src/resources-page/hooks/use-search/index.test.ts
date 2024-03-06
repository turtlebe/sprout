import { actAndAwaitForHook } from '@plentyag/core/src/test-helpers';
import { axiosRequest } from '@plentyag/core/src/utils/request';
import { act, renderHook } from '@testing-library/react-hooks';
import axios from 'axios';

import {
  defaultTowerCycleResponse,
  mockResult,
  mockResultContainerOnly,
  mockResultMaterialOnly,
  mockResultWithChildren,
} from '../../components/search/mock-search-result';

import { SearchActions, SearchState, useSearch } from '.';

import { getStateByIdUrl } from './actions';
import { initialState } from './state';

jest.mock('@plentyag/core/src/utils/request');
const mockAxiosRequest = axiosRequest as jest.Mock;

describe('useSearch', () => {
  beforeEach(() => {
    mockAxiosRequest.mockReset();
  });

  it('has default values', () => {
    const { result } = renderHook(() => useSearch<SearchState, SearchActions>());
    const state = result.current[0];
    expect(state).toEqual(initialState);
  });

  async function expectSearchToReturnResult(searchTerm: string, searchResult: ProdResources.ResourceState) {
    mockAxiosRequest.mockResolvedValue({ data: searchResult });

    const { result, waitForNextUpdate } = renderHook(() => useSearch<SearchState, SearchActions>());

    const actions = result.current[1];

    void act(() => {
      actions.search(searchTerm);
    });

    expect(result.current[0]).toEqual({
      lastSearchTerm: searchTerm,
      isSearching: true,
      searchResult: null,
      searchError: null,
      cancellationSource: expect.anything(),
    });

    await waitForNextUpdate();

    expect(result.current[0]).toEqual({
      lastSearchTerm: searchTerm,
      isSearching: false,
      searchResult: searchResult,
      searchError: null,
      cancellationSource: expect.anything(),
    });
  }

  it('performs search', async () => {
    await expectSearchToReturnResult('my-search', mockResult);

    // test case for crash seen in: https://plentyag.atlassian.net/browse/SD-26235
    await expectSearchToReturnResult(mockResultMaterialOnly.id, mockResultMaterialOnly);

    await expectSearchToReturnResult(mockResultContainerOnly.id, mockResultContainerOnly);
  });

  it('refreshes last search result', async () => {
    mockAxiosRequest.mockResolvedValueOnce({ data: mockResult });
    mockAxiosRequest.mockResolvedValueOnce({ data: defaultTowerCycleResponse });

    const { result } = renderHook(() => useSearch<SearchState, SearchActions>());

    const actions = result.current[1];

    await actAndAwaitForHook(() => actions.search('my-search'));

    expect(result.current[0]).toEqual({
      lastSearchTerm: 'my-search',
      isSearching: false,
      searchResult: mockResult,
      searchError: null,
      cancellationSource: expect.anything(),
    });

    expect(result.current[0].searchResult.towerCycles).toBeDefined();
    expect(result.current[0].searchResult.towerCycles).toBe(100);

    mockAxiosRequest.mockResolvedValueOnce({ data: mockResultWithChildren });
    mockAxiosRequest.mockResolvedValueOnce({ data: defaultTowerCycleResponse });

    await actAndAwaitForHook(() => actions.refreshSearch());

    expect(result.current[0]).toEqual({
      lastSearchTerm: 'my-search',
      isSearching: false,
      searchResult: mockResultWithChildren,
      searchError: null,
      cancellationSource: expect.anything(),
    });

    expect(result.current[0].searchResult.towerCycles).not.toBeDefined();
  });

  it('clears search when searching emtpy term', async () => {
    mockAxiosRequest.mockResolvedValueOnce({ data: mockResult });

    const { result } = renderHook(() => useSearch<SearchState, SearchActions>());

    const actions = result.current[1];

    await actAndAwaitForHook(() => actions.search(''));

    expect(result.current[0]).toEqual({
      cancellationSource: null,
      lastSearchTerm: '',
      isSearching: false,
      searchResult: null,
      searchError: null,
    });
  });

  it('gives error if search fails', async () => {
    mockAxiosRequest.mockRejectedValue({ response: { data: { message: { error: 'ouch' } } } });

    const { result } = renderHook(() => useSearch<SearchState, SearchActions>());

    const actions = result.current[1];

    await actAndAwaitForHook(() => actions.search('bad-search'));

    expect(result.current[0]).toEqual({
      cancellationSource: expect.anything(),
      lastSearchTerm: 'bad-search',
      isSearching: false,
      searchResult: null,
      searchError: 'ouch',
    });
  });

  it('sets a new search result', () => {
    const { result } = renderHook(() => useSearch<SearchState, SearchActions>());

    const actions = result.current[1];

    void act(() => actions.setSearch(mockResult, 'test-search'));

    expect(result.current[0]).toEqual({
      lastSearchTerm: 'test-search',
      isSearching: false,
      searchResult: mockResult,
      searchError: null,
      cancellationSource: null,
    });
  });

  it('cancels in progress search when new search starts', async () => {
    mockAxiosRequest.mockImplementation(async config => {
      return axios.create(config).request(config);
    });

    // use fake xhr so we can test that axios cancel is working and
    // implemented properly in search action.
    class FakeXhrClass {
      private readyState = 0;
      private readonly onreadystatechange: () => {};
      private status = 0;
      private responseText = null;
      private url = null;
      public open(method: string, url: string) {
        this.url = url;
      }
      public abort() {
        expect(this.url).toBe(getStateByIdUrl('first-search'));
      }
      public send() {
        this.readyState = 4;
        this.status = 200;
        // fake response depending on url provided in open.
        if (this.url === getStateByIdUrl('second-search')) {
          this.responseText = mockResult;
        } else {
          this.responseText = mockResultWithChildren;
        }
        this.onreadystatechange();
      }
    }

    const origXhr = window.XMLHttpRequest;
    // @ts-ignore
    window.XMLHttpRequest = FakeXhrClass;

    const { result, waitForNextUpdate } = renderHook(() => useSearch<SearchState, SearchActions>());

    const actions = result.current[1];

    // first-search will get canceled, since second search comes right after.
    void act(() => {
      actions.search('first-search');
      actions.search('second-search');
    });

    await waitForNextUpdate();

    expect(result.current[0]).toEqual({
      lastSearchTerm: 'second-search',
      isSearching: false,
      searchResult: mockResult,
      searchError: null,
      cancellationSource: expect.anything(),
    });

    expect.assertions(2);

    window.XMLHttpRequest = origXhr;
  });

  it('resets to initialState', () => {
    const { result } = renderHook(() => useSearch<SearchState, SearchActions>());

    const actions = result.current[1];

    void act(() => actions.setSearch(mockResult, 'test-search'));

    expect(result.current[0]).toEqual({
      lastSearchTerm: 'test-search',
      isSearching: false,
      searchResult: mockResult,
      searchError: null,
      cancellationSource: null,
    });

    void act(() => actions.resetSearch());

    expect(result.current[0]).toEqual(initialState);
  });
});
