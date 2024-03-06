import {
  ActionModule,
  ActionRequestType,
  RegisterActionModuleProps,
} from '@plentyag/app-production/src/actions-modules/types';
import { Box, CircularProgress } from '@plentyag/brand-ui/src/material-ui/core';
import { getScopedDataTestIds } from '@plentyag/core/src/utils';
import React from 'react';

import { PauseBufferTable } from './components/pause-buffer-table';
import { useStyles } from './styles';
import { BufferCategories, mapBufferNameToCategory } from './types';

export const actionName = 'PauseBufferOutflow';
export const actionRequestType: ActionRequestType = 'Requests';

const dataTestIds = getScopedDataTestIds({ loading: 'loading' }, 'PausePlayBuffer');
export { dataTestIds as dataTestIdsPauseBufferTables };

/**
 * This component displays a table for each buffer category that can be paused.
 * Currently there are three categories: loading, empty and unloading.
 * Each table contains a list of buffers that can be paused.
 */
export const PauseBufferTables: React.FC<RegisterActionModuleProps> = React.memo(
  ({ reactorState, isLoading, registerActionModule, reactorPath }) => {
    const classes = useStyles({});

    if (isLoading) {
      return <CircularProgress data-testid={dataTestIds.loading} />;
    }

    const bufferPaths = Object.keys(reactorState?.state?.buffersStates?.bufferPathToBufferStateMap || {});

    const actionModule: ActionModule = {
      actionName,
      actionRequestType,
    };

    return (
      <Box display="flex" flexDirection="row">
        {Object.values(BufferCategories).map(category => {
          const bufferPathsInCategory = bufferPaths.filter(bufferPath => {
            const bufferName = bufferPath.split('/').pop();
            return mapBufferNameToCategory[bufferName] === category;
          });
          return (
            <Box key={category} className={classes.category}>
              <PauseBufferTable
                actionModule={actionModule}
                registerActionModule={registerActionModule}
                title={category}
                isLoading={isLoading}
                reactorState={reactorState}
                reactorPath={reactorPath}
                bufferPaths={bufferPathsInCategory}
              />
            </Box>
          );
        })}
      </Box>
    );
  }
);
