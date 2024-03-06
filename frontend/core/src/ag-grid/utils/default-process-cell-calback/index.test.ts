import { ColDef, ProcessCellForExportParams } from '@ag-grid-community/all-modules';

import { defaultProcessCellCallback } from '.';

const colDefs: ColDef[] = [
  {
    field: 'field1',
  },
  {
    field: 'field2',
    valueFormatter: params => params.data.field1 + params.data.field2,
  },
];
const data = {
  field1: 'value1',
  field2: 'value2',
};
const double = jest.fn()();

function buildProcessCellForExportParams(field: string): ProcessCellForExportParams {
  return {
    type: double,
    api: double,
    column: { ...double, getColDef: () => colDefs.find(colDef => colDef.field === field) },
    columnApi: {
      ...double,
      getAllColumns: () =>
        colDefs.map(colDef => ({
          ...double,
          getColDef: () => colDef,
        })),
    },
    context: double,
    node: { ...double, data },
    value: data[field],
  };
}

describe('defaultProcessCellCallback', () => {
  it('returns the value by default', () => {
    const params = buildProcessCellForExportParams('field1');
    expect(defaultProcessCellCallback(params)).toBe('value1');
  });

  it('returns the value from valueFormatter when defined', () => {
    const params = buildProcessCellForExportParams('field2');
    expect(defaultProcessCellCallback(params)).toBe('value1value2');
  });
});
