import { ColDef } from '@ag-grid-community/all-modules';
import { getEndOfDayISOString, getStartOfDayISOString } from '@plentyag/core/src/utils';

import { isDateFilterModel, isSelectionFilterModel, isTextFilterModel } from '../type-guards';
import { FilterModelItem } from '../types';

/**
 * Return the value of a given FilterModelItem.
 */
export function getFilterValue(filterModelItem: FilterModelItem, colDef?: ColDef) {
  if (isSelectionFilterModel(filterModelItem)) {
    if (colDef && !colDef.filterParams.multiple && filterModelItem.selectedItems.length === 1) {
      return filterModelItem.selectedItems[0].value;
    }
    return filterModelItem.selectedItems.map(item => item.value);
  } else if (isTextFilterModel(filterModelItem)) {
    if (filterModelItem.type === 'blank') {
      return '';
    }
    return filterModelItem?.filter;
  } else if (isDateFilterModel(filterModelItem)) {
    return {
      // it's up to the caller to re-serialize this as they wish.
      dateFrom: getStartOfDayISOString(filterModelItem.dateFrom),
      dateTo: getEndOfDayISOString(filterModelItem.dateTo),
    };
  }
}
