import * as d3 from 'd3';

import { doesSegmentIntersectWithViewBounds } from './utils';

interface FixedLengthLine {
  lineStart: Date;
  lineLength: number;
  yIndex: number;
  pathAttributes: ProdResources.PathAttributes;
  svg: d3.Selection<any, any, any, any>;
  scale: ProdResources.Scale;
  viewBounds: ProdResources.ViewBounds;
}

interface FixedLengthLinePathData extends ProdResources.PathData {
  lineLength: number;
}

const fixLengthLineGenerator = (xScale: ProdResources.XScale, yScale: ProdResources.YScale) =>
  d3
    .line<FixedLengthLinePathData>()
    .x(d => xScale(d.x) + d.lineLength)
    .y(d => yScale(d.y));

/**
 * Renders a fix length (hortizontal) line.  The line starts at a given date and extends forward or backward
 * by 'lineLength' parameter.
 * @param lineStart Date at which line will start rendering.
 * @param lineLength Length of line in pixels, can be negative.
 * @param yIndex The y index to render the hortizontal line.
 * @param pathAttributes Gives various attributes for rendering the line/path.
 * @param svg The element to which the line will be appended.
 * @param scale The initial x and y scale to apply to the line.
 */
export const renderFixedLengthLine = ({
  lineStart,
  lineLength,
  yIndex,
  pathAttributes,
  svg,
  scale,
  viewBounds,
}: FixedLengthLine) => {
  const arrowData: FixedLengthLinePathData[] = [
    { x: lineStart, y: yIndex, lineLength: 0 },
    { x: lineStart, y: yIndex, lineLength: lineLength },
  ];

  const x1 = scale.xScale(arrowData[0].x);
  const y1 = scale.yScale(arrowData[0].y);
  const x2 = scale.xScale(arrowData[1].x) + lineLength;
  const y2 = scale.yScale(arrowData[1].y);

  if (doesSegmentIntersectWithViewBounds({ viewBounds, x1, y1, x2, y2 })) {
    const path = svg
      .append('path')
      .attr('class', 'line-fixed')
      .datum(arrowData)
      .attr('stroke', pathAttributes.stroke)
      .attr('fill', pathAttributes.fill)
      .attr('stroke-width', pathAttributes.strokeWidth)
      .attr('d', fixLengthLineGenerator(scale.xScale, scale.yScale));

    if (pathAttributes.endMarker) {
      path.attr('marker-end', `url(#${pathAttributes.endMarker})`);
    }
    if (pathAttributes.strokeDashArray) {
      path.attr('stroke-dasharray', pathAttributes.strokeDashArray);
    }
    return path;
  }
};
