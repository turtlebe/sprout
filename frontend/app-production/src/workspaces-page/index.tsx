import { Box, Typography } from '@plentyag/brand-ui/src/material-ui/core';
import React, { useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';

import { WorkbinInstancesTable, WorkbinTasks, WorkcentersPlanProgress } from './components';
import { useStyles } from './styles';

const dataTestIds = {};

export { dataTestIds as dataTestIdsWorkspacePage };

interface WorkspacesPageUrlParams {
  roleName: string;
}

export const WorkspacesPage: React.FC<RouteComponentProps<WorkspacesPageUrlParams>> = props => {
  const { roleName } = props.match.params;
  const classes = useStyles();
  const [refresh, setRefresh] = useState(0);

  function handleTaskCompleted() {
    setRefresh(refresh + 1);
  }

  return (
    <Box className={classes.container}>
      <Box py={2}>
        <Typography variant="h5" gutterBottom>
          {roleName} Workspace
        </Typography>
      </Box>

      <Box className={classes.contentContainer}>
        <WorkcentersPlanProgress workspace={roleName} />
        <WorkbinTasks workspace={roleName} onTaskCompleted={handleTaskCompleted} />
        <WorkbinInstancesTable roleName={roleName} refresh={refresh} />
      </Box>
    </Box>
  );
};
