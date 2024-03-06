import { IFilterParams } from '@ag-grid-community/all-modules';

export interface SelectableItem {
  name: string;
  value: string;
  exclusive?: boolean;
}

export interface SelectionFilterModel {
  filterType: 'selection';
  selectedItems: SelectableItem[];
}

export interface State {
  selectedItems: SelectableItem[]; // selected items but might not be applied yet.
  areItemsApplied: boolean; // true if selected items > 0 and apply button hit or setModel called.
}

export interface ISelectionFilterBase {
  selectableItems: SelectableItem[]; // items that will appear in checkbox list.
  multiple?: boolean; // if true will allow multi-selection.
  disableOrderBy?: boolean; // if true, will disable ordering in the checkbox list.
}

export interface ISelectionFilterParams extends ISelectionFilterBase, IFilterParams {}

export interface ISelectionFilter {
  filter: 'selectionFilter';
  filterParams: ISelectionFilterBase;
}
