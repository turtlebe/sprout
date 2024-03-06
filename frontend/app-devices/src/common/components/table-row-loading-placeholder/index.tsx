import { CircularProgress, TableCell, TableRow } from '@plentyag/brand-ui/src/material-ui/core';
import React from 'react';

const dataTestIds = {
  loader: 'table-row-loading-placeholder-loader',
  cell: 'table-row-loading-placeholder-cell',
};

export { dataTestIds as dataTestIdsTableRowLoadingPlaceholder };

export interface TableRowLoadingPlaceholder {
  collection: any[];
  isLoading: boolean;
  text?: string;
  colSpan?: number;
}

export const TableRowLoadingPlaceholder: React.FC<TableRowLoadingPlaceholder> = ({
  collection = [],
  isLoading,
  text = 'No Devices',
  colSpan,
}) => {
  if (collection.length !== 0) {
    return null;
  }

  return (
    <TableRow>
      <TableCell data-testid={dataTestIds.cell} colSpan={colSpan}>
        {isLoading ? <CircularProgress size="12px" data-testid={dataTestIds.loader} /> : text}
      </TableCell>
    </TableRow>
  );
};
