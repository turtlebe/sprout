import { Box, LinearProgress, Typography } from '@plentyag/brand-ui/src/material-ui/core';
import React from 'react';

import { useGetState } from '../../hooks';
import { ReactorPath, ReactorStateReturnType } from '../../types';
import { dataTestIdsTaskOrReactorStateJsonView, TaskOrReactorStateJsonView } from '../task-or-reactor-state-json-view';

import { useStyles } from './styles';

const dataTestIds = {
  noState: 'reactor-state-no-state-for-reactor',
  noReactorPath: 'reactor-state-no-reactor-path-provided',
  jsonView: dataTestIdsTaskOrReactorStateJsonView.jsonView,
};

export { dataTestIds as dataTestIdsReactorState };

export interface ReactorState {
  reactorPath?: ReactorPath;
}

export const ReactorState: React.FC<ReactorState> = ({ reactorPath }) => {
  const {
    data: reactorStateReturnValue,
    isLoading,
    error,
  } = useGetState<ReactorStateReturnType>({
    axiosRequestConfig: reactorPath && {
      url: `/api/plentyservice/executive-service/get-reactor-state/${reactorPath}`,
    },
    errorTitle: 'Error loading reactor state',
  });

  const classes = useStyles({ isLoading });

  return (
    <Box className={classes.container}>
      <LinearProgress className={classes.linearProgress} />
      <TaskOrReactorStateJsonView state={reactorStateReturnValue?.state} reactorPath={reactorPath} />
      {reactorPath && !reactorStateReturnValue && !isLoading && !error && (
        <Typography data-testid={dataTestIds.noState}>No state for selected reactor</Typography>
      )}
      {!reactorPath && (
        <Typography data-testid={dataTestIds.noReactorPath}>
          To view reactor state select a reactor path above.
        </Typography>
      )}
    </Box>
  );
};
