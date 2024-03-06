import { SideNavLayout, SideNavTreeNode } from '@plentyag/brand-ui/src/components/side-nav-layout';
import { map } from 'lodash';
import React from 'react';
import { Redirect, Route, Switch, useRouteMatch } from 'react-router-dom';

interface QualityAppRouter {
  treeRoot: SideNavTreeNode;
  routes: SideNavLayout['routes'];
}

/**
 * This component is shared among quality pages (currently tigris and euphrates).
 * This allows each set of pages to have their own routes and left nav structure and
 * also show the "GlobalSelectFarm" component in each (enabled via: "showGlobalSelectFarm").
 */
export const QualityAppRouter: React.FC<QualityAppRouter> = ({ treeRoot, routes }) => {
  const { url: basePath } = useRouteMatch();

  return (
    <Switch>
      {/* Render all routes defined through SideNavLayout */}
      {map(routes, (route, index) => (
        <Route
          key={index}
          path={route.path}
          render={routeProps => (
            <SideNavLayout showGlobalSelectFarm routes={routes} treeRoot={treeRoot} {...routeProps} />
          )}
          exact
        />
      ))}

      {/* Redirect to "/quality" if not route matches */}
      <Route path={basePath} render={() => <Redirect to={'/quality'} />} />
    </Switch>
  );
};
