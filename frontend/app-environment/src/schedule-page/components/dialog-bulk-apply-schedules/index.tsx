import { Check } from '@material-ui/icons';
import { EVS_URLS } from '@plentyag/app-environment/src/common/utils';
import {
  DialogConfirmation,
  DialogDefault,
  getDialogConfirmationDataTestIds,
  Show,
  useGlobalSnackbar,
} from '@plentyag/brand-ui/src/components';
import { Box, Button, CircularProgress, Typography } from '@plentyag/brand-ui/src/material-ui/core';
import useCoreStore from '@plentyag/core/src/core-store';
import { isScheduleDefinition } from '@plentyag/core/src/farm-def/type-guards';
import { ScheduleDefinition } from '@plentyag/core/src/farm-def/types';
import { usePostRequest } from '@plentyag/core/src/hooks';
import { Schedule } from '@plentyag/core/src/types/environment';
import { isSchedule } from '@plentyag/core/src/types/environment/type-guards';
import { getArrayWithoutIndex, getArrayWithUpdatedIndex, parseErrorMessage } from '@plentyag/core/src/utils';
import React from 'react';

import { ButtonScheduleDefinitionPicker, getScheduleItemDataTestIds, ScheduleItem } from './components';

const dataTestIds = {
  save: 'dialog-bulk-apply-save',
  noSchedulePlaceholder: 'no-schedule-placeholder',
  scheduleItem: (scheduleOrDefinition: Schedule | ScheduleDefinition) =>
    getScheduleItemDataTestIds(scheduleOrDefinition.path),
  confirmation: getDialogConfirmationDataTestIds('dialog-bulk-apply'),
};

export { dataTestIds as dataTestIdsDialogBulkApplySchedules };

export interface DialogBulkApplySchedules {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  schedule: Schedule;
  scheduleDefinition: ScheduleDefinition;
}

export const DialogBulkApplySchedules: React.FC<DialogBulkApplySchedules> = ({
  open,
  onSuccess,
  onClose,
  schedule,
  scheduleDefinition,
}) => {
  const [confirmDialogOpen, setConfirmDialogOpen] = React.useState<boolean>(false);
  const [schedulesOrDefinitions, setSchedulesOrDefinitions] = React.useState<(Schedule | ScheduleDefinition)[]>([]);
  const { makeRequest, isLoading } = usePostRequest({ url: EVS_URLS.schedules.bulkApplyUrl() });
  const [store] = useCoreStore();
  const snackbar = useGlobalSnackbar();

  const handleAddScheduleOrDefinition: ButtonScheduleDefinitionPicker['onChange'] = scheduleOrDefinition => {
    setSchedulesOrDefinitions([...schedulesOrDefinitions, scheduleOrDefinition]);
  };

  const handleUpdateScheduleOrDefinition =
    (index: number): ScheduleItem['onChange'] =>
    scheduleOrDefinition => {
      setSchedulesOrDefinitions(getArrayWithUpdatedIndex(schedulesOrDefinitions, scheduleOrDefinition, index));
    };

  const handleDeleteScheduleOrDefinition =
    (index: number): ScheduleItem['onDelete'] =>
    () => {
      setSchedulesOrDefinitions(getArrayWithoutIndex(schedulesOrDefinitions, index));
    };

  const handleBulkApply = () => {
    setConfirmDialogOpen(false);

    makeRequest({
      data: {
        templateScheduleId: schedule.id,
        otherScheduleIds: schedulesOrDefinitions.filter(isSchedule).map(schedule => schedule.id),
        otherSchedulePaths: schedulesOrDefinitions
          .filter(isScheduleDefinition)
          .map(scheduleDefinition => scheduleDefinition.path),
        updatedBy: store.currentUser.username,
      },
      onSuccess: () => {
        snackbar.successSnackbar('Schedule successfully applied to other Schedules');
        onSuccess();
        setSchedulesOrDefinitions([]);
      },
      onError: response => {
        const message = parseErrorMessage(response);
        snackbar.errorSnackbar({ message });
      },
    });
  };

  return (
    <DialogDefault title="Bulk Apply Schedule" maxWidth="md" open={open} onClose={onClose}>
      <Box padding={2}>
        {schedulesOrDefinitions.map((scheduleOrDefinition, index) => (
          <ScheduleItem
            key={scheduleOrDefinition.path}
            scheduleOrDefinition={scheduleOrDefinition}
            templateScheduleDefinition={scheduleDefinition}
            onChange={handleUpdateScheduleOrDefinition(index)}
            onDelete={handleDeleteScheduleOrDefinition(index)}
            data-testid={dataTestIds.scheduleItem(scheduleOrDefinition).root}
            disabled={isLoading}
          />
        ))}
        <Show when={Boolean(!schedulesOrDefinitions.length)}>
          <Typography align="center" data-testid={dataTestIds.noSchedulePlaceholder}>
            Start by choosing a Schedule to apply the current Schedule configuration.
          </Typography>
        </Show>
      </Box>
      <Box display="flex" justifyContent="center" padding={2}>
        <ButtonScheduleDefinitionPicker
          scheduleDefinition={scheduleDefinition}
          onChange={handleAddScheduleOrDefinition}
          disabled={isLoading}
        />
        <Box padding={1} />
        <Button
          color="primary"
          variant="contained"
          startIcon={isLoading ? <CircularProgress size="1rem" /> : <Check />}
          onClick={() => setConfirmDialogOpen(true)}
          disabled={isLoading || schedulesOrDefinitions.length === 0}
          data-testid={dataTestIds.save}
        >
          Bulk Apply
        </Button>
        <DialogConfirmation
          open={confirmDialogOpen}
          title="Are you sure you'd like to apply the current Schedule configuration to the choosen Schedules?"
          confirmLabel="Yes, Apply"
          onConfirm={handleBulkApply}
          onCancel={() => setConfirmDialogOpen(false)}
          data-testid={dataTestIds.confirmation.root}
        />
      </Box>
    </DialogDefault>
  );
};
