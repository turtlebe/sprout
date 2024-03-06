import { Show } from '@plentyag/brand-ui/src/components';
import { Box, Divider } from '@plentyag/brand-ui/src/material-ui/core';
import { FarmDefArea, FarmDefFarm, FarmDefLine } from '@plentyag/core/src/farm-def/types';
import React from 'react';

import { Header } from '../header';

import { AreaCard } from './components/area-card';
import { NotSupported } from './components/not-supported';

const dataTestIds = {
  root: 'landing-view',
};

export { dataTestIds as dataTestIdsLandingView };

interface LandingView {
  farm?: FarmDefFarm;
  area?: FarmDefArea;
  areas?: FarmDefArea[];
  line?: FarmDefLine;
  lines?: FarmDefLine[];
}

/**
 * Landing view is the "home" page of the interactive maps displaying
 * all the areas and lines of the indicated site/farm
 */
export const LandingView: React.FC<LandingView> = ({ farm, area, areas = [], line, lines = [] }) => {
  return (
    <Box display="flex" flexDirection="column" height="100%" data-testid={dataTestIds.root}>
      <Header farm={farm} area={area} areas={areas} line={line} lines={lines} />
      <Divider />
      <Box px={3} py={1} height="100%">
        <Show when={areas.length > 0} fallback={<NotSupported />}>
          <Box display="grid" gridTemplateColumns="1fr 1fr 1fr" gridGap="16px">
            {areas.map(area => (
              <AreaCard key={area.name} area={area} />
            ))}
          </Box>
        </Show>
      </Box>
    </Box>
  );
};
