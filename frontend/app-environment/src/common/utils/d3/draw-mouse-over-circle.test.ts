import * as d3 from 'd3';

import { MOUSE_OVER_EFFECT } from '../constants';

import { drawMouseOverCircle } from './draw-mouse-over-circle';

describe('drawMouseOverCircle', () => {
  it('draws a circle', () => {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

    d3.select(svg).append('g').attr('class', MOUSE_OVER_EFFECT.container);

    drawMouseOverCircle({ svg, class: 'testClassName', color: 'testColor' });

    expect(svg.querySelectorAll('circle').length).toBe(1);
    expect(svg.querySelector('circle')).toHaveAttribute('class', 'testClassName');
    expect(svg.querySelector('circle')).toHaveAttribute('style', 'fill: testColor; opacity: 0;');
  });
});
