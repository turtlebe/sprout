import { ExpandMore } from '@material-ui/icons';
import { DeviceTypeAndSerial } from '@plentyag/app-devices/src/common/components';
import { Device } from '@plentyag/app-devices/src/common/types';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Typography,
} from '@plentyag/brand-ui/src/material-ui/core';
import React from 'react';

const dataTestIds = {};

export { dataTestIds as dataTestIdsIncompatibleDevices };

export interface IncompatibleDevices {
  devices: Device[];
}

import { useStyles } from './stytes';

export const IncompatibleDevices: React.FC<IncompatibleDevices> = ({ devices = [] }) => {
  const classes = useStyles({});

  if (devices.length === 0) {
    return null;
  }

  return (
    <Box padding={2}>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography variant="h6">Devices not available for Firmware Upgrade</Typography>
        </AccordionSummary>
        <AccordionDetails classes={{ root: classes.accordionDetailsRoot }}>
          {devices.map(device => (
            <Box key={device.id} pb={1} display="flex">
              <DeviceTypeAndSerial device={device} />
            </Box>
          ))}
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};
