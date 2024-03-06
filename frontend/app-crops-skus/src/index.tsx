import { SideNavLayout } from '@plentyag/brand-ui/src/components/side-nav-layout';
import { map } from 'lodash';
import React from 'react';
import { Redirect, Route, Switch, useRouteMatch } from 'react-router-dom';

import { useSideNavTree } from './common/hooks/use-side-nav-tree';
import { ROUTES } from './constants';
import { cropsRoutes } from './routes';

export const CropsSkus: React.FC = () => {
  const treeRoot = useSideNavTree();
  const { path } = useRouteMatch();

  document.title = 'FarmOS - Crops';
  return (
    <Switch>
      {/* Render all routes defined through SideNavLayout */}
      {map(cropsRoutes, (route, index) => (
        <Route
          key={index}
          path={route.path}
          render={routeProps => <SideNavLayout routes={cropsRoutes} treeRoot={treeRoot} {...routeProps} />}
          exact
        />
      ))}

      {/* Redirect to "/crops-skus" if not route matches */}
      <Route path={path} render={() => <Redirect to={ROUTES.home} />} />
    </Switch>
  );
};
