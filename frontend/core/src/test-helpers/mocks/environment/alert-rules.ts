import { AlertRule, AlertRuleType, InterpolationType, Rule, Subscription } from '@plentyag/core/src/types/environment';
import { uuidv4 } from '@plentyag/core/src/utils/uuidv4';

export const mockAlertRules: AlertRule[] = [
  {
    alertRuleType: AlertRuleType.controlLimit,
    createdAt: '2021-09-27T14:56:42.964263Z',
    createdBy: 'llee',
    description: 'mock-description',
    endsAt: null,
    id: '7580f4fd-060b-4f54-979f-81061b39718c',
    isEnabled: true,
    metricId: 'd8e6719b-862e-42df-bef6-930d2cb5b3e6',
    priority: 1,
    rules: [
      {
        gte: 60.0,
        lte: 73.0,
        time: 3600,
      },
      {
        gte: 70.0,
        lte: 80.0,
        time: 7200,
      },
    ],
    interpolationType: InterpolationType.none,
    repeatInterval: 86400,
    noDataTimeout: null,
    durationWindowSize: null,
    durationWindowSizeResolve: null,
    snoozedUntil: null,
    startsAt: '2019-10-16T07:00:00Z',
    updatedAt: '2021-09-27T21:29:40.946275Z',
    updatedBy: 'llee',
    subscriptions: [],
    isStateless: false,
  },
  {
    alertRuleType: AlertRuleType.specLimit,
    createdAt: '2021-09-27T14:56:21.849354Z',
    createdBy: 'llee',
    description: null,
    endsAt: null,
    id: '90c305a6-2bcf-40fc-80c6-dc867734e8f6',
    isEnabled: true,
    metricId: 'd8e6719b-862e-42df-bef6-930d2cb5b3e6',
    priority: 1,
    rules: [
      {
        gte: 60.0,
        lte: 70.0,
        time: 26100,
      },
      {
        gte: 68.0,
        lte: 80.0,
        time: 37920,
      },
    ],

    interpolationType: InterpolationType.none,
    repeatInterval: 86400,
    noDataTimeout: null,
    durationWindowSize: null,
    durationWindowSizeResolve: null,
    snoozedUntil: null,
    startsAt: '2019-10-16T07:00:00Z',
    updatedAt: '2021-09-27T21:29:50.912514Z',
    updatedBy: 'llee',
    subscriptions: [],
    isStateless: false,
  },
  {
    alertRuleType: AlertRuleType.specLimitDevices,
    createdAt: '2021-09-27T14:56:21.849354Z',
    createdBy: 'llee',
    description: null,
    endsAt: null,
    id: 'f2b9cd58-305a-4eeb-9693-2ad4edd240a1',
    isEnabled: true,
    metricId: 'd8e6719b-862e-42df-bef6-930d2cb5b3e6',
    priority: 1,
    rules: [
      {
        gte: 60.0,
        lte: 70.0,
        time: 26100,
      },
      {
        gte: 68.0,
        lte: 80.0,
        time: 37920,
      },
    ],

    interpolationType: InterpolationType.none,
    repeatInterval: 86400,
    noDataTimeout: null,
    durationWindowSize: null,
    durationWindowSizeResolve: null,
    snoozedUntil: null,
    startsAt: '2019-10-16T07:00:00Z',
    updatedAt: '2021-09-27T21:29:50.912514Z',
    updatedBy: 'llee',
    subscriptions: [],
    isStateless: false,
  },
];

export interface BuildAlertRule {
  isEnabled?: boolean;
  snoozedUntil?: string;
  alertRuleType?: AlertRuleType;
  rules?: Rule[];
  subscriptions?: Subscription[];
  interpolationType?: InterpolationType;
  startsAt?: string;
}

export const buildAlertRule = ({
  startsAt = '2019-10-16T07:00:00Z',
  alertRuleType = AlertRuleType.controlLimit,
  isEnabled = true,
  snoozedUntil = null,
  subscriptions = [],
  rules,
  interpolationType = InterpolationType.none,
}: BuildAlertRule): AlertRule => {
  return {
    alertRuleType,
    createdAt: '2021-09-27T14:56:42.964263Z',
    createdBy: 'llee',
    description: 'mock-description',
    endsAt: null,
    id: uuidv4(),
    isEnabled,
    metricId: 'd8e6719b-862e-42df-bef6-930d2cb5b3e6',
    priority: 1,
    rules: rules ?? [
      {
        gte: 60.0,
        lte: 73.0,
        time: 3600,
      },
      {
        gte: 70.0,
        lte: 80.0,
        time: 7200,
      },
    ],
    interpolationType,
    repeatInterval: 86400,
    noDataTimeout: null,
    durationWindowSize: null,
    durationWindowSizeResolve: null,
    snoozedUntil,
    startsAt,
    updatedAt: '2021-09-27T21:29:40.946275Z',
    updatedBy: 'llee',
    subscriptions,
  };
};

export const mockNonNumericalAlertRules: AlertRule[] = [
  {
    alertRuleType: AlertRuleType.nonNumerical,
    createdAt: '2022-07-29T14:50:48Z',
    createdBy: 'drubio',
    description: 'mock-description',
    endsAt: null,
    id: 'b9f78826-30c7-40ad-8a2d-53489474b73d',
    isEnabled: true,
    metricId: 'e04e2ea9-66df-43a2-9e60-e92f4e0de528',
    priority: 1,
    rules: [
      {
        eq: 'mizuna',
        time: 0,
      },
      {
        contains: 'lettuce',
        time: 64800,
      },
    ],
    interpolationType: InterpolationType.none,
    repeatInterval: 86400,
    noDataTimeout: null,
    durationWindowSize: null,
    durationWindowSizeResolve: null,
    snoozedUntil: null,
    startsAt: '2022-06-01T12:00:00Z',
    updatedAt: '2022-12-14T13:15:17Z',
    updatedBy: 'drubio',
    subscriptions: [],
  },
];
