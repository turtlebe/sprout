import { ActionModuleProps, ActionRequestType } from '@plentyag/app-production/src/actions-modules/types';
import { Box, CircularProgress, Grid } from '@plentyag/brand-ui/src/material-ui/core';
import { getScopedDataTestIds } from '@plentyag/core/src/utils';
import React from 'react';

import { Switch } from '../../shared/components/switch';

export const actionName = 'SetTransferConveyanceDefaultBehaviorFeatureFlags';
export const actionRequestType: ActionRequestType = 'Requests';

const dataTestIds = getScopedDataTestIds({ loading: 'loading' }, 'SetTransferConveyanceDefaultBehaviorFeatureFlags');
export { dataTestIds as dataTestIdsSetTransferConveyanceDefaultBehaviorExecutionMode };

export interface ExtraProps {
  disableFields?: string[];
}

export const SetTransferConveyanceDefaultBehaviorFeatureFlags: React.FC<ActionModuleProps> = ({
  formik,
  actionModel,
  isLoading,
}) => {
  if (isLoading) {
    return <CircularProgress data-testid={dataTestIds.loading} />;
  }

  return (
    <Box padding={2} data-testid={dataTestIds.root}>
      <Grid container direction="column" spacing={4}>
        {actionModel.fields.map(field => (
          <Grid item key={field.name}>
            <Switch formik={formik} actionModel={actionModel} field={field.name} label={field.displayName} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};
