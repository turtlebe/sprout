import { AlertRule, Subscription, SubscriptionMethodDisplay } from '@plentyag/core/src/types/environment';

export function getSubscriptionTypeLabels(alertRules: AlertRule[]) {
  const subscriptionTypeMap = new Map<string, number>();

  alertRules.forEach((alertRule: AlertRule) => {
    if (alertRule.subscriptions) {
      alertRule.subscriptions.forEach((subscription: Subscription) => {
        if (subscription.method) {
          subscriptionTypeMap.set(
            SubscriptionMethodDisplay[subscription.method],
            (subscriptionTypeMap.get(SubscriptionMethodDisplay[subscription.method]) ?? 0) + 1
          );
        }
      });
    }
  });

  // Return with subscriptions in parenthesis e.g.(2), if count > 1
  return [...subscriptionTypeMap.entries()]
    .map(([key, value]: [string, number]) => {
      return value > 1 ? `${key} (${value})` : `${key}`;
    })
    .join(', ');
}
