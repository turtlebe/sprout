import { Done } from '@material-ui/icons';
import { StyledTableCell } from '@plentyag/app-devices/src/common/components';
import { DisplayJson } from '@plentyag/brand-ui/src/components';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@plentyag/brand-ui/src/material-ui/core';
import { NormalizedObservation } from '@plentyag/core/src/types';
import React from 'react';

import { getFaultsInfo } from '../../utils';

const dataTestIds = {
  root: 'table-faults-root',
  tableRow: (observation: NormalizedObservation) => `table-faults-table-row-${observation.observationId}`,
  tableCellObservationName: (observation: NormalizedObservation) =>
    `table-faults-table-cell-observation-name-${observation.observationId}`,
  hasFarmOsOverride: (observation: NormalizedObservation) =>
    `table-faults-has-farmos-override-${observation.observationId}`,
};

export { dataTestIds as dataTestIdsTableFaults };

export interface TableFaults {
  observations: NormalizedObservation[];
}

/**
 * Component that renders a list of "faults" Observations in a Table.
 */
export const TableFaults: React.FC<TableFaults> = ({ observations }) => {
  return (
    <>
      <TableContainer data-testid={dataTestIds.root}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <StyledTableCell>Type</StyledTableCell>
              <StyledTableCell>Value</StyledTableCell>
              <StyledTableCell>FarmOS Override</StyledTableCell>
              <StyledTableCell>Raw Attributes</StyledTableCell>
              <StyledTableCell>Time (UTC)</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {observations.map(observation => (
              <TableRow key={observation.observationId} data-testid={dataTestIds.tableRow(observation)}>
                <TableCell data-testid={dataTestIds.tableCellObservationName(observation)}>
                  {observation.observationName}
                </TableCell>
                <TableCell>{observation.valueString}</TableCell>
                <TableCell>
                  {getFaultsInfo(observation.otherProperties?.faults).requestToEnter === true ? (
                    <Done data-testid={dataTestIds.hasFarmOsOverride(observation)} />
                  ) : (
                    <></>
                  )}
                </TableCell>
                <TableCell>
                  <DisplayJson json={getFaultsInfo(observation.otherProperties?.faults)} title="Fault Raw Attributes" />
                </TableCell>
                <TableCell>{observation.observedAt}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};
