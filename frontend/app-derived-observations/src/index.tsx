import { SideNavLayout } from '@plentyag/brand-ui/src/components';
import { Box, CircularProgress } from '@plentyag/brand-ui/src/material-ui/core';
import { useFetchMeasurementTypes, useFetchObservationGroups } from '@plentyag/core/src/hooks';
import { map } from 'lodash';
import React from 'react';
import { Redirect, Route, Switch, useRouteMatch } from 'react-router-dom';

import { useSideNavTree } from './common/hooks/use-side-nav-tree';
import { PATHS } from './paths';
import { derivedObservationsRoutes } from './routes';

export const DerivedObservations: React.FC = () => {
  const treeRoot = useSideNavTree();
  const { path } = useRouteMatch();
  const { isLoading: isLoadingMeasurementTypes } = useFetchMeasurementTypes();
  const { isLoading: isLoadingObservationGroups } = useFetchObservationGroups();

  document.title = 'FarmOS - Derived Observations';
  return isLoadingMeasurementTypes || isLoadingObservationGroups ? (
    <Box display="flex" alignItems="center" justifyContent="center" height="100%">
      <CircularProgress size="2rem" />
    </Box>
  ) : (
    <Switch>
      {/* Render all routes defined through SideNavLayout */}
      {map(derivedObservationsRoutes, (route, index) => (
        <Route
          key={index}
          path={route.path}
          render={routeProps => (
            <SideNavLayout routes={derivedObservationsRoutes} treeRoot={treeRoot} {...routeProps} />
          )}
          exact
        />
      ))}

      {/* Catch all redireting to BaseObservationDefinitionsPage if the route does not exist */}
      <Route path={path} render={() => <Redirect to={PATHS.baseObservationDefinitionsPage} />} />
    </Switch>
  );
};
