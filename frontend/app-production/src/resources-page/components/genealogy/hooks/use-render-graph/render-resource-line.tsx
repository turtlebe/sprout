import { SearchActions } from '@plentyag/app-production/src/resources-page/hooks/use-search';

import { renderLine } from './render-line';
import { performSearchOnNewestState } from './utils';

const animateLineWidth = (line: ProdResources.Selection<any>, strokeWidth: number) => {
  return line.transition().duration(250).attr('stroke-width', strokeWidth);
};

interface RenderResourceLine {
  resource: ProdResources.BaseResource<ProdResources.Operation>;
  yIndex: number;
  search: SearchActions['search'];
  svg: d3.Selection<any, any, any, any>;
  scale: ProdResources.Scale;
  pathAttributes: ProdResources.PathAttributes;
  viewBounds: ProdResources.ViewBounds;
}
/**
 * Renders a horizontal line for a particular resource.
 * @param resource The resource (anteedent, subsequent, parent or focused resource).
 * @param yIndex The Y index in the graph at which the line is rendered.
 * @param search Search function to call when line is clicked.
 * @param svg The element to which the line will be appended.
 * @param scale The initial x and y scale to apply to the line.
 * @param pathAttributes Gives various attributes for rendering the line/path.
 */
export const renderResourceLine = ({
  resource,
  yIndex,
  search,
  svg,
  scale,
  pathAttributes,
  viewBounds,
}: RenderResourceLine) => {
  const operations = resource.operations;

  const firstOp = operations[0];
  const lastOp = operations[operations.length - 1];

  const pathData = [
    { x: new Date(firstOp.endDt), y: yIndex },
    { x: new Date(lastOp.endDt), y: yIndex },
  ];
  const line = renderLine({ svg, scale, pathData, pathAttributes, viewBounds });

  if (!line) {
    return; // not within viewBounds.
  }

  // render a transparent rectange on top of line, to give a larger target for
  // click and hover, otherwise it is difficult for user to hit a thin target.
  const yIndexOffSet = 0.1;
  const transparentLineData = [
    { x: new Date(firstOp.endDt), y: yIndex - yIndexOffSet },
    { x: new Date(lastOp.endDt), y: yIndex - yIndexOffSet },
    { x: new Date(lastOp.endDt), y: yIndex + yIndexOffSet },
    { x: new Date(firstOp.endDt), y: yIndex + yIndexOffSet },
    { x: new Date(firstOp.endDt), y: yIndex - yIndexOffSet },
  ];

  const transparentRect = renderLine({
    svg,
    scale,
    pathData: transparentLineData,
    pathAttributes: {
      fill: 'transparent',
      stroke: 'transparent',
      strokeWidth: 0,
    },
    viewBounds,
  });

  if (!transparentRect) {
    return; // not within viewBounds.
  }

  transparentRect
    .on('click', () => performSearchOnNewestState(resource, search))
    .on('mouseenter', () => animateLineWidth(line, pathAttributes.strokeWidth * 2.0))
    .on('mouseleave', () => animateLineWidth(line, pathAttributes.strokeWidth));
};
