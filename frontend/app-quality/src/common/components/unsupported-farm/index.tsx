import { SideNavTreeNode } from '@plentyag/brand-ui/src/components/side-nav-layout';
import { Box, Typography } from '@plentyag/brand-ui/src/material-ui/core';
import React from 'react';

import { QualityAppRouter } from '../quality-app-router';

const dataTestIds = {
  root: 'unsupported-farm-root',
};

export { dataTestIds as dataTestIdsUnsupportedFarm };

/**
 * This component shows when a user selects site/farm that is not supported by the
 * current quality app.
 */
export const UnsupportedFarm: React.FC = () => {
  const routes = {
    QualityUnsupportedFarm: {
      path: '*',
      component: () => {
        return (
          <Box data-testid={dataTestIds.root} m={4} display="flex" flexDirection="column" alignItems="center">
            <Typography variant="h5">The currently selected farm is not supported by the Quality app.</Typography>
            <Typography variant="h6">Please select a new site/farm.</Typography>
          </Box>
        );
      },
    },
  };

  const rootNode = new SideNavTreeNode({ name: 'Quality-Unsupported-Farm-View' });

  return <QualityAppRouter treeRoot={rootNode} routes={routes} />;
};
