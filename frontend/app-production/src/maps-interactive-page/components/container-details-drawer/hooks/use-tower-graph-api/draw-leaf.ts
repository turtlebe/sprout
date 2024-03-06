const LEFT_LEAF =
  'M21.1901 22.0102C20.9601 21.3602 0.670067 1.67016 0.670067 1.67016C0.670067 1.67016 -0.299933 8.26016 2.42007 12.9702C4.37007 16.3502 9.85007 20.4202 13.4601 15.8102C13.4601 15.8102 17.0601 4.30016 0.670067 1.66016';
const RIGHT_LEAF =
  'M1.38989 21.8803C1.62989 21.2303 21.9099 1.54027 21.9099 1.54027C21.9099 1.54027 22.8799 8.13027 20.1599 12.8403C18.2099 16.2203 12.7299 20.2903 9.11989 15.6803C9.11989 15.6803 5.51989 4.17027 21.9099 1.53027';
const LEAF_WIDTH = 20.69;
const LEAF_HEIGHT = 20.35;

export const LEAF_CLASS = 'leaf';

interface DrawLeaf {
  el: d3.Selection<any, any, any, any>;
  x?: number;
  y?: number;
  fillColor: string;
  strokeColor: string;
  direction: 'left' | 'right';
}

export function drawLeaf({
  el,
  x = 0,
  y = 0,
  fillColor,
  strokeColor,
  direction = 'right',
}: DrawLeaf): d3.Selection<any, any, any, any> {
  const leafEl = el.append('g').classed(LEAF_CLASS, true);

  // Paint left or right leaf
  const leafPathEl =
    direction === 'left'
      ? leafEl
          .attr('transform', `translate(${x - LEAF_WIDTH + 1}, ${y + LEAF_HEIGHT / 2})`)
          .append('path')
          .attr('d', LEFT_LEAF)
      : leafEl
          .attr('transform', `translate(${x - 2}, ${y + LEAF_HEIGHT / 2})`)
          .append('path')
          .attr('d', RIGHT_LEAF);

  // Color attributes
  leafPathEl.attr('fill', fillColor).attr('stroke', strokeColor).attr('stroke-miterlimit', 10);

  return leafEl;
}
