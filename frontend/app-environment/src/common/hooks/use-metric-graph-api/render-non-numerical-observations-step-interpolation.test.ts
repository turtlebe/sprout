import { buildRolledUpByTimeObservation, mockMetrics } from '@plentyag/app-environment/src/common/test-helpers';
import * as d3 from 'd3';

import { renderNonNumericalObservationsStepInterpolation } from './render-non-numerical-observations-step-interpolation';

const [metric] = mockMetrics;
const startDateTime = new Date('2022-01-01T00:00:00Z');
const endDateTime = new Date('2022-01-02T00:00:00Z');

describe('renderNonNumericalObservations', () => {
  let node, ref, scale;

  beforeEach(() => {
    // ARRANGE
    // -- create dimensions and yScale
    scale = {
      startDateTime,
      endDateTime,
      paddingX: 10,
      paddingY: 10,
      x: d3.scaleTime().domain([startDateTime, endDateTime]).range([0, 100]),
      y: d3.scaleLinear().domain([0, 1]).range([0, 100]),
    };

    // -- create DOM element & ref
    node = document.createElement('div');
    ref = {
      current: node,
    } as unknown as React.MutableRefObject<HTMLDivElement>;
  });

  it('renders a step chart for observations ', () => {
    const observations = [
      buildRolledUpByTimeObservation({ rolledUpAt: '2022-01-01T01:00:00Z', value: 'A', valueCount: 10 }),
      buildRolledUpByTimeObservation({ rolledUpAt: '2022-01-01T01:00:00Z', value: 'B', valueCount: 5 }),
      buildRolledUpByTimeObservation({ rolledUpAt: '2022-01-01T01:05:00Z', value: 'C', valueCount: 15 }),
      buildRolledUpByTimeObservation({ rolledUpAt: '2022-01-01T01:05:00Z', value: 'D', valueCount: 15 }),
      buildRolledUpByTimeObservation({ rolledUpAt: '2022-01-01T01:10:00Z', value: 'A', valueCount: 22 }),
      buildRolledUpByTimeObservation({ rolledUpAt: '2022-01-01T01:10:00Z', value: 'B', valueCount: 33 }),
    ];

    renderNonNumericalObservationsStepInterpolation({ ref, scale })({
      metric,
      observations,
    });

    // 6 observations so 12 lines, 6 horizonatal + 6 vertical
    expect(node.querySelectorAll('line')).toHaveLength(12);
  });
});
