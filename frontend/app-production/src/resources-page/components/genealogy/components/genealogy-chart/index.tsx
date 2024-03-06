import { Box } from '@plentyag/brand-ui/src/material-ui/core';
import * as d3 from 'd3';
import { isEqual } from 'lodash';
import React from 'react';

import { useRenderChart } from '../../hooks/use-render-chart';
import { useScale } from '../../hooks/use-scale';
import { useZoom } from '../../hooks/use-zoom';

import { createDefs } from './utils';

export interface GenealogyChart {
  focusedResource: ProdResources.FocusedResource;
}

export const GenealogyChart: React.FC<GenealogyChart> = React.memo(
  ({ focusedResource }) => {
    const ref = React.useRef<SVGSVGElement>(null);
    const chartApi = useRenderChart(ref, focusedResource);
    const scale = useScale(ref, focusedResource);

    const { addZoomHandlerToElement } = useZoom(ref, focusedResource);

    React.useEffect(() => {
      if (focusedResource) {
        chartApi.clear();
        createDefs(ref.current);
        addZoomHandlerToElement(d3.select(ref.current));
        chartApi.renderTimeline();
        chartApi.renderGraph();
      }
    }, [focusedResource]);

    return (
      <Box flex="1 1 0" display="flex" justifyContent="center" flexDirection="column" overflow="hidden">
        <svg ref={ref} viewBox={`0 0 ${scale.width} ${scale.height}`} preserveAspectRatio="xMidYMin slice" />
      </Box>
    );
  },
  (prev, next) => {
    return isEqual(prev, next);
  }
);
