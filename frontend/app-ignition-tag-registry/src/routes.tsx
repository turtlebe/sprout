import { SideNavLayout } from '@plentyag/brand-ui/src/components';

import { BulkCreateTagsMetricsPage } from './bulk-create-tags-metrics-page';
import { PATHS } from './paths';
import { TagsPage } from './tags-page';

/**
 * Declare all react-router-dom Route and their associated Component.
 *
 * This mapping is used in app-ignition-tag-registry/index.tsx and required for using @plentya/brand-ui/src/components/side-nav-layout
 */
export const ignitionTagRegistryRoutes: SideNavLayout['routes'] = {
  TagsPage: {
    path: PATHS.tagsPage,
    component: TagsPage,
  },
  BulkCreateTagsMetricsPage: {
    path: PATHS.bulkCreateTagsMetricsPage,
    component: BulkCreateTagsMetricsPage,
  },
};
