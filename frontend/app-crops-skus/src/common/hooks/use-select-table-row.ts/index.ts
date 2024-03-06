import React from 'react';

import { CropWithFarmInfo, SkuWithFarmInfo } from '../../types';

export function useSelectedTableRow<T extends SkuWithFarmInfo | CropWithFarmInfo>(gridReadyEvent, tableRows: T[]) {
  const [selectedRow, setSelectedRow] = React.useState<T>();

  const updateSelectedRow = React.useCallback(() => {
    if (gridReadyEvent) {
      const selectedRowNames = gridReadyEvent.api.getSelectedRows().map(item => item.name);
      const selectedRowName = selectedRowNames.length > 0 && selectedRowNames[0];
      const selected = tableRows?.find(row => row.name === selectedRowName) || null;
      setSelectedRow(selected);
    }
  }, [gridReadyEvent, tableRows]);

  React.useEffect(() => {
    updateSelectedRow();
  }, [tableRows]);

  return { selectedRow, updateSelectedRow };
}
