import { ColDef, IServerSideDatasource, IServerSideGetRowsParams } from '@ag-grid-community/all-modules';
import { useLocalStorageQueryParams } from '@plentyag/core/src/ag-grid/hooks';
import { AgGridConfig } from '@plentyag/core/src/ag-grid/types';
import { useGetRequest, usePostRequest } from '@plentyag/core/src/hooks';
import React from 'react';
import { useHistory } from 'react-router-dom';

import { PaginatedList } from '../../types';
import {
  getSortFilterServerParams as _getSortFilterServerParams,
  getLimitAndOffsetQueryParams,
  getSortFilterQueryParams,
  updateUrlQueryParams,
} from '../helpers';

export interface UseAgGridDatasource {
  columnDefs: ColDef[];
  url: string;
  requestMethod?: 'POST' | 'GET';
  onIsLoading?: (isLoading: boolean) => void;
  onDatasourceSuccess?: (result: PaginatedList<unknown>) => void;
  dataInResponsePath?: string;
  totalCountInResponsePath?: string;
  getSortFilterServerParams: AgGridConfig['getSortFilterServerParams'];
  keepQueryParams?: string[];
  extraData?: object;
  persistFilterAndSortModelsInLocalStorage?: boolean;
}

/**
 * Return an AgGrid datasource to query a paginated response whilehandling sorting and filtering Ag Models.
 *
 * @return AgGRid datasource for querying a paginated resources
 */
export function useAgGridDatasource({
  columnDefs,
  onIsLoading,
  onDatasourceSuccess,
  url,
  requestMethod = 'GET',
  getSortFilterServerParams = _getSortFilterServerParams,
  keepQueryParams,
  extraData,
  persistFilterAndSortModelsInLocalStorage = true,
}: UseAgGridDatasource): IServerSideDatasource {
  const { makeRequest: makeGetRequest, isLoading: isLoadingGetRequest } = useGetRequest<PaginatedList<unknown>>({
    url,
  });
  const { makeRequest: makePostRequest, isLoading: isLoadingPostRequest } = usePostRequest<PaginatedList<unknown>, any>(
    { url }
  );

  const isLoading = requestMethod === 'POST' ? isLoadingPostRequest : isLoadingGetRequest;

  const history = useHistory();
  const [, setLocalStorageQueryParams] = useLocalStorageQueryParams();

  const datasource: IServerSideDatasource = {
    getRows: (params: IServerSideGetRowsParams) => {
      function onSuccess(result: PaginatedList<unknown>) {
        params.success({ rowData: result?.data, rowCount: result?.meta?.total });
        onDatasourceSuccess && onDatasourceSuccess(result);
      }

      function onError() {
        params.fail();
      }

      // Update URL Query Params
      const queryParams = getSortFilterQueryParams({
        filterModel: params.request.filterModel,
        sortModel: params.request.sortModel,
        columnDefs,
      });
      updateUrlQueryParams({
        history,
        newQueryParams: queryParams,
        keepQueryParams,
      });
      persistFilterAndSortModelsInLocalStorage && setLocalStorageQueryParams(queryParams);

      // Get data to send to the backend
      const data = getSortFilterServerParams({
        sortModel: params.request.sortModel,
        filterModel: params.request.filterModel,
        columnDefs,
      });

      if (requestMethod === 'POST') {
        makePostRequest({
          data: {
            ...getLimitAndOffsetQueryParams(params.request),
            ...data,
            ...extraData,
          },
          onSuccess,
          onError,
        });
      } else {
        makeGetRequest({
          queryParams: { ...getLimitAndOffsetQueryParams(params.request), ...data, ...extraData },
          onSuccess,
          onError,
        });
      }
    },
  };

  React.useEffect(() => onIsLoading && onIsLoading(isLoading), [isLoading]);

  return datasource;
}
