import Alert from '@material-ui/lab/Alert';
import {
  SetTransferConveyanceDefaultBehaviorFeatureFlags as FeatureFlags,
  SetTransferConveyanceDefaultBehaviorFeatureFlagsSerializers as FeatureFlagsSerializers,
  OverrideRoutingTable as OverrideRouting,
  OverrideRoutingTableSerializers as OverrideRoutingSerializers,
  PauseBufferTables as PauseBuffer,
  PreHarvestRouting as PreHarvest,
  Switch,
  useActionModule,
  useFetchReactorState,
  useMultipleActionModulesUtils,
} from '@plentyag/app-production/src/actions-modules';
import { useRegisterActionModule } from '@plentyag/app-production/src/actions-modules/hooks';
import { Show } from '@plentyag/brand-ui/src/components';
import { useFeatureFlag } from '@plentyag/brand-ui/src/components/feature-flag';
import { Box, Button } from '@plentyag/brand-ui/src/material-ui/core';
import { useCoreStore } from '@plentyag/core/src/core-store';
import { getScopedDataTestIds } from '@plentyag/core/src/utils';
import React, { useEffect } from 'react';

import { useStyles } from './styles';

const dataTestIds = getScopedDataTestIds(
  {
    title: 'title',
    icon: 'icon',
    revertButton: 'revert-button',
    saveButton: 'save-button',
  },
  'TransferConveyanceSettings'
);

export { dataTestIds as dataTestIdsTransferConveyanceSettings };

export const ROUTING_PATH_OVERRIDE_ENABLED_FIELD = 'routing_path_override_enabled';
export const PICKUP_ROBOT_ROUTING_ENABLED_FIELD = 'pickup_robot_routing_enabled';
export const DEFAULT_BEHAVIOR_EXECUTION_MODE_FIELD = 'default_behavior_execution_mode';

export const PAUSE_BUFFERS_FEATURE_KEY = 'pause-buffers';

export const TransferConveyanceSettings: React.FC = () => {
  const [coreState] = useCoreStore();
  const showPauseBuffersActionModule = useFeatureFlag(PAUSE_BUFFERS_FEATURE_KEY);

  const path = 'sites/LAX1/areas/TowerAutomation/lines/TransferConveyance';
  const preHarvestPath = 'sites/LAX1/areas/VerticalGrow/lines/PreHarvest/machines/PreHarvestInspection';

  const classes = useStyles({});
  const { reactorState, revalidate, isLoading } = useFetchReactorState(path);
  const {
    reactorState: preHarvestReactorState,
    revalidate: revalidatePreHarvestReactorState,
    isLoading: isLoadingPreHarvestReactorState,
  } = useFetchReactorState(preHarvestPath);

  const { registerActionModule, registeredActionModules, saveActionModules } = useRegisterActionModule();

  const {
    actionModuleProps: overrideRoutingProps,
    handleSubmit: handleOverrideRoutingSubmit,
    resetForm: resetOverrideRouting,
  } = useActionModule({
    actionModule: OverrideRouting,
    path,
    getDataModel: actionModel => {
      return OverrideRoutingSerializers.getDataModelFromReactorState(actionModel, reactorState, coreState);
    },
    isLoading,
  });

  const {
    actionModuleProps: featureFlagsProps,
    handleSubmit: handleFeatureFlagsSubmit,
    resetForm: resetFeatureFlags,
  } = useActionModule({
    actionModule: FeatureFlags,
    path,
    getDataModel: actionModel =>
      FeatureFlagsSerializers.getDataModelFromReactorState(actionModel, reactorState, coreState),
    isLoading,
  });

  const registeredActionModulesProps = React.useMemo(
    () => registeredActionModules.map(actionModule => actionModule.actionModuleProps),
    [registeredActionModules]
  );

  const { errorList, isDirty, submitAttempted } = useMultipleActionModulesUtils([
    overrideRoutingProps,
    featureFlagsProps,
    ...registeredActionModulesProps,
  ]);

  /**
   * Saving all the "forms".
   * Note: Order is important here!
   */
  const handleSave = async () => {
    const overrideRouting = await handleOverrideRoutingSubmit();
    const featureFlags = await handleFeatureFlagsSubmit();
    const registeredActionModulesSaveResults = await saveActionModules();

    // on any successful request, refresh page
    if ([overrideRouting, featureFlags, ...registeredActionModulesSaveResults].some(res => res)) {
      await Promise.all([revalidate(), revalidatePreHarvestReactorState()]);
    }
  };

  const handleRevert = async () => {
    await Promise.all([revalidate(), revalidatePreHarvestReactorState()]);
  };

  useEffect(() => {
    if (reactorState) {
      resetOverrideRouting();
      resetFeatureFlags();
    }
  }, [reactorState]);

  return (
    <Box
      display="flex"
      justifyContent="space-between"
      flexDirection="column"
      minHeight="100%"
      data-testid={dataTestIds.root}
    >
      <Box padding={2} flex="1" overflow="auto">
        {submitAttempted && errorList.length > 0 && (
          <Box marginBottom={2}>
            <Alert severity="error">{errorList.join(', ')}</Alert>
          </Box>
        )}
        <Box className={classes.groupLevel1}>
          <Box className={classes.groupLevel2}>
            <Switch {...featureFlagsProps} field={ROUTING_PATH_OVERRIDE_ENABLED_FIELD} label="Enable routing rules" />
            <OverrideRouting.OverrideRoutingTable {...overrideRoutingProps} />
          </Box>
          <Box className={classes.groupLevel2}>
            <Switch
              {...featureFlagsProps}
              field={PICKUP_ROBOT_ROUTING_ENABLED_FIELD}
              label="Enable pickup robot routing"
            />
          </Box>
          <Box className={classes.groupLevel2}>
            <PreHarvest.PreHarvestRouting
              reactorState={preHarvestReactorState}
              isLoading={isLoadingPreHarvestReactorState}
              registerActionModule={registerActionModule}
              reactorPath={preHarvestPath}
            />
          </Box>
        </Box>
        <Show when={showPauseBuffersActionModule}>
          <PauseBuffer.PauseBufferTables
            reactorState={reactorState}
            isLoading={isLoading}
            registerActionModule={registerActionModule}
            reactorPath={path}
          />
        </Show>
      </Box>
      <Box className={classes.footer} flex="0">
        <Button variant="contained" color="default" onClick={handleRevert} data-testid={dataTestIds.revertButton}>
          Revert
        </Button>
        <Button variant="contained" onClick={handleSave} disabled={!isDirty} data-testid={dataTestIds.saveButton}>
          Save
        </Button>
      </Box>
    </Box>
  );
};
