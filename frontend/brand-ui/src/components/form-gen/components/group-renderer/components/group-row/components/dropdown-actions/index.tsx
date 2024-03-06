import { FileCopy, Remove } from '@material-ui/icons';
import { Dropdown, DropdownItem, DropdownItemIcon, DropdownItemText } from '@plentyag/brand-ui/src/components/dropdown';
import { Show } from '@plentyag/brand-ui/src/components/show';
import { IconButton } from '@plentyag/brand-ui/src/material-ui/core';
import { getScopedDataTestIds } from '@plentyag/core/src/utils';
import React from 'react';

const dataTestIds = {
  root: 'dropdown-group-actions',
  remove: 'dropdown-group-actions-remove',
  dropdown: 'dropdown-group-actions-dropdown',
  dropdownClone: 'dropdown-group-actions-dropdown-clone',
  dropdownRemove: 'dropdown-group-actions-dropdown-remove',
};

export { dataTestIds as dataTestIdsDropdownActions };

export const getDropdownActionsDataTestIds = (prefix = '') => getScopedDataTestIds(dataTestIds, prefix);

export interface DropdownActions {
  onClone?: React.MouseEventHandler;
  onRemove?: React.MouseEventHandler;
  minRowCountForRemove?: number;
  disabled?: boolean;
  totalRowCount?: number;
  'data-testid'?: string;
}

/**
 * Dropdown with group actions
 */
export const DropdownActions: React.FC<DropdownActions> = ({
  onClone,
  onRemove,
  minRowCountForRemove,
  disabled,
  totalRowCount,
  'data-testid': dataTestId,
}) => {
  const dataTestIdsWithPrefix = getDropdownActionsDataTestIds(dataTestId);
  if (!onClone) {
    return (
      <Show when={onRemove && totalRowCount > minRowCountForRemove}>
        <IconButton
          data-testid={dataTestIdsWithPrefix.remove}
          style={{ alignSelf: 'center' }}
          size="small"
          icon={Remove}
          color="primary"
          onClick={onRemove}
          disabled={disabled}
        />
      </Show>
    );
  } else {
    return (
      <Dropdown data-testid={dataTestIdsWithPrefix.dropdown}>
        <DropdownItem data-testid={dataTestIdsWithPrefix.dropdownClone} onClick={onClone} disabled={disabled}>
          <DropdownItemIcon>
            <FileCopy />
          </DropdownItemIcon>
          <DropdownItemText>Clone</DropdownItemText>
        </DropdownItem>
        {onRemove && totalRowCount > minRowCountForRemove && (
          <DropdownItem data-testid={dataTestIdsWithPrefix.dropdownRemove} onClick={onRemove} disabled={disabled}>
            <DropdownItemIcon>
              <Remove />
            </DropdownItemIcon>
            <DropdownItemText>Remove</DropdownItemText>
          </DropdownItem>
        )}
      </Dropdown>
    );
  }
};
