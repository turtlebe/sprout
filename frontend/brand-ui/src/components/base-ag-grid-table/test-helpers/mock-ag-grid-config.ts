import { AllCommunityModules } from '@ag-grid-community/all-modules';
import { defaultAgTextContainsColumnFilter } from '@plentyag/core/src/ag-grid/custom-filters/default-text-filters';

export const mockAgGridConfig = {
  columnDefs: [
    {
      sortable: true,
      headerName: 'testcol1',
      field: 'col1',
      colId: 'col1',
      ...defaultAgTextContainsColumnFilter,
    },
    {
      sortable: true,
      headerName: 'testcol2',
      field: 'col2',
      colId: 'col2',
      ...defaultAgTextContainsColumnFilter,
    },
  ],
  rowModelType: 'clientSide',
  modules: AllCommunityModules,
  rowData: [
    { col1: 1, col2: 2 },
    { col1: 3, col2: 4 },
  ],
};
