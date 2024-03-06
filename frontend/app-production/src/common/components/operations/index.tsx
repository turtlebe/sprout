import { Show } from '@plentyag/brand-ui/src/components';
import { Box, Button, CircularProgress } from '@plentyag/brand-ui/src/material-ui/core';
import React from 'react';

import { useGetOperationsPaths } from '../../hooks';

const dataTestIds = {
  operationButton: 'operations-button',
  loadingProgress: 'operations-loading-progress',
};

export { dataTestIds as dataTestIdsOperations };

export interface Operations {
  selectOperation: React.Dispatch<React.SetStateAction<ProdActions.Operation>>;
  siteName: string;
  allowedOperations: ProdActions.AllowedOperation[];
  areOperationsEnabled: boolean;
}

// Generates a list of buttons - one for each resource operation that is found in farm def site.
export const Operations: React.FC<Operations> = ({
  selectOperation,
  siteName,
  allowedOperations,
  areOperationsEnabled,
}) => {
  // get farm def paths (if they exist) for each allowed operation.
  const allowedOperationNames = allowedOperations.map(allowedOperations => allowedOperations.name);
  const { isLoading, operationPaths } = useGetOperationsPaths(allowedOperationNames, 'request', siteName);

  const buttons: JSX.Element[] = [];

  // from found operation paths, create operation that can be performed.
  operationPaths.forEach((operationPath, operationName) => {
    const allowedOperation = allowedOperations.find(allowedOperation => allowedOperation.name === operationName);
    if (allowedOperation) {
      const operation = {
        ...allowedOperation,
        path: operationPath,
      };

      buttons.push(
        <Button
          data-testid={dataTestIds.operationButton}
          disabled={isLoading || !areOperationsEnabled}
          key={operation.displayName}
          style={{ margin: '0.25rem' }}
          variant="contained"
          onClick={() => selectOperation(operation)}
        >
          {allowedOperation.displayName}
        </Button>
      );
    }
  });

  return (
    <Box display="flex" alignItems="right" flexWrap="wrap" justifyContent="flex-end">
      <Show
        when={!isLoading}
        fallback={
          <Box mx={1}>
            <CircularProgress data-testid={dataTestIds.loadingProgress} size="1.5rem" />
          </Box>
        }
      >
        {buttons}
      </Show>
    </Box>
  );
};
