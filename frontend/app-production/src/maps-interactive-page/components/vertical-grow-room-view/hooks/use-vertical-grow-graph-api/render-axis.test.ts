import {
  mockLanes,
  mockVerticalGrowGraphScale,
} from '@plentyag/app-production/src/maps-interactive-page/test-helpers/mock-vertical-grow-data';

import { renderAxis, X_AXIS_CLASS } from './render-axis';

describe('renderAxis', () => {
  it('renders', () => {
    // ARRANGE
    // -- create DOM element & ref
    const node = document.createElement('svg');
    const svgRef = {
      current: node,
    } as unknown as React.MutableRefObject<SVGSVGElement>;

    //  -- set with ref and scale
    const renderAxisFn = renderAxis({
      svgRef,
      scale: mockVerticalGrowGraphScale,
    });

    // ACT
    renderAxisFn({ lanes: mockLanes });

    // ASSERT
    const allAxis = node.querySelectorAll(`.${X_AXIS_CLASS}`);
    expect(allAxis.length).toBe(2);
    expect(allAxis[0].getAttribute('transform')).toEqual('translate(48, 20)');
    expect(allAxis[1].getAttribute('transform')).toEqual('translate(48, 180)');
  });
});
