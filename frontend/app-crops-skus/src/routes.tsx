import { AppHome, SideNavLayout } from '@plentyag/brand-ui/src/components';
import React from 'react';

import { ROUTES } from './constants';
import { CropPage } from './crop-page';
import { CropsPage } from './crops-page';
import { SkuPage } from './sku-page';
import { SkusPage } from './skus-page';

export const BASE_ROUTE = '/crops-skus';

/**
 * Declare all react-router-dom Route and their associated Component.
 *
 * This mapping is used in app-crops/index.tsx and required for using @plentya/brand-ui/src/components/side-nav-layout
 */
export const cropsRoutes: SideNavLayout['routes'] = {
  Home: {
    path: ROUTES.home,
    component: () => <AppHome appName="Crops/SKUs" />,
  },
  Crops: {
    path: ROUTES.crops,
    component: CropsPage,
  },
  Crop: {
    path: ROUTES.crop(':cropName'),
    component: CropPage,
  },
  Skus: {
    path: ROUTES.skus,
    component: SkusPage,
  },
  Sku: {
    path: ROUTES.sku(':skuName'),
    component: SkuPage,
  },
};
