import { DRAWER_TRANSITION_SPEED } from '@plentyag/app-production/src/maps-interactive-page/constants';
import {
  mockLanes,
  mockVerticalGrowGraphScale,
} from '@plentyag/app-production/src/maps-interactive-page/test-helpers/mock-vertical-grow-data';
import { actAndAwait } from '@plentyag/core/src/test-helpers';

import { HIGHLIGHT_CLASS, HOVER_HIGHLIGHT_CLASS, renderHighlight } from './render-highlight';

describe('renderHighlight', () => {
  let zoomNode, zoomRef;

  beforeEach(() => {
    zoomNode = document.createElement('div');
    zoomNode.scrollLeft = 123;
    jest.spyOn(zoomNode, 'getBoundingClientRect').mockReturnValue({
      width: 10000,
      height: 200,
    });

    zoomRef = {
      current: zoomNode,
    } as unknown as React.MutableRefObject<HTMLDivElement>;
  });

  function renderHighlightWrapper(...args: any) {
    const node = document.createElement('svg');
    node.setAttribute('width', mockVerticalGrowGraphScale.width.toString());
    node.setAttribute('height', mockVerticalGrowGraphScale.height.toString());

    const svgRef = {
      current: node,
    } as unknown as React.MutableRefObject<SVGSVGElement>;

    const renderHighlightFn = renderHighlight({
      svgRef,
      scale: mockVerticalGrowGraphScale,
    });

    renderHighlightFn(...args);
    return { node };
  }

  describe('init', () => {
    it('renders highlight', () => {
      // ACT
      const { node } = renderHighlightWrapper({ lanes: mockLanes, zoomRef, show: true });

      // ASSERT
      expect(node.outerHTML).toEqual(
        '<svg width="500" height="200"><rect class="highlight" x="10522.08" y="0" width="46480" height="200" stroke="#2E76D1" stroke-width="3" fill="rgba(46, 118, 209, 0.10)"></rect></svg>'
      );
      expect(node.querySelector(`.${HIGHLIGHT_CLASS}`)).toBeTruthy();
    });

    it('should be able to hide highlight', () => {
      // ACT
      const { node } = renderHighlightWrapper({ lanes: mockLanes, zoomRef, show: false });

      // ASSERT
      expect(node.outerHTML).toEqual('<svg width="500" height="200"></svg>');
      expect(node.querySelector(`.${HIGHLIGHT_CLASS}`)).toBeFalsy();
    });

    it('should not show highlight if zoomed-in view is not ready (i.e. has zero height)', () => {
      // ARRANGE
      // -- set zoom node height to 0.
      jest.spyOn(zoomNode, 'getBoundingClientRect').mockReturnValue({
        height: 0,
      });

      // ACT 1
      const { node } = renderHighlightWrapper({ lanes: mockLanes, zoomRef, show: true });

      // ASSERT 1
      expect(node.outerHTML).toEqual('<svg width="500" height="200"></svg>');
      expect(node.querySelector(`.${HIGHLIGHT_CLASS}`)).toBeFalsy();
      expect(zoomNode.scrollLeft).toEqual(123);
    });
  });

  describe('clicking', () => {
    it('moves zoom view to specific scroll position on click', async () => {
      const { node } = renderHighlightWrapper({ lanes: mockLanes, zoomRef, show: false });

      // ACT
      await actAndAwait(() => {
        const event = new MouseEvent('click');
        // @ts-ignore: overriding click pos
        event.offsetX = 20;
        node.dispatchEvent(event);
      });

      // ASSERT
      expect(zoomNode.scrollLeft).toEqual(-250.3012048192771);
    });

    it('moves zoom view to specific scroll position on click only when zoom view is loaded', async () => {
      // ARRANGE
      // -- set zoom node height to 0.
      jest.spyOn(zoomNode, 'getBoundingClientRect').mockReturnValue({
        height: 0,
      });
      const { node } = renderHighlightWrapper({ lanes: mockLanes, zoomRef, show: false });

      // ACT 1
      await actAndAwait(() => {
        const event = new MouseEvent('click');
        // @ts-ignore: overriding click pos
        event.offsetX = 20;
        node.dispatchEvent(event);
      });

      // ASSERT 2
      // -- initial scrollleft
      expect(zoomNode.scrollLeft).toEqual(123);

      // ACT 2
      // -- make zoom view ready
      jest.spyOn(zoomNode, 'getBoundingClientRect').mockReturnValue({
        height: 200,
      });
      // -- match same delay
      await new Promise(resolve => setTimeout(resolve, DRAWER_TRANSITION_SPEED));

      // ASSERT 2
      // -- zoom view is now moved
      expect(zoomNode.scrollLeft).toEqual(-250.3012048192771);
    });
  });

  describe('hovering', () => {
    it('renders hover box on mouse enter', async () => {
      const { node } = renderHighlightWrapper({ lanes: mockLanes, zoomRef, show: false });

      // ACT
      await actAndAwait(() => {
        const event = new MouseEvent('mouseenter');
        node.dispatchEvent(event);
      });

      // ASSERT
      expect(node.outerHTML).toEqual(
        '<svg width="500" height="200"><g class="hover-highlight"><rect stroke="grey" stroke-width="1" fill="rgba(0,0,0, 0.10)" style="cursor: zoom-in;"></rect></g></svg>'
      );
      expect(node.querySelector(`.${HOVER_HIGHLIGHT_CLASS}`)).toBeDefined();
    });

    it('moves hover box on mouse move', async () => {
      const { node } = renderHighlightWrapper({ lanes: mockLanes, zoomRef, show: false });

      // ACT
      await actAndAwait(() => {
        const event1 = new MouseEvent('mouseenter');
        const event2 = new MouseEvent('mousemove');
        // @ts-ignore: overriding click pos
        event2.offsetX = 50;
        node.dispatchEvent(event1);
        node.dispatchEvent(event2);
      });

      // ASSERT
      expect(node.querySelector(`.${HOVER_HIGHLIGHT_CLASS} rect`).getAttribute('x')).toEqual('-23190');
    });

    it('removes hover box on mouse leave', async () => {
      const { node } = renderHighlightWrapper({ lanes: mockLanes, zoomRef, show: false });

      // ACT
      await actAndAwait(() => {
        const event1 = new MouseEvent('mouseenter');
        const event2 = new MouseEvent('mousemove');
        const event3 = new MouseEvent('mouseleave');
        node.dispatchEvent(event1);
        node.dispatchEvent(event2);
        node.dispatchEvent(event3);
      });

      // ASSERT
      expect(node.querySelector(`.${HOVER_HIGHLIGHT_CLASS}`)).toBeFalsy();
    });

    it('hides hover box when mouse enters highlight and resets when mouse leaves highlight', async () => {
      const { node } = renderHighlightWrapper({ lanes: mockLanes, zoomRef, show: true });

      // ACT 1
      await actAndAwait(() => {
        const event = new MouseEvent('mouseenter');
        node.dispatchEvent(event);
      });

      // ASSERT 1
      expect(node.querySelector(`.${HOVER_HIGHLIGHT_CLASS}`)).toHaveStyle({ visibility: 'visible' });

      // ACT 2
      await actAndAwait(() => {
        const event = new MouseEvent('mouseenter');
        node.querySelector(`.${HIGHLIGHT_CLASS}`).dispatchEvent(event);
      });

      // ASSERT 2
      expect(node.querySelector(`.${HOVER_HIGHLIGHT_CLASS}`)).toHaveStyle({ visibility: 'hidden' });

      // ACT 3
      await actAndAwait(() => {
        const event = new MouseEvent('mouseleave');
        node.querySelector(`.${HIGHLIGHT_CLASS}`).dispatchEvent(event);
      });

      // ASSERT 3
      expect(node.querySelector(`.${HOVER_HIGHLIGHT_CLASS}`)).toHaveStyle({ visibility: 'visible' });
    });
  });
});
