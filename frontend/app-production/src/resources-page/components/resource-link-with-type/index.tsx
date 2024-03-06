import { ResourceLink } from '@plentyag/app-production/src/common/components';
import { Box, Typography } from '@plentyag/brand-ui/src/material-ui/core';
import React from 'react';

export const dataTestIds = {
  navLink: 'nav-link',
};

export interface ResourceLinkWithType {
  resource: ProdResources.ResourceState;
  showResourceType?: boolean;
  'data-testid'?: string;
}

/**
 * This component renders a resource link also displaying the resource type: TOWER, TRAY, etc.
 */
export const ResourceLinkWithType: React.FC<ResourceLinkWithType> = ({ resource, 'data-testid': dataTestId }) => {
  if (!resource || !(resource.containerObj || resource.materialObj)) {
    return null;
  }

  // if resource has container then use it's serial and type, otherwise use material id and type.
  const resourceId = resource.containerObj ? resource.containerObj.serial : resource.materialObj.id;
  const resourceType = resource.containerObj ? resource.containerObj.containerType : resource.materialObj.materialType;

  return (
    <Box data-testid={dataTestId || dataTestIds.navLink} mb={1}>
      <Typography variant="subtitle2" component="span">
        {resourceType}:{' '}
      </Typography>
      <ResourceLink resourceId={resourceId} openInNewTab={false} />
    </Box>
  );
};
