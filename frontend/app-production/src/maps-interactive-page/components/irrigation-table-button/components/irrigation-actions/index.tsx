import { InternalIrrigationStatus, IrrigationStatus } from '@plentyag/app-production/src/maps-interactive-page/types';
import { Show } from '@plentyag/brand-ui/src/components';
import { Box } from '@plentyag/brand-ui/src/material-ui/core';
import { useCoreStore } from '@plentyag/core/src/core-store';
import { PermissionLevels, Resources } from '@plentyag/core/src/core-store/types';
import { getScopedDataTestIds } from '@plentyag/core/src/utils';
import { DateTime } from 'luxon';
import React from 'react';

import { IrrigationTaskTableRowData } from '../../types';
import { DeleteTaskButton } from '../delete-task-button';
import { ModifyOrAddTaskButton } from '../modify-or-add-task-button';

const dataTestIds = getScopedDataTestIds({}, 'irrigation-actions');

export { dataTestIds as dataTestIdsIrrigationActions };

export interface IrrigiationActions {
  rowData: IrrigationTaskTableRowData;
  onRefreshIrrigationTasks: () => void;
}

export const IrrigationActions: React.FC<IrrigiationActions> = ({ rowData, onRefreshIrrigationTasks }) => {
  const [{ currentUser }] = useCoreStore();

  const now = DateTime.now();
  const irrigationDate = DateTime.fromJSDate(rowData.irrigationDate);
  const isPast = irrigationDate < now.startOf('day');
  const isToday = irrigationDate.hasSame(now, 'day');
  const status = rowData.status;

  const hasPermission = currentUser.hasPermission(Resources.HYP_PRODUCTION, PermissionLevels.FULL);

  // no edit allowed for tasks that occurred in the past or ongoing/success tasks.
  if (!hasPermission || isPast || status === IrrigationStatus.ONGOING || status === IrrigationStatus.SUCCESS) {
    return null;
  }

  const isModify = status === IrrigationStatus.CREATED;
  const isAdd = isToday || status === InternalIrrigationStatus.UNSCHEDULED;
  const isDelete = status === IrrigationStatus.CREATED;

  function handleSuccess() {
    void onRefreshIrrigationTasks();
  }

  return (
    <>
      <Box data-testid={dataTestIds.root} display="flex" flexDirection="row">
        <Show when={isModify || isAdd}>
          <ModifyOrAddTaskButton rowData={rowData} isModify={isModify} onRefreshIrrigationTasks={handleSuccess} />
        </Show>
        <Show when={isDelete}>
          <DeleteTaskButton taskId={rowData.id} onRefreshIrrigationTasks={handleSuccess} />
        </Show>
      </Box>
    </>
  );
};
