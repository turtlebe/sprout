export function isDateFilterModel(filter: LT.FilterBase): filter is LT.DateFilterModel {
  return filter.filterType === 'date';
}

export function isTextFilterModel(filter: LT.FilterBase): filter is LT.TextFilterModel {
  return filter.filterType === 'text';
}

export function isSelectionFilterModel(filter: LT.FilterBase): filter is LT.SelectionFilterModel {
  return filter.filterType === 'selection';
}
