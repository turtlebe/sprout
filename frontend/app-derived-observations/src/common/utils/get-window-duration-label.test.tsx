import { WindowDuration } from '@plentyag/core/src/types/derived-observations';

import { getWindowDurationLabel } from './get-window-duration-label';

describe('getWindowDurationLabel', () => {
  it('returns null', () => {
    expect(getWindowDurationLabel(null)).toBe(null);
    expect(getWindowDurationLabel(undefined)).toBe(null);
  });

  it('returns a label', () => {
    expect(getWindowDurationLabel(WindowDuration.oneMinute)).toBe('1 minute');
    expect(getWindowDurationLabel(WindowDuration.fiveMinutes)).toBe('5 minutes');
    expect(getWindowDurationLabel(WindowDuration.tenMinutes)).toBe('10 minutes');
    expect(getWindowDurationLabel(WindowDuration.fifteenMinutes)).toBe('15 minutes');
    expect(getWindowDurationLabel(WindowDuration.thirtyMinutes)).toBe('30 minutes');
    expect(getWindowDurationLabel(WindowDuration.sixtyMinutes)).toBe('60 minutes');
  });
});
