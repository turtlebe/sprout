import { StyledTableCell } from '@plentyag/app-environment/src/common/components';
import { CircularProgressCentered, Show } from '@plentyag/brand-ui/src/components';
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
import { RolledUpByTimeObservation } from '@plentyag/core/src/types';
import _ from 'lodash';
import moment from 'moment';
import React from 'react';

const ROWS_PER_PAGE = 20;

const dataTestIds = {
  root: 'table-observations-root',
  tableRow: (index: number) => `table-observations-row-${index}`,
  cellObservedAt: (index: number) => `table-observations-cell-observed-at-${index}`,
  cellValue: (index: number) => `table-observations-cell-value-${index}`,
  cellCount: (index: number) => `table-observations-cell-count-${index}`,
  pagination: 'table-observations-pagination',
  loader: 'table-observations-loader',
  valueHeader: 'table-observations-value-header',
};

export { dataTestIds as dataTestIdsTableObservations };

export interface TableObservations {
  observations: RolledUpByTimeObservation[];
  isLoading: boolean;
  valueAttribute?: string;
}

/**
 * Table that renders a list of RolledUpByTimeObservation.
 */
export const TableObservations: React.FC<TableObservations> = ({ observations = [], isLoading, valueAttribute }) => {
  const [page, setPage] = React.useState<number>(0);

  const handlePageChange = (_, newPage) => setPage(newPage);
  const tableObservations = _.cloneDeep(observations);

  return (
    <Show when={!isLoading} fallback={<CircularProgressCentered padding={2} data-testid={dataTestIds.loader} />}>
      <TableContainer data-testid={dataTestIds.root}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <StyledTableCell align="left">Observed At</StyledTableCell>
              <StyledTableCell align="left">Count</StyledTableCell>
              <StyledTableCell align="left" data-testid={dataTestIds.valueHeader}>
                {valueAttribute || 'Value'}
              </StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tableObservations
              .sort((a, b) => new Date(b.rolledUpAt).getTime() - new Date(a.rolledUpAt).getTime())
              .slice(page * ROWS_PER_PAGE, page * ROWS_PER_PAGE + ROWS_PER_PAGE)
              .map((observation, index) => (
                <TableRow key={index} data-testid={dataTestIds.tableRow(index)}>
                  <TableCell align="left" data-testid={dataTestIds.cellObservedAt(index)}>
                    {moment(moment.utc(observation.rolledUpAt).toDate()).format('LLL')}
                  </TableCell>

                  <TableCell data-testid={dataTestIds.cellCount(index)}>{observation.valueCount}</TableCell>
                  <TableCell data-testid={dataTestIds.cellValue(index)}>{observation.value}</TableCell>
                </TableRow>
              ))}
          </TableBody>
          {tableObservations.length > ROWS_PER_PAGE && (
            <TableFooter>
              <TableRow>
                <TablePagination
                  rowsPerPageOptions={[ROWS_PER_PAGE]}
                  rowsPerPage={ROWS_PER_PAGE}
                  count={tableObservations.length}
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
