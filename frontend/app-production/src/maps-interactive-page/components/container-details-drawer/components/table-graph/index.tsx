import { useGetParentChildResources } from '@plentyag/app-production/src/common/hooks';
import { ContainerData, GetCropColor } from '@plentyag/app-production/src/maps-interactive-page/types';
import { Show } from '@plentyag/brand-ui/src/components';
import { Box, CircularProgress } from '@plentyag/brand-ui/src/material-ui/core';
import { DateTime } from 'luxon';
import React, { useMemo, useState } from 'react';

import { ContainerDetailsDrawer } from '../..';
import { ContainerSummaryTooltip } from '../../../container-summary-tooltip';
import { Legend } from '../../../legend';
import { getMapsStateFromChildResources } from '../../utils/get-maps-state-from-child-resources';

import { TableGraphContent } from './table-graph-content';

const dataTestIds = {
  container: 'table-graph',
  loading: 'table-graph-loading',
};

export { dataTestIds as dataTestIdsTableGraph };

interface TableGraph {
  data?: ContainerData;
  selectedDate?: DateTime;
  getCropColor?: GetCropColor;
}

export const TableGraph: React.FC<TableGraph> = ({ data, selectedDate, getCropColor }) => {
  const { isLoading, childResources } = useGetParentChildResources(data?.resourceState);
  const tablesState = useMemo(() => getMapsStateFromChildResources(childResources), [childResources]);
  const containerLocation = data?.containerLocation;
  const siteName = data?.resourceState?.location?.machine?.siteName;
  const irrigationExecution = data?.irrigationExecution;

  // Interaction States
  const [hoveredTray, setHoveredTray] = useState<{ node: Element; data: ContainerData }>(null);

  const [selectedTray, setSelectedTray] = useState<ContainerData>(null);

  // Interaction Events
  const handleTrayEnter = (_e, node, data) => {
    setHoveredTray({ node, data });
  };

  const handleTrayExit = () => {
    setHoveredTray(null);
  };

  const handleTrayClick = (_e, _node, data) => {
    setHoveredTray(null);
    if (data?.resourceState) {
      setSelectedTray({ ...data, containerLocation });
    }
  };

  const handleDrawerClose = () => {
    setSelectedTray(null);
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="stretch"
      height="100%"
      width="100%"
      data-testid={dataTestIds.container}
    >
      <Show when={!isLoading} fallback={<CircularProgress size="2rem" data-testid={dataTestIds.loading} />}>
        <Legend showCropLinks getCropColor={getCropColor} mapsState={tablesState} />
        <TableGraphContent
          getCropColor={getCropColor}
          irrigationExecution={irrigationExecution}
          tablesState={tablesState}
          siteName={siteName}
          onTrayClick={handleTrayClick}
          onTrayEnter={handleTrayEnter}
          onTrayExit={handleTrayExit}
        />
      </Show>
      <ContainerSummaryTooltip node={hoveredTray?.node} data={hoveredTray?.data} selectedDate={selectedDate} />
      <ContainerDetailsDrawer
        data={selectedTray}
        onClose={handleDrawerClose}
        getCropColor={getCropColor}
        selectedDate={selectedDate}
      />
    </Box>
  );
};
