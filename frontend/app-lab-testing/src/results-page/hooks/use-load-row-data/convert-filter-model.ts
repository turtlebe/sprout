import { getEndOfDayISOString, getStartOfDayISOString } from '@plentyag/core/src/utils';

import { cols } from '../../table-cols';
import { convertAgGridDateTimeToDate } from '../../utils';
import { isDateFilterModel, isSelectionFilterModel, isTextFilterModel } from '../../utils/type-guards';

import { colsToQueryParam } from './cols-to-query-params';

function handleDateFilter(col: cols, filter: LT.FilterBase) {
  const queryParams = {};
  const mapper = colsToQueryParam.get(col);
  if (mapper && isDateFilterModel(filter)) {
    const startField = mapper.start;
    switch (filter.type) {
      case 'inRange':
        queryParams[startField] = getStartOfDayISOString(filter.dateFrom);
        const endField = mapper.end;
        if (endField) {
          queryParams[endField] = getEndOfDayISOString(filter.dateTo);
        }
        break;
      case 'greaterThanOrEqual':
        queryParams[startField] = getStartOfDayISOString(filter.dateFrom);
        break;
      case 'equals':
        queryParams[startField] = convertAgGridDateTimeToDate(filter.dateFrom);
        break;
    }
  }
  return queryParams;
}

function handleTextFilter(field: cols, filterBase: LT.FilterBase) {
  const queryParams = {};
  if (isTextFilterModel(filterBase)) {
    const mapper = colsToQueryParam.get(field);
    if (mapper && (filterBase.type === 'equals' || filterBase.type === 'contains')) {
      queryParams[mapper.start] = mapper.filterFormatter
        ? mapper.filterFormatter(filterBase.filter)
        : filterBase.filter;
    }
  }
  return queryParams;
}

function handleSelectionFilter(field: cols, filter: LT.FilterBase) {
  const queryParams = {};
  const mapper = colsToQueryParam.get(field);
  if (mapper && isSelectionFilterModel(filter)) {
    queryParams[mapper.start] = filter.selectedItems
      .map(item => {
        // for selection item that has empty item option - send string with
        // empty string, so backend actually gets empty string rather than nothing.
        if (item.value === '') {
          return '""';
        }
        return item.value;
      })
      .join(',');
  }
  return queryParams;
}

export function convertFilterModelIntoQueryParameters(filterModel: LT.FilterModel) {
  let queryParams = {};
  Object.keys(filterModel).forEach(field => {
    const filter = filterModel[field];
    const fieldEnum = field as cols;
    if (colsToQueryParam.has(fieldEnum)) {
      const dateParms = handleDateFilter(fieldEnum, filter);
      const textParms = handleTextFilter(fieldEnum, filter);
      const selectionParms = handleSelectionFilter(fieldEnum, filter);
      queryParams = { ...queryParams, ...dateParms, ...textParms, ...selectionParms };
    }
  });
  return queryParams;
}
