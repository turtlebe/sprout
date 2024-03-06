import { ObservationSource } from '@plentyag/app-environment/src/common/components/observation-source';
import { StyledTableCell } from '@plentyag/app-environment/src/common/components/styled-table-cell';
import { getObservationValue } from '@plentyag/app-environment/src/common/utils';
import { CircularProgressCentered, DisplayJson, Show } from '@plentyag/brand-ui/src/components';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
} from '@plentyag/brand-ui/src/material-ui/core';
import { NormalizedObservation } from '@plentyag/core/src/types';
import { getShortenedPath } from '@plentyag/core/src/utils';
import { isEqual } from 'lodash';
import moment from 'moment';
import React from 'react';

const ROWS_PER_PAGE = 20;

const dataTestIds = {
  root: 'table-observations-root',
  tableRow: (observation: NormalizedObservation) => `table-observations-row-${observation.observedAt}`,
  cellObservedAt: (observation: NormalizedObservation) =>
    `table-observations-cell-observed-at-${observation.observedAt}`,
  cellSource: (observation: NormalizedObservation) => `table-observations-cell-source-${observation.observedAt}`,
  cellPath: (observation: NormalizedObservation) => `table-observations-cell-path-${observation.observedAt}`,
  cellValue: (observation: NormalizedObservation) => `table-observations-cell-value-${observation.observedAt}`,
  cellOtherProperties: (observation: NormalizedObservation) =>
    `table-observations-cell-other-properties-${observation.observedAt}`,
  pagination: 'table-observations-pagination',
  loader: 'table-observations-loader',
  valueHeader: 'table-observations-value-header',
};

export { dataTestIds as dataTestIdsTableNormalizedObservations };

export interface TableNormalizedObservations {
  observations: NormalizedObservation[];
  isLoading: boolean;
  valueAttribute?: string;
}

/**
 * Table that renders a list of NormalizedObservation.
 */
export const TableNormalizedObservations: React.FC<TableNormalizedObservations> = ({
  observations = [],
  isLoading,
  valueAttribute,
}) => {
  const [page, setPage] = React.useState<number>(0);

  const handlePageChange = (_, newPage) => setPage(newPage);

  return (
    <Show when={!isLoading} fallback={<CircularProgressCentered padding={2} data-testid={dataTestIds.loader} />}>
      <TableContainer data-testid={dataTestIds.root}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <StyledTableCell align="left">Observed At</StyledTableCell>
              <StyledTableCell align="left">Source</StyledTableCell>
              <StyledTableCell align="left">Path</StyledTableCell>
              <StyledTableCell align="left" data-testid={dataTestIds.valueHeader}>
                {valueAttribute || 'Value'}
              </StyledTableCell>
              <StyledTableCell align="left">Other Properties</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {observations
              .slice(page * ROWS_PER_PAGE, page * ROWS_PER_PAGE + ROWS_PER_PAGE)
              .map((observation, index) => (
                <TableRow key={index} data-testid={dataTestIds.tableRow(observation)}>
                  <TableCell align="left" data-testid={dataTestIds.cellObservedAt(observation)}>
                    {moment(moment.utc(observation.observedAt).toDate()).format('LLL')}
                  </TableCell>
                  <TableCell align="left" data-testid={dataTestIds.cellSource(observation)}>
                    <ObservationSource observation={observation} />
                  </TableCell>
                  <TableCell data-testid={dataTestIds.cellPath(observation)}>
                    {getShortenedPath(observation.path)}
                  </TableCell>
                  <TableCell data-testid={dataTestIds.cellValue(observation)}>
                    {getObservationValue(observation, valueAttribute)}
                  </TableCell>
                  <TableCell data-testid={dataTestIds.cellOtherProperties(observation)}>
                    {!isEqual(observation.otherProperties, {}) && (
                      <DisplayJson json={observation.otherProperties} title="Other Properties" />
                    )}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
          {observations.length > ROWS_PER_PAGE && (
            <TableFooter>
              <TableRow>
                <TablePagination
                  rowsPerPageOptions={[ROWS_PER_PAGE]}
                  rowsPerPage={ROWS_PER_PAGE}
                  count={observations.length}
                  page={page}
                  onPageChange={handlePageChange}
                  data-testid={dataTestIds.pagination}
                />
              </TableRow>
            </TableFooter>
          )}
        </Table>
      </TableContainer>
    </Show>
  );
};
