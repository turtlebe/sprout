import { buildRolledUpByTimeObservation } from '@plentyag/app-environment/src/common/test-helpers';
import * as d3 from 'd3';

import { getGraphTooltipNonNumericalDataTestIds } from '../../components';
import { DEFAULT_TIME_GRANULARITY } from '../../utils/constants';

import { renderNonNumericalObservations } from './render-non-numerical-observations';

const startDateTime = new Date('2022-01-01T00:00:00Z');
const endDateTime = new Date('2022-01-02T00:00:00Z');
const graphTooltipSelectors = getGraphTooltipNonNumericalDataTestIds('test');

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

  it('renders a hourly based histogram for observations ', () => {
    const observations = [
      buildRolledUpByTimeObservation({ rolledUpAt: '2022-01-01T01:00:00Z', value: 'A', valueCount: 10 }),
      buildRolledUpByTimeObservation({ rolledUpAt: '2022-01-01T01:00:00Z', value: 'B', valueCount: 5 }),
      buildRolledUpByTimeObservation({ rolledUpAt: '2022-01-01T01:05:00Z', value: 'C', valueCount: 15 }),
      buildRolledUpByTimeObservation({ rolledUpAt: '2022-01-01T01:05:00Z', value: 'D', valueCount: 15 }),
      buildRolledUpByTimeObservation({ rolledUpAt: '2022-01-01T01:10:00Z', value: 'A', valueCount: 22 }),
      buildRolledUpByTimeObservation({ rolledUpAt: '2022-01-01T01:10:00Z', value: 'B', valueCount: 33 }),
    ];
    const onClick = jest.fn();

    renderNonNumericalObservations({ ref, scale })({
      observations,
      timeGranularity: DEFAULT_TIME_GRANULARITY,
      valueAttribute: undefined,
      onClick,
      graphTooltipSelectors,
    });

    // 4 different values so 4 groups
    expect(node.querySelectorAll('g[data-key]')).toHaveLength(4);

    // 6 observations so 6 bars with a height
    expect(
      Array.from<HTMLElement>(node.querySelectorAll('rect')).filter(a => a.getAttribute('height') != '0')
    ).toHaveLength(6);

    expect(onClick).not.toHaveBeenCalled();

    Array.from<HTMLElement>(node.querySelectorAll('rect'))
      .find(a => a.getAttribute('height') != '0')
      .click();

    expect(onClick).toHaveBeenCalledWith({
      rolledUpAt: observations[0].rolledUpAt,
      observations: [observations[0], observations[1]],
    });
  });
});
