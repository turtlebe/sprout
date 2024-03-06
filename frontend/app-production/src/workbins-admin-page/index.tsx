import { Box, Typography } from '@plentyag/brand-ui/src/material-ui/core';
import React from 'react';
import { RouteComponentProps } from 'react-router-dom';

import { WorkbinDefinitionsTable, WorkbinTriggersTable } from './components';
import { useStyles } from './styles';

const dataTestIds = {};

export { dataTestIds as dataTestIdsWorkspacePage };

interface WorkbinsTaskDefinitionsPage {
  basePath: string; // base path of actions search page.
}

interface WorkbinsTriggersPage {
  basePath: string;
}

export const WorkbinsTaskDefinitionsPage: React.FC<RouteComponentProps<WorkbinsTaskDefinitionsPage>> = () => {
  const classes = useStyles();
  return (
    <Box className={classes.container}>
      <Typography variant="h5">Workbin Task Definitions</Typography>
      <WorkbinDefinitionsTable />
    </Box>
  );
};

export const WorkbinsTriggersPage: React.FC<RouteComponentProps<WorkbinsTriggersPage>> = () => {
  const classes = useStyles();
  return (
    <Box className={classes.container}>
      <Typography variant="h5">Workbin Triggers</Typography>
      <WorkbinTriggersTable />
    </Box>
  );
};
