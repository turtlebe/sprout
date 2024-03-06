import { SideNavTreeNode } from '@plentyag/brand-ui/src/components/side-nav-layout';

import { routes as getProductionAdminRoutes } from '../../routes';

export const useSideNavTree = (basePath: string): SideNavTreeNode => {
  const rootNode = new SideNavTreeNode({ name: 'Production Admin' });

  const productioAdminRoutes = getProductionAdminRoutes(basePath);

  // import plans is only supported by lax1.
  if (basePath.includes('sites/LAX1/farms/LAX1')) {
    rootNode.addNode({
      name: 'Import Plans',
      route: productioAdminRoutes.ImportPlans,
      href: `${basePath}/import-plans`,
    });
  }

  return rootNode;
};
