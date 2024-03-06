import { Observation } from '@plentyag/core/src/types';
import {
  AlertEvent,
  AlertEventStatus,
  AlertRule,
  AlertRuleType,
  InterpolationType,
} from '@plentyag/core/src/types/environment';
import { uuidv4 } from '@plentyag/core/src/utils/uuidv4';

export const mockAlertEvents: AlertEvent[] = [
  {
    id: 'af102dbb-018f-4a38-b5d6-4081fd57d473',
    createdAt: '2022-05-16T02:26:24.049420Z',
    updatedAt: '2022-05-16T02:26:24.049420Z',
    createdBy: 'observation-monitor-service',
    updatedBy: 'observation-monitor-service',
    alertRuleId: '845abf15-e422-455f-9159-2357ed63ae99',
    observationId: '',
    status: AlertEventStatus.resolved,
    generatedAt: '2022-05-15T01:30:56.205945Z',
    alertRule: {
      id: '845abf15-e422-455f-9159-2357ed63ae99',
      createdAt: '2022-03-03T19:28:20.058080Z',
      updatedAt: '2022-05-16T16:15:15.481183Z',
      createdBy: 'mmcbirney',
      updatedBy: 'gdebeaupuis',
      metricId: '09f2d004-8648-4e65-b3c8-b1f29e761908',
      metric: null,
      alertRuleType: AlertRuleType.specLimit,
      description: null,
      startsAt: '2022-03-13T12:00:00Z',
      endsAt: null,
      snoozedUntil: null,
      priority: 1,
      tags: [],
      rules: [
        { gte: 5.0, lte: 15.0, time: 1800 },
        { gte: 10.0, lte: 20.0, time: 48600 },
      ],
      repeatInterval: 86400,
      interpolationType: InterpolationType.none,
      noDataTimeout: null,
      durationWindowSize: null,
      durationWindowSizeResolve: null,
      isEnabled: true,
    },
  },
  {
    id: '5b5718db-15f1-4c05-9162-283e3d34cb5e',
    createdAt: '2022-05-16T02:27:34.808965Z',
    updatedAt: '2022-05-16T02:27:34.808965Z',
    createdBy: 'observation-monitor-service',
    updatedBy: 'observation-monitor-service',
    alertRuleId: '845abf15-e422-455f-9159-2357ed63ae99',
    observationId: '',
    status: AlertEventStatus.triggered,
    generatedAt: '2022-05-15T15:08:01.913427Z',
    alertRule: {
      id: '845abf15-e422-455f-9159-2357ed63ae99',
      createdAt: '2022-03-03T19:28:20.058080Z',
      updatedAt: '2022-05-16T16:15:15.481183Z',
      createdBy: 'mmcbirney',
      updatedBy: 'gdebeaupuis',
      metricId: '09f2d004-8648-4e65-b3c8-b1f29e761908',
      metric: null,
      alertRuleType: AlertRuleType.specLimit,
      description: null,
      startsAt: '2022-03-13T12:00:00Z',
      endsAt: null,
      snoozedUntil: null,
      priority: 1,
      tags: [],
      rules: [
        { gte: 5.0, lte: 15.0, time: 1800 },
        { gte: 10.0, lte: 20.0, time: 48600 },
      ],
      repeatInterval: 86400,
      interpolationType: InterpolationType.none,
      noDataTimeout: null,
      durationWindowSize: null,
      durationWindowSizeResolve: null,
      isEnabled: true,
    },
  },
  {
    id: '59d9da26-e9df-4ed9-91e3-05e8778e1291',
    createdAt: '2022-05-16T02:26:05.499747Z',
    updatedAt: '2022-05-16T02:26:05.499747Z',
    createdBy: 'observation-monitor-service',
    updatedBy: 'observation-monitor-service',
    alertRuleId: '845abf15-e422-455f-9159-2357ed63ae99',
    observationId: '',
    status: AlertEventStatus.resolved,
    generatedAt: '2022-05-16T01:31:03.925576Z',
    alertRule: {
      id: '845abf15-e422-455f-9159-2357ed63ae99',
      createdAt: '2022-03-03T19:28:20.058080Z',
      updatedAt: '2022-05-16T16:15:15.481183Z',
      createdBy: 'mmcbirney',
      updatedBy: 'gdebeaupuis',
      metricId: '09f2d004-8648-4e65-b3c8-b1f29e761908',
      metric: null,
      alertRuleType: AlertRuleType.specLimit,
      description: null,
      startsAt: '2022-03-13T12:00:00Z',
      endsAt: null,
      snoozedUntil: null,
      priority: 1,
      tags: [],
      rules: [
        { gte: 5.0, lte: 15.0, time: 1800 },
        { gte: 10.0, lte: 20.0, time: 48600 },
      ],
      repeatInterval: 86400,
      interpolationType: InterpolationType.none,
      noDataTimeout: null,
      durationWindowSize: null,
      durationWindowSizeResolve: null,
      isEnabled: true,
    },
  },
  {
    id: 'c2c096f7-fe67-41fa-8d4b-b01b174f1703',
    createdAt: '2022-05-16T15:20:51.042496Z',
    updatedAt: '2022-05-16T15:20:51.042496Z',
    createdBy: 'observation-monitor-service',
    updatedBy: 'observation-monitor-service',
    alertRuleId: '845abf15-e422-455f-9159-2357ed63ae99',
    observationId: '',
    status: AlertEventStatus.triggered,
    generatedAt: '2022-05-16T15:15:50.529090Z',
    alertRule: {
      id: '845abf15-e422-455f-9159-2357ed63ae99',
      createdAt: '2022-03-03T19:28:20.058080Z',
      updatedAt: '2022-05-16T16:15:15.481183Z',
      createdBy: 'mmcbirney',
      updatedBy: 'gdebeaupuis',
      metricId: '09f2d004-8648-4e65-b3c8-b1f29e761908',
      metric: null,
      alertRuleType: AlertRuleType.specLimit,
      description: null,
      startsAt: '2022-03-13T12:00:00Z',
      endsAt: null,
      snoozedUntil: null,
      priority: 1,
      tags: [],
      rules: [
        { gte: 5.0, lte: 15.0, time: 1800 },
        { gte: 10.0, lte: 20.0, time: 48600 },
      ],
      repeatInterval: 86400,
      interpolationType: InterpolationType.none,
      noDataTimeout: null,
      durationWindowSize: null,
      durationWindowSizeResolve: null,
      isEnabled: true,
    },
  },
  {
    id: 'e4ea78ca-60d7-42d7-b7fb-cf1952e44961',
    createdAt: '2022-05-17T01:36:02.925532Z',
    updatedAt: '2022-05-17T01:36:02.925532Z',
    createdBy: 'observation-monitor-service',
    updatedBy: 'observation-monitor-service',
    alertRuleId: '845abf15-e422-455f-9159-2357ed63ae99',
    observationId: '',
    status: AlertEventStatus.resolved,
    generatedAt: '2022-05-17T01:31:02.689199Z',
    alertRule: {
      id: '845abf15-e422-455f-9159-2357ed63ae99',
      createdAt: '2022-03-03T19:28:20.058080Z',
      updatedAt: '2022-05-16T16:15:15.481183Z',
      createdBy: 'mmcbirney',
      updatedBy: 'gdebeaupuis',
      metricId: '09f2d004-8648-4e65-b3c8-b1f29e761908',
      metric: null,
      alertRuleType: AlertRuleType.specLimit,
      description: null,
      startsAt: '2022-03-13T12:00:00Z',
      endsAt: null,
      snoozedUntil: null,
      priority: 1,
      tags: [],
      rules: [
        { gte: 5.0, lte: 15.0, time: 1800 },
        { gte: 10.0, lte: 20.0, time: 48600 },
      ],
      repeatInterval: 86400,
      interpolationType: InterpolationType.none,
      noDataTimeout: null,
      durationWindowSize: null,
      durationWindowSizeResolve: null,
      isEnabled: true,
    },
  },
  {
    id: 'd9cac6d1-015c-48c2-892d-c8286b1c5690',
    createdAt: '2022-05-17T15:31:51.594294Z',
    updatedAt: '2022-05-17T15:31:51.594294Z',
    createdBy: 'observation-monitor-service',
    updatedBy: 'observation-monitor-service',
    alertRuleId: '845abf15-e422-455f-9159-2357ed63ae99',
    observationId: '',
    status: AlertEventStatus.triggered,
    generatedAt: '2022-05-17T15:25:51.466995Z',
    alertRule: {
      id: '845abf15-e422-455f-9159-2357ed63ae99',
      createdAt: '2022-03-03T19:28:20.058080Z',
      updatedAt: '2022-05-16T16:15:15.481183Z',
      createdBy: 'mmcbirney',
      updatedBy: 'gdebeaupuis',
      metricId: '09f2d004-8648-4e65-b3c8-b1f29e761908',
      metric: null,
      alertRuleType: AlertRuleType.specLimit,
      description: null,
      startsAt: '2022-03-13T12:00:00Z',
      endsAt: null,
      snoozedUntil: null,
      priority: 1,
      tags: [],
      rules: [
        { gte: 5.0, lte: 15.0, time: 1800 },
        { gte: 10.0, lte: 20.0, time: 48600 },
      ],
      repeatInterval: 86400,
      interpolationType: InterpolationType.none,
      noDataTimeout: null,
      durationWindowSize: null,
      durationWindowSizeResolve: null,
      isEnabled: true,
    },
  },
];

export interface BuildAlertEvent {
  status: AlertEventStatus;
  generatedAt: string;
  alertRule?: AlertRule;
  observationData?: Observation[];
}

export function buildAlertEvent({ status, generatedAt, alertRule, observationData }: BuildAlertEvent): AlertEvent {
  return {
    id: uuidv4(),
    createdAt: '2022-05-17T15:31:51.594294Z',
    updatedAt: '2022-05-17T15:31:51.594294Z',
    createdBy: 'observation-monitor-service',
    updatedBy: 'observation-monitor-service',
    alertRuleId: alertRule?.id || uuidv4(),
    observationId: '',
    status,
    generatedAt,
    alertRule,
    observationData,
  };
}