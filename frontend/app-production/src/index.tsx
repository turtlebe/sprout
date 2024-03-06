import { SideNavLayout } from '@plentyag/brand-ui/src/components/side-nav-layout';
import { isIgnition } from '@plentyag/core/src/utils/is-ignition';
import { map } from 'lodash';
import React from 'react';
import { Redirect, Route, Switch, useRouteMatch } from 'react-router-dom';

import { AppPathsProvider, useAppPaths } from './common/hooks/use-app-paths';
import { useAppRoutes } from './common/hooks/use-app-routes';
import { useSideNavTree } from './common/hooks/use-side-nav-tree';

const ProductionRoutes: React.FC = () => {
  const { basePath } = useAppPaths();
  const treeRoot = useSideNavTree();
  const productionRoutes = useAppRoutes();

  return (
    <Switch>
      {/* Render all routes defined through SideNavLayout */}
      {map(productionRoutes, (route, index) => (
        <Route
          key={index}
          path={route.path}
          render={routeProps => (
            <SideNavLayout
              showGlobalSelectFarm={true}
              showSideNav={!isIgnition()}
              drawerWidth="310px"
              routes={productionRoutes}
              treeRoot={treeRoot}
              {...routeProps}
            />
          )}
          exact
        />
      ))}

      {/* Redirect to AppHome if no route matches */}
      <Route path={basePath} render={() => <Redirect to={'/production'} />} />
    </Switch>
  );
};

export const Production: React.FC = () => {
  const { url: basePath } = useRouteMatch();

  document.title = 'FarmOS - Production';

  return (
    <AppPathsProvider basePath={basePath}>
      <ProductionRoutes />
    </AppPathsProvider>
  );
};
