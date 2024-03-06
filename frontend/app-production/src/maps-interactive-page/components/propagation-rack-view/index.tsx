import { MachineDiagram } from '@plentyag/app-production/src/maps-interactive-page/components/machine-diagram';
import { Show } from '@plentyag/brand-ui/src/components';
import { Box, CircularProgress } from '@plentyag/brand-ui/src/material-ui/core';
import { FarmDefLine, FarmDefMachine } from '@plentyag/core/src/farm-def/types';
import React from 'react';

import {
  ContainerData,
  GetCropColor,
  MapsState,
  QueryParameters,
  SupportedLiftTypes,
  SupportedMachineClass,
} from '../../types';
import { ContainerDetailsDrawer } from '../container-details-drawer';
import { ContainerSummaryTooltip } from '../container-summary-tooltip';

import { BufferGraph, LiftGraph, PropagationLevelGraph } from './components';
import { useGetPropagationLoadBuffer } from './hooks';
import { useStyles } from './styles';
import { getNumberFromEndOfString } from './utils';

const dataTestIds = {
  root: 'propagation-rack-view',
  displayName: 'propagation-rack-view-display-name',
  loading: 'propagation-rack-view-loading',
};

export { dataTestIds as dataTestIdsPropagationRackView };

interface PropagationRackView {
  line: FarmDefLine;
  machines: FarmDefMachine[];
  mapsState: MapsState;
  queryParameters: QueryParameters;
  getCropColor: GetCropColor;
}

export const PropagationRackView: React.FC<PropagationRackView> = ({
  line,
  machines,
  mapsState,
  getCropColor,
  queryParameters,
}) => {
  const classes = useStyles({});

  const linePath = line?.path;

  const {
    loadBufferContainerLocation,
    loadBufferState,
    isLoading: isLoadingPropagationLoadBuffer,
  } = useGetPropagationLoadBuffer({
    selectedDate: queryParameters.selectedDate,
    linePath,
    propagationRack: getNumberFromEndOfString(line.name),
  });

  // Interaction States
  const [hoveredTable, setHoveredTable] = React.useState<{ node: Element; data: ContainerData }>(null);
  const [selectedTable, setSelectedTable] = React.useState<ContainerData>(null);

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

  // reverse sort by propagation level number, highest level first.
  const sortedPropRackLevelMachines = React.useMemo(
    () =>
      machines
        .filter(machine => machine.class === SupportedMachineClass.PropRackLevel)
        .sort((a, b) => getNumberFromEndOfString(b.name) - getNumberFromEndOfString(a.name)),
    [machines]
  );

  const isLoading = isLoadingPropagationLoadBuffer;

  return (
    <Box px={3} py={0.5} className={classes.container} data-testid={dataTestIds.root}>
      <Show when={!isLoading} fallback={<CircularProgress size="2rem" data-testid={dataTestIds.loading} />}>
        <Box className={classes.graphContainer}>
          <Box className={classes.headLift}>
            <LiftGraph
              machines={machines}
              liftType={SupportedLiftTypes.HeadTableLift}
              getCropColor={getCropColor}
              mapsState={mapsState}
              selectedTable={selectedTable}
              queryParameters={queryParameters}
              onTableEnter={handleTableEnter}
              onTableExit={handleTableExit}
              onTableClick={handleTableClick}
            />
          </Box>
          <Box className={classes.buffer}>
            <Show when={!!loadBufferContainerLocation}>
              <BufferGraph
                loadBufferContainerLocation={loadBufferContainerLocation}
                getCropColor={getCropColor}
                loadBufferState={loadBufferState}
                selectedTable={selectedTable}
                queryParameters={queryParameters}
                onTableEnter={handleTableEnter}
                onTableExit={handleTableExit}
                onTableClick={handleTableClick}
              />
            </Show>
          </Box>
          <Box className={classes.machines}>
            {sortedPropRackLevelMachines.map(machine => (
              <MachineDiagram key={machine.name} title={machine.name} containerClassName={classes.machineContainer}>
                <PropagationLevelGraph
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
          <Box className={classes.tailLift}>
            <LiftGraph
              machines={machines}
              liftType={SupportedLiftTypes.TailTableLift}
              getCropColor={getCropColor}
              mapsState={mapsState}
              selectedTable={selectedTable}
              queryParameters={queryParameters}
              onTableEnter={handleTableEnter}
              onTableExit={handleTableExit}
              onTableClick={handleTableClick}
            />
          </Box>
        </Box>
      </Show>
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
