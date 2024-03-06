import {
  ContainerData,
  ContainerEventHandler,
  GetCropColor,
  MapsState,
  QueryParameters,
} from '@plentyag/app-production/src/maps-interactive-page/types';
import { FarmDefMachine } from '@plentyag/core/src/farm-def/types';
import { useMeasure } from '@plentyag/core/src/hooks';
import React, { useEffect, useRef } from 'react';

import { usePropagationLevelGraphApi } from '../../hooks/use-propagation-level-graph-api';
import { usePropagationLevelGraphScale } from '../../hooks/use-propagation-level-graph-scale';

import { useStyles } from './styles';

const dataTestIds = {
  container: 'propgation-rack-graph',
};

export { dataTestIds as dataTestIdsPropagationLevelGraph };

interface PropagationLevelGraph {
  containerLocations: FarmDefMachine['containerLocations'];
  mapsState: MapsState;
  getCropColor: GetCropColor;
  showLift?: boolean;
  selectedTable?: ContainerData;
  queryParameters: QueryParameters;
  onTableEnter?: ContainerEventHandler;
  onTableExit?: ContainerEventHandler;
  onTableClick?: ContainerEventHandler;
}

export const PropagationLevelGraph: React.FC<PropagationLevelGraph> = ({
  containerLocations,
  mapsState,
  getCropColor,
  showLift,
  selectedTable,
  queryParameters,
  onTableEnter,
  onTableExit,
  onTableClick,
}) => {
  const numSlots = containerLocations ? Object.keys(containerLocations).length : 0;
  const classes = useStyles({ numSlots });

  const ref = useRef<HTMLDivElement>(null);
  const refSize = useMeasure(ref);
  const scale = usePropagationLevelGraphScale({ width: refSize.width, height: refSize.height, containerLocations });
  const { clear, renderGraph } = usePropagationLevelGraphApi({ ref, scale, showLift });

  useEffect(() => {
    if (getCropColor && mapsState && containerLocations && ref?.current && refSize?.width && refSize?.height) {
      renderGraph({
        selectedTable,
        queryParameters,
        containerLocations,
        mapsState,
        getCropColor,
        onEnter: onTableEnter,
        onExit: onTableExit,
        onClick: onTableClick,
      });
    }
    return () => {
      clear();
    };
  }, [containerLocations, queryParameters, selectedTable, mapsState, ref, refSize]);

  return <div ref={ref} className={classes.diagramContainer} data-testid={dataTestIds.container}></div>;
};
