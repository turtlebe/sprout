import { Box, Typography } from '@plentyag/brand-ui/src/material-ui/core';
import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';

import { PATHS } from '../paths';

import { useStyles } from './styles';

export const PerceptionDeploymentItem: React.FC<{ path: string }> = ({ path }) => {
  const classes = useStyles();
  return (
    <div>
      <Box>
        <Typography variant="h5">
          <Box display="flex" alignItems="center">
            <Link to={PATHS.deploymentPage(path)}>{path}</Link>
            &nbsp;
            <Fragment>
              <span className={classes.deploymentStatusCircle} />
            </Fragment>
          </Box>
        </Typography>
      </Box>
    </div>
  );
};
