import { SideNavLayout } from '@plentyag/brand-ui/src/components/side-nav-layout';
import { isIgnition } from '@plentyag/core/src/utils/is-ignition';
import { map } from 'lodash';
import React from 'react';
import { Redirect, Route, Switch, useRouteMatch } from 'react-router-dom';

import { useSideNavTree } from './common/hooks/use-side-nav-tree';
import { routes as getProductionAdminRoutes } from './routes';

export const ProductionAdmin: React.FC = () => {
  const { url: basePath } = useRouteMatch();
  const treeRoot = useSideNavTree(basePath);

  const productionAdminRoutes = getProductionAdminRoutes(basePath);
  document.title = 'FarmOS - Production Admin';
  return (
    <Switch>
      {/* Render all routes defined through SideNavLayout */}
      {map(productionAdminRoutes, (route, index) => (
        <Route
          key={index}
          path={route.path}
          render={routeProps => (
            <SideNavLayout
              showGlobalSelectFarm={true}
              showSideNav={!isIgnition()}
              routes={productionAdminRoutes}
              treeRoot={treeRoot}
              {...routeProps}
            />
          )}
          exact
        />
      ))}

      {/* Redirect to AppHome if no route matches */}
      <Route path={basePath} render={() => <Redirect to={'/production-admin'} />} />
    </Switch>
  );
};
