import { DateFilterModel } from '@ag-grid-community/all-modules';

import { SelectionFilterModel } from './custom-filters/selection-filter';
import { TextFilterModel } from './types/filter-model';

export function isSelectionFilterModel(filter: any): filter is SelectionFilterModel {
  return filter.filterType === 'selection';
}

export function isTextFilterModel(filter: any): filter is TextFilterModel {
  return filter?.filterType === 'text';
}

export function isDateFilterModel(filter: any): filter is DateFilterModel {
  return filter.filterType === 'date';
}
