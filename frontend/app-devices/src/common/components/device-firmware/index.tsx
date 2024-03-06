import { Box, Chip, Typography } from '@plentyag/brand-ui/src/material-ui/core';
import React from 'react';

import { DmsDevice } from '../../types';

export interface DeviceFirmware {
  device: DmsDevice;
}

export const DeviceFirmware: React.FC<DeviceFirmware> = ({ device }) => {
  if (!device) {
    return null;
  }

  if (!device.appFirmwareVersion && !device.bootloaderFirmwareVersion) {
    return (
      <Box display="flex">
        <Typography variant="h6" color="textSecondary">
          Firmware: --
        </Typography>
      </Box>
    );
  }

  return (
    <Box display="flex">
      <Typography variant="h6" color="textSecondary">
        Firmware:&nbsp;
      </Typography>
      <Chip label={`APP: ${device.appFirmwareVersion}`} />
      <Box padding={0.25} />
      <Chip label={`BOOT: ${device.bootloaderFirmwareVersion}`} />
    </Box>
  );
};
