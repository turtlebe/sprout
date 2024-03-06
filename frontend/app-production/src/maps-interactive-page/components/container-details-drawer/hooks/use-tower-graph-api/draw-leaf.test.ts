import * as d3 from 'd3';

import { drawLeaf, LEAF_CLASS } from './draw-leaf';

describe('drawLeaf', () => {
  let el;

  beforeEach(() => {
    el = d3.select(document.createElement('svg'));
  });

  it('draws leaf directing left', () => {
    // ACT
    drawLeaf({
      el,
      x: 100,
      y: 150,
      direction: 'left',
      strokeColor: 'blue',
      fillColor: 'red',
    });

    // ASSERT
    expect(el.node().querySelector(`.${LEAF_CLASS}`)).toBeTruthy();
    expect(el.node().innerHTML).toEqual(
      '<g class="leaf" transform="translate(80.31, 160.175)"><path d="M21.1901 22.0102C20.9601 21.3602 0.670067 1.67016 0.670067 1.67016C0.670067 1.67016 -0.299933 8.26016 2.42007 12.9702C4.37007 16.3502 9.85007 20.4202 13.4601 15.8102C13.4601 15.8102 17.0601 4.30016 0.670067 1.66016" fill="red" stroke="blue" stroke-miterlimit="10"></path></g>'
    );
  });

  it('draws leaf directing right', () => {
    // ACT
    drawLeaf({
      el,
      x: 100,
      y: 150,
      direction: 'right',
      strokeColor: 'blue',
      fillColor: 'red',
    });

    // ASSERT
    expect(el.node().querySelector(`.${LEAF_CLASS}`)).toBeTruthy();
    expect(el.node().innerHTML).toEqual(
      '<g class="leaf" transform="translate(98, 160.175)"><path d="M1.38989 21.8803C1.62989 21.2303 21.9099 1.54027 21.9099 1.54027C21.9099 1.54027 22.8799 8.13027 20.1599 12.8403C18.2099 16.2203 12.7299 20.2903 9.11989 15.6803C9.11989 15.6803 5.51989 4.17027 21.9099 1.53027" fill="red" stroke="blue" stroke-miterlimit="10"></path></g>'
    );
  });
});
