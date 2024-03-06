import { AppHome } from '@plentyag/brand-ui/src/components/app-home';
import { SideNavLayout } from '@plentyag/brand-ui/src/components/side-nav-layout';
import React from 'react';

import { ImportPlansPage } from './import-plans-page';
/**
 * Declare all react-router-dom Route and their associated Component.
 *
 * This mapping is used in app-production/index.tsx and required for using @plentya/brand-ui/src/components/side-nav-layout
 */
export const routes = (basePath: string): SideNavLayout['routes'] => {
  const productionBasePath = basePath.replace('production-admin', 'production');
  const reactorsAndTasksBasePath = `${productionBasePath}/reactors-and-tasks`;
  const reactorsAndTasksDetailBasePath = `${reactorsAndTasksBasePath}/detail`;
  const workcentersBasePath = `${productionBasePath}/workcenters`;

  return {
    ProductionAdminHome: {
      path: basePath,
      component: () => <AppHome appName="production admin" />,
    },
    // only allowed for lax1.
    ImportPlans: basePath.includes('sites/LAX1/farms/LAX1') && {
      path: `${basePath}/import-plans`,
      render: renderProps => (
        <ImportPlansPage
          {...renderProps}
          basePath={`${basePath}/import-plans`}
          reactorsAndTasksDetailBasePath={reactorsAndTasksDetailBasePath}
          workcentersBasePath={workcentersBasePath}
        />
      ),
    },
  };
};
