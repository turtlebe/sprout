import * as d3 from 'd3';

export interface DrawContainer {
  svg: SVGSVGElement;
  class: string;
  paddingX: number;
  paddingY: number;
  disableClipPath?: boolean;
}

/**
 * The X and Y axes on the graph are transformed and translated vertically and horizontally based on predefined padding.
 *
 * When drawing subsequent SVG elements, it is important that they are also translated equally to align them with the X and Y axes.
 *
 * This container does just that and allows you to not have to translate every shape manually as long as they are rendered within this container.
 */
export function drawContainer({ svg, class: _class, paddingX, paddingY, disableClipPath = false }: DrawContainer) {
  const g = d3.select(svg).append('g').attr('class', _class).attr('transform', `translate(${paddingX}, ${paddingY})`);

  return disableClipPath ? g : g.attr('clip-path', 'url("#frame")');
}
