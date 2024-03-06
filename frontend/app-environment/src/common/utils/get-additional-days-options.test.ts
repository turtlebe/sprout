import { ONE_DAY } from './constants';
import { getAdditionalDaysOptions } from './get-additional-days-options';

describe('getAdditionalDaysOptions', () => {
  it('returns options for one interval', () => {
    const options = [{ label: '+0 day', value: 0 }];

    expect(getAdditionalDaysOptions(1)).toEqual(options);
    expect(getAdditionalDaysOptions(ONE_DAY)).toEqual(options);
    expect(getAdditionalDaysOptions(ONE_DAY - 1)).toEqual(options);
  });

  it('returns options for two intervals', () => {
    const options = [
      { label: '+0 day', value: 0 },
      { label: '+1 day', value: 1 },
    ];

    expect(getAdditionalDaysOptions(ONE_DAY + 1)).toEqual(options);
    expect(getAdditionalDaysOptions(ONE_DAY * 2)).toEqual(options);
    expect(getAdditionalDaysOptions(ONE_DAY * 2 - 1)).toEqual(options);
  });

  it('returns options for two intervals', () => {
    const options = [
      { label: '+0 day', value: 0 },
      { label: '+1 day', value: 1 },
      { label: '+2 days', value: 2 },
    ];

    expect(getAdditionalDaysOptions(ONE_DAY * 2 + 1)).toEqual(options);
    expect(getAdditionalDaysOptions(ONE_DAY * 3)).toEqual(options);
    expect(getAdditionalDaysOptions(ONE_DAY * 3 - 1)).toEqual(options);
  });
});
