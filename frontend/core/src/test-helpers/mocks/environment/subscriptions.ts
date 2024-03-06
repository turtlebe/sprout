import {
  Subscription,
  SubscriptionMethod,
  SubscriptionNotificationType,
  SubscriptionPriority,
} from '@plentyag/core/src/types/environment';
import { uuidv4 } from '@plentyag/core/src/utils/uuidv4';

export const mockSubscriptions: Subscription[] = [
  {
    id: '85bffeec-bee0-46cf-aae7-9b2306f69f3b',
    createdAt: '2021-10-21T21:53:35.312249Z',
    updatedAt: '2021-10-21T21:53:35.312249Z',
    createdBy: 'gdebeaupuis',
    updatedBy: 'gdebeaupuis',
    subscribableId: '7580f4fd-060b-4f54-979f-81061b39718c',
    subscribableType: 'alert_rules',
    notificationType: SubscriptionNotificationType.default,
    method: SubscriptionMethod.slack,
    to: 'llee',
    priority: null,
    description: null,
  },
  {
    id: '346ae583-bfc2-49ca-bf79-c4564b1c8986',
    createdAt: '2021-10-21T21:36:24.753308Z',
    updatedAt: '2021-10-21T21:36:24.753308Z',
    createdBy: 'gdebeaupuis',
    updatedBy: 'gdebeaupuis',
    subscribableId: '7580f4fd-060b-4f54-979f-81061b39718c',
    subscribableType: 'alert_rules',
    notificationType: SubscriptionNotificationType.default,
    method: SubscriptionMethod.opsGenie,
    to: 'gdebeaupuis',
    priority: SubscriptionPriority.p1,
    description: 'mockDescription',
  },
];

export interface BuildSubscription {
  method: SubscriptionMethod;
}

export const buildSubscription = ({ method }: BuildSubscription): Subscription => {
  return {
    id: uuidv4(),
    createdAt: '2021-10-21T21:53:35.312249Z',
    updatedAt: '2021-10-21T21:53:35.312249Z',
    createdBy: 'gdebeaupuis',
    updatedBy: 'gdebeaupuis',
    subscribableId: '7580f4fd-060b-4f54-979f-81061b39718c',
    subscribableType: 'alert_rules',
    notificationType: SubscriptionNotificationType.default,
    method,
    to: 'llee',
    priority: null,
    description: null,
  };
};
