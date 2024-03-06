import { SideNavLayout } from '@plentyag/brand-ui/src/components';

import { DashboardPage } from './dashboard-page';
import { PATHS } from './paths';
import { PerceptionDeploymentExpansionPage } from './perception-deployment-expansion-page';
import { SearchPage } from './search-page';

/**
 * Declare all react-router-dom Route and their associated Component.
 *
 * This mapping is used in app-environment/index.tsx and required for using @plentya/brand-ui/src/components/side-nav-layout
 */
export const perceptionRoutes: SideNavLayout['routes'] = {
  DashboardPage: {
    path: PATHS.dashboardPage,
    component: DashboardPage,
  },
  SearchPage: {
    path: PATHS.searchPage,
    component: SearchPage,
  },
  DeploymentPage: {
    path: PATHS.deploymentPage(':path+'),
    component: PerceptionDeploymentExpansionPage,
  },
};
