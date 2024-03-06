import { buildSubscription, mockAlertRules } from '@plentyag/app-environment/src/common/test-helpers';
import { SubscriptionMethod, SubscriptionMethodDisplay } from '@plentyag/core/src/types/environment';

import { getSubscriptionTypeLabels } from './get-subscription-type-labels';

const [alertRule1, alertRule2, alertRule3] = mockAlertRules;

const mockAlertRulesEmpty = [{ ...alertRule1, subscriptions: [] }];
const mockAlertRulesMultiSlack = [
  {
    ...alertRule2,
    subscriptions: [
      buildSubscription({ method: SubscriptionMethod.slack }),
      buildSubscription({ method: SubscriptionMethod.slack }),
    ],
  },
];
const mockAlertRulesMultiSlackAndOpsGenie = [
  {
    ...alertRule3,
    subscriptions: [
      buildSubscription({ method: SubscriptionMethod.slack }),
      buildSubscription({ method: SubscriptionMethod.opsGenie }),
      buildSubscription({ method: SubscriptionMethod.slack }),
      buildSubscription({ method: SubscriptionMethod.opsGenie }),
      buildSubscription({ method: SubscriptionMethod.opsGenie }),
    ],
  },
];
const mockAlertRulesSlack = [
  { ...alertRule1, subscriptions: [buildSubscription({ method: SubscriptionMethod.slack })] },
];
const mockAlertRulesSlackAndOpsGenie = [
  {
    ...alertRule2,
    subscriptions: [
      buildSubscription({ method: SubscriptionMethod.slack }),
      buildSubscription({ method: SubscriptionMethod.opsGenie }),
    ],
  },
];
const mockMultiAlertRulesMultiSlackAndOpsGenie = [
  {
    ...alertRule3,
    subscriptions: [
      buildSubscription({ method: SubscriptionMethod.slack }),
      buildSubscription({ method: SubscriptionMethod.opsGenie }),
      buildSubscription({ method: SubscriptionMethod.slack }),
      buildSubscription({ method: SubscriptionMethod.slack }),
    ],
  },
  {
    ...alertRule2,
    subscriptions: [
      buildSubscription({ method: SubscriptionMethod.slack }),
      buildSubscription({ method: SubscriptionMethod.opsGenie }),
      buildSubscription({ method: SubscriptionMethod.opsGenie }),
    ],
  },
  ,
  {
    ...alertRule2,
    subscriptions: [
      buildSubscription({ method: SubscriptionMethod.opsGenie }),
      buildSubscription({ method: SubscriptionMethod.opsGenie }),
      buildSubscription({ method: SubscriptionMethod.opsGenie }),
      buildSubscription({ method: SubscriptionMethod.slack }),
    ],
  },
];

describe('getSubscriptionTypeLabels', () => {
  it('returns an empty string', () => {
    expect(getSubscriptionTypeLabels(mockAlertRulesEmpty)).toBe('');
  });

  it('returns Slack (2)', () => {
    expect(getSubscriptionTypeLabels(mockAlertRulesMultiSlack)).toBe(
      `${SubscriptionMethodDisplay[SubscriptionMethod.slack]} (2)`
    );
  });

  it('returns Slack (2), Opsgenie (3)', () => {
    expect(getSubscriptionTypeLabels(mockAlertRulesMultiSlackAndOpsGenie)).toBe(
      `${SubscriptionMethodDisplay[SubscriptionMethod.slack]} (2), ${
        SubscriptionMethodDisplay[SubscriptionMethod.opsGenie]
      } (3)`
    );
  });

  it('returns Slack', () => {
    expect(getSubscriptionTypeLabels(mockAlertRulesSlack)).toBe(
      `${SubscriptionMethodDisplay[SubscriptionMethod.slack]}`
    );
  });

  it('returns Slack, Opsgenie', () => {
    expect(getSubscriptionTypeLabels(mockAlertRulesSlackAndOpsGenie)).toBe(
      `${SubscriptionMethodDisplay[SubscriptionMethod.slack]}, ${
        SubscriptionMethodDisplay[SubscriptionMethod.opsGenie]
      }`
    );
  });

  it('returns Slack (5), Opsgenie (6)', () => {
    expect(getSubscriptionTypeLabels(mockMultiAlertRulesMultiSlackAndOpsGenie)).toBe(
      `${SubscriptionMethodDisplay[SubscriptionMethod.slack]} (5), ${
        SubscriptionMethodDisplay[SubscriptionMethod.opsGenie]
      } (6)`
    );
  });
});
