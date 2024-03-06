import React from 'react';

import { WorkbinTaskDefinition } from '../../types/workspace';

export function useGetSelectedTableTaskDefinition<T extends WorkbinTaskDefinition>(gridReadyEvent, tableRows: T[]) {
  const [selectedTaskDefinition, setSelectedTaskDefinition] = React.useState<T>();

  const updateSelectedRow = React.useCallback(() => {
    if (gridReadyEvent) {
      const selectedRowIds = gridReadyEvent.api.getSelectedRows().map((item: T) => item.id);
      const selectedRowId = selectedRowIds.length > 0 && selectedRowIds[0];
      const selected = tableRows?.find(row => row.id === selectedRowId) || null;
      setSelectedTaskDefinition(selected);
    }
  }, [gridReadyEvent, tableRows]);

  React.useEffect(() => {
    updateSelectedRow();
  }, [tableRows]);

  return { selectedTaskDefinition, updateSelectedRow };
}
