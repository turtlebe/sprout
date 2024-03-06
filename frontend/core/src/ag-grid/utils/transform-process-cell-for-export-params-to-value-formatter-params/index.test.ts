import { ProcessCellForExportParams } from '@ag-grid-community/all-modules';

import { transformProcessCellForExportParamsToValueFormatterParams } from '.';

const colDef = jest.fn()();
const double = jest.fn()();
const params: ProcessCellForExportParams = {
  type: double,
  api: double,
  column: double,
  columnApi: double,
  context: double,
  node: { ...double, data: double },
  value: double,
};

describe('transformProcessCellForExportParamsToValueFormatterParams', () => {
  it('returns a ValueFormateterParams object', () => {
    expect(transformProcessCellForExportParamsToValueFormatterParams(params, colDef)).toHaveProperty('colDef', colDef);
  });
});
