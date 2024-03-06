import { SideNavLayout } from '@plentyag/brand-ui/src/components';
import { Box, CircularProgress } from '@plentyag/brand-ui/src/material-ui/core';
import { useFetchMeasurementTypes } from '@plentyag/core/src/hooks';
import { map } from 'lodash';
import React from 'react';
import { Redirect, Route, Switch, useRouteMatch } from 'react-router-dom';

import { useSideNavTree } from './common/hooks/use-side-nav-tree';
import { PATHS } from './paths';
import { environmentRoutes } from './routes';

export const Environment: React.FC = () => {
  const treeRoot = useSideNavTree();
  const { path } = useRouteMatch();
  const { isLoading } = useFetchMeasurementTypes();

  document.title = 'FarmOS - Environment V2';
  return isLoading ? (
    <Box display="flex" alignItems="center" justifyContent="center" height="100%">
      <CircularProgress size="2rem" />
    </Box>
  ) : (
    <Switch>
      {/* Render all routes defined through SideNavLayout */}
      {map(environmentRoutes, (route, index) => (
        <Route
          key={index}
          path={route.path}
          render={routeProps => <SideNavLayout routes={environmentRoutes} treeRoot={treeRoot} {...routeProps} />}
          exact
        />
      ))}

      {/* Catch all redireting to MetricsPage if the route does not exist */}
      <Route path={path} render={() => <Redirect to={PATHS.metricsPage} />} />
    </Switch>
  );
};
