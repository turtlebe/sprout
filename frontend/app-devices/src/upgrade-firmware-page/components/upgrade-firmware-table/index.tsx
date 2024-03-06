import { StyledTableCell, TableCellDeviceTypeAndSerial } from '@plentyag/app-devices/src/common/components';
import { Device, FirmwareUpgradeStatus } from '@plentyag/app-devices/src/common/types';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@plentyag/brand-ui/src/material-ui/core';
import { getDeviceLocationPath } from '@plentyag/core/src/farm-def/utils';
import React from 'react';

import { LastFirmwareUpgradeStatus } from '../last-firmware-upgrade-status';

export interface UpgradeFirmwareTable {
  devices: Device[];
  firmwareUpgradeStatuses?: FirmwareUpgradeStatus[];
}

export const UpgradeFirmwareTable: React.FC<UpgradeFirmwareTable> = ({ devices, firmwareUpgradeStatuses = [] }) => {
  return (
    <TableContainer component={Paper}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <StyledTableCell align="left">Device</StyledTableCell>
            <StyledTableCell align="left">Location</StyledTableCell>
            <StyledTableCell align="right">Status</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {devices.map((device, index) => (
            <TableRow key={index}>
              <TableCellDeviceTypeAndSerial device={device} />
              <TableCell align="left">{getDeviceLocationPath(device.location)}</TableCell>
              <TableCell align="right">
                <LastFirmwareUpgradeStatus firmwareUpgradeStatuses={firmwareUpgradeStatuses} device={device} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
