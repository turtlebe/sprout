import { ActionModuleProps, ActionRequestType } from '@plentyag/app-production/src/actions-modules/types';
import { Box, CircularProgress } from '@plentyag/brand-ui/src/material-ui/core';
import { getScopedDataTestIds } from '@plentyag/core/src/utils';
import React from 'react';

import { Switch } from '../../shared/components/switch';

export const actionName = 'SetTransferConveyanceDefaultBehaviorExecutionMode';
export const actionRequestType: ActionRequestType = 'Requests';

const dataTestIds = getScopedDataTestIds({ loading: 'loading' }, 'SetTransferConveyanceDefaultBehaviorExecutionMode');
export { dataTestIds as dataTestIdsSetTransferConveyanceDefaultBehaviorExecutionMode };

export const DEFAULT_BEHAVIOR_EXECUTION_MODE = 'default_behavior_execution_mode';
export const DEFAULT_BEHAVIOR_EXECUTION_MODE_LABEL = 'Default Behavior Execution Mode';

export const SetTransferConveyanceDefaultBehaviorExecutionMode: React.FC<ActionModuleProps> = ({
  formik,
  actionModel,
  isLoading,
}) => {
  if (isLoading) {
    return <CircularProgress data-testid={dataTestIds.loading} />;
  }

  return (
    <Box padding={2} data-testid={dataTestIds.root}>
      <Switch
        formik={formik}
        actionModel={actionModel}
        field={DEFAULT_BEHAVIOR_EXECUTION_MODE}
        label={DEFAULT_BEHAVIOR_EXECUTION_MODE_LABEL}
      />
    </Box>
  );
};
