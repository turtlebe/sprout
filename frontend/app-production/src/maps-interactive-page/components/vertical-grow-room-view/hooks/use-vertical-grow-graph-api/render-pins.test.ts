import {
  mockLanesForStraightStyle,
  mockVerticalGrowGraphScale,
  mockVerticalGrowGraphScaleForStraightStyle,
} from '@plentyag/app-production/src/maps-interactive-page/test-helpers/mock-vertical-grow-data';

import { renderPins } from './render-pins';

describe('renderPins', () => {
  function renderPinsWrapper(...args: any) {
    const node = document.createElement('svg');
    node.setAttribute('width', mockVerticalGrowGraphScale.width.toString());
    node.setAttribute('height', mockVerticalGrowGraphScale.height.toString());

    const svgRef = {
      current: node,
    } as unknown as React.MutableRefObject<SVGSVGElement>;

    const renderPinsFn = renderPins({
      svgRef,
      scale: mockVerticalGrowGraphScaleForStraightStyle,
    });

    renderPinsFn(...args);
    return { node };
  }

  it('renders the pins', () => {
    const mockDrawPin = jest.fn().mockImplementation(({ el, x, y, width, height }) => {
      el.append('g')
        .attr('class', 'test-pin')
        .attr('transform', `translate(${x}, ${y})`)
        .append('rect')
        .attr('x', 0)
        .attr('y', 0)
        .attr('width', width)
        .attr('height', height)
        .attr('fill', 'red');
    });

    const { node } = renderPinsWrapper({
      lanes: mockLanesForStraightStyle,
      towerWidth: 20,
      drawPin: mockDrawPin,
    });

    expect(node.outerHTML).toEqual(
      '<svg width="500" height="200"><g class="test-pin" transform="translate(6, 30)"><rect x="0" y="0" width="20" height="20" fill="red"></rect></g></svg>'
    );
    expect(node.querySelector('.test-pin')).toBeTruthy();
  });
});
