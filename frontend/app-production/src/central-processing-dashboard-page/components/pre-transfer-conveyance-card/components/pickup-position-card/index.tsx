import { BufferState } from '@plentyag/app-production/src/central-processing-dashboard-page/types/buffer-state';
import { getScopedDataTestIds } from '@plentyag/core/src/utils';
import React from 'react';

import { BufferCarriersTable } from '../../../buffer-carriers-table';
import { DashboardCard } from '../dashboard-card';

const dataTestIds = getScopedDataTestIds({}, 'pickupPositionCard');

export { dataTestIds as dataTestIdsPickupPositionCard };

export interface PickupPositionCard {
  pickupBuffer: BufferState[];
  onUpdateAsync?: () => Promise<any>;
}

/**
 * This card displays carriers at the pickup position (aka, pickup robot). In most all cases there will
 * only be one carrier in the pickup position, but due to errors/rate cases there could be more than one.
 */
export const PickupPositionCard: React.FC<PickupPositionCard> = ({
  pickupBuffer,
  onUpdateAsync = async () => Promise.resolve(),
}) => {
  // get items in position zero since this is the head of the pickup buffer.
  const carriersInPickupPosition = pickupBuffer?.filter(carrier => carrier.buffer_position === 0) || [];

  return (
    <DashboardCard
      data-testid={dataTestIds.root}
      title="Pickup Position"
      contentLength={carriersInPickupPosition?.length}
    >
      <BufferCarriersTable bufferCarriers={carriersInPickupPosition} onUpdateAsync={onUpdateAsync} />
    </DashboardCard>
  );
};
