import { ColDef } from '@ag-grid-community/all-modules';
import { CustomObjectParam } from '@plentyag/core/src/ag-grid/constants';
import {
  DecodedValueMap,
  encodeQueryParams,
  JsonParam,
  ObjectParam,
  QueryParamConfigMap,
} from 'serialize-query-params';

import { isDateFilterModel, isSelectionFilterModel, isTextFilterModel } from '../type-guards';
import { FilterModel } from '../types';

/**
 * Serialize given filterModel into URL query parameters.
 * @param filterModel The ag-grid filter model to be serialized.
 * @param columnDefs Current column definitons.
 * @returns Query parameters containing serialize filterModel.
 */
export function getFilteringQueryParams(filterModel: FilterModel, columnDefs: ColDef[]) {
  if (Object.keys(filterModel).length === 0) {
    return {};
  }

  const queryParamMap: QueryParamConfigMap = {};
  columnDefs.forEach(colDef => {
    if (colDef.filter === 'agDateColumnFilter') {
      queryParamMap[colDef.colId] = ObjectParam;
    }
    if (colDef.filter === 'selectionFilter') {
      queryParamMap[colDef.colId] = JsonParam;
    }
    if (colDef.filter === 'agTextColumnFilter') {
      queryParamMap[colDef.colId] = CustomObjectParam;
    }
  });

  const filterModelToEncode: DecodedValueMap<QueryParamConfigMap> = {};
  Object.keys(filterModel).forEach(colKey => {
    const model = filterModel[colKey];
    if (isSelectionFilterModel(model) || isTextFilterModel(model) || isDateFilterModel(model)) {
      filterModelToEncode[colKey] = model;
    }
  });

  return encodeQueryParams(queryParamMap, filterModelToEncode);
}
