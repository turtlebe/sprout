import { Box, Chip } from '@plentyag/brand-ui/src/material-ui/core';
import React from 'react';
import { Link } from 'react-router-dom';

import { ROUTES } from '../../../routes';
import { Device } from '../../types';

export interface DeviceTypeAndSerial {
  device: Device;
}

export const DeviceTypeAndSerial: React.FC<DeviceTypeAndSerial> = ({ device }) => {
  return (
    <Box display="flex" alignItems="center">
      <Chip label={device.deviceTypeName} />
      <Box padding={0.5} />
      <Link to={ROUTES.devicePage(device.id)}>{device.serial}</Link>
    </Box>
  );
};
