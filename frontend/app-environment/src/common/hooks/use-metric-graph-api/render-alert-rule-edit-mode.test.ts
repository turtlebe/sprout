import { buildAlertRule } from '@plentyag/app-environment/src/common/test-helpers';
import { InterpolationType } from '@plentyag/core/src/types/environment';
import * as d3 from 'd3';

import { renderAlertRuleEditMode } from './render-alert-rule-edit-mode';

const startDateTime = new Date('2023-02-01T00:00:00Z');
const endDateTime = new Date('2023-02-02T00:00:00Z');
const onChange = jest.fn();
const unitSymbol = 'C';
const alertRule = buildAlertRule({
  startsAt: '2023-01-01T00:00:00Z',
  rules: [
    { time: 0, gte: 10, lte: 20 },
    { time: 3600, gte: 20, lte: 40 },
  ],
});
const maxY = 100;
const minY = 0;

describe('renderAlertRuleEditMode', () => {
  let node, ref, scale;

  beforeEach(() => {
    // ARRANGE
    // -- create dimensions and yScale
    scale = {
      minY,
      maxY,
      x: d3.scaleTime().domain([startDateTime, endDateTime]).range([0, 100]),
      y: d3.scaleLinear().domain([maxY, minY]).range([0, 100]),
      paddingX: 10,
      paddingY: 10,
      startDateTime,
      endDateTime,
    };

    // -- create DOM element & ref
    node = document.createElement('div');
    ref = {
      current: node,
    } as unknown as React.MutableRefObject<HTMLDivElement>;
  });

  it('renders an AlertRule without Linear Interpolation', () => {
    renderAlertRuleEditMode({ ref, scale })({
      alertRule,
      onChange,
      unitSymbol,
    });

    // assert lines
    expect(node.querySelectorAll('g.frame line.horizontal.lte')).toHaveLength(6);
    expect(node.querySelectorAll('g.frame line.horizontal.gte')).toHaveLength(6);
    expect(node.querySelectorAll('g.frame line.vertical.lte')).toHaveLength(6);
    expect(node.querySelectorAll('g.frame line.vertical.gte')).toHaveLength(6);

    // assert circles for handles
    expect(node.querySelectorAll('g.handle-frame circle[gte-or-lte="gte"]')).toHaveLength(2);
    expect(node.querySelectorAll('g.handle-frame circle[gte-or-lte="lte"]')).toHaveLength(2);
    expect(node.querySelectorAll('g.handle-frame circle[gte-or-lte="gte"][display="none"]')).toHaveLength(0);
    expect(node.querySelectorAll('g.handle-frame circle[gte-or-lte="lte"][display="none"]')).toHaveLength(0);
  });

  it('renders a one-sided AlertRule with Linear Interpolation', () => {
    renderAlertRuleEditMode({ ref, scale })({
      alertRule: {
        ...alertRule,
        interpolationType: InterpolationType.linear,
        rules: [
          { time: 0, gte: 10 },
          { time: 3600, gte: 20 },
        ],
      },
      onChange,
      unitSymbol,
    });

    // assert lines
    expect(node.querySelectorAll('g.frame line.horizontal')).toHaveLength(0);
    expect(node.querySelectorAll('g.frame line.vertical')).toHaveLength(0);
    expect(node.querySelectorAll('g.frame line.lte')).toHaveLength(4);
    expect(node.querySelectorAll('g.frame line.gte')).toHaveLength(4);

    // assert circles for handles
    expect(node.querySelectorAll('g.handle-frame circle[gte-or-lte="gte"]')).toHaveLength(2);
    expect(node.querySelectorAll('g.handle-frame circle[gte-or-lte="lte"]')).toHaveLength(2);
    expect(node.querySelectorAll('g.handle-frame circle[gte-or-lte="gte"][display="none"]')).toHaveLength(0);
    expect(node.querySelectorAll('g.handle-frame circle[gte-or-lte="lte"][display="none"]')).toHaveLength(2);
  });
});
