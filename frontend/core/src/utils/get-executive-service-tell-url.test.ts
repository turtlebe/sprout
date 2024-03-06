import { getExecutiveServiceTellUrl, TELL_ENDPOINT } from '.';

describe('getExecutiveServiceTellUrl', () => {
  it('returns undefined', () => {
    expect(getExecutiveServiceTellUrl(null)).toBeUndefined();
    expect(getExecutiveServiceTellUrl(undefined)).toBeUndefined();
  });

  it('returns an URL ending by a path', () => {
    expect(getExecutiveServiceTellUrl('sites/SSF2')).toBe(`${TELL_ENDPOINT}/sites/SSF2`);
  });
});
