import { IrrigationTask } from '@plentyag/app-production/src/maps-interactive-page/types';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@plentyag/brand-ui/src/material-ui/core';
import { getScopedDataTestIds } from '@plentyag/core/src/utils';
import { isEqual } from 'lodash';
import React from 'react';

import { getTableData } from '../../utils/get-table-data';
import { IrrigationTableRow } from '../irrigation-table-row';

import { TableCellBold } from './styles';

const dataTestIds = getScopedDataTestIds({}, 'irrigation-table');

export { dataTestIds as dataTestIdsIrrigationTable };

export interface IrrigationTable {
  lotName: string;
  tableSerial: string;
  siteTimeZone: string;
  rackPath: string;
  irrigationTasks: IrrigationTask[];
  tableLoadedDate: Date;
  onRefreshIrrigationTasks: () => void;
}

export const IrrigationTable: React.FC<IrrigationTable> = React.memo(
  ({ lotName, tableSerial, siteTimeZone, rackPath, irrigationTasks, tableLoadedDate, onRefreshIrrigationTasks }) => {
    const tableData = React.useMemo(
      () => getTableData({ lotName, tableSerial, siteTimeZone, rackPath, irrigationTasks, tableLoadedDate }),
      [lotName, tableSerial, siteTimeZone, rackPath, irrigationTasks, tableLoadedDate]
    );

    return (
      <TableContainer data-testid={dataTestIds.root} component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCellBold style={{ width: 165 }}>Status</TableCellBold>
              <TableCellBold style={{ width: 150 }}>Irrigation Date</TableCellBold>
              <TableCellBold style={{ width: 50 }}>Recipe Day*</TableCellBold>
              <TableCellBold style={{ width: 275 }}>Location</TableCellBold>
              <TableCellBold style={{ width: 150 }}>Recipe Volume (liters)**</TableCellBold>
              <TableCellBold style={{ width: 100 }}>Trigger</TableCellBold>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {tableData.map(value => (
              <IrrigationTableRow key={value.id} rowData={value} onRefreshIrrigationTasks={onRefreshIrrigationTasks} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  },
  (prevProps, nextProps) => isEqual(prevProps, nextProps)
);
