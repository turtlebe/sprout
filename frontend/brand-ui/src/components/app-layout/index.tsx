import { Box, LinearProgress } from '@plentyag/brand-ui/src/material-ui/core';
import React from 'react';

import { useStyles } from './styles';

const dataTestIds = {
  root: 'app-layout-root',
};

export { dataTestIds as dataTestIdsAppLayout };
interface AppLayout {
  isLoading?: boolean;
  'data-testid'?: string;
}

export const AppLayout: React.FC<AppLayout> = ({ isLoading, children, 'data-testid': dataTestId }) => {
  const classes = useStyles({ isLoading });
  return (
    <>
      <LinearProgress className={classes.linearProgress} />
      <Box className={classes.container} data-testid={dataTestId || dataTestIds.root}>
        {children}
      </Box>
    </>
  );
};
