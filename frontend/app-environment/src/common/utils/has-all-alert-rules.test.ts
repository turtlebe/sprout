import { mockAlertRules, mockMetrics } from '../test-helpers';

import { hasAllAlertRules } from './has-all-alert-rules';

const [metric] = mockMetrics;
const [specLimit, controlLimit, specLimitDevices] = mockAlertRules;

describe('hasAllAlertRules', () => {
  it('returns false', () => {
    expect(hasAllAlertRules(metric)).toBe(false);
    expect(hasAllAlertRules({ ...metric, alertRules: [specLimit] })).toBe(false);
    expect(hasAllAlertRules({ ...metric, alertRules: [specLimit, controlLimit] })).toBe(false);
    expect(hasAllAlertRules({ ...metric, alertRules: [specLimit, specLimitDevices] })).toBe(false);
  });

  it('returns true', () => {
    expect(hasAllAlertRules({ ...metric, alertRules: mockAlertRules })).toBe(true);
  });
});
