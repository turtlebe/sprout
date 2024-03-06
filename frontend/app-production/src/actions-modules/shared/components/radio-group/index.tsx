import { ActionModuleProps } from '@plentyag/app-production/src/actions-modules/types';
import { Show } from '@plentyag/brand-ui/src/components';
import {
  Box,
  FormControl,
  FormControlLabel,
  FormLabel,
  RadioGroup as MuiRadioGroup,
  Radio,
  useTheme,
} from '@plentyag/brand-ui/src/material-ui/core';
import { getScopedDataTestIds } from '@plentyag/core/src/utils';
import React, { ChangeEvent, ReactNode } from 'react';

import { useIsActionModuleReady } from '../../hooks/use-is-action-module-ready';
import { getDataModelFieldValue, getDataModelValue, getFieldChoicesFromActionModel } from '../../utils';
import { getFieldTypeFromActionModel } from '../../utils/get-field-type-from-action-model';

const dataTestIds = getScopedDataTestIds(
  {
    field: (fieldName: string) => `field-${fieldName}`,
    choice: (value: string) => `choice-${value}`,
  },
  'RadioGroup'
);

export { dataTestIds as dataTestIdsRadioGroup };

/**
 * RadioGroup Interface
 * @param field formik field
 * @param label display name
 * @param isError to show error
 * @param formatChoiceLabel string transformer for each choice
 * @param onChange callback on every change
 * @param {...ActionModuleProps} [link]('@plentyag/app-production/src/actions-modules/types')
 */
export interface RadioGroup extends ActionModuleProps {
  field: string;
  label?: string;
  isError?: boolean;
  formatChoiceLabel?: (choice: string) => ReactNode;
  onChange?: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: string, value: string) => void;
}

/**
 * An Action Module drop down component for a specific field
 * @param {RadioGroup}
 * @returns {React.FC<RadioGroup>}
 */
export const RadioGroup: React.FC<RadioGroup> = ({
  formik,
  actionModel,
  isError = false,
  label,
  field,
  formatChoiceLabel = str => str,
  onChange = () => {},
}) => {
  const theme = useTheme();
  const isReady = useIsActionModuleReady({ field, formik, actionModel });

  const definitionChoices = getFieldChoicesFromActionModel(actionModel, field);
  const fieldType = getFieldTypeFromActionModel(actionModel, field);
  const value = getDataModelValue(formik?.values, field, fieldType);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    formik.setFieldValue(field, getDataModelFieldValue(e.target.value, fieldType));
    onChange(e, field, e.target.value);
  };

  return (
    <Show when={isReady}>
      <FormControl error={isError && !value} data-testid={dataTestIds.field(field)}>
        <FormLabel>{label}</FormLabel>
        <MuiRadioGroup value={value || ''} name={field} id={field} onChange={handleChange}>
          {definitionChoices.map((choice, index) => {
            const isSelected = value === choice;
            const isFirst = index === 0;
            const isLast = index === definitionChoices.length - 1;
            return (
              <Box
                key={dataTestIds.choice(choice)}
                borderRadius={isFirst ? '4px 4px 0 0' : isLast ? '0 0 4px 4px' : 0}
                bgcolor={isSelected ? '#EBF4FC' : theme.palette.common.white}
                paddingLeft={2}
              >
                <FormControlLabel
                  data-testid={dataTestIds.choice(choice)}
                  value={choice}
                  control={<Radio color="primary" />}
                  label={formatChoiceLabel(choice)}
                />
              </Box>
            );
          })}
        </MuiRadioGroup>
      </FormControl>
    </Show>
  );
};
