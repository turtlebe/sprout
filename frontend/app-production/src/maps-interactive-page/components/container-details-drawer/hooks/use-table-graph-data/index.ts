import { MapsState } from '@plentyag/app-production/src/maps-interactive-page/types';
import { useMemo } from 'react';

import { Site, TableDimensions } from '../../constants';
import { TableRowData } from '../../types';
import { getAlphaByIndex } from '../../utils/get-alpha-index';

export interface UseTableGraphData {
  siteName?: string;
  traysState: MapsState;
}

export interface UseTableGraphDataReturn {
  tableRows: TableRowData[];
}

export const useTableGraphData = ({ siteName, traysState }: UseTableGraphData): UseTableGraphDataReturn => {
  const tableDimensions = TableDimensions[Site[siteName || 'Default']];

  // Init row/column sizes
  const rowPlacements = [...Array(tableDimensions.traysVertically)];
  const columnPlacements = [...Array(tableDimensions.traysHorizontally)];

  // Fill in data
  const tableRows = useMemo(() => {
    const rows = rowPlacements.map<TableRowData>((_, rowIndex) => {
      const row = getAlphaByIndex(rowIndex);

      // Find the resource and place them in the data
      const resources = columnPlacements.map<ProdResources.ResourceState>((_, columnIndex) => {
        const column = columnIndex + 1;
        const position = `${row}${column}`;
        return traysState[position]?.resourceState;
      });

      return {
        rowName: row,
        resources,
      };
    });

    // Reverse for correct orientation
    rows.reverse();

    return rows;
  }, [traysState]);

  return {
    tableRows,
  };
};
