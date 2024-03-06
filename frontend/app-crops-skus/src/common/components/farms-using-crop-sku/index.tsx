import { Box, Typography } from '@plentyag/brand-ui/src/material-ui/core';
import React from 'react';

import { HasFarm } from '../../types';
import { getActiveFarms } from '../../utils';

const dataTestIds = {
  activeFarms: 'farms-using-crop-skus-active-farms',
  notActiveFarm: 'farms-using-crop-skus-not-active-farm',
};

export { dataTestIds as dataTestIdsFarmsUsingCropSku };

interface FarmsUsingCropSku {
  hasFarm: HasFarm;
}

export const FarmsUsingCropSku: React.FC<FarmsUsingCropSku> = ({ hasFarm }) => {
  const farms = getActiveFarms(hasFarm).join(', ');
  return (
    <Box>
      {farms.length > 0 ? (
        <Typography data-testid={dataTestIds.activeFarms} variant="h6">
          Active Farms: <Typography display="inline">{farms}</Typography>
        </Typography>
      ) : (
        <Typography data-testid={dataTestIds.notActiveFarm}>This crop is not active in any farms</Typography>
      )}
    </Box>
  );
};
