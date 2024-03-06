import { SideNavTreeNode } from '@plentyag/brand-ui/src/components/side-nav-layout';

import { PATHS } from '../../paths';
import { perceptionRoutes } from '../../routes';

export const useSideNavTree = (): SideNavTreeNode => {
  const rootNode = new SideNavTreeNode({ name: 'Perception' });

  rootNode.addNode({
    name: 'Dashboard',
    route: perceptionRoutes.AlertEvents,
    href: PATHS.dashboardPage,
  });

  rootNode.addNode({
    name: 'Search',
    route: perceptionRoutes.SettingsPage,
    href: PATHS.searchPage,
  });

  return rootNode;
};
