import { buildAlertRule } from '@plentyag/app-environment/src/common/test-helpers';
import * as d3 from 'd3';

import { renderAlertRuleLive } from './render-alert-rule-live';

const at = new Date();
const unitSymbol = 'C';
const color = '#dedede';
const observationValue = 15;

describe('renderAlertRuleLive', () => {
  let node, ref, scale;

  beforeEach(() => {
    // ARRANGE
    // -- create dimensions and yScale
    scale = {
      x: d3.scaleTime().domain([0, 100]).range([0, 100]),
      y: d3.scaleLinear().domain([0, 100]).range([0, 100]),
      min: 0,
      max: 100,
      alertRuleMin: 10,
      alertRuleMax: 20,
    };

    // -- create DOM element & ref
    node = document.createElement('div');
    ref = {
      current: node,
    } as unknown as React.MutableRefObject<HTMLDivElement>;
  });

  it('renders a graph', () => {
    expect(
      renderAlertRuleLive({ ref, scale })({
        alertRule: buildAlertRule({ rules: [{ time: 0, gte: 10, lte: 20 }] }),
        at,
        color,
        unitSymbol,
        observationValue,
      })
    );

    // 5 paths = 1 triangle, 4 circles
    expect(node.querySelectorAll('path')).toHaveLength(5);
    // 2 lines
    expect(node.querySelectorAll('line')).toHaveLength(2);
    // 2 labels
    expect(node.querySelectorAll('text')).toHaveLength(2);
  });

  it('renders nothing when the current rule is one sided', () => {
    expect(
      renderAlertRuleLive({ ref, scale })({
        alertRule: buildAlertRule({ rules: [{ time: 0, gte: 10, lte: null }] }),
        at,
        color,
        unitSymbol,
        observationValue,
      })
    );

    expect(node.querySelector('g')).toBeEmptyDOMElement();
  });
});
