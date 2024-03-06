import { AlertEventStatus, NotificationEvent } from '@plentyag/core/src/types/environment';

export const mockNotificationEvents: NotificationEvent[] = [
  {
    alertEventIds: [],
    alertRuleId: 'b9ff2f27-c4b0-4ef8-bff0-568294897e47',
    createdAt: '2022-11-22T10:07:06Z',
    createdBy: 'observation-monitor-service',
    generatedAt: '2022-11-22T10:07:06Z',
    id: '529206b6-5a4f-4337-b2cf-ff2938bde1ee',
    metricId: 'f1542d33-c3cf-49a1-8fed-1b0318b6364a',
    status: AlertEventStatus.triggered,
    subscriptionId: 'b107cd5c-c018-4332-9064-aba436ab0bbd',
    updatedAt: '2022-11-22T10:07:06Z',
    updatedBy: 'observation-monitor-service',
  },
];
