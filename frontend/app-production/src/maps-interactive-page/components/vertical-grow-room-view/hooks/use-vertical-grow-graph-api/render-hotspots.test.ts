import { mockMapStateForTower } from '@plentyag/app-production/src/maps-interactive-page/test-helpers/mock-map-state-data';
import {
  mockLanesForStraightStyle,
  mockVerticalGrowGraphScale,
  mockVerticalGrowGraphScaleForStraightStyle,
} from '@plentyag/app-production/src/maps-interactive-page/test-helpers/mock-vertical-grow-data';
import { actAndAwait } from '@plentyag/core/src/test-helpers';

import { HOT_SPOTS_CLASS, renderHotSpots } from './render-hotspots';

describe('renderHotSpots', () => {
  let mockOnEnter, mockOnExit, mockOnClick;

  beforeEach(() => {
    mockOnEnter = jest.fn();
    mockOnExit = jest.fn();
    mockOnClick = jest.fn();
  });

  function renderHotSpotsWrapper(...args: any) {
    const node = document.createElement('svg');
    node.setAttribute('width', mockVerticalGrowGraphScale.width.toString());
    node.setAttribute('height', mockVerticalGrowGraphScale.height.toString());

    const svgRef = {
      current: node,
    } as unknown as React.MutableRefObject<SVGSVGElement>;

    const renderHotSpotsFn = renderHotSpots({
      svgRef,
      scale: mockVerticalGrowGraphScaleForStraightStyle,
    });

    renderHotSpotsFn(...args);
    return { node };
  }

  describe('init', () => {
    it('renders highlight', () => {
      // ACT
      const { node } = renderHotSpotsWrapper({
        lanes: mockLanesForStraightStyle,
        mapState: mockMapStateForTower,
        towerWidth: 20,
      });

      // ASSERT
      expect(node.outerHTML).toEqual(
        '<svg width="500" height="200"><g class="vg-hot-spots"><rect x="6" y="30" width="20" height="20" stroke="#2E76D1" stroke-width="3" fill="rgba(46, 118, 209, 0.10)" stroke-opacity="0" fill-opacity="0" style="cursor: pointer;"></rect></g></svg>'
      );
      expect(node.querySelector(`.${HOT_SPOTS_CLASS}`)).toBeTruthy();
    });
  });

  describe('interactions', () => {
    it('should callback on click', async () => {
      // ARRANGE
      const { node } = renderHotSpotsWrapper({
        lanes: mockLanesForStraightStyle,
        mapState: mockMapStateForTower,
        towerWidth: 20,
        onClick: mockOnClick,
      });

      // ACT 1
      await actAndAwait(() => {
        node.querySelector(`.${HOT_SPOTS_CLASS} rect`).dispatchEvent(new MouseEvent('click'));
      });

      // ASSERT
      expect(mockOnClick).toHaveBeenCalled();
    });

    it('should show/hide highlight and callback on enter/exit', async () => {
      // ACT 1
      const { node } = renderHotSpotsWrapper({
        lanes: mockLanesForStraightStyle,
        mapState: mockMapStateForTower,
        towerWidth: 20,
        onEnter: mockOnEnter,
        onExit: mockOnExit,
      });

      // ASSERT 1
      expect(node.querySelector(`.${HOT_SPOTS_CLASS} rect`).getAttribute('stroke-opacity')).toEqual('0');
      expect(node.querySelector(`.${HOT_SPOTS_CLASS} rect`).getAttribute('fill-opacity')).toEqual('0');

      // ACT 2
      await actAndAwait(() => {
        node.querySelector(`.${HOT_SPOTS_CLASS} rect`).dispatchEvent(new MouseEvent('mouseenter'));
      });

      // ASSERT 2
      expect(mockOnEnter).toHaveBeenCalled();
      expect(node.querySelector(`.${HOT_SPOTS_CLASS} rect`).getAttribute('stroke-opacity')).toEqual('1');
      expect(node.querySelector(`.${HOT_SPOTS_CLASS} rect`).getAttribute('fill-opacity')).toEqual('1');

      // ACT 3
      await actAndAwait(() => {
        node.querySelector(`.${HOT_SPOTS_CLASS} rect`).dispatchEvent(new MouseEvent('mouseleave'));
      });

      // ASSERT 3
      expect(mockOnExit).toHaveBeenCalled();
      expect(node.querySelector(`.${HOT_SPOTS_CLASS} rect`).getAttribute('stroke-opacity')).toEqual('0');
      expect(node.querySelector(`.${HOT_SPOTS_CLASS} rect`).getAttribute('fill-opacity')).toEqual('0');
    });
  });
});
