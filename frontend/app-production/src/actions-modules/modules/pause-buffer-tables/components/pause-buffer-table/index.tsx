import { ActionModule, RegisteredActionModule } from '@plentyag/app-production/src/actions-modules/types';
import { ReactorStateReturnType } from '@plentyag/app-production/src/reactors-and-tasks-detail-page/types';
import { Show } from '@plentyag/brand-ui/src/components';
import { Box, Table, TableBody, TableContainer, Typography } from '@plentyag/brand-ui/src/material-ui/core';
import { getScopedDataTestIds } from '@plentyag/core/src/utils';
import React from 'react';

import { getBufferReactorState } from '../../utils/get-buffer-reactor-state';
import { PauseBufferRow } from '../pause-buffer-row';

const dataTestIds = getScopedDataTestIds(
  {
    title: 'title',
    emptyTableMessage: 'emptyTableMessage',
  },
  'pauseBufferTable'
);

export { dataTestIds as dataTestIdsPauseBufferTable };

export interface PauseBufferTable {
  title: string;
  isLoading: boolean;
  bufferPaths: string[];
  reactorState: ReactorStateReturnType;
  reactorPath: string;
  registerActionModule: (module: RegisteredActionModule) => void;
  actionModule: ActionModule;
}

export const PauseBufferTable: React.FC<PauseBufferTable> = ({
  title,
  bufferPaths,
  reactorState,
  isLoading,
  registerActionModule,
  actionModule,
  reactorPath,
}) => {
  const buffers = bufferPaths
    .map(bufferPath => {
      const isPausable = getBufferReactorState(bufferPath, reactorState)?.outflowPausable;
      if (!isPausable) {
        return null;
      }

      return (
        <PauseBufferRow
          key={bufferPath}
          bufferName={bufferPath.split('/').pop()}
          actionModule={actionModule}
          registerActionModule={registerActionModule}
          reactorState={reactorState}
          bufferPath={bufferPath}
          isLoading={isLoading}
          reactorPath={reactorPath}
        />
      );
    })
    .filter(Boolean);

  return (
    <Box>
      <Typography data-testid={dataTestIds.title} variant="subtitle1" style={{ marginBottom: '5px' }}>
        Pausable {title} Buffers
      </Typography>
      <Show
        fallback={<Typography data-testid={dataTestIds.emptyTableMessage}>There are no pausable buffers.</Typography>}
        when={buffers.length > 0}
      >
        <TableContainer>
          <Table size="small">
            <TableBody>{buffers}</TableBody>
          </Table>
        </TableContainer>
      </Show>
    </Box>
  );
};
