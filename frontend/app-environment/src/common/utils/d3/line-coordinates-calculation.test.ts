import { Rule } from '@plentyag/core/src/types/environment';
import * as d3 from 'd3';

import {
  horizontalLineX1,
  horizontalLineX2,
  horizontalLineY,
  linearLineX1,
  linearLineX2,
  linearLineY1,
  linearLineY2,
  verticalLineX,
  verticalLineY1,
  verticalLineY2,
} from './line-coordinates-calculation';

const startDateTime = new Date('2023-01-01T00:00:00Z');
const inBetweenDateTime = new Date('2023-01-02T00:00:00Z');
const endDateTime = new Date('2023-01-03T00:00:00Z');
const x = d3.scaleTime().domain([startDateTime, endDateTime]).range([0, 100]);
const y = d3.scaleLinear().domain([100, 0]).range([0, 100]);
const data: Rule<Date>[] = [
  { time: startDateTime, gte: 10 },
  { time: inBetweenDateTime, gte: 20 },
  { time: endDateTime, gte: 15 },
];

/** Horizontal Line Calculations */
describe('horizontalLineX1', () => {
  it('returns the x coordinate of the datapoint', () => {
    expect(horizontalLineX1({ x, y, data, value: d => d.time })(data[0], 0)).toBe(0);
    expect(horizontalLineX1({ x, y, data, value: d => d.time })(data[1], 1)).toBe(50);
    expect(horizontalLineX1({ x, y, data, value: d => d.time })(data[2], 2)).toBe(100);
  });
});

describe('horizontalLineX2', () => {
  it('returns the x coordinate of the next datapoint', () => {
    expect(horizontalLineX2({ x, y, data, value: d => d.time })(data[0], 0)).toBe(50);
    expect(horizontalLineX2({ x, y, data, value: d => d.time })(data[1], 1)).toBe(100);
  });

  it('returns the next x coordinate for the last datapoint', () => {
    expect(horizontalLineX2({ x, y, data, value: d => d.time })(data[2], 2)).toBe(100);
  });
});

describe('horizontalLineY', () => {
  it('returns the y coordinate of the datapoint', () => {
    expect(horizontalLineY({ x, y, data, value: d => d.gte })(data[0], 0)).toBe(90);
    expect(horizontalLineY({ x, y, data, value: d => d.gte })(data[1], 1)).toBe(80);
    expect(horizontalLineY({ x, y, data, value: d => d.gte })(data[2], 2)).toBe(85);
  });
});

/** Vertical Line Calculations */
describe('verticalLineX', () => {
  it('returns the x coordinate of the next datapoint', () => {
    expect(verticalLineX({ x, y, data, value: d => d.time })(data[0], 0)).toBe(50);
    expect(verticalLineX({ x, y, data, value: d => d.time })(data[1], 1)).toBe(100);
  });

  it('returns null for the last datapoint', () => {
    expect(verticalLineX({ x, y, data, value: d => d.time })(data[2], 2)).toBe(null);
  });
});

describe('verticalLineY1', () => {
  it('returns the y coordinate of the next datapoint', () => {
    expect(verticalLineY1({ x, y, data, value: d => d.gte })(data[0], 0)).toBe(80);
  });

  it('returns the y coordinate of the current datapoint', () => {
    expect(verticalLineY1({ x, y, data, value: d => d.gte })(data[1], 1)).toBe(80);
  });

  it('returns null for the last datapoint', () => {
    expect(verticalLineY1({ x, y, data, value: d => d.gte })(data[2], 2)).toBe(null);
  });
});

describe('verticalLineY2', () => {
  it('returns the y coordinate of the next datapoint', () => {
    expect(verticalLineY2({ x, y, data, value: d => d.gte })(data[0], 0)).toBe(90);
  });

  it('returns the x coordinate of the datapoint when the point is the last one', () => {
    expect(verticalLineY2({ x, y, data, value: d => d.gte })(data[1], 1)).toBe(85);
  });

  it('returns null for the last datapoint', () => {
    expect(verticalLineY2({ x, y, data, value: d => d.gte })(data[2], 2)).toBe(null);
  });
});

/** Linear Line Calculations */
describe('linearLineX1', () => {
  it('returns the x coordinate of the datapoint', () => {
    expect(linearLineX1({ x, y, data, value: d => d.time })(data[0], 0)).toBe(0);
    expect(linearLineX1({ x, y, data, value: d => d.time })(data[1], 1)).toBe(50);
    expect(linearLineX1({ x, y, data, value: d => d.time })(data[2], 2)).toBe(100);
  });
});

describe('linearLineX2', () => {
  it('returns the x coordinate of the next datapoint', () => {
    expect(linearLineX2({ x, y, data, value: d => d.time })(data[0], 0)).toBe(50);
    expect(linearLineX2({ x, y, data, value: d => d.time })(data[1], 1)).toBe(100);
  });

  it('returns the x coordinate of the current datapoint for the last datapoint', () => {
    expect(linearLineX2({ x, y, data, value: d => d.time })(data[2], 2)).toBe(100);
  });
});

describe('linearLineY1', () => {
  it('returns the y coordinate of the datapoint', () => {
    expect(linearLineY1({ x, y, data, value: d => d.gte })(data[0], 0)).toBe(90);
    expect(linearLineY1({ x, y, data, value: d => d.gte })(data[1], 1)).toBe(80);
    expect(linearLineY1({ x, y, data, value: d => d.gte })(data[2], 2)).toBe(85);
  });
});

describe('linearLineY2', () => {
  it('returns the y coordinate of the next datapoint', () => {
    expect(linearLineY2({ x, y, data, value: d => d.gte })(data[0], 0)).toBe(80);
    expect(linearLineY2({ x, y, data, value: d => d.gte })(data[1], 1)).toBe(85);
  });

  it('returns the y coordinate of the current datapoint for the last datapoint', () => {
    expect(linearLineY2({ x, y, data, value: d => d.gte })(data[2], 2)).toBe(85);
  });
});
