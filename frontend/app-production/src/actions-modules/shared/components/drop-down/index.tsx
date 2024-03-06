import { ActionModuleProps } from '@plentyag/app-production/src/actions-modules/types';
import { Show } from '@plentyag/brand-ui/src/components';
import { MenuItem, TextField } from '@plentyag/brand-ui/src/material-ui/core';
import { getScopedDataTestIds } from '@plentyag/core/src/utils';
import React, { ChangeEvent } from 'react';

import { useIsActionModuleReady } from '../../hooks/use-is-action-module-ready';
import { getDataModelFieldValue, getDataModelValue, getFieldChoicesFromActionModel } from '../../utils';
import { getFieldTypeFromActionModel } from '../../utils/get-field-type-from-action-model';

import { DropDownStylesProps, useStyles } from './styles';

const dataTestIds = getScopedDataTestIds(
  {
    field: (fieldName: string) => `field-${fieldName}`,
    choice: (value: string) => `choice-${value}`,
  },
  'DropDown'
);

export { dataTestIds as dataTestIdsDropDown };

/**
 * DropDown Interface
 * @param field formik field
 * @param label display name
 * @param isError to show error
 * @param renderMenuChoice string transformer for each choice
 * @param renderDisplay value transformer for the showing the current display of control
 * @param minWidth custom width in px
 * @param onChange callback on every change
 * @param {...ActionModuleProps} [link]('@plentyag/app-production/src/actions-modules/types')
 */
export interface DropDown extends ActionModuleProps, DropDownStylesProps {
  field: string;
  label?: string;
  isError?: boolean;
  renderMenuChoice?: (choice: any) => React.ReactNode;
  renderDisplay?: (choice: any) => React.ReactNode;
  onChange?: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: string, value: string) => void;
}

/**
 * An Action Module drop down component for a specific field
 * @param {DropDown}
 * @returns {React.FC<DropDown>}
 */
export const DropDown: React.FC<DropDown> = ({
  formik,
  actionModel,
  isError = false,
  label,
  field,
  renderMenuChoice = str => str,
  renderDisplay,
  onChange = () => {},
  minWidth = 100,
  marginLeft,
  size,
}) => {
  const classes = useStyles({ minWidth, marginLeft, size });
  const isReady = useIsActionModuleReady({ field, formik, actionModel });

  const definitionChoices = getFieldChoicesFromActionModel(actionModel, field);
  const fieldType = getFieldTypeFromActionModel(actionModel, field);
  const value = getDataModelValue(formik?.values, field, fieldType);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    formik.setFieldValue(field, getDataModelFieldValue(e.target.value, fieldType));
    onChange(e, field, e.target.value);
  };

  // Select properties
  const SelectProps: Partial<SelectProps> = {
    classes: {
      root: classes.select,
    },
  };
  if (renderDisplay) {
    SelectProps.renderValue = renderDisplay;
  }

  return (
    <Show when={isReady}>
      <TextField
        variant="outlined"
        size="small"
        select
        name={field}
        label={label}
        error={isError && !value}
        classes={{
          root: classes.dropDown,
        }}
        SelectProps={SelectProps}
        onChange={handleChange}
        value={value || ''}
        disabled={false}
        data-testid={dataTestIds.field(field)}
      >
        {definitionChoices.map(choice => {
          const formattedChoice = renderMenuChoice(choice);
          return (
            formattedChoice && (
              <MenuItem key={dataTestIds.choice(choice)} value={choice} data-testid={dataTestIds.choice(choice)}>
                {formattedChoice}
              </MenuItem>
            )
          );
        })}
      </TextField>
    </Show>
  );
};
