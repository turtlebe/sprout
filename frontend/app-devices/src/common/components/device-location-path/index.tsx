// @todo: When using our IconButton implementation with a tooltip, a forwardRef React error is thrown.
// eslint-disable-next-line no-restricted-imports
import { IconButton } from '@material-ui/core';
import { FileCopyOutlined } from '@material-ui/icons';
import { Box, Tooltip, Typography } from '@plentyag/brand-ui/src/material-ui/core';
import { getDeviceLocationPath } from '@plentyag/core/src/farm-def/utils';
import { getShortenedPath } from '@plentyag/core/src/utils';
import React from 'react';
import { useCopyToClipboard } from 'react-use';

import { Device } from '../../types';

import { useStyles } from './styles';

const dataTestIds = {
  copyToClipboard: 'device-location-path-copy-to-clipboard',
};

export { dataTestIds as dataTestIdsDeviceLocationPath };

export interface DeviceLocationPath {
  device: Device;
  display?: CSSProperties['display'];
  width?: CSSProperties['width'];
  copyable?: boolean;
}

export const DeviceLocationPath: React.FC<DeviceLocationPath> = ({ device, width, display, copyable }) => {
  const [, copyToClipboard] = useCopyToClipboard();
  const classes = useStyles({ width, display });

  if (!device.location?.path) {
    return null;
  }

  const handleCopyToClipboard = () => {
    copyToClipboard(getDeviceLocationPath(device.location));
  };

  return (
    <Box className={classes.root}>
      <Tooltip interactive classes={{ tooltip: classes.tooltip }} title={getDeviceLocationPath(device.location)} arrow>
        <Typography className={classes.typography} noWrap={true}>
          {getShortenedPath(device.location.path)}
        </Typography>
      </Tooltip>
      {copyable && (
        <>
          <Box padding={0.5} />
          <Tooltip title="Copy farm-def path to clipboard" enterDelay={1000} arrow>
            <IconButton
              onClick={handleCopyToClipboard}
              size="small"
              color="default"
              data-testid={dataTestIds.copyToClipboard}
            >
              <FileCopyOutlined />
            </IconButton>
          </Tooltip>
        </>
      )}
    </Box>
  );
};
