import {
  ContainerData,
  ContainerEventHandler,
  GetCropColor,
  MapsState,
  QueryParameters,
} from '@plentyag/app-production/src/maps-interactive-page/types';
import { noop } from '@plentyag/app-production/src/maps-interactive-page/utils/noop';
import { FarmDefMachine } from '@plentyag/core/src/farm-def/types';
import React, { FC, memo, MutableRefObject, useCallback, useEffect, useRef } from 'react';

import { useVerticalGrowGraphApi } from '../../hooks/use-vertical-grow-graph-api';
import { drawCommentIcon } from '../../hooks/use-vertical-grow-graph-api/draw-comment-icon';
import { drawConflictPin } from '../../hooks/use-vertical-grow-graph-api/draw-conflict-pin';
import { drawMultiCropPin } from '../../hooks/use-vertical-grow-graph-api/draw-multi-crop-pin';
import { useVerticalGrowGraphData } from '../../hooks/use-vertical-grow-graph-data';
import { useVerticalGrowGraphScale } from '../../hooks/use-vertical-grow-graph-scale';
import { ZoomState } from '../../types';

import { useStyles } from './styles';

const dataTestIds = {
  container: 'svg-layer-graph',
};

export { dataTestIds as dataTestSvgLayerIds };

interface SvgLayer {
  'data-testid'?: string;
  machine: FarmDefMachine;
  zoomRef?: MutableRefObject<HTMLDivElement>;
  zoomState?: ZoomState;
  mapsState?: MapsState;
  width: number;
  height: number;
  towerWidth: number;
  selectedTower?: ContainerData;
  enableHotspot?: boolean;
  onClick?: (e: Event, machine: FarmDefMachine) => void;
  onTowerEnter?: ContainerEventHandler;
  onTowerExit?: ContainerEventHandler;
  onTowerClick?: ContainerEventHandler;
  queryParameters?: QueryParameters;
  getCropColor: GetCropColor;
}

export const SvgLayer: FC<SvgLayer> = memo(
  ({
    'data-testid': dataTestId,
    machine,
    mapsState,
    selectedTower,
    zoomRef,
    zoomState,
    width,
    height,
    towerWidth,
    enableHotspot = false,
    onClick = noop,
    onTowerEnter = noop,
    onTowerExit = noop,
    onTowerClick = noop,
    queryParameters,
    getCropColor,
  }) => {
    const classes = useStyles({});

    const svgRef = useRef<SVGSVGElement>(null);

    const { lanes } = useVerticalGrowGraphData(machine);
    const scale = useVerticalGrowGraphScale({ width, height, lanes, towerWidth });
    const { clear, renderAxis, renderHighlight, renderHotSpots, renderPins } = useVerticalGrowGraphApi({
      svgRef,
      scale,
    });

    const handleClick = useCallback(
      e => {
        onClick(e, machine);
      },
      [machine]
    );

    const showHighlight = machine && zoomState?.machine?.id === machine.id;

    useEffect(() => {
      if (svgRef.current && lanes?.length && width) {
        clear();
        renderAxis({ lanes });
        renderHighlight({ lanes, zoomRef, show: showHighlight });
        // render pins for towers with conflicts
        renderPins({
          mapsState,
          lanes,
          towerWidth,
          drawPin: drawConflictPin,
          queryParameters,
        });
        // render pins for towers with multiple crops
        renderPins({
          mapsState,
          lanes,
          towerWidth,
          drawPin: drawMultiCropPin({ getCropColor }),
          queryParameters,
        });
        // render comment icons
        renderPins({
          mapsState,
          lanes,
          towerWidth,
          drawPin: drawCommentIcon,
          queryParameters,
        });
        enableHotspot &&
          renderHotSpots({
            lanes,
            selectedTower,
            mapsState,
            towerWidth,
            onEnter: onTowerEnter,
            onExit: onTowerExit,
            onClick: onTowerClick,
          });
      }
      return () => {
        clear();
      };
    }, [lanes, svgRef.current, width, queryParameters]);

    return (
      <svg
        ref={svgRef}
        className={classes.svgChart}
        data-testid={dataTestId || dataTestIds.container}
        width={width}
        height={height}
        onClick={handleClick}
      />
    );
  }
);
