import { Box, Typography } from '@plentyag/brand-ui/src/material-ui/core';
import React from 'react';

const dataTestIds = {
  notSupportedMessage: 'landing-view-not-supported-message',
};

export { dataTestIds as dataTestIdsNotSupported };

/**
 * Not supported message
 */
export const NotSupported: React.FC = () => {
  return (
    <Box display="flex" data-testid={dataTestIds.notSupportedMessage}>
      <Box bgcolor="white">
        <Typography variant="h5">Interactive Maps are currently not supported for this farm</Typography>
        <p>
          We are only supporting some farms for interactive maps. Alternatively, you can use the Maps Table to see
          details of this farm's Containers and Materials
        </p>
      </Box>
    </Box>
  );
};
