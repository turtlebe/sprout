import { ErrorOutline } from '@material-ui/icons';
import { Box, Card, Typography } from '@plentyag/brand-ui/src/material-ui/core';
import React from 'react';

export interface NotFound {
  title: string;
  'data-testid'?: string;
}

export const NotFound: React.FC<NotFound> = ({ title, 'data-testid': dataTestId }) => {
  return (
    <Box display="flex" alignItems="center" justifyContent="center" height="100%" data-testid={dataTestId}>
      <Card>
        <Box display="flex" alignItems="center" justifyContent="center" padding={2}>
          <ErrorOutline />
          <Box padding={0.5} />
          <Typography variant="h5">{title}</Typography>
        </Box>
      </Card>
    </Box>
  );
};
