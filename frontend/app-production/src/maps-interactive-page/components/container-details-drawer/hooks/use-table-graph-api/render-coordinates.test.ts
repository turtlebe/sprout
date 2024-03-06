import { mockTableRowsFromMapState } from '@plentyag/app-production/src/maps-interactive-page/test-helpers/mock-maps-state';
import * as d3 from 'd3';

import { ALPHA_CLASS, NUMERIC_CLASS, renderCoordinates } from './render-coordinates';

describe('renderCoordinates', () => {
  let svgRef, renderCoordinatesFn;

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

    renderCoordinatesFn = renderCoordinates({
      svgRef,
      scale,
      ref: undefined,
    });
  });

  it('renders', () => {
    renderCoordinatesFn({
      rows: mockTableRowsFromMapState,
    });

    const node = svgRef.current;
    expect(node.innerHTML).toEqual(
      '<g><text class="alpha" dominant-baseline="middle" x="0" y="172" fill="#9A9A9A">C</text></g><g><text class="numeric" dominant-baseline="bottom" text-anchor="middle" x="10.5" y="142" fill="#9A9A9A">1</text></g>'
    );
    expect(node.querySelector(`.${ALPHA_CLASS}`)).toHaveTextContent('C');
    expect(node.querySelector(`.${NUMERIC_CLASS}`)).toHaveTextContent('1');
  });
});
