import { Box, TableCell } from '@plentyag/brand-ui/src/material-ui/core';
import React from 'react';

import { DeviceLocationPath, DeviceTypeAndSerial } from '..';
import { Device } from '../../types';

export interface TableCellDeviceTypeAndSerial {
  device: Device;
  withLocation?: boolean;
}

export const TableCellDeviceTypeAndSerial: React.FC<TableCellDeviceTypeAndSerial> = ({ device, withLocation }) => {
  return (
    <TableCell align="left">
      <Box display="flex" alignItems="center">
        <DeviceTypeAndSerial device={device} />
        {withLocation && (
          <>
            <Box p={0.5} />
            <DeviceLocationPath device={device} />
          </>
        )}
      </Box>
    </TableCell>
  );
};
