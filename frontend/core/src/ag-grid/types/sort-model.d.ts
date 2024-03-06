export interface SortItem {
  colId: string;
  sort: string; // should be: 'asc' | 'desc' but ag-grid instead has 'string' :-(;
}

export type SortModel = SortItem[];
