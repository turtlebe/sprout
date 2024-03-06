import { useGlobalSnackbar } from '@plentyag/brand-ui/src/components/global-snackbar';
import { Box, CircularProgress, Typography } from '@plentyag/brand-ui/src/material-ui/core';
import { parseErrorMessage } from '@plentyag/core/src/utils/parse-error-message';
import React from 'react';

import { SearchActions, SearchState, useSearch } from '../../hooks/use-search';

import { GenealogyChart } from './components/genealogy-chart';
import { Legend } from './components/legend';
import { useGenealogy } from './hooks/use-genealogy';
import { useStyles } from './styles';

export const dataTestIds = {
  noMaterialMessage: 'no-material-message',
};

export const Genealogy: React.FC = React.memo(() => {
  const searchResult = useSearch<SearchState['searchResult'], SearchActions>(state => state.searchResult)[0];

  const materialId = searchResult?.materialId;

  const { isLoading, data: focusedResource, error } = useGenealogy(materialId);

  const snackbar = useGlobalSnackbar();

  const classes = useStyles({ isLoading });

  React.useEffect(() => {
    if (error) {
      snackbar.errorSnackbar({ message: parseErrorMessage(error) });
    }
  }, [error]);

  return (
    <Box flex="1 1 auto" display="flex" flexDirection="column" position="relative">
      <Box className={classes.overlay}>
        <CircularProgress className={classes.progress} />
      </Box>

      <Box>
        {!materialId && (
          <Typography data-testid={dataTestIds.noMaterialMessage} variant="h6">
            Resource must have a material to display genealogy.
          </Typography>
        )}
      </Box>

      {focusedResource && (
        <>
          <GenealogyChart focusedResource={focusedResource} />
          <Legend focusedResource={focusedResource} />
        </>
      )}
    </Box>
  );
});
