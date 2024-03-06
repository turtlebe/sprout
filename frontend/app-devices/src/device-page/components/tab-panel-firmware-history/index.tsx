import { Device, FirmwareHistory } from '@plentyag/app-devices/src/common/types';
import { Card } from '@plentyag/brand-ui/src/components/card';
import {
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@plentyag/brand-ui/src/material-ui/core';
import { useLogAxiosErrorInSnackbar, useSwrAxios } from '@plentyag/core/src/hooks';
import { DateTimeFormat } from '@plentyag/core/src/utils';
import { DateTime } from 'luxon';
import React from 'react';

import { StyledTableCell, TableRowLoadingPlaceholder } from '../../../common/components';

function getFirmwareHistoryUrl(device: Device): string {
  return `/api/plentyservice/device-management/get-firmware-history/${device.id}`;
}

const dataTestIds = {
  tableRow: (history: FirmwareHistory) => `tab-panel-firmware-row-${history.createdAt}`,
  cellBinaryType: 'tab-panel-firmware-cell-binary-type',
  cellFirmwareVersion: 'tab-panel-firmware-cell-firmware-version',
  cellTime: 'tab-panel-firmware-cell-time',
};

export { dataTestIds as dataTestIdsTabPanelFirmwareHistory };

export interface TabPanelFirmwareHistory {
  device: Device;
}

export const TabPanelFirmwareHistory: React.FC<TabPanelFirmwareHistory> = ({ device }) => {
  const {
    data: firmwareHistory = [],
    isValidating,
    error,
  } = useSwrAxios<FirmwareHistory[]>({
    url: getFirmwareHistoryUrl(device),
  });
  useLogAxiosErrorInSnackbar(error);

  return (
    <Grid item xs={6}>
      <Card title="Firmware History" isLoading={false} doNotPadContent>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <StyledTableCell align="left">Type</StyledTableCell>
                <StyledTableCell align="left">Version</StyledTableCell>
                <StyledTableCell align="right">Time</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {firmwareHistory.map(history => (
                <TableRow key={history.createdAt} data-testid={dataTestIds.tableRow(history)}>
                  <TableCell align="left" data-testid={dataTestIds.cellBinaryType}>
                    {history.binaryType}
                  </TableCell>
                  <TableCell align="left" data-testid={dataTestIds.cellFirmwareVersion}>
                    {history.firmwareVersion}
                  </TableCell>
                  <TableCell align="right" data-testid={dataTestIds.cellTime}>
                    {DateTime.fromISO(history.createdAt).toFormat(DateTimeFormat.DEFAULT_WITH_SECONDS)}
                  </TableCell>
                </TableRow>
              ))}
              <TableRowLoadingPlaceholder
                colSpan={3}
                isLoading={isValidating}
                collection={firmwareHistory}
                text="No Firmware History"
              />
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </Grid>
  );
};
