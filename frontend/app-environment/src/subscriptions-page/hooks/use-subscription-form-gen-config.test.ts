import { renderHook } from '@testing-library/react-hooks';

import { useSubscriptionFormGenConfig } from './use-subscription-form-gen-config';

const alertRuleId = 'id';
const username = 'username';

const values = {
  method: 'method',
  to: 'to',
  runbook: 'mockDescription',
  priority: 'priority',
};

describe('useSubscriptionFormGenConfig', () => {
  it('serializes a subscription', () => {
    const { result } = renderHook(() => useSubscriptionFormGenConfig({ alertRuleId, username }));

    expect(result.current.serialize(values)).toEqual({ ...values, alertRuleId, createdBy: username });

    expect(
      result.current.serialize({
        ...values,
        notificationThreshold: 10,
        notificationDuration: 60,
        notificationDistinctSource: true,
      })
    ).toEqual({
      ...values,
      alertRuleId,
      notificationThreshold: 10,
      notificationDuration: 3600,
      notificationDistinctSource: true,
      createdBy: username,
    });
  });

  it('deserializes a subscription', () => {
    const { result } = renderHook(() => useSubscriptionFormGenConfig({ alertRuleId, username }));

    expect(
      result.current.deserialize({
        ...values,
        notificationThreshold: 10,
        notificationDuration: 3600,
        notificationDistinctSource: true,
      })
    ).toEqual({
      ...values,
      notificationThreshold: 10,
      notificationDuration: 60,
      notificationDistinctSource: true,
    });

    expect(result.current.deserialize(values)).toEqual(values);
  });
});
