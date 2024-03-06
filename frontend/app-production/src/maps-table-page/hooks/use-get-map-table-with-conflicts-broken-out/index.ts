import React from 'react';

import { MapTable } from '../../types';

/**
 * This hook takes map table data and breaks out any conflicts into their own
 * row, so each conflict can be displayed in an ag-grid row.
 */
export const useGetMapTableWithConflictsBrokenOut = (mapTable: MapTable): MapTable => {
  const mapTableWithConflicitsBrokenOutIntoRows = React.useMemo(
    () =>
      mapTable.reduce<MapTable>((prev, curr) => {
        if (curr.conflicts) {
          const newItems = [];
          curr.conflicts.forEach((conflictItem, index) => {
            newItems.push({
              ...curr,
              ref: `${curr.ref}-${index}`, // ensure each ref is a unique (for ag-grid row id uniqueness)
              resource: conflictItem,
            });
          });
          return prev.concat(newItems);
        } else {
          return prev.concat(curr);
        }
      }, []),
    [mapTable]
  );

  return mapTableWithConflicitsBrokenOutIntoRows;
};
