import { SideNavTreeNode, useFeatureFlag } from '@plentyag/brand-ui/src/components';
import { useCoreStore } from '@plentyag/core/src/core-store';
import { PermissionLevels, Resources } from '@plentyag/core/src/core-store/types';

import { routes as qualityRoutes } from '../../routes';

export const FEATURE_POSTHARVEST_QA_SETTINGS = 'postharvestQaSettings';

export const useSideNavTree = (basePath: string): SideNavTreeNode => {
  const [coreState] = useCoreStore();
  const hasPostharvestQaSettings = useFeatureFlag(FEATURE_POSTHARVEST_QA_SETTINGS);

  const rootNode = new SideNavTreeNode({ name: 'Quality' });
  const isAllowed = (resource: Resources, level: PermissionLevels) =>
    coreState.currentUser.hasPermission(resource, level);

  const routes = qualityRoutes(basePath);

  /** Postharvest QA */
  const postharvestQa = rootNode.addNode({ name: 'Postharvest QA' });
  if (isAllowed(Resources.HYP_QUALITY, PermissionLevels.EDIT)) {
    postharvestQa.addNode({
      name: 'Audit',
      route: routes.PostharvestQa,
      href: `${basePath}/postharvest`,
    });

    /** Postharvest QA Settings */
    if (Boolean(hasPostharvestQaSettings)) {
      postharvestQa.addNode({
        name: 'Settings',
        route: routes.postharvestQaSettings,
        href: `${basePath}/postharvest/settings`,
      });
    }
  }

  /** Seedling QA */
  const seedlingQa = rootNode.addNode({ name: 'Seedling QA' });
  isAllowed(Resources.HYP_QUALITY, PermissionLevels.EDIT) &&
    seedlingQa.addNode({
      name: 'Form',
      route: routes.SeedlingQaFormCreate,
      href: `${basePath}/seedling/form`,
    });

  return rootNode;
};
