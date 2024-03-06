type ColDef = import('@ag-grid-community/all-modules').ColDef;
type ColGroupDef = import('@ag-grid-community/all-modules').ColGroupDef;
type ColumnApi = import('@ag-grid-community/all-modules').ColumnApi;
type GridApi = import('@ag-grid-community/all-modules').GridApi;
type ResetGridOptions = import('./interface-types').ResetGridOptions;

declare namespace LT {
  type FilterTypes = 'date' | 'text' | 'selection';

  interface FilterBase {
    filterType: FilterTypes;
  }
  interface FilterModel {
    [fieldName: string]: FilterBase;
  }

  interface DateFilterModel extends FilterBase {
    filterType: 'date';
    dateFrom: string; // 'YYYY-DD-MM'
    dateTo: string; // 'YYYY-DD-MM', used for 'inRange'
    type: 'inRange' | 'greaterThanOrEqual' | 'equals';
  }

  interface TextFilterModel extends FilterBase {
    filterType: 'text';
    filter: string; // text entered by user
    type: 'equals' | 'contains';
  }

  interface SelectableItem {
    name: string;
    value: any;
  }

  interface SelectionFilterModel extends FilterBase {
    filterType: 'selection';
    selectedItems: SelectableItem[];
  }

  type ColumnGroupDef = ColGroupDef[];
  type ColumnDef = ColDef[];

  interface RowData {
    [fieldName: string]: any;
  }

  interface TableApi {
    resetGrid: (option: ResetGridOptions) => void;
    clearSelection: () => void;
    refreshCache: () => void;
    columnApi: ColumnApi; // typically used for testing
    gridApi: GridApi; // typically used for testing
  }

  interface TestTypeFilter {
    sampleTypes: SampleTypeName[];
    testTypes: string[];
    labProviders: string[];
  }

  // location state passed from result view to create view.
  interface ReactRouterLocationState {
    selectedRows: SampleResult[];
    isEdit: boolean;
  }

  type TableApiCallback = (tableApi: TableApi) => void;
}
