import { SideNavTreeNode } from '@plentyag/brand-ui/src/components/side-nav-layout';

import { cropsRoutes } from '../../routes';

export const useSideNavTree = (): SideNavTreeNode => {
  const rootNode = new SideNavTreeNode({ name: 'Crops-SKUs' });

  rootNode.addNode({
    name: 'Crops',
    route: cropsRoutes.Crops,
    href: '/crops-skus/crops',
  });

  rootNode.addNode({
    name: 'SKUs',
    route: cropsRoutes.Skus,
    href: '/crops-skus/skus',
  });

  return rootNode;
};
