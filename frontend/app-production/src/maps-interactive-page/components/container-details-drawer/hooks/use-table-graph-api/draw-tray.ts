import clsx from 'clsx';
import * as d3 from 'd3';

interface DrawTray {
  el: d3.Selection<any, any, any, any>;
  className?: string;
  x: number;
  y: number;
  width: number;
  height: number;
  trayColor?: string;
  strokeWidth: number;
  strokeColor: string;
  xColor?: string;
}

export const TRAY_CLASS = 'tray-graph';
export const X_CLASS = 'tray-x-marker';

export const drawTray = ({
  el,
  className,
  x,
  y,
  width,
  height,
  trayColor,
  strokeWidth,
  strokeColor,
  xColor,
}: DrawTray): d3.Selection<any, any, any, any> => {
  const drawnTrayEl = el.append('g').attr('class', clsx([TRAY_CLASS, className]));

  drawnTrayEl
    .append('rect')
    .attr('x', x)
    .attr('y', y)
    .attr('width', width)
    .attr('height', height)
    .attr('stroke-linejoin', 'round')
    .attr('stroke-width', strokeWidth)
    .attr('stroke', strokeColor)
    .attr('fill', trayColor ?? 'white');

  // Draw "X" if no table color
  if (!trayColor && xColor) {
    const percentagePadding = 0.1;
    const slash1 = d3.line()([
      [percentagePadding * width - percentagePadding, height * percentagePadding],
      [width - percentagePadding * width + percentagePadding, height - height * percentagePadding],
    ]);
    const slash2 = d3.line()([
      [percentagePadding * width + percentagePadding, height - height * percentagePadding],
      [width - percentagePadding * width - percentagePadding, height * percentagePadding],
    ]);

    const xMarker = el.append('g').attr('class', X_CLASS).attr('transform', `translate(${x}, ${y})`);
    xMarker
      .append('path')
      .attr('d', `${slash1}Z`)
      .attr('stroke', xColor)
      .attr('stroke-width', 2)
      .attr('stroke-linecap', 'round');
    xMarker
      .append('path')
      .attr('d', `${slash2}Z`)
      .attr('stroke', xColor)
      .attr('stroke-width', 2)
      .attr('stroke-linecap', 'round');
  }

  return drawnTrayEl;
};
