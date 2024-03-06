import * as d3 from 'd3';

import { screenCoordsToSvg } from '../../utils';
import { useScale } from '../use-scale';

type ZoomCallback = (newXScale: ProdResources.XScale, newYScale: ProdResources.YScale) => void;
let callbacks: ZoomCallback[] = [];

export function useZoom(ref: ProdResources.ChartRef, focusedResource: ProdResources.FocusedResource) {
  const { x, y, height, tickHeight, timelineHeight, numYTicks } = useScale(ref, focusedResource);

  /**
   * Element to which zoom handler is attached, generally should be a top-level element so
   * mouse operations can be listened to.
   * @param svg Element to which we are attaching zoom handler.
   */
  function addZoomHandlerToElement(svg: ProdResources.Selection<SVGSVGElement>) {
    function zoomed(event: d3.D3ZoomEvent<SVGSVGElement, any>) {
      const newYScale = event.transform.rescaleY(y);
      const newXScale = event.transform.rescaleX(x);
      callbacks.forEach(callback => callback(newXScale, newYScale));
    }

    callbacks = [];

    const zoom = d3.zoom().scaleExtent([0.1, 1000]).on('zoom', zoomed);

    svg.call(zoom);

    // the initial view should be vertically centered on the focused resource, so a translation is needed.
    // since the graph can get very tall when there are many antecedent/subsequents, then the svg view will
    // get sliced off at the bottom, so here we calculate svg coordinates of the center from the center svg dom
    // coordinates.
    const svgNode = svg.node();
    const svgBoundingRect = svgNode.getBoundingClientRect();
    // center of svg in dom coords
    const centerX = svgBoundingRect.left + svgBoundingRect.width / 2;
    const centerY = svgBoundingRect.top + svgBoundingRect.height / 2;
    const centerOffSet = screenCoordsToSvg(svgNode, { x: centerX, y: centerY });

    // when there are an even number of ticks additonal offset is needed so focused resource is centered vertically.
    const evenOddOffset = numYTicks % 2 === 0 ? tickHeight / 2 : 0;

    svg
      .transition()
      .duration(1000)
      .call(
        zoom.transform,
        d3.zoomIdentity.translate(0, -height / 2 + centerOffSet.y + timelineHeight + evenOddOffset)
      );
  }

  /**
   * Register a callback that will be called when a zoom event occurs.
   * @param callback Function will be called
   */
  function registerZoomListener(callback: ZoomCallback) {
    callbacks.push(callback);
  }

  return { registerZoomListener, addZoomHandlerToElement };
}
