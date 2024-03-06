import { getExecutiveServiceRequestUrl, REQUEST_ENDPOINT } from '.';

describe('getExecutiveServiceRequestUrl', () => {
  it('returns undefined', () => {
    expect(getExecutiveServiceRequestUrl(null)).toBeUndefined();
    expect(getExecutiveServiceRequestUrl(undefined)).toBeUndefined();
  });

  it('returns an URL ending by a path', () => {
    expect(getExecutiveServiceRequestUrl('sites/SSF2')).toBe(`${REQUEST_ENDPOINT}/sites/SSF2`);
  });
});
