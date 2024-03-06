import { Home } from '@material-ui/icons';
import { Box, Typography } from '@plentyag/brand-ui/src/material-ui/core';
import React from 'react';

import { useStyles } from './styles';

interface AppHome {
  appName: string;
}

export const AppHome: React.FC<AppHome> = props => {
  const classes = useStyles();
  return (
    <Box width="100%" height="100%" padding={2} display="flex" alignItems="center" justifyContent="center">
      <Box display="flex" flexDirection="column" alignItems="center">
        <Box className={classes.illustration}>
          <Home fontSize="inherit" />
          <Typography variant="h2">{props.appName}</Typography>
        </Box>
        <Typography paragraph>Start by choosing a {props.appName.toLowerCase()} module on the left.</Typography>
      </Box>
    </Box>
  );
};
