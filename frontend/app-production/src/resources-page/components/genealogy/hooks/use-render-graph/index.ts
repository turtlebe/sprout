import { SearchActions, SearchState, useSearch } from '@plentyag/app-production/src/resources-page/hooks/use-search';
import * as d3 from 'd3';

import { useScale } from '../use-scale';
import { useZoom } from '../use-zoom';

import { renderAntecedents } from './render-antecedents';
import { renderFocusedResource } from './render-focused-resource';
import { renderParentResource } from './render-parent-resource';
import { renderSubsequents } from './render-subsequents';
import { getViewBounds } from './utils';

export function useRenderGraph(ref: ProdResources.ChartRef, focusedResource: ProdResources.FocusedResource) {
  const [{ searchResult }, { search }] = useSearch<SearchState, SearchActions>();
  const { x, y, numYTicks, width, height, timelineHeight } = useScale(ref, focusedResource);
  const { registerZoomListener } = useZoom(ref, focusedResource);

  const focusedResourceMaterialId = searchResult.materialId;
  const focusedResourceIndex = Math.floor(numYTicks / 2);

  const renderGraph = (scale: ProdResources.Scale, svg: ProdResources.Selection<SVGElement>) => {
    if (!ref.current) {
      return;
    }
    const viewBounds = getViewBounds(ref.current);
    renderAntecedents({
      focusedResource,
      focusedResourceIndex,
      focusedResourceMaterialId,
      search,
      svg,
      scale,
      viewBounds,
    });
    renderSubsequents({ focusedResource, focusedResourceIndex, search, svg, scale, viewBounds });
    renderParentResource({ focusedResource, focusedResourceIndex, search, svg, scale, viewBounds });
    renderFocusedResource({ focusedResource, focusedResourceIndex, search, svg, scale, viewBounds });
  };

  const renderInitialGraph = () => {
    // add a clipping that covers graph areas so does not render outside of view (ex: overlaping timeline)
    d3.select(ref.current)
      .append('defs')
      .append('svg:clipPath')
      .attr('id', 'clip')
      .append('svg:rect')
      .attr('width', width)
      .attr('height', height)
      .attr('x', 0)
      .attr('y', timelineHeight);

    const svg = d3.select(ref.current).append('g').attr('clip-path', 'url(#clip)');

    const scale: ProdResources.Scale = {
      xScale: x,
      yScale: y,
    };
    renderGraph(scale, svg);

    registerZoomListener((newXScale, newYScale) => {
      // remove all elements in graph and re-render at new scale.
      svg.selectAll('*').interrupt().remove();
      const scale: ProdResources.Scale = {
        xScale: newXScale,
        yScale: newYScale,
      };
      renderGraph(scale, svg);
    });
  };

  return {
    renderGraph: renderInitialGraph,
  };
}
