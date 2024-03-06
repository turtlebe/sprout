import { Box } from '@plentyag/brand-ui/src/material-ui/core';
import React from 'react';

import { ListboxHeader } from '.';

interface NoOptions {
  id: string;
}

export const NoOptions: React.FC<NoOptions> = ({ id }) => {
  return (
    <Box onMouseDown={event => event.preventDefault()}>
      <ListboxHeader id={id} />
      <Box padding={2}>No options</Box>
    </Box>
  );
};
