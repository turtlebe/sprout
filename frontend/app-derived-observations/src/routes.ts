import { SideNavLayout } from '@plentyag/brand-ui/src/components';

import { BaseObservationDefinitionPage } from './base-observation-definition-page';
import { BaseObservationDefinitionsPage } from './base-observation-definitions-page';
import { DerivedObservationDefinitionPage } from './derived-observation-definition-page';
import { DerivedObservationDefinitionsPage } from './derived-observation-definitions-page';
import { PATHS } from './paths';

/**
 * Declare all react-router-dom Route and their associated Component.
 *
 * This mapping is used in app-derived-observations/index.tsx and required for using @plentyag/brand-ui/src/components/side-nav-layout
 */
export const derivedObservationsRoutes: SideNavLayout['routes'] = {
  BaseObservationDefinitionsPage: {
    path: PATHS.baseObservationDefinitionsPage,
    component: BaseObservationDefinitionsPage,
  },
  BaseObservationDefinitionPage: {
    path: PATHS.baseObservationDefinitionPage(':definitionId'),
    component: BaseObservationDefinitionPage,
  },
  DerivedObservationDefinitionsPage: {
    path: PATHS.derivedObservationDefinitionsPage,
    component: DerivedObservationDefinitionsPage,
  },
  DerivedObservationDefinitionPage: {
    path: PATHS.derivedObservationDefinitionPage(':definitionId'),
    component: DerivedObservationDefinitionPage,
  },
};
