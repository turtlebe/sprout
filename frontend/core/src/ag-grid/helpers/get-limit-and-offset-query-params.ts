import { IServerSideGetRowsRequest } from '@ag-grid-community/all-modules';

import { DEFAULT_CACHE_BLOCK_SIZE } from '../constants';

interface LimitOffsetQueryParams {
  limit: number;
  offset: number;
}

/**
 * Return limit and offset pagination query params based on AgGrid datasource data.
 *
 * @param params AgGrid datasource params
 * @return Limit and offset query params
 */
export function getLimitAndOffsetQueryParams(params: IServerSideGetRowsRequest): LimitOffsetQueryParams {
  return {
    limit: DEFAULT_CACHE_BLOCK_SIZE,
    offset: params.startRow,
  };
}
