import { ColDef, ProcessCellForExportParams, ValueFormatterParams } from '@ag-grid-community/all-modules';

export function transformProcessCellForExportParamsToValueFormatterParams(
  params: ProcessCellForExportParams,
  colDef: ColDef
): ValueFormatterParams {
  return {
    api: params.api,
    colDef,
    column: params.column,
    columnApi: params.columnApi,
    context: params.context,
    data: params.node.data,
    node: params.node,
    value: params.value,
  };
}
