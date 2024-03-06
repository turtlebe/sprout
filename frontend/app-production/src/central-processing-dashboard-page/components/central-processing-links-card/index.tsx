import { useAppPaths } from '@plentyag/app-production/src/common/hooks/use-app-paths';
import { PlentyLink } from '@plentyag/brand-ui/src/components';
import { Box, Card, CardContent, CardHeader } from '@plentyag/brand-ui/src/material-ui/core';
import { getScopedDataTestIds } from '@plentyag/core/src/utils';
import React from 'react';

const dataTestIds = getScopedDataTestIds(
  {
    link: (linkName: string) => linkName,
  },
  'centralProcessingLinksCard'
);

export { dataTestIds as dataTestIdsCentralProcessingLinksCard };

export const links: Record<string, string> = {
  'Transfer Conveyance Reactor Details':
    '/reactors-and-tasks/detail/sites/LAX1/areas/TowerAutomation/lines/TransferConveyance?tab=reactor-state',
  'Transfer Conveyance Settings': '/central-processing/settings',
  'Pickup Robot Routing Destination Override':
    '/actions/sites/LAX1/areas/TowerAutomation/lines/TransferConveyance/interfaces/Requests/methods/PickupRobotRoutingDestinationOverride',
  'Move Carrier':
    '/actions/sites/LAX1/areas/TowerAutomation/lines/TransferConveyance/interfaces/Requests/methods/MoveCarrier',
  'Transfer Conveyance Map Table': '/maps/table/sites/LAX1/areas/TowerAutomation/lines/TransferConveyance',
};

export const CentralProcessingLinksCard: React.FC = () => {
  const { basePath } = useAppPaths();

  return (
    <Card data-testid={dataTestIds.root}>
      <CardHeader title="Central Processing - Top FarmOS Links" />
      <CardContent>
        {Object.keys(links).map(linkName => (
          <Box mb={1} key={linkName}>
            <PlentyLink data-testid={dataTestIds.link(linkName)} to={`${basePath}${links[linkName]}`} openInNewTab>
              {linkName}
            </PlentyLink>
          </Box>
        ))}
      </CardContent>
    </Card>
  );
};
