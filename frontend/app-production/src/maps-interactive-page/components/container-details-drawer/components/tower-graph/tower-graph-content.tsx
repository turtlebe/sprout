import { GetCropColor, MapsState } from '@plentyag/app-production/src/maps-interactive-page/types';
import { useResizeObserver } from '@plentyag/core/src/hooks';
import React, { useEffect, useRef } from 'react';

import { useTowerGraphApi } from '../../hooks/use-tower-graph-api';
import { useTowerGraphScale } from '../../hooks/use-tower-graph-scale';

import { useStyles } from './styles';

const dataTestIds = {
  container: 'tower-graph-content',
};

export { dataTestIds as dataTestIdsTowerGraphContent };

interface TowerGraphContent {
  siteName?: string;
  trayState?: MapsState;
  getCropColor?: GetCropColor;
}

export const TowerGraphContent: React.FC<TowerGraphContent> = ({ siteName, trayState, getCropColor }) => {
  const classes = useStyles({});

  const ref = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const refSize = useResizeObserver(ref);

  const plugs = Object.values(trayState);

  const scale = useTowerGraphScale({ siteName, ...refSize });
  const { clear, renderTower } = useTowerGraphApi({ ref, svgRef, scale });

  // Render
  useEffect(() => {
    if (trayState && svgRef?.current && refSize?.width && refSize?.height) {
      clear();
      renderTower({ plugs, getCropColor, siteName });
    }
    return () => {
      clear();
    };
  }, [trayState, svgRef, refSize]);

  return (
    <div ref={ref} className={classes.diagramContainer} data-testid={dataTestIds.container}>
      <svg ref={svgRef} className={classes.svgChart} width={refSize.width} height={scale.contentHeight} />
    </div>
  );
};
