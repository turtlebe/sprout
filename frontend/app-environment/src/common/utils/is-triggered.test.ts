import { AlertEventStatus } from '@plentyag/core/src/types/environment';

import { isTriggered } from './is-triggered';

describe('isTriggered', () => {
  it('returns true', () => {
    expect(isTriggered(AlertEventStatus.noDataTriggered)).toBe(true);
    expect(isTriggered(AlertEventStatus.triggered)).toBe(true);
  });

  it('returns false', () => {
    expect(isTriggered(AlertEventStatus.noDataResolved)).toBe(false);
    expect(isTriggered(AlertEventStatus.resolved)).toBe(false);
  });
});
