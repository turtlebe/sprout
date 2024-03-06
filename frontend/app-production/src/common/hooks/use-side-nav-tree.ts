import { useFeatureFlag } from '@plentyag/brand-ui/src/components/feature-flag';
import { SideNavTreeNode } from '@plentyag/brand-ui/src/components/side-nav-layout';
import { useCoreStore } from '@plentyag/core/src/core-store';
import { PermissionLevels, Resources } from '@plentyag/core/src/core-store/types';

import { useAppPaths } from './use-app-paths';
import { useAppRoutes } from './use-app-routes';
import { useGetWorkcenters } from './use-get-workcenters';
import { useGetWorkspaces } from './use-get-workspaces';

export const CULTIVATION_INTERFACE_FEATURE_KEY = 'cultivation-interface';

export const useSideNavTree = (): SideNavTreeNode => {
  const { basePath } = useAppPaths();
  const productionRoutes = useAppRoutes();
  const [coreState] = useCoreStore();
  const { workspaces, isLoading: isLoadingWorkspaces } = useGetWorkspaces();
  const { workcenters, isLoading: isLoadingWorkcenters } = useGetWorkcenters();
  const showCultInterface = useFeatureFlag(CULTIVATION_INTERFACE_FEATURE_KEY);

  const isLAX1 = basePath.includes('sites/LAX1/farms/LAX1');
  const rootNode = new SideNavTreeNode({ name: 'Production' });

  const reports = rootNode.addNode({ name: 'Reports' });
  reports.addNode({
    name: 'Machines Summary',
    route: productionRoutes.ReportMachinesSummary,
    href: `${basePath}/reports/machine-summary/machines`,
  });

  if (isLAX1) {
    reports.addNode({
      name: 'Finished Goods',
      route: productionRoutes.ReportsFinishedGoods,
      href: `${basePath}/reports/finished-goods`,
    });
  }

  const maps = rootNode.addNode({ name: 'Maps' });
  maps.addNode({
    name: 'Table',
    route: productionRoutes.MapTable,
    href: `${basePath}/maps/table`,
  });

  maps.addNode({
    name: 'Interactive',
    route: productionRoutes.MapInteractive,
    href: `${basePath}/maps/interactive`,
  });

  const resources = rootNode.addNode({ name: 'Resources' });
  resources.addNode({
    name: 'Search',
    route: productionRoutes.Resources,
    href: `${basePath}/resources`,
  });

  if (coreState.currentUser.hasPermission(Resources.HYP_PRODUCTION, PermissionLevels.EDIT)) {
    const actions = rootNode.addNode({ name: 'Actions' });
    actions.addNode({
      name: 'Search',
      route: productionRoutes.ActionsSearch,
      href: `${basePath}/actions`,
    });
    actions.addNode({
      name: 'Bulk Actions',
      route: productionRoutes.BulkActions,
      href: `${basePath}/bulk-actions`,
    });
  }

  if (coreState.currentUser.hasPermission(Resources.HYP_PRODUCTION, PermissionLevels.FULL)) {
    const workbinAdminPages = rootNode.addNode({ name: 'Workbins Admin' });

    workbinAdminPages.addNode({
      name: 'Workbin Task Definitions',
      route: productionRoutes.WorkbinsTaskDefinitionsPage,
      href: `${basePath}/workbins-admin/task-definitions`,
    });

    workbinAdminPages.addNode({
      name: 'Workbin Triggers',
      route: productionRoutes.WorkbinsTriggersPage,
      href: `${basePath}/workbins-admin/triggers`,
    });
  }

  const reactorsAndTasksPages = rootNode.addNode({
    name: 'Reactors and Tasks',
  });

  reactorsAndTasksPages.addNode({
    name: 'Table',
    route: productionRoutes.ReactorsAndTasksTable,
    href: `${basePath}/reactors-and-tasks/table`,
  });

  reactorsAndTasksPages.addNode({
    name: 'Detail',
    route: productionRoutes.ReactorsAndTasksDetail,
    href: `${basePath}/reactors-and-tasks/detail`,
  });

  const farmOsInterfacesPages = rootNode.addNode({ name: 'Orchestration' });

  farmOsInterfacesPages.addNode({
    name: 'Central Processing Dashboard',
    route: productionRoutes.CentralProcessingDashboard,
    href: `${basePath}/central-processing/dashboard`,
  });

  farmOsInterfacesPages.addNode({
    name: 'Central Processing Settings',
    route: productionRoutes.CentralProcessingSettings,
    href: `${basePath}/central-processing/settings`,
  });

  if (showCultInterface) {
    farmOsInterfacesPages.addNode({
      name: 'Cultivation Dashboard',
      route: productionRoutes.CultivationDashboard,
      href: `${basePath}/cultivation/dashboard`,
    });
  }

  const workspacePages = rootNode.addNode({ name: 'Workspaces', isLoading: isLoadingWorkspaces });
  workspaces?.length === 0 &&
    workspacePages.addNode({
      name: 'none',
    });
  workspaces?.length > 0 &&
    workspaces.forEach(workspace => {
      workspacePages.addNode({
        name: workspace.roleDisplayName,
        route: productionRoutes.Workspace,
        href: `${basePath}/workspaces/${workspace.role}`,
      });
    });

  const workcenterPages = rootNode.addNode({ name: 'Workcenters', isLoading: isLoadingWorkcenters });
  workcenters?.length === 0 && workcenterPages.addNode({ name: 'none ' });
  workcenters?.length > 0 &&
    workcenters.forEach(workcenter => {
      workcenterPages.addNode({
        name: workcenter.displayName,
        route: productionRoutes.Workcenter,
        href: `${basePath}/workcenters/${workcenter.name}`,
      });
    });

  return rootNode;
};
