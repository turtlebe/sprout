import { ActionsFormPage } from '@plentyag/app-production/src/actions-form-page';
import { ActionsSearchPage } from '@plentyag/app-production/src/actions-search-page';
import { BulkActionsPage } from '@plentyag/app-production/src/bulk-actions-page';
import { CentralProcessingDashboardPage } from '@plentyag/app-production/src/central-processing-dashboard-page';
import { CentralProcessingSettingsPage } from '@plentyag/app-production/src/central-processing-settings-page';
import { CultivationDashboardPage } from '@plentyag/app-production/src/cultivation-dashboard-page';
import { MapsInteractivePage } from '@plentyag/app-production/src/maps-interactive-page';
import { MapsTable } from '@plentyag/app-production/src/maps-table-page';
import { ReactorsAndTasksDetailPage } from '@plentyag/app-production/src/reactors-and-tasks-detail-page';
import { ReactorsAndTasksTablePage } from '@plentyag/app-production/src/reactors-and-tasks-table-page';
import { ReportsFinishedGoods } from '@plentyag/app-production/src/reports-finished-goods-page';
import { ResourcesPage } from '@plentyag/app-production/src/resources-page';
import { WorkbinsTaskDefinitionsPage, WorkbinsTriggersPage } from '@plentyag/app-production/src/workbins-admin-page';
import { WorkcentersPage } from '@plentyag/app-production/src/workcenters-page';
import { WorkspacesPage } from '@plentyag/app-production/src/workspaces-page';
import { MigrateUrl, SideNavLayout, SisenseDashboard } from '@plentyag/brand-ui/src/components';
import { AppHome } from '@plentyag/brand-ui/src/components/app-home';
import React from 'react';

import { useAppPaths } from '../use-app-paths';

/**
 * Declare all react-router-dom Route and their associated Component.
 *
 * This mapping is used in app-production/index.tsx and required for using @plentya/brand-ui/src/components/side-nav-layout
 */
export const useAppRoutes = (): SideNavLayout['routes'] => {
  const {
    basePath,
    resourcesPageBasePath,
    reactorsAndTasksBasePath,
    reactorsAndTasksDetailBasePath,
    workspacesBasePath,
    workcentersBasePath,
  } = useAppPaths();

  const oldReactorsAndTasksBasePath = `${basePath}/reactors-tasks`; // deprecated 8/2022

  return {
    ProductionHome: {
      path: basePath,
      component: () => <AppHome appName="production" />,
    },
    Resources: {
      // open resources to given tab: info, genealogy, material-history or container-history, defaults to info.
      path: `${resourcesPageBasePath}/:tab?`,
      render: renderProps => <ResourcesPage {...renderProps} />,
    },
    ReportMachinesSummary: {
      path: `${basePath}/reports/machine-summary/:dashboardName`,
      component: ({ match }) => <SisenseDashboard match={match} notFoundRedirectsTo={basePath} />,
    },
    ReportsFinishedGoods: {
      path: `${basePath}/reports/finished-goods/:reportName?`,
      render: () => <ReportsFinishedGoods />,
    },
    ActionsSearch: {
      path: `${basePath}/actions`,
      render: () => <ActionsSearchPage />,
    },
    ActionsForm: {
      // open action form for given farm def path
      // ex: sites/SSF2/areas/PrimaryPostHarvest/lines/ToteProcessing/machines/ToteFiller/interfaces/ToteFiller/methods/ToteFilled
      path: `${basePath}/actions/:actionPath+`,
      render: renderProps => <ActionsFormPage {...renderProps} />,
    },
    BulkActions: {
      path: `${basePath}/bulk-actions`,
      component: BulkActionsPage,
    },
    MapInteractive: {
      path: `${basePath}/maps/interactive/:area?/:line?`,
      render: () => <MapsInteractivePage />,
    },
    MapTable: {
      path: `${basePath}/maps/table/(sites)?/:site?/(areas)?/:area?/(lines)?/:line?`,
      render: renderProps => <MapsTable {...renderProps} />,
    },
    WorkbinsTaskDefinitionsPage: {
      path: `${basePath}/workbins-admin/task-definitions`,
      component: WorkbinsTaskDefinitionsPage,
    },
    WorkbinsTriggersPage: {
      path: `${basePath}/workbins-admin/triggers`,
      component: WorkbinsTriggersPage,
    },
    Workspace: {
      path: `${workspacesBasePath}/:roleName`,
      render: renderProps => <WorkspacesPage {...renderProps} />,
    },
    Workcenter: {
      path: `${workcentersBasePath}/:name`,
      render: renderProps => <WorkcentersPage {...renderProps} />,
    },

    ReactorsAndTasksDetail: {
      path: `${reactorsAndTasksBasePath}/detail/:reactorPath*`,
      render: renderProps => <ReactorsAndTasksDetailPage {...renderProps} />,
    },
    ReactorsAndTasksTable: {
      path: `${reactorsAndTasksBasePath}/table`,
      render: () => <ReactorsAndTasksTablePage />,
    },

    CentralProcessingDashboard: {
      path: `${basePath}/central-processing/dashboard`,
      render: () => <CentralProcessingDashboardPage />,
    },
    CentralProcessingSettings: {
      path: `${basePath}/central-processing/settings`,
      render: () => <CentralProcessingSettingsPage />,
    },
    CultivationDashboard: {
      path: `${basePath}/cultivation/dashboard`,
      render: () => <CultivationDashboardPage />,
    },

    // Old reactor and task link to support backwards compatible permalink
    // -- deprecated 8/2022
    OldReactorsAndTasks: {
      path: `${oldReactorsAndTasksBasePath}/:reactorPath*`,
      render: ({ match }) => <MigrateUrl to={`${reactorsAndTasksDetailBasePath}/${match.params.reactorPath}`} />,
    },
    // Old reactor and task link to support backwards compatible permalink
    OldSisenseDashboard: {
      // forward from old sisense dashboard path to updated path
      path: `${basePath}/machines/machine-summary/:dashboardName/report`,
      render: ({ match }) => <MigrateUrl to={`${basePath}/reports/machine-summary/${match.params.dashboardName}`} />,
    },
  };
};
