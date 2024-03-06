import { ColDef } from '@ag-grid-community/all-modules';
import { AgGridReactProps } from '@ag-grid-community/react';

import { FilterModel, SortModel } from '.';

export type AgGridConfig = Pick<
  AgGridReactProps,
  | 'cacheBlockSize'
  | 'columnDefs'
  | 'components'
  | 'context'
  | 'immutableData'
  | 'defaultColDef'
  | 'frameworkComponents'
  | 'getRowNodeId'
  | 'modules'
  | 'rowData'
  | 'rowHeight'
  | 'rowModelType'
  | 'rowSelection'
  | 'suppressColumnVirtualisation'
  | 'suppressRowClickSelection'
  | 'blockLoadDebounceMillis'
  | 'applyColumnDefOrder'
  | 'tooltipShowDelay'
  | 'singleClickEdit'
  | 'overlayNoRowsTemplate'
  | 'onRowDragEnd'
  | 'serverSideStoreType'
> & {
  getSortFilterServerParams?: ({
    filterModel,
    sortModel,
    columnDefs,
  }: {
    filterModel: FilterModel;
    sortModel: SortModel;
    columnDefs: ColDef[];
  }) => any;
};
