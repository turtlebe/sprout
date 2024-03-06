import { SideNavTreeNode } from '@plentyag/brand-ui/src/components/side-nav-layout';

import { PATHS } from '../../paths';
import { derivedObservationsRoutes } from '../../routes';

export const useSideNavTree = (): SideNavTreeNode => {
  const rootNode = new SideNavTreeNode({ name: 'Environment' });

  rootNode.addNode({
    name: 'Base Observation Definitions',
    route: derivedObservationsRoutes.BaseObservationDefinitionsPage,
    href: PATHS.baseObservationDefinitionsPage,
  });

  rootNode.addNode({
    name: 'Derived Observation Definitions',
    route: derivedObservationsRoutes.DerivedObservationDefinitionsPage,
    href: PATHS.derivedObservationDefinitionsPage,
  });

  return rootNode;
};
