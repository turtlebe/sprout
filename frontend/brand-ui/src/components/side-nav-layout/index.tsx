import { Box } from '@plentyag/brand-ui/src/material-ui/core';
import { map } from 'lodash';
import React from 'react';
import { Route, RouteComponentProps, RouteProps, Switch } from 'react-router-dom';

import { GlobalSelectFarm } from '../global-select-farm';

import {
  CollapsableDrawer,
  dataTestIds as collapsableDrawerDataTestIds,
  DEFAULT_DRAWER_WIDTH,
} from './collapsable-drawer';
import { SideNavTreeNode } from './side-nav-tree-node';
import { useStyles } from './styles';
import { TreeView } from './tree-view';

const dataTestIds = {
  drawer: collapsableDrawerDataTestIds.drawer,
};

export { dataTestIds as dataTestIdsSideNavLayout };

/**
 * Export TreeNode to allow other apps to re-use it.
 */
export { SideNavTreeNode } from './side-nav-tree-node';

export interface SideNavLayout extends RouteComponentProps {
  routes: { [key: string]: RouteProps };
  treeRoot: SideNavTreeNode;
  drawerWidth?: string;
  showSideNav?: boolean;
  showGlobalSelectFarm?: boolean;
}

export const SideNavLayout: React.FC<SideNavLayout> = ({
  match,
  routes,
  treeRoot,
  drawerWidth = DEFAULT_DRAWER_WIDTH,
  showSideNav = true,
  showGlobalSelectFarm = false,
}) => {
  const [open, setOpen] = React.useState<boolean>(true);
  const classes = useStyles({ drawerWidth, open });
  const treePaths = treeRoot.getTreePath(match);
  const handleToggle = React.useCallback(() => setOpen(!open), [open]);

  return (
    <Box display="flex" height="100%">
      {showSideNav && (
        <CollapsableDrawer open={open} onToggle={handleToggle} drawerWidth={drawerWidth}>
          <Box display="flex" flexDirection="column" flexGrow="1">
            {showGlobalSelectFarm && (
              <Box m="1.5rem 1.5rem 0 1rem">
                <GlobalSelectFarm />
              </Box>
            )}
            <TreeView treeRoot={treeRoot} treePaths={treePaths} />
          </Box>
        </CollapsableDrawer>
      )}
      <Box className={classes.body}>
        <Switch>
          {map(routes, (route, index) => (
            <Route key={index} {...route} exact />
          ))}
        </Switch>
      </Box>
    </Box>
  );
};
