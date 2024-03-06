import { BaseAgGridClientSideTable } from '@plentyag/brand-ui/src/components';
import { AlertEvent } from '@plentyag/core/src/types/environment';
import React from 'react';

import { useGroupedAlertEventsAgGridConfig } from './hooks/use-grouped-alert-events-ag-grid-config';

export interface GroupedAlertEventsTable {
  alertEvents: AlertEvent[];
}

/**
 * AgGrid Table rendering list of AlertEvents grouped by path.
 */
export const GroupedAlertEventsTable: React.FC<GroupedAlertEventsTable> = ({ alertEvents: rowData }) => {
  const config = useGroupedAlertEventsAgGridConfig();

  return (
    <BaseAgGridClientSideTable agGridConfig={{ ...config, rowData }} persistFilterAndSortModelsInLocalStorage={false} />
  );
};
