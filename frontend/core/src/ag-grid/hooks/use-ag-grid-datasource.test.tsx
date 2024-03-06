import { ColDef } from '@ag-grid-community/all-modules';
import { CustomObjectParam } from '@plentyag/core/src/ag-grid/constants';
import { useGetRequest, usePostRequest } from '@plentyag/core/src/hooks/use-axios';
import { PaginatedList } from '@plentyag/core/src/types';
import { act, renderHook } from '@testing-library/react-hooks';
import { createMemoryHistory } from 'history';
import React from 'react';
import { Router } from 'react-router-dom';

import { DEFAULT_CACHE_BLOCK_SIZE } from '../constants';
import { SORT_BY_KEY } from '../helpers';
import { buildServerSideGetRowsParams } from '../test-helpers/build-get-rows-params';
import { mockUseLocalStorageQueryParams } from '../test-helpers/mock-use-local-storage-query-params';

import { useAgGridDatasource, UseAgGridDatasource } from '.';

jest.mock('@plentyag/core/src/hooks/use-axios');

const url = '/api/v1/endpoint';
const mockMakeGetRequest = jest.fn();
const mockUseGetRequest = useGetRequest as jest.Mock;
mockUseGetRequest.mockReturnValue({ makeRequest: mockMakeGetRequest });

const mockMakePostRequest = jest.fn();
const mockUsePostRequest = usePostRequest as jest.Mock;
mockUsePostRequest.mockReturnValue({ makeRequest: mockMakePostRequest });

const { mockSetLocalStorageValue } = mockUseLocalStorageQueryParams();

const mockColumnDefs: ColDef[] = [
  {
    field: 'mockColName',
    colId: 'mockColName',
    filter: 'agTextColumnFilter',
  },
];

const mockTextFilter = { filterType: 'text', type: 'equals', filter: 'filterValue' };

describe('useDeviceAgGridDatasource', () => {
  beforeEach(() => {
    mockMakeGetRequest.mockRestore();
    mockMakePostRequest.mockRestore();
    mockSetLocalStorageValue.mockClear();
  });

  function renderUseAgGridDatasourceHook({
    requestMethod,
    initialPath = '/',
    keepQueryParams,
    persistFilterAndSortModelsInLocalStorage,
    getSortFilterServerParams = undefined,
    onDatasourceSuccess = undefined,
    extraData,
  }: {
    requestMethod?: UseAgGridDatasource['requestMethod'];
    initialPath?: string;
    keepQueryParams?: UseAgGridDatasource['keepQueryParams'];
    persistFilterAndSortModelsInLocalStorage?: UseAgGridDatasource['persistFilterAndSortModelsInLocalStorage'];
    getSortFilterServerParams?: UseAgGridDatasource['getSortFilterServerParams'];
    onDatasourceSuccess?: UseAgGridDatasource['onDatasourceSuccess'];
    extraData?: UseAgGridDatasource['extraData'];
  } = {}) {
    const history = createMemoryHistory({ initialEntries: [initialPath] });
    const wrapper = ({ children }) => <Router history={history}>{children}</Router>;
    const params = buildServerSideGetRowsParams({
      filters: { mockColName: { filterType: 'text', type: 'equals', filter: 'filterValue' } },
      sortBy: { mockColName: 'asc' },
      startRow: 200,
    });

    const { result } = renderHook(
      () =>
        useAgGridDatasource({
          columnDefs: mockColumnDefs,
          onIsLoading: jest.fn(),
          onDatasourceSuccess,
          url,
          requestMethod,
          getSortFilterServerParams,
          keepQueryParams,
          persistFilterAndSortModelsInLocalStorage,
          extraData,
        }),
      { wrapper }
    );

    act(() => result.current.getRows(params));

    return history;
  }

  it('queries with limit, offset, sort and filters', () => {
    renderUseAgGridDatasourceHook();

    expect(mockMakeGetRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        queryParams: {
          limit: 100,
          offset: 200,
          [SORT_BY_KEY]: 'mockColName',
          order: 'asc',
          mockColName: 'filterValue',
        },
        onError: expect.any(Function),
        onSuccess: expect.any(Function),
      })
    );
  });

  it('persists sort and filters in the URL as query parameters and saves to localStorage', () => {
    const history = renderUseAgGridDatasourceHook();

    const filterAndSortState = {
      [SORT_BY_KEY]: 'mockColName',
      order: 'asc',
      mockColName: CustomObjectParam.encode(mockTextFilter),
    };
    const search = new URLSearchParams(filterAndSortState).toString();

    expect(mockMakeGetRequest).toHaveBeenCalledTimes(1);
    expect(history.location.search).toBe(`?${search}`);

    expect(mockSetLocalStorageValue).toHaveBeenCalledWith(filterAndSortState);
  });

  it('does not persist sort and filter models to localStorage', () => {
    renderUseAgGridDatasourceHook({ persistFilterAndSortModelsInLocalStorage: false });
    expect(mockSetLocalStorageValue).not.toHaveBeenCalled();
  });

  it('uses "usePostRequest" when method type is "POST"', () => {
    const history = renderUseAgGridDatasourceHook({ requestMethod: 'POST' });

    expect(mockMakeGetRequest).not.toHaveBeenCalled();
    expect(mockMakePostRequest).toHaveBeenCalledTimes(1);
    expect(mockMakePostRequest).toHaveBeenCalledWith({
      data: {
        limit: DEFAULT_CACHE_BLOCK_SIZE,
        mockColName: 'filterValue',
        offset: 200,
        order: 'asc',
        [SORT_BY_KEY]: 'mockColName',
      },
      onError: expect.anything(),
      onSuccess: expect.anything(),
    });
    expect(decodeURI(history.location.search)).toBe(
      `?${SORT_BY_KEY}=mockColName&order=asc&mockColName=${CustomObjectParam.encode(mockTextFilter)}`
    );
  });

  it('allows to pass extra "data"', () => {
    const extraData = { extraKey: 'extraValue' };
    renderUseAgGridDatasourceHook({ requestMethod: 'POST', extraData });

    expect(mockMakeGetRequest).not.toHaveBeenCalled();
    expect(mockMakePostRequest).toHaveBeenCalledTimes(1);
    expect(mockMakePostRequest).toHaveBeenCalledWith({
      data: {
        limit: DEFAULT_CACHE_BLOCK_SIZE,
        mockColName: 'filterValue',
        offset: 200,
        order: 'asc',
        [SORT_BY_KEY]: 'mockColName',
        ...extraData,
      },
      onError: expect.anything(),
      onSuccess: expect.anything(),
    });
  });

  it('uses "useGetRquest" when method type is "GET"', () => {
    const history = renderUseAgGridDatasourceHook({ requestMethod: 'GET' });
    expect(mockMakePostRequest).not.toHaveBeenCalled();
    expect(mockMakeGetRequest).toHaveBeenCalledTimes(1);
    expect(mockMakeGetRequest).toHaveBeenCalledWith({
      queryParams: {
        limit: DEFAULT_CACHE_BLOCK_SIZE,
        mockColName: 'filterValue',
        offset: 200,
        order: 'asc',
        [SORT_BY_KEY]: 'mockColName',
      },
      onError: expect.anything(),
      onSuccess: expect.anything(),
    });
    expect(history.location.search).toBe(
      `?${SORT_BY_KEY}=mockColName&order=asc&mockColName=${CustomObjectParam.encode(mockTextFilter)}`
    );
  });

  it('allows to pass extra "data" as query parameters', () => {
    const extraData = { extraKey: 'extraValue' };
    renderUseAgGridDatasourceHook({ extraData });

    expect(mockMakePostRequest).not.toHaveBeenCalled();
    expect(mockMakeGetRequest).toHaveBeenCalledTimes(1);
    expect(mockMakeGetRequest).toHaveBeenCalledWith({
      queryParams: {
        limit: DEFAULT_CACHE_BLOCK_SIZE,
        mockColName: 'filterValue',
        offset: 200,
        order: 'asc',
        [SORT_BY_KEY]: 'mockColName',
        ...extraData,
      },
      onError: expect.anything(),
      onSuccess: expect.anything(),
    });
  });

  it('keeps query parameters', () => {
    const history = renderUseAgGridDatasourceHook({
      initialPath: '/?keepMe=thanks',
      keepQueryParams: ['keepMe'],
    });

    expect(mockMakeGetRequest).toHaveBeenCalledTimes(1);
    expect(history.location.search).toBe(
      `?${SORT_BY_KEY}=mockColName&order=asc&mockColName=${CustomObjectParam.encode(mockTextFilter)}&keepMe=thanks`
    );
  });

  it('provides a function to customize sorting/filtering data sent to the server', () => {
    const history = renderUseAgGridDatasourceHook({ getSortFilterServerParams: () => ({ customKey: 'mock-value' }) });
    expect(mockMakePostRequest).not.toHaveBeenCalled();
    expect(mockMakeGetRequest).toHaveBeenCalledTimes(1);
    expect(mockMakeGetRequest).toHaveBeenCalledWith({
      queryParams: {
        limit: DEFAULT_CACHE_BLOCK_SIZE,
        offset: 200,
        customKey: 'mock-value',
      },
      onError: expect.anything(),
      onSuccess: expect.anything(),
    });
    expect(history.location.search).toBe(
      `?${SORT_BY_KEY}=mockColName&order=asc&mockColName=${CustomObjectParam.encode(mockTextFilter)}`
    );
  });

  it('provides a callback to receive new page information', () => {
    const paginatedList: PaginatedList<unknown> = { data: [], meta: { limit: 100, offset: 0, total: 100 } };
    const onDatasourceSuccess = jest.fn();
    mockMakeGetRequest.mockImplementation(({ onSuccess }) => onSuccess(paginatedList));
    renderUseAgGridDatasourceHook({ onDatasourceSuccess });

    expect(onDatasourceSuccess).toHaveBeenCalledWith(paginatedList);
  });

  it('handles missing response', () => {
    const undefinedResponse: PaginatedList<unknown> = undefined;
    const onDatasourceSuccess = jest.fn();
    mockMakeGetRequest.mockImplementation(({ onSuccess }) => onSuccess(undefinedResponse));
    renderUseAgGridDatasourceHook({ onDatasourceSuccess });

    expect(onDatasourceSuccess).toHaveBeenCalledWith(undefinedResponse);
  });
});
