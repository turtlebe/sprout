import { BaseAgGridInfiniteTable } from '@plentyag/brand-ui/src/components/base-ag-grid-table';
import { Box, CircularProgress } from '@plentyag/brand-ui/src/material-ui/core';
import React from 'react';

import { RESOURCES_PATHS } from '../../../constants';
import { SearchActions, SearchState, useSearch } from '../../hooks/use-search';

import { useAgGridConfig } from './hooks';
import { useStyles } from './styles';

const dataTestIds = {
  root: 'history-root',
};

export { dataTestIds as dataTestIdsHistory };

export interface History {
  historyType: 'container' | 'material';
}

const HISTORY_URL = `${RESOURCES_PATHS.baseApiPath}/get-operation-history`;

export const History: React.FC<History> = ({ historyType }) => {
  const searchResult = useSearch<SearchState['searchResult'], SearchActions>(state => state.searchResult)[0];

  const [isLoading, setIsLoading] = React.useState(false);

  const classes = useStyles({ isLoading });

  const historyTableAgGridConfig = useAgGridConfig(historyType, searchResult);

  const id = historyType === 'material' ? searchResult?.materialId : searchResult?.containerId;

  if (!searchResult || !id) {
    return null;
  }

  return (
    <Box data-testid={dataTestIds.root} flex="1 1 0" display="flex" flexDirection="column" position="relative">
      <Box className={classes.overlay}>
        <CircularProgress className={classes.progress} />
      </Box>
      {historyTableAgGridConfig && (
        <BaseAgGridInfiniteTable
          agGridConfig={historyTableAgGridConfig}
          url={HISTORY_URL}
          requestMethod="POST"
          onIsLoading={setIsLoading}
          keepQueryParams={['q']}
        />
      )}
    </Box>
  );
};
