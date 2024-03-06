import { RegisterActionModuleProps } from '@plentyag/app-production/src/actions-modules/types';
import { Box, CircularProgress } from '@plentyag/brand-ui/src/material-ui/core';
import { useCoreStore } from '@plentyag/core/src/core-store';
import { getScopedDataTestIds } from '@plentyag/core/src/utils';
import React, { useEffect } from 'react';

import {
  SetPreHarvestInspectionDefaultBehaviorFeatureFlags as PreHarvestFeatureFlags,
  SetPreHarvestInspectionRoutingMode as PreHarvestRoutingMode,
} from '..';
import { useActionModule } from '../../hooks';
import {
  SetPreHarvestInspectionDefaultBehaviorFeatureFlagsSerializers as PreHarvestFeatureFlagSerializers,
  SetPreHarvestInspectionRoutingModeSerializers as PreHarvestRoutingModeSerializers,
} from '../../serializers';
import { Switch } from '../../shared/components';

import { RoutingMode } from './components/routing-mode';

const dataTestIds = getScopedDataTestIds({ loading: 'loading' }, 'PreHarvestRouting');
export { dataTestIds as dataTestIdsPreHarvestRouting };

export const DEFAULT_BEHAVIOR_FEATURE_FLAG_FIELD = 'route_tower_after_inspection';

export const PreHarvestRouting: React.FC<RegisterActionModuleProps> = ({
  reactorState: preHarvestReactorState,
  isLoading,
  registerActionModule,
  reactorPath: preHarvestPath,
}) => {
  const [coreState] = useCoreStore();

  const { actionModuleProps: preHarvestFeatureFlagsProps, handleSubmit: handlePreHarvestFeatureFlagsSubmit } =
    useActionModule({
      actionModule: PreHarvestFeatureFlags,
      path: preHarvestPath,
      getDataModel: actionModel =>
        PreHarvestFeatureFlagSerializers.getDataModelFromReactorState(actionModel, preHarvestReactorState, coreState),
      isLoading,
    });

  const { actionModuleProps: preHarvestRoutingModeProps, handleSubmit: handlePreHarvestRoutingModeSubmit } =
    useActionModule({
      actionModule: PreHarvestRoutingMode,
      path: preHarvestPath,
      getDataModel: actionModel =>
        PreHarvestRoutingModeSerializers.getDataModelFromReactorState(actionModel, preHarvestReactorState, coreState),
      isLoading,
    });

  useEffect(() => {
    if (!isLoading && preHarvestFeatureFlagsProps && handlePreHarvestFeatureFlagsSubmit) {
      registerActionModule({
        name: PreHarvestFeatureFlags.actionName,
        actionModuleProps: preHarvestFeatureFlagsProps,
        handleSubmit: handlePreHarvestFeatureFlagsSubmit,
      });
    }
  }, [
    isLoading,
    registerActionModule,
    preHarvestFeatureFlagsProps.isLoading,
    preHarvestFeatureFlagsProps.formik.values,
    preHarvestFeatureFlagsProps.actionModel,
    handlePreHarvestFeatureFlagsSubmit,
  ]);

  useEffect(() => {
    if (!isLoading && preHarvestRoutingModeProps && handlePreHarvestRoutingModeSubmit) {
      registerActionModule({
        name: PreHarvestRoutingMode.actionName,
        actionModuleProps: preHarvestRoutingModeProps,
        handleSubmit: handlePreHarvestRoutingModeSubmit,
      });
    }
  }, [
    isLoading,
    registerActionModule,
    preHarvestRoutingModeProps.isLoading,
    preHarvestRoutingModeProps.formik.values,
    preHarvestRoutingModeProps.actionModel,
    handlePreHarvestRoutingModeSubmit,
  ]);

  if (isLoading || !preHarvestRoutingModeProps.actionModel || !preHarvestFeatureFlagsProps.actionModel) {
    return <CircularProgress data-testid={dataTestIds.loading} />;
  }

  return (
    <Box data-testid={dataTestIds.root}>
      <Switch
        {...preHarvestFeatureFlagsProps}
        field={DEFAULT_BEHAVIOR_FEATURE_FLAG_FIELD}
        label="Enable pre-harvest routing from inspection"
      />
      <RoutingMode {...preHarvestRoutingModeProps} />
    </Box>
  );
};
