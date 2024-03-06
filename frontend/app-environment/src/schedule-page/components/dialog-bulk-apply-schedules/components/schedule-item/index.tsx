import { Delete, Edit } from '@material-ui/icons';
import { LinkSchedule } from '@plentyag/app-environment/src/common/components';
import { COLORS } from '@plentyag/app-environment/src/common/utils/constants';
import {
  DialogConfirmation,
  DialogScheduleDefinitionPicker,
  Dropdown,
  DropdownItem,
  DropdownItemIcon,
  DropdownItemText,
  Show,
} from '@plentyag/brand-ui/src/components';
import { Box, Chip, Paper } from '@plentyag/brand-ui/src/material-ui/core';
import { ScheduleDefinition } from '@plentyag/core/src/farm-def/types';
import { Schedule } from '@plentyag/core/src/types/environment';
import { isSchedule } from '@plentyag/core/src/types/environment/type-guards';
import { getScopedDataTestIds, getShortenedPath } from '@plentyag/core/src/utils';
import React from 'react';

enum DialogType {
  edit = 'EDIT',
  delete = 'DELETE',
}

const dataTestIds = {
  root: 'schedule-item',
  status: 'schedule-item-status',
  schedule: 'schedule-item-schedule',
  scheduleDefinition: 'schedule-item-schedule-definition',
  dropdown: 'schedule-item-dropdown',
  edit: 'schedule-item-dropdown-edit',
  delete: 'schedule-item-dropdown-delete',
  dialogEdit: 'schedule-item-dropdown-dialogEdit',
};

export const getScheduleItemDataTestIds = (prefix = '') => getScopedDataTestIds(dataTestIds, prefix);

export { dataTestIds as dataTestIdsScheduleItem };

export interface ScheduleItem {
  templateScheduleDefinition: ScheduleDefinition;
  scheduleOrDefinition: Schedule | ScheduleDefinition;
  onChange: (scheduleOrDefinition: Schedule | ScheduleDefinition) => void;
  onDelete: (scheduleOrDefinition: Schedule | ScheduleDefinition) => void;
  disabled?: boolean;
  'data-testid'?: string;
}

export const ScheduleItem: React.FC<ScheduleItem> = ({
  templateScheduleDefinition,
  scheduleOrDefinition,
  onChange,
  onDelete,
  disabled,
  'data-testid': dataTestId,
}) => {
  const dataTestIdsWithPrefix = getScheduleItemDataTestIds(dataTestId);
  const [dialog, setDialog] = React.useState<DialogType>();

  if (!scheduleOrDefinition) {
    return null;
  }

  const handleChange: DialogScheduleDefinitionPicker['onChange'] = scheduleOrDefinition => {
    setDialog(null);
    onChange(scheduleOrDefinition);
  };
  const handleDelete: DialogConfirmation['onConfirm'] = () => {
    setDialog(null);
    onDelete(scheduleOrDefinition);
  };

  return (
    <Box marginBottom={1} data-testid={dataTestIdsWithPrefix.root}>
      <Paper variant="outlined">
        <Box display="flex" alignItems="center" padding={2} justifyContent="space-between">
          <Box display="flex" alignItems="center">
            <Chip
              label={isSchedule(scheduleOrDefinition) ? 'OVERRIDE' : 'NEW'}
              color="secondary"
              data-testid={dataTestIdsWithPrefix.status}
            />
            <Box padding={0.5} />
            <Show
              when={isSchedule(scheduleOrDefinition)}
              fallback={
                <Chip
                  label={`Path: ${getShortenedPath(scheduleOrDefinition.path)}`}
                  data-testid={dataTestIdsWithPrefix.scheduleDefinition}
                />
              }
            >
              <LinkSchedule
                schedule={scheduleOrDefinition as Schedule}
                data-testid={dataTestIdsWithPrefix.schedule}
                color={COLORS.schedule}
              />
            </Show>
          </Box>
          <Dropdown data-testid={dataTestIdsWithPrefix.dropdown} disabled={disabled}>
            <DropdownItem onClick={() => setDialog(DialogType.edit)} data-testid={dataTestIdsWithPrefix.edit}>
              <DropdownItemIcon>
                <Edit />
              </DropdownItemIcon>
              <DropdownItemText>Edit</DropdownItemText>
            </DropdownItem>
            <DropdownItem onClick={handleDelete} data-testid={dataTestIdsWithPrefix.delete}>
              <DropdownItemIcon>
                <Delete />
              </DropdownItemIcon>
              <DropdownItemText>Delete</DropdownItemText>
            </DropdownItem>
          </Dropdown>
        </Box>
      </Paper>
      <DialogScheduleDefinitionPicker
        initialValue={scheduleOrDefinition}
        scheduleDefinition={templateScheduleDefinition}
        open={dialog === DialogType.edit}
        onChange={handleChange}
        onClose={() => setDialog(null)}
      />
    </Box>
  );
};
