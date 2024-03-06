import { DEFAULT_COLOR } from '../../constants';

import { renderLine } from './render-line';

interface RenderLineConnectingResources {
  xDate: Date;
  yIndexStart: number;
  yIndexEnd: number;
  svg: d3.Selection<any, any, any, any>;
  scale: ProdResources.Scale;
  viewBounds: ProdResources.ViewBounds;
}

/**
 * Renders vertical line connecting various resources lines.
 * @param xDate X location to draw vertical line.
 * @param yIndexStart Y start index of vertical line.
 * @param yIndexEnd Y end index of vertical line.
 * @param svg The element to which the line will be appended.
 * @param scale The initial x and y scale to apply to the line.
 */
export const renderLineConnectingResources = ({
  xDate,
  yIndexStart,
  yIndexEnd,
  svg,
  scale,
  viewBounds,
}: RenderLineConnectingResources) => {
  const pathData = [
    { x: xDate, y: yIndexStart },
    { x: xDate, y: yIndexEnd },
  ];
  const pathAttributes = {
    stroke: DEFAULT_COLOR,
    fill: DEFAULT_COLOR,
    strokeWidth: 2.0,
  };
  renderLine({ pathData, pathAttributes, svg, scale, viewBounds });
};
