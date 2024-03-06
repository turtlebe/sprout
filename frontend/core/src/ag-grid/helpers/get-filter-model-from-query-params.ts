import { ColDef } from '@ag-grid-community/all-modules';
import { CustomObjectParam } from '@plentyag/core/src/ag-grid/constants';
import {
  decodeQueryParams,
  EncodedValueMap,
  JsonParam,
  ObjectParam,
  QueryParamConfigMap,
} from 'serialize-query-params';

import { FilterModel } from '../types';

/**
 * Deserialize given query parameters into a FilterModel.
 * @param queryParams URL query parameters
 * @param columnDefs Current column definitons
 * @return An instance of AgGrid FilterModel
 */
export function getFilterModelFromQueryParams(queryParams: URLSearchParams, columnDefs: ColDef[]): FilterModel {
  const queryParamMap: QueryParamConfigMap = {};
  const encodedQuery: EncodedValueMap<QueryParamConfigMap> = {};

  columnDefs.forEach(colDef => {
    if (!queryParams.has(colDef.colId)) {
      return;
    }
    const queryParamValue = queryParams.get(colDef.colId);
    if (colDef.filter === 'agDateColumnFilter') {
      queryParamMap[colDef.colId] = ObjectParam;
      encodedQuery[colDef.colId] = queryParamValue;
    }
    if (colDef.filter === 'selectionFilter') {
      queryParamMap[colDef.colId] = JsonParam;
      encodedQuery[colDef.colId] = queryParamValue;
    }
    if (colDef.filter === 'agTextColumnFilter') {
      queryParamMap[colDef.colId] = CustomObjectParam;
      encodedQuery[colDef.colId] = queryParamValue;
    }
  });

  return decodeQueryParams(queryParamMap, encodedQuery);
}
