import { ProcessCellForExportParams } from '@ag-grid-community/all-modules';

import { transformProcessCellForExportParamsToValueFormatterParams } from '..';

export function defaultProcessCellCallback(params: ProcessCellForExportParams): string {
  const colDef = params.columnApi
    .getAllColumns()
    .map(col => col.getColDef())
    .find(
      col =>
        (col.field && params.column.getColDef().field === col.field) ||
        (col.colId && params.column.getColDef().colId === col.colId)
    );
  const valueFormatterParams = transformProcessCellForExportParamsToValueFormatterParams(params, colDef);

  return colDef.valueFormatter && typeof colDef.valueFormatter !== 'string'
    ? colDef.valueFormatter(valueFormatterParams)
    : params.value;
}
