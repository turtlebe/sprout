import { useScheduleHandler } from '@plentyag/app-environment/src/common/hooks';
import { useScheduleFormGenConfig } from '@plentyag/app-environment/src/schedules-page/hooks';
import { DialogBaseForm, Dropdown, DropdownItem, DropdownItemText, Show } from '@plentyag/brand-ui/src/components';
import { useCoreStore } from '@plentyag/core/src/core-store';
import { ScheduleDefinition } from '@plentyag/core/src/farm-def/types';
import { Schedule } from '@plentyag/core/src/types/environment';
import React from 'react';

import { DialogBulkApplySchedules } from '..';

enum DialogType {
  editSchedule = 'EDIT_SCHEDULE',
  bulkApplySchedule = 'BULK_APPLY_SCHEDULE',
}

const dataTestIds = {
  root: 'dropdown-schedule-root',
  editSchedule: 'dropdown-schedule-actions-edit-schedule',
  editActions: 'dropdown-schedule-actions-edit-actions',
  bulkApply: 'dropdown-schedule-actions-bulk-apply',
  dialogEditSchedule: 'dropdown-schedule-dialog-edit-schedule',
};

export { dataTestIds as dataTestIdsDropdownScheduleActions };

export interface DropdownScheduleActions {
  schedule: Schedule;
  scheduleDefinition: ScheduleDefinition;
  onEditActions: () => void;
  onScheduleUpdated: () => void;
}

/**
 * Dropdown to perform various actions related to the Schedule:
 * - Edit Actions: switch the page in editMode and allows the user to CRUD the Schedule's action via the graph or in a
 * tabular fashion.
 * - Edit Schedule: opens a Modal to edit the Schedule's core attributes (everything but Actions).
 * - Bulk Apply Schedule: opens a Modal to apply the current Schedule configuration to other Schedules.
 */
export const DropdownScheduleActions: React.FC<DropdownScheduleActions> = ({
  schedule,
  scheduleDefinition,
  onEditActions,
  onScheduleUpdated,
}) => {
  const [coreStore] = useCoreStore();
  const { handleUpdated } = useScheduleHandler();
  const [dialog, setDialog] = React.useState<DialogType>();
  const editScheduleFormGenConfig = useScheduleFormGenConfig({ schedule, username: coreStore.currentUser?.username });

  const handleEditSuccess = (response, headers) => {
    setDialog(null);
    onScheduleUpdated();
    handleUpdated(response, headers);
  };

  const handleBulkApplySuccess = () => {
    setDialog(null);
    onScheduleUpdated();
  };

  return (
    <>
      <Dropdown data-testid={dataTestIds.root}>
        <DropdownItem data-testid={dataTestIds.editActions} onClick={onEditActions}>
          <DropdownItemText>Edit Actions</DropdownItemText>
        </DropdownItem>
        <DropdownItem data-testid={dataTestIds.editSchedule} onClick={() => setDialog(DialogType.editSchedule)}>
          <DropdownItemText>Edit Schedule</DropdownItemText>
        </DropdownItem>
        <Show when={schedule?.actions?.length > 0}>
          <DropdownItem data-testid={dataTestIds.bulkApply} onClick={() => setDialog(DialogType.bulkApplySchedule)}>
            <DropdownItemText>Bulk Apply</DropdownItemText>
          </DropdownItem>
        </Show>
      </Dropdown>
      <DialogBaseForm
        open={dialog === DialogType.editSchedule}
        disableDefaultOnSuccessHandler
        onSuccess={handleEditSuccess}
        onClose={() => setDialog(null)}
        formGenConfig={editScheduleFormGenConfig}
        isUpdating={true}
        initialValues={schedule}
        data-testid={dataTestIds.dialogEditSchedule}
      />
      <DialogBulkApplySchedules
        open={dialog === DialogType.bulkApplySchedule}
        onSuccess={handleBulkApplySuccess}
        onClose={() => setDialog(null)}
        schedule={schedule}
        scheduleDefinition={scheduleDefinition}
      />
    </>
  );
};
