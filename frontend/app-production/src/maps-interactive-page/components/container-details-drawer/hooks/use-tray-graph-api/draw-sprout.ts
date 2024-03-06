import * as d3 from 'd3';

const SPROUT_WIDTH = 25;
const SPROUT_HEIGHT = 23;
const SPROUT_LEFT_LEAF =
  'M1.50897 7.44758C1.50897 7.44758 -0.409665 12.1632 3.20335 16.2112C6.81636 20.2593 9.10875 16.1682 9.10875 16.1682C9.10875 16.1682 12.3231 10.2899 1.50897 7.44758Z';
const SPROUT_RIGHT_LEAF =
  'M23.5907 0.895508C23.5907 0.895508 26.2056 7.48461 21 13.0874C15.7944 18.6903 12.6226 12.9825 12.6226 12.9825C12.6226 12.9825 8.16753 4.75664 23.5907 0.895508Z';
const SPROUT_STEM = 'M23.5 1.5C12.9502 8.68053 10.4349 21.9797 10.41 22C10.41 22 9.1908 13.2982 2.0498 8.24746';

const DEFAULT_SCALE = 0.75;

export const SPROUT_CLASS = 'sprout';
interface DrawSprout {
  el: d3.Selection<any, any, any, any>;
  x?: number;
  y?: number;
  fillColor: string;
  strokeColor: string;
  baseWidth: number;
  baseHeight: number;
}

export const drawSprout = ({
  el,
  x = 0,
  y = 0,
  fillColor,
  strokeColor,
  baseWidth,
  baseHeight,
}: DrawSprout): d3.Selection<any, any, any, any> => {
  const scale = DEFAULT_SCALE;

  const posX = x - (SPROUT_WIDTH * scale) / 2 + baseWidth / 2;
  const posY = y - SPROUT_HEIGHT * scale + baseHeight / 2;

  const sproutEl = el
    .append('g')
    .classed(SPROUT_CLASS, true)
    .attr('transform', `translate(${posX}, ${posY}) scale(${scale})`);

  // left leaf
  sproutEl
    .append('path')
    .attr('d', SPROUT_LEFT_LEAF)
    .attr('fill', fillColor)
    .attr('stroke', strokeColor)
    .attr('stroke-width', 1 / scale)
    .attr('stroke-miterlimit', 10);

  // right leaf
  sproutEl
    .append('path')
    .attr('d', SPROUT_RIGHT_LEAF)
    .attr('fill', fillColor)
    .attr('stroke', strokeColor)
    .attr('stroke-width', 1 / scale)
    .attr('stroke-miterlimit', 10);

  // stem
  sproutEl
    .append('path')
    .attr('d', SPROUT_STEM)
    .attr('fill-opacity', 0)
    .attr('stroke', strokeColor)
    .attr('stroke-opacity', 1)
    .attr('stroke-width', 1 / scale)
    .attr('stroke-linecap', 'round')
    .attr('stroke-linejoin', 'round');

  return sproutEl;
};
