import {
  buildLAX1ContainerLocation,
  buildResourceState,
} from '@plentyag/app-production/src/common/test-helpers/mock-builders';
import { mockDefaultQueryParameters } from '@plentyag/app-production/src/maps-interactive-page/test-helpers/mock-default-query-parameters';
import { MapsState } from '@plentyag/app-production/src/maps-interactive-page/types';
import * as d3 from 'd3';

import { drawCommentIcon } from './draw-comment-icon';

const containerLocation1 = buildLAX1ContainerLocation({ containerType: 'PropTable' });
const containerLocation2 = buildLAX1ContainerLocation({ containerType: 'PropTable' });
const mapsState: MapsState = {
  [containerLocation1.ref]: { resourceState: buildResourceState({ containerLocation: containerLocation1 }) },
  [containerLocation2.ref]: {
    resourceState: buildResourceState({ containerLocation: containerLocation2 }),
    hasComments: true,
  },
};

describe('drawCommentIcon', () => {
  let node, el;

  beforeEach(() => {
    node = document.createElement('svg');
    el = d3.select(node);
  });

  it('does not draw an icon when showCommentsLayer is "true" and the container has not comment', () => {
    expect(
      drawCommentIcon({
        el,
        x: 0,
        y: 0,
        width: 100,
        height: 150,
        queryParameters: { ...mockDefaultQueryParameters, showCommentsLayer: true },
        mapsState,
        containerLocation: containerLocation1,
      })
    );

    expect(node.outerHTML).not.toContain('comment-icon');
  });

  it('draws an icon when showCommentsLayer is "true" and the container has comment', () => {
    expect(
      drawCommentIcon({
        el,
        x: 0,
        y: 0,
        width: 100,
        height: 150,
        queryParameters: { ...mockDefaultQueryParameters, showCommentsLayer: true },
        mapsState,
        containerLocation: containerLocation2,
      })
    );

    expect(node.outerHTML).toContain('comment-icon');
  });

  it('does not draw an icon when showCommentsLayer is "false"', () => {
    expect(
      drawCommentIcon({
        el,
        x: 0,
        y: 0,
        width: 100,
        height: 150,
        queryParameters: mockDefaultQueryParameters,
        mapsState,
        containerLocation: containerLocation2,
      })
    );

    expect(node.outerHTML).not.toContain('comment-icon');
  });
});
