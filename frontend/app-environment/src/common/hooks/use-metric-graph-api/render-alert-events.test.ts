import { buildAlertEvent, buildRolledUpByTimeObservation } from '@plentyag/app-environment/src/common/test-helpers';
import { AlertEventStatus, TimeSummarization } from '@plentyag/core/src/types/environment';
import * as d3 from 'd3';

import { renderAlertEvents } from './render-alert-events';

const observations = [
  buildRolledUpByTimeObservation({ rolledUpAt: '2022-01-01T00:00:00Z' }),
  buildRolledUpByTimeObservation({ rolledUpAt: '2022-01-01T00:15:00Z' }),
  buildRolledUpByTimeObservation({ rolledUpAt: '2022-01-01T00:30:00Z' }),
  buildRolledUpByTimeObservation({ rolledUpAt: '2022-01-01T00:45:00Z' }),
  buildRolledUpByTimeObservation({ rolledUpAt: '2022-01-01T01:00:00Z' }),
];

const alertEvents = [
  buildAlertEvent({ status: AlertEventStatus.triggered, generatedAt: '2022-01-01T00:10:00Z' }),
  buildAlertEvent({ status: AlertEventStatus.noDataTriggered, generatedAt: '2022-01-01T00:10:00Z' }),
  buildAlertEvent({ status: AlertEventStatus.resolved, generatedAt: '2022-01-01T00:20:00Z' }),
  buildAlertEvent({ status: AlertEventStatus.triggered, generatedAt: '2022-01-01T00:35:00Z' }),
  buildAlertEvent({ status: AlertEventStatus.noDataResolved, generatedAt: '2022-01-01T00:35:00Z' }),
  buildAlertEvent({ status: AlertEventStatus.resolved, generatedAt: '2022-01-01T00:50:00Z' }),
];

describe('renderAlertEvents', () => {
  let node, ref, scale;

  beforeEach(() => {
    // ARRANGE
    // -- create dimensions and yScale
    scale = {
      width: 100,
      height: 200,
      paddingX: 10,
      paddingY: 10,
      x: d3
        .scaleTime()
        .domain([new Date(observations[0].rolledUpAt), new Date(observations[observations.length - 1].rolledUpAt)])
        .range([0, 200]),
      y: d3.scaleLinear().domain([0, 1]).range([0, 200]),
    };

    // -- create DOM element & ref
    node = document.createElement('div');
    ref = {
      current: node,
    } as unknown as React.MutableRefObject<HTMLDivElement>;
  });

  it('renders two lines', () => {
    renderAlertEvents({ ref, scale })({
      alertEvents,
      observations,
      timeSummarization: TimeSummarization.median,
    });

    expect(node.querySelectorAll('path.alert-event')).toHaveLength(2);
  });
});
