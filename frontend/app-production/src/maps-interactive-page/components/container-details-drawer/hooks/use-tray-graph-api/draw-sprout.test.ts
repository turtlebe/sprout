import * as d3 from 'd3';

import { drawSprout, SPROUT_CLASS } from './draw-sprout';

describe('drawSprout', () => {
  let el;

  beforeEach(() => {
    el = d3.select(document.createElement('svg'));
  });

  it('draws', () => {
    // ACT
    drawSprout({
      el,
      x: 100,
      y: 150,
      baseWidth: 200,
      baseHeight: 300,
      strokeColor: 'blue',
      fillColor: 'red',
    });

    // ASSERT
    expect(el.node().querySelector(`.${SPROUT_CLASS}`)).toBeTruthy();
    expect(el.node().innerHTML).toEqual(
      '<g class="sprout" transform="translate(190.625, 282.75) scale(0.75)"><path d="M1.50897 7.44758C1.50897 7.44758 -0.409665 12.1632 3.20335 16.2112C6.81636 20.2593 9.10875 16.1682 9.10875 16.1682C9.10875 16.1682 12.3231 10.2899 1.50897 7.44758Z" fill="red" stroke="blue" stroke-width="1.3333333333333333" stroke-miterlimit="10"></path><path d="M23.5907 0.895508C23.5907 0.895508 26.2056 7.48461 21 13.0874C15.7944 18.6903 12.6226 12.9825 12.6226 12.9825C12.6226 12.9825 8.16753 4.75664 23.5907 0.895508Z" fill="red" stroke="blue" stroke-width="1.3333333333333333" stroke-miterlimit="10"></path><path d="M23.5 1.5C12.9502 8.68053 10.4349 21.9797 10.41 22C10.41 22 9.1908 13.2982 2.0498 8.24746" fill-opacity="0" stroke="blue" stroke-opacity="1" stroke-width="1.3333333333333333" stroke-linecap="round" stroke-linejoin="round"></path></g>'
    );
  });
});
