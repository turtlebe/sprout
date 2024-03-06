import { ActionModuleProps } from '@plentyag/app-production/src/actions-modules/types';
import { Show } from '@plentyag/brand-ui/src/components';
import { Box, Switch as MuiSwitch, Typography } from '@plentyag/brand-ui/src/material-ui/core';
import { getScopedDataTestIds } from '@plentyag/core/src/utils';
import React, { ChangeEvent } from 'react';

import { useIsActionModuleReady } from '../../hooks/use-is-action-module-ready';
import { getDataModelFieldValue, getDataModelValue, getFieldChoicesFromActionModel } from '../../utils';

const dataTestIds = getScopedDataTestIds(
  {
    notReady: 'not-ready',
    invalidField: 'invalid-field',
    field: (fieldName: string) => `field-${fieldName}`,
  },
  'Switch'
);

export { dataTestIds as dataTestIdsSwitch };

/**
 * Switch interface
 * @param field formik field
 * @param label display name
 * @param {...ActionModuleProps} [link]('@plentyag/app-production/src/actions-modules/types')
 */
export interface Switch extends ActionModuleProps {
  field: string;
  label?: string;
}

/**
 * An Action Module switch component for a specific field
 * @param {Switch}
 * @returns {React.FC<Switch>}
 */
export const Switch: React.FC<Switch> = ({ formik, actionModel, field, label }) => {
  const isReady = useIsActionModuleReady({ field, formik, actionModel });

  const choices = getFieldChoicesFromActionModel(actionModel, field);
  const value = getDataModelValue(formik?.values, field);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const toEnable = e.target.checked;
    return formik.setFieldValue(field, getDataModelFieldValue(toEnable ? choices[0] : choices[1]));
  };

  // Assuming the first choice is positive/checked
  const isChecked = value === choices[0];

  return (
    <Show when={isReady}>
      <Box display="flex" alignItems="center" data-testid={dataTestIds.field(field)}>
        <MuiSwitch checked={isChecked} onChange={handleChange} name={field} color="primary" />
        <Typography variant="body1">{label}</Typography>
      </Box>
    </Show>
  );
};
