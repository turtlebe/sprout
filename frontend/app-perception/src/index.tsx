import { SideNavLayout } from '@plentyag/brand-ui/src/components';
import { Box, CircularProgress } from '@plentyag/brand-ui/src/material-ui/core';
import { useFetchMeasurementTypes } from '@plentyag/core/src/hooks';
import { map } from 'lodash';
import React from 'react';
import { Redirect, Route, Switch, useRouteMatch } from 'react-router-dom';

import { useSideNavTree } from './common/hooks/use-side-nav-tree';
import { PATHS } from './paths';
import { perceptionRoutes } from './routes';

export const Perception: React.FC = () => {
  const treeRoot = useSideNavTree();
  const { path } = useRouteMatch();
  const { isLoading } = useFetchMeasurementTypes();

  document.title = 'FarmOS - Perception';
  return isLoading ? (
    <Box display="flex" alignItems="center" justifyContent="center" height="100%">
      <CircularProgress size="2rem" />
    </Box>
  ) : (
    <Switch>
      {/* Render all routes defined through SideNavLayout */}
      {map(perceptionRoutes, (route, index) => (
        <Route
          key={index}
          path={route.path}
          render={routeProps => <SideNavLayout routes={perceptionRoutes} treeRoot={treeRoot} {...routeProps} />}
          exact
        />
      ))}

      <Route path={path} render={() => <Redirect to={PATHS.dashboardPage} />} />
    </Switch>
  );
};
