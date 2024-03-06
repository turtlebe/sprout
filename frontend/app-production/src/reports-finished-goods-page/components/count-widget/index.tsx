import { Box, Paper, Typography } from '@plentyag/brand-ui/src/material-ui/core';
import React from 'react';

import { useStyles } from './styles';

const dataTestIds = {
  root: 'count-widget-root',
  name: 'count-widget-name',
  value: 'count-widget-value',
};

export { dataTestIds as dataTestIdsCountWidget };

export interface CountWidget {
  name: string;
  value: number;
  'data-testid'?: string;
}

export const CountWidget: React.FC<CountWidget> = ({ name, value = 0, 'data-testid': dataTestId }) => {
  const classes = useStyles();
  return (
    <Paper className={classes.root} data-testid={dataTestId ?? dataTestIds.root}>
      <Box className={classes.container}>
        <Typography variant="overline" className={classes.name} data-testid={dataTestIds.name}>
          {name}
        </Typography>
        <Typography className={classes.value} data-testid={dataTestIds.value}>
          {value}
        </Typography>
      </Box>
    </Paper>
  );
};
