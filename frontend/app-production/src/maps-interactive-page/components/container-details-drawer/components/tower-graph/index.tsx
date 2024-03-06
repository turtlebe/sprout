import { ContainerData, GetCropColor } from '@plentyag/app-production/src/maps-interactive-page/types';
import { Box } from '@plentyag/brand-ui/src/material-ui/core';
import React from 'react';

import { Legend } from '../../../legend';
import { getMapsStateForTray } from '../../utils/get-maps-state-for-tray';

import { TowerGraphContent } from './tower-graph-content';

const dataTestIds = {
  container: 'tower-graph',
  loading: 'tower-graph-loading',
};

export { dataTestIds as dataTestIdsTowerGraph };

interface TowerGraph {
  data?: ContainerData;
  getCropColor?: GetCropColor;
}

export const TowerGraph: React.FC<TowerGraph> = ({ data, getCropColor }) => {
  const siteName = data?.resourceState?.location?.machine?.siteName;
  const trayState = getMapsStateForTray(data);

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="stretch"
      height="100%"
      width="100%"
      data-testid={dataTestIds.container}
    >
      <Legend showCropLinks getCropColor={getCropColor} mapsState={trayState} />
      <TowerGraphContent siteName={siteName} getCropColor={getCropColor} trayState={trayState} />
    </Box>
  );
};
