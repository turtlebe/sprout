import { Box } from '@plentyag/brand-ui/src/material-ui/core';
import React from 'react';

import { StyleProps, useStyles } from './styles';

const dataTestIds = {
  header: 'header',
};

export { dataTestIds as dataTestIdsAppHeader };

export interface AppHeader extends StyleProps {}

export const AppHeader: React.FC<AppHeader> = ({
  flexDirection,
  justifyContent,
  alignItems,
  paddingBottom,
  children,
}) => {
  const classes = useStyles({ flexDirection, justifyContent, alignItems, paddingBottom });

  return (
    <Box data-testid={dataTestIds.header} className={classes.root}>
      {children}
    </Box>
  );
};
