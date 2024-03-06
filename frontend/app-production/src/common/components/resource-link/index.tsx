import { useAppPaths } from '@plentyag/app-production/src/common/hooks/use-app-paths';
import { PlentyLink, Show } from '@plentyag/brand-ui/src/components';
import { getScopedDataTestIds } from '@plentyag/core/src/utils';
import React from 'react';

const dataTestIds = getScopedDataTestIds(
  {
    link: 'link',
  },
  'ResourceLink'
);

export { dataTestIds as dataTestIdsResourceLink };

export interface ResourceLink {
  resourceId: string;
  resourceName?: string | React.ReactNode;
  openInNewTab?: boolean;
  'data-testid'?: string;
}

/**
 * Shared component providing a link to the resource search page
 * for the given resourceId.
 */
export const ResourceLink: React.FC<ResourceLink> = ({
  resourceId,
  resourceName,
  openInNewTab = true,
  'data-testid': dataTestId,
}) => {
  const { resourcesPageBasePath } = useAppPaths();

  return (
    <Show when={Boolean(resourceId)}>
      <PlentyLink
        data-testid={dataTestId || dataTestIds.link}
        to={`${resourcesPageBasePath}/info?q=${resourceId}`}
        openInNewTab={openInNewTab}
      >
        {resourceName || resourceId}
      </PlentyLink>
    </Show>
  );
};
