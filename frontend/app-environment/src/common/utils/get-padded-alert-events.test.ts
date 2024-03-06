import { AlertEventStatus } from '@plentyag/core/src/types/environment';

import { buildAlertEvent, buildRolledUpByTimeObservation, mockAlertEvents } from '../test-helpers';

import { getPaddedAlertEvents } from './get-padded-alert-events';

const observations = [
  buildRolledUpByTimeObservation({ rolledUpAt: '2022-01-01T00:00:00Z' }),
  buildRolledUpByTimeObservation({ rolledUpAt: '2022-01-01T00:15:00Z' }),
  buildRolledUpByTimeObservation({ rolledUpAt: '2022-01-01T00:30:00Z' }),
  buildRolledUpByTimeObservation({ rolledUpAt: '2022-01-01T00:45:00Z' }),
  buildRolledUpByTimeObservation({ rolledUpAt: '2022-01-01T01:00:00Z' }),
];

describe('getPaddedAlertEvents', () => {
  it('returns an empty array when alert events or observations are missing', () => {
    expect(getPaddedAlertEvents([], [])).toEqual([]);
    expect(getPaddedAlertEvents(mockAlertEvents, [])).toEqual([]);
    expect(getPaddedAlertEvents([], observations)).toEqual([]);
  });

  it('returns an even array of alert events when the alert events contains an odd number of item', () => {
    const alertEvents = [buildAlertEvent({ status: AlertEventStatus.resolved, generatedAt: '2022-01-01T00:10:00Z' })];

    expect(getPaddedAlertEvents(alertEvents, observations)).toEqual([
      { ...alertEvents[0], status: AlertEventStatus.triggered, generatedAt: '2022-01-01T00:00:00Z' },
      { ...alertEvents[0], status: AlertEventStatus.resolved, generatedAt: '2022-01-01T00:10:00Z' },
    ]);
  });

  it('returns an even array of alert events when the alert events contains an odd number of item', () => {
    const alertEvents = [buildAlertEvent({ status: AlertEventStatus.triggered, generatedAt: '2022-01-01T00:10:00Z' })];

    expect(getPaddedAlertEvents(alertEvents, observations)).toEqual([
      { ...alertEvents[0], status: AlertEventStatus.triggered, generatedAt: '2022-01-01T00:10:00Z' },
      { ...alertEvents[0], status: AlertEventStatus.resolved, generatedAt: '2022-01-01T01:00:00Z' },
    ]);
  });

  it('returns a copy of the alert even when the array contains even numbers starting with triggered and ending with resolve', () => {
    const alertEvents = [
      buildAlertEvent({ status: AlertEventStatus.triggered, generatedAt: '2022-01-01T00:10:00Z' }),
      buildAlertEvent({ status: AlertEventStatus.resolved, generatedAt: '2022-01-01T00:40:00Z' }),
    ];

    expect(getPaddedAlertEvents(alertEvents, observations)).toEqual(alertEvents);
  });

  it('pads the alert events with a first triggered alert event and a last resolved alert event when the array contains a pair resolved then triggered', () => {
    const alertEvents = [
      buildAlertEvent({ status: AlertEventStatus.resolved, generatedAt: '2022-01-01T00:10:00Z' }),
      buildAlertEvent({ status: AlertEventStatus.triggered, generatedAt: '2022-01-01T00:40:00Z' }),
    ];

    expect(getPaddedAlertEvents(alertEvents, observations)).toEqual([
      { ...alertEvents[0], status: AlertEventStatus.triggered, generatedAt: '2022-01-01T00:00:00Z' },
      ...alertEvents,
      { ...alertEvents[0], status: AlertEventStatus.resolved, generatedAt: '2022-01-01T01:00:00Z' },
    ]);
  });
});
