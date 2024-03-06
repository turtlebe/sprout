import { InfoOutlined } from '@material-ui/icons';
import { Box, Typography } from '@plentyag/brand-ui/src/material-ui/core';
import React from 'react';

export const DecommissionedDevice: React.FC = () => {
  return (
    <Box display="flex" alignItems="center">
      <Typography color="textSecondary" style={{ display: 'flex' }}>
        <InfoOutlined fontSize="small" color="inherit" />
      </Typography>
      &nbsp;
      <Typography variant="caption" color="textSecondary">
        Decommissioned device
      </Typography>
    </Box>
  );
};
