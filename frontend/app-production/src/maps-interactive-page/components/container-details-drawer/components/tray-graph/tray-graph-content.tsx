import { GetCropColor, MapsState } from '@plentyag/app-production/src/maps-interactive-page/types';
import { useResizeObserver } from '@plentyag/core/src/hooks';
import React, { useEffect, useRef } from 'react';

import { useTrayGraphApi } from '../../hooks/use-tray-graph-api';
import { useTrayGraphScale } from '../../hooks/use-tray-graph-scale';

import { useStyles } from './styles';

const dataTestIds = {
  container: 'table-graph-content',
};

export { dataTestIds as dataTestIdsTrayGraphContent };

interface TrayGraphContent {
  siteName?: string;
  trayState?: MapsState;
  getCropColor?: GetCropColor;
}

export const TrayGraphContent: React.FC<TrayGraphContent> = ({ siteName, trayState, getCropColor }) => {
  const classes = useStyles({});

  const ref = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const refSize = useResizeObserver(ref);

  const plugs = Object.values(trayState);

  const scale = useTrayGraphScale({ siteName, ...refSize });
  const { clear, renderTray } = useTrayGraphApi({ ref, svgRef, scale });

  // Render
  useEffect(() => {
    if (trayState && svgRef?.current && refSize?.width && refSize?.height) {
      clear();
      renderTray({ plugs, getCropColor, siteName });
    }
    return () => {
      clear();
    };
  }, [trayState, svgRef, refSize]);

  return (
    <div ref={ref} className={classes.diagramContainer} data-testid={dataTestIds.container}>
      <svg ref={svgRef} className={classes.svgChart} width={refSize.width} height={refSize.height} />
    </div>
  );
};
