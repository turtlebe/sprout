import { DragIndicator } from '@material-ui/icons';
import { ChipMetric } from '@plentyag/app-environment/src/common/components/chip-metric';
import { ChipSchedule } from '@plentyag/app-environment/src/common/components/chip-schedule';
import { Dropdown, DropdownItem, DropdownItemText } from '@plentyag/brand-ui/src/components';
import { Box, Paper } from '@plentyag/brand-ui/src/material-ui/core';
import { WidgetItem as WidgetItemType } from '@plentyag/core/src/types/environment';
import React from 'react';

const dataTestIds = {
  root: 'widget-item-root',
  dropdown: 'widget-item-dropdown',
  delete: 'widget-item-delete',
  edit: 'widget-item-edit',
};

export { dataTestIds as dataTestIdsWidgetItem };

export interface WidgetItem {
  item: WidgetItemType;
  onDelete: (item: WidgetItemType) => void;
  onEdit: (item: WidgetItemType) => void;
  disabled?: boolean;
  'data-testid'?: string;
}

/**
 * Component that renders a WidgetItem containing a Metric or Schedule.
 */
export const WidgetItem: React.FC<WidgetItem> = ({ item, onDelete, onEdit, disabled, 'data-testid': dataTestId }) => {
  return (
    <Box marginBottom={1}>
      <Paper variant="outlined">
        <Box display="flex" alignItems="center" padding={2} gridGap="1rem" data-testid={dataTestId || dataTestIds.root}>
          <DragIndicator />
          <Box display="flex" alignItems="center" justifyContent="space-between" flexGrow={1}>
            {item.itemType === 'METRIC' ? (
              <ChipMetric
                metric={item.metric}
                alertRule={item.metric.alertRules.find(alertRule => alertRule.id === item.options.alertRuleId)}
              />
            ) : (
              <ChipSchedule schedule={item.schedule} actionDefinitionKey={item.options?.actionDefinitionKey} />
            )}
            <Dropdown data-testid={dataTestIds.dropdown} disabled={disabled}>
              <DropdownItem onClick={() => onDelete(item)} data-testid={dataTestIds.delete}>
                <DropdownItemText>Delete</DropdownItemText>
              </DropdownItem>
              <DropdownItem onClick={() => onEdit(item)} data-testid={dataTestIds.edit}>
                <DropdownItemText>Edit</DropdownItemText>
              </DropdownItem>
            </Dropdown>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};
