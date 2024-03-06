import { mockChildResourcesMapsState } from '@plentyag/app-production/src/maps-interactive-page/test-helpers/mock-maps-state';
import * as d3 from 'd3';

import { renderTower, ROW_CLASS, TOWER_CLASS } from './render-tower';

describe('renderTower', () => {
  let svgRef, renderTowerFn, getCropColor;

  beforeEach(() => {
    svgRef = { current: document.createElement('svg') };
    const scale = {
      yScale: d3.scaleLinear().range([101, 201]).domain([0, 1000]),
      width: 100,
      height: 200,
      contentHeight: 1000,
    };

    getCropColor = jest.fn().mockReturnValue('red');

    renderTowerFn = renderTower({
      svgRef,
      scale,
      ref: undefined,
    });
  });

  it('renders', () => {
    renderTowerFn({
      plugs: [mockChildResourcesMapsState],
      getCropColor,
      siteName: 'SSF2',
    });

    const node = svgRef.current;
    expect(node.querySelector(`.${ROW_CLASS}`)).toBeTruthy();
    expect(node.querySelector(`.${TOWER_CLASS}`)).toBeTruthy();
    expect(node.innerHTML).toEqual(
      '<g class="tower-row" transform="translate(50, 101)"><rect x="-11" y="101.1" width="22" height="15"></rect></g><g class="tower-row" transform="translate(50, 101.1)"><rect x="-11" y="101.1" width="22" height="15"></rect></g><g class="tower-row" transform="translate(50, 101.2)"><rect x="-11" y="101.1" width="22" height="15"></rect></g><g class="tower-row" transform="translate(50, 101.3)"><rect x="-11" y="101.1" width="22" height="15"></rect></g><g class="tower-row" transform="translate(50, 101.4)"><rect x="-11" y="101.1" width="22" height="15"></rect></g><g class="tower-row" transform="translate(50, 101.5)"><rect x="-11" y="101.1" width="22" height="15"></rect></g><g class="tower-row" transform="translate(50, 101.60000000000001)"><rect x="-11" y="101.1" width="22" height="15"></rect></g><g class="tower-row" transform="translate(50, 101.7)"><rect x="-11" y="101.1" width="22" height="15"></rect></g><g class="tower-row" transform="translate(50, 101.8)"><rect x="-11" y="101.1" width="22" height="15"></rect></g><g class="tower-row" transform="translate(50, 101.89999999999999)"><rect x="-11" y="101.1" width="22" height="15"></rect></g><g class="tower-row" transform="translate(50, 102)"><rect x="-11" y="101.1" width="22" height="15"></rect></g><g class="tower-row" transform="translate(50, 102.1)"><rect x="-11" y="101.1" width="22" height="15"></rect></g><g class="tower-row" transform="translate(50, 102.2)"><rect x="-11" y="101.1" width="22" height="15"></rect></g><g class="tower-row" transform="translate(50, 102.3)"><rect x="-11" y="101.1" width="22" height="15"></rect></g><g class="tower-row" transform="translate(50, 102.4)"><rect x="-11" y="101.1" width="22" height="15"></rect></g><g class="tower-row" transform="translate(50, 102.5)"><rect x="-11" y="101.1" width="22" height="15"></rect></g><g class="tower-row" transform="translate(50, 102.6)"><rect x="-11" y="101.1" width="22" height="15"></rect></g><g class="tower-row" transform="translate(50, 102.7)"><rect x="-11" y="101.1" width="22" height="15"></rect></g><g class="tower-row" transform="translate(50, 102.8)"><rect x="-11" y="101.1" width="22" height="15"></rect></g><g class="tower-row" transform="translate(50, 102.9)"><rect x="-11" y="101.1" width="22" height="15"></rect></g><g class="tower-row" transform="translate(50, 103)"><rect x="-11" y="101.1" width="22" height="15"></rect></g><g class="tower-row" transform="translate(50, 103.10000000000001)"><rect x="-11" y="101.1" width="22" height="15"></rect></g><g class="tower-row" transform="translate(50, 103.19999999999999)"><rect x="-11" y="101.1" width="22" height="15"></rect></g><g class="tower-row" transform="translate(50, 103.3)"><rect x="-11" y="101.1" width="22" height="15"></rect></g><g class="tower-row" transform="translate(50, 103.39999999999999)"><rect x="-11" y="101.1" width="22" height="15"></rect></g><g class="tower-row" transform="translate(50, 103.5)"><rect x="-11" y="101.1" width="22" height="15"></rect></g><g class="tower-row" transform="translate(50, 103.6)"><rect x="-11" y="101.1" width="22" height="15"></rect></g><g class="tower-row" transform="translate(50, 103.69999999999999)"><rect x="-11" y="101.1" width="22" height="15"></rect></g><g class="tower-row" transform="translate(50, 103.8)"><rect x="-11" y="101.1" width="22" height="15"></rect></g><g class="tower-row" transform="translate(50, 103.9)"><rect x="-11" y="101.1" width="22" height="15"></rect></g><g class="tower-row" transform="translate(50, 104)"><rect x="-11" y="101.1" width="22" height="15"></rect></g><g class="tower-row" transform="translate(50, 104.1)"><rect x="-11" y="101.1" width="22" height="15"></rect></g><g class="tower-row" transform="translate(50, 104.2)"><rect x="-11" y="101.1" width="22" height="15"></rect></g><g class="tower-row" transform="translate(50, 104.3)"><rect x="-11" y="101.1" width="22" height="15"></rect></g><g class="tower-row" transform="translate(50, 104.4)"><rect x="-11" y="101.1" width="22" height="15"></rect></g><g class="tower-row" transform="translate(50, 104.5)"><rect x="-11" y="101.1" width="22" height="15"></rect></g><g class="tower-row" transform="translate(50, 104.6)"><rect x="-11" y="101.1" width="22" height="15"></rect></g><g class="tower-row" transform="translate(50, 104.69999999999999)"><rect x="-11" y="101.1" width="22" height="15"></rect></g><g class="tower-row" transform="translate(50, 104.8)"><rect x="-11" y="101.1" width="22" height="15"></rect></g><g class="tower-row" transform="translate(50, 104.89999999999999)"><rect x="-11" y="101.1" width="22" height="15"></rect></g><g class="tower-row" transform="translate(50, 105)"><rect x="-11" y="101.1" width="22" height="15"></rect></g><g class="tower-row" transform="translate(50, 105.1)"><rect x="-11" y="101.1" width="22" height="15"></rect></g><g class="tower-row" transform="translate(50, 105.19999999999999)"><rect x="-11" y="101.1" width="22" height="15"></rect></g><g class="tower-row" transform="translate(50, 105.3)"><rect x="-11" y="101.1" width="22" height="15"></rect></g><g class="tower-row" transform="translate(50, 105.39999999999999)"><rect x="-11" y="101.1" width="22" height="15"></rect></g><g class="tower-row" transform="translate(50, 105.5)"><rect x="-11" y="101.1" width="22" height="15"></rect></g><g class="tower-row" transform="translate(50, 105.6)"><rect x="-11" y="101.1" width="22" height="15"></rect></g><g class="tower-row" transform="translate(50, 105.7)"><rect x="-11" y="101.1" width="22" height="15"></rect></g><g class="tower-row" transform="translate(50, 105.8)"><rect x="-11" y="101.1" width="22" height="15"></rect></g><g class="tower-row" transform="translate(50, 105.9)"><rect x="-11" y="101.1" width="22" height="15"></rect></g><g class="tower-row" transform="translate(50, 105.99999999999999)"><rect x="-11" y="101.1" width="22" height="15"></rect></g><g class="tower-row" transform="translate(50, 106.1)"><rect x="-11" y="101.1" width="22" height="15"></rect></g><g class="tower-row" transform="translate(50, 106.19999999999999)"><rect x="-11" y="101.1" width="22" height="15"></rect></g><g class="tower-row" transform="translate(50, 106.3)"><rect x="-11" y="101.1" width="22" height="15"></rect></g><g class="tower-row" transform="translate(50, 106.39999999999999)"><rect x="-11" y="101.1" width="22" height="15"></rect></g><g class="tower-row" transform="translate(50, 106.5)"><rect x="-11" y="101.1" width="22" height="15"></rect></g><g class="tower-row" transform="translate(50, 106.6)"><rect x="-11" y="101.1" width="22" height="15"></rect></g><g class="tower-row" transform="translate(50, 106.69999999999999)"><rect x="-11" y="101.1" width="22" height="15"></rect></g><g class="tower-row" transform="translate(50, 106.8)"><rect x="-11" y="101.1" width="22" height="15"></rect></g><g class="tower-row" transform="translate(50, 106.9)"><rect x="-11" y="101.1" width="22" height="15"></rect></g><g class="tower-row" transform="translate(50, 107)"><rect x="-11" y="101.1" width="22" height="15"></rect></g><g class="tower-row" transform="translate(50, 107.1)"><rect x="-11" y="101.1" width="22" height="15"></rect></g><g class="tower-row" transform="translate(50, 107.2)"><rect x="-11" y="101.1" width="22" height="15"></rect></g><g class="tower-row" transform="translate(50, 107.3)"><rect x="-11" y="101.1" width="22" height="15"></rect></g><g class="tower-row" transform="translate(50, 107.4)"><rect x="-11" y="101.1" width="22" height="15"></rect></g><g class="tower-row" transform="translate(50, 107.5)"><rect x="-11" y="101.1" width="22" height="15"></rect></g><g class="tower-row" transform="translate(50, 107.6)"><rect x="-11" y="101.1" width="22" height="15"></rect></g><g class="tower-row" transform="translate(50, 107.7)"><rect x="-11" y="101.1" width="22" height="15"></rect></g><g class="tower-row" transform="translate(50, 107.8)"><rect x="-11" y="101.1" width="22" height="15"></rect></g><g class="tower-row" transform="translate(50, 107.9)"><rect x="-11" y="101.1" width="22" height="15"></rect></g><g class="tower-row" transform="translate(50, 108)"><rect x="-11" y="101.1" width="22" height="15"></rect></g><g class="tower-row" transform="translate(50, 108.10000000000001)"><rect x="-11" y="101.1" width="22" height="15"></rect></g><g class="tower-row" transform="translate(50, 108.2)"><rect x="-11" y="101.1" width="22" height="15"></rect></g><g class="tower-row" transform="translate(50, 108.30000000000001)"><rect x="-11" y="101.1" width="22" height="15"></rect></g><g class="tower-row" transform="translate(50, 108.4)"><rect x="-11" y="101.1" width="22" height="15"></rect></g><g class="tower-row" transform="translate(50, 108.50000000000001)"><rect x="-11" y="101.1" width="22" height="15"></rect></g><g class="tower-row" transform="translate(50, 108.6)"><rect x="-11" y="101.1" width="22" height="15"></rect></g><g class="tower-row" transform="translate(50, 108.7)"><rect x="-11" y="101.1" width="22" height="15"></rect></g><g class="tower-row" transform="translate(50, 108.8)"><rect x="-11" y="101.1" width="22" height="15"></rect></g><g class="tower-row" transform="translate(50, 108.9)"><rect x="-11" y="101.1" width="22" height="15"></rect></g><g class="tower-row" transform="translate(50, 109)"><rect x="-11" y="101.1" width="22" height="15"></rect></g><g class="tower-row" transform="translate(50, 109.1)"><rect x="-11" y="101.1" width="22" height="15"></rect></g><g class="tower-row" transform="translate(50, 109.2)"><rect x="-11" y="101.1" width="22" height="15"></rect></g><g class="tower-row" transform="translate(50, 109.30000000000001)"><rect x="-11" y="101.1" width="22" height="15"></rect></g><g class="tower-row" transform="translate(50, 109.4)"><rect x="-11" y="101.1" width="22" height="15"></rect></g><g class="tower-row" transform="translate(50, 109.5)"><rect x="-11" y="101.1" width="22" height="15"></rect></g><g class="tower-row" transform="translate(50, 109.60000000000001)"><rect x="-11" y="101.1" width="22" height="15"></rect></g><g class="tower-row" transform="translate(50, 109.7)"><rect x="-11" y="101.1" width="22" height="15"></rect></g><g class="tower-row" transform="translate(50, 109.80000000000001)"><rect x="-11" y="101.1" width="22" height="15"></rect></g><g class="tower-row" transform="translate(50, 109.9)"><rect x="-11" y="101.1" width="22" height="15"></rect></g><g class="tower-row" transform="translate(50, 110)"><rect x="-11" y="101.1" width="22" height="15"></rect></g><g class="tower-row" transform="translate(50, 110.1)"><rect x="-11" y="101.1" width="22" height="15"></rect></g><g class="tower-row" transform="translate(50, 110.2)"><rect x="-11" y="101.1" width="22" height="15"></rect></g><g class="tower-row" transform="translate(50, 110.3)"><rect x="-11" y="101.1" width="22" height="15"></rect></g><g class="tower-row" transform="translate(50, 110.4)"><rect x="-11" y="101.1" width="22" height="15"></rect></g><g class="tower-row" transform="translate(50, 110.5)"><rect x="-11" y="101.1" width="22" height="15"></rect></g><g class="tower-row" transform="translate(50, 110.6)"><rect x="-11" y="101.1" width="22" height="15"></rect></g><g class="tower-row" transform="translate(50, 110.7)"><rect x="-11" y="101.1" width="22" height="15"></rect></g><g class="tower-row" transform="translate(50, 110.80000000000001)"><rect x="-11" y="101.1" width="22" height="15"></rect></g><g class="tower-row" transform="translate(50, 110.9)"><rect x="-11" y="101.1" width="22" height="15"></rect></g><g class="tower-row" transform="translate(50, 111)"><rect x="-11" y="101.1" width="22" height="15"></rect></g><g class="tower-row" transform="translate(50, 111.10000000000001)"><rect x="-11" y="101.1" width="22" height="15"></rect></g><g class="tower-row" transform="translate(50, 111.2)"><rect x="-11" y="101.1" width="22" height="15"></rect></g><g class="tower-row" transform="translate(50, 111.30000000000001)"><rect x="-11" y="101.1" width="22" height="15"></rect></g><g class="tower-row" transform="translate(50, 111.39999999999999)"><rect x="-11" y="101.1" width="22" height="15"></rect></g><g class="tower-row" transform="translate(50, 111.5)"><rect x="-11" y="101.1" width="22" height="15"></rect></g><g class="tower-row" transform="translate(50, 111.6)"><rect x="-11" y="101.1" width="22" height="15"></rect></g><g class="tower-row" transform="translate(50, 111.69999999999999)"><rect x="-11" y="101.1" width="22" height="15"></rect></g><g class="tower-row" transform="translate(50, 111.8)"><rect x="-11" y="101.1" width="22" height="15"></rect></g><g class="tower-row" transform="translate(50, 111.9)"><rect x="-11" y="101.1" width="22" height="15"></rect></g><g class="tower-row" transform="translate(50, 112)"><rect x="-11" y="101.1" width="22" height="15"></rect></g><g class="tower-row" transform="translate(50, 112.1)"><rect x="-11" y="101.1" width="22" height="15"></rect></g><g class="tower-row" transform="translate(50, 112.2)"><rect x="-11" y="101.1" width="22" height="15"></rect></g><g class="tower-row" transform="translate(50, 112.30000000000001)"><rect x="-11" y="101.1" width="22" height="15"></rect></g><g class="tower-row" transform="translate(50, 112.4)"><rect x="-11" y="101.1" width="22" height="15"></rect></g><g class="tower-row" transform="translate(50, 112.5)"><rect x="-11" y="101.1" width="22" height="15"></rect></g><g class="tower-row" transform="translate(50, 112.60000000000001)"><rect x="-11" y="101.1" width="22" height="15"></rect></g><g class="tower-row" transform="translate(50, 112.70000000000002)"><rect x="-11" y="101.1" width="22" height="15"></rect></g><g class="tower-row" transform="translate(50, 112.8)"><rect x="-11" y="101.1" width="22" height="15"></rect></g><g class="tower-row" transform="translate(50, 112.89999999999999)"><rect x="-11" y="101.1" width="22" height="15"></rect></g><g class="tower-row" transform="translate(50, 113)"><rect x="-11" y="101.1" width="22" height="15"></rect></g><g class="tower-row" transform="translate(50, 113.1)"><rect x="-11" y="101.1" width="22" height="15"></rect></g><g class="tower-row" transform="translate(50, 113.19999999999999)"><rect x="-11" y="101.1" width="22" height="15"></rect></g><g class="tower-row" transform="translate(50, 113.3)"><rect x="-11" y="101.1" width="22" height="15"></rect></g><g class="tower-row" transform="translate(50, 113.4)"><rect x="-11" y="101.1" width="22" height="15"></rect></g><g class="tower-row" transform="translate(50, 113.5)"><rect x="-11" y="101.1" width="22" height="15"></rect></g><g class="tower-row" transform="translate(50, 113.6)"><rect x="-11" y="101.1" width="22" height="15"></rect></g><g class="tower-row" transform="translate(50, 113.7)"><rect x="-11" y="101.1" width="22" height="15"></rect></g><g class="tower-row" transform="translate(50, 113.80000000000001)"><rect x="-11" y="101.1" width="22" height="15"></rect></g><g class="tower-row" transform="translate(50, 113.9)"><rect x="-11" y="101.1" width="22" height="15"></rect></g><g class="tower-row" transform="translate(50, 114)"><rect x="-11" y="101.1" width="22" height="15"></rect></g><g class="tower-row" transform="translate(50, 114.10000000000001)"><rect x="-11" y="101.1" width="22" height="15"></rect></g><g class="tower-row" transform="translate(50, 114.2)"><rect x="-11" y="101.1" width="22" height="15"></rect></g><g class="tower-row" transform="translate(50, 114.3)"><rect x="-11" y="101.1" width="22" height="15"></rect></g><g class="tower-row" transform="translate(50, 114.39999999999999)"><rect x="-11" y="101.1" width="22" height="15"></rect></g><g class="tower-row" transform="translate(50, 114.5)"><rect x="-11" y="101.1" width="22" height="15"></rect></g><g class="tower-row" transform="translate(50, 114.6)"><rect x="-11" y="101.1" width="22" height="15"></rect></g><g class="tower-row" transform="translate(50, 114.7)"><rect x="-11" y="101.1" width="22" height="15"></rect></g><g class="tower-row" transform="translate(50, 114.8)"><rect x="-11" y="101.1" width="22" height="15"></rect></g><g class="tower-row" transform="translate(50, 114.9)"><rect x="-11" y="101.1" width="22" height="15"></rect></g><g class="tower-row" transform="translate(50, 115)"><rect x="-11" y="101.1" width="22" height="15"></rect></g><g class="tower-row" transform="translate(50, 115.1)"><rect x="-11" y="101.1" width="22" height="15"></rect></g><g class="tower-row" transform="translate(50, 115.2)"><rect x="-11" y="101.1" width="22" height="15"></rect></g><g class="tower-row" transform="translate(50, 115.3)"><rect x="-11" y="101.1" width="22" height="15"></rect></g><g class="tower-row" transform="translate(50, 115.4)"><rect x="-11" y="101.1" width="22" height="15"></rect></g><g class="tower-row" transform="translate(50, 115.5)"><rect x="-11" y="101.1" width="22" height="15"></rect></g><g class="tower-row" transform="translate(50, 115.6)"><rect x="-11" y="101.1" width="22" height="15"></rect></g><g class="tower-row" transform="translate(50, 115.69999999999999)"><rect x="-11" y="101.1" width="22" height="15"></rect></g><g class="tower-row" transform="translate(50, 115.79999999999998)"><rect x="-11" y="101.1" width="22" height="15"></rect></g><g class="tower-row" transform="translate(50, 115.89999999999999)"><rect x="-11" y="101.1" width="22" height="15"></rect></g><g class="tower-row" transform="translate(50, 116)"><rect x="-11" y="101.1" width="22" height="15"></rect></g><g class="tower-row" transform="translate(50, 116.1)"><rect x="-11" y="101.1" width="22" height="15"></rect></g><rect class="tower" x="40" y="0" rx="3" width="20" height="1000"></rect>'
    );
  });
});
