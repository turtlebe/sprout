import * as d3 from 'd3';

import { MOUSE_OVER_EFFECT } from '../constants';

import { drawMouseOverCircles } from './draw-mouse-over-circles';

describe('drawMouseOverCircles', () => {
  it('draws two circles', () => {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    const data = [1, 2];

    d3.select(svg).append('g').attr('class', MOUSE_OVER_EFFECT.container);

    drawMouseOverCircles({ svg, data, class: item => `className-${item}`, color: item => `color-${item}` });

    expect(svg.querySelectorAll('circle').length).toBe(2);
    expect(svg.querySelectorAll('circle')[0]).toHaveAttribute('class', 'className-1');
    expect(svg.querySelectorAll('circle')[0]).toHaveAttribute('style', 'fill: color-1; opacity: 0;');
    expect(svg.querySelectorAll('circle')[1]).toHaveAttribute('class', 'className-2');
    expect(svg.querySelectorAll('circle')[1]).toHaveAttribute('style', 'fill: color-2; opacity: 0;');
  });
});
