import { useGlobalSnackbar } from '@plentyag/brand-ui/src/components/global-snackbar';
import { Box, LinearProgress, TextField, Typography } from '@plentyag/brand-ui/src/material-ui/core';
import { useCoreStore } from '@plentyag/core/src/core-store';
import { MethodTypes } from '@plentyag/core/src/farm-def/types';
import { useSwrAxios } from '@plentyag/core/src/hooks/use-swr-axios';
import { getShortenedPath } from '@plentyag/core/src/utils';
import { sortBy } from 'lodash';
import React from 'react';

import { ACTIONS_PATHS } from '../constants';

import { ActionCard } from './components';
import { useStyles } from './styles';

const dataTestIds = {
  cards: 'action-search-page-cards',
  searchTerm: 'action-search-page-search-term-subset',
  noMatchMessage: 'action-search-page-no-match-message',
  header: 'action-search-page-header',
};

export { dataTestIds as dataTestIdsActionSearchPage };

export interface Action {
  name: string;
  description: string;
  path: string;
  type: MethodTypes;
}

// get only tells and requests for action search page.
const defaultUrlQuery = '?method-types[]=tell&method-types[]=request';

export const ActionsSearchPage: React.FC = () => {
  const [{ currentUser }] = useCoreStore();
  const currentFarmDefPath = currentUser.currentFarmDefPath;

  const snackbar = useGlobalSnackbar();

  const [searchTerm, setSearchTerm] = React.useState<string>('');

  const allActions = useSwrAxios<Action[]>({
    url: currentFarmDefPath && `${ACTIONS_PATHS.baseApiPath}/all/${currentFarmDefPath}${defaultUrlQuery}`,
  });

  React.useEffect(() => {
    if (allActions.error) {
      snackbar.errorSnackbar({ title: 'Error loading site actions', message: allActions.error.toString() });
    }
  }, [allActions.error]);

  const isLoading = allActions.isValidating;
  const classes = useStyles({
    isLoading,
  });

  const sortedActions = sortBy(allActions.data || [], ['name']);
  const actionCards = sortedActions.reduce((accum, currAction) => {
    if (
      !searchTerm ||
      currAction.path.toLowerCase().includes(searchTerm) ||
      currAction.name.toLowerCase().includes(searchTerm)
    ) {
      accum.push(<ActionCard key={currAction.path} action={currAction} />);
    }
    return accum;
  }, []);

  return (
    <>
      <LinearProgress className={classes.linearProgress} />
      <Box className={classes.container}>
        <Typography variant="h5" data-testid={dataTestIds.header}>
          {currentFarmDefPath && `Search for actions in ${getShortenedPath(currentFarmDefPath)}`}
        </Typography>
        <Box display="flex" flexDirection="row">
          <TextField
            data-testid={dataTestIds.searchTerm}
            className={classes.search}
            label="Search by Name"
            onChange={event => setSearchTerm(event.target.value.toLocaleLowerCase())}
          />
        </Box>
        <Box className={classes.contentContainer}>
          {actionCards.length > 0 ? (
            <Box px={2} className={classes.cardsContainer} data-testid={dataTestIds.cards}>
              {actionCards}
            </Box>
          ) : (
            !isLoading && (
              <Box m={3}>
                <Typography data-testid={dataTestIds.noMatchMessage} variant="h6">
                  No actions for site/farm
                </Typography>
              </Box>
            )
          )}
        </Box>
      </Box>
    </>
  );
};
