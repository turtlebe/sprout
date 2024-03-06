import { Search as SearchIcon } from '@material-ui/icons';
import { useGlobalSnackbar } from '@plentyag/brand-ui/src/components/global-snackbar';
import { InputAdornment, makeStyles, TextField, TextFieldProps } from '@plentyag/brand-ui/src/material-ui/core';
import { isKeyPressed } from '@plentyag/core/src/utils';
import React from 'react';

import { SearchActions, SearchState, useSearch } from '../../hooks/use-search';

export const dataTestIds = {
  textField: 'text-field',
};

const useStyles = makeStyles(theme => ({
  textField: {
    backgroundColor: theme.palette.background.paper,
    flex: '1 1 auto',
  },
}));

export const Search: React.FC = React.memo(() => {
  const classes = useStyles();
  const snackbar = useGlobalSnackbar();

  const [{ lastSearchTerm, searchError }, { search }] = useSearch<
    Pick<SearchState, 'lastSearchTerm' | 'searchError'>,
    SearchActions
  >(state => ({
    lastSearchTerm: state.lastSearchTerm,
    searchError: state.searchError,
  }));

  React.useEffect(() => {
    if (searchError && lastSearchTerm) {
      snackbar.errorSnackbar({ message: `Error searching "${lastSearchTerm}": ${searchError}` });
    }
  }, [searchError, lastSearchTerm]);

  const [internalSearchTerm, setInternalSearchTerm] = React.useState<string>('');

  const handleKeyDown: TextFieldProps['onKeyDown'] = event => {
    const { isEnterPressed } = isKeyPressed(event);
    if (isEnterPressed) {
      search(internalSearchTerm.trim());
    }
  };

  React.useEffect(() => {
    if (lastSearchTerm !== internalSearchTerm) {
      setInternalSearchTerm(lastSearchTerm || '');
    }
  }, [lastSearchTerm]);

  return (
    <TextField
      data-testid={dataTestIds.textField}
      className={classes.textField}
      variant="outlined"
      value={internalSearchTerm}
      autoFocus
      type="text"
      placeholder="Scan or enter serial/id to find resource"
      onChange={event => setInternalSearchTerm(event.target.value)}
      onKeyDown={handleKeyDown}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon />
          </InputAdornment>
        ),
      }}
    />
  );
});
