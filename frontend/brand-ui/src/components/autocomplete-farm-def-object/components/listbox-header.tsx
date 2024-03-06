import { ArrowBack, Done } from '@material-ui/icons';
import { Box, IconButton, Typography } from '@plentyag/brand-ui/src/material-ui/core';
import React from 'react';
import { titleCase } from 'voca';

import { useAutocompleteFarmDefObjectStore } from '../hooks';
import { getAllDirectKinds } from '../utils';

export const dataTestIdsListboxHeader = {
  listboxHeader: 'autocomplete-listbox-component-header',
  backButton: 'autocomplete-listbox-component-back-button',
  closeButton: 'autocomplete-listbox-component-close-button',
};

interface ListboxHeader {
  id: string;
}

export const ListboxHeader: React.FC<ListboxHeader> = ({ id }) => {
  const [state, actions] = useAutocompleteFarmDefObjectStore(id);
  const { selectedFarmDefObject } = state;

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      borderTop="1px solid #eeeeee"
      borderBottom="1px solid #eeeeee"
      paddingX={1}
    >
      <IconButton
        data-testid={dataTestIdsListboxHeader.backButton}
        size="small"
        disabled={selectedFarmDefObject === null}
        onClick={() => actions.goBackToParent()}
        icon={ArrowBack}
      />
      <Typography data-testid={dataTestIdsListboxHeader.listboxHeader}>
        {selectedFarmDefObject ? getAllDirectKinds(selectedFarmDefObject).map(titleCase).join(' & ') : 'Sites'}
      </Typography>
      <IconButton
        data-testid={dataTestIdsListboxHeader.closeButton}
        size="small"
        onClick={() => actions.setIsOpen(false)}
        icon={Done}
      />
    </Box>
  );
};
