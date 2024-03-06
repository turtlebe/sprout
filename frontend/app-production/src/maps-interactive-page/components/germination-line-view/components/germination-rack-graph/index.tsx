import {
  ContainerData,
  ContainerEventHandler,
  GetCropColor,
  MapsState,
  QueryParameters,
} from '@plentyag/app-production/src/maps-interactive-page/types';
import { FarmDefMachine } from '@plentyag/core/src/farm-def/types';
import { useResizeObserver } from '@plentyag/core/src/hooks';
import React, { useEffect, useRef } from 'react';

import { useGerminationRackGraphApi } from '../../hooks/use-germination-rack-graph-api';
import { useGerminationRackGraphScale } from '../../hooks/use-germination-rack-graph-scale';

import { useStyles } from './styles';

const dataTestIds = {
  container: 'germination-rack-graph',
};

export { dataTestIds as dataTestIdsGerminationRackGraph };

interface GerminationRackGraph {
  containerLocations: FarmDefMachine['containerLocations'];
  mapsState: MapsState;
  getCropColor: GetCropColor;
  selectedTable?: ContainerData;
  queryParameters?: QueryParameters;
  onTableEnter?: ContainerEventHandler;
  onTableExit?: ContainerEventHandler;
  onTableClick?: ContainerEventHandler;
}

export const GerminationRackGraph: React.FC<GerminationRackGraph> = ({
  selectedTable,
  containerLocations,
  queryParameters,
  mapsState,
  getCropColor,
  onTableEnter,
  onTableExit,
  onTableClick,
}) => {
  const classes = useStyles({});

  const ref = useRef<HTMLDivElement>(null);
  const refSize = useResizeObserver(ref);
  const scale = useGerminationRackGraphScale({ width: refSize.width, height: refSize.height, containerLocations });
  const { clear, renderGraph } = useGerminationRackGraphApi({ ref, scale });

  useEffect(() => {
    if (containerLocations && ref?.current && refSize?.width && refSize?.height) {
      renderGraph({
        selectedTable,
        containerLocations,
        queryParameters,
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
  }, [containerLocations, queryParameters, selectedTable, ref, refSize]);

  return <div ref={ref} className={classes.diagramContainer} data-testid={dataTestIds.container}></div>;
};
