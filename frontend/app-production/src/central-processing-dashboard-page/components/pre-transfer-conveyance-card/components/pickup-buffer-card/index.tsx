import { BufferState } from '@plentyag/app-production/src/central-processing-dashboard-page/types/buffer-state';
import { ResourceLink } from '@plentyag/app-production/src/common/components';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@plentyag/brand-ui/src/material-ui/core';
import { getScopedDataTestIds } from '@plentyag/core/src/utils';
import React from 'react';

import { TableHeaderCellStyled } from '../../../table-styled';
import { DashboardCard } from '../dashboard-card';

const dataTestIds = getScopedDataTestIds(
  {
    tableRow: 'table-row',
    tableCellCarrierIndex: (carrierId: string) => `cell-carrier-index-${carrierId}`,
    tableCellCarrierLink: (carrierId: string) => `cell-carrier-link-${carrierId}`,
  },
  'pickupBufferCard'
);

export { dataTestIds as dataTestIdsPickupBufferCard };

export interface PickupBufferCard {
  pickupBuffer: BufferState[];
}

/**
 * This card shows the carriers queued up in the pickup buffer waiting to go into the pickup position (
 * aka pickup robot). The pickup position is the head of the pickup buffer (buffer_position === 0).
 * The items not at position zero are the items in the queued carriers.
 */
export const PickupBufferCard: React.FC<PickupBufferCard> = ({ pickupBuffer }) => {
  const title = 'Pickup Buffer';
  // gets buffered items - which are items not in position zero.
  const carriers = pickupBuffer?.filter(carrier => carrier.buffer_position > 0) || [];

  return (
    <DashboardCard data-testid={dataTestIds.root} title={title} contentLength={carriers?.length}>
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableHeaderCellStyled style={{ width: 50 }}>Order</TableHeaderCellStyled>
              <TableHeaderCellStyled>Carrier ID</TableHeaderCellStyled>
            </TableRow>
          </TableHead>
          <TableBody>
            {carriers.map(carrier => {
              const carrierId = carrier?.carrier_id;
              return (
                <TableRow data-testid={dataTestIds.tableRow} key={carrierId}>
                  <TableCell data-testid={dataTestIds.tableCellCarrierIndex(carrierId)} align="center">
                    {carrier.buffer_position}
                  </TableCell>
                  <TableCell>
                    <ResourceLink data-testid={dataTestIds.tableCellCarrierLink(carrierId)} resourceId={carrierId} />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </DashboardCard>
  );
};
