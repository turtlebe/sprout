import { BaseAgGridClientSideTable } from '@plentyag/brand-ui/src/components/base-ag-grid-table';

export interface UseExtendedAgGridWithRowReorder {
  agGridConfig: BaseAgGridClientSideTable['agGridConfig'];
  onRowReorder: (param: any, data: any[]) => void;
}

/**
 * Extend the ag-grid config to include manual sorting with row drag and dropping
 *
 * To use this hook, you must already created an AG Grid Config for the base AG Grid Table. This
 * hook will accept your agGridConfig and extend the object to contain the settings to introduce
 * manual sorting using row drag-and-drop.  The hook will return a new AG Grid Config that you
 * will pass down to your base AG Grid Table.  Use the `onRowReorder` to handle the new state of
 * order.
 *
 * @param {UseExtendedAgGridWithRowReorder} agGridConfig
 * @param {(param: any, ids: string[]) => JSX.Element} onRowReorder
 * @param {string} orderField
 * @returns {BaseAgGridClientSideTable['agGridConfig']}
 */
export const useExtendedAgGridWithRowReorder = ({
  agGridConfig,
  onRowReorder = () => {},
}: UseExtendedAgGridWithRowReorder): BaseAgGridClientSideTable['agGridConfig'] => {
  const dataState = agGridConfig?.rowData;

  if (!agGridConfig || !agGridConfig.rowData) {
    return agGridConfig;
  }

  if (!agGridConfig.columnDefs?.length) {
    throw new Error('At least one column is needed to be able to use this hook');
  }

  const [firstColumn, ...restColumns] = agGridConfig.columnDefs;

  const newAgGridConfig = {
    ...agGridConfig,

    // enable row drag
    rowDragManaged: true,
    suppressMoveWhenRowDragging: true,
    animatedRows: true,

    // insert first row with "draggable" UI icon
    columnDefs: [
      {
        ...firstColumn,
        rowDrag: true,
      },
      ...restColumns,
    ],

    // custom expanded detail
    onRowDragEnd: param => {
      // model
      const model = param.node.data;

      // get indexes
      const newIndex = param.overIndex;
      const currentIndex = dataState.findIndex(
        row => ((agGridConfig.getRowNodeId && agGridConfig.getRowNodeId(row)) || row.id) === param.node.id
      );

      // copy and move element to new index
      const newDataState = [...dataState];
      newDataState.splice(currentIndex, 1);
      newDataState.splice(newIndex, 0, model);

      onRowReorder(param, newDataState);
    },
  };

  return newAgGridConfig;
};
