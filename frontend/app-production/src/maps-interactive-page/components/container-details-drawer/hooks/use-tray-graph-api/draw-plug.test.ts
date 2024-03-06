import * as d3 from 'd3';

import { drawPlug, PLUG_CLASS } from './draw-plug';

describe('drawPlug', () => {
  let el;

  beforeEach(() => {
    el = d3.select(document.createElement('svg'));
  });

  it('draws', () => {
    // ACT
    drawPlug({
      el,
      x: 100,
      y: 150,
      borderRadius: 5,
      width: 20,
      height: 20,
      plugColor: 'red',
    });

    // ASSERT
    expect(el.node().querySelector(`.${PLUG_CLASS}`)).toBeTruthy();
    expect(el.node().innerHTML).toEqual(
      '<g class="plug" transform="translate(100, 150)"><rect rx="5" width="20" height="20" stroke-width="1" fill="red"></rect></g>'
    );
  });
});
