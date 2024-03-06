import { useLoadMapsLineData } from '@plentyag/app-production/src/maps-interactive-page/hooks/use-load-maps-line-data';
import { CircularProgressCentered, Show } from '@plentyag/brand-ui/src/components';
import { Box, Divider } from '@plentyag/brand-ui/src/material-ui/core';
import { FarmDefArea, FarmDefFarm, FarmDefLine } from '@plentyag/core/src/farm-def/types';
import React from 'react';

import { DEFAULT_CONTAINER_TYPE_BY_LINE } from '../../constants';
import { useGetCropsColor, useLoadMapsState } from '../../hooks';
import { useQueryParameter } from '../../hooks/use-query-parameter';
import { filterMapsState } from '../../utils/filter-maps-state';
import {
  isSupportedGerminationLine,
  isSupportedPropagationRack,
  isSupportedVerticalGrowRoom,
} from '../../utils/is-supported-area-and-line';
import { FiltersButton } from '../filters-button';
import { GerminationLineView } from '../germination-line-view';
import { Header } from '../header';
import { LayersButton } from '../layers-button';
import { Legend } from '../legend';
import { PropagationRackView } from '../propagation-rack-view';
import { VerticalGrowRoomView } from '../vertical-grow-room-view';

const dataTestIds = {
  root: 'main-area-view',
  loading: 'main-area-view-loading',
};

export { dataTestIds as dataTestIdsMainAreaView };

interface MainAreaView {
  farm?: FarmDefFarm;
  area?: FarmDefArea;
  areas?: FarmDefArea[];
  line?: FarmDefLine;
  lines?: FarmDefLine[];
  onMapsReset?: () => void;
}

export const MainAreaView: React.FC<MainAreaView> = ({ farm, area, areas, line, lines, onMapsReset }) => {
  const linePath = line?.path;

  // State
  const { parameters } = useQueryParameter();

  // Data
  const containerType = DEFAULT_CONTAINER_TYPE_BY_LINE[line.class];
  const { machines, isLoading: isLoadingMachines } = useLoadMapsLineData(linePath);
  const { mapsState, isLoading: isLoadingMapsState } = useLoadMapsState({
    linePath,
    selectedDate: parameters.selectedDate,
    containerType,
    showWarningWhenMapsStateIsEmpty: true,
  });
  const { getCropColor, isLoading: isLoadingCropsColor } = useGetCropsColor();

  // Values
  const filteredMapsState = filterMapsState({ mapsState, queryParameters: parameters });
  const isLoading = isLoadingMachines || isLoadingMapsState || isLoadingCropsColor;

  return (
    <Box display="flex" flexDirection="column" height="100%" data-testid={dataTestIds.root}>
      <Header
        farm={farm}
        area={area}
        areas={areas}
        line={line}
        lines={lines}
        mapsState={mapsState}
        machines={machines}
        isLoadingMachines={isLoadingMachines}
        onMapsReset={onMapsReset}
      />
      <Divider />
      <Box display="flex" flexDirection="column" flexGrow={1} flexShrink={1} height="100%" overflow="hidden">
        <Show
          when={!isLoading && Boolean(mapsState)}
          fallback={<CircularProgressCentered data-testid={dataTestIds.loading} />}
        >
          <Box px={3} py={1} display="flex" flexDirection="row" gridGap="4px">
            <Legend getCropColor={getCropColor} mapsState={filteredMapsState} />
            <Box marginLeft="auto">
              <FiltersButton mapsState={mapsState} />
            </Box>
            <LayersButton />
          </Box>
          <Show when={isSupportedGerminationLine(area.class, line.class)}>
            <GerminationLineView
              machines={machines}
              mapsState={mapsState}
              getCropColor={getCropColor}
              queryParameters={parameters}
            />
          </Show>
          <Show when={isSupportedPropagationRack(area.class, line.class)}>
            <PropagationRackView
              line={line}
              machines={machines}
              mapsState={mapsState}
              getCropColor={getCropColor}
              queryParameters={parameters}
            />
          </Show>
          <Show when={isSupportedVerticalGrowRoom(area.class, line.class)}>
            <VerticalGrowRoomView
              machines={machines}
              mapsState={mapsState}
              getCropColor={getCropColor}
              queryParameters={parameters}
            />
          </Show>
        </Show>
      </Box>
    </Box>
  );
};
