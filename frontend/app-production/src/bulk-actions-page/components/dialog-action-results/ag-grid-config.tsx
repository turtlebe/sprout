import { AllCommunityModules } from '@ag-grid-community/all-modules';
import { BaseAgGridClientSideTable } from '@plentyag/brand-ui/src/components';
import { MarkdownExtended } from '@plentyag/brand-ui/src/components/markdown-extended';
import { defaultAgTextContainsColumnFilter } from '@plentyag/core/src/ag-grid/custom-filters/default-text-filters';

import { Container } from '../../types';

const columnDefs: BaseAgGridClientSideTable['agGridConfig']['columnDefs'] = [
  {
    headerName: 'Serial',
    colId: 'serial',
    field: 'serial',
    minWidth: 250,
  },
  {
    headerName: 'Status',
    colId: 'status',
    field: 'status',
    ...defaultAgTextContainsColumnFilter,
    width: 150,
  },
  {
    headerName: 'Message',
    colId: 'message',
    field: 'message',
    autoHeight: true,
    minWidth: 300,
    cellRendererFramework: params => {
      return (
        <span style={{ whiteSpace: 'break-spaces' }}>
          <MarkdownExtended>{params.data.message}</MarkdownExtended>
        </span>
      );
    },
  },
];

export const agGridConfig = (containers: Container[]): BaseAgGridClientSideTable['agGridConfig'] => {
  return {
    defaultColDef: {
      floatingFilter: true,
      sortable: true,
      resizable: true,
      lockPosition: true,
    },
    columnDefs,
    modules: AllCommunityModules,
    rowHeight: 48,
    suppressColumnVirtualisation: true,
    suppressRowClickSelection: true,
    rowData: containers,
    tooltipShowDelay: 500,
    getRowNodeId: data => data?.serial, // unique id for each row.
    immutableData: true,
  };
};
