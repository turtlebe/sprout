import { Typography } from '@plentyag/brand-ui/src/material-ui/core';
import React from 'react';

export const dataTestIds = {
  filteredColumns: 'filtered-columns',
};

interface FilteredColumns {
  tableApi?: LT.TableApi;
}

export const FilteredColumns: React.FC<FilteredColumns> = ({ tableApi }) => {
  const [filteredColumns, setFilteredColumns] = React.useState<string[]>([]);
  React.useEffect(() => {
    if (tableApi) {
      function onFilterChanged() {
        const columns = Object.keys(tableApi.gridApi.getFilterModel()).map(columnName => {
          const column = tableApi.columnApi.getColumn(columnName);
          if (column) {
            return column.getColDef().headerName;
          }
        });
        setFilteredColumns(columns || []);
      }
      tableApi.gridApi.addEventListener('filterChanged', onFilterChanged);
      return () => {
        tableApi.gridApi.removeEventListener('filterChanged', onFilterChanged);
      };
    }
  }, [tableApi]);

  return filteredColumns.length > 0 ? (
    <Typography data-testid={dataTestIds.filteredColumns}>Filtered columns: {filteredColumns.join(', ')}</Typography>
  ) : null;
};
