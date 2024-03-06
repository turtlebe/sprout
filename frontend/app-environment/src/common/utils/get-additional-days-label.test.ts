import { getAdditionalDaysLabel } from './get-additional-days-label';

describe('getAdditionalDaysLabel', () => {
  it('returns +0 day', () => {
    expect(getAdditionalDaysLabel(0)).toBe('+0 day');
  });

  it('returns +1 day', () => {
    expect(getAdditionalDaysLabel(1)).toBe('+1 day');
  });

  it('returns +2 days', () => {
    expect(getAdditionalDaysLabel(2)).toBe('+2 days');
  });
});
