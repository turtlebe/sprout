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
    tableCellTowerLink: (towerId: string) => `cell-tower-link-${towerId}`,
    tableCellCrop: (towerId: string) => `cell-crop-${towerId}`,
    tableCellTowerLabels: (towerId: string) => `cell-tower-labels-${towerId}`,
  },
  'transplanterCard'
);

export { dataTestIds as dataTestIdsTransplanterCard };

export interface TransplanterCard {
  title: string;
  towers: ProdResources.ResourceState[];
}

/**
 * This card displays towers at the transplanter or transplanter outfeed.
 */
export const TransplanterCard: React.FC<TransplanterCard> = ({ title, towers }) => {
  return (
    <DashboardCard data-testid={dataTestIds.root} title={title} contentLength={towers?.length}>
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableHeaderCellStyled style={{ width: 275 }}>Tower ID</TableHeaderCellStyled>
              <TableHeaderCellStyled style={{ width: 50 }}>Crop</TableHeaderCellStyled>
              <TableHeaderCellStyled>Labels</TableHeaderCellStyled>
            </TableRow>
          </TableHead>
          <TableBody>
            {towers?.map(tower => {
              const towerId = tower?.containerObj?.serial;
              const labels = tower?.containerLabels ?? [];
              return (
                <TableRow data-testid={dataTestIds.tableRow} key={towerId}>
                  <TableCell>
                    <ResourceLink data-testid={dataTestIds.tableCellTowerLink(towerId)} resourceId={towerId} />
                  </TableCell>
                  <TableCell data-testid={dataTestIds.tableCellCrop(towerId)}>{tower?.materialObj?.product}</TableCell>
                  <TableCell data-testid={dataTestIds.tableCellTowerLabels(towerId)}>{labels.join(', ')}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </DashboardCard>
  );
};
