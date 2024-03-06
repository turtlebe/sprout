import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model';
import { ModuleRegistry } from '@ag-grid-community/core';
import { MasterDetailModule } from '@ag-grid-enterprise/master-detail';
import { BaseAgGridClientSideTable } from '@plentyag/brand-ui/src/components/base-ag-grid-table';
import React from 'react';

import { useStyles } from './styles';

ModuleRegistry.registerModules([ClientSideRowModelModule, MasterDetailModule]);

export interface UseExtendAgGridExpandableRow {
  agGridConfig: BaseAgGridClientSideTable['agGridConfig'];
  renderExpandableRow: (props: any) => JSX.Element;
  expandedRowHeight?: number;
}

/**
 * Extend the ag-grid config to include an extra row underneath
 *
 * To use this hook, you must already created an AG Grid Config for the base AG Grid Table. This
 * hook will accept your agGridConfig and extend the object to contain the settings to introduce
 * the expandable row beneath each current row.  The hook will return a new AG Grid Config that you
 * will pass down to your base AG Grid Table.  Use the `renderExpandableRow` as your expandable row
 * component.  Row data will be passed down to that component.
 *
 * @param {UseExtendAgGridExpandableRow} agGridExpandableRow
 * @returns {BaseAgGridClientSideTable['agGridConfig']}
 */
export const useExtendedAgGridWithExpandableRows = ({
  agGridConfig,
  expandedRowHeight,
  renderExpandableRow,
}: UseExtendAgGridExpandableRow): BaseAgGridClientSideTable['agGridConfig'] => {
  useStyles({});

  const newAgGridConfig = {
    ...agGridConfig,

    // enable master detail
    masterDetail: true,

    // insert first row with the "expandable icon"
    columnDefs: React.useMemo(
      () => [
        {
          headerName: '',
          field: 'expandableControl',
          colId: 'expandableControl',
          cellRenderer: 'agGroupCellRenderer',
          maxWidth: 50,
          valueGetter: () => ' ',
        },
        ...(agGridConfig.columnDefs ?? []),
      ],
      [agGridConfig]
    ),

    // detail height
    detailRowHeight: expandedRowHeight,

    // custom expanded detail
    frameworkComponents: {
      ...(agGridConfig.frameworkComponents || {}),
      detailCellRenderer: row => {
        return renderExpandableRow(row);
      },
    },
    detailCellRenderer: 'detailCellRenderer',
  };

  return newAgGridConfig;
};
