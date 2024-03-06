import * as d3 from 'd3';

import { renderAlertRuleD3Area } from './render-alert-rule-area';

const startDateTime = new Date('2023-01-01T00:00:00Z');
const endDateTime = new Date('2023-01-03T00:00:00Z');
const x = d3.scaleTime().domain([startDateTime, endDateTime]);
const y = d3.scaleLinear().domain([100, 0]).range([0, 100]);

describe('renderAlertRuleD3Area', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders an area for numerical rules', () => {
    const scales = { x, y };
    const rules = [
      { time: new Date('2023-01-01T00:00:00Z'), gte: 10, lte: 20 },
      { time: new Date('2023-01-02T00:00:00Z'), gte: 20, lte: 30 },
    ];

    expect(renderAlertRuleD3Area(scales)(rules)).toBe('M0,80L0.5,70L0.5,80L0,90Z');
  });

  it('renders an area for one-sided rules using domain min/max', () => {
    const scales = { x, y };
    const rules = [
      { time: new Date('2023-01-01T00:00:00Z'), gte: 10 },
      { time: new Date('2023-01-02T00:00:00Z'), gte: 20 },
    ];

    expect(renderAlertRuleD3Area(scales)(rules)).toBe('M0,0L0.5,0L0.5,80L0,90Z');
  });
});
