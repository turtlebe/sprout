import { useFakeTimers, useRealTimers } from '@plentyag/core/src/test-helpers';
import { getComputedTextLength } from '@plentyag/core/src/utils';
import * as d3 from 'd3';

import { setDataOnHandleInfo } from './set-data-on-handle-info';

jest.mock('@plentyag/core/src/utils/get-computed-text-length');

const mockGetComputedTextLength = getComputedTextLength as jest.Mock;

const unitSymbol = 'C';
const yAttribute = 'gte';
const data = { time: new Date('2023-01-01T00:00:00Z'), [yAttribute]: 10 };
const coordX = 100;
const coordY = 100;
const selector = 'g';

function getSvgElements() {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

  const container = d3.select(svg).append('g').attr('transform', 'translate(0, 0)');
  const text = container.append('text').text('text');
  const rect = container.append('rect');

  return { svg, container, text, rect };
}

describe('setDataOnHandleInfo', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    useFakeTimers(data.time);

    mockGetComputedTextLength.mockReturnValue(0);
  });

  afterEach(() => {
    useRealTimers();
  });

  it('does not do anything when the selector is wrong', () => {
    const { svg } = getSvgElements();
    const innerHtml = svg.innerHTML;

    setDataOnHandleInfo({ svg, selector: 'g.unknown', data, yAttribute, unitSymbol, coordX, coordY });

    // nothing changes
    expect(svg.innerHTML).toBe(innerHtml);
  });

  it('updates the text of the handle', () => {
    const { svg, text } = getSvgElements();
    const innerHtml = svg.innerHTML;

    setDataOnHandleInfo({ svg, selector, data, yAttribute, unitSymbol, coordX, coordY });

    expect(svg.innerHTML).not.toBe(innerHtml);
    expect(text.node()).toHaveTextContent('10 C | 04:00 PM');
  });

  it('updates the width of the background of the text', () => {
    const { svg, rect } = getSvgElements();

    setDataOnHandleInfo({ svg, selector, data, yAttribute, unitSymbol, coordX, coordY });

    expect(rect.node()).toHaveAttribute('width', '16');
  });

  it('moves the handle x/y coordinates', () => {
    const { svg, container } = getSvgElements();

    setDataOnHandleInfo({ svg, selector, data, yAttribute, unitSymbol, coordX, coordY });

    expect(container.node()).toHaveAttribute('transform', 'translate(116, 116)');
  });

  it('moves the handle x coordinate only', () => {
    const { svg, container } = getSvgElements();

    setDataOnHandleInfo({ svg, selector, data, yAttribute, unitSymbol, coordX });

    expect(container.node()).toHaveAttribute('transform', 'translate(116, 0)');
  });
});
