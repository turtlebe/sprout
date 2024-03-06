import { AllCommunityModules, ColumnPinnedEvent, GridReadyEvent, RowNode } from '@ag-grid-community/all-modules';
import { AgGridReact } from '@ag-grid-community/react';
import React from 'react';

import { ManualStatusRenderer } from '../../../common/components/table-renderers/status/manual-status-renderer';
import { StatusRenderer } from '../../../common/components/table-renderers/status/status-renderer';
import { useGridInit } from '../../hooks/use-grid-init';
import { useSaveRestoreGridState } from '../../hooks/use-save-restore-grid-state';
import { useSetDefaultColState } from '../../hooks/use-set-default-col-state';

import { DateReadonlyFloatingFilter } from './custom-filters/date-readonly-floating-filter';
import { SelectionFilter } from './custom-filters/selection-filter';
import { TextReadonlyFloatingFilter } from './custom-filters/text-readonly-floating-filter';
import { useStyles } from './styles';

import '@ag-grid-community/all-modules/dist/styles/ag-grid.css';
import '@ag-grid-community/all-modules/dist/styles/ag-theme-balham.css';

export interface TableProps {
  columnDefs: LT.ColumnDef;
  uniqueFieldName: string;
  onTableReady?: LT.TableApiCallback;
  onRowsSelected?: (selectedRowNodes: RowNode[]) => void;
}

export const Table: React.FC<TableProps> = React.memo(
  ({ columnDefs, uniqueFieldName, onRowsSelected, onTableReady }) => {
    const classes = useStyles({});

    const [gridReadyParams, gridReady] = React.useState<GridReadyEvent>();
    const gridApi = gridReadyParams && gridReadyParams.api;
    const columnApi = gridReadyParams && gridReadyParams.columnApi;

    const defaultColState = useSetDefaultColState(columnDefs, columnApi, gridApi);
    const isTableReady = useGridInit({ columnApi, gridApi, defaultColState, onTableReady });
    useSaveRestoreGridState(columnApi, gridApi, isTableReady);

    function getRowNodeId(data) {
      return data[uniqueFieldName];
    }

    /**
     * This function invokes callback "onRowsSelected" with an array of selected rows, such
     * that items are in the same order as they appear on the screen. The ag-grid selection
     * callback returns items in the order they were selected but we want them to be
     * ordered as they appear on the screen (that is, with current sort/filter applied).
     * This is because when the user goes to create/edit items, then they will be in the
     * same order. See requirement: https://plentyag.atlassian.net/browse/SD-7138
     *
     * Note: since are using an infinite scroll list here, it is possible that some selected
     * items are not currently in the grid. These items will be appended to the end of the selection.
     *
     */
    function onRowSelectionChanged() {
      if (gridApi && onRowsSelected) {
        const allSelectedRows = new Set(gridApi.getSelectedNodes());

        // get a list of selected nodes in the order they are displayed on screen.
        const selectedRowsAsDisplayed: RowNode[] = [];
        gridApi.forEachNode(rowNode => {
          if (rowNode.isSelected()) {
            selectedRowsAsDisplayed.push(rowNode);
            allSelectedRows.delete(rowNode);
          }
        });

        // concat any items nodes not currently displayed
        const selectedRows = selectedRowsAsDisplayed.concat(Array.from(allSelectedRows));

        onRowsSelected(selectedRows);
      }
    }

    function onColumnPinned(event: ColumnPinnedEvent) {
      // when dragging and dropping, only allow pinning a single column at a time.
      // this prevents from dragging an entire group like "Test Details" from unpinned to pinned.
      // this situation can cause a large pinned column and then user can not scroll horizontally.
      if (event.source === 'uiColumnDragged' && event.pinned && event.columns && event.columns.length > 1) {
        // takes either null or empty string to unpin https://www.ag-grid.com/javascript-grid-pinning/
        event.columnApi.setColumnsPinned(event.columns, '');
      }
    }

    const gridOptions = {
      rowModelType: 'infinite',
      cacheBlockSize: 100,
      maxConcurrentDatasourceRequests: 1,
      infiniteInitialRowCount: 500,
      rowSelection: 'multiple',
      immutableData: true,
      getRowNodeId: getRowNodeId,
      domLayout: 'normal',
      suppressDragLeaveHidesColumns: true,
      // debounce so 'reset all' and restore grid state which can set both sort and filter
      // state do not cause double data fetches.
      blockLoadDebounceMillis: 100,
      tooltipShowDelay: 500,
    };

    const customRenderers = {
      statusRenderer: StatusRenderer,
      manualStatusRenderer: ManualStatusRenderer,
      selectionFilter: SelectionFilter,
      textReadonlyFloatingFilter: TextReadonlyFloatingFilter,
      dateReadonlyFloatingFilter: DateReadonlyFloatingFilter,
    };

    return (
      <div className={`${classes.gridWrapper} ag-theme-balham`}>
        <AgGridReact
          frameworkComponents={customRenderers}
          suppressRowClickSelection={true}
          gridOptions={gridOptions}
          onGridReady={gridReady}
          defaultColDef={{
            floatingFilter: true,
          }}
          columnDefs={columnDefs}
          maintainColumnOrder
          onSelectionChanged={onRowSelectionChanged}
          fullWidthCellRenderer="fullWidthCellRenderer"
          modules={AllCommunityModules}
          onColumnPinned={onColumnPinned}
        />
      </div>
    );
  }
);
