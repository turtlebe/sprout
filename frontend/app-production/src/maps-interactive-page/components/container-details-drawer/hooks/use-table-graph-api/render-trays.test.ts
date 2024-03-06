import { mockTableRowsFromMapState } from '@plentyag/app-production/src/maps-interactive-page/test-helpers/mock-maps-state';
import * as d3 from 'd3';

import { renderTrays, ROW_CLASS, TRAY_CONTAINER_CLASS, TRAY_HIGHLIGHT_CLASS } from './render-trays';

describe('renderTrays', () => {
  let svgRef, renderTraysFn, getCropColor;

  beforeEach(() => {
    svgRef = { current: document.createElement('svg') };
    const scale = {
      xScale: d3.scaleLinear().range([0, 100]).domain([0, 100]),
      yScale: d3.scaleLinear().range([101, 201]).domain([0, 100]),
      paddingX: 10,
      paddingY: 20,
      width: 100,
      height: 100,
    };

    getCropColor = jest.fn().mockReturnValue('red');

    renderTraysFn = renderTrays({
      svgRef,
      scale,
      ref: undefined,
    });
  });

  it('renders', () => {
    renderTraysFn({
      rows: mockTableRowsFromMapState,
      getCropColor,
    });

    const node = svgRef.current;
    expect(node.querySelector(`.${ROW_CLASS}`)).toBeTruthy();
    expect(node.querySelector(`.${TRAY_CONTAINER_CLASS}`)).toBeTruthy();
    expect(node.innerHTML).toEqual(
      '<g class="row" transform="translate(0, 121)"><g class="tray-container" style="cursor: pointer;"><g class="tray-graph"><rect x="10" y="0" width="0" height="101" stroke-linejoin="round" stroke-width="1" stroke="#e6e6e6" fill="red"></rect></g><g class="tray-graph tray-highlight" style="visibility: hidden;"><rect x="12" y="2" width="-4" height="97" stroke-linejoin="round" stroke-width="3" stroke="#2E76D1" fill="rgba(46, 118, 209, 0.10)"></rect></g></g></g>'
    );
    expect(node.querySelector(`.${TRAY_CONTAINER_CLASS} .${TRAY_HIGHLIGHT_CLASS}`)).toHaveStyle({
      visibility: 'hidden',
    });
  });

  it('should support mouse enter, leave, and click events', () => {
    const mockClick = jest.fn();
    const mockEnter = jest.fn();
    const mockExit = jest.fn();
    const mockResourceState = mockTableRowsFromMapState[0].resources[0];

    // ACT 1
    renderTraysFn({
      rows: mockTableRowsFromMapState,
      getCropColor,
      onClick: mockClick,
      onEnter: mockEnter,
      onExit: mockExit,
    });

    const node = svgRef.current as HTMLElement;
    const trayNode = node.querySelector(`.${TRAY_CONTAINER_CLASS}`);
    const highlightNode = node.querySelector(`.${TRAY_CONTAINER_CLASS} .${TRAY_HIGHLIGHT_CLASS}`);

    // ASSERT 1
    expect(highlightNode).toHaveStyle({
      visibility: 'hidden',
    });
    expect(mockEnter).not.toHaveBeenCalled();

    // ACT 2 -- mouse enter
    trayNode.dispatchEvent(new Event('mouseenter'));

    // ASSERT 2
    expect(highlightNode).toHaveStyle({
      visibility: 'visible',
    });
    expect(mockEnter).toHaveBeenCalledWith(expect.anything(), trayNode, {
      positionInParent: mockResourceState.positionInParent,
      resourceState: mockResourceState,
    });

    // ACT 3 -- mouse leave
    trayNode.dispatchEvent(new Event('mouseleave'));

    // ASSERT 3
    expect(highlightNode).toHaveStyle({
      visibility: 'hidden',
    });
    expect(mockExit).toHaveBeenCalledWith(expect.anything(), trayNode, {
      positionInParent: mockResourceState.positionInParent,
      resourceState: mockResourceState,
    });

    // ACT 4 -- mouse click
    trayNode.dispatchEvent(new Event('click'));

    // ASSERT 4
    expect(mockClick).toHaveBeenCalledWith(expect.anything(), trayNode, {
      positionInParent: mockResourceState.positionInParent,
      resourceState: mockResourceState,
    });
  });
});
