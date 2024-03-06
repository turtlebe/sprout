import {
  DeviceBatteryLevel,
  DeviceLastCommunication,
  DeviceLocationPath,
  DeviceTypeAndSerial,
  StyledTableCell,
} from '@plentyag/app-devices/src/common/components';
import { Device } from '@plentyag/app-devices/src/common/types';
import { Card } from '@plentyag/brand-ui/src/components/card';
import {
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
} from '@plentyag/brand-ui/src/material-ui/core';
import React from 'react';

const dataTestIds = {
  card: 'tab-panel-associated-devices-card',
  cardLoader: 'tab-panel-associated-devices-card-loader',
  tableRow: (device: Device) => `tab-panel-associated-devices-table-row-device-${device.id}`,
  tablePagination: 'tab-panel-associated-devices-table-pagination',
};

export { dataTestIds as dataTestIdsTabPanelAssociatedDevices };

export const ROWS_PER_PAGE = 10;

export interface TabPanelAssociatedDevices {
  devices: Device[];
  isLoading: boolean;
}

export const TabPanelAssociatedDevices: React.FC<TabPanelAssociatedDevices> = ({ devices = [], isLoading }) => {
  const [page, setPage] = React.useState<number>(0);

  const handlePageChange = (event, newPage) => setPage(newPage);

  return (
    <Grid item xs={6}>
      <Card
        title="Associated Devices"
        isLoading={isLoading}
        data-testid={dataTestIds.card}
        data-testid-loader={dataTestIds.cardLoader}
        fallback="No associated devices."
        doNotPadContent
      >
        {devices.length > 0 && (
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <StyledTableCell>Type &amp; Serial</StyledTableCell>
                  <StyledTableCell>Device Location</StyledTableCell>
                  <StyledTableCell>Last communication</StyledTableCell>
                  <StyledTableCell>Battery Level</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {devices.slice(page * ROWS_PER_PAGE, page * ROWS_PER_PAGE + ROWS_PER_PAGE).map((device, index) => (
                  <TableRow key={index} data-testid={dataTestIds.tableRow(device)}>
                    <TableCell>
                      <DeviceTypeAndSerial device={device} />
                    </TableCell>
                    <TableCell>
                      <DeviceLocationPath device={device} copyable />
                    </TableCell>
                    <TableCell>
                      <DeviceLastCommunication device={device} noChip />
                    </TableCell>
                    <TableCell>
                      <DeviceBatteryLevel device={device} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              {devices.length > ROWS_PER_PAGE && (
                <TableFooter>
                  <TableRow>
                    <TablePagination
                      rowsPerPageOptions={[ROWS_PER_PAGE]}
                      rowsPerPage={ROWS_PER_PAGE}
                      count={devices.length}
                      page={page}
                      onPageChange={handlePageChange}
                      data-testid={dataTestIds.tablePagination}
                    />
                  </TableRow>
                </TableFooter>
              )}
            </Table>
          </TableContainer>
        )}
      </Card>
    </Grid>
  );
};
