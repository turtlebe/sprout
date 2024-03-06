import { SideNavTreeNode } from '@plentyag/brand-ui/src/components/side-nav-layout';

import { PATHS } from '../../paths';
import { environmentRoutes } from '../../routes';

export const useSideNavTree = (): SideNavTreeNode => {
  const rootNode = new SideNavTreeNode({ name: 'Environment' });

  rootNode.addNode({
    name: 'Alerts',
    route: environmentRoutes.AlertEvents,
    href: PATHS.alertEventsPage,
  });

  rootNode.addNode({
    name: 'All Metrics',
    route: environmentRoutes.MetricsPage,
    href: PATHS.metricsPage,
  });

  rootNode.addNode({
    name: 'Favorite Metrics',
    route: environmentRoutes.FavoriteMetricsPage,
    href: PATHS.favoriteMetricsPage,
  });

  rootNode.addNode({
    name: 'All Dashboards',
    route: environmentRoutes.DashboardsPage,
    href: PATHS.dashboardsPage,
  });
  rootNode.addNode({
    name: 'Favorite Dashboards',
    route: environmentRoutes.FavoriteDashboardsPage,
    href: PATHS.favoriteDashboardsPage,
  });

  rootNode.addNode({
    name: 'Schedules',
    route: environmentRoutes.SchedulesPage,
    href: PATHS.schedulesPage,
  });

  rootNode.addNode({
    name: 'Settings',
    route: environmentRoutes.SettingsPage,
    href: PATHS.settingsPage,
  });

  return rootNode;
};
