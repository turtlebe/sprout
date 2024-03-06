import { BufferState } from '@plentyag/app-production/src/central-processing-dashboard-page/types/buffer-state';
import { ResourceLink } from '@plentyag/app-production/src/common/components';
import { Show } from '@plentyag/brand-ui/src/components';
import {
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@plentyag/brand-ui/src/material-ui/core';
import { getScopedDataTestIds } from '@plentyag/core/src/utils';
import React from 'react';

import { InlineDestinationAction } from '../inline-destination-action';
import { TableCellStyled, TableHeaderCellStyled, TableRowStyled } from '../table-styled';

const dataTestIds = getScopedDataTestIds(
  {
    emptyTableMessage: 'empty-table-message',
    tableRow: 'table-row',
    tableCellCarrierIndex: (carrierId: string) => `cell-carrier-index-${carrierId}`,
    tableCellCarrierLink: (carrierId: string) => `cell-carrier-link-${carrierId}`,
    tableCellFinalDestination: (carrierId: string) => `cell-final-destination-${carrierId}`,
    tableCellTowerLink: (carrierId: string) => `cell-tower-link-${carrierId}`,
    tableCellCrop: (carrierId: string) => `cell-crop-${carrierId}`,
    tableCellTowerLabels: (carrierId: string) => `cell-tower-labels-${carrierId}`,
  },
  'pickupPositionCard'
);

export { dataTestIds as dataTestIdsBufferCarriersTable };

export interface BufferCarriersTable {
  'data-testid'?: string;
  bufferCarriers: BufferState[];
  showOrder?: boolean;
  onUpdateAsync?: () => Promise<any>;
}

/**
 * This table displays carriers at a specific buffer location (i.e. pickup robot, seedling buffer).
 */
export const BufferCarriersTable: React.FC<BufferCarriersTable> = ({
  'data-testid': rootDataTestId = dataTestIds.root,
  bufferCarriers,
  showOrder = false,
  onUpdateAsync = async () => Promise.resolve(),
}) => {
  const [activeRow, setActiveRow] = React.useState<string | null>(null);
  if (!bufferCarriers?.length) {
    return <Typography data-testid={dataTestIds.emptyTableMessage}>This buffer is empty.</Typography>;
  }

  return (
    <TableContainer data-testid={rootDataTestId}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <Show when={showOrder}>
              <TableHeaderCellStyled style={{ width: 50 }}>Order</TableHeaderCellStyled>
            </Show>
            <TableHeaderCellStyled>Carrier ID</TableHeaderCellStyled>
            <TableHeaderCellStyled style={{ minWidth: 150 }}>Destination</TableHeaderCellStyled>
            <TableHeaderCellStyled style={{ minWidth: 275 }}>Tower ID</TableHeaderCellStyled>
            <TableHeaderCellStyled style={{ minWidth: 275 }}>Crop</TableHeaderCellStyled>
            <TableHeaderCellStyled>Tower Labels</TableHeaderCellStyled>
          </TableRow>
        </TableHead>
        <TableBody>
          {bufferCarriers.map(bufferCarrier => {
            const carrierId = bufferCarrier?.carrier_id;
            const towerId = bufferCarrier?.tower_id;
            // for MUI styled-components, we need to use DOM-friendly values or else undefined
            const active = carrierId === activeRow ? 'true' : undefined;
            return (
              <TableRowStyled
                data-testid={dataTestIds.tableRow}
                key={carrierId}
                active={active}
                onMouseEnter={() => setActiveRow(carrierId)}
                onMouseLeave={() => setActiveRow(null)}
              >
                <Show when={showOrder}>
                  <TableCellStyled data-testid={dataTestIds.tableCellCarrierIndex(carrierId)} align="center">
                    {bufferCarrier?.buffer_position}
                  </TableCellStyled>
                </Show>
                <TableCellStyled>
                  <ResourceLink data-testid={dataTestIds.tableCellCarrierLink(carrierId)} resourceId={carrierId} />
                </TableCellStyled>
                <TableCellStyled data-testid={dataTestIds.tableCellFinalDestination(carrierId)}>
                  <InlineDestinationAction
                    isActive={Boolean(active)}
                    bufferCarrierState={bufferCarrier}
                    destinationKey="final_destination"
                    onAfterSubmitAsync={onUpdateAsync}
                  />
                </TableCellStyled>
                <TableCellStyled>
                  <ResourceLink data-testid={dataTestIds.tableCellTowerLink(carrierId)} resourceId={towerId} />
                </TableCellStyled>
                <TableCellStyled data-testid={dataTestIds.tableCellCrop(carrierId)}>
                  {bufferCarrier?.crop}
                </TableCellStyled>
                <TableCellStyled data-testid={dataTestIds.tableCellTowerLabels(carrierId)}>
                  {bufferCarrier?.tower_labels?.join(', ')}
                </TableCellStyled>
              </TableRowStyled>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
