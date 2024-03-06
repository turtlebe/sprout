import { Box } from '@plentyag/brand-ui/src/material-ui/core';
import { FarmDefMachine } from '@plentyag/core/src/farm-def/types';
import React, { useState } from 'react';

import { ContainerData, GetCropColor, MapsState, QueryParameters } from '../../types';
import { ContainerDetailsDrawer } from '../container-details-drawer';
import { ContainerSummaryTooltip } from '../container-summary-tooltip';
import { MachineDiagram } from '../machine-diagram';

import { GerminationRackGraph } from './components/germination-rack-graph';
import { useStyles } from './styles';

const dataTestIds = {
  container: 'germination-line-view',
  displayName: 'germination-line-view-display-name',
  loading: 'germination-line-view-loading',
};

export { dataTestIds as dataTestIdsGerminationLineView };

interface GerminationLineView {
  machines: FarmDefMachine[];
  mapsState: MapsState;
  queryParameters: QueryParameters;
  getCropColor: GetCropColor;
}

export const GerminationLineView: React.FC<GerminationLineView> = ({
  machines,
  mapsState,
  getCropColor,
  queryParameters,
}) => {
  const classes = useStyles({});

  // Interaction States
  const [hoveredTable, setHoveredTable] = useState<{ node: Element; data: ContainerData }>(null);
  const [selectedTable, setSelectedTable] = useState<ContainerData>(null);

  // Interaction Events
  const handleTableEnter = (_e, node, data) => {
    setHoveredTable({ node, data });
  };

  const handleTableExit = () => {
    setHoveredTable(null);
  };

  const handleTableClick = (_e, _el, data) => {
    setHoveredTable(null);
    if (data?.resourceState || data?.conflicts) {
      setSelectedTable(data);
    }
  };

  const handleDrawerClose = () => {
    setSelectedTable(null);
  };

  return (
    <Box px={3} height="100%" display="flex" flexDirection="column" data-testid={dataTestIds.container}>
      <Box display="flex" py={1} height="100%" style={{ overflowX: 'auto', overflowY: 'hidden' }}>
        {machines.map(machine => (
          <MachineDiagram key={machine.name} title={machine.name} machineClassName={classes.machine}>
            <GerminationRackGraph
              containerLocations={machine.containerLocations}
              selectedTable={selectedTable}
              queryParameters={queryParameters}
              getCropColor={getCropColor}
              mapsState={mapsState}
              onTableEnter={handleTableEnter}
              onTableExit={handleTableExit}
              onTableClick={handleTableClick}
            />
          </MachineDiagram>
        ))}
      </Box>
      <ContainerDetailsDrawer
        data={selectedTable}
        onClose={handleDrawerClose}
        getCropColor={getCropColor}
        selectedDate={queryParameters.selectedDate}
      />
      <ContainerSummaryTooltip
        node={hoveredTable?.node}
        data={hoveredTable?.data}
        selectedDate={queryParameters.selectedDate}
      />
    </Box>
  );
};
