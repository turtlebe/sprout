import { SideNavLayout } from '@plentyag/brand-ui/src/components';
import { Box, CircularProgress } from '@plentyag/brand-ui/src/material-ui/core';
import { useFetchMeasurementTypes } from '@plentyag/core/src/hooks';
import { map } from 'lodash';
import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

import { useFetchTagProviders } from './common/hooks';
import { useSideNavTree } from './common/hooks/use-side-nav-tree';
import { PATHS } from './paths';
import { ignitionTagRegistryRoutes } from './routes';

export const IgnitionTagRegistry: React.FC = () => {
  const treeRoot = useSideNavTree();
  const { isLoading: isMeasurementTypesLoading } = useFetchMeasurementTypes();
  const { isLoading: isTagProvidersLoading } = useFetchTagProviders();

  document.title = 'FarmOS - Ignition Tag Registry V2';
  return isMeasurementTypesLoading || isTagProvidersLoading ? (
    <Box display="flex" alignItems="center" justifyContent="center" height="100%">
      <CircularProgress size="2rem" />
    </Box>
  ) : (
    <Switch>
      {map(ignitionTagRegistryRoutes, (route, index) => (
        <Route
          key={index}
          path={route.path}
          render={routeProps => (
            <SideNavLayout routes={ignitionTagRegistryRoutes} treeRoot={treeRoot} {...routeProps} />
          )}
          exact
        />
      ))}

      {/* Catch all redireting to TagsPage if the route does not exist */}
      <Route path={PATHS.tagsPage} render={() => <Redirect to={PATHS.tagsPage} />} />
    </Switch>
  );
};
