import { SideNavTreeNode } from '@plentyag/brand-ui/src/components/side-nav-layout';
import useCoreStore from '@plentyag/core/src/core-store';
import { PermissionLevels, Resources } from '@plentyag/core/src/core-store/types';

import { PATHS } from '../../paths';
import { ignitionTagRegistryRoutes } from '../../routes';

export const useSideNavTree = (): SideNavTreeNode => {
  const [coreStore] = useCoreStore();
  const rootNode = new SideNavTreeNode({ name: 'Ignition Tag Registry' });

  rootNode.addNode({
    name: 'Tags',
    route: ignitionTagRegistryRoutes.TagsPage,
    href: PATHS.tagsPage,
  });

  if (coreStore.currentUser.hasPermission(Resources.HYP_BETA, PermissionLevels.FULL)) {
    rootNode.addNode({
      name: 'Bulk Create Tags/Metrics',
      route: ignitionTagRegistryRoutes.BulkCreateTagsMetricsPage,
      href: PATHS.bulkCreateTagsMetricsPage,
    });
  }

  return rootNode;
};
