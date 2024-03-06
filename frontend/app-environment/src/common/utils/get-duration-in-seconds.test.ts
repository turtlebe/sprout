import { ONE_DAY } from '@plentyag/app-environment/src/common/utils/constants';
import moment from 'moment';

import { getDurationInSeconds } from '.';

describe('getDurationInSeconds', () => {
  it('returns the duration in seconds', () => {
    expect(getDurationInSeconds('2022-01-01T00:00:00Z', moment('2022-01-01T00:02:00Z').toDate(), 0)).toBe(120);
  });

  it('returns the duration in seconds and only consider the time', () => {
    // Here when we select 17:00 the regardless of the day, this correspond at the end of the interval since our interval
    // runs from 18:00 to 18:00
    expect(getDurationInSeconds('2022-01-01T18:00:00Z', moment('2022-01-10T17:00:00Z').toDate(), 0)).toBe(
      ONE_DAY - 3600
    );
  });

  it('handles additional days', () => {
    expect(getDurationInSeconds('2022-01-01T00:00:00Z', moment('2022-01-01T00:02:00Z').toDate(), 1)).toBe(
      ONE_DAY + 120
    );
    expect(getDurationInSeconds('2022-01-01T18:00:00Z', moment('2022-01-10T17:00:00Z').toDate(), 2)).toBe(
      ONE_DAY * 2 + (ONE_DAY - 3600)
    );
  });
});
