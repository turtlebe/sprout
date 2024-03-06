import { AlertEventStatus } from '@plentyag/core/src/types/environment';

import { buildAlertEvent } from '../test-helpers';

import { dedupAlertEvents } from './dedup-alert-events';

describe('dedupAlertEvents', () => {
  it('removes consecutive triggered alert events', () => {
    const alertEvents = [
      buildAlertEvent({ status: AlertEventStatus.triggered, generatedAt: '2022-05-20T06:45:26Z' }),
      buildAlertEvent({ status: AlertEventStatus.triggered, generatedAt: '2022-05-20T07:00:21Z' }),
      buildAlertEvent({ status: AlertEventStatus.resolved, generatedAt: '2022-05-20T07:30:23Z' }),
    ];

    expect(dedupAlertEvents(alertEvents)).toEqual([alertEvents[0], ...alertEvents.slice(-1)]);
  });

  it('removes consecutive triggered alert events (3 in a row)', () => {
    const alertEvents = [
      buildAlertEvent({ status: AlertEventStatus.triggered, generatedAt: '2022-05-20T06:45:26Z' }),
      buildAlertEvent({ status: AlertEventStatus.triggered, generatedAt: '2022-05-20T06:48:21Z' }),
      buildAlertEvent({ status: AlertEventStatus.triggered, generatedAt: '2022-05-20T07:00:21Z' }),
      buildAlertEvent({ status: AlertEventStatus.resolved, generatedAt: '2022-05-20T07:30:23Z' }),
    ];

    expect(dedupAlertEvents(alertEvents)).toEqual([alertEvents[0], ...alertEvents.slice(-1)]);
  });

  it('removes consecutive triggered alert events (4 in a row)', () => {
    const alertEvents = [
      buildAlertEvent({ status: AlertEventStatus.triggered, generatedAt: '2022-05-20T06:45:26Z' }),
      buildAlertEvent({ status: AlertEventStatus.triggered, generatedAt: '2022-05-20T06:48:21Z' }),
      buildAlertEvent({ status: AlertEventStatus.triggered, generatedAt: '2022-05-20T06:50:21Z' }),
      buildAlertEvent({ status: AlertEventStatus.triggered, generatedAt: '2022-05-20T07:00:21Z' }),
      buildAlertEvent({ status: AlertEventStatus.resolved, generatedAt: '2022-05-20T07:30:23Z' }),
    ];

    expect(dedupAlertEvents(alertEvents)).toEqual([alertEvents[0], ...alertEvents.slice(-1)]);
  });

  it('removes consecutive resolved alert events', () => {
    const alertEvents = [
      buildAlertEvent({ status: AlertEventStatus.resolved, generatedAt: '2022-05-20T06:45:26Z' }),
      buildAlertEvent({ status: AlertEventStatus.resolved, generatedAt: '2022-05-20T07:00:21Z' }),
      buildAlertEvent({ status: AlertEventStatus.triggered, generatedAt: '2022-05-20T07:30:23Z' }),
    ];

    expect(dedupAlertEvents(alertEvents)).toEqual([alertEvents[0], ...alertEvents.slice(-1)]);
  });
});
