import { ONE_DAY } from '@plentyag/app-environment/src/common/utils/constants';

import { getAdditionalDaysValue } from './get-additional-days-value';

describe('getAdditionalDaysValue', () => {
  it('returns 0', () => {
    expect(getAdditionalDaysValue({ time: 0 })).toBe(0);
    expect(getAdditionalDaysValue({ time: ONE_DAY - 1 })).toBe(0);
  });

  it('returns 1', () => {
    expect(getAdditionalDaysValue({ time: ONE_DAY })).toBe(1);
    expect(getAdditionalDaysValue({ time: ONE_DAY * 2 - 1 })).toBe(1);
  });

  it('returns 2', () => {
    expect(getAdditionalDaysValue({ time: ONE_DAY * 2 })).toBe(2);
    expect(getAdditionalDaysValue({ time: ONE_DAY * 3 - 1 })).toBe(2);
  });
});
