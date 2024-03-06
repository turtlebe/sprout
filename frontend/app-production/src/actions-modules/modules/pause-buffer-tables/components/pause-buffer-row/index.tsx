import { useActionModule } from '@plentyag/app-production/src/actions-modules/hooks';
import { PauseBufferTablesSerializers } from '@plentyag/app-production/src/actions-modules/serializers';
import { CapacityGauge } from '@plentyag/app-production/src/actions-modules/shared/components';
import { ActionModule, RegisteredActionModule } from '@plentyag/app-production/src/actions-modules/types';
import { ReactorStateReturnType } from '@plentyag/app-production/src/reactors-and-tasks-detail-page/types';
import { Box, TableCell, TableRow } from '@plentyag/brand-ui/src/material-ui/core';
import { useCoreStore } from '@plentyag/core/src/core-store';
import { getScopedDataTestIds } from '@plentyag/core/src/utils';
import React from 'react';

import { getBufferReactorState } from '../../utils/get-buffer-reactor-state';
import { PauseBufferDropDown } from '../pause-buffer-drop-down';

const dataTestIds = getScopedDataTestIds(
  {
    bufferName: 'bufferName',
  },
  'pauseBufferRow'
);

export { dataTestIds as dataTestIdsPauseBufferRow };

export interface PauseBufferRow {
  bufferName: string;
  actionModule: ActionModule;
  isLoading: boolean;
  bufferPath: string;
  reactorState: ReactorStateReturnType;
  registerActionModule: (module: RegisteredActionModule) => void;
  reactorPath: string;
}

export const PauseBufferRow: React.FC<PauseBufferRow> = ({
  bufferName,
  actionModule,
  bufferPath,
  isLoading,
  reactorState,
  registerActionModule,
  reactorPath,
}) => {
  const reactorStateForBufferPath = React.useMemo(() => {
    return { state: getBufferReactorState(bufferPath, reactorState) };
  }, [bufferPath, reactorState]);

  const [coreState] = useCoreStore();

  const { actionModuleProps, handleSubmit } = useActionModule({
    actionModule,
    path: reactorPath,
    getDataModel: actionModel =>
      PauseBufferTablesSerializers.getDataModelFromReactorState(actionModel, reactorStateForBufferPath, coreState),
    isLoading,
  });

  React.useEffect(() => {
    if (actionModuleProps && handleSubmit) {
      registerActionModule({ name: `${bufferPath}/${actionModule.actionName}`, actionModuleProps, handleSubmit });
    }
  }, [registerActionModule, actionModuleProps, handleSubmit]);

  const currentCarrierCount = reactorStateForBufferPath.state?.['carrierIds']?.length || 0;

  return (
    <TableRow>
      <TableCell data-testid={dataTestIds.bufferName}>
        <Box>{bufferName}</Box>
        <Box>
          <CapacityGauge farmDefObjectPath={bufferPath} containerType="CARRIER" propertyKey="capacity" />
        </Box>
      </TableCell>
      <TableCell>
        <PauseBufferDropDown {...actionModuleProps} currentCarrierCount={currentCarrierCount} />
      </TableCell>
    </TableRow>
  );
};
