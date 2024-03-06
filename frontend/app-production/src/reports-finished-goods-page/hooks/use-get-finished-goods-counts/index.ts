import { GridReadyEvent } from '@ag-grid-community/all-modules';
import { useEffect, useState } from 'react';

import { FinishedGoodsStatus } from '../../types';

export type AvailableCounts = FinishedGoodsStatus | 'caseCount';

export interface UseGetFinishedGoodsCountsReturn {
  getCount: (field: AvailableCounts) => number;
}

export const useGetFinishedGoodsCounts = (gridReadyEvent: GridReadyEvent): UseGetFinishedGoodsCountsReturn => {
  const [counts, setCounts] = useState<Record<string, number>>({});

  const handleFilterChanged = () => {
    const filteredCount: Record<string, number> = {};
    gridReadyEvent.api.forEachNodeAfterFilter(row => {
      if (!row.data.isExpRow) {
        // Add up status data
        filteredCount[row.data.status] = (filteredCount[row.data.status] ?? 0) + 1;

        // Add up cases count
        filteredCount['caseCount'] = (filteredCount['caseCount'] ?? 0) + (row.data?.count ?? 0);
      }
    });
    setCounts(filteredCount);
  };

  useEffect(() => {
    if (gridReadyEvent) {
      gridReadyEvent.api.addEventListener('filterChanged', handleFilterChanged);
      handleFilterChanged();
      return () => {
        gridReadyEvent.api.removeEventListener('filterChanged', handleFilterChanged);
      };
    }
  }, [gridReadyEvent]);

  const getCount = field => {
    return counts?.[field] ?? 0;
  };

  return {
    getCount,
  };
};
