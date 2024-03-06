import { DRAWER_TRANSITION_SPEED, STYLE } from '@plentyag/app-production/src/maps-interactive-page/constants';
import * as d3 from 'd3';
import { MutableRefObject } from 'react';

import { ZOOM_TOWER_WIDTH } from '../../constants';
import { getZoomFullWidth } from '../../utils/get-zoom-full-width';
import { GrowLaneData } from '../use-vertical-grow-graph-data';

import { RenderFunction } from '.';

export interface RenderHighlight {
  lanes: GrowLaneData[];
  zoomRef: MutableRefObject<HTMLDivElement>;
  show?: boolean;
}

export const HIGHLIGHT_CLASS = 'highlight';
export const HOVER_HIGHLIGHT_CLASS = 'hover-highlight';

export const renderHighlight: RenderFunction<RenderHighlight> =
  ({ svgRef, scale }) =>
  ({ lanes, zoomRef, show = false }) => {
    // No DOM ref or zoomed node? get outta here!
    if (!svgRef?.current || !zoomRef?.current) {
      return;
    }

    const towerWidth = ZOOM_TOWER_WIDTH;

    // Scale metadata
    const { paddingX, width, height, chartMarginX } = scale;

    // Zoom View
    // -- Get widths
    const zoomedFullWidth = getZoomFullWidth(lanes, towerWidth);
    const zoomedWidth = width;

    // -- Get current scroll
    const zoomNode = zoomRef.current;
    const zoomScrollLeft = zoomNode.scrollLeft;

    // Calculate highlight width
    const highlightRatio = zoomedWidth / zoomedFullWidth;

    // -- Chart & highlight left padding
    const chartPaddingLeft = paddingX + chartMarginX;
    const highlightZoomPaddingLeft = chartPaddingLeft * highlightRatio;

    // -- Chart & highlight width
    const chartWidth = width - chartPaddingLeft * 2 + highlightZoomPaddingLeft * 2;
    const highlightWidth = highlightRatio * chartWidth;

    // -- Chart & highlihgt scroll max
    const zoomScrollMax = zoomedFullWidth - zoomedWidth;
    const highlightScrollMax = chartWidth - highlightWidth;

    // -- Highlight scroll left
    const highlightScrollLeft = (highlightScrollMax * zoomScrollLeft) / zoomScrollMax - highlightZoomPaddingLeft;

    // -- Highlight X with chart offset
    const highlightX = highlightScrollLeft + chartPaddingLeft;

    // SVG Element
    const svgChartEl = d3.select(svgRef.current);

    // Click and hover interactions
    svgChartEl
      .on('click', function (e) {
        // -- Calculate what the scroll would be for zoome view
        const posX = e.offsetX - highlightWidth / 2 - chartPaddingLeft;
        const scrollLeft = (posX / chartWidth) * zoomedFullWidth;

        // If zoom is visible, move scroll right away, otherwise delay until it's visible
        if (zoomNode.getBoundingClientRect().height > 0) {
          zoomNode.scrollLeft = scrollLeft;
        } else {
          setTimeout(() => {
            if (zoomNode) {
              zoomNode.scrollLeft = scrollLeft;
            }
          }, DRAWER_TRANSITION_SPEED);
        }
      })
      .on('mouseenter', function () {
        d3.select(this)
          .insert('g', ':first-child')
          .classed(HOVER_HIGHLIGHT_CLASS, true)
          .append('rect')
          .attr('stroke', STYLE.hover.strokeColor)
          .attr('stroke-width', STYLE.hover.strokeWidth)
          .attr('fill', STYLE.hover.fillColor)
          .style('cursor', 'zoom-in');
      })
      .on('mousemove', function (e) {
        d3.select(this)
          .select(`g.${HOVER_HIGHLIGHT_CLASS} rect`)
          .attr('width', highlightWidth)
          .attr('height', height)
          .attr('x', e.offsetX - highlightWidth / 2)
          .attr('y', 0);
      })
      .on('mouseleave', function () {
        d3.select(this).select(`g.${HOVER_HIGHLIGHT_CLASS}`).remove();
      });

    // Highlighting only when show is true and zoom drawer is visible
    if (show && zoomNode.getBoundingClientRect().height > 0) {
      // Add Rect if needed
      const highlightEl: d3.Selection<any, any, any, any> = svgChartEl.select(`rect.${HIGHLIGHT_CLASS}`).node()
        ? svgChartEl.select(`rect.${HIGHLIGHT_CLASS}`)
        : svgChartEl.append('rect').classed(HIGHLIGHT_CLASS, true);

      // -- Draw highlight
      highlightEl
        .attr('x', highlightX)
        .attr('y', 0)
        .attr('width', highlightWidth)
        .attr('height', height)
        .attr('stroke', STYLE.active.strokeColor)
        .attr('stroke-width', STYLE.active.strokeWidth)
        .attr('fill', STYLE.active.fillColor);

      // -- Highlight interactions
      highlightEl
        .call(
          d3.drag().on('drag', function (e) {
            const posX = e.x - chartPaddingLeft;
            zoomNode.scrollLeft = (posX / chartWidth) * zoomedFullWidth;
          })
        )
        .on('mouseenter', function () {
          if (svgChartEl.select(`g.${HOVER_HIGHLIGHT_CLASS}`).node()) {
            svgChartEl.select(`g.${HOVER_HIGHLIGHT_CLASS}`).style('visibility', 'hidden');
          }
        })
        .on('mouseleave', function () {
          if (svgChartEl.select(`g.${HOVER_HIGHLIGHT_CLASS}`).node()) {
            svgChartEl.select(`g.${HOVER_HIGHLIGHT_CLASS}`).style('visibility', 'visible');
          }
        });
    }
  };
