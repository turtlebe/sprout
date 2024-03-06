import { CircularProgressCentered, Show } from '@plentyag/brand-ui/src/components';
import { Box } from '@plentyag/brand-ui/src/material-ui/core';
import { useCoreStore } from '@plentyag/core/src/core-store';
import { getKindFromPath } from '@plentyag/core/src/farm-def/utils';
import React from 'react';
import { useParams } from 'react-router-dom';

import { LandingView } from './components/landing-view';
import { MainAreaView } from './components/main-area-view';
import { useDefaultParameters } from './hooks/use-default-parameters';
import { useLoadMapsAreasData } from './hooks/use-load-maps-areas-data';
import { QueryParameterProvider } from './hooks/use-query-parameter';
import { isSupportedAreaAndLine } from './utils/is-supported-area-and-line';

const dataTestIds = {
  root: 'maps-interactive-page-view',
  loading: 'maps-interactive-page-view-loading',
};

export { dataTestIds as dataTestIdsMapsInteractivePage };

interface MapsInteractiveParams {
  area?: string;
  line?: string;
}

export const MapsInteractivePage: React.FC = () => {
  const [{ currentUser }] = useCoreStore();
  const currentFarmDefPath = currentUser.currentFarmDefPath;

  const siteName = getKindFromPath(currentFarmDefPath, 'sites');
  const farmName = getKindFromPath(currentFarmDefPath, 'farms');

  const params = useParams<MapsInteractiveParams>();
  const areaName = params?.area;
  const lineName = params?.line;

  const {
    areas,
    lines,
    area,
    line,
    farm,
    isValidating: isLoading,
  } = useLoadMapsAreasData({
    siteName,
    farmName,
    areaName,
    lineName,
  });

  const { defaultParameters, handleMapsReset } = useDefaultParameters({ area, line });

  return (
    <QueryParameterProvider defaultParameters={defaultParameters}>
      <Box height="100%" data-testid={dataTestIds.root}>
        <Show when={!isLoading} fallback={<CircularProgressCentered data-testid={dataTestIds.loading} />}>
          <Show
            when={isSupportedAreaAndLine(area?.class, line?.class)}
            fallback={<LandingView farm={farm} area={area} areas={areas} line={line} lines={lines} />}
          >
            <MainAreaView
              farm={farm}
              area={area}
              areas={areas}
              line={line}
              lines={lines}
              onMapsReset={handleMapsReset}
            />
          </Show>
        </Show>
      </Box>
    </QueryParameterProvider>
  );
};
