import React from 'react';

import { WorkbinTaskTrigger } from '../../types/workspace';

export function useGetSelectedTableWorkbinTrigger<T extends WorkbinTaskTrigger>(gridReadyEvent, tableRows: T[]) {
  const [selectedWorkbinTrigger, setSelectedWorkbinTrigger] = React.useState<T>();

  const updateSelectedRow = React.useCallback(() => {
    if (gridReadyEvent) {
      const selectedRowIds = gridReadyEvent.api.getSelectedRows().map((item: T) => item.groupId);
      const selectedRowId = selectedRowIds.length > 0 && selectedRowIds[0];
      const selected = tableRows?.find(row => row.groupId === selectedRowId) || null;
      setSelectedWorkbinTrigger(selected);
    }
  }, [gridReadyEvent, tableRows]);

  React.useEffect(() => {
    updateSelectedRow();
  }, [tableRows]);

  return { selectedWorkbinTrigger, updateSelectedRow };
}
