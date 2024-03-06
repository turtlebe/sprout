import { AppHome } from '@plentyag/brand-ui/src/components/app-home';
import { SideNavLayout } from '@plentyag/brand-ui/src/components/side-nav-layout';
import React from 'react';

import { PostharvestQaPage } from './postharvest-qa-page';
import { PostharvestQaSettingsPage } from './postharvest-qa-settings-page';
import { SeedlingQaFormEup } from './seedling-qa-form-page';

/**
 * Declare all react-router-dom Route and their associated Component.
 *
 * This mapping is used in app-quality/index.tsx and required for using @plentya/brand-ui/src/components/side-nav-layout
 */
export const routes = (basePath: string): SideNavLayout['routes'] => {
  return {
    QualityHome: {
      path: basePath,
      component: () => <AppHome appName="quality" />,
    },
    PostharvestQa: {
      path: `${basePath}/postharvest`,
      component: PostharvestQaPage,
    },
    PostharvestQaSettings: {
      path: `${basePath}/postharvest/settings`,
      component: PostharvestQaSettingsPage,
    },
    SeedlingQaFormCreate: {
      path: `${basePath}/seedling/form`,
      component: SeedlingQaFormEup,
    },
    SeedlingQaFormUpdate: {
      path: `${basePath}/seedling/form/:seedlingQaId`,
      component: SeedlingQaFormEup,
    },
  };
};
