import * as d3 from 'd3';
import numeral from 'numeral';

import { invertValue } from './invert-value';

const scalePoint = d3.scalePoint().domain(['10', '20']).range([0, 100]);
const scaleLinear = d3.scaleLinear().domain([0, 100]).range([0, 100]);

describe('invertValue', () => {
  it('verifies numeraljs works as expected', () => {
    expect(numeral(100).format('0,0,0.[00]')).toBe('100');
    expect(numeral(100.1245).format('0,0,0.[00]')).toBe('100.12');
    expect(numeral(100.1255).format('0,0,0.[00]')).toBe('100.13');
    expect(numeral(100.001).format('0,0,0.[00]')).toBe('100');
    expect(numeral(100.01).format('0,0,0.[00]')).toBe('100.01');
  });

  it('formats the value when the scale is linear and the value is a float', () => {
    expect(invertValue(scaleLinear, 50.123141)).toBe('50.12');
    expect(invertValue(scaleLinear, 50.129123)).toBe('50.13');
  });

  it('does not format the value when the scale is linear and the value is an integer', () => {
    expect(invertValue(scaleLinear, 50)).toBe('50');
    expect(invertValue(scaleLinear, 416)).toBe('416');
  });

  it('does not format the value when the scale is not linear', () => {
    expect(invertValue(scalePoint, 10)).toBe('10');
  });
});
