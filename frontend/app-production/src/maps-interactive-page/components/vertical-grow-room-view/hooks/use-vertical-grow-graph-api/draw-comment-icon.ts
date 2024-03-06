import { drawCommentIcon as drawCommentIconFn } from '@plentyag/app-production/src/maps-interactive-page/components/draw-comment-icon';

export const COMMENT_ICON = 'vg-tower-comment';

import { DrawPin } from './render-pins';

/**
 * Draw a comment icon on each tower that has comments when queryParameters.showCommentsLayer is "true".
 */
export const drawCommentIcon: DrawPin = ({ mapsState, containerLocation, el, x, y, width, queryParameters }) => {
  const resource = mapsState?.[containerLocation.ref];
  const hasComments = Boolean(resource?.hasComments);

  if (hasComments && queryParameters.showCommentsLayer) {
    const g = el.append('g').attr('class', COMMENT_ICON).attr('transform', `translate(${x}, ${y})`);

    // draw the icon
    drawCommentIconFn({
      el: g,

      // translate X varies if we're in the zoomed out or zommed in grow lane view
      transform: `translate(${width === 3 ? -20 : -10}, -22)`,

      // x, y already defined in container above
      x: undefined,
      y: undefined,
    });
  }
};
