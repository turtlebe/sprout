import { buildAlertRule, buildMetric, buildSubscription } from '@plentyag/app-environment/src/common/test-helpers';
import { getAlertRuleTypeLabel, getAlertStateFromAlertRule } from '@plentyag/app-environment/src/common/utils';
import { SubscriptionMethod } from '@plentyag/core/src/types/environment';
import { render } from '@testing-library/react';
import moment from 'moment';
import React from 'react';

import { dataTestIdsMetricExpandedRow as dataTestIds, MetricExpandedRow } from '.';

const format = 'MM/DD/YYYY hh:mm A';

const metric = buildMetric({
  alertRules: [
    buildAlertRule({
      subscriptions: [buildSubscription({ method: SubscriptionMethod.opsGenie })],
    }),
    buildAlertRule({
      subscriptions: [
        buildSubscription({ method: SubscriptionMethod.slack }),
        buildSubscription({ method: SubscriptionMethod.opsGenie }),
      ],
    }),
  ],
});

describe('MetricExpandedRow', () => {
  it('renders details about each AlertRules and their Subscriptions', () => {
    const { queryByTestId } = render(<MetricExpandedRow metric={metric} />);

    function expectToHaveContent(selector, expectedContent) {
      expect(queryByTestId(selector)).toHaveTextContent(expectedContent);
    }

    metric.alertRules.forEach(alertRule => {
      expectToHaveContent(dataTestIds.alertRuleType(alertRule), getAlertRuleTypeLabel(alertRule.alertRuleType));
      expectToHaveContent(dataTestIds.alertRuleDescription(alertRule), alertRule.description);
      expectToHaveContent(dataTestIds.alertRuleStartsAt(alertRule), moment(alertRule.startsAt).format(format));
      expectToHaveContent(dataTestIds.alertRuleEndsAt(alertRule), moment(alertRule.endsAt).format(format));
      expectToHaveContent(dataTestIds.alertRuleStatus(alertRule), getAlertStateFromAlertRule(alertRule));
      expectToHaveContent(dataTestIds.alertRulePriority(alertRule), alertRule.priority.toString());
      expectToHaveContent(dataTestIds.alertRuleRepeatInterval(alertRule), alertRule.repeatInterval.toString());
      expectToHaveContent(dataTestIds.alertRuleLinearInterpolation(alertRule), alertRule.interpolationType);
      alertRule.subscriptions.forEach(subscription => {
        expectToHaveContent(
          dataTestIds.alertRuleSubscription(subscription),
          `${subscription.notificationType}/${subscription.method}`
        );
      });
    });
  });
});
