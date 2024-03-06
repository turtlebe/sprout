import { DateFilterModel } from '@ag-grid-community/all-modules';

import { SelectionFilterModel } from '../custom-filters/selection-filter';
type TextFilterTypes = 'equals' | 'contains' | 'blank' | 'notContains';

export interface TextFilterModel {
  filterType: 'text';
  type: TextFilterTypes;
  filter: string;
}

export type FilterModelItem = TextFilterModel | SelectionFilterModel | DateFilterModel;

export interface FilterModel {
  [key: string]: FilterModelItem;
}
