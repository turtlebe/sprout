import * as d3 from 'd3';

import { useRenderGraph } from '../use-render-graph';
import { useRenderTimeline } from '../use-render-timeline';

export function useRenderChart(ref: ProdResources.ChartRef, focusedResource: ProdResources.FocusedResource) {
  const { renderTimeline } = useRenderTimeline(ref, focusedResource);
  const { renderGraph } = useRenderGraph(ref, focusedResource);
  const clear = () => {
    d3.select(ref.current).selectAll('svg > *').remove();
  };

  return {
    clear,
    renderTimeline,
    renderGraph,
  };
}
